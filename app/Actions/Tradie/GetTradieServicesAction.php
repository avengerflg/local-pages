<?php

namespace App\Actions\Tradie;

use App\Models\Service;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetTradieServicesAction
{
    /**
     * Get all services currently associated with the tradie profile.
     *
     * @return Collection<int, Service>
     */
    public function execute(User $user): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return $profile->services()->get();
    }
}
