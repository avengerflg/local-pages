<?php

namespace App\Actions\Admin\Service;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetAdminServicesAction
{
    /**
     * Retrieve a paginated list of services with optional status filter and search.
     *
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Service::query()->withCount('questions');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('slug', 'like', $search)
                    ->orWhere('description', 'like', $search);
            });
        }

        return $query->latest('id')->paginate($perPage);
    }
}
