<?php

namespace App\Actions\Tradie;

use App\Models\TradieAvailability;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DeleteTradieAvailabilityAction
{
    /**
     * Delete an availability slot or override belonging to the authenticated tradie.
     */
    public function execute(User $user, int $availabilityId): void
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        /** @var TradieAvailability|null $slot */
        $slot = TradieAvailability::where('id', $availabilityId)
            ->where('tradie_id', $profile->id)
            ->first();

        if (! $slot) {
            throw (new ModelNotFoundException)->setModel(TradieAvailability::class, [$availabilityId]);
        }

        $slot->delete();
    }
}
