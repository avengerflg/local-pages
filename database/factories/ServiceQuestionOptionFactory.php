<?php

namespace Database\Factories;

use App\Models\ServiceQuestion;
use App\Models\ServiceQuestionOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceQuestionOption>
 */
class ServiceQuestionOptionFactory extends Factory
{
    protected $model = ServiceQuestionOption::class;

    public function definition(): array
    {
        $label = fake()->word();

        return [
            'question_id' => ServiceQuestion::factory(),
            'label' => ucfirst($label),
            'value' => strtolower($label),
            'sort_order' => 1,
        ];
    }
}
