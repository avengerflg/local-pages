<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Review\SubmitReviewReportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewReportRequest;
use App\Http\Resources\ReviewReportResource;
use Illuminate\Http\JsonResponse;

class ReviewReportController extends Controller
{
    /**
     * Submit a report for a review.
     */
    public function store(StoreReviewReportRequest $request, SubmitReviewReportAction $action, int $id): JsonResponse
    {
        $report = $action->execute($request->user(), $id, $request->validated());

        return (new ReviewReportResource($report))
            ->response()
            ->setStatusCode(201);
    }
}
