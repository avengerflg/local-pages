<?php

namespace App\Actions\Job;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class CompleteJobAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    /**
     * Mark an in-progress job as completed (tradie only).
     */
    public function execute(User $user, int $jobId): Job
    {
        $tradieProfile = $user->tradieProfile;

        if (! $tradieProfile) {
            abort(Response::HTTP_FORBIDDEN, 'User does not have a tradie profile.');
        }

        return DB::transaction(function () use ($tradieProfile, $jobId) {
            $job = Job::where('id', $jobId)
                ->lockForUpdate()
                ->first();

            if (! $job || $job->tradie_id !== $tradieProfile->id) {
                abort(Response::HTTP_NOT_FOUND, 'Job not found.');
            }

            if ($job->status !== 'in_progress') {
                throw ValidationException::withMessages([
                    'status' => ['Only in-progress jobs can be completed.'],
                ]);
            }

            $job->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            if ($job->appointment_id) {
                $job->appointment?->update([
                    'status' => 'completed',
                ]);
            }

            $job->serviceRequest->update([
                'status' => 'completed',
            ]);

            // Notify the customer that the job has been completed.
            // customer_id is derived from serviceRequest; never from client input.
            $job->loadMissing('serviceRequest.customer');
            $customer = $job->serviceRequest?->customer;

            if ($customer) {
                $this->createNotificationAction->execute(
                    recipient: $customer,
                    type: 'job_completed',
                    title: 'Your job has been completed',
                    body: 'The tradie has marked your job as complete. You can now leave a review.',
                    data: [
                        'job_id' => $job->id,
                        'service_request_id' => $job->request_id,
                    ]
                );
            }

            return $job->loadMissing([
                'serviceRequest.service',
                'serviceRequest.location',
                'appointment',
                'tradieProfile',
            ]);
        });
    }
}
