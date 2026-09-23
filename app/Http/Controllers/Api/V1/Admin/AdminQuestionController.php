<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Actions\Admin\Service\CreateQuestionOptionAction;
use App\Actions\Admin\Service\CreateServiceQuestionAction;
use App\Actions\Admin\Service\GetAdminServiceQuestionsAction;
use App\Actions\Admin\Service\UpdateQuestionOptionAction;
use App\Actions\Admin\Service\UpdateServiceQuestionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreQuestionOptionRequest;
use App\Http\Requests\Admin\StoreServiceQuestionRequest;
use App\Http\Requests\Admin\UpdateQuestionOptionRequest;
use App\Http\Requests\Admin\UpdateServiceQuestionRequest;
use App\Http\Resources\Admin\AdminQuestionOptionResource;
use App\Http\Resources\Admin\AdminServiceQuestionResource;
use App\Models\ServiceQuestion;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AdminQuestionController extends Controller
{
    /**
     * List all questions for a specific service.
     *
     * GET /api/v1/admin/services/{id}/questions
     */
    public function index(int $id, GetAdminServiceQuestionsAction $action): JsonResponse
    {
        $questions = $action->execute($id);

        return AdminServiceQuestionResource::collection($questions)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Create a new intake question for a service.
     *
     * POST /api/v1/admin/services/{id}/questions
     */
    public function store(StoreServiceQuestionRequest $request, int $id, CreateServiceQuestionAction $action): JsonResponse
    {
        $question = $action->execute($request->user(), $id, $request->validated());

        return (new AdminServiceQuestionResource($question))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show a single service question with its options.
     *
     * GET /api/v1/admin/service-questions/{id}
     */
    public function show(int $id): JsonResponse
    {
        $question = ServiceQuestion::with('options')->find($id);

        if (! $question) {
            abort(Response::HTTP_NOT_FOUND, 'Service question not found.');
        }

        return (new AdminServiceQuestionResource($question))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update an intake question.
     *
     * PATCH /api/v1/admin/service-questions/{id}
     */
    public function update(UpdateServiceQuestionRequest $request, int $id, UpdateServiceQuestionAction $action): JsonResponse
    {
        $question = $action->execute($request->user(), $id, $request->validated());

        return (new AdminServiceQuestionResource($question))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Add a choice option to a service question.
     *
     * POST /api/v1/admin/service-questions/{id}/options
     */
    public function storeOption(StoreQuestionOptionRequest $request, int $id, CreateQuestionOptionAction $action): JsonResponse
    {
        $option = $action->execute($request->user(), $id, $request->validated());

        return (new AdminQuestionOptionResource($option))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update a question option.
     *
     * PATCH /api/v1/admin/service-question-options/{id}
     */
    public function updateOption(UpdateQuestionOptionRequest $request, int $id, UpdateQuestionOptionAction $action): JsonResponse
    {
        $option = $action->execute($request->user(), $id, $request->validated());

        return (new AdminQuestionOptionResource($option))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
