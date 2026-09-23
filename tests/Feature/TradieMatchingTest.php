<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\RequestTradie;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TradieMatchingTest extends TestCase
{
    use RefreshDatabase;

    public function test_tradie_offering_requested_service_and_location_is_matched(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2026', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2026',
            'status' => 'submitted',
        ]);

        // Tradie offering service & location
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'business_name' => 'Matching Plumber',
            'verification_status' => 'verified',
        ]);
        $tradieProfile->services()->attach($service->id);
        $tradieProfile->serviceAreas()->attach($location->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies");

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $tradieProfile->id)
            ->assertJsonPath('data.0.business_name', 'Matching Plumber');
    }

    public function test_tradie_not_offering_requested_service_is_excluded(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $serviceRequested = Service::factory()->create(['status' => 'active']);
        $otherService = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2026', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $serviceRequested->id,
            'location_id' => $location->id,
            'postcode' => '2026',
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'verification_status' => 'verified',
        ]);
        $tradieProfile->services()->attach($otherService->id);
        $tradieProfile->serviceAreas()->attach($location->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies");

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_tradie_outside_service_area_is_excluded(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $locationRequest = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);
        $locationOther = Location::factory()->create(['postcode' => '3000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $locationRequest->id,
            'postcode' => '2000',
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'verification_status' => 'verified',
        ]);
        $tradieProfile->services()->attach($service->id);
        $tradieProfile->serviceAreas()->attach($locationOther->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies");

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_unverified_or_suspended_tradie_is_excluded(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
        ]);

        // Unverified tradie
        $unverifiedUser = User::factory()->tradie()->create(['status' => 'active']);
        $unverifiedProfile = TradieProfile::factory()->create([
            'user_id' => $unverifiedUser->id,
            'verification_status' => 'pending',
        ]);
        $unverifiedProfile->services()->attach($service->id);
        $unverifiedProfile->serviceAreas()->attach($location->id);

        // Suspended tradie
        $suspendedUser = User::factory()->tradie()->create(['status' => 'suspended']);
        $suspendedProfile = TradieProfile::factory()->create([
            'user_id' => $suspendedUser->id,
            'verification_status' => 'verified',
        ]);
        $suspendedProfile->services()->attach($service->id);
        $suspendedProfile->serviceAreas()->attach($location->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies");

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_customer_cannot_view_matches_for_another_customers_request(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $requestB = ServiceRequest::factory()->create([
            'customer_id' => $customerB->id,
            'service_id' => $service->id,
        ]);

        $response = $this->actingAs($customerA, 'sanctum')
            ->getJson("/api/v1/service-requests/{$requestB->id}/matching-tradies");

        $response->assertNotFound();
    }

    public function test_unauthenticated_user_cannot_access_matching(): void
    {
        $service = Service::factory()->create();
        $request = ServiceRequest::factory()->create(['service_id' => $service->id]);

        $response = $this->getJson("/api/v1/service-requests/{$request->id}/matching-tradies");

        $response->assertUnauthorized();
    }

    public function test_tradie_user_cannot_access_matching(): void
    {
        $tradie = User::factory()->tradie()->create();
        $service = Service::factory()->create();
        $request = ServiceRequest::factory()->create(['service_id' => $service->id]);

        $response = $this->actingAs($tradie, 'sanctum')
            ->getJson("/api/v1/service-requests/{$request->id}/matching-tradies");

        $response->assertForbidden();
    }

    public function test_empty_matches_returns_clean_empty_response(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'postcode' => '9999',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies");

        $response->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('meta.total', 0);
    }

    public function test_customer_can_select_multiple_eligible_tradies(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'submitted',
        ]);

        // Tradie 1
        $t1User = User::factory()->tradie()->create(['status' => 'active']);
        $t1 = TradieProfile::factory()->create(['user_id' => $t1User->id, 'verification_status' => 'verified']);
        $t1->services()->attach($service->id);
        $t1->serviceAreas()->attach($location->id);

        // Tradie 2
        $t2User = User::factory()->tradie()->create(['status' => 'active']);
        $t2 = TradieProfile::factory()->create(['user_id' => $t2User->id, 'verification_status' => 'verified']);
        $t2->services()->attach($service->id);
        $t2->serviceAreas()->attach($location->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies", [
                'tradie_ids' => [$t1->id, $t2->id],
            ]);

        $response->assertCreated()
            ->assertJsonCount(2, 'data');

        $this->assertDatabaseHas('request_tradies', [
            'request_id' => $serviceRequest->id,
            'tradie_id' => $t1->id,
            'status' => 'selected',
        ]);

        $this->assertDatabaseHas('request_tradies', [
            'request_id' => $serviceRequest->id,
            'tradie_id' => $t2->id,
            'status' => 'selected',
        ]);

        $this->assertEquals('matching', $serviceRequest->fresh()->status);
    }

    public function test_customer_cannot_select_ineligible_or_unrelated_tradies(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $serviceA = Service::factory()->create(['status' => 'active']);
        $serviceB = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $serviceA->id,
            'location_id' => $location->id,
            'postcode' => '2000',
        ]);

        // Tradie offers Service B only
        $tUser = User::factory()->tradie()->create(['status' => 'active']);
        $ineligibleTradie = TradieProfile::factory()->create(['user_id' => $tUser->id, 'verification_status' => 'verified']);
        $ineligibleTradie->services()->attach($serviceB->id);
        $ineligibleTradie->serviceAreas()->attach($location->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies", [
                'tradie_ids' => [$ineligibleTradie->id],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tradie_ids']);

        $this->assertDatabaseMissing('request_tradies', [
            'request_id' => $serviceRequest->id,
            'tradie_id' => $ineligibleTradie->id,
        ]);
    }

    public function test_customer_cannot_select_tradies_for_another_customers_request(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $requestB = ServiceRequest::factory()->create([
            'customer_id' => $customerB->id,
            'service_id' => $service->id,
        ]);

        $tradie = TradieProfile::factory()->create(['verification_status' => 'verified']);

        $response = $this->actingAs($customerA, 'sanctum')
            ->postJson("/api/v1/service-requests/{$requestB->id}/matching-tradies", [
                'tradie_ids' => [$tradie->id],
            ]);

        $response->assertNotFound();
    }

    public function test_duplicate_tradie_selections_are_handled_safely(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
        ]);

        $tUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradie = TradieProfile::factory()->create(['user_id' => $tUser->id, 'verification_status' => 'verified']);
        $tradie->services()->attach($service->id);
        $tradie->serviceAreas()->attach($location->id);

        // Submit duplicate ID in same payload
        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies", [
                'tradie_ids' => [$tradie->id, $tradie->id],
            ]);

        $response->assertCreated();
        $this->assertCount(1, RequestTradie::where('request_id', $serviceRequest->id)->get());
    }

    public function test_customer_cannot_select_tradies_for_completed_or_cancelled_request(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $completedRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'completed',
        ]);

        $tUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradie = TradieProfile::factory()->create(['user_id' => $tUser->id, 'verification_status' => 'verified']);
        $tradie->services()->attach($service->id);
        $tradie->serviceAreas()->attach($location->id);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$completedRequest->id}/matching-tradies", [
                'tradie_ids' => [$tradie->id],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_request']);
    }

    public function test_repeated_tradie_selection_calls_are_idempotent(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'submitted',
        ]);

        $t1User = User::factory()->tradie()->create(['status' => 'active']);
        $t1 = TradieProfile::factory()->create(['user_id' => $t1User->id, 'verification_status' => 'verified']);
        $t1->services()->attach($service->id);
        $t1->serviceAreas()->attach($location->id);

        $t2User = User::factory()->tradie()->create(['status' => 'active']);
        $t2 = TradieProfile::factory()->create(['user_id' => $t2User->id, 'verification_status' => 'verified']);
        $t2->services()->attach($service->id);
        $t2->serviceAreas()->attach($location->id);

        // First call: select t1
        $res1 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies", [
                'tradie_ids' => [$t1->id],
            ]);
        $res1->assertCreated()->assertJsonCount(1, 'data');
        $this->assertCount(1, RequestTradie::where('request_id', $serviceRequest->id)->get());

        // Second call: select t1 again alongside t2
        $res2 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies", [
                'tradie_ids' => [$t1->id, $t2->id],
            ]);
        $res2->assertCreated()->assertJsonCount(2, 'data');

        // Total count in database must be exactly 2 with no duplicates
        $this->assertCount(2, RequestTradie::where('request_id', $serviceRequest->id)->get());
    }
}
