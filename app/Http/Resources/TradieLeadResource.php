<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradieLeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $serviceRequest = $this->serviceRequest;

        return [
            'id' => $this->id,
            'request_id' => $this->request_id,
            'lead_status' => $this->status,
            'selected_at' => $this->selected_at?->toIso8601String(),
            'service_request' => $this->relationLoaded('serviceRequest') && $serviceRequest ? [
                'id' => $serviceRequest->id,
                'title' => $serviceRequest->title,
                'description' => $serviceRequest->description,
                'status' => $serviceRequest->status,
                'postcode' => $serviceRequest->postcode,
                'submitted_at' => $serviceRequest->submitted_at?->toIso8601String(),
                'service' => $serviceRequest->relationLoaded('service') && $serviceRequest->service ? new ServiceResource($serviceRequest->service) : null,
                'location' => $serviceRequest->relationLoaded('location') && $serviceRequest->location ? new LocationResource($serviceRequest->location) : null,
                'customer' => $serviceRequest->relationLoaded('customer') && $serviceRequest->customer ? [
                    'id' => $serviceRequest->customer->id,
                    'name' => $serviceRequest->customer->name,
                ] : null,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
