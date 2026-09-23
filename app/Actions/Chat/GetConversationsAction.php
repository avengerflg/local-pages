<?php

namespace App\Actions\Chat;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetConversationsAction
{
    /**
     * Retrieve a paginated list of conversations for the authenticated user.
     *
     * @return LengthAwarePaginator<Conversation>
     */
    public function execute(User $user, int $perPage = 15): LengthAwarePaginator
    {
        $query = Conversation::query();

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile) {
                return Conversation::whereRaw('1 = 0')->paginate($perPage);
            }

            $query->where('tradie_id', $tradieProfile->id);
        } else {
            // Non customer/tradie role (e.g. admin or unassigned)
            return Conversation::whereRaw('1 = 0')->paginate($perPage);
        }

        return $query
            ->with([
                'serviceRequest.service',
                'customer',
                'tradieProfile',
                'messages' => fn ($q) => $q->latest('id')->limit(1),
            ])
            ->orderByRaw('COALESCE(last_message_at, created_at) DESC')
            ->paginate($perPage);
    }
}
