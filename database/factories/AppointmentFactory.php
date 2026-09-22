<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        $startsAt = now()->addDays(2)->setHour(9)->setMinute(0)->setSecond(0);

        return [
            'request_id' => ServiceRequest::factory(),
            'quote_id' => Quote::factory(),
            'customer_id' => User::factory(),
            'tradie_id' => TradieProfile::factory(),
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->addHours(2),
            'status' => 'scheduled',
            'notes' => fake()->sentence(),
        ];
    }
}
