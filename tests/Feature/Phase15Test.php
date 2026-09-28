<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\Location;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class Phase15Test extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_manage_profile(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer)->getJson('/api/v1/customer/profile');
        $response->assertStatus(200);

        $response = $this->actingAs($customer)->putJson('/api/v1/customer/profile', [
            'postcode' => '2000',
            'address' => '123 Fake Street',
        ]);
        $response->assertStatus(200)
            ->assertJsonPath('data.postcode', '2000')
            ->assertJsonPath('data.address', '123 Fake Street');
    }

    public function test_public_can_search_locations_prefix_and_exact(): void
    {
        Location::factory()->create([
            'status' => 'active',
            'name' => 'Sydney',
            'postcode' => '2000',
        ]);

        Location::factory()->create([
            'status' => 'active',
            'name' => 'Perth',
            'postcode' => '6000',
        ]);

        // Prefix match on name
        $response = $this->getJson('/api/v1/locations?search=Syd');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.name', 'Sydney');

        // Substring match should fail (e.g., 'ney' for Sydney)
        $response = $this->getJson('/api/v1/locations?search=ney');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 0);

        // Exact match on postcode
        $response = $this->getJson('/api/v1/locations?search=2000');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1);

        // Substring match on postcode should fail
        $response = $this->getJson('/api/v1/locations?search=00');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 0);
    }

    public function test_customer_appointments_tenant_isolation(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);

        $tradie = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $tradie->id]);

        $requestA = ServiceRequest::factory()->create(['customer_id' => $customerA->id]);
        $appointmentA = Appointment::factory()->create([
            'request_id' => $requestA->id,
            'customer_id' => $customerA->id,
            'tradie_id' => $tradie->tradieProfile->id,
        ]);

        $requestB = ServiceRequest::factory()->create(['customer_id' => $customerB->id]);
        Appointment::factory()->create([
            'request_id' => $requestB->id,
            'customer_id' => $customerB->id,
            'tradie_id' => $tradie->tradieProfile->id,
        ]);

        $response = $this->actingAs($customerA)->getJson('/api/v1/customer/appointments');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $appointmentA->id);
    }

    public function test_tradie_appointments_tenant_isolation(): void
    {
        $tradieA = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $tradieA->id]);

        $tradieB = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $tradieB->id]);

        $customer = User::factory()->create(['role' => 'customer']);
        $request = ServiceRequest::factory()->create(['customer_id' => $customer->id]);

        $appointmentA = Appointment::factory()->create([
            'request_id' => $request->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieA->tradieProfile->id,
        ]);

        Appointment::factory()->create([
            'request_id' => $request->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieB->tradieProfile->id,
        ]);

        $response = $this->actingAs($tradieA)->getJson('/api/v1/tradie/appointments');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $appointmentA->id);
    }

    public function test_customer_jobs_tenant_isolation(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $tradie = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $tradie->id]);

        $requestA = ServiceRequest::factory()->create(['customer_id' => $customerA->id]);
        $appointmentA = Appointment::factory()->create([
            'request_id' => $requestA->id,
            'customer_id' => $customerA->id,
            'tradie_id' => $tradie->tradieProfile->id,
        ]);
        $jobA = Job::factory()->create([
            'request_id' => $requestA->id,
            'appointment_id' => $appointmentA->id,
            'tradie_id' => $tradie->tradieProfile->id,
        ]);

        $requestB = ServiceRequest::factory()->create(['customer_id' => $customerB->id]);
        $appointmentB = Appointment::factory()->create([
            'request_id' => $requestB->id,
            'customer_id' => $customerB->id,
            'tradie_id' => $tradie->tradieProfile->id,
        ]);
        Job::factory()->create([
            'request_id' => $requestB->id,
            'appointment_id' => $appointmentB->id,
            'tradie_id' => $tradie->tradieProfile->id,
        ]);

        $response = $this->actingAs($customerA)->getJson('/api/v1/customer/jobs');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $jobA->id);
    }

    public function test_tradie_jobs_tenant_isolation(): void
    {
        $tradieA = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $tradieA->id]);

        $tradieB = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $tradieB->id]);

        $customer = User::factory()->create(['role' => 'customer']);
        $request = ServiceRequest::factory()->create(['customer_id' => $customer->id]);

        $appointment = Appointment::factory()->create([
            'request_id' => $request->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieA->tradieProfile->id,
        ]);
        $jobA = Job::factory()->create([
            'request_id' => $request->id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $tradieA->tradieProfile->id,
        ]);

        Job::factory()->create([
            'request_id' => $request->id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $tradieB->tradieProfile->id,
        ]);

        $response = $this->actingAs($tradieA)->getJson('/api/v1/tradie/jobs');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $jobA->id);
    }

    public function test_customer_cannot_cancel_others_service_request(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);

        $requestA = ServiceRequest::factory()->create([
            'customer_id' => $customerA->id,
            'status' => 'submitted',
        ]);

        $response = $this->actingAs($customerB)->postJson("/api/v1/service-requests/{$requestA->id}/cancel");
        $response->assertStatus(404);

        $this->assertDatabaseHas('service_requests', [
            'id' => $requestA->id,
            'status' => 'submitted',
        ]);
    }

    public function test_customer_profile_protected_fields(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
            'status' => 'active',
        ]);

        $response = $this->actingAs($customer)->putJson('/api/v1/customer/profile', [
            'postcode' => '2000',
            'address' => '123 Fake Street',
            'role' => 'admin',
            'status' => 'suspended',
            'user_id' => 999,
            'password' => 'newpassword123',
        ]);
        $response->assertStatus(200);

        // Verify underlying User is NOT modified
        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'role' => 'customer',
            'status' => 'active',
        ]);

        $customer->refresh();
        $this->assertTrue(Hash::check('password', $customer->password));
    }

    public function test_suspended_users_cannot_access_endpoints(): void
    {
        $suspendedCustomer = User::factory()->create([
            'role' => 'customer',
            'status' => 'suspended',
        ]);

        $response = $this->actingAs($suspendedCustomer)->getJson('/api/v1/customer/profile');
        $response->assertStatus(403);

        $response = $this->actingAs($suspendedCustomer)->getJson('/api/v1/customer/appointments');
        $response->assertStatus(403);

        $suspendedTradie = User::factory()->create([
            'role' => 'tradie',
            'status' => 'suspended',
        ]);

        $response = $this->actingAs($suspendedTradie)->getJson('/api/v1/tradie/appointments');
        $response->assertStatus(403);
    }
}
