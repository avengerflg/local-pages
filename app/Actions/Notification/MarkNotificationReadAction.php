<?php

namespace App\Actions\Notification;

use App\Models\Notification;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class MarkNotificationReadAction
{
    /**
     * Mark a single notification as read.
     *
     * Only the owning user may mark a notification as read.
     * An unrelated user receives a 404 (not 403) to prevent notification ID enumeration.
     * Marking an already-read notification is idempotent — no-op if read_at is already set.
     */
    public function execute(User $user, int $notificationId): Notification
    {
        $notification = Notification::where('id', $notificationId)
            ->where('user_id', $user->id)
            ->first();

        if (! $notification) {
            abort(Response::HTTP_NOT_FOUND, 'Notification not found.');
        }

        // Idempotent: only update if not already read.
        if (is_null($notification->read_at)) {
            $notification->update(['read_at' => now()]);
            $notification->refresh();
        }

        return $notification;
    }
}
