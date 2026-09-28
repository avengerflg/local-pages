<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Review\AdminGetPendingReviewReportsAction;
use App\Actions\Review\AdminResolveReviewReportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\ResolveReviewReportRequest;
use App\Http\Resources\Admin\AdminReviewReportResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReviewReportController extends Controller
{
    /**
     * List review reports for admin moderation.
     */
    public function index(Request $request, AdminGetPendingReviewReportsAction $action): JsonResponse
    {
        $reports = $action->execute($request->all());

        return AdminReviewReportResource::collection($reports)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Resolve a review report.
     */
    public function resolve(ResolveReviewReportRequest $request, AdminResolveReviewReportAction $action, int $id): JsonResponse
    {
        $report = $action->execute($request->user(), $id, $request->validated());

        return (new AdminReviewReportResource($report))
            ->response()
            ->setStatusCode(200);
    }
}
