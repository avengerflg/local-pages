<?php

namespace App\Actions\Job;

use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class CompleteJobAction
{
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

            return $job->loadMissing([
                'serviceRequest.service',
                'serviceRequest.location',
                'appointment',
                'tradieProfile',
            ]);
        });
    }
}
