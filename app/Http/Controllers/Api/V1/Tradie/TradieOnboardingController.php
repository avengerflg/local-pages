<?php

namespace App\Http\Controllers\Api\V1\Tradie;

use App\Actions\Tradie\GetTradieOnboardingStatusAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\Tradie\TradieOnboardingStatusResource;
use Illuminate\Http\Request;

class TradieOnboardingController extends Controller
{
    /**
     * Display a component-level onboarding checklist and summary counts.
     */
    public function status(Request $request, GetTradieOnboardingStatusAction $action): TradieOnboardingStatusResource
    {
        $status = $action->execute($request->user());

        return new TradieOnboardingStatusResource($status);
    }
}
