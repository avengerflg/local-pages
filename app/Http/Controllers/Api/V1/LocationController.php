<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of active locations.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Location::where('status', 'active');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "{$search}%")
                    ->orWhere('postcode', $search);
            });
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $perPage = min($request->integer('per_page', 15), 100);
        $locations = $query->with('parent')->paginate($perPage);

        return LocationResource::collection($locations)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
