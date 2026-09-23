<?php

namespace App\Actions\Review;

use App\Models\Review;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class AdminApproveReviewAction
{
    /**
     * Approve a pending review, making it publicly visible.
     * Sets moderation_status to `approved` and records `published_at`.
     * Reviews in non-pending states cannot be re-approved.
     */
    public function execute(int $reviewId): Review
    {
        $review = Review::find($reviewId);

        if (! $review) {
            abort(Response::HTTP_NOT_FOUND, 'Review not found.');
        }

        if ($review->moderation_status !== 'pending') {
            throw ValidationException::withMessages([
                'moderation_status' => ['Only pending reviews can be approved.'],
            ]);
        }

        $review->update([
            'moderation_status' => 'approved',
            'published_at' => now(),
        ]);

        return $review->loadMissing(['customer', 'tradieProfile', 'response']);
    }
}
