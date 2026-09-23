<?php

namespace App\Actions\Quote;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class AcceptQuoteAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    /**
     * Accept a quote and atomically reject remaining pending quotes.
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

            $serviceRequest = ServiceRequest::where('id', $quote->request_id)
                ->lockForUpdate()
                ->first();

            if (! $serviceRequest) {
                abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
            }

            if ($serviceRequest->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
            }

            // Check if any quote is already accepted or request is already quote_accepted
            $alreadyAccepted = Quote::where('request_id', $serviceRequest->id)
                ->where('status', 'accepted')
                ->exists();

            if ($alreadyAccepted || $serviceRequest->status === 'quote_accepted') {
                throw ValidationException::withMessages([
                    'quote' => ['A quote has already been accepted for this service request.'],
                ]);
            }

            // Quote must be pending
            if ($quote->status !== 'pending') {
                throw ValidationException::withMessages([
                    'quote' => ['Only pending quotes can be accepted.'],
                ]);
            }

            // Accept chosen quote
            $quote->update([
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            // Reject all other pending quotes for this request
            Quote::where('request_id', $serviceRequest->id)
                ->where('id', '!=', $quote->id)
                ->where('status', 'pending')
                ->update([
                    'status' => 'rejected',
                    'rejected_at' => now(),
                ]);

            // Update service request status
            $serviceRequest->update([
                'status' => 'quote_accepted',
            ]);

            // Notify the tradie whose quote was accepted.
            // tradie_id is derived from the quote model; never from client input.
            // OPEN: Automatically-rejected tradies are NOT notified here;
            //       this behavior is undefined and reserved for future specification.
            $quote->loadMissing('tradieProfile.user');
            $tradieUser = $quote->tradieProfile?->user;

            if ($tradieUser) {
                $this->createNotificationAction->execute(
                    recipient: $tradieUser,
                    type: 'quote_accepted',
                    title: 'Your quote has been accepted',
                    body: 'A customer has accepted your quote. Please proceed to schedule an appointment.',
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
    }
}
