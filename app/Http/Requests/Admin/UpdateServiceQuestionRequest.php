<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_text' => ['sometimes', 'required', 'string', 'max:255'],
            'question_type' => ['sometimes', 'required', 'string', Rule::in(['multiple_choice', 'single_choice', 'text', 'file_upload', 'image_upload'])],
            'required' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'conditional_rule' => ['nullable', 'array'],
            'status' => ['sometimes', 'required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }
}
