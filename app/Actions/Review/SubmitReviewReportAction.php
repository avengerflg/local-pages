<?php

namespace App\Actions\Review;

use App\Models\Review;
use App\Models\ReviewReport;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SubmitReviewReportAction
{
    /**
     * Submit a new review report.
     */
    public function execute(User $user, int $reviewId, array $data): ReviewReport
    {
        $review = Review::findOrFail($reviewId);

        // Check for duplicate report by this user on this review
        $exists = ReviewReport::where('review_id', $reviewId)
            ->where('reporter_id', $user->id)
            ->exists();

        if ($exists) {
            throw new HttpException(422, 'You have already reported this review.');
        }

        return DB::transaction(function () use ($user, $reviewId, $data) {
            $report = new ReviewReport;
            $report->review_id = $reviewId;
            $report->reporter_id = $user->id;
            $report->reason = $data['reason'];
            $report->status = 'pending';
            $report->save();

            return $report;
        });
    }
}
