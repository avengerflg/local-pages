<?php

namespace App\Actions\Admin\User;

use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class GetAdminUserDetailAction
{
    /**
     * Retrieve single user details by ID for administrative inspection.
     */
    public function execute(int $userId): User
    {
        $user = User::with(['customerProfile', 'tradieProfile'])->find($userId);

        if (! $user) {
            abort(Response::HTTP_NOT_FOUND, 'User not found.');
        }

        return $user;
    }
}
