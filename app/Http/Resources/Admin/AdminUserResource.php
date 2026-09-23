<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    /**
     * Transform the user into an administrative resource array.
     *
     * Sensitive fields (password, remember_token, tokens) are omitted.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'mobile' => $this->mobile,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'phone_verified_at' => $this->phone_verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'customer_profile' => $this->whenLoaded('customerProfile', fn () => [
                'id' => $this->customerProfile->id,
                'postcode' => $this->customerProfile->postcode,
                'address' => $this->customerProfile->address,
            ]),
            'tradie_profile' => $this->whenLoaded('tradieProfile', fn () => [
                'id' => $this->tradieProfile->id,
                'business_name' => $this->tradieProfile->business_name,
                'abn' => $this->tradieProfile->abn,
                'phone' => $this->tradieProfile->phone,
                'email' => $this->tradieProfile->email,
                'verification_status' => $this->tradieProfile->verification_status,
                'verified_at' => $this->tradieProfile->verified_at?->toIso8601String(),
            ]),
        ];
    }
}
