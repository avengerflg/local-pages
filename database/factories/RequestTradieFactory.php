<?php

namespace Database\Factories;

use App\Models\RequestTradie;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RequestTradie>
 */
class RequestTradieFactory extends Factory
{
    protected $model = RequestTradie::class;

    public function definition(): array
    {
        return [
            'request_id' => ServiceRequest::factory(),
            'tradie_id' => TradieProfile::factory(),
            'selected_at' => now(),
            'status' => 'selected',
        ];
    }
}
