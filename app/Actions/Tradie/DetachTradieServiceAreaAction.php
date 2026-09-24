<?php

namespace App\Actions\Tradie;

use App\Models\Location;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DetachTradieServiceAreaAction
{
    /**
     * Detach a location from the tradie's service area coverage.
     *
     * @return Collection<int, Location>
     */
    public function execute(User $user, int $locationId): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        // Check if the location is currently attached to this tradie
        if (! $profile->serviceAreas()->where('locations.id', $locationId)->exists()) {
            throw (new ModelNotFoundException)->setModel(Location::class, [$locationId]);
        }

        $profile->serviceAreas()->detach($locationId);

        return $profile->serviceAreas()->get();
    }
}
