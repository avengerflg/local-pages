<?php

namespace App\Actions\TradieLead;

use App\Models\RequestTradie;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class GetTradieLeadsAction
{
    /**
     * Retrieve a paginated list of leads assigned to the authenticated tradie.
     *
     * @return LengthAwarePaginator<RequestTradie>
     */
    public function execute(User $user, int $perPage = 15): LengthAwarePaginator
    {
        $tradieProfile = $user->tradieProfile;

        if (! $tradieProfile) {
            abort(Response::HTTP_NOT_FOUND, 'Tradie profile not found.');
        }

        return RequestTradie::where('tradie_id', $tradieProfile->id)
            ->with([
                'serviceRequest.service',
                'serviceRequest.location',
                'serviceRequest.customer',
            ])
            ->latest('id')
            ->paginate($perPage);
    }
}
