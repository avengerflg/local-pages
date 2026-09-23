<?php

namespace App\Actions\ServiceRequest;

use App\Models\RequestAnswer;
use App\Models\RequestAttachment;
use App\Models\Service;
use App\Models\ServiceQuestion;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateServiceRequestAction
{
    /**
     * Execute the service request creation.
     *
     * @param  array<string, mixed>  $data
     * @param  list<UploadedFile>  $attachments
     */
    public function execute(User $user, array $data, array $attachments = []): ServiceRequest
    {
        $service = Service::where('id', $data['service_id'])
            ->where('status', 'active')
            ->first();

        if (! $service) {
            throw ValidationException::withMessages([
                'service_id' => ['The selected service is invalid or inactive.'],
            ]);
        }

        $serviceQuestions = ServiceQuestion::where('service_id', $service->id)
            ->where('status', 'active')
            ->with('options')
            ->orderBy('sort_order')
            ->get()
            ->keyBy('id');

        $submittedAnswers = collect($data['answers'] ?? [])->keyBy('question_id');

        // 1. Validate that all submitted answers belong to questions on this service
        foreach ($submittedAnswers as $questionId => $answerData) {
            if (! $serviceQuestions->has($questionId)) {
                throw ValidationException::withMessages([
                    'answers' => ["Question ID {$questionId} does not belong to the selected service."],
                ]);
            }

            /** @var ServiceQuestion $question */
            $question = $serviceQuestions->get($questionId);

            // Validate option if provided
            if (! empty($answerData['selected_option_id'])) {
                $optionExists = $question->options->contains('id', $answerData['selected_option_id']);
                if (! $optionExists) {
                    throw ValidationException::withMessages([
                        'answers' => ["Option ID {$answerData['selected_option_id']} is not valid for question ID {$questionId}."],
                    ]);
                }
            }

            // Validate structured_value options if multiple_choice
            if (! empty($answerData['structured_value']) && is_array($answerData['structured_value'])) {
                foreach ($answerData['structured_value'] as $optionItem) {
                    if (is_numeric($optionItem)) {
                        $optionExists = $question->options->contains('id', (int) $optionItem);
                        if (! $optionExists) {
                            throw ValidationException::withMessages([
                                'answers' => ["Option ID {$optionItem} in structured value is not valid for question ID {$questionId}."],
                            ]);
                        }
                    }
                }
            }
        }

        // 2. Validate required and conditional questions
        foreach ($serviceQuestions as $questionId => $question) {
            $isApplicable = $this->isQuestionApplicable($question, $submittedAnswers, $serviceQuestions);

            if ($isApplicable && $question->required) {
                $hasAnswer = false;

                if ($submittedAnswers->has($questionId)) {
                    $ans = $submittedAnswers->get($questionId);
                    if (! empty($ans['answer_text']) || ! empty($ans['selected_option_id']) || ! empty($ans['structured_value'])) {
                        $hasAnswer = true;
                    }
                }

                // If file/image upload question, check if attachments exist
                if (in_array($question->question_type, ['file_upload', 'image_upload'], true) && count($attachments) > 0) {
                    $hasAnswer = true;
                }

                if (! $hasAnswer) {
                    throw ValidationException::withMessages([
                        'answers' => ["Question '{$question->question_text}' is required."],
                    ]);
                }
            }
        }

        // 3. Execute atomic creation in DB transaction
        return DB::transaction(function () use ($user, $service, $data, $submittedAnswers, $attachments) {
            $serviceRequest = ServiceRequest::create([
                'customer_id' => $user->id,
                'service_id' => $service->id,
                'location_id' => $data['location_id'] ?? null,
                'postcode' => $data['postcode'],
                'title' => $data['title'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // Save answers
            foreach ($submittedAnswers as $questionId => $answerData) {
                RequestAnswer::create([
                    'request_id' => $serviceRequest->id,
                    'question_id' => $questionId,
                    'answer_text' => $answerData['answer_text'] ?? null,
                    'selected_option_id' => $answerData['selected_option_id'] ?? null,
                    'structured_value' => $answerData['structured_value'] ?? null,
                ]);
            }

            // Save attachments
            foreach ($attachments as $file) {
                if ($file instanceof UploadedFile) {
                    $path = $file->store('request-attachments', 'public');

                    RequestAttachment::create([
                        'request_id' => $serviceRequest->id,
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getClientMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            $serviceRequest->loadMissing([
                'service',
                'location',
                'answers.question',
                'answers.selectedOption',
                'attachments',
            ]);

            return $serviceRequest;
        });
    }

    /**
     * Determine if a conditional question is applicable based on submitted answers.
     *
     * @param  Collection<int, ServiceQuestion>  $allQuestions
     */
    protected function isQuestionApplicable(ServiceQuestion $question, Collection $submittedAnswers, $allQuestions): bool
    {
        $rule = $question->conditional_rule;

        if (empty($rule) || ! is_array($rule)) {
            return true;
        }

        // Parent question ID
        $parentQuestionId = $rule['depends_on_question_id'] ?? $rule['parent_question_id'] ?? null;

        if (! $parentQuestionId || ! $submittedAnswers->has($parentQuestionId)) {
            return false;
        }

        $parentAnswer = $submittedAnswers->get($parentQuestionId);

        // Option ID match
        $expectedOptionId = $rule['selected_option_id'] ?? $rule['parent_option_id'] ?? null;
        if ($expectedOptionId !== null) {
            $actualOptionId = $parentAnswer['selected_option_id'] ?? null;
            if ((int) $actualOptionId === (int) $expectedOptionId) {
                return true;
            }

            if (! empty($parentAnswer['structured_value']) && is_array($parentAnswer['structured_value'])) {
                if (in_array((int) $expectedOptionId, array_map('intval', $parentAnswer['structured_value']), true)) {
                    return true;
                }
            }

            return false;
        }

        // Value match
        if (isset($rule['value'])) {
            $expectedValue = (string) $rule['value'];
            $actualText = (string) ($parentAnswer['answer_text'] ?? '');

            if (strtolower(trim($actualText)) === strtolower(trim($expectedValue))) {
                return true;
            }

            // Check if selected option has this value
            if (! empty($parentAnswer['selected_option_id']) && $allQuestions->has($parentQuestionId)) {
                $parentQ = $allQuestions->get($parentQuestionId);
                $selectedOpt = $parentQ->options->firstWhere('id', $parentAnswer['selected_option_id']);
                if ($selectedOpt && strtolower(trim((string) $selectedOpt->value)) === strtolower(trim($expectedValue))) {
                    return true;
                }
            }

            return false;
        }

        return true;
    }
}
