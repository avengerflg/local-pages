<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Review\AdminApproveReviewAction;
use App\Actions\Review\AdminGetPendingReviewsAction;
use App\Actions\Review\AdminRejectReviewAction;
use App\Actions\Review\CreateReviewAction;
use App\Actions\Review\GetTradieReviewsAction;
use App\Actions\Review\RespondToReviewAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\StoreReviewResponseRequest;
use App\Http\Resources\AdminReviewResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\ReviewResponseResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReviewController extends Controller
{
    /**
     * Submit a review for a completed job (customer only).
     *
     * POST /api/v1/jobs/{id}/reviews
     */
    public function store(StoreReviewRequest $request, int $id, CreateReviewAction $action): JsonResponse
    {
        $review = $action->execute($request->user(), $id, $request->validated());

        return (new ReviewResource($review))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * List approved reviews for a tradie profile (public, no auth required).
     *
     * GET /api/v1/tradies/{id}/reviews
     */
    public function tradieReviews(Request $request, int $id, GetTradieReviewsAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $reviews = $action->execute($id, $perPage);

        return ReviewResource::collection($reviews)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Submit a response to a review (tradie only).
     *
     * POST /api/v1/reviews/{id}/response
     */
    public function respond(StoreReviewResponseRequest $request, int $id, RespondToReviewAction $action): JsonResponse
    {
        $response = $action->execute($request->user(), $id, $request->validated());

        return (new ReviewResponseResource($response))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * List all pending reviews for admin moderation (admin only).
     *
     * GET /api/v1/admin/reviews
     */
    public function adminIndex(Request $request, AdminGetPendingReviewsAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 20);
        $reviews = $action->execute($perPage);

        return AdminReviewResource::collection($reviews)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Approve a pending review (admin only).
     *
     * POST /api/v1/admin/reviews/{id}/approve
     */
    public function adminApprove(Request $request, int $id, AdminApproveReviewAction $action): JsonResponse
    {
        $review = $action->execute($id);

        return (new AdminReviewResource($review))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Reject/remove a review (admin only).
     *
     * POST /api/v1/admin/reviews/{id}/reject
     */
    public function adminReject(Request $request, int $id, AdminRejectReviewAction $action): JsonResponse
    {
        $review = $action->execute($id);

        return (new AdminReviewResource($review))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
