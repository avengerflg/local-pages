<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\Quote;
use App\Models\QuoteAttachment;
use App\Models\RequestTradie;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class QuoteManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        Storage::fake('public');
    }

    /*
    |--------------------------------------------------------------------------
    | 1. Unauthenticated & Role Access Tests
    |--------------------------------------------------------------------------
    */

    public function test_unauthenticated_user_cannot_access_quote_endpoints(): void
    {
        $this->postJson('/api/v1/service-requests/1/quotes', [])->assertUnauthorized();
        $this->getJson('/api/v1/service-requests/1/quotes')->assertUnauthorized();
        $this->getJson('/api/v1/quotes/1')->assertUnauthorized();
        $this->postJson('/api/v1/quotes/1/accept')->assertUnauthorized();
        $this->postJson('/api/v1/quotes/1/reject')->assertUnauthorized();
    }

    public function test_customer_cannot_create_quote(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests/1/quotes', [
                'amount' => 250.00,
                'description' => 'Customer trying to quote',
            ]);

        $response->assertForbidden();
    }

    public function test_tradie_cannot_list_or_accept_or_reject_quotes_via_customer_routes(): void
    {
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/service-requests/1/quotes')
            ->assertForbidden();

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/quotes/1/accept')
            ->assertForbidden();

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/quotes/1/reject')
            ->assertForbidden();
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Tradie Quote Submission Tests
    |--------------------------------------------------------------------------
    */

    public function test_selected_tradie_can_submit_quote(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'matching',
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'business_name' => 'Bondi Plumbers',
        ]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        $file = UploadedFile::fake()->create('quote_breakdown.pdf', 300, 'application/pdf');

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 450.50,
                'description' => 'Supply and installation of replacement piping with copper valves.',
                'valid_until' => now()->addDays(14)->format('Y-m-d'),
                'terms_notes' => '50% on start, 50% on completion. Warranty for 12 months.',
                'estimated_duration' => '4 hours',
                'proposed_date' => now()->addDays(3)->format('Y-m-d'),
                'attachments' => [$file],
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.request_id', $serviceRequest->id)
            ->assertJsonPath('data.tradie.id', $tradieProfile->id)
            ->assertJsonPath('data.tradie.business_name', 'Bondi Plumbers')
            ->assertJsonPath('data.amount', '450.50')
            ->assertJsonPath('data.description', 'Supply and installation of replacement piping with copper valves.')
            ->assertJsonPath('data.estimated_duration', '4 hours')
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonCount(1, 'data.attachments')
            ->assertJsonPath('data.attachments.0.original_name', 'quote_breakdown.pdf')
            ->assertJsonPath('data.attachments.0.mime_type', 'application/pdf')
            ->assertJsonMissingPath('data.attachments.0.file_path')
            ->assertJsonMissingPath('data.attachments.0.url');

        $this->assertDatabaseHas('quotes', [
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 450.50,
            'status' => 'pending',
        ]);

        // Service request transitioned to quoting
        $this->assertEquals('quoting', $serviceRequest->fresh()->status);

        // Attachment stored on private 'local' disk
        $attachment = QuoteAttachment::first();
        $this->assertNotNull($attachment);
        Storage::disk('local')->assertExists($attachment->file_path);
        Storage::disk('public')->assertMissing($attachment->file_path);
    }

    public function test_tradie_can_submit_multiple_quotes_if_schema_permits(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        // Submit first quote
        $res1 = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 400.00,
                'description' => 'Initial quote offer',
            ]);
        $res1->assertCreated();

        // Submit revised / second quote (permitted as schema has no unique constraint)
        $res2 = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 380.00,
                'description' => 'Revised discounted quote',
            ]);
        $res2->assertCreated();

        $this->assertCount(2, Quote::where('request_id', $serviceRequest->id)->where('tradie_id', $tradieProfile->id)->get());
    }

    public function test_unselected_tradie_cannot_submit_quote(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 500.00,
                'description' => 'Uninvited quote attempt',
            ]);

        $response->assertNotFound();
    }

    public function test_tradie_cannot_submit_quote_for_ineligible_request(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'completed',
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 500.00,
                'description' => 'Quote on completed job',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['request_id']);
    }

    public function test_quote_input_validation_rules(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        // Empty payload
        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['amount', 'description']);

        // Invalid amount (negative, non-numeric)
        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => -10,
                'description' => 'Negative amount test',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);

        // Past valid_until date
        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 100,
                'description' => 'Past validity test',
                'valid_until' => now()->subDay()->format('Y-m-d'),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['valid_until']);

        // Invalid attachment mimetype
        $invalidFile = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');
        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'amount' => 100,
                'description' => 'Executable file test',
                'attachments' => [$invalidFile],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['attachments.0']);
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Customer Quote Listing & Comparison Tests
    |--------------------------------------------------------------------------
    */

    public function test_customer_can_list_and_compare_quotes_for_own_request(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradie1 = TradieProfile::factory()->create(['business_name' => 'Alpha Electric']);
        $tradie2 = TradieProfile::factory()->create(['business_name' => 'Beta Solar']);

        $q1 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie1->id,
            'amount' => 300.00,
            'description' => 'Alpha quote',
            'status' => 'pending',
        ]);

        $q2 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie2->id,
            'amount' => 450.00,
            'description' => 'Beta quote',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/quotes");

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $q2->id)
            ->assertJsonPath('data.0.amount', '450.00')
            ->assertJsonPath('data.1.id', $q1->id)
            ->assertJsonPath('data.1.amount', '300.00');
    }

    public function test_customer_quote_list_is_paginated(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradie = TradieProfile::factory()->create();

        Quote::create(['request_id' => $serviceRequest->id, 'tradie_id' => $tradie->id, 'amount' => 100, 'description' => 'Q1', 'status' => 'pending']);
        Quote::create(['request_id' => $serviceRequest->id, 'tradie_id' => $tradie->id, 'amount' => 200, 'description' => 'Q2', 'status' => 'pending']);
        Quote::create(['request_id' => $serviceRequest->id, 'tradie_id' => $tradie->id, 'amount' => 300, 'description' => 'Q3', 'status' => 'pending']);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/quotes?per_page=2");

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonPath('meta.current_page', 1);
    }

    public function test_other_customer_cannot_list_quotes_for_another_customers_request(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customerA->id, 'service_id' => $service->id]);

        $this->actingAs($customerB, 'sanctum')
            ->getJson("/api/v1/service-requests/{$serviceRequest->id}/quotes")
            ->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Single Quote View Authorization Tests
    |--------------------------------------------------------------------------
    */

    public function test_quote_owner_and_request_customer_can_view_single_quote(): void
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
            'description' => 'Standard replacement',
            'status' => 'pending',
        ]);

        // Request owning customer can view
        $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/quotes/{$quote->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $quote->id)
            ->assertJsonPath('data.amount', '500.00');

        // Quote issuing tradie can view
        $this->actingAs($tradieUser, 'sanctum')
            ->getJson("/api/v1/quotes/{$quote->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $quote->id);

        // Unrelated customer cannot view
        $unrelatedCustomer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($unrelatedCustomer, 'sanctum')
            ->getJson("/api/v1/quotes/{$quote->id}")
            ->assertNotFound();

        // Unrelated tradie cannot view
        $unrelatedTradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $unrelatedTradieUser->id]);

        $this->actingAs($unrelatedTradieUser, 'sanctum')
            ->getJson("/api/v1/quotes/{$quote->id}")
            ->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Quote Acceptance & Atomic Rejection Tests
    |--------------------------------------------------------------------------
    */

    public function test_customer_can_accept_quote_and_atomically_reject_other_pending_quotes(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'quoting',
        ]);

        $tradie1 = TradieProfile::factory()->create(['business_name' => 'Tradie One']);
        $tradie2 = TradieProfile::factory()->create(['business_name' => 'Tradie Two']);
        $tradie3 = TradieProfile::factory()->create(['business_name' => 'Tradie Three']);

        $quote1 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie1->id,
            'amount' => 500.00,
            'description' => 'Quote 1',
            'status' => 'pending',
        ]);

        $quote2 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie2->id,
            'amount' => 450.00,
            'description' => 'Quote 2',
            'status' => 'pending',
        ]);

        $quote3 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie3->id,
            'amount' => 600.00,
            'description' => 'Quote 3',
            'status' => 'pending',
        ]);

        // Customer accepts quote 2
        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote2->id}/accept");

        $response->assertOk()
            ->assertJsonPath('data.id', $quote2->id)
            ->assertJsonPath('data.status', 'accepted');

        // Check quote 2 is accepted
        $this->assertEquals('accepted', $quote2->fresh()->status);
        $this->assertNotNull($quote2->fresh()->accepted_at);

        // Check quote 1 and quote 3 are rejected
        $this->assertEquals('rejected', $quote1->fresh()->status);
        $this->assertNotNull($quote1->fresh()->rejected_at);
        $this->assertEquals('rejected', $quote3->fresh()->status);
        $this->assertNotNull($quote3->fresh()->rejected_at);

        // Check service request status is quote_accepted
        $this->assertEquals('quote_accepted', $serviceRequest->fresh()->status);
    }

    public function test_concurrent_quote_acceptance_guarantees_exactly_one_accepted_quote(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'quoting',
        ]);

        $tradie1 = TradieProfile::factory()->create();
        $tradie2 = TradieProfile::factory()->create();

        $quote1 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie1->id,
            'amount' => 500.00,
            'description' => 'Quote 1',
            'status' => 'pending',
        ]);

        $quote2 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie2->id,
            'amount' => 450.00,
            'description' => 'Quote 2',
            'status' => 'pending',
        ]);

        // First acceptance succeeds
        $res1 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote1->id}/accept");
        $res1->assertOk();

        // Second acceptance on competing quote is rejected by validation / lock checks
        $res2 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote2->id}/accept");
        $res2->assertStatus(422)
            ->assertJsonValidationErrors(['quote']);

        // Verify exactly one accepted quote exists
        $this->assertEquals(1, Quote::where('request_id', $serviceRequest->id)->where('status', 'accepted')->count());
        $this->assertEquals(1, Quote::where('request_id', $serviceRequest->id)->where('status', 'rejected')->count());
        $this->assertEquals('quote_accepted', $serviceRequest->fresh()->status);
    }

    public function test_customer_cannot_accept_another_quote_after_one_is_already_accepted(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'quote_accepted',
        ]);

        $tradie1 = TradieProfile::factory()->create();
        $tradie2 = TradieProfile::factory()->create();

        $quote1 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie1->id,
            'amount' => 500.00,
            'description' => 'Quote 1',
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        $quote2 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie2->id,
            'amount' => 450.00,
            'description' => 'Quote 2',
            'status' => 'rejected',
            'rejected_at' => now(),
        ]);

        // Attempting to accept quote 2 fails
        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote2->id}/accept");

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['quote']);
    }

    public function test_unrelated_customer_cannot_accept_quote(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customerA->id, 'service_id' => $service->id]);

        $tradieProfile = TradieProfile::factory()->create();
        $quote = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 500.00,
            'description' => 'Quote',
            'status' => 'pending',
        ]);

        $this->actingAs($customerB, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote->id}/accept")
            ->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Quote Rejection Tests
    |--------------------------------------------------------------------------
    */

    public function test_customer_can_explicitly_reject_a_pending_quote(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'quoting',
        ]);

        $tradie1 = TradieProfile::factory()->create();
        $tradie2 = TradieProfile::factory()->create();

        $quote1 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie1->id,
            'amount' => 500.00,
            'description' => 'Quote to reject',
            'status' => 'pending',
        ]);

        $quote2 = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradie2->id,
            'amount' => 600.00,
            'description' => 'Quote to keep pending',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote1->id}/reject");

        $response->assertOk()
            ->assertJsonPath('data.id', $quote1->id)
            ->assertJsonPath('data.status', 'rejected');

        $this->assertEquals('rejected', $quote1->fresh()->status);
        $this->assertNotNull($quote1->fresh()->rejected_at);

        // Other quote remains pending
        $this->assertEquals('pending', $quote2->fresh()->status);
        $this->assertNull($quote2->fresh()->rejected_at);

        // Service request remains in quoting (not prematurely quote_accepted)
        $this->assertEquals('quoting', $serviceRequest->fresh()->status);

        // Rejected quote cannot subsequently be accepted
        $acceptRes = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote1->id}/accept");

        $acceptRes->assertStatus(422)
            ->assertJsonValidationErrors(['quote']);
    }

    public function test_unrelated_customer_cannot_reject_quote(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customerA->id, 'service_id' => $service->id]);

        $tradieProfile = TradieProfile::factory()->create();
        $quote = Quote::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'amount' => 500.00,
            'description' => 'Quote',
            'status' => 'pending',
        ]);

        $this->actingAs($customerB, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote->id}/reject")
            ->assertNotFound();
    }
}
