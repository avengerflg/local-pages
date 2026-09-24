<?php

namespace App\Http\Resources\Tradie;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradieOnboardingStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'services' => [
                'configured' => $this->resource['services_count'] > 0,
                'count' => $this->resource['services_count'],
            ],
            'service_areas' => [
                'configured' => $this->resource['service_areas_count'] > 0,
                'count' => $this->resource['service_areas_count'],
            ],
            'documents' => [
                'uploaded' => $this->resource['documents_count'] > 0,
                'count' => $this->resource['documents_count'],
            ],
            'verification' => [
                'status' => $this->resource['verification_status'],
            ],
            'availability' => [
                'configured' => $this->resource['availability_count'] > 0,
                'count' => $this->resource['availability_count'],
            ],
        ];
    }
}
