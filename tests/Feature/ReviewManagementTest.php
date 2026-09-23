<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\Location;
use App\Models\Quote;
use App\Models\RequestTradie;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewManagementTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Build a completed job scenario with customer, tradie, and related records.
     */
    private function createCompletedJobScenario(): array
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'completed',
        ]);

        RequestTradie::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $quote = Quote::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'accepted',
        ]);

        $appointment = Appointment::factory()->create([
            'request_id' => $serviceRequest->id,
            'quote_id' => $quote->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'completed',
        ]);

        $job = Job::factory()->create([
            'request_id' => $serviceRequest->id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'completed',
            'started_at' => now()->subHours(2),
            'completed_at' => now()->subHour(),
        ]);

        return compact('customer', 'tradieUser', 'tradieProfile', 'serviceRequest', 'job');
    }

    // =========================================================================
    // 1. Review Creation — Unauthenticated & Role Tests
    // =========================================================================

    public function test_unauthenticated_user_cannot_submit_review(): void
    {
        $this->postJson('/api/v1/jobs/1/reviews', [
            'rating' => 5,
            'review_text' => 'Great work!',
        ])->assertUnauthorized();
    }

    public function test_tradie_cannot_submit_review(): void
    {
        ['tradieUser' => $tradieUser, 'tradieProfile' => $tradieProfile, 'job' => $job] =
            $this->createCompletedJobScenario();

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 5,
                'review_text' => 'I should not be allowed to do this.',
            ])
            ->assertForbidden();
    }

    public function test_admin_cannot_submit_review_via_customer_endpoint(): void
    {
        ['job' => $job] = $this->createCompletedJobScenario();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 5,
                'review_text' => 'Admin trying to submit.',
            ])
            ->assertForbidden();
    }

    // =========================================================================
    // 2. Review Creation — Owning Customer Success Path
    // =========================================================================

    public function test_owning_customer_can_review_completed_job(): void
    {
        ['customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 4,
                'review_text' => 'Very professional and on time.',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.rating', 4)
            ->assertJsonPath('data.review_text', 'Very professional and on time.');

        $this->assertDatabaseHas('reviews', [
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $job->tradie_id,
            'rating' => 4,
            'moderation_status' => 'pending',
        ]);
    }

    public function test_review_enters_pending_moderation_status_on_creation(): void
    {
        ['customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 5,
                'review_text' => 'Excellent work!',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('reviews', [
            'job_id' => $job->id,
            'moderation_status' => 'pending',
        ]);

        $this->assertDatabaseMissing('reviews', [
            'job_id' => $job->id,
            'moderation_status' => 'approved',
        ]);
    }

    // =========================================================================
    // 3. Review Creation — Eligibility Failures
    // =========================================================================

    public function test_customer_cannot_review_non_completed_job(): void
    {
        ['customer' => $customer, 'tradieProfile' => $tradieProfile] =
            $this->createCompletedJobScenario();

        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '3000', 'status' => 'active']);

        $activeRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '3000',
            'status' => 'in_progress',
        ]);

        $activeJob = Job::factory()->create([
            'request_id' => $activeRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'in_progress',
            'started_at' => now()->subHour(),
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$activeJob->id}/reviews", [
                'rating' => 3,
                'review_text' => 'Trying to review before job is done.',
            ])
            ->assertUnprocessable();
    }

    public function test_unrelated_customer_cannot_review_another_customers_job(): void
    {
        ['job' => $job] = $this->createCompletedJobScenario();

        $unrelatedCustomer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $this->actingAs($unrelatedCustomer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 1,
                'review_text' => 'I do not own this job.',
            ])
            ->assertNotFound();
    }

    public function test_spoofed_customer_id_in_body_is_ignored(): void
    {
        ['customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();
        $otherCustomer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 5,
                'review_text' => 'Valid review.',
                'customer_id' => $otherCustomer->id, // should be ignored
            ])
            ->assertCreated();

        // The review must be attributed to the authenticated customer, not the spoofed id.
        $this->assertDatabaseHas('reviews', [
            'job_id' => $job->id,
            'customer_id' => $customer->id,
        ]);
        $this->assertDatabaseMissing('reviews', [
            'job_id' => $job->id,
            'customer_id' => $otherCustomer->id,
        ]);
    }

    public function test_spoofed_tradie_id_in_body_is_ignored(): void
    {
        ['customer' => $customer, 'job' => $job, 'tradieProfile' => $tradieProfile] =
            $this->createCompletedJobScenario();

        $otherTradieUser = User::factory()->tradie()->create();
        $otherTradieProfile = TradieProfile::factory()->create(['user_id' => $otherTradieUser->id]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 5,
                'review_text' => 'Valid review.',
                'tradie_id' => $otherTradieProfile->id, // should be ignored
            ])
            ->assertCreated();

        // tradie_id must come from the job, not the request body.
        $this->assertDatabaseHas('reviews', [
            'job_id' => $job->id,
            'tradie_id' => $tradieProfile->id,
        ]);
        $this->assertDatabaseMissing('reviews', [
            'job_id' => $job->id,
            'tradie_id' => $otherTradieProfile->id,
        ]);
    }

    // =========================================================================
    // 4. Duplicate Review Protection
    // =========================================================================

    public function test_duplicate_review_for_same_job_is_rejected(): void
    {
        ['customer' => $customer, 'tradieProfile' => $tradieProfile, 'job' => $job] =
            $this->createCompletedJobScenario();

        // Create an existing review for the same job.
        Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'First review.',
            'moderation_status' => 'pending',
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 4,
                'review_text' => 'Trying to submit again.',
            ])
            ->assertUnprocessable();
    }

    // =========================================================================
    // 5. Review Validation
    // =========================================================================

    public function test_review_requires_rating_and_review_text(): void
    {
        ['customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['rating', 'review_text']);
    }

    public function test_review_rating_must_be_between_1_and_5(): void
    {
        ['customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 6,
                'review_text' => 'Out of range rating.',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['rating']);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 0,
                'review_text' => 'Out of range rating.',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['rating']);
    }

    // =========================================================================
    // 6. Review Visibility — Public Tradie Review Listing
    // =========================================================================

    public function test_only_approved_reviews_appear_in_public_tradie_listing(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        // Pending review — must NOT appear.
        Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 3,
            'review_text' => 'Pending review.',
            'moderation_status' => 'pending',
        ]);

        // Approved review on a second job — must appear.
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '4000', 'status' => 'active']);
        $secondRequest = ServiceRequest::factory()->create([
            'customer_id' => $otherCustomer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '4000',
            'status' => 'completed',
        ]);
        $secondJob = Job::factory()->create([
            'request_id' => $secondRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'completed',
        ]);
        $approvedReview = Review::factory()->create([
            'job_id' => $secondJob->id,
            'customer_id' => $otherCustomer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'Approved and visible review.',
            'moderation_status' => 'approved',
            'published_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/tradies/{$tradieProfile->id}/reviews");

        $response->assertOk();
        $ids = collect($response->json('data'))->pluck('id')->toArray();

        $this->assertContains($approvedReview->id, $ids);
        $this->assertNotContains($job->review?->id, $ids);
    }

    public function test_pending_review_is_not_visible_in_public_listing(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $pendingReview = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 4,
            'review_text' => 'Not yet approved.',
            'moderation_status' => 'pending',
        ]);

        $response = $this->getJson("/api/v1/tradies/{$tradieProfile->id}/reviews");

        $response->assertOk();
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertNotContains($pendingReview->id, $ids);
    }

    public function test_rejected_review_is_not_visible_in_public_listing(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $rejectedReview = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 1,
            'review_text' => 'This was rejected.',
            'moderation_status' => 'rejected',
            'removed_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/tradies/{$tradieProfile->id}/reviews");

        $response->assertOk();
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertNotContains($rejectedReview->id, $ids);
    }

    // =========================================================================
    // 7. Tradie Response
    // =========================================================================

    public function test_unauthenticated_user_cannot_respond_to_review(): void
    {
        $this->postJson('/api/v1/reviews/1/response', [
            'response_text' => 'Hello.',
        ])->assertUnauthorized();
    }

    public function test_customer_cannot_respond_to_review(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'Great!',
            'moderation_status' => 'approved',
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/reviews/{$review->id}/response", [
                'response_text' => 'Trying to respond as customer.',
            ])
            ->assertForbidden();
    }

    public function test_assigned_tradie_can_respond_to_their_review(): void
    {
        ['tradieUser' => $tradieUser, 'tradieProfile' => $tradieProfile,
            'customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 3,
            'review_text' => 'Decent work.',
            'moderation_status' => 'approved',
        ]);

        $response = $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/reviews/{$review->id}/response", [
                'response_text' => 'Thank you for your feedback!',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.response_text', 'Thank you for your feedback!');

        $this->assertDatabaseHas('review_responses', [
            'review_id' => $review->id,
            'tradie_id' => $tradieProfile->id,
            'response_text' => 'Thank you for your feedback!',
        ]);
    }

    public function test_unrelated_tradie_cannot_respond_to_another_tradies_review(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'Excellent.',
            'moderation_status' => 'approved',
        ]);

        // A completely different tradie.
        $otherTradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $otherTradieUser->id]);

        $this->actingAs($otherTradieUser, 'sanctum')
            ->postJson("/api/v1/reviews/{$review->id}/response", [
                'response_text' => 'Trying to respond to someone else\'s review.',
            ])
            ->assertNotFound();
    }

    public function test_duplicate_tradie_response_is_rejected(): void
    {
        ['tradieUser' => $tradieUser, 'tradieProfile' => $tradieProfile,
            'customer' => $customer, 'job' => $job] = $this->createCompletedJobScenario();

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'Great!',
            'moderation_status' => 'approved',
        ]);

        // First response succeeds.
        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/reviews/{$review->id}/response", [
                'response_text' => 'Thank you!',
            ])
            ->assertCreated();

        // Second response must be rejected.
        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/reviews/{$review->id}/response", [
                'response_text' => 'Trying again.',
            ])
            ->assertUnprocessable();
    }

    // =========================================================================
    // 8. Admin Moderation
    // =========================================================================

    public function test_unauthenticated_user_cannot_access_admin_review_endpoints(): void
    {
        $this->getJson('/api/v1/admin/reviews')->assertUnauthorized();
        $this->postJson('/api/v1/admin/reviews/1/approve')->assertUnauthorized();
        $this->postJson('/api/v1/admin/reviews/1/reject')->assertUnauthorized();
    }

    public function test_customer_cannot_access_admin_review_endpoints(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/reviews')
            ->assertForbidden();

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/admin/reviews/1/approve')
            ->assertForbidden();
    }

    public function test_tradie_cannot_access_admin_review_endpoints(): void
    {
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $this->actingAs($tradieUser, 'sanctum')
            ->getJson('/api/v1/admin/reviews')
            ->assertForbidden();
    }

    public function test_admin_can_list_pending_reviews(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $admin = User::factory()->create(['role' => 'admin']);

        Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 4,
            'review_text' => 'Pending review for admin.',
            'moderation_status' => 'pending',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/reviews')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'rating', 'review_text', 'moderation_status']],
            ]);
    }

    public function test_admin_can_approve_pending_review(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $admin = User::factory()->create(['role' => 'admin']);

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'To be approved.',
            'moderation_status' => 'pending',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/reviews/{$review->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.moderation_status', 'approved');

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'moderation_status' => 'approved',
        ]);

        $this->assertNotNull(Review::find($review->id)->published_at);
    }

    public function test_admin_can_reject_pending_review(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $admin = User::factory()->create(['role' => 'admin']);

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 1,
            'review_text' => 'To be rejected.',
            'moderation_status' => 'pending',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/reviews/{$review->id}/reject")
            ->assertOk()
            ->assertJsonPath('data.moderation_status', 'rejected');

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'moderation_status' => 'rejected',
        ]);

        $this->assertNotNull(Review::find($review->id)->removed_at);
    }

    public function test_admin_cannot_approve_already_approved_review(): void
    {
        ['tradieProfile' => $tradieProfile, 'customer' => $customer, 'job' => $job] =
            $this->createCompletedJobScenario();

        $admin = User::factory()->create(['role' => 'admin']);

        $review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'rating' => 5,
            'review_text' => 'Already approved.',
            'moderation_status' => 'approved',
            'published_at' => now(),
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/reviews/{$review->id}/approve")
            ->assertUnprocessable();
    }

    // =========================================================================
    // 9. Customer Immutability — No Edit/Delete Endpoints Exist
    // =========================================================================

    public function test_no_customer_edit_endpoint_exists_for_reviews(): void
    {
        // Verify that PUT/PATCH review routes do not exist.
        // Laravel returns 404 for unregistered routes, which is sufficient to confirm
        // that no customer edit endpoint is exposed.
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer, 'sanctum')
            ->putJson('/api/v1/reviews/1', ['rating' => 3]);

        // Accept 404 (route not registered) or 405 (route exists but method not allowed).
        $this->assertContains($response->status(), [404, 405]);
    }
}
