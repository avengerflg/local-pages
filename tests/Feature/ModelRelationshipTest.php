<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Conversation;
use App\Models\CustomerProfile;
use App\Models\Job;
use App\Models\Location;
use App\Models\Message;
use App\Models\Quote;
use App\Models\RequestTradie;
use App\Models\Review;
use App\Models\ReviewReport;
use App\Models\ReviewResponse;
use App\Models\Service;
use App\Models\ServiceQuestion;
use App\Models\ServiceQuestionOption;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_customer_profile(): void
    {
        $user = User::factory()->create();
        $profile = CustomerProfile::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->customerProfile->is($profile));
        $this->assertTrue($profile->user->is($user));
    }

    public function test_user_has_tradie_profile(): void
    {
        $user = User::factory()->tradie()->create();
        $profile = TradieProfile::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->tradieProfile->is($profile));
        $this->assertTrue($profile->user->is($user));
    }

    public function test_tradie_profile_belongs_to_many_services(): void
    {
        $tradie = TradieProfile::factory()->create();
        $service = Service::factory()->create();

        $tradie->services()->attach($service->id);

        $this->assertTrue($tradie->services->contains($service));
        $this->assertTrue($service->tradieProfiles->contains($tradie));
    }

    public function test_tradie_profile_belongs_to_many_service_areas(): void
    {
        $tradie = TradieProfile::factory()->create();
        $location = Location::factory()->create();

        $tradie->serviceAreas()->attach($location->id);

        $this->assertTrue($tradie->serviceAreas->contains($location));
        $this->assertTrue($location->tradieProfiles->contains($tradie));
    }

    public function test_service_has_many_questions(): void
    {
        $service = Service::factory()->create();
        $question = ServiceQuestion::factory()->create(['service_id' => $service->id]);

        $this->assertTrue($service->questions->contains($question));
        $this->assertTrue($question->service->is($service));
    }

    public function test_service_question_has_many_options(): void
    {
        $question = ServiceQuestion::factory()->create();
        $option = ServiceQuestionOption::factory()->create(['question_id' => $question->id]);

        $this->assertTrue($question->options->contains($option));
        $this->assertTrue($option->question->is($question));
    }

    public function test_location_parent_and_children(): void
    {
        $parent = Location::factory()->asState()->create();
        $child = Location::factory()->create(['parent_id' => $parent->id]);

        $this->assertTrue($parent->children->contains($child));
        $this->assertTrue($child->parent->is($parent));
    }

    public function test_service_request_belongs_to_customer_and_service(): void
    {
        $customer = User::factory()->create();
        $service = Service::factory()->create();
        $request = ServiceRequest::factory()->create([
            'customer_id' => $customer->id,
            'service_id' => $service->id,
        ]);

        $this->assertTrue($request->customer->is($customer));
        $this->assertTrue($request->service->is($service));
        $this->assertTrue($customer->serviceRequests->contains($request));
        $this->assertTrue($service->serviceRequests->contains($request));
    }

    public function test_service_request_has_many_quotes(): void
    {
        $request = ServiceRequest::factory()->create();
        $quote = Quote::factory()->create(['request_id' => $request->id]);

        $this->assertTrue($request->quotes->contains($quote));
        $this->assertTrue($quote->serviceRequest->is($request));
    }

    public function test_service_request_has_many_selected_tradies(): void
    {
        $request = ServiceRequest::factory()->create();
        $tradie = TradieProfile::factory()->create();
        $requestTradie = RequestTradie::factory()->create([
            'request_id' => $request->id,
            'tradie_id' => $tradie->id,
        ]);

        $this->assertTrue($request->requestTradies->contains($requestTradie));
        $this->assertTrue($tradie->requestTradies->contains($requestTradie));
    }

    public function test_conversation_has_many_messages(): void
    {
        $conversation = Conversation::factory()->create();
        $message = Message::factory()->create(['conversation_id' => $conversation->id]);

        $this->assertTrue($conversation->messages->contains($message));
        $this->assertTrue($message->conversation->is($conversation));
    }

    public function test_quote_belongs_to_tradie(): void
    {
        $tradie = TradieProfile::factory()->create();
        $quote = Quote::factory()->create(['tradie_id' => $tradie->id]);

        $this->assertTrue($quote->tradieProfile->is($tradie));
        $this->assertTrue($tradie->quotes->contains($quote));
    }

    public function test_quote_has_one_appointment(): void
    {
        $quote = Quote::factory()->create();
        $appointment = Appointment::factory()->create([
            'request_id' => $quote->request_id,
            'quote_id' => $quote->id,
            'tradie_id' => $quote->tradie_id,
        ]);

        $this->assertTrue($quote->appointment->is($appointment));
        $this->assertTrue($appointment->quote->is($quote));
    }

    public function test_appointment_has_one_job(): void
    {
        $appointment = Appointment::factory()->create();
        $job = Job::factory()->create([
            'request_id' => $appointment->request_id,
            'appointment_id' => $appointment->id,
            'tradie_id' => $appointment->tradie_id,
        ]);

        $this->assertTrue($appointment->job->is($job));
        $this->assertTrue($job->appointment->is($appointment));
    }

    public function test_job_has_one_review(): void
    {
        $job = Job::factory()->completed()->create();
        $review = Review::factory()->create([
            'job_id' => $job->id,
            'tradie_id' => $job->tradie_id,
        ]);

        $this->assertTrue($job->review->is($review));
        $this->assertTrue($review->job->is($job));
    }

    public function test_review_has_one_response(): void
    {
        $review = Review::factory()->create();
        $response = ReviewResponse::factory()->create([
            'review_id' => $review->id,
            'tradie_id' => $review->tradie_id,
        ]);

        $this->assertTrue($review->response->is($response));
        $this->assertTrue($response->review->is($review));
    }

    public function test_review_has_many_reports(): void
    {
        $review = Review::factory()->create();
        $report = ReviewReport::factory()->create(['review_id' => $review->id]);

        $this->assertTrue($review->reports->contains($report));
        $this->assertTrue($report->review->is($review));
    }
}
