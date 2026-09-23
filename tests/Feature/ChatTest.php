<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Location;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\RequestTradie;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ChatTest extends TestCase
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
    | 1. Unauthenticated Access Tests
    |--------------------------------------------------------------------------
    */

    public function test_unauthenticated_user_cannot_list_conversations(): void
    {
        $this->getJson('/api/v1/conversations')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_view_a_conversation(): void
    {
        $this->getJson('/api/v1/conversations/1')->assertUnauthorized();
        $this->getJson('/api/v1/conversations/1/messages')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_send_a_message(): void
    {
        $this->postJson('/api/v1/conversations/1/messages', ['body' => 'Hello'])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_conversation(): void
    {
        $this->postJson('/api/v1/conversations', ['request_id' => 1, 'tradie_id' => 1])->assertUnauthorized();
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Conversation Creation & Authorization Tests
    |--------------------------------------------------------------------------
    */

    public function test_customer_can_start_conversation_with_selected_tradie(): void
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
            'verification_status' => 'verified',
        ]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
                'tradie_id' => $tradieProfile->id,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.request_id', $serviceRequest->id)
            ->assertJsonPath('data.customer.id', $customer->id)
            ->assertJsonPath('data.tradie.id', $tradieProfile->id);

        $conversationId = $response->json('data.id');

        // Duplicate creation returns/reuses the existing conversation idempotently
        $repeatResponse = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
                'tradie_id' => $tradieProfile->id,
            ]);

        $repeatResponse->assertCreated()
            ->assertJsonPath('data.id', $conversationId);

        $this->assertCount(1, Conversation::where('request_id', $serviceRequest->id)->get());
    }

    public function test_customer_cannot_start_conversation_with_non_selected_tradie(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

        $unselectedTradie = TradieProfile::factory()->create();

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
                'tradie_id' => $unselectedTradie->id,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['tradie_id']);
    }

    public function test_tradie_can_access_conversation_for_selected_lead(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.request_id', $serviceRequest->id)
            ->assertJsonPath('data.tradie.id', $tradieProfile->id);
    }

    public function test_tradie_cannot_access_or_start_conversation_for_unselected_lead(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        // Tradie not in request_tradies
        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
            ]);

        $response->assertNotFound();
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Customer & Tradie Message Exchange & Cross-User Security
    |--------------------------------------------------------------------------
    */

    public function test_customer_can_access_own_conversation_and_exchange_messages(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'name' => 'Alice Customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active', 'name' => 'Bob Tradie']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'business_name' => 'Bob Electrician',
        ]);

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'active',
        ]);

        // Customer views own conversation detail
        $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversation->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $conversation->id);

        // Customer sends message
        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Hi Bob, when can you start?',
            ])
            ->assertCreated()
            ->assertJsonPath('data.body', 'Hi Bob, when can you start?')
            ->assertJsonPath('data.sender_id', $customer->id);

        // Tradie views conversation and responds
        $this->actingAs($tradieUser, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversation->id}")
            ->assertOk();

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'I can start on Monday morning.',
            ])
            ->assertCreated()
            ->assertJsonPath('data.body', 'I can start on Monday morning.')
            ->assertJsonPath('data.sender_id', $tradieUser->id);
    }

    public function test_customer_cannot_access_or_send_into_another_customers_conversation(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customerA->id, 'service_id' => $service->id]);

        $tradieProfile = TradieProfile::factory()->create();

        $conversationA = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customerA->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'active',
        ]);

        // Customer B cannot view conversation A
        $this->actingAs($customerB, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}")
            ->assertNotFound();

        // Customer B cannot view messages in conversation A
        $this->actingAs($customerB, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}/messages")
            ->assertNotFound();

        // Customer B cannot post into conversation A
        $this->actingAs($customerB, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversationA->id}/messages", [
                'body' => 'Intruder message',
            ])
            ->assertNotFound();
    }

    public function test_tradie_cannot_access_or_send_into_another_tradies_conversation(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieProfileA = TradieProfile::factory()->create();
        $tradieUserB = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUserB->id]);

        $conversationA = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfileA->id,
            'status' => 'active',
        ]);

        // Tradie B cannot view conversation A
        $this->actingAs($tradieUserB, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}")
            ->assertNotFound();

        // Tradie B cannot view messages in conversation A
        $this->actingAs($tradieUserB, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}/messages")
            ->assertNotFound();

        // Tradie B cannot post into conversation A
        $this->actingAs($tradieUserB, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversationA->id}/messages", [
                'body' => 'Unauthorized tradie message',
            ])
            ->assertNotFound();
    }

    public function test_client_supplied_sender_or_customer_parameters_cannot_spoof_identity(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'name' => 'Real Customer']);
        $spoofedUser = User::factory()->create(['role' => 'customer', 'name' => 'Spoofed Target']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'active',
        ]);

        // Attempt to pass sender_id, customer_id, sender_role in message body
        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Trying to spoof sender',
                'sender_id' => $spoofedUser->id,
                'customer_id' => $spoofedUser->id,
                'sender_role' => 'admin',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.sender_id', $customer->id)
            ->assertJsonPath('data.sender.id', $customer->id);

        $this->assertDatabaseHas('messages', [
            'id' => $response->json('data.id'),
            'sender_id' => $customer->id,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Chat Attachment Storage & Security Tests
    |--------------------------------------------------------------------------
    */

    public function test_chat_attachments_stored_on_private_disk_and_metadata_only_exposed(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $file = UploadedFile::fake()->image('pipe_inspection.png');

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Here is the pipe photo.',
                'attachments' => [$file],
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.body', 'Here is the pipe photo.')
            ->assertJsonCount(1, 'data.attachments')
            ->assertJsonPath('data.attachments.0.original_name', 'pipe_inspection.png')
            ->assertJsonPath('data.attachments.0.mime_type', 'image/png')
            ->assertJsonStructure([
                'data' => [
                    'attachments' => [
                        '*' => ['id', 'message_id', 'original_name', 'mime_type', 'file_size', 'created_at'],
                    ],
                ],
            ])
            ->assertJsonMissingPath('data.attachments.0.file_path')
            ->assertJsonMissingPath('data.attachments.0.url')
            ->assertJsonMissingPath('data.attachments.0.storage_path');

        // Verify stored in private 'local' disk and NOT 'public' disk
        $attachment = MessageAttachment::where('original_name', 'pipe_inspection.png')->first();
        $this->assertNotNull($attachment);

        Storage::disk('local')->assertExists($attachment->file_path);
        Storage::disk('public')->assertMissing($attachment->file_path);
    }

    public function test_attachment_only_message_is_supported(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $file = UploadedFile::fake()->create('plan.pdf', 500, 'application/pdf');

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'attachments' => [$file],
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.message_type', 'document')
            ->assertJsonCount(1, 'data.attachments');
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Message Validation Tests
    |--------------------------------------------------------------------------
    */

    public function test_empty_message_without_attachments_is_rejected(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);
        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    public function test_message_exceeding_maximum_length_is_rejected(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);
        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $longBody = str_repeat('a', 5001);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => $longBody,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    public function test_invalid_attachment_mimetype_is_rejected(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);
        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $invalidFile = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Look at this executable',
                'attachments' => [$invalidFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attachments.0']);
    }

    public function test_attachment_count_limit_is_enforced(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);
        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $files = [
            UploadedFile::fake()->image('img1.png'),
            UploadedFile::fake()->image('img2.png'),
            UploadedFile::fake()->image('img3.png'),
            UploadedFile::fake()->image('img4.png'),
            UploadedFile::fake()->image('img5.png'),
            UploadedFile::fake()->image('img6.png'), // Exceeds limit of 5
        ];

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Too many files',
                'attachments' => $files,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attachments']);
    }

    public function test_attachment_size_limit_is_enforced(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);
        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $oversizedFile = UploadedFile::fake()->create('large.pdf', 11000); // 11MB > 10MB limit

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Oversized document',
                'attachments' => [$oversizedFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attachments.0']);
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Pagination & Ordering Tests
    |--------------------------------------------------------------------------
    */

    public function test_conversation_list_is_paginated_and_ordered(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);

        $tradie1 = TradieProfile::factory()->create(['business_name' => 'Tradie One']);
        $tradie2 = TradieProfile::factory()->create(['business_name' => 'Tradie Two']);
        $tradie3 = TradieProfile::factory()->create(['business_name' => 'Tradie Three']);

        $c1 = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradie1->id,
            'last_message_at' => now()->subMinutes(10),
        ]);

        $c2 = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradie2->id,
            'last_message_at' => now()->subMinutes(2),
        ]);

        $c3 = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradie3->id,
            'last_message_at' => now()->subMinutes(5),
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/conversations?per_page=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('data.0.id', $c2->id) // Most recent last_message_at (2 mins ago)
            ->assertJsonPath('data.1.id', $c3->id); // Second most recent (5 mins ago)
    }

    public function test_message_history_is_paginated_in_chronological_order(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $serviceRequest = ServiceRequest::factory()->create(['customer_id' => $customer->id, 'service_id' => $service->id]);
        $tradieProfile = TradieProfile::factory()->create();

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $m1 = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $customer->id,
            'body' => 'Message 1',
            'sent_at' => now()->subMinutes(3),
        ]);

        $m2 = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $customer->id,
            'body' => 'Message 2',
            'sent_at' => now()->subMinutes(2),
        ]);

        $m3 = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $customer->id,
            'body' => 'Message 3',
            'sent_at' => now()->subMinutes(1),
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversation->id}/messages?per_page=2");

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('data.0.id', $m1->id)
            ->assertJsonPath('data.0.body', 'Message 1')
            ->assertJsonPath('data.1.id', $m2->id)
            ->assertJsonPath('data.1.body', 'Message 2');
    }
}
