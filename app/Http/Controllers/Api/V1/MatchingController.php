<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Matching\FindMatchingTradiesAction;
use App\Actions\Matching\SelectMatchingTradiesAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Matching\SelectMatchingTradiesRequest;
use App\Http\Resources\MatchingTradieResource;
use App\Http\Resources\RequestTradieResource;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MatchingController extends Controller
{
    /**
     * Get eligible matching tradies for a customer service request.
     */
    public function matchingTradies(int $id, Request $request, FindMatchingTradiesAction $action): JsonResponse
    {
        $serviceRequest = ServiceRequest::where('id', $id)
            ->where('customer_id', $request->user()->id)
            ->firstOrFail();

        $matchingQuery = $action->execute($serviceRequest);
        $tradies = $matchingQuery->paginate($request->integer('per_page', 15));

        return MatchingTradieResource::collection($tradies)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Select one or multiple matching tradies for a service request.
     */
    public function selectTradies(int $id, SelectMatchingTradiesRequest $request, SelectMatchingTradiesAction $action): JsonResponse
    {
        $serviceRequest = ServiceRequest::where('id', $id)
            ->where('customer_id', $request->user()->id)
            ->firstOrFail();

        $selections = $action->execute(
            $request->user(),
            $serviceRequest,
            $request->validated('tradie_ids')
        );

        return RequestTradieResource::collection($selections)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
