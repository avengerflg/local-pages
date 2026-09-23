<?php

namespace App\Actions\Admin;

use App\Models\AuditLog;
use App\Models\User;

class LogAuditAction
{
    /**
     * Record an administrative audit log entry.
     *
     * Captures the acting administrator, action name, target entity, and structured old/new values.
     * Request IP address and user agent are resolved server-side.
     *
     * Sensitive fields (passwords, tokens, file paths, credentials) MUST never be passed in old/new values.
     *
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public function execute(
        User|int $actor,
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): AuditLog {
        $actorId = $actor instanceof User ? $actor->id : (int) $actor;

        return AuditLog::create([
            'actor_id' => $actorId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
