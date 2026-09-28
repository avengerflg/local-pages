<?php

namespace App\Actions\Review;

use App\Models\AuditLog;
use App\Models\ReviewReport;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AdminResolveReviewReportAction
{
    /**
     * Admin resolve a review report.
     */
    public function execute(User $admin, int $id, array $data): ReviewReport
    {
        return DB::transaction(function () use ($admin, $id, $data) {
            $report = ReviewReport::where('id', $id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($report->status !== 'pending') {
                throw new HttpException(422, 'This report has already been resolved.');
            }

            $report->status = 'resolved';
            $report->resolved_by = $admin->id;
            $report->resolved_at = now();
            $report->save();

            $review = $report->review;

            if ($data['resolution'] === 'uphold') {
                $review->moderation_status = 'rejected';
                $review->removed_at = now();
                $review->save();
            }

            // Create Audit Log
            AuditLog::create([
                'actor_id' => $admin->id,
                'action' => 'review_report_resolved',
                'entity_type' => ReviewReport::class,
                'entity_id' => $report->id,
                'new_values' => [
                    'resolution' => $data['resolution'],
                    'review_id' => $review->id,
                ],
            ]);

            return $report;
        });
    }
}
