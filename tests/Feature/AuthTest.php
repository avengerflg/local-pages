<?php

namespace Tests\Feature;

use App\Models\CustomerProfile;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_successfully(): void
    {
        $payload = [
            'name' => 'Jane Customer',
            'email' => 'Jane.Customer@EXAMPLE.com',
            'password' => 'SecretPassword123!',
            'password_confirmation' => 'SecretPassword123!',
            'mobile' => '0412345678',
            'address' => '10 Customer Lane',
            'postcode' => '2000',
        ];

        $response = $this->postJson('/api/v1/auth/register/customer', $payload);

        $response->assertCreated()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'token_type',
                    'user' => [
                        'id',
                        'role',
                        'name',
                        'email',
                        'mobile',
                        'status',
                        'customer_profile' => [
                            'id',
                            'user_id',
                            'address',
                            'postcode',
                        ],
                    ],
                ],
            ]);

        $this->assertEquals('customer', $response->json('data.user.role'));
        $this->assertEquals('jane.customer@example.com', $response->json('data.user.email'));
        $this->assertEquals('2000', $response->json('data.user.customer_profile.postcode'));

        $this->assertDatabaseHas('users', [
            'email' => 'jane.customer@example.com',
            'role' => 'customer',
            'status' => 'active',
        ]);

        $this->assertDatabaseHas('customer_profiles', [
            'postcode' => '2000',
            'address' => '10 Customer Lane',
        ]);
    }

    public function test_tradie_can_register_successfully(): void
    {
        $payload = [
            'name' => 'Bob Smith',
            'business_name' => 'Bob Plumbing Pty Ltd',
            'abn' => '12345678901',
            'phone' => '0499888777',
            'email' => 'Bob.Smith@TRADIE.COM',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'address' => '50 Workshop Rd',
            'suburb' => 'Surry Hills',
            'state' => 'NSW',
            'postcode' => '2010',
            'website' => 'https://bobplumbing.example.com',
        ];

        $response = $this->postJson('/api/v1/auth/register/tradie', $payload);

        $response->assertCreated()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'token_type',
                    'user' => [
                        'id',
                        'role',
                        'name',
                        'email',
                        'tradie_profile' => [
                            'id',
                            'business_name',
                            'abn',
                            'phone',
                            'verification_status',
                        ],
                    ],
                ],
            ]);

        $this->assertEquals('tradie', $response->json('data.user.role'));
        $this->assertEquals('bob.smith@tradie.com', $response->json('data.user.email'));
        $this->assertEquals('pending', $response->json('data.user.tradie_profile.verification_status'));
        $this->assertEquals('Bob Plumbing Pty Ltd', $response->json('data.user.tradie_profile.business_name'));

        $this->assertDatabaseHas('users', [
            'email' => 'bob.smith@tradie.com',
            'role' => 'tradie',
        ]);

        $this->assertDatabaseHas('tradie_profiles', [
            'business_name' => 'Bob Plumbing Pty Ltd',
            'verification_status' => 'pending',
        ]);
    }

    public function test_registration_ignores_or_prevents_client_role_tampering(): void
    {
        $customerPayload = [
            'name' => 'Sneaky User',
            'email' => 'sneaky@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'admin',
        ];

        $response = $this->postJson('/api/v1/auth/register/customer', $customerPayload);
        $response->assertCreated();
        $this->assertEquals('customer', $response->json('data.user.role'));

        $this->assertDatabaseHas('users', [
            'email' => 'sneaky@example.com',
            'role' => 'customer',
        ]);
    }

    public function test_registration_validation_fails_for_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $payload = [
            'name' => 'Duplicate User',
            'email' => 'taken@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/v1/auth/register/customer', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_registration_validation_fails_for_mismatched_password(): void
    {
        $payload = [
            'name' => 'Mismatch User',
            'email' => 'mismatch@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Different123!',
        ];

        $response = $this->postJson('/api/v1/auth/register/customer', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'valid@example.com',
            'password' => 'SecretPassword123!',
            'status' => 'active',
        ]);
        CustomerProfile::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'VALID@EXAMPLE.COM',
            'password' => 'SecretPassword123!',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'token_type',
                    'user' => ['id', 'email', 'name', 'role'],
                ],
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'valid@example.com',
            'password' => 'SecretPassword123!',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'valid@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'The provided credentials do not match our records.']);
    }

    public function test_login_fails_if_account_is_suspended(): void
    {
        User::factory()->create([
            'email' => 'suspended@example.com',
            'password' => 'SecretPassword123!',
            'status' => 'suspended',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'suspended@example.com',
            'password' => 'SecretPassword123!',
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Your account is suspended or inactive.']);
    }

    public function test_authenticated_user_can_access_me(): void
    {
        $user = User::factory()->create(['email' => 'me@example.com']);
        $profile = CustomerProfile::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/auth/me');

        $response->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.email', 'me@example.com')
            ->assertJsonPath('data.customer_profile.id', $profile->id);
    }

    public function test_unauthenticated_user_cannot_access_me(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertUnauthorized();
    }

    public function test_unauthenticated_request_without_accept_header_returns_401_json(): void
    {
        $response = $this->get('/api/v1/auth/me');

        $response->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_user_can_logout_and_revoke_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/logout');

        $response->assertOk()
            ->assertJson(['message' => 'Successfully logged out.']);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_email_verification_flow(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );

        $response = $this->getJson($verificationUrl);

        $response->assertOk()
            ->assertJson(['message' => 'Email successfully verified.']);

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_email_verification_fails_with_invalid_signature(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $invalidUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        ).'&tampered=1';

        $response = $this->getJson($invalidUrl);

        $response->assertStatus(403);
    }

    public function test_email_verification_fails_when_signature_is_expired(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $expiredUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->subMinutes(10),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );

        $response = $this->getJson($expiredUrl);

        $response->assertStatus(403);
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_email_verification_fails_with_mismatched_email_hash(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $tamperedHashUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => 'invalid-email-hash',
            ]
        );

        $response = $this->getJson($tamperedHashUrl);

        $response->assertStatus(403);
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_authenticated_user_cannot_verify_another_users_email(): void
    {
        $userA = User::factory()->create(['email_verified_at' => null]);
        $userB = User::factory()->create(['email_verified_at' => null]);

        $verificationUrlB = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $userB->id,
                'hash' => sha1($userB->getEmailForVerification()),
            ]
        );

        // User A attempts to access User B's verification link while authenticated
        $response = $this->actingAs($userA, 'sanctum')
            ->getJson($verificationUrlB);

        $response->assertForbidden()
            ->assertJson(['message' => 'Forbidden. You cannot verify another user account.']);

        $this->assertNull($userB->fresh()->email_verified_at);
    }

    public function test_resend_email_verification_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/email/verification-notification');

        $response->assertOk()
            ->assertJson(['message' => 'Verification link sent.']);

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_password_reset_flow(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'resetme@example.com',
            'password' => 'OldPassword123!',
        ]);

        $forgotResponse = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'resetme@example.com',
        ]);

        $forgotResponse->assertOk();

        Notification::assertSentTo($user, ResetPasswordNotification::class);

        $token = Password::broker()->createToken($user);

        $resetResponse = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'resetme@example.com',
            'password' => 'BrandNewPassword123!',
            'password_confirmation' => 'BrandNewPassword123!',
        ]);

        $resetResponse->assertOk()
            ->assertJson(['message' => __('passwords.reset')]);

        $this->assertTrue(Hash::check('BrandNewPassword123!', $user->fresh()->password));
    }

    public function test_ensure_user_has_role_middleware(): void
    {
        Route::middleware(['auth:sanctum', 'role:tradie'])->get('/api/v1/test-tradie-gate', function () {
            return response()->json(['message' => 'welcome tradie']);
        });

        $customer = User::factory()->create(['role' => 'customer']);
        $tradie = User::factory()->tradie()->create();

        // Customer attempt should be forbidden
        $forbiddenResponse = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/test-tradie-gate');

        $forbiddenResponse->assertForbidden()
            ->assertJson(['message' => 'Forbidden. You do not have permission to access this resource.']);

        // Tradie attempt should succeed
        $allowedResponse = $this->actingAs($tradie, 'sanctum')
            ->getJson('/api/v1/test-tradie-gate');

        $allowedResponse->assertOk()
            ->assertJson(['message' => 'welcome tradie']);
    }
}
