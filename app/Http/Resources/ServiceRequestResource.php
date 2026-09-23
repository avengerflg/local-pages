<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceRequestResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'service_id' => $this->service_id,
            'service' => new ServiceResource($this->whenLoaded('service')),
            'location_id' => $this->location_id,
            'location' => new LocationResource($this->whenLoaded('location')),
            'postcode' => $this->postcode,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'answers' => RequestAnswerResource::collection($this->whenLoaded('answers')),
            'attachments' => RequestAttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
