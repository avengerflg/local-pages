<?php

namespace App\Actions\Review;

use App\Models\ReviewReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminGetPendingReviewReportsAction
{
    /**
     * Get pending review reports.
     */
    public function execute(array $filters = []): LengthAwarePaginator
    {
        $query = ReviewReport::with(['review', 'reporter', 'resolver']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            $query->where('status', 'pending');
        }

        $query->orderBy('created_at', 'asc');

        $perPage = min((int) ($filters['per_page'] ?? 15), 100);

        return $query->paginate($perPage);
    }
}
