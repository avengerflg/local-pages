<?php

namespace App\Http\Requests\Tradie;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTradieProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isTradie();
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('email') && is_string($this->input('email'))) {
            $this->merge([
                'email' => strtolower(trim($this->input('email'))),
            ]);
        }

        if ($this->has('phone') && is_string($this->input('phone'))) {
            $this->merge([
                'phone' => trim($this->input('phone')),
            ]);
        }

        if ($this->has('business_name') && is_string($this->input('business_name'))) {
            $this->merge([
                'business_name' => trim($this->input('business_name')),
            ]);
        }

        if ($this->has('abn') && is_string($this->input('abn'))) {
            $this->merge([
                'abn' => trim($this->input('abn')),
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
            'business_name' => ['sometimes', 'required', 'string', 'max:255'],
            'abn' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'suburb' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:10'],
            'postcode' => ['nullable', 'string', 'max:10'],
        ];
    }
}
