<?php

namespace App\Actions\Tradie;

use App\Models\Location;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SyncTradieServiceAreasAction
{
    /**
     * Synchronize service areas covered by the tradie.
     *
     * @param  array<int, int>  $locationIds
     * @return Collection<int, Location>
     */
    public function execute(User $user, array $locationIds): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        // Ensure all provided IDs exist and are active
        $activeCount = Location::whereIn('id', $locationIds)
            ->where('status', 'active')
            ->count();

        if ($activeCount !== count(array_unique($locationIds))) {
            throw ValidationException::withMessages([
                'location_ids' => ['One or more selected locations are inactive or invalid.'],
            ]);
        }

        DB::transaction(function () use ($profile, $locationIds) {
            $profile->serviceAreas()->sync($locationIds);
        });

        return $profile->serviceAreas()->get();
    }
}
