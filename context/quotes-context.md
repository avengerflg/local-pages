# Quotations / Quote Management Context

## Overview
Phase 9 implements the backend and REST API foundation for the **Quotations / Quote Management** workflow. Once tradies have been matched and selected for a customer's service request (`request_tradies`), they can submit formal price quotations. Customers can view and compare multiple quotes, view individual quote details, explicitly reject unwanted quotes, and accept exactly one quote. Upon acceptance, any remaining pending quotes are automatically rejected and the service request transitions to `quote_accepted`.

---

## Key Invariants & Architectural Rules

1. **Quote Ownership & Tradie Eligibility**:
   - A tradie can only submit a quote for a service request where they are legitimately assigned (`request_tradies.request_id = $requestId` AND `request_tradies.tradie_id = $tradieProfile->id`).
   - Authenticated user identity is always authoritative (`auth()->user()->tradieProfile`). Client-supplied `tradie_id` is never trusted.
   - Tradie quote creation endpoint: `POST /api/v1/service-requests/{id}/quotes` (`auth:sanctum`, `role:tradie`).
   - Quotes can only be submitted for service requests in quoteable statuses (`submitted`, `matching`, `quoting`). Submissions on `quote_accepted`, `completed`, or `cancelled` requests are rejected with HTTP 422.

2. **Customer Quote Access & Comparison**:
   - Customers can list and compare all quotes received for their own service requests: `GET /api/v1/service-requests/{id}/quotes` (`auth:sanctum`, `role:customer`).
   - Access is strictly scoped to the owner of the service request (`service_requests.customer_id = auth()->user()->id`). Access by another customer returns HTTP 404.
   - The platform presents quotes factually without algorithmic rankings, recommendations, or artificial scores.
   - Customer quote listings are paginated (default 15 per page) and ordered newest first (`id DESC`).

3. **Single Quote View Authorization**:
   - An individual quote (`GET /api/v1/quotes/{id}`, `auth:sanctum`) can only be viewed by:
     - The customer who owns the underlying service request, OR
     - The tradie who authored the quote (`quotes.tradie_id = $tradieProfile->id`).
   - Unrelated users receive HTTP 404 Not Found.

4. **Atomic Quote Acceptance & Concurrency Protection**:
   - Customer accepts a quote via `POST /api/v1/quotes/{id}/accept` (`auth:sanctum`, `role:customer`).
   - Must own the underlying service request.
   - Executed inside a `DB::transaction()` with pessimistic row locking (`lockForUpdate()` on both `ServiceRequest` and `Quote`):
     1. Verifies that no quote is already accepted for this service request and `$serviceRequest->status !== 'quote_accepted'`.
     2. Verifies that the selected quote is currently `status = 'pending'`.
     3. Transitions the chosen quote to `status = 'accepted'` and `accepted_at = now()`.
     4. Atomically updates all other pending quotes for that service request to `status = 'rejected'` and `rejected_at = now()`.
     5. Transitions the service request to `status = 'quote_accepted'`.
   - Guaranteed exactly one accepted quote per request.

5. **Quote Rejection**:
   - Customer can explicitly reject an individual pending quote via `POST /api/v1/quotes/{id}/reject` (`auth:sanctum`, `role:customer`).
   - Transitions quote to `status = 'rejected'` and `rejected_at = now()`.
   - A rejected quote can never subsequently be accepted.

6. **Quote Attachments & Private Storage**:
   - Stored on the private `local` disk (`storage/app/private/quote-attachments/`).
   - Files are never stored on public web disks or exposed via direct URLs.
   - API serialization (`QuoteAttachmentResource`) exposes safe metadata only (`id`, `quote_id`, `original_name`, `mime_type`, `file_size`, `created_at`).
   - Failed transactions during creation automatically clean up any uploaded private files.

7. **Zero Payment / Commission Policy**:
   - In accordance with marketplace boundaries, quotes represent quoted prices only.
   - No payment processing, platform commissions, invoices, or payouts are computed or stored.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `POST` | `/api/v1/service-requests/{id}/quotes` | `auth:sanctum`, `role:tradie` | Submit a quotation for an assigned service request. |
| `GET` | `/api/v1/service-requests/{id}/quotes` | `auth:sanctum`, `role:customer` | Paginated list of quotes for customer's service request. |
| `GET` | `/api/v1/quotes/{id}` | `auth:sanctum` | Retrieve full details of an individual quote. |
| `POST` | `/api/v1/quotes/{id}/accept` | `auth:sanctum`, `role:customer` | Accept a pending quote and atomically reject others. |
| `POST` | `/api/v1/quotes/{id}/reject` | `auth:sanctum`, `role:customer` | Reject an individual pending quote. |

---

## Open Decisions (Documented)
1. **Quote Editing & Tradie Withdrawal**: Deferred; quotes are immutable once submitted.
2. **Automated Time-based Expiration**: The `valid_until` date is stored and exposed as informative metadata; automated cron expiry remains OPEN.
3. **Appointment Scheduling & Calendar Integration**: `estimated_duration` and `proposed_date` are treated as informational quote terms; actual appointment booking remains for Phase 10+.
4. **Secure Attachment Downloads**: API returns safe metadata only; tokenized/signed download streams remain OPEN.
5. **Multiple Quotes per Tradie**: Schema permits multiple quotes; repeated quote submission handling remains OPEN.
6. **Customer Cancellation after Acceptance**: Post-acceptance cancellation flows remain OPEN for job lifecycle phases.
