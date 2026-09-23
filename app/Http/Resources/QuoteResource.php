<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
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
            'tradie' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
                'abn' => $this->tradieProfile->abn,
                'verification_status' => $this->tradieProfile->verification_status,
            ]),
            'amount' => (string) $this->amount,
            'description' => $this->description,
            'valid_until' => $this->valid_until?->format('Y-m-d'),
            'terms_notes' => $this->terms_notes,
            'estimated_duration' => $this->estimated_duration,
            'proposed_date' => $this->proposed_date?->format('Y-m-d'),
            'status' => $this->status,
            'accepted_at' => $this->accepted_at?->toIso8601String(),
            'rejected_at' => $this->rejected_at?->toIso8601String(),
            'attachments' => QuoteAttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
