<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchingTradieResource extends JsonResource
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
            'business_name' => $this->business_name,
            'abn' => $this->abn,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'address' => $this->address,
            'suburb' => $this->suburb,
            'state' => $this->state,
            'postcode' => $this->postcode,
            'verification_status' => $this->verification_status,
            'services' => ServiceResource::collection($this->whenLoaded('services')),
            'service_areas' => LocationResource::collection($this->whenLoaded('serviceAreas')),
        ];
    }
}
