<?php

namespace App\Actions\Quote;

use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class RejectQuoteAction
{
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

            return $quote->loadMissing([
                'serviceRequest.service',
                'serviceRequest.location',
                'tradieProfile',
                'attachments',
            ]);
        });
    }
}
