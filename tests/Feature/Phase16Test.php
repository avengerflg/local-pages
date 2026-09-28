<?php

namespace Tests\Feature;

use App\Models\Job;
use App\Models\Review;
use App\Models\ReviewReport;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase16Test extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->tradie = User::factory()->create(['role' => 'tradie']);
        TradieProfile::factory()->create(['user_id' => $this->tradie->id]);

        $this->admin = User::factory()->create(['role' => 'admin']);

        $request = ServiceRequest::factory()->create([
            'customer_id' => $this->customer->id,
            'status' => 'completed',
        ]);

        $job = Job::factory()->create([
            'request_id' => $request->id,
            'tradie_id' => $this->tradie->tradieProfile->id,
            'status' => 'completed',
        ]);

        $this->review = Review::factory()->create([
            'job_id' => $job->id,
            'customer_id' => $this->customer->id,
            'tradie_id' => $this->tradie->tradieProfile->id,
            'moderation_status' => 'approved',
        ]);
    }

    public function test_customer_can_submit_review_report(): void
    {
        $response = $this->actingAs($this->customer)->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'Offensive language used.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.reason', 'Offensive language used.')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('review_reports', [
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'pending',
        ]);

        // Review should still be approved
        $this->assertDatabaseHas('reviews', [
            'id' => $this->review->id,
            'moderation_status' => 'approved',
        ]);
    }

    public function test_tradie_can_submit_review_report(): void
    {
        $response = $this->actingAs($this->tradie)->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'Fake review.',
        ]);

        $response->assertStatus(201);
    }

    public function test_unauthenticated_user_cannot_submit_review_report(): void
    {
        $response = $this->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'Fake review.',
        ]);

        $response->assertStatus(401);
    }

    public function test_duplicate_review_report_is_rejected(): void
    {
        $this->actingAs($this->customer)->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'First report',
        ])->assertStatus(201);

        $response = $this->actingAs($this->customer)->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'Second report',
        ]);

        $response->assertStatus(422);
    }

    public function test_reporter_id_cannot_be_spoofed(): void
    {
        $this->actingAs($this->customer)->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'Report',
            'reporter_id' => $this->tradie->id, // Try to spoof tradie
        ]);

        $this->assertDatabaseHas('review_reports', [
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id, // Should use authenticated user ID
        ]);

        $this->assertDatabaseMissing('review_reports', [
            'reporter_id' => $this->tradie->id,
        ]);
    }

    public function test_customer_cannot_access_admin_review_reports(): void
    {
        $response = $this->actingAs($this->customer)->getJson('/api/v1/admin/review-reports');
        $response->assertStatus(403);
    }

    public function test_tradie_cannot_access_admin_review_reports(): void
    {
        $response = $this->actingAs($this->tradie)->getJson('/api/v1/admin/review-reports');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_pending_review_reports(): void
    {
        ReviewReport::factory()->create([
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/review-reports');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.status', 'pending');
    }

    public function test_non_admin_cannot_resolve_review_report(): void
    {
        $report = ReviewReport::factory()->create([
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->customer)->postJson("/api/v1/admin/review-reports/{$report->id}/resolve", [
            'resolution' => 'dismiss',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_dismiss_review_report(): void
    {
        $report = ReviewReport::factory()->create([
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/v1/admin/review-reports/{$report->id}/resolve", [
            'resolution' => 'dismiss',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'resolved');

        $this->assertDatabaseHas('review_reports', [
            'id' => $report->id,
            'status' => 'resolved',
            'resolved_by' => $this->admin->id,
        ]);

        // Review status should be unchanged
        $this->assertDatabaseHas('reviews', [
            'id' => $this->review->id,
            'moderation_status' => 'approved',
        ]);

        // Check audit log
        $this->assertDatabaseHas('audit_logs', [
            'actor_id' => $this->admin->id,
            'action' => 'review_report_resolved',
            'entity_type' => ReviewReport::class,
            'entity_id' => $report->id,
        ]);
    }

    public function test_admin_can_uphold_review_report(): void
    {
        $report = ReviewReport::factory()->create([
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/v1/admin/review-reports/{$report->id}/resolve", [
            'resolution' => 'uphold',
        ]);

        $response->assertStatus(200);

        // Review status should be rejected
        $this->assertDatabaseHas('reviews', [
            'id' => $this->review->id,
            'moderation_status' => 'rejected',
        ]);
    }

    public function test_resolved_report_cannot_be_resolved_again(): void
    {
        $report = ReviewReport::factory()->create([
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'resolved',
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/v1/admin/review-reports/{$report->id}/resolve", [
            'resolution' => 'dismiss',
        ]);

        $response->assertStatus(422);
    }

    public function test_pending_report_does_not_hide_review(): void
    {
        // When report is created...
        $this->actingAs($this->customer)->postJson("/api/v1/reviews/{$this->review->id}/reports", [
            'reason' => 'Bad.',
        ]);

        // Tradie reviews should still return the approved review
        $response = $this->getJson("/api/v1/tradies/{$this->tradie->tradieProfile->id}/reviews");

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $this->review->id);
    }

    public function test_upheld_report_rejects_review(): void
    {
        $report = ReviewReport::factory()->create([
            'review_id' => $this->review->id,
            'reporter_id' => $this->customer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin)->postJson("/api/v1/admin/review-reports/{$report->id}/resolve", [
            'resolution' => 'uphold',
        ]);

        // Tradie reviews should NO LONGER return the review
        $response = $this->getJson("/api/v1/tradies/{$this->tradie->tradieProfile->id}/reviews");

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 0);
    }
}
