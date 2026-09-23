<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminServiceQuestionResource extends JsonResource
{
    /**
     * Transform the service question into an administrative resource array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_id' => $this->service_id,
            'question_text' => $this->question_text,
            'question_type' => $this->question_type,
            'required' => (bool) $this->required,
            'sort_order' => $this->sort_order,
            'conditional_rule' => $this->conditional_rule,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'options' => AdminQuestionOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
