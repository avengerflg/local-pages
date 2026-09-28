<?php

namespace Tests\Feature;

use App\Models\Job;
use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\TradieAvailability;
use App\Models\TradieProfile;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase18Test extends TestCase
{
    use RefreshDatabase;

    protected User $customer;

    protected User $customer2;

    protected User $tradie;

    protected TradieProfile $tradieProfile;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->customer2 = User::factory()->create(['role' => 'customer']);
        $this->tradie = User::factory()->create([
            'role' => 'tradie',
            'status' => 'active',
        ]);

        $this->tradieProfile = TradieProfile::factory()->create([
            'user_id' => $this->tradie->id,
            'verification_status' => 'verified',
        ]);
    }

    protected function setupQuoteAndRequest(User $customer): ServiceRequest
    {
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'quote_accepted',
        ]);

        Quote::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $this->tradieProfile->id,
            'status' => 'accepted',
        ]);

        return $serviceRequest;
    }

    public function test_no_availability_records_rejects_appointment(): void
    {
        $request = $this->setupQuoteAndRequest($this->customer);

        $date = Carbon::now()->addDays(2)->setTime(10, 0, 0);

        $response = $this->actingAs($this->customer)->postJson("/api/v1/service-requests/{$request->id}/appointments", [
            'starts_at' => $date->toDateTimeString(),
            'ends_at' => $date->copy()->addHours(2)->toDateTimeString(),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['starts_at']);

        $this->assertEquals('The tradie is not available on this date.', $response->json('errors.starts_at.0'));
    }

    public function test_weekly_availability_allows_appointment(): void
    {
        $request = $this->setupQuoteAndRequest($this->customer);
        $date = Carbon::now()->addDays(2)->setTime(10, 0, 0);

        TradieAvailability::create([
            'tradie_id' => $this->tradieProfile->id,
            'day_of_week' => $date->dayOfWeek,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'is_available' => true,
        ]);

        $response = $this->actingAs($this->customer)->postJson("/api/v1/service-requests/{$request->id}/appointments", [
            'starts_at' => $date->toDateTimeString(),
            'ends_at' => $date->copy()->addHours(2)->toDateTimeString(),
        ]);

        $response->assertStatus(201);
    }

    public function test_specific_date_override_blocks_weekly_availability(): void
    {
        $request = $this->setupQuoteAndRequest($this->customer);
        $date = Carbon::now()->addDays(2)->setTime(10, 0, 0);

        TradieAvailability::create([
            'tradie_id' => $this->tradieProfile->id,
            'day_of_week' => $date->dayOfWeek,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'is_available' => true,
        ]);

        TradieAvailability::create([
            'tradie_id' => $this->tradieProfile->id,
            'specific_date' => $date->toDateString(),
            'is_available' => false,
        ]);

        $response = $this->actingAs($this->customer)->postJson("/api/v1/service-requests/{$request->id}/appointments", [
            'starts_at' => $date->toDateTimeString(),
            'ends_at' => $date->copy()->addHours(2)->toDateTimeString(),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['starts_at']);
    }

    public function test_concurrent_overlapping_appointments_race_condition_is_prevented(): void
    {
        $request1 = $this->setupQuoteAndRequest($this->customer);
        $request2 = $this->setupQuoteAndRequest($this->customer2);

        $date = Carbon::now()->addDays(2)->setTime(10, 0, 0);

        TradieAvailability::create([
            'tradie_id' => $this->tradieProfile->id,
            'specific_date' => $date->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'is_available' => true,
        ]);

        // Customer 1 books 10am - 12pm
        $this->actingAs($this->customer)->postJson("/api/v1/service-requests/{$request1->id}/appointments", [
            'starts_at' => $date->toDateTimeString(),
            'ends_at' => $date->copy()->addHours(2)->toDateTimeString(),
        ])->assertStatus(201);

        // Customer 2 tries to book 11am - 1pm -> Conflict!
        $response = $this->actingAs($this->customer2)->postJson("/api/v1/service-requests/{$request2->id}/appointments", [
            'starts_at' => $date->copy()->addHour()->toDateTimeString(),
            'ends_at' => $date->copy()->addHours(3)->toDateTimeString(),
        ]);

        $response->assertStatus(422);
        $this->assertEquals('The tradie is already booked during this time.', $response->json('errors.starts_at.0'));

        // Assert exactly ONE corresponding job exists for the interval (the successful one)
        $this->assertEquals(1, Job::where('tradie_id', $this->tradieProfile->id)
            ->whereHas('appointment', function ($q) use ($date) {
                $q->where('starts_at', $date->toDateTimeString());
            })->count());

        // Customer 2 tries to book 12pm - 2pm -> Adjacent, Allowed!
        $response = $this->actingAs($this->customer2)->postJson("/api/v1/service-requests/{$request2->id}/appointments", [
            'starts_at' => $date->copy()->addHours(2)->toDateTimeString(),
            'ends_at' => $date->copy()->addHours(4)->toDateTimeString(),
        ]);

        $response->assertStatus(201);
    }
}
