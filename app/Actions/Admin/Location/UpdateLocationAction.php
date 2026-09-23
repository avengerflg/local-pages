<?php

namespace App\Actions\Admin\Location;

use App\Actions\Admin\LogAuditAction;
use App\Models\Location;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class UpdateLocationAction
{
    public function __construct(
        protected LogAuditAction $logAuditAction
    ) {}

    /**
     * Update an existing location with hierarchy validation and audit logging.
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

            $type = $data['type'] ?? $location->type;
            $parentId = array_key_exists('parent_id', $data) ? $data['parent_id'] : $location->parent_id;

            if ($parentId === $location->id) {
                throw ValidationException::withMessages([
                    'parent_id' => ['A location cannot be its own parent.'],
                ]);
            }

            $this->validateHierarchy($type, $parentId);

            $oldValues = $location->only(['type', 'name', 'parent_id', 'code', 'postcode', 'status']);

            $updates = [];
            if (isset($data['type'])) {
                $updates['type'] = $data['type'];
            }
            if (isset($data['name'])) {
                $updates['name'] = $data['name'];
            }
            if (array_key_exists('parent_id', $data)) {
                $updates['parent_id'] = $data['parent_id'];
            }
            if (array_key_exists('code', $data)) {
                $updates['code'] = $data['code'];
            }
            if (array_key_exists('postcode', $data)) {
                $updates['postcode'] = $data['postcode'];
            }
            if (isset($data['status'])) {
                $updates['status'] = $data['status'];
            }

            $location->update($updates);

            $this->logAuditAction->execute(
                actor: $admin,
                action: 'location.updated',
                entityType: 'locations',
                entityId: $location->id,
                oldValues: $oldValues,
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
