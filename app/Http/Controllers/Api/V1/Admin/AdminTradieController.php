<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Admin\Tradie\GetAdminTradieDetailAction;
use App\Actions\Admin\Tradie\GetAdminTradieDocumentsAction;
use App\Actions\Admin\Tradie\GetAdminTradiesAction;
use App\Actions\Admin\Tradie\UpdateTradieDocumentStatusAction;
use App\Actions\Admin\Tradie\UpdateTradieVerificationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTradieDocumentStatusRequest;
use App\Http\Requests\Admin\UpdateTradieVerificationRequest;
use App\Http\Resources\Admin\AdminTradieDocumentResource;
use App\Http\Resources\Admin\AdminTradieResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminTradieController extends Controller
{
    /**
     * List tradies with verification status, account status, and search filters.
     *
     * GET /api/v1/admin/tradies
     */
    public function index(Request $request, GetAdminTradiesAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $filters = $request->only(['verification_status', 'status', 'search']);

        $tradies = $action->execute($filters, $perPage);

        return AdminTradieResource::collection($tradies)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Show full administrative details of a tradie profile.
     *
     * GET /api/v1/admin/tradies/{id}
     */
    public function show(int $id, GetAdminTradieDetailAction $action): JsonResponse
    {
        $tradie = $action->execute($id);

        return (new AdminTradieResource($tradie))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update tradie verification status (pending, verified, rejected, under_review).
     *
     * PATCH /api/v1/admin/tradies/{id}/verification
     */
    public function updateVerification(UpdateTradieVerificationRequest $request, int $id, UpdateTradieVerificationAction $action): JsonResponse
    {
        $tradie = $action->execute($request->user(), $id, $request->validated());

        return (new AdminTradieResource($tradie))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * List document metadata for a tradie.
     *
     * GET /api/v1/admin/tradies/{id}/documents
     */
    public function documents(int $id, GetAdminTradieDocumentsAction $action): JsonResponse
    {
        $documents = $action->execute($id);

        return AdminTradieDocumentResource::collection($documents)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Review and update document metadata status (pending, approved, rejected).
     *
     * PATCH /api/v1/admin/tradie-documents/{id}/status
     */
    public function updateDocumentStatus(UpdateTradieDocumentStatusRequest $request, int $id, UpdateTradieDocumentStatusAction $action): JsonResponse
    {
        $document = $action->execute($request->user(), $id, $request->validated());

        return (new AdminTradieDocumentResource($document))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
