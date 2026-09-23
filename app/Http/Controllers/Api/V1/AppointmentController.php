<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Appointment\CreateAppointmentAction;
use App\Actions\Appointment\GetAppointmentDetailAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\CreateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends Controller
{
    /**
     * Schedule an appointment for a service request with an accepted quote.
     */
    public function store(CreateAppointmentRequest $request, int $id, CreateAppointmentAction $action): JsonResponse
    {
        $appointment = $action->execute(
            $request->user(),
            $id,
            $request->validated()
        );

        return (new AppointmentResource($appointment))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show details of a specific appointment.
     */
    public function show(Request $request, int $id, GetAppointmentDetailAction $action): JsonResponse
    {
        $appointment = $action->execute($request->user(), $id);

        return (new AppointmentResource($appointment))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
