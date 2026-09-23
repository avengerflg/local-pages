<?php

namespace App\Actions\Review;

use App\Actions\Admin\LogAuditAction;
use App\Actions\Notification\CreateNotificationAction;
use App\Models\Review;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class AdminApproveReviewAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
        protected LogAuditAction $logAuditAction
    ) {}

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

        $oldStatus = $review->moderation_status;

        $review->update([
            'moderation_status' => 'approved',
            'published_at' => now(),
        ]);

        if (auth()->check()) {
            $this->logAuditAction->execute(
                actor: auth()->user(),
                action: 'review.approved',
                entityType: 'reviews',
                entityId: $review->id,
                oldValues: ['moderation_status' => $oldStatus],
                newValues: ['moderation_status' => 'approved']
            );
        }

        $review->loadMissing(['customer', 'tradieProfile', 'response']);

        // Notify the tradie that a review on their profile has been approved and published.
        if ($review->tradieProfile && $review->tradieProfile->user_id) {
            $this->createNotificationAction->execute(
                recipient: $review->tradieProfile->user_id,
                type: 'review_approved',
                title: 'Review Approved',
                body: 'A customer review on your profile has been approved and published.',
                data: [
                    'review_id' => $review->id,
                    'job_id' => $review->job_id,
                ]
            );
        }

        return $review;
    }
}
