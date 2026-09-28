<?php

namespace App\Actions\Appointment;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class GetAppointmentsAction
{
    /**
     * Retrieve paginated appointments for the given user (customer or tradie).
     */
    public function execute(User $user, int $perPage = 15): LengthAwarePaginator
    {
        $query = Appointment::with(['serviceRequest.service', 'customer', 'tradieProfile.user']);

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'tradie' && $user->tradieProfile) {
            $query->where('tradie_id', $user->tradieProfile->id);
        } else {
            // Failsafe for unhandled roles
            $query->whereRaw('1 = 0');
        }

        return $query->latest('id')->paginate($perPage);
    }
}
