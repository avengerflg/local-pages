<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminTradieResource extends JsonResource
{
    /**
     * Transform the tradie profile into an administrative resource array.
     *
     * Exposes business information, verification details, services, service areas, and availability.
     * Document storage paths and private credentials are omitted.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
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
            'verified_at' => $this->verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'status' => $this->user->status,
                'mobile' => $this->user->mobile,
            ]),
            'services' => $this->whenLoaded('services', fn () => $this->services->map(fn ($service) => [
                'id' => $service->id,
                'name' => $service->name,
                'slug' => $service->slug,
                'status' => $service->status,
            ])),
            'service_areas' => $this->whenLoaded('serviceAreas', fn () => $this->serviceAreas->map(fn ($area) => [
                'id' => $area->id,
                'type' => $area->type,
                'name' => $area->name,
                'postcode' => $area->postcode,
            ])),
            'availability' => $this->whenLoaded('availability', fn () => $this->availability->map(fn ($slot) => [
                'id' => $slot->id,
                'day_of_week' => $slot->day_of_week,
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
                'specific_date' => $slot->specific_date?->toDateString(),
                'is_available' => (bool) $slot->is_available,
                'notes' => $slot->notes,
            ])),
            'documents_count' => $this->whenCounted('documents'),
        ];
    }
}
