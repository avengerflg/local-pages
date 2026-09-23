<?php

namespace App\Http\Requests\Review;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Route-level `role:customer` middleware enforces the role; this provides
     * an additional check that an authenticated customer is present.
     */
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'customer';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Rating: required integer 1–5 (DB CHECK constraint is the additional safeguard).
     * review_text: required string; TEXT column has no schema length limit.
     *   A 10 000-character technical application-level limit is applied here to
     *   prevent trivially large payloads.
     *   TODO: OPEN DECISION — business-specific review text length limit.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['required', 'string', 'max:10000'],
        ];
    }
}
