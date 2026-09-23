<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceQuestionResource extends JsonResource
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
            'service_id' => $this->service_id,
            'question_text' => $this->question_text,
            'question_type' => $this->question_type,
            'required' => (bool) $this->required,
            'sort_order' => $this->sort_order,
            'conditional_rule' => $this->conditional_rule,
            'options' => ServiceQuestionOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
