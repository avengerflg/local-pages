# Appointment Scheduling Context

## Overview
Phase 10 implements the backend and REST API foundation for the **Appointment Scheduling** workflow. Once a customer accepts a quote from an assigned tradie (Phase 9), the customer can schedule an appointment for the job. Creating an appointment establishes the formal booking, creates a corresponding executing `Job` record in `scheduled` status, and transitions the service request from `quote_accepted` to `scheduled`.

---

## Key Invariants & Architectural Rules

1. **Authorization & Prerequisite State**:
   - Appointment creation endpoint: `POST /api/v1/service-requests/{id}/appointments` (`auth:sanctum`, `role:customer`).
   - The authenticated user must be the customer who owns the service request (`service_requests.customer_id = auth()->user()->id`). Accessing another customer's request returns HTTP 404.
   - The service request must be in `quote_accepted` status. Scheduling on requests in other states (`submitted`, `matching`, `quoting`, `scheduled`, `in_progress`, `completed`, `cancelled`) is rejected with HTTP 422.
   - The server resolves the associated `accepted` quote and the assigned `tradie_id` server-side from the database. Client attempts to spoof tradie or quote identities are strictly ignored.

2. **Atomic Appointment & Job Creation**:
   - Appointment creation executes inside a `DB::transaction()` with pessimistic row locking (`lockForUpdate()` on `ServiceRequest`).
   - Atomically performs:
     1. Creates `Appointment` (`status = 'scheduled'`, `request_id`, `quote_id`, `customer_id`, `tradie_id`, `starts_at`, `ends_at`, `notes`).
     2. Creates `Job` (`status = 'scheduled'`, `request_id`, `appointment_id`, `tradie_id`).
     3. Transitions `service_requests.status` from `quote_accepted` to `scheduled`.
   - Prevents race conditions and guarantees that duplicate appointments cannot be created for the same service request.

3. **Appointment Viewing Authorization**:
   - `GET /api/v1/appointments/{id}` (`auth:sanctum`).
   - Accessible by:
     - The customer who owns the service request (`appointments.customer_id = auth()->user()->id`).
     - The assigned tradie (`appointments.tradie_id = auth()->user()->tradieProfile->id`).
   - Unrelated customers and tradies receive HTTP 404 Not Found to prevent resource enumeration.

4. **Input Validation Rules**:
   - `starts_at`: `['required', 'date']`
   - `ends_at`: `['nullable', 'date', 'after:starts_at']`
   - `notes`: `['nullable', 'string', 'max:5000']`

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `POST` | `/api/v1/service-requests/{id}/appointments` | `auth:sanctum`, `role:customer` | Schedule an appointment for a quote-accepted request. |
| `GET` | `/api/v1/appointments/{id}` | `auth:sanctum` | Retrieve details of an authorized appointment. |

---

## Open Decisions (Documented)
1. **Rescheduling & Cancellation**: Dedicated reschedule/cancel endpoints and cancellation notice policies remain OPEN.
2. **Timezone & Business Hours**: Stored in standard datetimes; tradie timezone and availability window enforcement remain OPEN.
3. **Calendar Integrations & Reminders**: External calendar sync (Google Calendar, iCal) and transactional SMS/email reminders remain OPEN.
