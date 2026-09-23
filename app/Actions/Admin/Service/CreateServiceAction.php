<?php

namespace App\Actions\Admin\Service;

use App\Actions\Admin\LogAuditAction;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateServiceAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Create a new service catalog entry with audit logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, array $data): Service
    {
        return DB::transaction(function () use ($admin, $data) {
            $slug = ! empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['name']);

            // Ensure unique slug fallback
            $originalSlug = $slug;
            $count = 1;
            while (Service::where('slug', $slug)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }

            $service = Service::create([
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'service.created',
                entityType: 'services',
                entityId: $service->id,
                oldValues: null,
                newValues: $service->only(['name', 'slug', 'description', 'status'])
            );

            return $service;
        });
    }
}
