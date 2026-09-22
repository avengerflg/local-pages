<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\ReviewResponse;
use App\Models\TradieProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReviewResponse>
 */
class ReviewResponseFactory extends Factory
{
    protected $model = ReviewResponse::class;

    public function definition(): array
    {
        return [
            'review_id' => Review::factory(),
            'tradie_id' => TradieProfile::factory(),
            'response_text' => fake()->paragraph(),
        ];
    }
}
