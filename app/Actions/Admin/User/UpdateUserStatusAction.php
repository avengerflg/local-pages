<?php

namespace App\Actions\Admin\User;

use App\Actions\Admin\LogAuditAction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserStatusAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update user account status (active, suspended, pending) with self-deactivation protection and audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, int $userId, array $data): User
    {
        return DB::transaction(function () use ($admin, $userId, $data) {
            $user = User::where('id', $userId)
                ->lockForUpdate()
                ->first();

            if (! $user) {
                abort(Response::HTTP_NOT_FOUND, 'User not found.');
            }

            $newStatus = $data['status'];

            // Prevent administrator from deactivating their own account.
            if ($admin->id === $user->id && $newStatus !== 'active') {
                throw ValidationException::withMessages([
                    'status' => ['Administrators cannot suspend or deactivate their own account.'],
                ]);
            }

            $oldStatus = $user->status;

            if ($oldStatus !== $newStatus) {
                $user->update(['status' => $newStatus]);

                $this->logAuditAction->execute(
                    actor: $admin,
                    action: 'user.status_updated',
                    entityType: 'users',
                    entityId: $user->id,
                    oldValues: ['status' => $oldStatus],
                    newValues: ['status' => $newStatus]
                );
            }

            return $user->loadMissing(['customerProfile', 'tradieProfile']);
        });
    }
}
