<?php

namespace App\Actions\Notification;

use App\Models\Notification;
use App\Models\User;

class CreateNotificationAction
{
    /**
     * Create an in-app notification for a given recipient user.
     *
     * This action is the single trusted creation point for all platform notifications.
     * It must only be called from backend workflows after the primary business operation
     * has succeeded (and within the same transaction where transactional correctness matters).
     *
     * Recipients are always derived server-side; never from client input.
     *
     * @param  User|int  $recipient  The user or user ID who should receive this notification.
     * @param  array<string, mixed>|null  $data  Contextual IDs (e.g. quote_id, job_id).
     *                                           Do NOT include secrets, tokens, or file paths.
     */
    public function execute(
        User|int $recipient,
        string $type,
        string $title,
        string $body,
        ?array $data = null
    ): Notification {
        $userId = $recipient instanceof User ? $recipient->id : (int) $recipient;

        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);
    }
}
