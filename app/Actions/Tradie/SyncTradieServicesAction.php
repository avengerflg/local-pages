<?php

namespace App\Actions\Tradie;

use App\Models\Service;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SyncTradieServicesAction
{
    /**
     * Synchronize the services offered by the tradie.
     *
     * @param  array<int, int>  $serviceIds
     * @return Collection<int, Service>
     */
    public function execute(User $user, array $serviceIds): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        // Ensure all provided IDs exist and are active
        $activeCount = Service::whereIn('id', $serviceIds)
            ->where('status', 'active')
            ->count();

        if ($activeCount !== count(array_unique($serviceIds))) {
            throw ValidationException::withMessages([
                'service_ids' => ['One or more selected services are inactive or invalid.'],
            ]);
        }

        DB::transaction(function () use ($profile, $serviceIds) {
            $profile->services()->sync($serviceIds);
        });

        return $profile->services()->get();
    }
}
