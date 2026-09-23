<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'request_id' => $this->request_id,
            'appointment_id' => $this->appointment_id,
            'service_request' => $this->whenLoaded('serviceRequest', fn () => [
                'id' => $this->serviceRequest->id,
                'title' => $this->serviceRequest->title,
                'status' => $this->serviceRequest->status,
                'postcode' => $this->serviceRequest->postcode,
                'service' => $this->serviceRequest->service ? [
                    'id' => $this->serviceRequest->service->id,
                    'name' => $this->serviceRequest->service->name,
                ] : null,
                'location' => $this->serviceRequest->location ? [
                    'id' => $this->serviceRequest->location->id,
                    'name' => $this->serviceRequest->location->name,
                    'postcode' => $this->serviceRequest->location->postcode,
                ] : null,
            ]),
            'appointment' => $this->whenLoaded('appointment', fn () => [
                'id' => $this->appointment->id,
                'starts_at' => $this->appointment->starts_at?->toIso8601String(),
                'ends_at' => $this->appointment->ends_at?->toIso8601String(),
                'status' => $this->appointment->status,
            ]),
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
                'abn' => $this->tradieProfile->abn,
                'verification_status' => $this->tradieProfile->verification_status,
            ]),
            'status' => $this->status,
            'started_at' => $this->started_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
