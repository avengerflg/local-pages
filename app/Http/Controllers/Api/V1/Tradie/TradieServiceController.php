<?php

namespace App\Http\Controllers\Api\V1\Tradie;

use App\Actions\Tradie\AttachTradieServiceAction;
use App\Actions\Tradie\DetachTradieServiceAction;
use App\Actions\Tradie\GetTradieServicesAction;
use App\Actions\Tradie\SyncTradieServicesAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tradie\AttachTradieServiceRequest;
use App\Http\Requests\Tradie\SyncTradieServicesRequest;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TradieServiceController extends Controller
{
    /**
     * List all services currently offered by the authenticated tradie.
     */
    public function index(Request $request, GetTradieServicesAction $action): AnonymousResourceCollection
    {
        $services = $action->execute($request->user());

        return ServiceResource::collection($services);
    }

    /**
     * Attach a single active service to the tradie profile.
     */
    public function store(AttachTradieServiceRequest $request, AttachTradieServiceAction $action): AnonymousResourceCollection
    {
        $services = $action->execute($request->user(), (int) $request->validated('service_id'));

        return ServiceResource::collection($services);
    }

    /**
     * Synchronize all active services offered by the tradie profile.
     */
    public function update(SyncTradieServicesRequest $request, SyncTradieServicesAction $action): AnonymousResourceCollection
    {
        $services = $action->execute($request->user(), $request->validated('service_ids'));

        return ServiceResource::collection($services);
    }

    /**
     * Detach a service from the tradie profile.
     */
    public function destroy(Request $request, int $id, DetachTradieServiceAction $action): AnonymousResourceCollection
    {
        $services = $action->execute($request->user(), $id);

        return ServiceResource::collection($services);
    }
}
