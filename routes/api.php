<?php

use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\Api\V1\MatchingController;
use App\Http\Controllers\Api\V1\QuoteController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\ServiceRequestController;
use App\Http\Controllers\Api\V1\TradieLeadController;
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

// Customer Service Requests, Matching, Quotes & Appointments
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('/service-requests', [ServiceRequestController::class, 'index']);
    Route::post('/service-requests', [ServiceRequestController::class, 'store']);
    Route::get('/service-requests/{id}', [ServiceRequestController::class, 'show']);

    Route::get('/service-requests/{id}/matching-tradies', [MatchingController::class, 'matchingTradies']);
    Route::post('/service-requests/{id}/matching-tradies', [MatchingController::class, 'selectTradies']);

    Route::get('/service-requests/{id}/quotes', [QuoteController::class, 'index']);
    Route::post('/quotes/{id}/accept', [QuoteController::class, 'accept']);
    Route::post('/quotes/{id}/reject', [QuoteController::class, 'reject']);

    Route::post('/service-requests/{id}/appointments', [AppointmentController::class, 'store']);
});

// Tradie Lead Management, Quotations & Job Execution
Route::middleware(['auth:sanctum', 'role:tradie'])->group(function () {
    Route::prefix('tradie')->group(function () {
        Route::get('/leads', [TradieLeadController::class, 'index']);
        Route::get('/leads/{id}', [TradieLeadController::class, 'show']);
    });

    Route::post('/service-requests/{id}/quotes', [QuoteController::class, 'store']);

    Route::post('/jobs/{id}/start', [JobController::class, 'start']);
    Route::post('/jobs/{id}/complete', [JobController::class, 'complete']);
});

// Platform Conversations, Shared Quotes, Appointments & Jobs
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{id}', [ConversationController::class, 'show']);
    Route::get('/conversations/{id}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage']);

    Route::get('/quotes/{id}', [QuoteController::class, 'show']);

    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
});
