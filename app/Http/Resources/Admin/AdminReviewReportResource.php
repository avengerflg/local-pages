<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\ReviewResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminReviewReportResource extends JsonResource
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
            'review_id' => $this->review_id,
            'reporter_id' => $this->reporter_id,
            'reason' => $this->reason,
            'status' => $this->status,
            'resolved_by' => $this->resolved_by,
            'resolved_at' => $this->resolved_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'review' => new ReviewResource($this->whenLoaded('review')),
            'reporter' => new AdminUserResource($this->whenLoaded('reporter')),
            'resolver' => new AdminUserResource($this->whenLoaded('resolver')),
        ];
    }
}
