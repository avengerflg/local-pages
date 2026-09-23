<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\ServiceRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (v1)
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api/v1" URL prefix and "api" middleware group.
|
*/

Route::get('/health', HealthCheckController::class);

// Service catalog discovery
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);

// Authentication routes
Route::prefix('auth')->group(function () {
    // Public routes with rate limiting
    Route::post('/register/customer', [AuthController::class, 'registerCustomer'])->middleware('throttle:10,1');
    Route::post('/register/tradie', [AuthController::class, 'registerTradie'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->middleware('throttle:5,1')->name('password.reset');

    // Email verification verify route
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('throttle:6,1')
        ->name('verification.verify');

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
            ->middleware('throttle:6,1');
    });
});

// Customer Service Requests
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('/service-requests', [ServiceRequestController::class, 'index']);
    Route::post('/service-requests', [ServiceRequestController::class, 'store']);
    Route::get('/service-requests/{id}', [ServiceRequestController::class, 'show']);
});
