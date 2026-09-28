<?php

namespace App\Actions\Job;

use App\Models\Job;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class GetJobsAction
{
    /**
     * Retrieve paginated jobs for the given user (customer or tradie).
     */
    public function execute(User $user, int $perPage = 15): LengthAwarePaginator
    {
        // For customer, we join with service_requests or use the relation
        // Jobs have request_id which links to ServiceRequest where customer_id = user->id
        // Tradies are directly linked via tradie_id

        $query = Job::with(['serviceRequest.service', 'appointment', 'tradieProfile.user']);

        if ($user->role === 'customer') {
            $query->whereHas('serviceRequest', function ($q) use ($user) {
                $q->where('customer_id', $user->id);
            });
        } elseif ($user->role === 'tradie' && $user->tradieProfile) {
            $query->where('tradie_id', $user->tradieProfile->id);
        } else {
            // Failsafe for unhandled roles
            $query->whereRaw('1 = 0');
        }

        return $query->latest('id')->paginate($perPage);
    }
}
