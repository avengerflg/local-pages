<?php

namespace App\Http\Controllers\Api\V1\Tradie;

use App\Actions\Tradie\AttachTradieServiceAreaAction;
use App\Actions\Tradie\DetachTradieServiceAreaAction;
use App\Actions\Tradie\GetTradieServiceAreasAction;
use App\Actions\Tradie\SyncTradieServiceAreasAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tradie\AttachTradieServiceAreaRequest;
use App\Http\Requests\Tradie\SyncTradieServiceAreasRequest;
use App\Http\Resources\LocationResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TradieServiceAreaController extends Controller
{
    /**
     * List all service area locations covered by the authenticated tradie.
     */
    public function index(Request $request, GetTradieServiceAreasAction $action): AnonymousResourceCollection
    {
        $locations = $action->execute($request->user());

        return LocationResource::collection($locations);
    }

    /**
     * Attach a single active location to the tradie's service area coverage.
     */
    public function store(AttachTradieServiceAreaRequest $request, AttachTradieServiceAreaAction $action): AnonymousResourceCollection
    {
        $locations = $action->execute($request->user(), (int) $request->validated('location_id'));

        return LocationResource::collection($locations);
    }

    /**
     * Synchronize all service area locations covered by the tradie profile.
     */
    public function update(SyncTradieServiceAreasRequest $request, SyncTradieServiceAreasAction $action): AnonymousResourceCollection
    {
        $locations = $action->execute($request->user(), $request->validated('location_ids'));

        return LocationResource::collection($locations);
    }

    /**
     * Detach a location from the tradie's service area coverage.
     */
    public function destroy(Request $request, int $id, DetachTradieServiceAreaAction $action): AnonymousResourceCollection
    {
        $locations = $action->execute($request->user(), $id);

        return LocationResource::collection($locations);
    }
}
