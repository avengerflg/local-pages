<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\Location;
use App\Models\Quote;
use App\Models\RequestTradie;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentAndJobLifecycleTest extends TestCase
{
    use RefreshDatabase;

    /*
    |--------------------------------------------------------------------------
    | 1. Unauthenticated & Role Access Tests
    |--------------------------------------------------------------------------
    */

    public function test_unauthenticated_user_cannot_access_appointment_or_job_endpoints(): void
    {
        $this->postJson('/api/v1/service-requests/1/appointments', [])->assertUnauthorized();
        $this->getJson('/api/v1/appointments/1')->assertUnauthorized();
        $this->getJson('/api/v1/jobs/1')->assertUnauthorized();
        $this->postJson('/api/v1/jobs/1/start')->assertUnauthorized();
        $this->postJson('/api/v1/jobs/1/complete')->assertUnauthorized();
    }

    public function test_tradie_cannot_schedule_appointment_via_customer_endpoint(): void
    {
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/service-requests/1/appointments', [
                'starts_at' => now()->addDays(2)->toDateTimeString(),
            ])
            ->assertForbidden();
    }

    public function test_customer_cannot_start_or_complete_job(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/jobs/1/start')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/jobs/1/complete')
            ->assertForbidden();
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Appointment & Job Creation Tests
    |--------------------------------------------------------------------------
    */

    public function test_customer_can_schedule_appointment_for_quote_accepted_request(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'quote_accepted',
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'business_name' => 'Fast Fix Plumbing',
        ]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        $acceptedQuote = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 350.00,
            'description' => 'Fix leaking kitchen sink',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        $startsAt = now()->addDays(2)->setHour(10)->setMinute(0)->setSecond(0);
        $endsAt = now()->addDays(2)->setHour(12)->setMinute(0)->setSecond(0);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                'starts_at' => $startsAt->toDateTimeString(),
                'ends_at' => $endsAt->toDateTimeString(),
                'notes' => 'Please ring the doorbell upon arrival.',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.request_id', $serviceRequest->id)
            ->assertJsonPath('data.quote_id', $acceptedQuote->id)
            ->assertJsonPath('data.customer.id', $customer->id)
            ->assertJsonPath('data.tradie.id', $tradieProfile->id)
            ->assertJsonPath('data.status', 'scheduled')
            ->assertJsonPath('data.notes', 'Please ring the doorbell upon arrival.')
            ->assertJsonPath('data.job.status', 'scheduled');

        $appointmentId = $response->json('data.id');

        // Check appointment in database
        $this->assertDatabaseHas('appointments', [
            'id' => $appointmentId,
            'request_id' => $serviceRequest->id,
            'quote_id' => $acceptedQuote->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        // Check executing job created in database
        $this->assertDatabaseHas('jobs', [
            'request_id' => $serviceRequest->id,
            'appointment_id' => $appointmentId,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        // Check service request status transitioned to scheduled
        $this->assertEquals('scheduled', $serviceRequest->fresh()->status);
    }

    public function test_customer_cannot_schedule_appointment_for_non_quote_accepted_request(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $ineligibleStatuses = ['submitted', 'matching', 'quoting', 'scheduled', 'in_progress', 'completed', 'cancelled'];

        foreach ($ineligibleStatuses as $status) {
            $serviceRequest = ServiceRequest::factory()->create([
                'customer_id' => $customer->id,
                'service_id' => $service->id,
                'status' => $status,
            ]);

            $response = $this->actingAs($customer, 'sanctum')
                ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                    'starts_at' => now()->addDays(1)->toDateTimeString(),
                ]);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['request_id']);
        }
    }

    public function test_customer_cannot_schedule_duplicate_appointment(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'quote_accepted',
        ]);

        $tradieProfile = TradieProfile::factory()->create();

        Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 200.00,
            'description' => 'Electrical fix',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        // First appointment schedules successfully
        $res1 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                'starts_at' => now()->addDays(2)->toDateTimeString(),
            ]);
        $res1->assertCreated();

        // Attempting to schedule second appointment fails
        $res2 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                'starts_at' => now()->addDays(3)->toDateTimeString(),
            ]);
        $res2->assertStatus(422)
            ->assertJsonValidationErrors(['request_id']);
    }

    public function test_unrelated_customer_cannot_schedule_appointment(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customerA->id,
            'service_id' => $service->id,
            'status' => 'quote_accepted',
        ]);

        $this->actingAs($customerB, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                'starts_at' => now()->addDays(2)->toDateTimeString(),
            ])
            ->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Appointment Viewing Authorization Tests
    |--------------------------------------------------------------------------
    */

    public function test_owning_customer_and_accepted_tradie_can_view_appointment(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $quote = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 500.00,
            'description' => 'Full service',
            'status' => 'accepted',
        ]);

        $appointment = Appointment::create([
            'request_id' => $serviceRequest->id,
            'quote_id' => $quote->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'starts_at' => now()->addDays(1),
            'status' => 'scheduled',
            'notes' => 'Side gate is unlocked.',
        ]);

        // Customer views appointment
        $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/appointments/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $appointment->id)
            ->assertJsonPath('data.notes', 'Side gate is unlocked.');

        // Tradie views appointment
        $this->actingAs($tradieUser, 'sanctum')
            ->getJson("/api/v1/appointments/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $appointment->id);

        // Unrelated customer cannot view
        $unrelatedCustomer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($unrelatedCustomer, 'sanctum')
            ->getJson("/api/v1/appointments/{$appointment->id}")
            ->assertNotFound();

        // Unrelated tradie cannot view
        $unrelatedTradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $unrelatedTradieUser->id]);
        $this->actingAs($unrelatedTradieUser, 'sanctum')
            ->getJson("/api/v1/appointments/{$appointment->id}")
            ->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Job Lifecycle & Execution Tests
    |--------------------------------------------------------------------------
    */

    public function test_assigned_tradie_can_start_and_complete_job(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'scheduled',
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $quote = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 400.00,
            'description' => 'Install lights',
            'status' => 'accepted',
        ]);

        $appointment = Appointment::create([
            'request_id' => $serviceRequest->id,
            'quote_id' => $quote->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'starts_at' => now()->addDays(1),
            'status' => 'scheduled',
        ]);

        $job = Job::create([
            'request_id' => $serviceRequest->id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        // Tradie views job
        $this->actingAs($tradieUser, 'sanctum')
            ->getJson("/api/v1/jobs/{$job->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $job->id)
            ->assertJsonPath('data.status', 'scheduled');

        // Customer views job
        $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/jobs/{$job->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $job->id);

        // 1. Tradie starts the job (scheduled -> in_progress)
        $startRes = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/start");

        $startRes->assertOk()
            ->assertJsonPath('data.id', $job->id)
            ->assertJsonPath('data.status', 'in_progress');

        $this->assertEquals('in_progress', $job->fresh()->status);
        $this->assertNotNull($job->fresh()->started_at);
        $this->assertEquals('in_progress', $serviceRequest->fresh()->status);

        // 2. Tradie completes the job (in_progress -> completed)
        $completeRes = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/complete");

        $completeRes->assertOk()
            ->assertJsonPath('data.id', $job->id)
            ->assertJsonPath('data.status', 'completed');

        $this->assertEquals('completed', $job->fresh()->status);
        $this->assertNotNull($job->fresh()->completed_at);
        $this->assertEquals('completed', $appointment->fresh()->status);
        $this->assertEquals('completed', $serviceRequest->fresh()->status);
    }

    public function test_invalid_job_state_transitions_are_rejected(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        // A job in scheduled status cannot jump directly to completed
        $jobScheduled = Job::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$jobScheduled->id}/complete")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);

        // A job in completed status cannot be restarted
        $jobCompleted = Job::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'completed',
            'started_at' => now()->subHours(2),
            'completed_at' => now()->subHour(),
        ]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$jobCompleted->id}/start")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$jobCompleted->id}/complete")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_unrelated_tradie_cannot_start_or_complete_job(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieProfileA = TradieProfile::factory()->create();
        $tradieUserB = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUserB->id]);

        $job = Job::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfileA->id,
            'status' => 'scheduled',
        ]);

        $this->actingAs($tradieUserB, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/start")
            ->assertNotFound();

        $this->actingAs($tradieUserB, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/complete")
            ->assertNotFound();
    }
}
