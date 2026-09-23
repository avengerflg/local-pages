# Reviews & Ratings Context

## Overview
Phase 11 implements the backend and REST API foundation for the **Customer Reviews & Ratings** workflow. After a job is completed, the owning customer can submit a 1–5 star rating with written feedback. Reviews enter a moderation queue and are only publicly visible once an admin approves them. The assigned tradie may post a single public response to a review that belongs to them.

---

## Key Invariants & Architectural Rules

### 1. Review Eligibility
- A review can only be submitted by the **authenticated customer** who owns the underlying service request.
- The job must exist, belong to that customer's service request, and have `status = completed`.
- The job must have an assigned tradie (`tradie_id` is not null).
- Only **one review per job** is allowed. The `reviews.job_id` column has a database `UNIQUE` constraint as the definitive enforcement. A concurrency-safe application-level check using `DB::transaction()` + `lockForUpdate()` provides a clean 422 response before the DB constraint is reached.

### 2. Server-Side Attribution
- `customer_id` is derived from `auth()->user()->id`. Any client-submitted `customer_id` is ignored.
- `tradie_id` is derived from `job->tradie_id`. Any client-submitted `tradie_id` is ignored.

### 3. Review Moderation Status Vocabulary
The `reviews.moderation_status` column uses the following values (defined in Phase 2 schema):

| Status     | Meaning |
|------------|---------|
| `pending`  | Newly submitted; awaiting admin review. Not publicly visible. |
| `approved` | Approved by admin. Publicly visible. `published_at` is recorded. |
| `rejected` | Rejected/removed by admin. Not publicly visible. `removed_at` is recorded. |
| `flagged`  | Flagged for further review (schema groundwork; no Phase 11 API). |

- Reviews are **never hard-deleted**; they are soft-removed by setting `moderation_status = rejected` and recording `removed_at`.
- Only admin can transition a review from `pending` to `approved` or `rejected`.

### 4. Public Visibility
- Only `approved` reviews appear in public-facing tradie review listings (`GET /api/v1/tradies/{id}/reviews`).
- `pending`, `rejected`, and `flagged` reviews are excluded from all public listings.
- A customer who owns a pending review cannot bypass moderation through any public endpoint.

### 5. Customer Immutability
- Once submitted, a review is immutable from the customer's perspective.
- No `PUT /reviews/{id}` or `PATCH /reviews/{id}` endpoint exists for customers.
- No customer review deletion endpoint exists.

### 6. Tradie Response
- The assigned tradie may post **exactly one** public response to a review that belongs to them.
- `tradie_id` in the response is derived server-side from `auth()->user()->tradieProfile`. Client-submitted tradie IDs are ignored.
- One response per review is enforced by the `review_responses.review_id` UNIQUE constraint. A concurrency-safe application-level check provides a clean 422 before the DB constraint fires.
- Response editing, deletion, threading, voting, and customer replies are **OPEN** for future definition.

### 7. Duplicate/Concurrency Handling
- `reviews.job_id` UNIQUE constraint: prevents any second review for the same job at the database level.
- `review_responses.review_id` UNIQUE constraint: prevents any second response for the same review at the database level.
- Both creation actions use `DB::transaction()` + `lockForUpdate()` as an application-level guard before reaching the DB constraint, ensuring a clean 422 `ValidationException` response rather than an unhandled DB integrity error.

### 8. Admin Authorization
- Admin moderation endpoints are gated by `auth:sanctum` + `role:admin`.
- Customers and tradies receive HTTP 403 from the `EnsureUserHasRole` middleware.
- Admin uses the existing shared `users` table with `role = admin`; no separate admin auth system.

### 9. Validation Rules
| Field | Rules |
|-------|-------|
| `rating` | Required, integer, min:1, max:5. DB CHECK constraint is the additional safeguard. |
| `review_text` | Required, string, max:10000 (technical application-level limit). **TODO: OPEN DECISION — business-specific review text length limit.** |
| `response_text` | Required, string, max:10000 (technical application-level limit). **TODO: OPEN DECISION — business-specific response text length limit.** |

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|--------|-----|------------|-------------|
| `POST` | `/api/v1/jobs/{id}/reviews` | `auth:sanctum`, `role:customer` | Submit a review for a completed job (customer only). |
| `GET` | `/api/v1/tradies/{id}/reviews` | none (public) | List approved reviews for a tradie profile. Paginated. |
| `POST` | `/api/v1/reviews/{id}/response` | `auth:sanctum`, `role:tradie` | Submit a response to a review belonging to that tradie. |
| `GET` | `/api/v1/admin/reviews` | `auth:sanctum`, `role:admin` | List all pending reviews for admin moderation. |
| `POST` | `/api/v1/admin/reviews/{id}/approve` | `auth:sanctum`, `role:admin` | Approve a pending review; makes it publicly visible. |
| `POST` | `/api/v1/admin/reviews/{id}/reject` | `auth:sanctum`, `role:admin` | Reject/remove a pending or flagged review. |

---

## Authorization Matrix

| Actor | Create Review | View Approved Reviews | Post Response | Admin Moderate |
|-------|:---:|:---:|:---:|:---:|
| Unauthenticated | 401 | ✅ (public) | 401 | 401 |
| Customer (owner) | ✅ (201) | ✅ | 403 | 403 |
| Customer (unrelated) | 404 | ✅ | 403 | 403 |
| Tradie (assigned) | 403 | ✅ | ✅ (201) | 403 |
| Tradie (unrelated) | 403 | ✅ | 404 | 403 |
| Admin | 403 | ✅ | 403 | ✅ |

---

## Review Reporting — OPEN

The `review_reports` table exists as schema groundwork from Phase 2. **No review reporting API has been implemented in Phase 11.** The workflow for customers or tradies to flag a review, and for admins to resolve reports, remains **OPEN** for a future phase.

---

## Open / Deferred Decisions

1. **Response editing & deletion**: Whether a tradie can edit or delete their submitted response is OPEN and undefined.
2. **Customer reply to response**: Whether customers can reply to tradie responses is OPEN. No response threads are implemented.
3. **Review text business length limit**: The 10 000-character limit applied in Phase 11 is a technical application-level safety limit. A product-specific limit is an OPEN DECISION.
4. **Review reporting workflow**: Flagging reviews via `review_reports`, admin report resolution, and reporter-facing features are OPEN.
5. **Approved review editing by admin**: Whether admin can re-moderate an already-approved review (e.g., retroactively reject) is OPEN.

---

## Files Created

| File | Purpose |
|------|---------|
| `app/Actions/Review/CreateReviewAction.php` | Review creation with eligibility check, transaction, and lock |
| `app/Actions/Review/GetTradieReviewsAction.php` | Paginated approved-review listing for a tradie |
| `app/Actions/Review/RespondToReviewAction.php` | Tradie response with ownership check and deduplication |
| `app/Actions/Review/AdminGetPendingReviewsAction.php` | Admin pending review listing |
| `app/Actions/Review/AdminApproveReviewAction.php` | Admin approve transition |
| `app/Actions/Review/AdminRejectReviewAction.php` | Admin reject/soft-remove transition |
| `app/Http/Requests/Review/StoreReviewRequest.php` | Validation for review submission |
| `app/Http/Requests/Review/StoreReviewResponseRequest.php` | Validation for response submission |
| `app/Http/Resources/ReviewResource.php` | Public-facing review response shape |
| `app/Http/Resources/ReviewResponseResource.php` | Public-facing response shape |
| `app/Http/Resources/AdminReviewResource.php` | Admin-facing review shape with moderation fields |
| `app/Http/Controllers/Api/V1/ReviewController.php` | Thin controller delegating to actions |
| `tests/Feature/ReviewManagementTest.php` | 28 feature tests, 67 assertions |

---

## Testing

- **Test file**: `tests/Feature/ReviewManagementTest.php`
- **Tests**: 28
- **Assertions**: 67
- **Coverage**: All authorization paths, visibility rules, eligibility failures, duplicate prevention, admin moderation, tradie response cardinality, spoofed-ID rejection, customer immutability.
