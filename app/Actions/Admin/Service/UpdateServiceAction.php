<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class UpdateServiceAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update an existing service catalog entry with audit logging.
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

            $oldValues = $service->only(['name', 'slug', 'description', 'status']);

            $updates = [];
            if (isset($data['name'])) {
                $updates['name'] = $data['name'];
            }
            if (isset($data['slug'])) {
                $updates['slug'] = Str::slug($data['slug']);
            }
            if (array_key_exists('description', $data)) {
                $updates['description'] = $data['description'];
            }
            if (isset($data['status'])) {
                $updates['status'] = $data['status'];
            }

            $service->update($updates);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'service.updated',
                entityType: 'services',
                entityId: $service->id,
                oldValues: $oldValues,
                newValues: $service->only(['name', 'slug', 'description', 'status'])
            );

            return $service;
        });
    }
}
