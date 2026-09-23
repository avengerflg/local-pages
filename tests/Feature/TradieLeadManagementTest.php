<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\RequestAnswer;
use App\Models\RequestAttachment;
use App\Models\RequestTradie;
use App\Models\Service;
use App\Models\ServiceQuestion;
use App\Models\ServiceQuestionOption;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TradieLeadManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_tradie_leads(): void
    {
        $response = $this->getJson('/api/v1/tradie/leads');
        $response->assertUnauthorized();

        $detailResponse = $this->getJson('/api/v1/tradie/leads/1');
        $detailResponse->assertUnauthorized();
    }

    public function test_customer_cannot_access_tradie_leads(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/leads');
        $response->assertForbidden();

        $detailResponse = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/leads/1');
        $detailResponse->assertForbidden();
    }

    public function test_tradie_without_profile_receives_not_found(): void
    {
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/tradie/leads');

        $response->assertNotFound();
    }

    public function test_tradie_can_view_own_assigned_leads(): void
    {
        // 1. Setup Customer & Service Request
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['name' => 'Plumbing', 'status' => 'active']);
        $location = Location::factory()->create(['name' => 'Sydney', 'postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'title' => 'Fix leaking tap',
            'description' => 'Kitchen tap is dripping',
            'status' => 'matching',
            'submitted_at' => now(),
        ]);

        // 2. Setup Tradie 1 (Authenticated)
        $tradieUser1 = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile1 = TradieProfile::factory()->create([
            'user_id' => $tradieUser1->id,
            'business_name' => 'Sydney Pro Plumbing',
            'verification_status' => 'verified',
        ]);

        // Assign Lead to Tradie 1
        $lead1 = RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile1->id,
            'status' => 'selected',
            'selected_at' => now(),
        ]);

        // 3. Setup Tradie 2 (Other)
        $tradieUser2 = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile2 = TradieProfile::factory()->create([
            'user_id' => $tradieUser2->id,
            'business_name' => 'Other Tradie Co',
            'verification_status' => 'verified',
        ]);

        // Another request assigned only to Tradie 2
        $serviceRequest2 = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'matching',
        ]);

        $lead2 = RequestTradie::create([
            'request_id' => $serviceRequest2->id,
            'tradie_id' => $tradieProfile2->id,
            'status' => 'selected',
            'selected_at' => now(),
        ]);

        // 4. Tradie 1 requests their lead list
        $response = $this->actingAs($tradieUser1, 'sanctum')
            ->getJson('/api/v1/tradie/leads');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $lead1->id)
            ->assertJsonPath('data.0.request_id', $serviceRequest->id)
            ->assertJsonPath('data.0.lead_status', 'selected')
            ->assertJsonPath('data.0.service_request.id', $serviceRequest->id)
            ->assertJsonPath('data.0.service_request.title', 'Fix leaking tap')
            ->assertJsonPath('data.0.service_request.service.name', 'Plumbing')
            ->assertJsonPath('data.0.service_request.location.name', 'Sydney')
            ->assertJsonPath('data.0.service_request.customer.id', $customer->id)
            ->assertJsonPath('data.0.service_request.customer.name', $customer->name)
            ->assertJsonMissing(['email' => $customer->email])
            ->assertJsonMissing(['password'])
            ->assertJsonMissing(['remember_token']);
    }

    public function test_tradie_leads_pagination_works(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['status' => 'active']);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'verification_status' => 'verified',
        ]);

        // Create 25 leads
        for ($i = 1; $i <= 25; $i++) {
            $req = ServiceRequest::factory()->create([
                'customer_id' => $customer->id,
                'service_id' => $service->id,
                'location_id' => $location->id,
                'postcode' => '2000',
                'status' => 'matching',
            ]);

            RequestTradie::create([
                'request_id' => $req->id,
                'tradie_id' => $tradieProfile->id,
                'status' => 'selected',
                'selected_at' => now(),
            ]);
        }

        // Request with per_page = 10
        $response = $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/tradie/leads?per_page=10');

        $response->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.total', 25)
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.last_page', 3);
    }

    public function test_tradie_can_view_own_lead_detail_with_answers_and_attachments(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['name' => 'Electrical', 'status' => 'active']);
        $location = Location::factory()->create(['name' => 'Parramatta', 'postcode' => '2150', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2150',
            'title' => 'Switchboard Upgrade',
            'description' => 'Need 3-phase switchboard upgrade',
            'status' => 'matching',
            'submitted_at' => now(),
        ]);

        // Add service questions and answers
        $q1 = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_text' => 'Property Type',
            'question_type' => 'single_choice',
            'sort_order' => 1,
        ]);
        $opt1 = ServiceQuestionOption::factory()->create([
            'question_id' => $q1->id,
            'label' => 'Residential House',
            'value' => 'residential_house',
        ]);

        RequestAnswer::create([
            'request_id' => $serviceRequest->id,
            'question_id' => $q1->id,
            'selected_option_id' => $opt1->id,
            'answer_text' => 'Residential House',
        ]);

        $q2 = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_text' => 'Additional Details',
            'question_type' => 'text',
            'sort_order' => 2,
        ]);

        RequestAnswer::create([
            'request_id' => $serviceRequest->id,
            'question_id' => $q2->id,
            'answer_text' => 'House built in 1980s with old fuse box',
        ]);

        // Add attachment
        $attachment = RequestAttachment::create([
            'request_id' => $serviceRequest->id,
            'file_path' => 'request-attachments/test_image.jpg',
            'original_name' => 'switchboard.jpg',
            'mime_type' => 'image/jpeg',
            'file_size' => 102400,
        ]);

        // Setup Tradie
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'business_name' => 'Apex Electrics',
            'verification_status' => 'verified',
        ]);

        $lead = RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
            'selected_at' => now(),
        ]);

        // Request detail
        $response = $this->actingAs($tradieUser, 'sanctum')
            ->getJson("/api/v1/tradie/leads/{$lead->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $lead->id)
            ->assertJsonPath('data.request_id', $serviceRequest->id)
            ->assertJsonPath('data.lead_status', 'selected')
            ->assertJsonPath('data.service_request.title', 'Switchboard Upgrade')
            ->assertJsonPath('data.service_request.service.name', 'Electrical')
            ->assertJsonPath('data.service_request.location.name', 'Parramatta')
            ->assertJsonPath('data.service_request.customer.id', $customer->id)
            ->assertJsonPath('data.service_request.customer.name', $customer->name)
            ->assertJsonCount(2, 'data.service_request.answers')
            ->assertJsonPath('data.service_request.answers.0.question_text', 'Property Type')
            ->assertJsonPath('data.service_request.answers.0.selected_option.label', 'Residential House')
            ->assertJsonPath('data.service_request.answers.1.question_text', 'Additional Details')
            ->assertJsonPath('data.service_request.answers.1.answer_text', 'House built in 1980s with old fuse box')
            ->assertJsonCount(1, 'data.service_request.attachments')
            ->assertJsonPath('data.service_request.attachments.0.original_name', 'switchboard.jpg')
            ->assertJsonPath('data.service_request.attachments.0.mime_type', 'image/jpeg')
            ->assertJsonPath('data.service_request.attachments.0.file_size', 102400);
    }

    public function test_tradie_cannot_access_another_tradies_lead(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'matching',
        ]);

        // Tradie A
        $tradieUserA = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfileA = TradieProfile::factory()->create(['user_id' => $tradieUserA->id]);

        // Tradie B
        $tradieUserB = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfileB = TradieProfile::factory()->create(['user_id' => $tradieUserB->id]);

        // Lead assigned to Tradie B
        $leadB = RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfileB->id,
            'status' => 'selected',
            'selected_at' => now(),
        ]);

        // Tradie A attempts to access Lead B
        $response = $this->actingAs($tradieUserA, 'sanctum')
            ->getJson("/api/v1/tradie/leads/{$leadB->id}");

        $response->assertNotFound();
    }

    public function test_tradie_accessing_nonexistent_lead_returns_not_found(): void
    {
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/tradie/leads/999999');

        $response->assertNotFound();
    }
}
