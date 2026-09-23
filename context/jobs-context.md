# Job Execution & Lifecycle Context

## Overview
Phase 10 establishes the backend and REST API foundation for the **Job Execution & Lifecycle** workflow. When an appointment is scheduled, a `Job` record is initialized in `scheduled` status linking the service request, appointment, and assigned tradie. The tradie can start work (transitioning the job and request to `in_progress`) and complete work (transitioning the job, appointment, and request to `completed`).

---

## Key Invariants & Architectural Rules

1. **Job Creation & Linkage**:
   - A `Job` record is created automatically upon appointment scheduling.
   - References `request_id`, `appointment_id`, and `tradie_id`.
   - Initial status is `scheduled`.

2. **Job Lifecycle & State Transitions**:
   - **`scheduled` → `in_progress`**:
     - Action: `POST /api/v1/jobs/{id}/start` (`auth:sanctum`, `role:tradie`).
     - Allowed only when current status is `scheduled`.
     - Records `started_at = now()`.
     - Transitions `service_requests.status` to `in_progress`.
   - **`in_progress` → `completed`**:
     - Action: `POST /api/v1/jobs/{id}/complete` (`auth:sanctum`, `role:tradie`).
     - Allowed only when current status is `in_progress`.
     - Records `completed_at = now()`.
     - Transitions `appointments.status` to `completed` and `service_requests.status` to `completed`.
   - **Invalid Transitions Rejected**:
     - `scheduled` → `completed` (fails with HTTP 422; work cannot be completed without being started).
     - `completed` → `in_progress` or `scheduled` (fails with HTTP 422; completed jobs are terminal).

3. **Job Viewing Authorization**:
   - `GET /api/v1/jobs/{id}` (`auth:sanctum`).
   - Accessible by:
     - The assigned tradie (`jobs.tradie_id = auth()->user()->tradieProfile->id`).
     - The customer who owns the underlying service request (`service_requests.customer_id = auth()->user()->id`).
   - Unrelated users receive HTTP 404 Not Found.

4. **Tradie-Only Execution Actions**:
   - Only the authenticated tradie assigned to the job can start or complete the job.
   - Customer accounts receive HTTP 403 Forbidden.
   - Unrelated tradies receive HTTP 404 Not Found.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/jobs/{id}` | `auth:sanctum` | Retrieve details of an authorized job. |
| `POST` | `/api/v1/jobs/{id}/start` | `auth:sanctum`, `role:tradie` | Mark a scheduled job as started / in progress. |
| `POST` | `/api/v1/jobs/{id}/complete` | `auth:sanctum`, `role:tradie` | Mark an in-progress job as completed. |

---

## Open Decisions (Documented)
1. **Automated Time-Based Job Start**: Automated cron/time-based transition to `in_progress` at appointment start time remains OPEN; manual tradie start endpoint is provided.
2. **Review & Rating Collection**: Post-completion customer review submission and admin moderation remain for Phase 12.
3. **Payments, Invoices & Payouts**: Excluded from scope; no financial processing or billing records are generated.
