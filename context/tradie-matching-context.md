# Tradie Matching & Lead Selection Context

## Overview
Phase 6 implements the core matching engine and customer-driven lead selection workflow. Matching determines which verified, active tradies are eligible to perform a customer's service request based on service offering and service area coverage. The customer explicitly chooses which tradies receive the lead (`request_tradies`).

---

## Key Invariants & Architectural Rules

1. **Customer-Driven Selection (No Automatic Lead Distribution)**:
   - Matching purely calculates and returns eligible tradie profiles.
   - The platform **never automatically distributes leads, assigns tradies, or notifies tradies**.
   - Only explicit customer selections create `request_tradies` records.

2. **Matching Criteria**:
   - **Service Match**: Tradie offers the requested service (`tradie_services` where `services.id = service_request.service_id` and `services.status = 'active'`).
   - **Service Area Match**: Tradie services the exact location or postcode associated with the request (`tradie_service_areas` matching `location_id` or matching `postcode`).
   - **Tradie Eligibility**: The tradie account user must have `status = 'active'` and the profile must have `verification_status = 'verified'`. Suspended or unverified tradies are excluded.
   - **Availability Behavior (Open)**: Because `service_requests` does not capture scheduling date/time at the initial intake stage (appointments occur post-quote in later phases), service and service-area matching form the primary eligibility filter.

3. **Customer Ownership & Anti-Leakage**:
   - Both `GET` (viewing matches) and `POST` (selecting tradies) require `auth:sanctum` and `role:customer`.
   - The service request must belong to `$request->user()->id`. Attempting to access or select tradies for another customer's request returns HTTP 404.

4. **Server-Side Eligibility Validation**:
   - When a customer submits tradie IDs for selection, the server independently evaluates that each selected tradie is in the computed eligible match set.
   - Any attempt to select an unrelated or ineligible tradie is rejected with HTTP 422.

5. **Atomic Selection & Deduplication**:
   - `SelectMatchingTradiesAction` runs inside `DB::transaction()`.
   - Uses `RequestTradie::firstOrCreate()` to safely handle duplicate submissions idempotently and protect the unique constraint `(request_id, tradie_id)` without resetting the selection timestamp.
   - Advances `service_requests.status` from `'submitted'` to `'matching'` when selections are recorded.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/service-requests/{id}/matching-tradies` | `auth:sanctum`, `role:customer` | Paginated list of eligible verified matching tradies for the customer's request. |
| `POST` | `/api/v1/service-requests/{id}/matching-tradies` | `auth:sanctum`, `role:customer` | Submits customer's selected tradie IDs (`tradie_ids: [1, 2]`) and creates `request_tradies` records. |

---

## Open Decisions (Documented)
1. **Hierarchical Service Area Inheritance**: Exact location and postcode matching are supported. Geographic ancestor inheritance (e.g. tradie selecting a State or Council automatically inheriting all child Suburbs) is OPEN for future business decision.
2. **Scheduling / Availability Matching**: Flagged as OPEN until formal calendar/intake scheduling requirements are defined.
3. **Selection Limits**: Default technical limit of 20 tradies per selection payload.
