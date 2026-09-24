<?php

namespace App\Http\Controllers\Api\V1\Tradie;

use App\Actions\Tradie\GetTradieProfileAction;
use App\Actions\Tradie\UpdateTradieProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tradie\UpdateTradieProfileRequest;
use App\Http\Resources\TradieProfileResource;
use Illuminate\Http\Request;

class TradieProfileController extends Controller
{
    /**
     * Display the authenticated tradie's profile.
     */
    public function show(Request $request, GetTradieProfileAction $action): TradieProfileResource
    {
        $profile = $action->execute($request->user());

        return new TradieProfileResource($profile);
    }

    /**
     * Update the authenticated tradie's profile information.
     */
    public function update(UpdateTradieProfileRequest $request, UpdateTradieProfileAction $action): TradieProfileResource
    {
        $profile = $action->execute($request->user(), $request->validated());

        return new TradieProfileResource($profile);
    }
}
