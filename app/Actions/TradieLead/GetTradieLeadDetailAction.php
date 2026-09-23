<?php

namespace App\Actions\TradieLead;

use App\Models\RequestTradie;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class GetTradieLeadDetailAction
{
    /**
     * Retrieve the detailed record of a single lead owned by the authenticated tradie.
     */
    public function execute(User $user, int $leadId): RequestTradie
    {
        $tradieProfile = $user->tradieProfile;

        if (! $tradieProfile) {
            abort(Response::HTTP_NOT_FOUND, 'Tradie profile not found.');
        }

        $lead = RequestTradie::where('id', $leadId)
            ->where('tradie_id', $tradieProfile->id)
            ->with([
                'serviceRequest.service',
                'serviceRequest.location',
                'serviceRequest.customer',
                'serviceRequest.answers.question',
                'serviceRequest.answers.selectedOption',
                'serviceRequest.attachments',
                'tradieProfile',
            ])
            ->first();

        if (! $lead) {
            abort(Response::HTTP_NOT_FOUND, 'Lead not found.');
        }

        return $lead;
    }
}
