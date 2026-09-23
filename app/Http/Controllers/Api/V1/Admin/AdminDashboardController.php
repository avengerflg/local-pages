<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Admin\Dashboard\GetAdminDashboardAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminDashboardResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AdminDashboardController extends Controller
{
    /**
     * Retrieve aggregated platform metrics for the admin dashboard.
     *
     * GET /api/v1/admin/dashboard
     */
    public function __invoke(GetAdminDashboardAction $action): JsonResponse
    {
        $stats = $action->execute();

        return (new AdminDashboardResource($stats))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
