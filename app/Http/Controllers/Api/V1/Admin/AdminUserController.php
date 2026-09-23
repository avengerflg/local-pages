<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Admin\User\GetAdminUserDetailAction;
use App\Actions\Admin\User\GetAdminUsersAction;
use App\Actions\Admin\User\UpdateUserStatusAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Resources\Admin\AdminUserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminUserController extends Controller
{
    /**
     * List platform users with filtering and pagination.
     *
     * GET /api/v1/admin/users
     */
    public function index(Request $request, GetAdminUsersAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['role', 'status', 'search']);

        $users = $action->execute($filters, $perPage);

        return AdminUserResource::collection($users)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Show detailed user profile.
     *
     * GET /api/v1/admin/users/{id}
     */
    public function show(int $id, GetAdminUserDetailAction $action): JsonResponse
    {
        $user = $action->execute($id);

        return (new AdminUserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update user account status (active, suspended, pending).
     *
     * PATCH /api/v1/admin/users/{id}/status
     */
    public function updateStatus(UpdateUserStatusRequest $request, int $id, UpdateUserStatusAction $action): JsonResponse
    {
        $user = $action->execute($request->user(), $id, $request->validated());

        return (new AdminUserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
