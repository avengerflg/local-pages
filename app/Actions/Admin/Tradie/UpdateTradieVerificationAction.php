<?php

namespace App\Actions\Admin\Tradie;

use App\Actions\Admin\LogAuditAction;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateTradieVerificationAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update tradie verification status with timestamps and audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $tradieId, array $data): TradieProfile
    {
        return DB::transaction(function () use ($admin, $tradieId, $data) {
            $tradie = TradieProfile::where('id', $tradieId)
                ->lockForUpdate()
                ->first();

            if (! $tradie) {
                abort(Response::HTTP_NOT_FOUND, 'Tradie not found.');
            }

            $newStatus = $data['verification_status'];
            $oldStatus = $tradie->verification_status;

            if ($oldStatus !== $newStatus) {
                $updates = ['verification_status' => $newStatus];

                if ($newStatus === 'verified' && is_null($tradie->verified_at)) {
                    $updates['verified_at'] = now();
                }

                $tradie->update($updates);

                $this->logAuditAction->execute(
                    actor: $admin,
                    action: 'tradie.verification_updated',
                    entityType: 'tradie_profiles',
                    entityId: $tradie->id,
                    oldValues: ['verification_status' => $oldStatus],
                    newValues: ['verification_status' => $newStatus]
                );
            }

            return $tradie->loadMissing(['user', 'services', 'serviceAreas', 'availability']);
        });
    }
}
