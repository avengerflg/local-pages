<?php

namespace Database\Factories;

use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomerProfile>
 */
class CustomerProfileFactory extends Factory
{
    protected $model = CustomerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'postcode' => fake()->numerify('2###'),
            'address' => fake()->streetAddress(),
        ];
    }
}
