<?php

namespace App\Actions\Review;

use App\Models\Review;
use App\Models\TradieProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class GetTradieReviewsAction
{
    /**
     * Retrieve publicly visible (approved) reviews for a given tradie profile.
     * Only approved reviews are returned; pending/rejected/removed reviews are excluded.
     */
    public function execute(int $tradieId, int $perPage = 15): LengthAwarePaginator
    {
        $tradieProfile = TradieProfile::find($tradieId);

        if (! $tradieProfile) {
            abort(Response::HTTP_NOT_FOUND, 'Tradie not found.');
        }

        return Review::where('tradie_id', $tradieId)
            ->where('moderation_status', 'approved')
            ->with(['customer', 'response'])
            ->latest('published_at')
            ->paginate($perPage);
    }
}
