<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends Controller
{
    /**
     * List all active marketplace services.
     */
    public function index(Request $request): JsonResponse
    {
        $services = Service::where('status', 'active')
            ->orderBy('name')
            ->get();

        return ServiceResource::collection($services)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Get details of a single service with its active questions and options.
     */
    public function show(string $service): JsonResponse
    {
        $serviceModel = Service::where('status', 'active')
            ->where(function ($query) use ($service) {
                if (is_numeric($service)) {
                    $query->where('id', (int) $service)->orWhere('slug', $service);
                } else {
                    $query->where('slug', $service);
                }
            })
            ->with([
                'questions' => function ($query) {
                    $query->where('status', 'active')
                        ->orderBy('sort_order')
                        ->with('options');
                },
            ])
            ->firstOrFail();

        return (new ServiceResource($serviceModel))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
