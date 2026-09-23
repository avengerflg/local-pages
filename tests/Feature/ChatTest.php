<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Location;
use App\Models\Message;
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
        Storage::fake('public');
    }

    public function test_unauthenticated_user_cannot_access_chat(): void
    {
        $this->getJson('/api/v1/conversations')->assertUnauthorized();
        $this->postJson('/api/v1/conversations', ['request_id' => 1, 'tradie_id' => 1])->assertUnauthorized();
        $this->getJson('/api/v1/conversations/1')->assertUnauthorized();
        $this->getJson('/api/v1/conversations/1/messages')->assertUnauthorized();
        $this->postJson('/api/v1/conversations/1/messages', ['body' => 'Hello'])->assertUnauthorized();
    }

    public function test_customer_and_tradie_can_start_conversation_for_selected_lead(): void
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

        // Tradie is selected
        RequestTradie::create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'selected',
        ]);

        // Customer initiates conversation
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

        // Calling again is idempotent and returns the same conversation
        $repeatResponse = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
                'tradie_id' => $tradieProfile->id,
            ]);

        $repeatResponse->assertCreated()
            ->assertJsonPath('data.id', $conversationId);

        $this->assertCount(1, Conversation::where('request_id', $serviceRequest->id)->get());

        // Tradie can also fetch the same conversation
        $tradieResponse = $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
            ]);

        $tradieResponse->assertCreated()
            ->assertJsonPath('data.id', $conversationId);
    }

    public function test_customer_cannot_start_conversation_with_unselected_tradie(): void
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

    public function test_tradie_cannot_start_conversation_for_unassigned_request(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        // Attempting to create conversation for unassigned request returns 404
        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/conversations', [
                'request_id' => $serviceRequest->id,
            ]);

        $response->assertNotFound();
    }

    public function test_customer_and_tradie_can_exchange_messages(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'name' => 'Alice Customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

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

        // 1. Customer sends message
        $res1 = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Hi Bob, are you available tomorrow morning?',
            ]);

        $res1->assertCreated()
            ->assertJsonPath('data.conversation_id', $conversation->id)
            ->assertJsonPath('data.sender_id', $customer->id)
            ->assertJsonPath('data.body', 'Hi Bob, are you available tomorrow morning?')
            ->assertJsonPath('data.message_type', 'text');

        // 2. Tradie sends response message
        $res2 = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Yes Alice, 9am works great for me.',
            ]);

        $res2->assertCreated()
            ->assertJsonPath('data.sender_id', $tradieUser->id)
            ->assertJsonPath('data.body', 'Yes Alice, 9am works great for me.');

        // 3. Check message history list
        $messagesRes = $this->actingAs($customer, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversation->id}/messages");

        $messagesRes->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.body', 'Hi Bob, are you available tomorrow morning?')
            ->assertJsonPath('data.1.body', 'Yes Alice, 9am works great for me.');

        // 4. Check conversation list preview
        $listRes = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/conversations');

        $listRes->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $conversation->id)
            ->assertJsonPath('data.0.last_message.body', 'Yes Alice, 9am works great for me.');
    }

    public function test_message_with_attachments_stores_file_and_omits_raw_paths(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $conversation = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $file = UploadedFile::fake()->image('pipe_leak.png');

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Here is a photo of the damaged pipe.',
                'attachments' => [$file],
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.body', 'Here is a photo of the damaged pipe.')
            ->assertJsonCount(1, 'data.attachments')
            ->assertJsonPath('data.attachments.0.original_name', 'pipe_leak.png')
            ->assertJsonPath('data.attachments.0.mime_type', 'image/png')
            ->assertJsonMissingPath('data.attachments.0.file_path')
            ->assertJsonMissingPath('data.attachments.0.url');

        $this->assertDatabaseHas('message_attachments', [
            'original_name' => 'pipe_leak.png',
            'mime_type' => 'image/png',
        ]);
    }

    public function test_empty_message_is_rejected(): void
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

    public function test_user_cannot_access_or_send_to_another_users_conversation(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customerA->id,
            'service_id' => $service->id,
        ]);

        $tradieProfile = TradieProfile::factory()->create();

        $conversationA = Conversation::create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customerA->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        // Customer B tries to view Conversation A
        $this->actingAs($customerB, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}")
            ->assertNotFound();

        // Customer B tries to get messages of Conversation A
        $this->actingAs($customerB, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}/messages")
            ->assertNotFound();

        // Customer B tries to send message into Conversation A
        $this->actingAs($customerB, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversationA->id}/messages", [
                'body' => 'Intruder message',
            ])
            ->assertNotFound();

        // Unrelated Tradie tries to access Conversation A
        $unrelatedTradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $unrelatedTradieUser->id]);

        $this->actingAs($unrelatedTradieUser, 'sanctum')
            ->getJson("/api/v1/conversations/{$conversationA->id}")
            ->assertNotFound();

        $this->actingAs($unrelatedTradieUser, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversationA->id}/messages", [
                'body' => 'Unauthorized tradie message',
            ])
            ->assertNotFound();
    }
}
