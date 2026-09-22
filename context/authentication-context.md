# Authentication Context & Architecture

## Overview
Phase 4 implements a secure, API-first authentication and account foundation using **Laravel Sanctum** (`personal_access_tokens`). All authentication endpoints reside under `/api/v1/auth` and return standardized JSON responses.

## Key Design & Security Invariants

1. **Token-Based Authentication**:
   - Uses Laravel Sanctum personal access tokens (`HasApiTokens`).
   - Standard HTTP header: `Authorization: Bearer <token>`.
   - Tokens can be issued with specific device names and revoked on logout.

2. **Server-Controlled Role Enforcement**:
   - Registration endpoints strictly control role assignment (`role = 'customer'` for `/register/customer`, `role = 'tradie'` for `/register/tradie`).
   - Any client-submitted `role` parameter is discarded.
   - User account status defaults to `'active'`, and tradie verification status defaults to `'pending'`.

3. **Atomic Profile Creation**:
   - Registrations wrap `User` and profile model creation (`CustomerProfile` or `TradieProfile`) inside a database transaction (`DB::transaction`).
   - If either record fails, the entire transaction rolls back.

4. **Input Normalization & Validation**:
   - Form Requests normalize emails to lowercase and trim whitespaces before validation.
   - Phone and mobile strings are trimmed.
   - Passwords enforce standard security rules (`Password::defaults()`, min:8) and confirmation.
   - Strict uniqueness checks on `users.email` and `users.mobile`.

5. **Enumeration Protection**:
   - Login failures return a unified message: `The provided credentials do not match our records.`
   - Suspended accounts are rejected with HTTP 403 Forbidden.
   - Password reset request returns a generic message to prevent account enumeration if the email is not registered.

6. **Signed Email Verification Security & Architecture**:
   - Implements `MustVerifyEmail` and `Illuminate\Auth\Events\Registered`.
   - **Stateless Authorization Mechanism**: Because verification links are delivered via email and opened directly in external email clients/browsers without pre-existing Sanctum Bearer tokens or web sessions, the endpoint `GET /api/v1/auth/email/verify/{id}/{hash}` uses Laravel's cryptographic temporary signed route mechanism (`URL::temporarySignedRoute`) as the primary authorization bearer.
   - **Tamper & Forgery Resistance**: Signatures are generated with HMAC-SHA256 keyed by `APP_KEY`. An attacker cannot verify another user's account simply by knowing their ID or email; any signature mismatch, URL alteration, or attempt to forge a signature without `APP_KEY` produces an immediate HTTP 403 Forbidden.
   - **Expiration**: Signatures enforce strict expiration timestamps verified via `$request->hasValidSignature()`. Expired links are rejected with HTTP 403 Forbidden.
   - **Email Hash Integrity**: The URL `{hash}` is validated against `sha1($user->getEmailForVerification())` using timing-safe `hash_equals()`. If the user's registered email changes or the hash is tampered with, verification fails.
   - **Cross-Account Protection**: If an already-authenticated user submits a verification request (`$request->user()`), the controller verifies that the authenticated user ID strictly matches the target route `{id}`, preventing cross-account verification attempts. Unauthenticated requests rely safely on the unforgeable cryptographic signature.

7. **Role Middleware**:
   - Middleware `EnsureUserHasRole` (`role:<role1>,<role2>`) protects endpoints requiring specific user types (e.g. `customer`, `tradie`, `admin`).
   - Unauthorized users receive a clean JSON HTTP 403 Forbidden.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register/customer` | `throttle:10,1` | Registers a customer and creates `CustomerProfile`. Returns auth token. |
| `POST` | `/api/v1/auth/register/tradie` | `throttle:10,1` | Registers a tradie and creates `TradieProfile` (`pending`). Returns auth token. |
| `POST` | `/api/v1/auth/login` | `throttle:6,1` | Validates credentials, checks active status, and returns auth token. |
| `POST` | `/api/v1/auth/logout` | `auth:sanctum` | Revokes the current access token. |
| `GET` | `/api/v1/auth/me` | `auth:sanctum` | Returns authenticated user details and loaded profile. |
| `GET` | `/api/v1/auth/email/verify/{id}/{hash}` | `throttle:6,1` | Validates signed link and marks user's email verified. |
| `POST` | `/api/v1/auth/email/verification-notification` | `auth:sanctum`, `throttle:6,1` | Resends email verification link. |
| `POST` | `/api/v1/auth/forgot-password` | `throttle:5,1` | Dispatches password reset notification via broker. |
| `POST` | `/api/v1/auth/reset-password` | `throttle:5,1` | Validates token and resets user's password. |

---

## API Resources

- `UserResource`: Serializes user identity, status, verification timestamps, and conditionally includes `CustomerProfileResource` or `TradieProfileResource`. Sensitive attributes (passwords, remember tokens) are excluded.
- `CustomerProfileResource`: Serializes customer address and postcode.
- `TradieProfileResource`: Serializes business name, ABN, contact information, service address/suburb/state/postcode, and verification status.
- `AuthResponseResource`: Standard auth wrapper with `token`, `token_type: 'Bearer'`, and `user`.

---

## Testing & Verification

- Test Suite: `tests/Feature/AuthTest.php`
- Scenarios covered:
  - Customer registration with profile creation
  - Tradie registration with business profile creation & pending status
  - Client role tampering resistance
  - Validation failures (duplicate email, mismatched/short passwords)
  - Successful login & invalid credential handling
  - Suspended account rejection
  - Profile retrieval via `/me`
  - Unauthenticated access rejection (401)
  - Token revocation on logout
  - Signed URL email verification and tampering rejection
  - Email verification resend
  - Password reset link and completion workflow
  - Role middleware gating (`role:tradie`)
