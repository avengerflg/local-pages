<?php

namespace App\Http\Requests\Review;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewResponseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Route-level `role:tradie` middleware enforces the role; this provides
     * an additional check that an authenticated tradie is present.
     */
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'tradie';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * response_text: required string; TEXT column has no schema length limit.
     *   A 10 000-character technical application-level limit is applied to
     *   prevent trivially large payloads.
     *   TODO: OPEN DECISION — business-specific response text length limit.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'response_text' => ['required', 'string', 'max:10000'],
        ];
    }
}
