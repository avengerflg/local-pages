<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Location>
 */
class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'parent_id' => null,
            'type' => 'suburb',
            'name' => fake()->city(),
            'code' => null,
            'postcode' => fake()->numerify('2###'),
            'status' => 'active',
        ];
    }

    public function asState(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'state',
            'name' => 'New South Wales',
            'code' => 'NSW',
            'postcode' => null,
            'parent_id' => null,
        ]);
    }

    public function council(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'council',
            'name' => fake()->city().' Council',
            'code' => null,
            'postcode' => null,
        ]);
    }
}
