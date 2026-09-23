<?php

namespace App\Actions\Job;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class StartJobAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    /**
     * Start a scheduled job and transition request to in_progress (tradie only).
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

            if ($job->status !== 'scheduled') {
                throw ValidationException::withMessages([
                    'status' => ['Only scheduled jobs can be started.'],
                ]);
            }

            $job->update([
                'status' => 'in_progress',
                'started_at' => now(),
            ]);

            $job->serviceRequest->update([
                'status' => 'in_progress',
            ]);

            // Notify the customer that the tradie has started the job.
            // customer_id is derived from serviceRequest; never from client input.
            $job->loadMissing('serviceRequest.customer');
            $customer = $job->serviceRequest?->customer;

            if ($customer) {
                $this->createNotificationAction->execute(
                    recipient: $customer,
                    type: 'job_started',
                    title: 'Your job has started',
                    body: 'The tradie has started work on your service request.',
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
