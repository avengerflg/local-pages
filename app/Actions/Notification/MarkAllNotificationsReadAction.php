<?php

namespace App\Actions\Notification;

use App\Models\Notification;
use App\Models\User;

class MarkAllNotificationsReadAction
{
    /**
     * Mark all unread notifications for the authenticated user as read.
     *
     * Only notifications belonging to auth()->user() are affected.
     * user_id is never accepted from the client.
     * Already-read notifications are unaffected (whereNull guard).
     *
     * @return int The number of notifications updated.
     */
    public function execute(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
