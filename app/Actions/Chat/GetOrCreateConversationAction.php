<?php

namespace App\Actions\Chat;

use App\Models\Conversation;
use App\Models\RequestTradie;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class GetOrCreateConversationAction
{
    /**
     * Get or create a conversation for a service request and tradie.
     */
    public function execute(User $user, int $requestId, ?int $tradieId = null): Conversation
    {
        if ($user->role === 'customer') {
            $serviceRequest = ServiceRequest::where('id', $requestId)
                ->where('customer_id', $user->id)
                ->first();

            if (! $serviceRequest) {
                abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
            }

            if (! $tradieId) {
                throw ValidationException::withMessages([
                    'tradie_id' => ['Tradie ID is required to start a conversation.'],
                ]);
            }

            $isTradieSelected = RequestTradie::where('request_id', $requestId)
                ->where('tradie_id', $tradieId)
                ->exists();

            if (! $isTradieSelected) {
                throw ValidationException::withMessages([
                    'tradie_id' => ['The selected tradie is not assigned to this service request.'],
                ]);
            }

            $conversation = Conversation::firstOrCreate(
                [
                    'request_id' => $requestId,
                    'tradie_id' => $tradieId,
                ],
                [
                    'customer_id' => $user->id,
                    'status' => 'active',
                ]
            );
        } elseif ($user->role === 'tradie') {
            $tradieProfile = $user->tradieProfile;

            if (! $tradieProfile) {
                abort(Response::HTTP_NOT_FOUND, 'Tradie profile not found.');
            }

            $isTradieSelected = RequestTradie::where('request_id', $requestId)
                ->where('tradie_id', $tradieProfile->id)
                ->exists();

            if (! $isTradieSelected) {
                abort(Response::HTTP_NOT_FOUND, 'Lead not found for this tradie.');
            }

            $serviceRequest = ServiceRequest::find($requestId);

            if (! $serviceRequest) {
                abort(Response::HTTP_NOT_FOUND, 'Service request not found.');
            }

            $conversation = Conversation::firstOrCreate(
                [
                    'request_id' => $requestId,
                    'tradie_id' => $tradieProfile->id,
                ],
                [
                    'customer_id' => $serviceRequest->customer_id,
                    'status' => 'active',
                ]
            );
        } else {
            abort(Response::HTTP_FORBIDDEN, 'Unauthorized to create conversations.');
        }

        return $conversation->loadMissing([
            'serviceRequest.service',
            'customer',
            'tradieProfile',
        ]);
    }
}
