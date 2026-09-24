<?php

namespace App\Actions\Tradie;

use App\Models\Service;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AttachTradieServiceAction
{
    /**
     * Attach an active service to the authenticated tradie's profile.
     *
     * @return Collection<int, Service>
     */
    public function execute(User $user, int $serviceId): Collection
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        $service = Service::findOrFail($serviceId);

        if ($service->status !== 'active') {
            throw ValidationException::withMessages([
                'service_id' => ['The selected service is not active and cannot be added.'],
            ]);
        }

        // Attach idempotently to respect unique(tradie_id, service_id)
        $profile->services()->syncWithoutDetaching([$serviceId]);

        return $profile->services()->get();
    }
}
