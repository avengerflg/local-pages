<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array for public consumption.
     *
     * Exposes only approved-review public data.
     * Moderation internals (moderation_status, removed_at) are NOT exposed here;
     * use AdminReviewResource for admin-facing views.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'review_text' => $this->review_text,
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
            ]),
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
            ]),
            'response' => new ReviewResponseResource($this->whenLoaded('response')),
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
