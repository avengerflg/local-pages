<?php

namespace App\Actions\Tradie;

use App\Models\TradieAvailability;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UpdateTradieAvailabilityAction
{
    /**
     * Update an availability slot or override belonging to the authenticated tradie.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, int $availabilityId, array $data): TradieAvailability
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

        $slot->update($data);

        return $slot->fresh();
    }
}
