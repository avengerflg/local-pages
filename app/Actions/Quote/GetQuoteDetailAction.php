<?php

namespace App\Actions\Quote;

use App\Models\Quote;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class GetQuoteDetailAction
{
    /**
     * Retrieve quote details for an authorized participant.
     */
    public function execute(User $user, int $quoteId): Quote
    {
        $quote = Quote::with([
            'serviceRequest.service',
            'serviceRequest.location',
            'tradieProfile',
            'attachments',
        ])->find($quoteId);

        if (! $quote) {
            abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
        }

        $this->authorizeParticipant($user, $quote);

        return $quote;
    }

    /**
     * Authorize that the user owns the service request or issued the quote.
     */
    protected function authorizeParticipant(User $user, Quote $quote): void
    {
        if ($user->role === 'customer') {
            if ($quote->serviceRequest->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
            }
        } elseif ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile || $quote->tradie_id !== $tradieProfile->id) {
                abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
            }
        } else {
            abort(Response::HTTP_NOT_FOUND, 'Quote not found.');
        }
    }
}
