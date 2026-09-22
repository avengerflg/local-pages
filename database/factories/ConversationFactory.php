<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'request_id' => ServiceRequest::factory(),
            'customer_id' => User::factory(),
            'tradie_id' => TradieProfile::factory(),
            'status' => 'active',
            'last_message_at' => now(),
        ];
    }
}
