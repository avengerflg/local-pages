<?php

namespace App\Http\Controllers\Api\V1\Tradie;

use App\Actions\Tradie\CreateTradieAvailabilityAction;
use App\Actions\Tradie\DeleteTradieAvailabilityAction;
use App\Actions\Tradie\GetTradieAvailabilityAction;
use App\Actions\Tradie\UpdateTradieAvailabilityAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tradie\StoreTradieAvailabilityRequest;
use App\Http\Requests\Tradie\UpdateTradieAvailabilityRequest;
use App\Http\Resources\Tradie\TradieAvailabilityResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class TradieAvailabilityController extends Controller
{
    /**
     * List all availability slots and date overrides for the authenticated tradie.
     */
    public function index(Request $request, GetTradieAvailabilityAction $action): AnonymousResourceCollection
    {
        $slots = $action->execute($request->user());

        return TradieAvailabilityResource::collection($slots);
    }

    /**
     * Create a weekly availability slot or specific date override.
     */
    public function store(StoreTradieAvailabilityRequest $request, CreateTradieAvailabilityAction $action): JsonResponse
    {
        $slot = $action->execute($request->user(), $request->validated());

        return (new TradieAvailabilityResource($slot))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update an existing availability slot or date override.
     */
    public function update(UpdateTradieAvailabilityRequest $request, int $id, UpdateTradieAvailabilityAction $action): TradieAvailabilityResource
    {
        $slot = $action->execute($request->user(), $id, $request->validated());

        return new TradieAvailabilityResource($slot);
    }

    /**
     * Delete an availability slot or date override.
     */
    public function destroy(Request $request, int $id, DeleteTradieAvailabilityAction $action): JsonResponse
    {
        $action->execute($request->user(), $id);

        return response()->json([
            'message' => 'Availability slot deleted successfully.',
        ], Response::HTTP_OK);
    }
}
