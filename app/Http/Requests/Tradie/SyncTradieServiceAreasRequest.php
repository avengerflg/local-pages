<?php

namespace App\Http\Requests\Tradie;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SyncTradieServiceAreasRequest extends FormRequest
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
            'location_ids' => ['required', 'array'],
            'location_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('locations', 'id')->where('status', 'active'),
            ],
        ];
    }
}
