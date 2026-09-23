<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\TradieLead\GetTradieLeadDetailAction;
use App\Actions\TradieLead\GetTradieLeadsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\TradieLeadDetailResource;
use App\Http\Resources\TradieLeadResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TradieLeadController extends Controller
{
    /**
     * List all leads assigned to the authenticated tradie.
     */
    public function index(Request $request, GetTradieLeadsAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);

        $leads = $action->execute($request->user(), $perPage);

        return TradieLeadResource::collection($leads)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Show full details of an individual lead owned by the authenticated tradie.
     */
    public function show(Request $request, int $id, GetTradieLeadDetailAction $action): JsonResponse
    {
        $lead = $action->execute($request->user(), $id);

        return (new TradieLeadDetailResource($lead))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
