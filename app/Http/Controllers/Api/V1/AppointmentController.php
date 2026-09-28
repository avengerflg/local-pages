<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Appointment\CreateAppointmentAction;
use App\Actions\Appointment\GetAppointmentDetailAction;
use App\Actions\Appointment\GetAppointmentsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\CreateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends Controller
{
    /**
     * Display a listing of appointments for the authenticated user.
     */
    public function index(Request $request, GetAppointmentsAction $action): JsonResponse
    {
        $appointments = $action->execute($request->user(), $request->integer('per_page', 15));

        return AppointmentResource::collection($appointments)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

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
