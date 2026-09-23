<?php

namespace App\Actions\Job;

use App\Models\Job;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class GetJobDetailAction
{
    /**
     * Retrieve job details for an authorized tradie or customer.
     */
    public function execute(User $user, int $jobId): Job
    {
        $job = Job::with([
            'serviceRequest.service',
            'serviceRequest.location',
            'appointment',
            'tradieProfile',
        ])->find($jobId);

        if (! $job) {
            abort(Response::HTTP_NOT_FOUND, 'Job not found.');
        }

        $this->authorizeParticipant($user, $job);

        return $job;
    }

    /**
     * Authorize that the user is the assigned tradie or the request customer.
     */
    protected function authorizeParticipant(User $user, Job $job): void
    {
        if ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile || $job->tradie_id !== $tradieProfile->id) {
                abort(Response::HTTP_NOT_FOUND, 'Job not found.');
            }
        } elseif ($user->role === 'customer') {
            if ($job->serviceRequest->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Job not found.');
            }
        } else {
            abort(Response::HTTP_NOT_FOUND, 'Job not found.');
        }
    }
}
