<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateServiceStatusAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update service active/inactive status with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $serviceId, array $data): Service
    {
        return DB::transaction(function () use ($admin, $serviceId, $data) {
            $service = Service::where('id', $serviceId)
                ->lockForUpdate()
                ->first();

            if (! $service) {
                abort(Response::HTTP_NOT_FOUND, 'Service not found.');
            }

            $newStatus = $data['status'];
            $oldStatus = $service->status;

            if ($oldStatus !== $newStatus) {
                $service->update(['status' => $newStatus]);

                $this->logAuditAction->execute(
                    actor: $admin,
                    action: 'service.status_updated',
                    entityType: 'services',
                    entityId: $service->id,
                    oldValues: ['status' => $oldStatus],
                    newValues: ['status' => $newStatus]
                );
            }

            return $service;
        });
    }
}
