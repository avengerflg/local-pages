<?php

namespace App\Actions\Chat;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class SendMessageAction
{
    /**
     * Send a message within an authorized conversation.
     *
     * @param  list<UploadedFile>  $attachments
     */
    public function execute(User $user, int $conversationId, ?string $body, array $attachments = []): Message
    {
        $conversation = Conversation::find($conversationId);

        if (! $conversation) {
            abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
        }

        $this->authorizeParticipant($user, $conversation);

        return DB::transaction(function () use ($user, $conversation, $body, $attachments) {
            $hasAttachments = ! empty($attachments);
            $hasBody = ! empty($body);

            $messageType = 'text';
            if ($hasAttachments && ! $hasBody) {
                // If only files, determine message_type
                $firstFile = $attachments[0];
                $mime = $firstFile->getClientMimeType() ?: $firstFile->getMimeType() ?: '';
                $messageType = str_starts_with($mime, 'image/') ? 'image' : 'document';
            }

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
                'body' => $body,
                'message_type' => $messageType,
                'sent_at' => now(),
            ]);

            foreach ($attachments as $file) {
                if ($file instanceof UploadedFile) {
                    $storedPath = $file->store('chat-attachments', 'public');

                    MessageAttachment::create([
                        'message_id' => $message->id,
                        'file_path' => $storedPath,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getClientMimeType() ?: $file->getMimeType() ?: 'application/octet-stream',
                        'file_size' => $file->getSize() ?: 0,
                    ]);
                }
            }

            $conversation->update([
                'last_message_at' => now(),
            ]);

            return $message->loadMissing(['sender', 'attachments']);
        });
    }

    /**
     * Authorize that the user is an active participant in the conversation.
     */
    protected function authorizeParticipant(User $user, Conversation $conversation): void
    {
        if ($user->role === 'customer') {
            if ($conversation->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
            }
        } elseif ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile || $conversation->tradie_id !== $tradieProfile->id) {
                abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
            }
        } else {
            abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
        }
    }
}
