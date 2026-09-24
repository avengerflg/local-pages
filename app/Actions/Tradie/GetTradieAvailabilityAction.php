<?php

namespace App\Actions\Tradie;

use App\Models\TradieAvailability;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetTradieAvailabilityAction
{
    /**
     * Get all availability slots and date overrides for the tradie.
     *
     * @return Collection<int, TradieAvailability>
     */
    public function execute(User $user): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return $profile->availability()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->orderBy('specific_date')
            ->get();
    }
}
