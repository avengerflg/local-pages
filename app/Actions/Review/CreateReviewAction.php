<?php

namespace App\Actions\Review;

use App\Models\Job;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class CreateReviewAction
{
    /**
     * Create a review for a completed job owned by the authenticated customer.
     *
     * - job must exist and belong to the customer
     * - job must be in `completed` status
     * - job must have an assigned tradie
     * - no existing review for this job (enforced by DB unique + lockForUpdate)
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, int $jobId, array $data): Review
    {
        return DB::transaction(function () use ($user, $jobId, $data) {
            // Lock the job row to prevent race-condition duplicate submissions.
            $job = Job::where('id', $jobId)
                ->lockForUpdate()
                ->first();

            if (! $job) {
                abort(Response::HTTP_NOT_FOUND, 'Job not found.');
            }

            // Derive the owning customer from the service request; do not trust client input.
            $job->loadMissing('serviceRequest');

            if (! $job->serviceRequest || $job->serviceRequest->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Job not found.');
            }

            if ($job->status !== 'completed') {
                throw ValidationException::withMessages([
                    'job_id' => ['Reviews can only be submitted for completed jobs.'],
                ]);
            }

            if (! $job->tradie_id) {
                throw ValidationException::withMessages([
                    'job_id' => ['This job does not have an assigned tradie.'],
                ]);
            }

            // Check for an existing review; the DB unique constraint on job_id is the ultimate
            // safeguard, but we return a clean 422 rather than a raw constraint exception.
            $alreadyReviewed = Review::where('job_id', $jobId)->exists();
            if ($alreadyReviewed) {
                throw ValidationException::withMessages([
                    'job_id' => ['A review has already been submitted for this job.'],
                ]);
            }

            $review = Review::create([
                'job_id' => $job->id,
                // customer_id and tradie_id are derived server-side, never from client input.
                'customer_id' => $user->id,
                'tradie_id' => $job->tradie_id,
                'rating' => $data['rating'],
                'review_text' => $data['review_text'],
                'moderation_status' => 'pending',
            ]);

            return $review->loadMissing([
                'customer',
                'tradieProfile',
                'response',
            ]);
        });
    }
}
