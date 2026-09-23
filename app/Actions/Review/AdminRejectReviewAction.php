<?php

namespace App\Actions\Review;

use App\Models\Review;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class AdminRejectReviewAction
{
    /**
     * Reject/remove a pending review.
     * Sets moderation_status to `rejected` and records `removed_at`.
     * Reviews are soft-removed (not hard-deleted) per the schema design.
     * Only pending or flagged reviews can be rejected.
     */
    public function execute(int $reviewId): Review
    {
        $review = Review::find($reviewId);

        if (! $review) {
            abort(Response::HTTP_NOT_FOUND, 'Review not found.');
        }

        // Allow rejection from pending or flagged states.
        if (! in_array($review->moderation_status, ['pending', 'flagged'], true)) {
            throw ValidationException::withMessages([
                'moderation_status' => ['Only pending or flagged reviews can be rejected.'],
            ]);
        }

        $review->update([
            'moderation_status' => 'rejected',
            'removed_at' => now(),
        ]);

        return $review->loadMissing(['customer', 'tradieProfile', 'response']);
    }
}
