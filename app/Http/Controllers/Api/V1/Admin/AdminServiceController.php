<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Admin\Service\CreateServiceAction;
use App\Actions\Admin\Service\GetAdminServicesAction;
use App\Actions\Admin\Service\UpdateServiceAction;
use App\Actions\Admin\Service\UpdateServiceStatusAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\Admin\AdminServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminServiceController extends Controller
{
    /**
     * List services in the marketplace catalog.
     *
     * GET /api/v1/admin/services
     */
    public function index(Request $request, GetAdminServicesAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['status', 'search']);

        $services = $action->execute($filters, $perPage);

        return AdminServiceResource::collection($services)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Create a new service catalog entry.
     *
     * POST /api/v1/admin/services
     */
    public function store(StoreServiceRequest $request, CreateServiceAction $action): JsonResponse
    {
        $service = $action->execute($request->user(), $request->validated());

        return (new AdminServiceResource($service))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show single service details with questions.
     *
     * GET /api/v1/admin/services/{id}
     */
    public function show(int $id): JsonResponse
    {
        $service = Service::with('questions.options')->find($id);

        if (! $service) {
            abort(Response::HTTP_NOT_FOUND, 'Service not found.');
        }

        return (new AdminServiceResource($service))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update service details.
     *
     * PATCH /api/v1/admin/services/{id}
     */
    public function update(UpdateServiceRequest $request, int $id, UpdateServiceAction $action): JsonResponse
    {
        $service = $action->execute($request->user(), $id, $request->validated());

        return (new AdminServiceResource($service))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update service active/inactive status.
     *
     * PATCH /api/v1/admin/services/{id}/status
     */
    public function updateStatus(Request $request, int $id, UpdateServiceStatusAction $action): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $service = $action->execute($request->user(), $id, $request->only('status'));

        return (new AdminServiceResource($service))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
