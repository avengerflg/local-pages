<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\Service;
use App\Models\ServiceQuestion;
use App\Models\ServiceQuestionOption;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ServiceRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_or_customer_can_list_active_services(): void
    {
        Service::factory()->create(['name' => 'Plumbing', 'status' => 'active']);
        Service::factory()->create(['name' => 'Electrical', 'status' => 'active']);
        Service::factory()->create(['name' => 'Inactive Service', 'status' => 'inactive']);

        $response = $this->getJson('/api/v1/services');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['name' => 'Plumbing'])
            ->assertJsonFragment(['name' => 'Electrical'])
            ->assertJsonMissing(['name' => 'Inactive Service']);
    }

    public function test_can_get_service_detail_with_questions_and_options(): void
    {
        $service = Service::factory()->create([
            'name' => 'Plumbing Services',
            'slug' => 'plumbing-services',
            'status' => 'active',
        ]);

        $q1 = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_text' => 'What type of property?',
            'question_type' => 'single_choice',
            'sort_order' => 1,
            'status' => 'active',
        ]);

        $opt1 = ServiceQuestionOption::factory()->create([
            'question_id' => $q1->id,
            'label' => 'House',
            'value' => 'house',
            'sort_order' => 1,
        ]);

        $opt2 = ServiceQuestionOption::factory()->create([
            'question_id' => $q1->id,
            'label' => 'Apartment',
            'value' => 'apartment',
            'sort_order' => 2,
        ]);

        $response = $this->getJson('/api/v1/services/plumbing-services');

        $response->assertOk()
            ->assertJsonPath('data.name', 'Plumbing Services')
            ->assertJsonPath('data.questions.0.question_text', 'What type of property?')
            ->assertJsonPath('data.questions.0.options.0.label', 'House')
            ->assertJsonPath('data.questions.0.options.1.label', 'Apartment');
    }

    public function test_inactive_service_returns_404(): void
    {
        Service::factory()->create([
            'slug' => 'secret-service',
            'status' => 'inactive',
        ]);

        $response = $this->getJson('/api/v1/services/secret-service');

        $response->assertNotFound();
    }

    public function test_customer_can_create_service_request_with_answers_and_location(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000']);

        $q1 = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_type' => 'text',
            'required' => true,
        ]);

        $q2 = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_type' => 'single_choice',
            'required' => true,
        ]);

        $opt = ServiceQuestionOption::factory()->create(['question_id' => $q2->id]);

        $payload = [
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'title' => 'Fix Leaking Pipe',
            'description' => 'Pipe leaking in the master bathroom.',
            'answers' => [
                [
                    'question_id' => $q1->id,
                    'answer_text' => 'It started 2 days ago',
                ],
                [
                    'question_id' => $q2->id,
                    'selected_option_id' => $opt->id,
                ],
            ],
        ];

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.customer_id', $customer->id)
            ->assertJsonPath('data.status', 'submitted')
            ->assertJsonPath('data.postcode', '2000')
            ->assertJsonPath('data.title', 'Fix Leaking Pipe')
            ->assertJsonCount(2, 'data.answers');

        $this->assertDatabaseHas('service_requests', [
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'status' => 'submitted',
            'postcode' => '2000',
        ]);

        $this->assertDatabaseHas('request_answers', [
            'question_id' => $q1->id,
            'answer_text' => 'It started 2 days ago',
        ]);
    }

    public function test_unauthenticated_user_cannot_create_service_request(): void
    {
        $service = Service::factory()->create(['status' => 'active']);

        $response = $this->postJson('/api/v1/service-requests', [
            'service_id' => $service->id,
            'postcode' => '2000',
        ]);

        $response->assertUnauthorized();
    }

    public function test_tradie_cannot_create_service_request(): void
    {
        $tradie = User::factory()->tradie()->create();
        $service = Service::factory()->create(['status' => 'active']);

        $response = $this->actingAs($tradie, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
            ]);

        $response->assertForbidden();
    }

    public function test_customer_cannot_spoof_customer_id(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $payload = [
            'customer_id' => $customerB->id,
            'service_id' => $service->id,
            'postcode' => '3000',
            'title' => 'Spoof Attempt',
        ];

        $response = $this->actingAs($customerA, 'sanctum')
            ->postJson('/api/v1/service-requests', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.customer_id', $customerA->id);

        $this->assertDatabaseHas('service_requests', [
            'customer_id' => $customerA->id,
            'postcode' => '3000',
        ]);

        $this->assertDatabaseMissing('service_requests', [
            'customer_id' => $customerB->id,
        ]);
    }

    public function test_request_creation_validates_required_fields_and_service(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_id', 'postcode']);
    }

    public function test_request_creation_rejects_inactive_service(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $inactiveService = Service::factory()->create(['status' => 'inactive']);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $inactiveService->id,
                'postcode' => '2000',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['service_id']);
    }

    public function test_request_creation_enforces_required_questions(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_text' => 'Must Answer This',
            'required' => true,
            'status' => 'active',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'answers' => [],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
    }

    public function test_request_creation_rejects_question_from_another_service(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $serviceA = Service::factory()->create(['status' => 'active']);
        $serviceB = Service::factory()->create(['status' => 'active']);

        $questionB = ServiceQuestion::factory()->create([
            'service_id' => $serviceB->id,
            'required' => false,
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $serviceA->id,
                'postcode' => '2000',
                'answers' => [
                    [
                        'question_id' => $questionB->id,
                        'answer_text' => 'Invalid cross-service answer',
                    ],
                ],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
    }

    public function test_request_creation_rejects_option_from_another_question(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $q1 = ServiceQuestion::factory()->create(['service_id' => $service->id]);
        $q2 = ServiceQuestion::factory()->create(['service_id' => $service->id]);

        $optForQ2 = ServiceQuestionOption::factory()->create(['question_id' => $q2->id]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'answers' => [
                    [
                        'question_id' => $q1->id,
                        'selected_option_id' => $optForQ2->id,
                    ],
                ],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);
    }

    public function test_conditional_questions_are_required_only_when_condition_is_met(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        // Parent question: "Do you have pets?" (Yes / No)
        $parentQ = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_type' => 'single_choice',
            'required' => true,
            'sort_order' => 1,
            'status' => 'active',
        ]);
        $yesOpt = ServiceQuestionOption::factory()->create(['question_id' => $parentQ->id, 'value' => 'yes']);
        $noOpt = ServiceQuestionOption::factory()->create(['question_id' => $parentQ->id, 'value' => 'no']);

        // Child question: "What kind of pets?" (Required ONLY if parent answer is Yes)
        $childQ = ServiceQuestion::factory()->create([
            'service_id' => $service->id,
            'question_text' => 'What kind of pets?',
            'question_type' => 'text',
            'required' => true,
            'sort_order' => 2,
            'status' => 'active',
            'conditional_rule' => [
                'depends_on_question_id' => $parentQ->id,
                'selected_option_id' => $yesOpt->id,
            ],
        ]);

        // Case 1: Parent is "No" -> Child question is NOT required -> Succeeds
        $respNo = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'answers' => [
                    [
                        'question_id' => $parentQ->id,
                        'selected_option_id' => $noOpt->id,
                    ],
                ],
            ]);
        $respNo->assertCreated();

        // Case 2: Parent is "Yes", Child answer missing -> Fails with 422
        $respYesMissing = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'answers' => [
                    [
                        'question_id' => $parentQ->id,
                        'selected_option_id' => $yesOpt->id,
                    ],
                ],
            ]);
        $respYesMissing->assertStatus(422)
            ->assertJsonValidationErrors(['answers']);

        // Case 3: Parent is "Yes", Child answer provided -> Succeeds
        $respYesProvided = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'answers' => [
                    [
                        'question_id' => $parentQ->id,
                        'selected_option_id' => $yesOpt->id,
                    ],
                    [
                        'question_id' => $childQ->id,
                        'answer_text' => '2 Golden Retrievers',
                    ],
                ],
            ]);
        $respYesProvided->assertCreated();
    }

    public function test_customer_can_upload_attachments_with_service_request(): void
    {
        Storage::fake('public');

        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $file1 = UploadedFile::fake()->image('damage.jpg');
        $file2 = UploadedFile::fake()->create('plan.pdf', 500, 'application/pdf');

        $response = $this->actingAs($customer, 'sanctum')
            ->post('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'title' => 'With Photos',
                'attachments' => [$file1, $file2],
            ]);

        $response->assertCreated()
            ->assertJsonCount(2, 'data.attachments');

        $this->assertDatabaseHas('request_attachments', [
            'original_name' => 'damage.jpg',
            'mime_type' => 'image/jpeg',
        ]);

        $this->assertDatabaseHas('request_attachments', [
            'original_name' => 'plan.pdf',
            'mime_type' => 'application/pdf',
        ]);
    }

    public function test_oversized_or_forbidden_attachments_are_rejected(): void
    {
        Storage::fake('public');

        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $forbiddenFile = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/service-requests', [
                'service_id' => $service->id,
                'postcode' => '2000',
                'attachments' => [$forbiddenFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attachments.0']);
    }

    public function test_customer_can_list_own_service_requests(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        ServiceRequest::factory()->create([
            'customer_id' => $customerA->id,
            'service_id' => $service->id,
            'title' => 'Request A1',
        ]);

        ServiceRequest::factory()->create([
            'customer_id' => $customerA->id,
            'service_id' => $service->id,
            'title' => 'Request A2',
        ]);

        ServiceRequest::factory()->create([
            'customer_id' => $customerB->id,
            'service_id' => $service->id,
            'title' => 'Request B1',
        ]);

        $response = $this->actingAs($customerA, 'sanctum')
            ->getJson('/api/v1/service-requests');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['title' => 'Request A1'])
            ->assertJsonFragment(['title' => 'Request A2'])
            ->assertJsonMissing(['title' => 'Request B1']);
    }

    public function test_customer_can_view_own_service_request_details(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $request = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'title' => 'Detailed Job',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/service-requests/{$request->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $request->id)
            ->assertJsonPath('data.title', 'Detailed Job')
            ->assertJsonPath('data.service.id', $service->id);
    }

    public function test_customer_cannot_view_another_customers_service_request(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $requestB = ServiceRequest::factory()->create([
            'customer_id' => $customerB->id,
            'service_id' => $service->id,
            'title' => 'Secret Job',
        ]);

        $response = $this->actingAs($customerA, 'sanctum')
            ->getJson("/api/v1/service-requests/{$requestB->id}");

        $response->assertNotFound();
    }
}
