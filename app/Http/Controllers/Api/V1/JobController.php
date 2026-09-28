<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Job\CompleteJobAction;
use App\Actions\Job\GetJobDetailAction;
use App\Actions\Job\GetJobsAction;
use App\Actions\Job\StartJobAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JobController extends Controller
{
    /**
     * Display a listing of jobs for the authenticated user.
     */
    public function index(Request $request, GetJobsAction $action): JsonResponse
    {
        $jobs = $action->execute($request->user(), $request->integer('per_page', 15));

        return JobResource::collection($jobs)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Show details of a specific job.
     */
    public function show(Request $request, int $id, GetJobDetailAction $action): JsonResponse
    {
        $job = $action->execute($request->user(), $id);

        return (new JobResource($job))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Mark a scheduled job as started / in progress (tradie only).
     */
    public function start(Request $request, int $id, StartJobAction $action): JsonResponse
    {
        $job = $action->execute($request->user(), $id);

        return (new JobResource($job))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Mark an in-progress job as completed (tradie only).
     */
    public function complete(Request $request, int $id, CompleteJobAction $action): JsonResponse
    {
        $job = $action->execute($request->user(), $id);

        return (new JobResource($job))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
