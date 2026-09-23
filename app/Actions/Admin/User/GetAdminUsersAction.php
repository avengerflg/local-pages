<?php

namespace App\Actions\Admin\User;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetAdminUsersAction
{
    /**
     * Retrieve a paginated list of users with optional role, status, and search filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function execute(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query()->with(['customerProfile', 'tradieProfile']);

        if (! empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $search = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('mobile', 'like', $search);
            });
        }

        return $query->latest('id')->paginate($perPage);
    }
}
