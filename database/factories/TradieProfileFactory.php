<?php

namespace Database\Factories;

use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TradieProfile>
 */
class TradieProfileFactory extends Factory
{
    protected $model = TradieProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->tradie(),
            'business_name' => fake()->company(),
            'abn' => fake()->numerify('###########'),
            'phone' => fake()->numerify('04########'),
            'email' => fake()->safeEmail(),
            'website' => fake()->url(),
            'address' => fake()->streetAddress(),
            'suburb' => fake()->city(),
            'state' => 'NSW',
            'postcode' => fake()->numerify('2###'),
            'verification_status' => 'verified',
            'verified_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => 'pending',
            'verified_at' => null,
        ]);
    }
}
