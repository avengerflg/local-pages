<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\ServiceRequest\CreateServiceRequestAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest\CreateServiceRequestRequest;
use App\Http\Resources\ServiceRequestResource;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceRequestController extends Controller
{
    /**
     * List all service requests belonging to the authenticated customer.
     */
    public function index(Request $request): JsonResponse
    {
        $serviceRequests = ServiceRequest::where('customer_id', $request->user()->id)
            ->with([
                'service',
                'location',
                'answers.question',
                'answers.selectedOption',
                'attachments',
            ])
            ->latest('id')
            ->paginate($request->integer('per_page', 15));

        return ServiceRequestResource::collection($serviceRequests)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Create a new service request.
     */
    public function store(CreateServiceRequestRequest $request, CreateServiceRequestAction $action): JsonResponse
    {
        $files = $request->file('attachments', []);
        $attachments = is_array($files) ? $files : [$files];

        $serviceRequest = $action->execute(
            $request->user(),
            $request->validated(),
            $attachments
        );

        return (new ServiceRequestResource($serviceRequest))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Get details of a single service request belonging to the authenticated customer.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $serviceRequest = ServiceRequest::where('id', $id)
            ->where('customer_id', $request->user()->id)
            ->with([
                'service',
                'location',
                'answers.question',
                'answers.selectedOption',
                'attachments',
            ])
            ->firstOrFail();

        return (new ServiceRequestResource($serviceRequest))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
