<?php

namespace App\Actions\Admin\Location;

use App\Models\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetAdminLocationsAction
{
    /**
     * Retrieve a paginated list of locations with filters for type, parent_id, status, and search.
     *
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Location::query()->with('parent')->withCount('children');

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['parent_id'])) {
            if ($filters['parent_id'] === 'null' || $filters['parent_id'] === null) {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $filters['parent_id']);
            }
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('code', 'like', $search)
                    ->orWhere('postcode', 'like', $search);
            });
        }

        return $query->latest('id')->paginate($perPage);
    }
}
