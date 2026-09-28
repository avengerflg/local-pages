<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\Quote;
use App\Models\QuoteAttachment;
use App\Models\RequestAttachment;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieDocument;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class Phase17Test extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
        Storage::fake('public');

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->otherCustomer = User::factory()->create(['role' => 'customer']);

        $this->tradieUser1 = User::factory()->create(['role' => 'tradie']);
        $this->tradieProfile1 = TradieProfile::factory()->create(['user_id' => $this->tradieUser1->id]);

        $this->tradieUser2 = User::factory()->create(['role' => 'tradie']);
        $this->tradieProfile2 = TradieProfile::factory()->create(['user_id' => $this->tradieUser2->id]);
    }

    public function test_tradie_documents_security(): void
    {
        $file = UploadedFile::fake()->create('license.pdf', 100);
        $path = $file->store('tradie-documents', 'local');

        $document = TradieDocument::forceCreate([
            'tradie_id' => $this->tradieProfile1->id,
            'file_path' => $path,
            'document_type' => 'license',
            'original_name' => 'license.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
            'status' => 'pending',
        ]);

        $url = URL::temporarySignedRoute('files.download', now()->addMinutes(60), [
            'type' => 'tradie_documents',
            'id' => $document->id,
        ]);

        // Unauthenticated
        $this->getJson($url)->assertStatus(401);

        // Wrong tradie
        $this->actingAs($this->tradieUser2)->getJson($url)->assertStatus(403);

        // Customer
        $this->actingAs($this->customer)->getJson($url)->assertStatus(403);

        // Admin
        $this->actingAs($this->admin)->get($url)->assertStatus(200);

        // Correct Tradie
        $this->actingAs($this->tradieUser1)->get($url)->assertStatus(200);

        // Invalid signature
        $invalidUrl = str_replace('signature=', 'signature=invalid', $url);
        $this->actingAs($this->tradieUser1)->getJson($invalidUrl)->assertStatus(403); // Signed middleware returns 403
    }

    public function test_request_attachments_security(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');
        $path = $file->store('request-attachments', 'local');

        $request = ServiceRequest::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        // tradie1 is selected
        $request->requestTradies()->create([
            'tradie_id' => $this->tradieProfile1->id,
            'status' => 'selected',
        ]);

        // tradie2 is matched but NOT selected
        $request->requestTradies()->create([
            'tradie_id' => $this->tradieProfile2->id,
            'status' => 'matched',
        ]);

        $attachment = RequestAttachment::forceCreate([
            'request_id' => $request->id,
            'file_path' => $path,
            'original_name' => 'photo.jpg',
            'mime_type' => 'image/jpeg',
            'file_size' => 100,
        ]);

        $url = URL::temporarySignedRoute('files.download', now()->addMinutes(60), [
            'type' => 'request_attachments',
            'id' => $attachment->id,
        ]);

        // Customer owner
        $this->actingAs($this->customer)->get($url)->assertStatus(200);

        // Other customer
        $this->actingAs($this->otherCustomer)->getJson($url)->assertStatus(403);

        // Selected tradie
        $this->actingAs($this->tradieUser1)->get($url)->assertStatus(200);

        // Matched but unselected tradie
        $this->actingAs($this->tradieUser2)->getJson($url)->assertStatus(403);

        // Admin
        $this->actingAs($this->admin)->get($url)->assertStatus(200);
    }

    public function test_chat_attachments_security(): void
    {
        $request = ServiceRequest::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        $conversation = Conversation::factory()->create([
            'request_id' => $request->id,
            'customer_id' => $this->customer->id,
            'tradie_id' => $this->tradieProfile1->id,
        ]);

        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $this->customer->id,
        ]);

        $file = UploadedFile::fake()->create('doc.pdf');
        $path = $file->store('chat-attachments', 'local');

        $attachment = MessageAttachment::forceCreate([
            'message_id' => $message->id,
            'file_path' => $path,
            'original_name' => 'doc.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
        ]);

        $url = URL::temporarySignedRoute('files.download', now()->addMinutes(60), [
            'type' => 'message_attachments',
            'id' => $attachment->id,
        ]);

        // Customer participant
        $this->actingAs($this->customer)->get($url)->assertStatus(200);

        // Tradie participant
        $this->actingAs($this->tradieUser1)->get($url)->assertStatus(200);

        // Other customer
        $this->actingAs($this->otherCustomer)->getJson($url)->assertStatus(403);

        // Other tradie
        $this->actingAs($this->tradieUser2)->getJson($url)->assertStatus(403);
    }

    public function test_quote_attachments_security(): void
    {
        $request = ServiceRequest::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        $quote = Quote::factory()->create([
            'request_id' => $request->id,
            'tradie_id' => $this->tradieProfile1->id,
        ]);

        $file = UploadedFile::fake()->create('quote.pdf');
        $path = $file->store('quote-attachments', 'local');

        $attachment = QuoteAttachment::forceCreate([
            'quote_id' => $quote->id,
            'file_path' => $path,
            'original_name' => 'quote.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 100,
        ]);

        $url = URL::temporarySignedRoute('files.download', now()->addMinutes(60), [
            'type' => 'quote_attachments',
            'id' => $attachment->id,
        ]);

        // Quote customer
        $this->actingAs($this->customer)->get($url)->assertStatus(200);

        // Quote tradie
        $this->actingAs($this->tradieUser1)->get($url)->assertStatus(200);

        // Unrelated customer
        $this->actingAs($this->otherCustomer)->getJson($url)->assertStatus(403);

        // Unrelated tradie
        $this->actingAs($this->tradieUser2)->getJson($url)->assertStatus(403);
    }

    public function test_request_attachments_are_stored_on_local_disk(): void
    {
        $service = Service::factory()->create(['status' => 'active']);

        $file = UploadedFile::fake()->image('test.jpg');

        $this->actingAs($this->customer)->postJson('/api/v1/service-requests', [
            'service_id' => $service->id,
            'postcode' => '1234',
            'answers' => [],
            'attachments' => [$file],
        ])->assertStatus(201);

        // Assert file was saved to local storage
        $request = ServiceRequest::latest()->first();
        $attachment = $request->attachments->first();

        Storage::disk('local')->assertExists($attachment->file_path);
        Storage::disk('public')->assertMissing($attachment->file_path);
    }

    public function test_resources_do_not_expose_paths(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');
        $path = $file->store('request-attachments', 'local');

        $request = ServiceRequest::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        $attachment = RequestAttachment::forceCreate([
            'request_id' => $request->id,
            'file_path' => $path,
            'original_name' => 'photo.jpg',
            'mime_type' => 'image/jpeg',
            'file_size' => 100,
        ]);

        $response = $this->actingAs($this->customer)->getJson("/api/v1/service-requests/{$request->id}");

        $response->assertStatus(200);

        // Assert download_url exists but NOT url or file_path
        $this->assertNotNull($response->json('data.attachments.0.download_url'));
        $this->assertArrayNotHasKey('url', $response->json('data.attachments.0'));
        $this->assertArrayNotHasKey('file_path', $response->json('data.attachments.0'));
        $this->assertArrayNotHasKey('storage_path', $response->json('data.attachments.0'));
    }
}
