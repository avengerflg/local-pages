<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\Quote;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase19Test extends TestCase
{
    use RefreshDatabase;

    protected User $customer;

    protected User $tradie;

    protected User $admin;

    protected TradieProfile $tradieProfile;

    protected ServiceRequest $serviceRequest;

    protected Quote $quote;

    protected Appointment $appointment;

    protected Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->tradie = User::factory()->create(['role' => 'tradie', 'status' => 'active']);
        $this->admin = User::factory()->create(['role' => 'admin']);

        $this->tradieProfile = TradieProfile::factory()->create([
            'user_id' => $this->tradie->id,
            'verification_status' => 'verified',
        ]);

        $this->setupScheduledJob();
    }

    protected function setupScheduledJob()
    {
        $this->serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => 'quote_accepted',
        ]);

        $this->quote = Quote::factory()->create([
            'request_id' => $this->serviceRequest->id,
            'tradie_id' => $this->tradieProfile->id,
            'status' => 'accepted',
        ]);

        $this->appointment = Appointment::factory()->create([
            'request_id' => $this->serviceRequest->id,
            'quote_id' => $this->quote->id,
            'customer_id' => $this->customer->id,
            'tradie_id' => $this->tradieProfile->id,
            'status' => 'scheduled',
            'starts_at' => now()->addDays(2)->toDateTimeString(),
        ]);

        $this->job = Job::factory()->create([
            'request_id' => $this->serviceRequest->id,
            'tradie_id' => $this->tradieProfile->id,
            'appointment_id' => $this->appointment->id,
            'status' => 'scheduled',
        ]);
    }

    public function test_customer_can_cancel_scheduled_job()
    {
        $response = $this->actingAs($this->customer, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");

        $response->assertStatus(200);
        $this->assertEquals('cancelled', $response->json('data.status'));

        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'status' => 'cancelled']);
        $this->assertDatabaseHas('appointments', ['id' => $this->appointment->id, 'status' => 'cancelled']);
        $this->assertDatabaseHas('service_requests', ['id' => $this->serviceRequest->id, 'status' => 'cancelled']);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->tradie->id,
            'type' => 'appointment_cancelled',
        ]);
    }

    public function test_tradie_can_cancel_scheduled_job()
    {
        $response = $this->actingAs($this->tradie, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");

        $response->assertStatus(200);

        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'status' => 'cancelled']);
        $this->assertDatabaseHas('service_requests', ['id' => $this->serviceRequest->id, 'status' => 'cancelled']);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->customer->id,
            'type' => 'appointment_cancelled',
        ]);
    }

    public function test_admin_can_cancel_scheduled_job()
    {
        $response = $this->actingAs($this->admin, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");
        $response->assertStatus(200);

        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'status' => 'cancelled']);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->customer->id,
            'type' => 'appointment_cancelled',
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->tradie->id,
            'type' => 'appointment_cancelled',
        ]);
    }

    public function test_unauthorized_user_cannot_cancel_job()
    {
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $response = $this->actingAs($otherCustomer, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");
        $response->assertStatus(403);
    }

    public function test_cannot_cancel_in_progress_job()
    {
        $this->job->update(['status' => 'in_progress']);
        $response = $this->actingAs($this->customer, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");
        $response->assertStatus(422);
    }

    public function test_cannot_cancel_completed_job()
    {
        $this->job->update(['status' => 'completed']);
        $response = $this->actingAs($this->tradie, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");
        $response->assertStatus(422);
    }

    public function test_job_completion_synchronizes_service_request_status()
    {
        $this->job->update(['status' => 'in_progress']);

        $response = $this->actingAs($this->tradie, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/complete");
        $response->assertStatus(200);

        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'status' => 'completed']);
        $this->assertDatabaseHas('appointments', ['id' => $this->appointment->id, 'status' => 'completed']);
        $this->assertDatabaseHas('service_requests', ['id' => $this->serviceRequest->id, 'status' => 'completed']);
    }

    public function test_cancelled_job_cannot_be_reviewed()
    {
        $this->actingAs($this->customer, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/cancel");

        $response = $this->actingAs($this->customer, 'sanctum')->postJson("/api/v1/jobs/{$this->job->id}/reviews", [
            'rating' => 5,
            'comment' => 'Great!',
        ]);

        $response->assertStatus(422);
        // Assuming review controller checks if job is completed
    }
}
