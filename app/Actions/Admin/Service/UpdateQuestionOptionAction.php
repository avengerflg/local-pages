<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\ServiceQuestionOption;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateQuestionOptionAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update a question choice option with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $optionId, array $data): ServiceQuestionOption
    {
        return DB::transaction(function () use ($admin, $optionId, $data) {
            $option = ServiceQuestionOption::where('id', $optionId)
                ->lockForUpdate()
                ->first();

            if (! $option) {
                abort(Response::HTTP_NOT_FOUND, 'Option not found.');
            }

            $oldValues = $option->only(['label', 'value', 'sort_order']);

            $updates = [];
            if (isset($data['label'])) {
                $updates['label'] = $data['label'];
            }
            if (isset($data['value'])) {
                $updates['value'] = $data['value'];
            }
            if (array_key_exists('sort_order', $data)) {
                $updates['sort_order'] = (int) $data['sort_order'];
            }

            $option->update($updates);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'question_option.updated',
                entityType: 'service_question_options',
                entityId: $option->id,
                oldValues: $oldValues,
                newValues: $option->only(['label', 'value', 'sort_order'])
            );

            return $option;
        });
    }
}
