<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationInboxTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Authentication & Authorization Tests
    // -------------------------------------------------------------------------

    public function test_unauthenticated_user_cannot_access_notification_endpoints(): void
    {
        $this->getJson('/api/v1/notifications')->assertUnauthorized();
        $this->getJson('/api/v1/notifications/unread-count')->assertUnauthorized();
        $this->postJson('/api/v1/notifications/read-all')->assertUnauthorized();
        $this->getJson('/api/v1/notifications/1')->assertUnauthorized();
        $this->postJson('/api/v1/notifications/1/read')->assertUnauthorized();
    }

    // -------------------------------------------------------------------------
    // Index & Isolation Tests
    // -------------------------------------------------------------------------

    public function test_user_can_list_their_notifications_ordered_newest_first(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $otherUser = User::factory()->create(['role' => 'tradie']);

        $n1 = Notification::factory()->create([
            'user_id' => $user->id,
            'title' => 'First Notification',
            'created_at' => now()->subMinutes(10),
        ]);
        $n2 = Notification::factory()->create([
            'user_id' => $user->id,
            'title' => 'Second Notification',
            'created_at' => now()->subMinutes(5),
        ]);
        $n3 = Notification::factory()->create([
            'user_id' => $user->id,
            'title' => 'Third Notification',
            'created_at' => now(),
        ]);

        // Other user's notification
        $nOther = Notification::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Notification',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notifications')
            ->assertOk();

        $data = $response->json('data');
        $this->assertCount(3, $data);
        $this->assertEquals($n3->id, $data[0]['id']);
        $this->assertEquals($n2->id, $data[1]['id']);
        $this->assertEquals($n1->id, $data[2]['id']);

        // Assert fields in response
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'type',
                    'title',
                    'body',
                    'data',
                    'is_read',
                    'read_at',
                    'created_at',
                ],
            ],
            'links',
            'meta',
        ]);
    }

    public function test_client_cannot_spoof_user_id_in_notification_query(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $otherUser = User::factory()->create(['role' => 'tradie']);

        Notification::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Other User Notification',
        ]);

        // User attempts to supply other user's ID via query param
        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/v1/notifications?user_id={$otherUser->id}")
            ->assertOk();

        // Must still return 0 results because server-side scoping uses $request->user()->id
        $this->assertCount(0, $response->json('data'));
    }

    // -------------------------------------------------------------------------
    // Unread Count Tests
    // -------------------------------------------------------------------------

    public function test_user_can_get_unread_notification_count(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        Notification::factory()->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);
        Notification::factory()->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);
        Notification::factory()->create([
            'user_id' => $user->id,
            'read_at' => now(),
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertOk()
            ->assertJson([
                'data' => [
                    'unread_count' => 2,
                ],
            ]);
    }

    // -------------------------------------------------------------------------
    // Show Single Notification Tests
    // -------------------------------------------------------------------------

    public function test_user_can_view_single_notification(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'type' => 'new_quote',
            'title' => 'New Quote Received',
            'body' => 'A tradie submitted a quote for your service request.',
            'data' => ['quote_id' => 123, 'price' => 250],
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/v1/notifications/{$notification->id}")
            ->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $notification->id,
                    'type' => 'new_quote',
                    'title' => 'New Quote Received',
                    'body' => 'A tradie submitted a quote for your service request.',
                    'data' => [
                        'quote_id' => 123,
                        'price' => 250,
                    ],
                    'is_read' => false,
                ],
            ]);
    }

    public function test_user_cannot_view_other_users_notification(): void
    {
        $user1 = User::factory()->create(['role' => 'customer']);
        $user2 = User::factory()->create(['role' => 'tradie']);

        $notification = Notification::factory()->create([
            'user_id' => $user2->id,
        ]);

        $this->actingAs($user1, 'sanctum')
            ->getJson("/api/v1/notifications/{$notification->id}")
            ->assertNotFound();
    }

    // -------------------------------------------------------------------------
    // Mark Single Notification Read Tests
    // -------------------------------------------------------------------------

    public function test_user_can_mark_single_notification_as_read(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read")
            ->assertOk();

        $this->assertTrue($response->json('data.is_read'));
        $this->assertNotNull($response->json('data.read_at'));
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_marking_read_is_idempotent(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $originalReadAt = now()->subHours(2);
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'read_at' => $originalReadAt,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read")
            ->assertOk();

        // read_at should remain the original timestamp, not be overwritten with current time
        $this->assertEquals(
            $originalReadAt->toIso8601String(),
            $notification->fresh()->read_at->toIso8601String()
        );
    }

    public function test_user_cannot_mark_other_users_notification_as_read(): void
    {
        $user1 = User::factory()->create(['role' => 'customer']);
        $user2 = User::factory()->create(['role' => 'tradie']);

        $notification = Notification::factory()->create([
            'user_id' => $user2->id,
            'read_at' => null,
        ]);

        $this->actingAs($user1, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read")
            ->assertNotFound();

        $this->assertNull($notification->fresh()->read_at);
    }

    // -------------------------------------------------------------------------
    // Mark All Read Tests
    // -------------------------------------------------------------------------

    public function test_user_can_mark_all_notifications_as_read(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $otherUser = User::factory()->create(['role' => 'tradie']);

        Notification::factory()->count(3)->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);
        Notification::factory()->create([
            'user_id' => $user->id,
            'read_at' => now()->subDay(),
        ]);

        // Other user's unread notification
        $otherNotification = Notification::factory()->create([
            'user_id' => $otherUser->id,
            'read_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notifications/read-all')
            ->assertOk()
            ->assertJson([
                'data' => [
                    'updated' => 3,
                ],
                'message' => 'All notifications marked as read.',
            ]);

        $this->assertEquals(0, Notification::where('user_id', $user->id)->whereNull('read_at')->count());
        $this->assertNull($otherNotification->fresh()->read_at);
    }
}
