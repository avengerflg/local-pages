<?php

namespace App\Actions\Admin\Tradie;

use App\Models\TradieDocument;
use App\Models\TradieProfile;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\Response;

class GetAdminTradieDocumentsAction
{
    /**
     * Retrieve safe document metadata list for a specific tradie profile.
     *
     * @return Collection<int, TradieDocument>
     */
    public function execute(int $tradieId): Collection
    {
        $tradie = TradieProfile::find($tradieId);

        if (! $tradie) {
            abort(Response::HTTP_NOT_FOUND, 'Tradie not found.');
        }

        return TradieDocument::with('reviewer')
            ->where('tradie_id', $tradieId)
            ->latest('id')
            ->get();
    }
}
