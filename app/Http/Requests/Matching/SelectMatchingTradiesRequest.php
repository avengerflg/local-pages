<?php

namespace App\Http\Requests\Matching;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SelectMatchingTradiesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'customer';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tradie_ids' => ['required', 'array', 'min:1', 'max:20'],
            'tradie_ids.*' => ['required', 'integer', 'exists:tradie_profiles,id'],
        ];
    }
}
