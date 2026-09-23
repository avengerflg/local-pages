<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestAnswerResource extends JsonResource
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
            'question_id' => $this->question_id,
            'question_text' => $this->question?->question_text,
            'question_type' => $this->question?->question_type,
            'answer_text' => $this->answer_text,
            'selected_option_id' => $this->selected_option_id,
            'selected_option' => $this->selectedOption ? new ServiceQuestionOptionResource($this->selectedOption) : null,
            'structured_value' => $this->structured_value,
        ];
    }
}
