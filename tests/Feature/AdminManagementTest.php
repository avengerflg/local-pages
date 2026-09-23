<?php

namespace Tests\Feature;

use App\Models\CustomerProfile;
use App\Models\Location;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceQuestionOption;
use App\Models\ServiceRequest;
use App\Models\TradieDocument;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // 1. Authorization & Role Scoping Tests
    // -------------------------------------------------------------------------

    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $this->getJson('/api/v1/admin/dashboard')->assertUnauthorized();
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();
        $this->getJson('/api/v1/admin/tradies')->assertUnauthorized();
        $this->getJson('/api/v1/admin/services')->assertUnauthorized();
        $this->getJson('/api/v1/admin/locations')->assertUnauthorized();
    }

    public function test_customer_cannot_access_admin_endpoints(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/dashboard')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/admin/services', [
                'name' => 'Illegal Service',
            ])
            ->assertForbidden();
    }

    public function test_tradie_cannot_access_admin_endpoints(): void
    {
        $tradieUser = User::factory()->tradie()->create();

        $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/admin/dashboard')
            ->assertForbidden();

        $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/admin/tradies')
            ->assertForbidden();

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'state',
                'name' => 'Victoria',
            ])
            ->assertForbidden();
    }

    // -------------------------------------------------------------------------
    // 2. User Management Tests
    // -------------------------------------------------------------------------

    public function test_admin_can_list_users_with_filters_and_search(): void
    {
        $admin = User::factory()->admin()->create();

        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active', 'name' => 'Alice Customer']);
        $suspendedTradie = User::factory()->tradie()->create(['status' => 'suspended', 'name' => 'Bob Builder']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertOk();

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'status',
                    'mobile',
                    'created_at',
                ],
            ],
            'links',
            'meta',
        ]);

        // Filter by role
        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users?role=customer')
            ->assertOk()
            ->assertJsonPath('data.0.id', $customer->id);

        // Filter by status
        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users?status=suspended')
            ->assertOk()
            ->assertJsonPath('data.0.id', $suspendedTradie->id);

        // Search by name
        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users?search=Alice')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Alice Customer');
    }

    public function test_admin_can_view_single_user_detail_without_sensitive_fields(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create(['role' => 'customer']);
        CustomerProfile::factory()->create(['user_id' => $customer->id, 'postcode' => '2000', 'address' => '123 Main St']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/users/{$customer->id}")
            ->assertOk();

        $response->assertJsonPath('data.id', $customer->id);
        $response->assertJsonPath('data.customer_profile.postcode', '2000');

        // Sensitive fields should never be exposed
        $this->assertArrayNotHasKey('password', $response->json('data'));
        $this->assertArrayNotHasKey('remember_token', $response->json('data'));
    }

    public function test_admin_can_update_user_status_and_audit_is_logged(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$customer->id}/status", [
                'status' => 'suspended',
            ])
            ->assertOk();

        $this->assertEquals('suspended', $customer->fresh()->status);

        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $admin->id,
            'action' => 'user.status_updated',
            'entity_type' => 'users',
            'entity_id' => $customer->id,
        ]);
    }

    public function test_admin_cannot_deactivate_own_account(): void
    {
        $admin = User::factory()->admin()->create(['status' => 'active']);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/users/{$admin->id}/status", [
                'status' => 'suspended',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);

        $this->assertEquals('active', $admin->fresh()->status);
    }

    // -------------------------------------------------------------------------
    // 3. Tradie & Document Management Tests
    // -------------------------------------------------------------------------

    public function test_admin_can_list_and_view_tradies_with_verification_filter(): void
    {
        $admin = User::factory()->admin()->create();
        $tradieUser = User::factory()->tradie()->create();
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'business_name' => 'Sydney Plumbing Pros',
            'verification_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/tradies?verification_status=pending')
            ->assertOk();

        $response->assertJsonPath('data.0.id', $tradieProfile->id);
        $response->assertJsonPath('data.0.business_name', 'Sydney Plumbing Pros');

        // View single tradie
        $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/tradies/{$tradieProfile->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $tradieProfile->id)
            ->assertJsonPath('data.user.email', $tradieUser->email);
    }

    public function test_admin_can_update_tradie_verification_status_and_audit_log_is_created(): void
    {
        $admin = User::factory()->admin()->create();
        $tradieUser = User::factory()->tradie()->create();
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'verification_status' => 'pending',
            'verified_at' => null,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/tradies/{$tradieProfile->id}/verification", [
                'verification_status' => 'verified',
            ])
            ->assertOk();

        $this->assertEquals('verified', $tradieProfile->fresh()->verification_status);
        $this->assertNotNull($tradieProfile->fresh()->verified_at);

        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $admin->id,
            'action' => 'tradie.verification_updated',
            'entity_type' => 'tradie_profiles',
            'entity_id' => $tradieProfile->id,
        ]);
    }

    public function test_admin_can_inspect_document_metadata_and_update_status(): void
    {
        $admin = User::factory()->admin()->create();
        $tradieUser = User::factory()->tradie()->create();
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $document = TradieDocument::create([
            'tradie_id' => $tradieProfile->id,
            'document_type' => 'licence',
            'file_path' => 'private/documents/secret_licence.pdf',
            'original_name' => 'electrical_licence.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 102400,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/v1/admin/tradies/{$tradieProfile->id}/documents")
            ->assertOk();

        $response->assertJsonPath('data.0.original_name', 'electrical_licence.pdf');
        $response->assertJsonPath('data.0.status', 'pending');
        // Private storage path must not be exposed
        $this->assertArrayNotHasKey('file_path', $response->json('data.0'));

        // Review document
        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/tradie-documents/{$document->id}/status", [
                'status' => 'approved',
            ])
            ->assertOk();

        $this->assertEquals('approved', $document->fresh()->status);
        $this->assertEquals($admin->id, $document->fresh()->reviewed_by);
        $this->assertNotNull($document->fresh()->reviewed_at);

        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $admin->id,
            'action' => 'tradie_document.status_updated',
            'entity_type' => 'tradie_documents',
            'entity_id' => $document->id,
        ]);
    }

    // -------------------------------------------------------------------------
    // 4. Service & Question Management Tests
    // -------------------------------------------------------------------------

    public function test_admin_can_manage_services_and_questions(): void
    {
        $admin = User::factory()->admin()->create();

        // 1. Create service
        $serviceResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/services', [
                'name' => 'Air Conditioning & Heating',
                'description' => 'Heating and cooling installations.',
            ])
            ->assertCreated();

        $serviceId = $serviceResponse->json('data.id');
        $this->assertEquals('air-conditioning-heating', $serviceResponse->json('data.slug'));

        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $admin->id,
            'action' => 'service.created',
            'entity_type' => 'services',
            'entity_id' => $serviceId,
        ]);

        // 2. Update service status
        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/services/{$serviceId}/status", [
                'status' => 'inactive',
            ])
            ->assertOk();

        $this->assertEquals('inactive', Service::find($serviceId)->status);

        // 3. Create question
        $questionResponse = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/services/{$serviceId}/questions", [
                'question_text' => 'What type of AC system do you need?',
                'question_type' => 'single_choice',
                'required' => true,
                'sort_order' => 1,
            ])
            ->assertCreated();

        $questionId = $questionResponse->json('data.id');

        // 4. Create option
        $optionResponse = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/service-questions/{$questionId}/options", [
                'label' => 'Split System',
                'value' => 'split_system',
                'sort_order' => 1,
            ])
            ->assertCreated();

        $optionId = $optionResponse->json('data.id');

        // 5. Update option
        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/service-question-options/{$optionId}", [
                'label' => 'Ducted System',
                'value' => 'ducted_system',
            ])
            ->assertOk();

        $this->assertEquals('Ducted System', ServiceQuestionOption::find($optionId)->label);
    }

    // -------------------------------------------------------------------------
    // 5. Location Hierarchy Tests
    // -------------------------------------------------------------------------

    public function test_admin_can_create_locations_adhering_to_hierarchy(): void
    {
        $admin = User::factory()->admin()->create();

        // 1. Create State (parent_id = null)
        $stateResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'state',
                'name' => 'New South Wales',
                'code' => 'NSW',
            ])
            ->assertCreated();

        $stateId = $stateResponse->json('data.id');

        // 2. State cannot have a parent
        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'state',
                'name' => 'Invalid State',
                'parent_id' => $stateId,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['parent_id']);

        // 3. Create Council under State
        $councilResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'council',
                'name' => 'City of Sydney',
                'parent_id' => $stateId,
            ])
            ->assertCreated();

        $councilId = $councilResponse->json('data.id');

        // 4. Create Suburb under Council
        $suburbResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'suburb',
                'name' => 'Surry Hills',
                'parent_id' => $councilId,
            ])
            ->assertCreated();

        $suburbId = $suburbResponse->json('data.id');

        // 5. Create Postcode under Suburb
        $postcodeResponse = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'postcode',
                'name' => '2010',
                'postcode' => '2010',
                'parent_id' => $suburbId,
            ])
            ->assertCreated();

        $postcodeId = $postcodeResponse->json('data.id');

        // 6. Invalid parent hierarchy rejected (e.g. postcode directly under state)
        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/locations', [
                'type' => 'postcode',
                'name' => '9999',
                'parent_id' => $stateId,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['parent_id']);
    }

    // -------------------------------------------------------------------------
    // 6. Dashboard Platform Statistics Tests
    // -------------------------------------------------------------------------

    public function test_admin_can_retrieve_dashboard_platform_metrics(): void
    {
        $admin = User::factory()->admin()->create();

        User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id, 'verification_status' => 'verified']);

        Service::factory()->create(['status' => 'active']);
        ServiceRequest::factory()->create(['status' => 'submitted']);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk();

        $response->assertJsonStructure([
            'data' => [
                'users' => [
                    'total',
                    'customers',
                    'tradies',
                    'admins',
                    'active',
                ],
                'tradies' => [
                    'total',
                    'verified',
                    'pending',
                ],
                'service_requests' => [
                    'total',
                    'submitted',
                ],
                'quotes',
                'appointments',
                'jobs',
                'reviews',
                'services',
            ],
        ]);

        // Financial fields must NOT be present
        $this->assertArrayNotHasKey('revenue', $response->json('data'));
        $this->assertArrayNotHasKey('payments', $response->json('data'));
        $this->assertArrayNotHasKey('payouts', $response->json('data'));
    }
}
