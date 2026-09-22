<?php

namespace Database\Factories;

use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quote>
 */
class QuoteFactory extends Factory
{
    protected $model = Quote::class;

    public function definition(): array
    {
        return [
            'request_id' => ServiceRequest::factory(),
            'tradie_id' => TradieProfile::factory(),
            'amount' => fake()->randomFloat(2, 50, 2000),
            'description' => fake()->paragraph(),
            'valid_until' => now()->addDays(14)->toDateString(),
            'terms_notes' => fake()->sentence(),
            'estimated_duration' => '2-3 hours',
            'proposed_date' => now()->addDays(3)->toDateString(),
            'status' => 'pending',
            'accepted_at' => null,
            'rejected_at' => null,
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);
    }
}
