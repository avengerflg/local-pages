<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Admin\Location\CreateLocationAction;
use App\Actions\Admin\Location\GetAdminLocationsAction;
use App\Actions\Admin\Location\UpdateLocationAction;
use App\Actions\Admin\Location\UpdateLocationStatusAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLocationRequest;
use App\Http\Requests\Admin\UpdateLocationRequest;
use App\Http\Resources\Admin\AdminLocationResource;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminLocationController extends Controller
{
    /**
     * List locations with hierarchy, type, and search filters.
     *
     * GET /api/v1/admin/locations
     */
    public function index(Request $request, GetAdminLocationsAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['type', 'parent_id', 'status', 'search']);

        $locations = $action->execute($filters, $perPage);

        return AdminLocationResource::collection($locations)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Create a new location adhering to strict geographic hierarchy rules.
     *
     * POST /api/v1/admin/locations
     */
    public function store(StoreLocationRequest $request, CreateLocationAction $action): JsonResponse
    {
        $location = $action->execute($request->user(), $request->validated());

        return (new AdminLocationResource($location))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show single location details.
     *
     * GET /api/v1/admin/locations/{id}
     */
    public function show(int $id): JsonResponse
    {
        $location = Location::with('parent')->withCount('children')->find($id);

        if (! $location) {
            abort(Response::HTTP_NOT_FOUND, 'Location not found.');
        }

        return (new AdminLocationResource($location))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update location details.
     *
     * PATCH /api/v1/admin/locations/{id}
     */
    public function update(UpdateLocationRequest $request, int $id, UpdateLocationAction $action): JsonResponse
    {
        $location = $action->execute($request->user(), $id, $request->validated());

        return (new AdminLocationResource($location))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update location active/inactive status.
     *
     * PATCH /api/v1/admin/locations/{id}/status
     */
    public function updateStatus(Request $request, int $id, UpdateLocationStatusAction $action): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $location = $action->execute($request->user(), $id, $request->only('status'));

        return (new AdminLocationResource($location))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
