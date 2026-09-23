<?php

namespace App\Actions\Quote;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class RejectQuoteAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    /**
     * Reject an individual pending quote.
     */
    public function execute(User $user, int $quoteId): Quote
    {
        return DB::transaction(function () use ($user, $quoteId) {
            $quote = Quote::where('id', $quoteId)
                ->lockForUpdate()
                ->first();

            if (! $quote) {
                abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
            }

            $serviceRequest = ServiceRequest::find($quote->request_id);

            if (! $serviceRequest || $serviceRequest->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
            }

            if ($quote->status !== 'pending') {
                throw ValidationException::withMessages([
                    'quote' => ['Only pending quotes can be rejected.'],
                ]);
            }

            $quote->update([
                'status' => 'rejected',
                'rejected_at' => now(),
            ]);

            // Notify the tradie whose quote was rejected.
            // tradie_id is derived from the quote model; never from client input.
            $quote->loadMissing('tradieProfile.user');
            $tradieUser = $quote->tradieProfile?->user;

            if ($tradieUser) {
                $this->createNotificationAction->execute(
                    recipient: $tradieUser,
                    type: 'quote_rejected',
                    title: 'Your quote has been declined',
                    body: 'A customer has declined your quote for their service request.',
                    data: [
                        'quote_id' => $quote->id,
                        'service_request_id' => $quote->request_id,
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
    }
}
