<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResponseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Exposes only public-facing response fields; internal tradie_id FK is not exposed.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'response_text' => $this->response_text,
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
