<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Job>
 */
class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        return [
            'request_id' => ServiceRequest::factory(),
            'appointment_id' => Appointment::factory(),
            'tradie_id' => TradieProfile::factory(),
            'status' => 'scheduled',
            'started_at' => null,
            'completed_at' => null,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'started_at' => now()->subHours(4),
            'completed_at' => now()->subHour(),
        ]);
    }
}
