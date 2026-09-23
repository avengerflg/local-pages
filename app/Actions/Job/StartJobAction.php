<?php

namespace App\Actions\Job;

use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class StartJobAction
{
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

            return $job->loadMissing([
                'serviceRequest.service',
                'serviceRequest.location',
                'appointment',
                'tradieProfile',
            ]);
        });
    }
}
