<?php

namespace App\Actions\Review;

use App\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminGetPendingReviewsAction
{
    /**
     * Retrieve all reviews in `pending` moderation status for admin review.
     * Returns paginated results ordered by creation date (oldest first, to process in FIFO order).
     */
    public function execute(int $perPage = 20): LengthAwarePaginator
    {
        return Review::where('moderation_status', 'pending')
            ->with(['customer', 'tradieProfile', 'response'])
            ->oldest()
            ->paginate($perPage);
    }
}
