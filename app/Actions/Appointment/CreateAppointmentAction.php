<?php

namespace App\Actions\Appointment;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class CreateAppointmentAction
{
    /**
     * Schedule an appointment for a service request with an accepted quote.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, int $requestId, array $data): Appointment
    {
        return DB::transaction(function () use ($user, $requestId, $data) {
            $serviceRequest = ServiceRequest::where('id', $requestId)
                ->lockForUpdate()
                ->first();

            if (! $serviceRequest) {
                abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
            }

            if ($serviceRequest->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
            }

            if ($serviceRequest->status !== 'quote_accepted') {
                throw ValidationException::withMessages([
                    'request_id' => ['An appointment can only be scheduled once a quote has been accepted.'],
                ]);
            }

            // Find the accepted quote
            $acceptedQuote = Quote::where('request_id', $serviceRequest->id)
                ->where('status', 'accepted')
                ->first();

            if (! $acceptedQuote) {
                throw ValidationException::withMessages([
                    'quote_id' => ['No accepted quote found for this service request.'],
                ]);
            }

            // Check if an appointment already exists
            $existingAppointment = Appointment::where('request_id', $serviceRequest->id)
                ->whereIn('status', ['scheduled', 'rescheduled', 'completed'])
                ->exists();

            if ($existingAppointment) {
                throw ValidationException::withMessages([
                    'appointment' => ['An appointment has already been scheduled for this service request.'],
                ]);
            }

            $appointment = Appointment::create([
                'request_id' => $serviceRequest->id,
                'quote_id' => $acceptedQuote->id,
                'customer_id' => $user->id,
                'tradie_id' => $acceptedQuote->tradie_id,
                'starts_at' => $data['starts_at'],
                'ends_at' => $data['ends_at'] ?? null,
                'status' => 'scheduled',
                'notes' => $data['notes'] ?? null,
            ]);

            // Create corresponding executing Job
            Job::create([
                'request_id' => $serviceRequest->id,
                'appointment_id' => $appointment->id,
                'tradie_id' => $acceptedQuote->tradie_id,
                'status' => 'scheduled',
            ]);

            // Transition service request to scheduled
            $serviceRequest->update([
                'status' => 'scheduled',
            ]);

            return $appointment->loadMissing([
                'serviceRequest.service',
                'serviceRequest.location',
                'quote',
                'customer',
                'tradieProfile',
                'job',
            ]);
        });
    }
}
