<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterCustomerRequest;
use App\Http\Requests\Auth\RegisterTradieRequest;
use App\Http\Resources\AuthResponseResource;
use App\Http\Resources\UserResource;
use App\Models\CustomerProfile;
use App\Models\TradieProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Register a new customer account.
     */
    public function registerCustomer(RegisterCustomerRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'mobile' => $validated['mobile'] ?? null,
                'role' => 'customer',
                'status' => 'active',
            ]);

            CustomerProfile::create([
                'user_id' => $user->id,
                'address' => $validated['address'] ?? null,
                'postcode' => $validated['postcode'] ?? null,
            ]);

            return $user;
        });

        event(new Registered($user));

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load('customerProfile');

        return (new AuthResponseResource([
            'token' => $token,
            'user' => $user,
        ]))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Register a new tradie account.
     */
    public function registerTradie(RegisterTradieRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'mobile' => $validated['mobile'] ?? $validated['phone'] ?? null,
                'role' => 'tradie',
                'status' => 'active',
            ]);

            TradieProfile::create([
                'user_id' => $user->id,
                'business_name' => $validated['business_name'],
                'abn' => $validated['abn'] ?? null,
                'phone' => $validated['phone'] ?? $validated['mobile'] ?? null,
                'email' => $validated['email'],
                'website' => $validated['website'] ?? null,
                'address' => $validated['address'] ?? null,
                'suburb' => $validated['suburb'] ?? null,
                'state' => $validated['state'] ?? null,
                'postcode' => $validated['postcode'] ?? null,
                'verification_status' => 'pending',
            ]);

            return $user;
        });

        event(new Registered($user));

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load('tradieProfile');

        return (new AuthResponseResource([
            'token' => $token,
            'user' => $user,
        ]))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Authenticate a user and issue a personal access token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'The provided credentials do not match our records.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is suspended or inactive.',
            ], Response::HTTP_FORBIDDEN);
        }

        $deviceName = $validated['device_name'] ?? 'auth_token';
        $token = $user->createToken($deviceName)->plainTextToken;

        $user->loadMissing(['customerProfile', 'tradieProfile']);

        return (new AuthResponseResource([
            'token' => $token,
            'user' => $user,
        ]))->response()->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Log out the authenticated user (revoke current token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ], Response::HTTP_OK);
    }

    /**
     * Get the authenticated user's profile and details.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->loadMissing(['customerProfile', 'tradieProfile']);

        return (new UserResource($user))->response()->setStatusCode(Response::HTTP_OK);
    }
}
