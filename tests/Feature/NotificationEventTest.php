<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Conversation;
use App\Models\Job;
use App\Models\Location;
use App\Models\Notification;
use App\Models\Quote;
use App\Models\RequestTradie;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationEventTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // 1. Lead Assignment Event (tradie_selected)
    // -------------------------------------------------------------------------

    public function test_tradie_receives_notification_when_matched_and_selected(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create([
            'user_id' => $tradieUser->id,
            'verification_status' => 'verified',
        ]);

        $service = Service::factory()->create(['status' => 'active']);
        $location = Location::factory()->create(['postcode' => '2000', 'status' => 'active']);

        $tradieProfile->services()->attach($service->id);
        $tradieProfile->serviceAreas()->attach($location->id);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'location_id' => $location->id,
            'postcode' => '2000',
            'status' => 'matching',
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/matching-tradies", [
                'tradie_ids' => [$tradieProfile->id],
            ])
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'tradie_selected',
        ]);

        $notification = Notification::where('user_id', $tradieUser->id)->where('type', 'tradie_selected')->first();
        $this->assertEquals($serviceRequest->id, $notification->data['service_request_id']);
    }

    // -------------------------------------------------------------------------
    // 2. Chat Message Event (new_message)
    // -------------------------------------------------------------------------

    public function test_recipient_receives_notification_when_chat_message_is_sent(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'matching',
        ]);

        $conversation = Conversation::factory()->create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        // Customer sends message to tradie
        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [
                'body' => 'Hello, can you help with this plumbing job?',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'new_message',
        ]);

        // Sender does not get a notification
        $this->assertDatabaseMissing('notifications', [
            'user_id' => $customer->id,
            'type' => 'new_message',
        ]);
    }

    // -------------------------------------------------------------------------
    // 3. Quote Submission Event (new_quote)
    // -------------------------------------------------------------------------

    public function test_customer_receives_notification_when_quote_is_submitted(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'quoting',
        ]);

        RequestTradie::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/quotes", [
                'quote_type' => 'fixed',
                'amount' => 350.00,
                'description' => 'Fix leaking pipe under kitchen sink',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $customer->id,
            'type' => 'new_quote',
        ]);

        $notification = Notification::where('user_id', $customer->id)->where('type', 'new_quote')->first();
        $this->assertEquals($serviceRequest->id, $notification->data['service_request_id']);
    }

    // -------------------------------------------------------------------------
    // 4. Quote Accepted Event (quote_accepted)
    // -------------------------------------------------------------------------

    public function test_tradie_receives_notification_when_quote_is_accepted(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'quoting',
        ]);

        RequestTradie::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $quote = Quote::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'pending',
            'amount' => 400.00,
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote->id}/accept")
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'quote_accepted',
        ]);
    }

    // -------------------------------------------------------------------------
    // 5. Quote Rejected Event (quote_rejected)
    // -------------------------------------------------------------------------

    public function test_tradie_receives_notification_when_quote_is_rejected(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'quoting',
        ]);

        RequestTradie::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
        ]);

        $quote = Quote::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'pending',
            'amount' => 400.00,
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote->id}/reject")
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'quote_rejected',
        ]);
    }

    // -------------------------------------------------------------------------
    // 6. Appointment Scheduled Event (appointment_scheduled)
    // -------------------------------------------------------------------------

    public function test_tradie_receives_notification_when_appointment_is_scheduled(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'quote_accepted',
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

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                'starts_at' => now()->addDays(2)->toIso8601String(),
                'ends_at' => now()->addDays(2)->addHours(2)->toIso8601String(),
                'notes' => 'Please call when arriving at front gate.',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'appointment_scheduled',
        ]);
    }

    // -------------------------------------------------------------------------
    // 7. Job Started Event (job_started)
    // -------------------------------------------------------------------------

    public function test_customer_receives_notification_when_job_starts(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'scheduled',
        ]);

        $appointment = Appointment::factory()->create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        $job = Job::factory()->create([
            'request_id' => $serviceRequest->id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/start")
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $customer->id,
            'type' => 'job_started',
        ]);
    }

    // -------------------------------------------------------------------------
    // 8. Job Completed Event (job_completed)
    // -------------------------------------------------------------------------

    public function test_customer_receives_notification_when_job_completes(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'in_progress',
        ]);

        $appointment = Appointment::factory()->create([
            'request_id' => $serviceRequest->id,
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'scheduled',
        ]);

        $job = Job::factory()->create([
            'request_id' => $serviceRequest->id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'in_progress',
            'started_at' => now()->subHour(),
        ]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/complete")
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $customer->id,
            'type' => 'job_completed',
        ]);
    }

    // -------------------------------------------------------------------------
    // 9. Review Submitted Event (review_submitted)
    // -------------------------------------------------------------------------

    public function test_tradie_receives_notification_when_review_is_submitted(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'completed',
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
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->id}/reviews", [
                'rating' => 5,
                'review_text' => 'Fantastic service! Highly recommended.',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'review_submitted',
        ]);
    }

    // -------------------------------------------------------------------------
    // 10. Review Response Event (review_responded)
    // -------------------------------------------------------------------------

    public function test_customer_receives_notification_when_tradie_responds_to_review(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $review = Review::factory()->create([
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'moderation_status' => 'approved',
            'rating' => 5,
        ]);

        $this->actingAs($tradieUser, 'sanctum')
            ->postJson("/api/v1/reviews/{$review->id}/response", [
                'response_text' => 'Thank you very much for your kind words!',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $customer->id,
            'type' => 'review_responded',
        ]);
    }

    // -------------------------------------------------------------------------
    // 11. Review Approved Event (review_approved)
    // -------------------------------------------------------------------------

    public function test_tradie_receives_notification_when_review_is_approved_by_admin(): void
    {
        $admin = User::factory()->admin()->create(['status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $review = Review::factory()->create([
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'moderation_status' => 'pending',
            'rating' => 5,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/reviews/{$review->id}/approve")
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'review_approved',
        ]);
    }

    // -------------------------------------------------------------------------
    // 12. Review Rejected Event (review_rejected)
    // -------------------------------------------------------------------------

    public function test_customer_receives_notification_when_review_is_rejected_by_admin(): void
    {
        $admin = User::factory()->admin()->create(['status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $review = Review::factory()->create([
            'customer_id' => $customer->id,
            'tradie_id' => $tradieProfile->id,
            'moderation_status' => 'pending',
            'rating' => 1,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/reviews/{$review->id}/reject")
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $customer->id,
            'type' => 'review_rejected',
        ]);
    }

    // -------------------------------------------------------------------------
    // 13. Transaction Atomicity / Failure Protection Tests
    // -------------------------------------------------------------------------

    public function test_failed_quote_acceptance_does_not_generate_notification(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'completed', // Ineligible status for quote acceptance
        ]);

        $quote = Quote::factory()->create([
            'request_id' => $serviceRequest->id,
            'tradie_id' => $tradieProfile->id,
            'status' => 'rejected', // Ineligible status for acceptance
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/quotes/{$quote->id}/accept")
            ->assertUnprocessable();

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'quote_accepted',
        ]);
    }

    public function test_failed_appointment_creation_does_not_generate_notification(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $tradieUser = User::factory()->tradie()->create(['status' => 'active']);
        $tradieProfile = TradieProfile::factory()->create(['user_id' => $tradieUser->id]);

        $serviceRequest = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'submitted', // Ineligible status
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/service-requests/{$serviceRequest->id}/appointments", [
                'starts_at' => now()->addDays(2)->toIso8601String(),
            ])
            ->assertUnprocessable();

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $tradieUser->id,
            'type' => 'appointment_scheduled',
        ]);
    }
}
