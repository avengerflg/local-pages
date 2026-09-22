<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\ReviewReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReviewReport>
 */
class ReviewReportFactory extends Factory
{
    protected $model = ReviewReport::class;

    public function definition(): array
    {
        return [
            'review_id' => Review::factory(),
            'reporter_id' => User::factory(),
            'reason' => fake()->sentence(),
            'status' => 'pending',
            'resolved_by' => null,
            'resolved_at' => null,
        ];
    }
}
