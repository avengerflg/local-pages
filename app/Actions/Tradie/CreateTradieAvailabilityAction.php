<?php

namespace App\Actions\Tradie;

use App\Models\TradieAvailability;
use App\Models\TradieProfile;
use App\Models\User;

class CreateTradieAvailabilityAction
{
    /**
     * Create an availability slot or date override for the authenticated tradie.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, array $data): TradieAvailability
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return TradieAvailability::create([
            'tradie_id' => $profile->id,
            'day_of_week' => $data['day_of_week'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
            'specific_date' => $data['specific_date'] ?? null,
            'is_available' => $data['is_available'] ?? true,
            'notes' => $data['notes'] ?? null,
        ]);
    }
}
