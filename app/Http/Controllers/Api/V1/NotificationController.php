<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Notification\GetNotificationsAction;
use App\Actions\Notification\MarkAllNotificationsReadAction;
use App\Actions\Notification\MarkNotificationReadAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{
    /**
     * List the authenticated user's notifications, newest first.
     *
     * GET /api/v1/notifications
     */
    public function index(Request $request, GetNotificationsAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $notifications = $action->execute($request->user(), $perPage);

        return NotificationResource::collection($notifications)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Show a single notification (owner only).
     *
     * GET /api/v1/notifications/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $notification) {
            abort(Response::HTTP_NOT_FOUND, 'Notification not found.');
        }

        return response()->json([
            'data' => new NotificationResource($notification),
        ], Response::HTTP_OK);
    }

    /**
     * Return the authenticated user's unread notification count.
     *
     * GET /api/v1/notifications/unread-count
     */
    public function unreadCount(Request $request, GetNotificationsAction $action): JsonResponse
    {
        return response()->json([
            'data' => [
                'unread_count' => $action->unreadCount($request->user()),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Mark a single notification as read (owner only).
     *
     * POST /api/v1/notifications/{id}/read
     */
    public function markRead(Request $request, int $id, MarkNotificationReadAction $action): JsonResponse
    {
        $notification = $action->execute($request->user(), $id);

        return response()->json([
            'data' => new NotificationResource($notification),
        ], Response::HTTP_OK);
    }

    /**
     * Mark all authenticated user's unread notifications as read.
     *
     * POST /api/v1/notifications/read-all
     */
    public function markAllRead(Request $request, MarkAllNotificationsReadAction $action): JsonResponse
    {
        $updated = $action->execute($request->user());

        return response()->json([
            'data' => [
                'updated' => $updated,
            ],
            'message' => 'All notifications marked as read.',
        ], Response::HTTP_OK);
    }
}
