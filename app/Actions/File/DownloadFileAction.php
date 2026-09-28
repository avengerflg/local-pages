<?php

namespace App\Actions\File;

use App\Models\MessageAttachment;
use App\Models\QuoteAttachment;
use App\Models\RequestAttachment;
use App\Models\TradieDocument;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DownloadFileAction
{
    /**
     * Download an attachment securely.
     */
    public function execute(User $user, string $type, int $id): StreamedResponse
    {
        switch ($type) {
            case 'tradie_documents':
                return $this->downloadTradieDocument($user, $id);
            case 'request_attachments':
                return $this->downloadRequestAttachment($user, $id);
            case 'message_attachments':
                return $this->downloadMessageAttachment($user, $id);
            case 'quote_attachments':
                return $this->downloadQuoteAttachment($user, $id);
            default:
                throw new NotFoundHttpException('Invalid file type.');
        }
    }

    protected function downloadTradieDocument(User $user, int $id): StreamedResponse
    {
        $document = TradieDocument::findOrFail($id);

        if ($user->role !== 'admin') {
            if ($user->role !== 'tradie' || ! $user->tradieProfile || $user->tradieProfile->id !== $document->tradie_id) {
                throw new HttpException(403, 'Unauthorized to access this document.');
            }
        }

        return $this->streamFile($document->file_path, $document->original_name, $document->mime_type);
    }

    protected function downloadRequestAttachment(User $user, int $id): StreamedResponse
    {
        $attachment = RequestAttachment::with('serviceRequest.requestTradies')->findOrFail($id);
        $request = $attachment->serviceRequest;

        $allowed = false;
        if ($user->role === 'admin') {
            $allowed = true;
        } elseif ($user->role === 'customer' && $request->customer_id === $user->id) {
            $allowed = true;
        } elseif ($user->role === 'tradie' && $user->tradieProfile) {
            $selectedTradie = $request->requestTradies->firstWhere('tradie_id', $user->tradieProfile->id);
            if ($selectedTradie && $selectedTradie->status === 'selected') {
                $allowed = true;
            }
        }

        if (! $allowed) {
            throw new HttpException(403, 'Unauthorized to access this attachment.');
        }

        // Support files that were uploaded to public or local disk by checking which exists.
        $disk = Storage::disk('local')->exists($attachment->file_path) ? 'local' : 'public';

        return $this->streamFile($attachment->file_path, $attachment->original_name, $attachment->mime_type, $disk);
    }

    protected function downloadMessageAttachment(User $user, int $id): StreamedResponse
    {
        $attachment = MessageAttachment::with('message.conversation')->findOrFail($id);
        $conversation = $attachment->message->conversation;

        $isParticipant = false;
        if ($conversation->customer_id === $user->id) {
            $isParticipant = true;
        } elseif ($user->tradieProfile && $conversation->tradie_id === $user->tradieProfile->id) {
            $isParticipant = true;
        }

        if (! $isParticipant && $user->role !== 'admin') {
            throw new HttpException(403, 'Unauthorized to access this attachment.');
        }

        return $this->streamFile($attachment->file_path, $attachment->original_name, $attachment->mime_type);
    }

    protected function downloadQuoteAttachment(User $user, int $id): StreamedResponse
    {
        $attachment = QuoteAttachment::with('quote.serviceRequest')->findOrFail($id);
        $quote = $attachment->quote;

        $allowed = false;
        if ($user->role === 'admin') {
            $allowed = true;
        } elseif ($user->role === 'tradie' && $user->tradieProfile && $user->tradieProfile->id === $quote->tradie_id) {
            $allowed = true;
        } elseif ($user->role === 'customer' && $quote->serviceRequest->customer_id === $user->id) {
            $allowed = true;
        }

        if (! $allowed) {
            throw new HttpException(403, 'Unauthorized to access this attachment.');
        }

        return $this->streamFile($attachment->file_path, $attachment->original_name, $attachment->mime_type);
    }

    protected function streamFile(string $path, string $name, string $mimeType, string $disk = 'local'): StreamedResponse
    {
        if (! Storage::disk($disk)->exists($path)) {
            throw new NotFoundHttpException('File not found on storage.');
        }

        return Storage::disk($disk)->response($path, $name, ['Content-Type' => $mimeType]);
    }
}
