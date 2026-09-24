<?php

namespace App\Actions\Tradie;

use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Support\Arr;

class UpdateTradieProfileAction
{
    /**
     * Update the authenticated tradie's profile with whitelist filtering.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, array $data): TradieProfile
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        // Strict whitelist: protect user_id, verification_status, verified_at, role
        $allowedFields = [
            'business_name',
            'abn',
            'phone',
            'email',
            'website',
            'address',
            'suburb',
            'state',
            'postcode',
        ];

        $filtered = Arr::only($data, $allowedFields);

        $profile->update($filtered);

        return $profile->fresh();
    }
}
