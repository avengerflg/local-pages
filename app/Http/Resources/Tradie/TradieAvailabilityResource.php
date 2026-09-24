<?php

namespace App\Http\Resources\Tradie;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradieAvailabilityResource extends JsonResource
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
            'tradie_id' => $this->tradie_id,
            'day_of_week' => $this->day_of_week,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'specific_date' => $this->specific_date?->format('Y-m-d'),
            'is_available' => (bool) $this->is_available,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
