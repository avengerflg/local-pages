<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $locationId = (int) $this->route('id');

        return [
            'type' => ['sometimes', 'required', 'string', Rule::in(['state', 'council', 'suburb', 'postcode'])],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:locations,id', Rule::notIn([$locationId])],
            'code' => ['nullable', 'string', 'max:20'],
            'postcode' => ['nullable', 'string', 'max:10'],
            'status' => ['sometimes', 'required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }
}
