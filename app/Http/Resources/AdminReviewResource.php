<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminReviewResource extends JsonResource
{
    /**
     * Transform the resource for admin moderation views.
     *
     * Exposes moderation-specific fields (moderation_status, published_at, removed_at)
     * that are not appropriate to expose in public-facing review listings.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_id' => $this->job_id,
            'rating' => $this->rating,
            'review_text' => $this->review_text,
            'moderation_status' => $this->moderation_status,
            'published_at' => $this->published_at?->toIso8601String(),
            'removed_at' => $this->removed_at?->toIso8601String(),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'email' => $this->customer->email,
            ]),
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
            ]),
            'response' => new ReviewResponseResource($this->whenLoaded('response')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
