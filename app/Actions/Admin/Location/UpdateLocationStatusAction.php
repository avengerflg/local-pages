<?php

namespace App\Actions\Admin\Location;

use App\Actions\Admin\LogAuditAction;
use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateLocationStatusAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update location active/inactive status with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $locationId, array $data): Location
    {
        return DB::transaction(function () use ($admin, $locationId, $data) {
            $location = Location::where('id', $locationId)
                ->lockForUpdate()
                ->first();

            if (! $location) {
                abort(Response::HTTP_NOT_FOUND, 'Location not found.');
            }

            $newStatus = $data['status'];
            $oldStatus = $location->status;

            if ($oldStatus !== $newStatus) {
                $location->update(['status' => $newStatus]);

                $this->logAuditAction->execute(
                    actor: $admin,
                    action: 'location.status_updated',
                    entityType: 'locations',
                    entityId: $location->id,
                    oldValues: ['status' => $oldStatus],
                    newValues: ['status' => $newStatus]
                );
            }

            return $location->loadMissing('parent');
        });
    }
}
