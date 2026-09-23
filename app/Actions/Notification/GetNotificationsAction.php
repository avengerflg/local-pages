<?php

namespace App\Actions\Notification;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetNotificationsAction
{
    /**
     * Retrieve paginated notifications for the authenticated user, newest first.
     * Only notifications belonging to the authenticated user are returned.
     *
     * @return LengthAwarePaginator<Notification>
     */
    public function execute(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Notification::where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Return the count of unread notifications for the authenticated user.
     */
    public function unreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }
}
