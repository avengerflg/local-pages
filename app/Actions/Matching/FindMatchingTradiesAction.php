<?php

namespace App\Actions\Matching;

use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use Illuminate\Database\Eloquent\Builder;

class FindMatchingTradiesAction
{
    /**
     * Build an Eloquent query for eligible tradies matching the given service request.
     *
     * @return Builder<TradieProfile>
     */
    public function execute(ServiceRequest $serviceRequest): Builder
    {
        $serviceRequest->loadMissing(['service', 'location']);

        $query = TradieProfile::query()
            ->whereHas('user', function ($q) {
                $q->where('status', 'active');
            })
            ->where('verification_status', 'verified')
            ->whereHas('services', function ($q) use ($serviceRequest) {
                $q->where('services.id', $serviceRequest->service_id)
                    ->where('services.status', 'active');
            })
            ->whereHas('serviceAreas', function ($q) use ($serviceRequest) {
                $q->where('locations.status', 'active')
                    ->where(function ($locQuery) use ($serviceRequest) {
                        if ($serviceRequest->location_id) {
                            $locQuery->where('locations.id', $serviceRequest->location_id);
                        }

                        if (! empty($serviceRequest->postcode)) {
                            $locQuery->orWhere('locations.postcode', $serviceRequest->postcode);
                        }
                    });
            })
            ->with(['services', 'serviceAreas']);

        return $query;
    }
}
