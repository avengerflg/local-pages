# Notifications & Communication Context

## Overview
Phase 12 establishes the in-app notification and communication pipeline across the entire service request and job lifecycle. System events atomically trigger persistent in-app notification records for platform actors, and authenticated users can view, filter, unread-count, and mark notifications as read.

---

## Key Invariants & Architectural Rules

1. **Synchronous In-App Notification Generation**:
   - Notifications are created synchronously within backend domain actions.
   - All notifications are persisted to the `notifications` table.
   - Recipient user IDs are resolved server-side; client input is never trusted for recipient assignment.

2. **Notification Event Catalog & Recipient Matrix**:
   - **`tradie_selected`**: Triggered when a customer selects matching tradies for a service request. Recipient: Selected Tradie User (`tradie_profiles.user_id`).
   - **`new_message`**: Triggered when a participant sends a chat message in a conversation. Recipient: The other participant in the conversation (customer or tradie), never the sender.
   - **`new_quote`**: Triggered when a tradie submits a quote on a service request. Recipient: Request-owning Customer (`service_requests.customer_id`).
   - **`quote_accepted`**: Triggered when a customer accepts a tradie's quote. Recipient: Accepted Quote's Tradie User (`tradie_profiles.user_id`).
   - **`quote_rejected`**: Triggered when a customer explicitly declines a quote. Recipient: Rejected Quote's Tradie User (`tradie_profiles.user_id`).
   - **`appointment_scheduled`**: Triggered when a customer books an appointment. Recipient: Assigned Tradie User (`tradie_profiles.user_id`).
   - **`job_started`**: Triggered when the tradie starts work on the job. Recipient: Owning Customer (`service_requests.customer_id`).
   - **`job_completed`**: Triggered when the tradie marks work completed. Recipient: Owning Customer (`service_requests.customer_id`).
   - **`review_submitted`**: Triggered when a customer submits a review for a completed job. Recipient: Review's Tradie User (`tradie_profiles.user_id`).
   - **`review_approved`**: Triggered when an admin approves a pending review. Recipient: Tradie User (`tradie_profiles.user_id`).
   - **`review_rejected`**: Triggered when an admin rejects a review. Recipient: Author Customer User (`reviews.customer_id`).
   - **`review_responded`**: Triggered when a tradie posts a response to a review. Recipient: Author Customer User (`reviews.customer_id`).

3. **Transaction & Atomicity Behavior**:
   - Notifications are generated within the same database transaction as the primary business operation.
   - If any business validation, constraint, or database operation fails, the transaction rolls back completely and no false notification is persisted.

4. **Duplicate Notification Behavior**:
   - Duplicates are prevented at the application level via domain state guards, pessimistic locking, and single-transition invariants (e.g. `wasRecentlyCreated` checks on lead selection, uniqueness on review/response/appointment creation).
   - No unnecessary rigid database-level unique constraints are applied to `notifications`.

5. **Data Integrity & Payload Security**:
   - The JSON `data` payload contains only non-sensitive contextual identifiers (e.g. `service_request_id`, `quote_id`, `job_id`, `review_id`).
   - Passwords, authentication tokens, private file paths, storage credentials, unnecessary personal information, and secrets are never stored in or exposed by notifications.
   - Chat notifications do not expose private attachment storage paths or pre-signed URLs.

6. **Inbox Security & Authorization**:
   - `GET /api/v1/notifications` returns only `auth()->user()->notifications`.
   - `GET /api/v1/notifications/{id}` returns HTTP 404 Not Found if requested by an unrelated user (preventing ID enumeration).
   - `POST /api/v1/notifications/{id}/read` only marks the authenticated user's own notification as read.
   - `POST /api/v1/notifications/read-all` updates only unread notifications belonging to the authenticated user.
   - `GET /api/v1/notifications/unread-count` counts only the authenticated user's unread notifications.
   - Client-supplied `user_id` query/body parameters are strictly ignored in favor of server-side `auth()->id()`.

7. **Read State & Idempotency**:
   - Notifications have a `read_at` timestamp (`null` for unread, datetime for read).
   - `is_read` boolean is calculated dynamically based on `read_at !== null`.
   - Marking a notification as read is idempotent — if already read, `read_at` is preserved.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | `auth:sanctum` | List authenticated user's notifications (newest first, paginated). |
| `GET` | `/api/v1/notifications/unread-count` | `auth:sanctum` | Retrieve count of unread notifications for current user. |
| `POST` | `/api/v1/notifications/read-all` | `auth:sanctum` | Mark all unread notifications for authenticated user as read. |
| `GET` | `/api/v1/notifications/{id}` | `auth:sanctum` | Retrieve details of a single notification (owner only). |
| `POST` | `/api/v1/notifications/{id}/read` | `auth:sanctum` | Mark a specific notification as read (owner only). |

---

## Architecture Decisions & Delivery Channel Status

1. **Queue Behavior**:
   - Synchronous in-app database persistence (consistent with existing Phase 1–11 architecture; no unnecessary queue complexity).
2. **Email Delivery**:
   - **OPEN** (External transactional emails via SES/Postmark deferred).
3. **SMS / WhatsApp**:
   - **OUT OF SCOPE** (Twilio/WhatsApp messaging excluded).
4. **Push Notifications**:
   - **OPEN / FUTURE** (FCM/APNS push notifications deferred).
5. **Notification Preferences**:
   - **OPEN** (User opt-in/opt-out configuration system deferred).
6. **Auto-Rejected Quotes Notification**:
   - **OPEN** (Automated notifications for competitor quotes auto-rejected on quote acceptance remain open).
