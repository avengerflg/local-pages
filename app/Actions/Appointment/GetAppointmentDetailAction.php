<?php

namespace App\Actions\Appointment;

use App\Models\Appointment;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class GetAppointmentDetailAction
{
    /**
     * Retrieve appointment details for an authorized customer or tradie.
     */
    public function execute(User $user, int $appointmentId): Appointment
    {
        $appointment = Appointment::with([
            'serviceRequest.service',
            'serviceRequest.location',
            'quote',
            'customer',
            'tradieProfile',
            'job',
        ])->find($appointmentId);

        if (! $appointment) {
            abort(Response::HTTP_NOT_FOUND, 'Appointment not found.');
        }

        $this->authorizeParticipant($user, $appointment);

        return $appointment;
    }

    /**
     * Authorize that the user owns the service request or is the assigned tradie.
     */
    protected function authorizeParticipant(User $user, Appointment $appointment): void
    {
        if ($user->role === 'customer') {
            if ($appointment->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Appointment not found.');
            }
        } elseif ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile || $appointment->tradie_id !== $tradieProfile->id) {
                abort(Response::HTTP_NOT_FOUND, 'Appointment not found.');
            }
        } else {
            abort(Response::HTTP_NOT_FOUND, 'Appointment not found.');
        }
    }
}
