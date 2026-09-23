<?php

namespace App\Actions\Quote;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\Quote;
use App\Models\QuoteAttachment;
use App\Models\RequestTradie;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class CreateQuoteAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    /**
     * Submit a quote for an authorized service request.
     *
     * @param  array<string, mixed>  $data
     * @param  list<UploadedFile>  $attachments
     */
    public function execute(User $user, int $requestId, array $data, array $attachments = []): Quote
    {
        $tradieProfile = $user->tradieProfile;

        if (! $tradieProfile) {
            abort(Response::HTTP_FORBIDDEN, 'User does not have a tradie profile.');
        }

        $serviceRequest = ServiceRequest::find($requestId);

        if (! $serviceRequest) {
            abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
        }

        // Verify tradie is assigned via request_tradies
        $isAssigned = RequestTradie::where('request_id', $requestId)
            ->where('tradie_id', $tradieProfile->id)
            ->exists();

        if (! $isAssigned) {
            abort(Response::HTTP_NOT_FOUND, 'Lead not found for this tradie.');
        }

        // Verify request is eligible for quoting
        $eligibleStatuses = ['submitted', 'matching', 'quoting'];
        if (! in_array($serviceRequest->status, $eligibleStatuses, true)) {
            throw ValidationException::withMessages([
                'request_id' => ['This service request is no longer accepting quotes.'],
            ]);
        }

        $uploadedPaths = [];

        try {
            return DB::transaction(function () use ($serviceRequest, $tradieProfile, $data, $attachments, &$uploadedPaths) {
                $quote = Quote::create([
                    'request_id' => $serviceRequest->id,
                    'tradie_id' => $tradieProfile->id,
                    'amount' => $data['amount'],
                    'description' => $data['description'],
                    'valid_until' => $data['valid_until'] ?? null,
                    'terms_notes' => $data['terms_notes'] ?? null,
                    'estimated_duration' => $data['estimated_duration'] ?? null,
                    'proposed_date' => $data['proposed_date'] ?? null,
                    'status' => 'pending',
                ]);

                foreach ($attachments as $file) {
                    if ($file instanceof UploadedFile) {
                        $storedPath = $file->store('quote-attachments', 'local');
                        $uploadedPaths[] = $storedPath;

                        QuoteAttachment::create([
                            'quote_id' => $quote->id,
                            'file_path' => $storedPath,
                            'original_name' => $file->getClientOriginalName(),
                            'mime_type' => $file->getClientMimeType() ?: $file->getMimeType() ?: 'application/octet-stream',
                            'file_size' => $file->getSize() ?: 0,
                        ]);
                    }
                }

                // If request was submitted/matching, transition to quoting
                if (in_array($serviceRequest->status, ['submitted', 'matching'], true)) {
                    $serviceRequest->update(['status' => 'quoting']);
                }

                // Notify the customer who owns the service request about the new quote.
                // customer_id is derived from serviceRequest; never from client input.
                $serviceRequest->loadMissing('customer');
                if ($serviceRequest->customer) {
                    $this->createNotificationAction->execute(
                        recipient: $serviceRequest->customer,
                        type: 'new_quote',
                        title: 'You have received a new quote',
                        body: 'A tradie has submitted a quote for your service request.',
                        data: [
                            'quote_id' => $quote->id,
                            'service_request_id' => $serviceRequest->id,
                        ]
                    );
                }

                return $quote->loadMissing([
                    'serviceRequest.service',
                    'serviceRequest.location',
                    'tradieProfile',
                    'attachments',
                ]);
            });
        } catch (\Throwable $e) {
            foreach ($uploadedPaths as $path) {
                Storage::disk('local')->delete($path);
            }

            throw $e;
        }
    }
}
