<?php

namespace App\Actions\Tradie;

use App\Models\TradieDocument;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GetTradieDocumentsAction
{
    /**
     * Get all documents uploaded by the tradie.
     *
     * @return Collection<int, TradieDocument>
     */
    public function execute(User $user): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return $profile->documents()->latest()->get();
    }
}
