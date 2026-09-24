<?php

namespace App\Actions\Tradie;

use App\Models\Location;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetTradieServiceAreasAction
{
    /**
     * Get all service area locations associated with the tradie profile.
     *
     * @return Collection<int, Location>
     */
    public function execute(User $user): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return $profile->serviceAreas()->get();
    }
}
