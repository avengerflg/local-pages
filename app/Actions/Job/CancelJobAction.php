<?php

namespace App\Actions\Job;

use App\Actions\Notification\CreateNotificationAction;
use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CancelJobAction
{
    public function __construct(
        protected CreateNotificationAction $createNotificationAction,
    ) {}

    public function execute(User $user, int $jobId): Job
    {
        return DB::transaction(function () use ($user, $jobId) {
            $job = Job::where('id', $jobId)->lockForUpdate()->first();

            if (! $job) {
                abort(Response::HTTP_NOT_FOUND, 'Job not found.');
            }

            // Authorization
            $job->loadMissing('serviceRequest.customer');

            $isCustomer = $job->serviceRequest->customer_id === $user->id;
            $isTradie = $user->tradieProfile && $job->tradie_id === $user->tradieProfile->id;
            $isAdmin = $user->role === 'admin';

            if (! $isCustomer && ! $isTradie && ! $isAdmin) {
                abort(Response::HTTP_FORBIDDEN, 'You are not authorized to cancel this job.');
            }

            if ($job->status !== 'scheduled') {
                abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'Only scheduled jobs can be cancelled.');
            }

            // Perform cancellation
            $job->update(['status' => 'cancelled']);

            if ($job->appointment_id) {
                $job->appointment?->update(['status' => 'cancelled']);
            }

            $job->serviceRequest->update(['status' => 'cancelled']);

            // Notify
            $job->loadMissing(['tradieProfile.user']);

            if ($isCustomer || $isAdmin) {
                if ($job->tradieProfile?->user) {
                    $this->createNotificationAction->execute(
                        recipient: $job->tradieProfile->user,
                        type: 'appointment_cancelled',
                        title: 'Job Cancelled',
                        body: 'A scheduled job has been cancelled.',
                        data: ['job_id' => $job->id]
                    );
                }
            }

            if ($isTradie || $isAdmin) {
                if ($job->serviceRequest?->customer) {
                    $this->createNotificationAction->execute(
                        recipient: $job->serviceRequest->customer,
                        type: 'appointment_cancelled',
                        title: 'Job Cancelled',
                        body: 'A scheduled job has been cancelled.',
                        data: ['job_id' => $job->id]
                    );
                }
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
