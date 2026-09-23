# Platform Chat & Conversations Context

## Overview
Phase 8 implements the backend and REST API foundation for the **Customer ↔ Tradie Platform Chat & Conversations** workflow. Chat enables customers and their selected tradies (`request_tradies`) to communicate directly within the platform regarding a service request without requiring direct off-platform contact.

---

## Key Invariants & Architectural Rules

1. **Participant Authorization & Scope**:
   - Conversations are established for a specific `(request_id, tradie_id)` pair, with a database unique constraint `(request_id, tradie_id)` on `conversations`.
   - **Customer Access**: Only the customer who owns the `service_requests` record (`conversations.customer_id = $user->id`) can access, view, and send messages in the conversation.
   - **Tradie Access**: Only the tradie profile selected for that request (`conversations.tradie_id = $user->tradieProfile->id`) can access, view, and send messages in the conversation.
   - Unauthorized attempts (accessing another user's conversation ID) return HTTP `404 Not Found` to prevent conversation enumeration or data leakage.

2. **Conversation Lifecycle**:
   - Initiated via `POST /api/v1/conversations` (idempotent `firstOrCreate`).
   - Validates that the tradie was selected by the customer (`request_tradies` entry exists) before conversation creation is allowed.
   - Tracks `last_message_at` timestamp on `conversations` whenever a message is sent.

3. **Message Sending & Storage**:
   - Sent via `POST /api/v1/conversations/{id}/messages`.
   - The sender identity is always derived server-side from `auth()->user()->id`. Client-supplied sender inputs are ignored.
   - Validates that at least a `body` (max 5,000 chars) or `attachments` (max 5 files, 10MB each, safe types) is present.
   - Stored in `messages` and `message_attachments` inside an atomic `DB::transaction()`.

4. **Attachment Security & Private Storage**:
   - Chat attachments are stored on the private `local` disk under `storage/app/private/chat-attachments/`.
   - Files are NOT web-accessible and never stored on the public disk.
   - Any transaction failure during sending automatically cleans up any uploaded private files to prevent orphaned artifacts.
   - Responses expose safe metadata only (`id`, `original_name`, `mime_type`, `file_size`, `created_at`).
   - Public URLs, signed download URLs, raw storage keys, filesystem paths, and storage credentials are never exposed in the API.

5. **Pagination & Ordering**:
   - `GET /api/v1/conversations`: Paginated (default 15 per page) and ordered by `COALESCE(last_message_at, created_at) DESC`.
   - `GET /api/v1/conversations/{id}/messages`: Paginated (default 25 per page) and ordered chronologically by `id ASC` to ensure unbounded message retrieval is prevented.

6. **Read / Unread Status Behavior**:
   - `messages` table provides `is_read` (boolean, default `false`) and `read_at` (timestamp, nullable) fields.
   - `MessageResource` exposes `read_at` as read metadata.
   - Automated mark-as-read transitions, bulk read receipts, and aggregate unread badge counters are NOT invented in Phase 8 and remain explicitly OPEN for future phases.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/conversations` | `auth:sanctum` | Paginated list of conversations for the authenticated customer or tradie. |
| `POST` | `/api/v1/conversations` | `auth:sanctum` | Start or retrieve an existing conversation for an authorized request and tradie. |
| `GET` | `/api/v1/conversations/{id}` | `auth:sanctum` | Retrieve conversation detail and participant summaries. |
| `GET` | `/api/v1/conversations/{id}/messages` | `auth:sanctum` | Paginated message history for an authorized conversation (chronological order). |
| `POST` | `/api/v1/conversations/{id}/messages` | `auth:sanctum` | Send a text message and/or upload chat attachments within an authorized conversation. |

---

## Open Decisions (Documented)
1. **Real-time WebSockets / Reverb Broadcasting**: Platform chat operates via reliable REST APIs in Phase 8; real-time event broadcasting is OPEN for frontend integration.
2. **Secure Attachment Delivery**: Chat attachments currently return safe metadata only; tokenized/signed download URL streams remain OPEN for future storage hardening.
3. **Read Receipts & Unread Counters**: Schema supports `messages.read_at`; active mark-as-read workflows and unread badge aggregations remain OPEN.
4. **Message Editing / Deletion**: Out of scope for Phase 8; edit histories and message deletion remain OPEN.
5. **Chat Notifications**: SMS, push, and transactional email notifications for unread messages remain OPEN.
6. **Direct Customer Contact Disclosure**: Customer phone numbers and email addresses remain shielded within platform chat.
