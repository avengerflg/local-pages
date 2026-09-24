<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\Service;
use App\Models\TradieAvailability;
use App\Models\TradieDocument;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TradieProfileManagementTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================================
    // 1. Profile Self-Service Tests
    // =========================================================================

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/v1/tradie/profile')->assertUnauthorized();
        $this->putJson('/api/v1/tradie/profile', [])->assertUnauthorized();
        $this->getJson('/api/v1/tradie/services')->assertUnauthorized();
        $this->getJson('/api/v1/tradie/service-areas')->assertUnauthorized();
        $this->getJson('/api/v1/tradie/documents')->assertUnauthorized();
        $this->getJson('/api/v1/tradie/availability')->assertUnauthorized();
        $this->getJson('/api/v1/tradie/onboarding-status')->assertUnauthorized();
    }

    public function test_customer_cannot_access_tradie_self_service_endpoints(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/profile')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/services')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/service-areas')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/documents')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/availability')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/tradie/onboarding-status')
            ->assertForbidden();
    }

    public function test_suspended_tradie_cannot_access_tradie_self_service_endpoints(): void
    {
        $suspendedTradie = User::factory()->tradie()->create(['status' => 'suspended']);
        TradieProfile::factory()->create(['user_id' => $suspendedTradie->id]);

        $this->actingAs($suspendedTradie, 'sanctum')
            ->getJson('/api/v1/tradie/profile')
            ->assertForbidden();

        $this->actingAs($suspendedTradie, 'sanctum')
            ->putJson('/api/v1/tradie/profile', ['business_name' => 'New Name'])
            ->assertForbidden();

        $this->actingAs($suspendedTradie, 'sanctum')
            ->getJson('/api/v1/tradie/services')
            ->assertForbidden();

        $this->actingAs($suspendedTradie, 'sanctum')
            ->getJson('/api/v1/tradie/service-areas')
            ->assertForbidden();

        $this->actingAs($suspendedTradie, 'sanctum')
            ->getJson('/api/v1/tradie/documents')
            ->assertForbidden();

        $this->actingAs($suspendedTradie, 'sanctum')
            ->getJson('/api/v1/tradie/availability')
            ->assertForbidden();

        $this->actingAs($suspendedTradie, 'sanctum')
            ->getJson('/api/v1/tradie/onboarding-status')
            ->assertForbidden();
    }

    public function test_tradie_can_view_own_profile(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create([
            'user_id' => $user->id,
            'business_name' => 'Elite Electrical Pty Ltd',
            'abn' => '12345678901',
            'phone' => '0412345678',
            'email' => 'contact@elite.example.com',
            'website' => 'https://elite.example.com',
            'address' => '10 Industry Rd',
            'suburb' => 'Bondi',
            'state' => 'NSW',
            'postcode' => '2026',
            'verification_status' => 'pending',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/tradie/profile')
            ->assertOk();

        $response->assertJsonPath('data.id', $profile->id)
            ->assertJsonPath('data.business_name', 'Elite Electrical Pty Ltd')
            ->assertJsonPath('data.abn', '12345678901')
            ->assertJsonPath('data.phone', '0412345678')
            ->assertJsonPath('data.email', 'contact@elite.example.com')
            ->assertJsonPath('data.website', 'https://elite.example.com')
            ->assertJsonPath('data.address', '10 Industry Rd')
            ->assertJsonPath('data.suburb', 'Bondi')
            ->assertJsonPath('data.state', 'NSW')
            ->assertJsonPath('data.postcode', '2026')
            ->assertJsonPath('data.verification_status', 'pending');
    }

    public function test_tradie_can_update_own_profile_and_protected_fields_are_ignored(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create([
            'user_id' => $user->id,
            'business_name' => 'Old Business Name',
            'verification_status' => 'pending',
            'verified_at' => null,
        ]);

        $payload = [
            'business_name' => 'Updated Business Name',
            'abn' => '98765432109',
            'phone' => '0499887766',
            'email' => 'updated@tradie.example.com',
            'website' => 'https://updated.example.com',
            'address' => '99 Builder Way',
            'suburb' => 'Parramatta',
            'state' => 'NSW',
            'postcode' => '2150',
            // Tamper attempts:
            'verification_status' => 'verified',
            'verified_at' => now()->toIso8601String(),
            'user_id' => 9999,
            'role' => 'admin',
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/tradie/profile', $payload)
            ->assertOk();

        $response->assertJsonPath('data.business_name', 'Updated Business Name')
            ->assertJsonPath('data.abn', '98765432109')
            ->assertJsonPath('data.phone', '0499887766')
            ->assertJsonPath('data.email', 'updated@tradie.example.com')
            ->assertJsonPath('data.website', 'https://updated.example.com')
            ->assertJsonPath('data.address', '99 Builder Way')
            ->assertJsonPath('data.suburb', 'Parramatta')
            ->assertJsonPath('data.state', 'NSW')
            ->assertJsonPath('data.postcode', '2150')
            ->assertJsonPath('data.verification_status', 'pending'); // Preserved

        $freshProfile = $profile->fresh();
        $this->assertEquals('Updated Business Name', $freshProfile->business_name);
        $this->assertEquals('pending', $freshProfile->verification_status);
        $this->assertNull($freshProfile->verified_at);
        $this->assertEquals($user->id, $freshProfile->user_id);
        $this->assertEquals('tradie', $user->fresh()->role);
    }

    // =========================================================================
    // 2. Tradie Services Self-Service Tests
    // =========================================================================

    public function test_tradie_can_list_attach_sync_and_detach_services(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create(['user_id' => $user->id]);

        $service1 = Service::factory()->create(['name' => 'Plumbing', 'status' => 'active']);
        $service2 = Service::factory()->create(['name' => 'Electrical', 'status' => 'active']);
        $inactiveService = Service::factory()->create(['name' => 'Roofing', 'status' => 'inactive']);

        // 1. Initially empty
        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/tradie/services')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        // 2. Attach active service
        $attachResponse = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/services', [
                'service_id' => $service1->id,
            ])
            ->assertOk();

        $attachResponse->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $service1->id);

        $this->assertTrue($profile->fresh()->services->contains($service1));

        // 3. Attach inactive service is rejected
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/services', [
                'service_id' => $inactiveService->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['service_id']);

        // 4. Sync services
        $syncResponse = $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/tradie/services', [
                'service_ids' => [$service1->id, $service2->id],
            ])
            ->assertOk();

        $syncResponse->assertJsonCount(2, 'data');
        $this->assertEquals(2, $profile->fresh()->services()->count());

        // 5. Sync with inactive service rejected
        $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/tradie/services', [
                'service_ids' => [$service1->id, $inactiveService->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['service_ids.1']);

        // 6. Detach service
        $detachResponse = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/tradie/services/{$service1->id}")
            ->assertOk();

        $detachResponse->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $service2->id);

        $this->assertFalse($profile->fresh()->services->contains($service1));
    }

    public function test_inactive_service_cannot_be_attached_or_synced(): void
    {
        $user = User::factory()->tradie()->create();
        TradieProfile::factory()->create(['user_id' => $user->id]);

        $inactiveService = Service::factory()->create(['status' => 'inactive']);
        $activeService = Service::factory()->create(['status' => 'active']);

        // 1. Inactive service attach rejected
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/services', [
                'service_id' => $inactiveService->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['service_id']);

        // 2. Inactive service in sync rejected
        $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/tradie/services', [
                'service_ids' => [$activeService->id, $inactiveService->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['service_ids.1']);
    }

    public function test_tradie_cannot_detach_unattached_or_another_tradies_service(): void
    {
        $user1 = User::factory()->tradie()->create();
        $profile1 = TradieProfile::factory()->create(['user_id' => $user1->id]);

        $user2 = User::factory()->tradie()->create();
        $profile2 = TradieProfile::factory()->create(['user_id' => $user2->id]);

        $service = Service::factory()->create(['status' => 'active']);
        $profile2->services()->attach($service->id);

        // Tradie 1 tries to detach service attached only to Tradie 2
        $this->actingAs($user1, 'sanctum')
            ->deleteJson("/api/v1/tradie/services/{$service->id}")
            ->assertNotFound();

        // Tradie 2's attachment remains intact
        $this->assertTrue($profile2->fresh()->services->contains($service));
    }

    // =========================================================================
    // 3. Tradie Service Areas Self-Service Tests
    // =========================================================================

    public function test_tradie_can_list_attach_sync_and_detach_service_areas(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create(['user_id' => $user->id]);

        $location1 = Location::factory()->create(['name' => 'Sydney CBD', 'status' => 'active']);
        $location2 = Location::factory()->create(['name' => 'Bondi Beach', 'status' => 'active']);
        $inactiveLocation = Location::factory()->create(['name' => 'Ghost Town', 'status' => 'inactive']);

        // 1. Initially empty
        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/tradie/service-areas')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        // 2. Attach location
        $attachResponse = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/service-areas', [
                'location_id' => $location1->id,
            ])
            ->assertOk();

        $attachResponse->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $location1->id);

        // 3. Inactive location rejected
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/service-areas', [
                'location_id' => $inactiveLocation->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['location_id']);

        // 4. Sync locations
        $syncResponse = $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/tradie/service-areas', [
                'location_ids' => [$location1->id, $location2->id],
            ])
            ->assertOk();

        $syncResponse->assertJsonCount(2, 'data');
        $this->assertEquals(2, $profile->fresh()->serviceAreas()->count());

        // 5. Detach location
        $detachResponse = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/tradie/service-areas/{$location1->id}")
            ->assertOk();

        $detachResponse->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $location2->id);

        $this->assertFalse($profile->fresh()->serviceAreas->contains($location1));
    }

    public function test_inactive_location_cannot_be_attached_or_synced(): void
    {
        $user = User::factory()->tradie()->create();
        TradieProfile::factory()->create(['user_id' => $user->id]);

        $inactiveLocation = Location::factory()->create(['status' => 'inactive']);
        $activeLocation = Location::factory()->create(['status' => 'active']);

        // 1. Inactive location attach rejected
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/service-areas', [
                'location_id' => $inactiveLocation->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['location_id']);

        // 2. Inactive location in sync rejected
        $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/tradie/service-areas', [
                'location_ids' => [$activeLocation->id, $inactiveLocation->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['location_ids.1']);
    }

    public function test_tradie_cannot_detach_unattached_or_another_tradies_service_area(): void
    {
        $user1 = User::factory()->tradie()->create();
        $profile1 = TradieProfile::factory()->create(['user_id' => $user1->id]);

        $user2 = User::factory()->tradie()->create();
        $profile2 = TradieProfile::factory()->create(['user_id' => $user2->id]);

        $location = Location::factory()->create(['status' => 'active']);
        $profile2->serviceAreas()->attach($location->id);

        // Tradie 1 tries to detach location attached only to Tradie 2
        $this->actingAs($user1, 'sanctum')
            ->deleteJson("/api/v1/tradie/service-areas/{$location->id}")
            ->assertNotFound();

        // Tradie 2's attachment remains intact
        $this->assertTrue($profile2->fresh()->serviceAreas->contains($location));
    }

    // =========================================================================
    // 4. Tradie Verification Documents Self-Service Tests
    // =========================================================================

    public function test_tradie_can_upload_and_list_documents(): void
    {
        Storage::fake('local');

        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->create('contractor_licence.pdf', 500, 'application/pdf');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/documents', [
                'document_type' => 'licence',
                'file' => $file,
            ])
            ->assertCreated();

        $response->assertJsonPath('data.tradie_id', $profile->id)
            ->assertJsonPath('data.document_type', 'licence')
            ->assertJsonPath('data.original_name', 'contractor_licence.pdf')
            ->assertJsonPath('data.mime_type', 'application/pdf')
            ->assertJsonPath('data.status', 'pending');

        $response->assertJsonMissingPath('data.file_path'); // Path not exposed

        $document = TradieDocument::where('tradie_id', $profile->id)->first();
        $this->assertNotNull($document);
        $this->assertEquals('pending', $document->status);
        Storage::disk('local')->assertExists($document->file_path);

        // List documents
        $listResponse = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/tradie/documents')
            ->assertOk();

        $listResponse->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $document->id);
    }

    public function test_invalid_document_mime_or_oversized_file_is_rejected(): void
    {
        Storage::fake('local');

        $user = User::factory()->tradie()->create();
        TradieProfile::factory()->create(['user_id' => $user->id]);

        // Invalid MIME type (e.g. .exe or .txt)
        $invalidMimeFile = UploadedFile::fake()->create('script.sh', 100, 'application/x-sh');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/documents', [
                'document_type' => 'licence',
                'file' => $invalidMimeFile,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);

        // Oversized file (> 10MB = 10240KB)
        $oversizedFile = UploadedFile::fake()->create('giant.pdf', 11000, 'application/pdf');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/documents', [
                'document_type' => 'licence',
                'file' => $oversizedFile,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_tradie_can_delete_pending_and_rejected_documents_but_not_approved(): void
    {
        Storage::fake('local');

        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create(['user_id' => $user->id]);

        // 1. Delete pending document
        $pendingFile = UploadedFile::fake()->create('pending.pdf', 200, 'application/pdf');
        $storedPending = $pendingFile->store('tradie-documents/'.$profile->id, 'local');

        $pendingDoc = TradieDocument::create([
            'tradie_id' => $profile->id,
            'document_type' => 'identity',
            'file_path' => $storedPending,
            'original_name' => 'pending.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 204800,
            'status' => 'pending',
        ]);

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/tradie/documents/{$pendingDoc->id}")
            ->assertOk();

        $this->assertDatabaseMissing('tradie_documents', ['id' => $pendingDoc->id]);
        Storage::disk('local')->assertMissing($storedPending);

        // 2. Delete rejected document
        $rejectedFile = UploadedFile::fake()->create('rejected.pdf', 200, 'application/pdf');
        $storedRejected = $rejectedFile->store('tradie-documents/'.$profile->id, 'local');

        $rejectedDoc = TradieDocument::create([
            'tradie_id' => $profile->id,
            'document_type' => 'insurance',
            'file_path' => $storedRejected,
            'original_name' => 'rejected.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 204800,
            'status' => 'rejected',
        ]);

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/tradie/documents/{$rejectedDoc->id}")
            ->assertOk();

        $this->assertDatabaseMissing('tradie_documents', ['id' => $rejectedDoc->id]);

        // 3. Approved document CANNOT be deleted
        $approvedDoc = TradieDocument::create([
            'tradie_id' => $profile->id,
            'document_type' => 'licence',
            'file_path' => 'tradie-documents/approved.pdf',
            'original_name' => 'approved.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 204800,
            'status' => 'approved',
        ]);

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/tradie/documents/{$approvedDoc->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['document']);

        $this->assertDatabaseHas('tradie_documents', ['id' => $approvedDoc->id]);
    }

    public function test_tradie_cannot_delete_another_tradies_document_idor(): void
    {
        $user1 = User::factory()->tradie()->create();
        $profile1 = TradieProfile::factory()->create(['user_id' => $user1->id]);

        $user2 = User::factory()->tradie()->create();
        $profile2 = TradieProfile::factory()->create(['user_id' => $user2->id]);

        $doc2 = TradieDocument::create([
            'tradie_id' => $profile2->id,
            'document_type' => 'insurance',
            'file_path' => 'tradie-documents/user2.pdf',
            'original_name' => 'user2.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 1024,
            'status' => 'pending',
        ]);

        // Tradie 1 attempts to delete Tradie 2's document
        $this->actingAs($user1, 'sanctum')
            ->deleteJson("/api/v1/tradie/documents/{$doc2->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('tradie_documents', ['id' => $doc2->id]);
    }

    // =========================================================================
    // 5. Tradie Availability Self-Service Tests
    // =========================================================================

    public function test_tradie_can_create_list_update_and_delete_availability(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create(['user_id' => $user->id]);

        // 1. Create weekly slot
        $weeklyResponse = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/availability', [
                'day_of_week' => 1, // Monday
                'start_time' => '08:00',
                'end_time' => '16:00',
                'notes' => 'Regular Monday shift',
            ])
            ->assertCreated();

        $weeklyId = $weeklyResponse->json('data.id');
        $weeklyResponse->assertJsonPath('data.day_of_week', 1)
            ->assertJsonPath('data.start_time', '08:00')
            ->assertJsonPath('data.end_time', '16:00')
            ->assertJsonPath('data.is_available', true);

        // 2. Create date blackout override
        $overrideResponse = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/availability', [
                'specific_date' => '2026-12-25',
                'is_available' => false,
                'notes' => 'Christmas Day holiday',
            ])
            ->assertCreated();

        $overrideId = $overrideResponse->json('data.id');
        $overrideResponse->assertJsonPath('data.specific_date', '2026-12-25')
            ->assertJsonPath('data.is_available', false);

        // 3. List availability
        $listResponse = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/tradie/availability')
            ->assertOk();

        $listResponse->assertJsonCount(2, 'data');

        // 4. Update weekly slot
        $updateResponse = $this->actingAs($user, 'sanctum')
            ->putJson("/api/v1/tradie/availability/{$weeklyId}", [
                'start_time' => '09:00',
                'end_time' => '17:00',
            ])
            ->assertOk();

        $updateResponse->assertJsonPath('data.start_time', '09:00')
            ->assertJsonPath('data.end_time', '17:00');

        // 5. Delete slot
        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/tradie/availability/{$weeklyId}")
            ->assertOk();

        $this->assertDatabaseMissing('tradie_availability', ['id' => $weeklyId]);
    }

    public function test_invalid_availability_times_or_days_are_rejected(): void
    {
        $user = User::factory()->tradie()->create();
        TradieProfile::factory()->create(['user_id' => $user->id]);

        // End time before start time
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/availability', [
                'day_of_week' => 2,
                'start_time' => '17:00',
                'end_time' => '08:00',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['end_time']);

        // Invalid day of week (> 6)
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/tradie/availability', [
                'day_of_week' => 7,
                'start_time' => '08:00',
                'end_time' => '16:00',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['day_of_week']);
    }

    public function test_tradie_cannot_access_update_or_delete_another_tradies_availability_idor(): void
    {
        $user1 = User::factory()->tradie()->create();
        $profile1 = TradieProfile::factory()->create(['user_id' => $user1->id]);

        $user2 = User::factory()->tradie()->create();
        $profile2 = TradieProfile::factory()->create(['user_id' => $user2->id]);

        $slot2 = TradieAvailability::create([
            'tradie_id' => $profile2->id,
            'day_of_week' => 3,
            'start_time' => '08:00',
            'end_time' => '16:00',
        ]);

        // Tradie 1 tries to update Tradie 2's slot
        $this->actingAs($user1, 'sanctum')
            ->putJson("/api/v1/tradie/availability/{$slot2->id}", [
                'start_time' => '10:00',
            ])
            ->assertNotFound();

        // Tradie 1 tries to delete Tradie 2's slot
        $this->actingAs($user1, 'sanctum')
            ->deleteJson("/api/v1/tradie/availability/{$slot2->id}")
            ->assertNotFound();

        $this->assertDatabaseHas('tradie_availability', ['id' => $slot2->id]);
    }

    // =========================================================================
    // 6. Onboarding Status Summary Tests
    // =========================================================================

    public function test_onboarding_status_summary_returns_accurate_counts(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create([
            'user_id' => $user->id,
            'verification_status' => 'pending',
        ]);

        $service1 = Service::factory()->create(['status' => 'active']);
        $service2 = Service::factory()->create(['status' => 'active']);
        $profile->services()->attach([$service1->id, $service2->id]);

        $location1 = Location::factory()->create(['status' => 'active']);
        $profile->serviceAreas()->attach([$location1->id]);

        TradieDocument::create([
            'tradie_id' => $profile->id,
            'document_type' => 'licence',
            'file_path' => 'tradie-documents/licence.pdf',
            'original_name' => 'licence.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 1024,
            'status' => 'pending',
        ]);

        TradieAvailability::create([
            'tradie_id' => $profile->id,
            'day_of_week' => 1,
            'start_time' => '08:00',
            'end_time' => '16:00',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/tradie/onboarding-status')
            ->assertOk();

        $response->assertJson([
            'data' => [
                'services' => [
                    'configured' => true,
                    'count' => 2,
                ],
                'service_areas' => [
                    'configured' => true,
                    'count' => 1,
                ],
                'documents' => [
                    'uploaded' => true,
                    'count' => 1,
                ],
                'verification' => [
                    'status' => 'pending',
                ],
                'availability' => [
                    'configured' => true,
                    'count' => 1,
                ],
            ],
        ]);
    }
}
