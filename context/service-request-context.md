# Service Request & Lead Intake Context

## Overview
Phase 5 implements the customer-facing intake workflow for exploring available marketplace services, completing intake questions, uploading attachments, and creating service requests (`service_requests`). All customer endpoints reside under `/api/v1` and require Sanctum authentication with the `customer` role.

---

## Key Invariants & Architectural Decisions

1. **Authentication & Authorization**:
   - Customer request creation and history retrieval require `auth:sanctum` and `role:customer`.
   - `customer_id` is strictly assigned from `$request->user()->id`. Any client-supplied `customer_id` is ignored to prevent identity spoofing.
   - Non-customer accounts (such as tradies) are rejected with HTTP 403 Forbidden.

2. **No Early Matching or Lead Distribution**:
   - In accordance with Phase 5 boundaries, requests are created with initial `status = 'submitted'` and `submitted_at = now()`.
   - Matching, tradie ranking, lead distribution, notification dispatch to tradies, and quotes/chat remain for later phases.

3. **Service & Question Validation**:
   - Requests require an active service (`services.status = 'active'`). Inactive or non-existent services are rejected.
   - All submitted answer `question_id`s must belong to the selected service. Cross-service question answers are rejected with HTTP 422.
   - Single-choice and multiple-choice answers validate that submitted `selected_option_id` values belong to the corresponding question.

4. **Conditional Question Evaluation**:
   - Supports rule formats on `service_questions.conditional_rule`:
     - Option ID rule: `{"depends_on_question_id": 1, "selected_option_id": 5}` (or `parent_question_id` / `parent_option_id`).
     - Value-based rule: `{"depends_on_question_id": 1, "value": "yes"}`.
   - When the parent condition is NOT satisfied, the child question is treated as non-applicable and optional.
   - When the parent condition IS satisfied and the child question is marked `required`, valid input is strictly enforced.

5. **Attachment Storage & Security**:
   - Uploads are validated server-side for MIME type (`jpeg,jpg,png,webp,pdf,doc,docx`) and max size (10MB default).
   - Stored securely on the configured disk (`request-attachments/` with randomized sha256 hash filenames via `UploadedFile::store`).
   - File metadata is recorded in `request_attachments` (`file_path`, `original_name`, `mime_type`, `file_size`).
   - Absolute filesystem paths are never exposed to API consumers; safe public URLs are rendered via `Storage::url()`.

6. **Transactional Integrity**:
   - Creation of `ServiceRequest`, all `RequestAnswer`s, and all `RequestAttachment`s is wrapped in `DB::transaction()`.
   - Any failure triggers a complete rollback, preventing orphan requests or partially saved answers.

7. **Scoped Retrieval & Anti-Leakage**:
   - `GET /api/v1/service-requests` lists only requests belonging to `$request->user()->id`.
   - `GET /api/v1/service-requests/{id}` enforces ownership and returns HTTP 404 if accessed by any other customer or unauthorized actor.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/services` | None | Lists active marketplace services for discovery. |
| `GET` | `/api/v1/services/{service}` | None | Retrieves active service details with its ordered active questions and options (supports slug or ID). |
| `POST` | `/api/v1/service-requests` | `auth:sanctum`, `role:customer` | Creates a new service request with answers and attachments. |
| `GET` | `/api/v1/service-requests` | `auth:sanctum`, `role:customer` | Paginated list of service requests belonging to the authenticated customer. |
| `GET` | `/api/v1/service-requests/{id}` | `auth:sanctum`, `role:customer` | Retrieves full details of a specific service request owned by the customer. |

---

## Open Decisions (Documented)
1. **Configurable Attachment Limits**: Default 10MB per file and 10 attachments maximum per request.
2. **Initial Request Status**: Defaulting to `'submitted'` with `submitted_at` timestamp.
