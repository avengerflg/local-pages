<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminDashboardResource extends JsonResource
{
    /**
     * Transform the platform statistics into an administrative dashboard resource array.
     *
     * Only operational counts are exposed. Financial metrics (revenue, payments, payouts) are omitted.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'users' => $this->resource['users'] ?? [],
            'tradies' => $this->resource['tradies'] ?? [],
            'service_requests' => $this->resource['service_requests'] ?? [],
            'quotes' => $this->resource['quotes'] ?? [],
            'appointments' => $this->resource['appointments'] ?? [],
            'jobs' => $this->resource['jobs'] ?? [],
            'reviews' => $this->resource['reviews'] ?? [],
            'services' => $this->resource['services'] ?? [],
        ];
    }
}
