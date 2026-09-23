# Tradie Lead Dashboard & Lead Management Context

## Overview
Phase 7 implements the backend and API foundation for the **Tradie Lead Management** workflow. Once a customer selects one or more matched tradies for a service request (Phase 6), the associated tradies are able to securely view and manage their incoming leads via authenticated REST endpoints under `/api/v1/tradie`.

---

## Key Invariants & Architectural Rules

1. **Lead Ownership Model**:
   - The lead relationship is represented directly by the `request_tradies` table (`ServiceRequest -> RequestTradie -> TradieProfile -> User`).
   - The authenticated tradie profile is resolved server-side from `auth()->user()->tradieProfile`. Client-supplied `tradie_id` values are never used for authentication or authorization.
   - Tradie leads are strictly scoped: a tradie can only view leads where their profile is referenced in `request_tradies.tradie_id`.

2. **Authorization & Security**:
   - All tradie lead endpoints require `auth:sanctum` and `role:tradie` (enforced via `EnsureUserHasRole` middleware).
   - Non-tradie accounts (e.g. customers, unauthenticated users) receive `403 Forbidden` or `401 Unauthorized`.
   - Accessing a lead ID belonging to another tradie or a nonexistent lead ID returns `404 Not Found` to prevent resource existence enumeration.

3. **Data Exposure & Sanitization**:
   - **Service Request Data**: Request ID, title, description, status, postcode, submitted timestamp, service details, and location details.
   - **Service Answers**: Text answers, single-choice answers (with option labels and values), and multiple-choice answers are properly serialized.
   - **Attachments**: Safe attachment metadata (id, original filename, MIME type, file size, created_at) is exposed to the authorized tradie. Public download URLs, temporary/signed URLs, raw storage keys, filesystem paths, and storage credentials are never exposed.
   - **Customer Privacy**: Only safe summary information (customer ID and name) is exposed. Private contact credentials (e.g. passwords, tokens, auth state) remain strictly concealed.

4. **Lead Status Lifecycle**:
   - `request_tradies.status` uses the approved schema defaults (e.g. `selected`, `contacted`, `declined`).
   - Phase 7 is read-focused and does not prematurely transition or invent statuses.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/tradie/leads` | `auth:sanctum`, `role:tradie` | Paginated list of leads assigned to the authenticated tradie (ordered newest first). |
| `GET` | `/api/v1/tradie/leads/{id}` | `auth:sanctum`, `role:tradie` | Full details of a single lead owned by the authenticated tradie, including answers and attachments. |

---

## Open Decisions (Documented)
1. **Tradie Accept / Decline Workflow**: Explicit accept/decline action endpoints remain deferred and marked as OPEN.
2. **Secure Attachment Delivery**: Actual file downloading is not currently exposed by the Phase 7 API; secure signed/temporary expiring attachment delivery remains OPEN.
3. **Lead Expiration / Limits**: Time-based lead expiry or active lead capacity limits remain OPEN for future business configuration.
4. **Direct Contact Info**: Phone/email reveal rules (e.g. upon chat initiation or quote acceptance) remain OPEN for subsequent communication phases.
