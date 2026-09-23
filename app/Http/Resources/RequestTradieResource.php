<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestTradieResource extends JsonResource
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
            'tradie_id' => $this->tradie_id,
            'selected_at' => $this->selected_at?->toIso8601String(),
            'status' => $this->status,
            'tradie_profile' => new MatchingTradieResource($this->whenLoaded('tradieProfile')),
        ];
    }
}
