<?php

namespace App\Http\Requests\ServiceRequest;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateServiceRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'customer';
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('answers'))) {
            $decoded = json_decode($this->input('answers'), true);
            if (is_array($decoded)) {
                $this->merge(['answers' => $decoded]);
            }
        }

        if ($this->has('postcode') && is_string($this->input('postcode'))) {
            $this->merge([
                'postcode' => trim($this->input('postcode')),
            ]);
        }

        if ($this->has('title') && is_string($this->input('title'))) {
            $this->merge([
                'title' => trim($this->input('title')),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
            'postcode' => ['required', 'string', 'max:10'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'answers' => ['nullable', 'array'],
            'answers.*.question_id' => ['required_with:answers', 'integer', 'exists:service_questions,id'],
            'answers.*.selected_option_id' => ['nullable', 'integer', 'exists:service_question_options,id'],
            'answers.*.answer_text' => ['nullable', 'string'],
            'answers.*.structured_value' => ['nullable', 'array'],
            'attachments' => ['nullable', 'array', 'max:10'],
            'attachments.*' => ['file', 'mimes:jpeg,jpg,png,webp,pdf,doc,docx', 'max:10240'],
        ];
    }
}
