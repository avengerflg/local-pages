<?php

namespace App\Actions\Chat;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class GetConversationMessagesAction
{
    /**
     * Get the conversation instance if the user is an authorized participant.
     */
    public function getConversation(User $user, int $conversationId): Conversation
    {
        $conversation = Conversation::with([
            'serviceRequest.service',
            'customer',
            'tradieProfile',
        ])->find($conversationId);

        if (! $conversation) {
            abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
        }

        $this->authorizeParticipant($user, $conversation);

        return $conversation;
    }

    /**
     * Retrieve paginated messages for an authorized conversation.
     *
     * @return LengthAwarePaginator<Message>
     */
    public function getMessages(User $user, int $conversationId, int $perPage = 25): LengthAwarePaginator
    {
        $conversation = $this->getConversation($user, $conversationId);

        return Message::where('conversation_id', $conversation->id)
            ->with(['sender', 'attachments'])
            ->orderBy('id', 'asc')
            ->paginate($perPage);
    }

    /**
     * Authorize that the user is a legitimate participant in this conversation.
     */
    protected function authorizeParticipant(User $user, Conversation $conversation): void
    {
        if ($user->role === 'customer') {
            if ($conversation->customer_id !== $user->id) {
                abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
            }
        } elseif ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile || $conversation->tradie_id !== $tradieProfile->id) {
                abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
            }
        } else {
            abort(Response::HTTP_NOT_FOUND, 'Conversation not found.');
        }
    }
}
