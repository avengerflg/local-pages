<?php

namespace App\Http\Requests\Tradie;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTradieAvailabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isTradie();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'day_of_week' => [
                'nullable',
                'integer',
                'between:0,6',
                'required_without:specific_date',
            ],
            'start_time' => [
                'nullable',
                'required_with:day_of_week',
                'date_format:H:i,H:i:s',
            ],
            'end_time' => [
                'nullable',
                'required_with:day_of_week',
                'date_format:H:i,H:i:s',
                'after:start_time',
            ],
            'specific_date' => [
                'nullable',
                'date',
                'date_format:Y-m-d',
                'required_without:day_of_week',
            ],
            'is_available' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
