<?php

namespace App\Actions\Admin\Tradie;

use App\Models\TradieProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetAdminTradiesAction
{
    /**
     * Retrieve a paginated list of tradies with filters for verification status, user account status, and search.
     *
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = TradieProfile::query()->with(['user', 'services', 'serviceAreas']);

        if (! empty($filters['verification_status'])) {
            $query->where('verification_status', $filters['verification_status']);
        }

        if (! empty($filters['status'])) {
            $query->whereHas('user', function ($q) use ($filters) {
                $q->where('status', $filters['status']);
            });
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'like', $search)
                    ->orWhere('abn', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', $search)
                            ->orWhere('email', 'like', $search);
                    });
            });
        }

        return $query->withCount('documents')->latest('id')->paginate($perPage);
    }
}
