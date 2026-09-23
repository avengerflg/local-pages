<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Chat\GetConversationMessagesAction;
use App\Actions\Chat\GetConversationsAction;
use App\Actions\Chat\GetOrCreateConversationAction;
use App\Actions\Chat\SendMessageAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\CreateConversationRequest;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Http\Resources\ConversationDetailResource;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConversationController extends Controller
{
    /**
     * List all conversations for the authenticated user (customer or tradie).
     */
    public function index(Request $request, GetConversationsAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $conversations = $action->execute($request->user(), $perPage);

        return ConversationResource::collection($conversations)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Start or retrieve an existing conversation for a service request.
     */
    public function store(CreateConversationRequest $request, GetOrCreateConversationAction $action): JsonResponse
    {
        $requestId = $request->integer('request_id');
        $tradieId = $request->has('tradie_id') ? $request->integer('tradie_id') : null;

        $conversation = $action->execute($request->user(), $requestId, $tradieId);

        return (new ConversationDetailResource($conversation))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Show detail of an individual conversation.
     */
    public function show(Request $request, int $id, GetConversationMessagesAction $action): JsonResponse
    {
        $conversation = $action->getConversation($request->user(), $id);

        return (new ConversationDetailResource($conversation))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Retrieve paginated messages for a conversation.
     */
    public function messages(Request $request, int $id, GetConversationMessagesAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 25);
        $messages = $action->getMessages($request->user(), $id, $perPage);

        return MessageResource::collection($messages)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Send a message within a conversation.
     */
    public function sendMessage(SendMessageRequest $request, int $id, SendMessageAction $action): JsonResponse
    {
        $files = $request->file('attachments', []);
        $attachments = is_array($files) ? $files : ($files ? [$files] : []);

        $message = $action->execute(
            $request->user(),
            $id,
            $request->input('body'),
            $attachments
        );

        return (new MessageResource($message))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
