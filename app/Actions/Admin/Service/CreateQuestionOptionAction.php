<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\ServiceQuestion;
use App\Models\ServiceQuestionOption;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CreateQuestionOptionAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Create a choice option for a multiple/single choice question with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $questionId, array $data): ServiceQuestionOption
    {
        return DB::transaction(function () use ($admin, $questionId, $data) {
            $question = ServiceQuestion::find($questionId);

            if (! $question) {
                abort(Response::HTTP_NOT_FOUND, 'Question not found.');
            }

            $option = ServiceQuestionOption::create([
                'question_id' => $question->id,
                'label' => $data['label'],
                'value' => $data['value'],
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'question_option.created',
                entityType: 'service_question_options',
                entityId: $option->id,
                oldValues: null,
                newValues: $option->only(['question_id', 'label', 'value', 'sort_order'])
            );

            return $option;
        });
    }
}
