<?php

namespace App\Actions\Tradie;

use App\Models\Service;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DetachTradieServiceAction
{
    /**
     * Detach a service from the authenticated tradie's profile.
     *
     * @return Collection<int, Service>
     */
    public function execute(User $user, int $serviceId): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        // Check if the service is currently attached to this tradie
        if (! $profile->services()->where('services.id', $serviceId)->exists()) {
            throw (new ModelNotFoundException)->setModel(Service::class, [$serviceId]);
        }

        $profile->services()->detach($serviceId);

        return $profile->services()->get();
    }
}
