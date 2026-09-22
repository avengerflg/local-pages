<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceQuestion>
 */
class ServiceQuestionFactory extends Factory
{
    protected $model = ServiceQuestion::class;

    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'question_text' => fake()->sentence().'?',
            'question_type' => 'multiple_choice',
            'required' => true,
            'sort_order' => 1,
            'conditional_rule' => null,
            'status' => 'active',
        ];
    }
}
