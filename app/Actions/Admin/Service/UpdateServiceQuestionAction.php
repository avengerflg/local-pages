<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\ServiceQuestion;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateServiceQuestionAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update an intake question with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $questionId, array $data): ServiceQuestion
    {
        return DB::transaction(function () use ($admin, $questionId, $data) {
            $question = ServiceQuestion::where('id', $questionId)
                ->lockForUpdate()
                ->first();

            if (! $question) {
                abort(Response::HTTP_NOT_FOUND, 'Question not found.');
            }

            $oldValues = $question->only(['question_text', 'question_type', 'required', 'sort_order', 'status']);

            $updates = [];
            if (isset($data['question_text'])) {
                $updates['question_text'] = $data['question_text'];
            }
            if (isset($data['question_type'])) {
                $updates['question_type'] = $data['question_type'];
            }
            if (array_key_exists('required', $data)) {
                $updates['required'] = (bool) $data['required'];
            }
            if (array_key_exists('sort_order', $data)) {
                $updates['sort_order'] = (int) $data['sort_order'];
            }
            if (array_key_exists('conditional_rule', $data)) {
                $updates['conditional_rule'] = $data['conditional_rule'];
            }
            if (isset($data['status'])) {
                $updates['status'] = $data['status'];
            }

            $question->update($updates);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'service_question.updated',
                entityType: 'service_questions',
                entityId: $question->id,
                oldValues: $oldValues,
                newValues: $question->only(['question_text', 'question_type', 'required', 'sort_order', 'status'])
            );

            return $question->loadMissing('options');
        });
    }
}
