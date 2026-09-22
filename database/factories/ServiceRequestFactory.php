<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceRequest>
 */
class ServiceRequestFactory extends Factory
{
    protected $model = ServiceRequest::class;

    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'service_id' => Service::factory(),
            'location_id' => Location::factory(),
            'postcode' => fake()->numerify('2###'),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'status' => 'submitted',
            'submitted_at' => now(),
        ];
    }
}
