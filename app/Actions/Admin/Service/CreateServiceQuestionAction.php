<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\Service;
use App\Models\ServiceQuestion;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CreateServiceQuestionAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Create a new intake question for a service catalog entry with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $serviceId, array $data): ServiceQuestion
    {
        return DB::transaction(function () use ($admin, $serviceId, $data) {
            $service = Service::find($serviceId);

            if (! $service) {
                abort(Response::HTTP_NOT_FOUND, 'Service not found.');
            }

            $question = ServiceQuestion::create([
                'service_id' => $service->id,
                'question_text' => $data['question_text'],
                'question_type' => $data['question_type'],
                'required' => $data['required'] ?? true,
                'sort_order' => $data['sort_order'] ?? 0,
                'conditional_rule' => $data['conditional_rule'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'service_question.created',
                entityType: 'service_questions',
                entityId: $question->id,
                oldValues: null,
                newValues: $question->only(['service_id', 'question_text', 'question_type', 'required', 'sort_order', 'status'])
            );

            return $question->loadMissing('options');
        });
    }
}
