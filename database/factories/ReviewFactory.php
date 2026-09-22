<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\Review;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory()->completed(),
            'customer_id' => User::factory(),
            'tradie_id' => TradieProfile::factory(),
            'rating' => fake()->numberBetween(1, 5),
            'review_text' => fake()->paragraph(),
            'moderation_status' => 'pending',
            'published_at' => null,
            'removed_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'moderation_status' => 'approved',
            'published_at' => now(),
        ]);
    }
}
