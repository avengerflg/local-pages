<?php

namespace App\Actions\Tradie;

use App\Models\TradieProfile;
use App\Models\User;

class GetTradieOnboardingStatusAction
{
    /**
     * Compute component-level onboarding checklist and counts for the authenticated tradie.
     *
     * @return array<string, mixed>
     */
    public function execute(User $user): array
    {
        /** @var TradieProfile $profile */
        $profile = $user->tradieProfile;

        return [
            'services_count' => $profile->services()->count(),
            'service_areas_count' => $profile->serviceAreas()->count(),
            'documents_count' => $profile->documents()->count(),
            'verification_status' => $profile->verification_status,
            'availability_count' => $profile->availability()->count(),
        ];
    }
}
