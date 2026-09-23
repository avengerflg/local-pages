<?php

use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AdminLocationController;
use App\Http\Controllers\Api\V1\Admin\AdminQuestionController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceController;
use App\Http\Controllers\Api\V1\Admin\AdminTradieController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\HealthCheckController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\Api\V1\MatchingController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\QuoteController;
use App\Http\Controllers\Api\V1\ReviewController;
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

// Service catalog discovery (Public)
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

// Customer Service Requests, Matching, Quotes, Appointments & Reviews
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

    // Phase 11: Customer review submission for completed jobs.
    Route::post('/jobs/{id}/reviews', [ReviewController::class, 'store']);
});

// Tradie Lead Management, Quotations, Job Execution & Review Response
Route::middleware(['auth:sanctum', 'role:tradie'])->group(function () {
    Route::prefix('tradie')->group(function () {
        Route::get('/leads', [TradieLeadController::class, 'index']);
        Route::get('/leads/{id}', [TradieLeadController::class, 'show']);
    });

    Route::post('/service-requests/{id}/quotes', [QuoteController::class, 'store']);

    Route::post('/jobs/{id}/start', [JobController::class, 'start']);
    Route::post('/jobs/{id}/complete', [JobController::class, 'complete']);

    // Phase 11: Tradie response to a review belonging to that tradie.
    Route::post('/reviews/{id}/response', [ReviewController::class, 'respond']);
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

// Phase 11: Public tradie review listing (no authentication required).
Route::get('/tradies/{id}/reviews', [ReviewController::class, 'tradieReviews']);

// Phase 11 & Phase 13: Admin Management & Platform Operations
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Platform operational metrics
    Route::get('/dashboard', AdminDashboardController::class);

    // User management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::patch('/users/{id}/status', [AdminUserController::class, 'updateStatus']);

    // Tradie management & document review
    Route::get('/tradies', [AdminTradieController::class, 'index']);
    Route::get('/tradies/{id}', [AdminTradieController::class, 'show']);
    Route::patch('/tradies/{id}/verification', [AdminTradieController::class, 'updateVerification']);
    Route::get('/tradies/{id}/documents', [AdminTradieController::class, 'documents']);
    Route::patch('/tradie-documents/{id}/status', [AdminTradieController::class, 'updateDocumentStatus']);

    // Service catalog management
    Route::get('/services', [AdminServiceController::class, 'index']);
    Route::post('/services', [AdminServiceController::class, 'store']);
    Route::get('/services/{id}', [AdminServiceController::class, 'show']);
    Route::patch('/services/{id}', [AdminServiceController::class, 'update']);
    Route::patch('/services/{id}/status', [AdminServiceController::class, 'updateStatus']);

    // Service questions & choice options
    Route::get('/services/{id}/questions', [AdminQuestionController::class, 'index']);
    Route::post('/services/{id}/questions', [AdminQuestionController::class, 'store']);
    Route::get('/service-questions/{id}', [AdminQuestionController::class, 'show']);
    Route::patch('/service-questions/{id}', [AdminQuestionController::class, 'update']);
    Route::post('/service-questions/{id}/options', [AdminQuestionController::class, 'storeOption']);
    Route::patch('/service-question-options/{id}', [AdminQuestionController::class, 'updateOption']);

    // Geographic hierarchy management
    Route::get('/locations', [AdminLocationController::class, 'index']);
    Route::post('/locations', [AdminLocationController::class, 'store']);
    Route::get('/locations/{id}', [AdminLocationController::class, 'show']);
    Route::patch('/locations/{id}', [AdminLocationController::class, 'update']);
    Route::patch('/locations/{id}/status', [AdminLocationController::class, 'updateStatus']);

    // Review moderation (Phase 11)
    Route::get('/reviews', [ReviewController::class, 'adminIndex']);
    Route::post('/reviews/{id}/approve', [ReviewController::class, 'adminApprove']);
    Route::post('/reviews/{id}/reject', [ReviewController::class, 'adminReject']);
});

// Phase 12: In-app notification inbox (authenticated, any role).
// Note: the unread-count and read-all routes must be registered BEFORE {id} routes
// to avoid Laravel matching 'unread-count' or 'read-all' as an {id} parameter.
Route::middleware('auth:sanctum')->prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/read-all', [NotificationController::class, 'markAllRead']);
    Route::get('/{id}', [NotificationController::class, 'show']);
    Route::post('/{id}/read', [NotificationController::class, 'markRead']);
});
