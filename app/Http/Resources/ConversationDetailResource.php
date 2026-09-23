<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationDetailResource extends JsonResource
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
            'status' => $this->status,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'service_request' => $this->whenLoaded('serviceRequest', fn () => [
                'id' => $this->serviceRequest->id,
                'title' => $this->serviceRequest->title,
                'description' => $this->serviceRequest->description,
                'status' => $this->serviceRequest->status,
                'postcode' => $this->serviceRequest->postcode,
                'submitted_at' => $this->serviceRequest->submitted_at?->toIso8601String(),
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
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
            ]),
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
