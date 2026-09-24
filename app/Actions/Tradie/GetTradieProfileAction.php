<?php

namespace App\Actions\Tradie;

use App\Models\TradieProfile;
use App\Models\User;

class GetTradieProfileAction
{
    /**
     * Retrieve the authenticated tradie's profile with core relations.
     */
    public function execute(User $user): TradieProfile
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return $profile;
    }
}
