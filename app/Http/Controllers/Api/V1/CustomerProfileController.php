<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Customer\UpdateCustomerProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateCustomerProfileRequest;
use App\Http\Resources\CustomerProfileResource;
use App\Models\CustomerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerProfileController extends Controller
{
    /**
     * Display the authenticated customer's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $profile = CustomerProfile::firstOrCreate(['user_id' => $request->user()->id]);

        return (new CustomerProfileResource($profile))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update the authenticated customer's profile.
     */
    public function update(UpdateCustomerProfileRequest $request, UpdateCustomerProfileAction $action): JsonResponse
    {
        $profile = $action->execute($request->user(), $request->validated());

        return (new CustomerProfileResource($profile))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
