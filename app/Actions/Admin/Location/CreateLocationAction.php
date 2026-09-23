<?php

namespace App\Actions\Admin\Location;

use App\Actions\Admin\LogAuditAction;
use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateLocationAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Create a new geographic location adhering strictly to hierarchy rules, with audit logging.
     *
     * Hierarchy: State (null parent) → Council (state parent) → Suburb (council parent) → Postcode (suburb parent)
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, array $data): Location
    {
        return DB::transaction(function () use ($admin, $data) {
            $type = $data['type'];
            $parentId = $data['parent_id'] ?? null;

            $this->validateHierarchy($type, $parentId);

            $location = Location::create([
                'type' => $type,
                'name' => $data['name'],
                'parent_id' => $parentId,
                'code' => $data['code'] ?? null,
                'postcode' => $data['postcode'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'location.created',
                entityType: 'locations',
                entityId: $location->id,
                oldValues: null,
                newValues: $location->only(['type', 'name', 'parent_id', 'code', 'postcode', 'status'])
            );

            return $location->loadMissing('parent');
        });
    }

    /**
     * Validate the strict parent-child geographic hierarchy.
     */
    protected function validateHierarchy(string $type, ?int $parentId): void
    {
        if ($type === 'state') {
            if (! is_null($parentId)) {
                throw ValidationException::withMessages([
                    'parent_id' => ['A state cannot have a parent location.'],
                ]);
            }

            return;
        }

        if (is_null($parentId)) {
            throw ValidationException::withMessages([
                'parent_id' => ["A location of type '{$type}' requires a valid parent location."],
            ]);
        }

        $parent = Location::find($parentId);
        if (! $parent) {
            throw ValidationException::withMessages([
                'parent_id' => ['The specified parent location does not exist.'],
            ]);
        }

        $expectedParentType = match ($type) {
            'council' => 'state',
            'suburb' => 'council',
            'postcode' => 'suburb',
            default => null,
        };

        if ($parent->type !== $expectedParentType) {
            throw ValidationException::withMessages([
                'parent_id' => ["A '{$type}' location must have a parent of type '{$expectedParentType}', but parent is '{$parent->type}'."],
            ]);
        }
    }
}
