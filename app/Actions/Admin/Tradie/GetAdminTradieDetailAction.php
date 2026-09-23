<?php

namespace App\Actions\Admin\Tradie;

use App\Models\TradieProfile;
use Symfony\Component\HttpFoundation\Response;

class GetAdminTradieDetailAction
{
    /**
     * Retrieve full tradie profile details for administrative inspection.
     */
    public function execute(int $tradieId): TradieProfile
    {
        $tradie = TradieProfile::with(['user', 'services', 'serviceAreas', 'availability'])
            ->withCount('documents')
            ->find($tradieId);

        if (! $tradie) {
            abort(Response::HTTP_NOT_FOUND, 'Tradie not found.');
        }

        return $tradie;
    }
}
