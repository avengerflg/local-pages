<?php

namespace App\Actions\Customer;

use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateCustomerProfileAction
{
    /**
     * Update or create the customer profile for the given user.
     */
    public function execute(User $user, array $data): CustomerProfile
    {
        return DB::transaction(function () use ($user, $data) {
            $profile = CustomerProfile::firstOrNew(['user_id' => $user->id]);

            if (array_key_exists('postcode', $data)) {
                $profile->postcode = $data['postcode'];
            }
            if (array_key_exists('address', $data)) {
                $profile->address = $data['address'];
            }

            $profile->save();

            return $profile;
        });
    }
}
