<?php

namespace App\Actions\Tradie;

use App\Models\Location;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AttachTradieServiceAreaAction
{
    /**
     * Attach an active location to the tradie's service area coverage.
     *
     * @return Collection<int, Location>
     */
    public function execute(User $user, int $locationId): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        $location = Location::findOrFail($locationId);

        if ($location->status !== 'active') {
            throw ValidationException::withMessages([
                'location_id' => ['The selected location is not active and cannot be added as a service area.'],
            ]);
        }

        // Attach idempotently
        $profile->serviceAreas()->syncWithoutDetaching([$locationId]);

        return $profile->serviceAreas()->get();
    }
}
