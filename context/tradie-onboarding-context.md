# Tradie Self-Service Onboarding & Business Profile Context

## Overview
Phase 14 implements self-service backend capabilities for authenticated tradespeople (`role = 'tradie'`) to manage their business profile, configure offered services, establish geographic service coverage, upload verification documents, configure weekly availability slots & blackout dates, view verification status, and inspect component-level onboarding completeness.

---

## Key Invariants & Architectural Rules

1. **Strict Multi-Tenant Scoping (IDOR Protection)**:
   - All tradie self-service operations derive `tradie_id` directly from `$request->user()->tradieProfile->id`.
   - The platform **never** accepts `tradie_id` or `user_id` from request payloads or route parameters for ownership determination.
   - Operations referencing specific entities (documents, availability slots, attached services, attached service areas) verify ownership and return HTTP 404 on mismatched tradie records.

2. **Tradie Profile Self-Service**:
   - `GET /api/v1/tradie/profile`: Returns authenticated tradie profile attributes.
   - `PUT/PATCH /api/v1/tradie/profile`: Allows updating `business_name`, `abn`, `phone`, `email`, `website`, `address`, `suburb`, `state`, `postcode`.
   - Whitelist enforcement strictly ignores/prevents modification of `verification_status`, `verified_at`, `user_id`, or `role`.

3. **Tradie Services Management**:
   - `GET /api/v1/tradie/services`: Returns services offered by the tradie.
   - `POST /api/v1/tradie/services`: Attaches a single active service (`service_id`). Inactive services are rejected with HTTP 422.
   - `PUT /api/v1/tradie/services`: Synchronizes active services (`service_ids: [1, 2]`).
   - `DELETE /api/v1/tradie/services/{id}`: Detaches a service from the tradie profile. Attempting to detach an unattached service returns HTTP 404.

4. **Tradie Service Areas Management**:
   - `GET /api/v1/tradie/service-areas`: Returns covered locations.
   - `POST /api/v1/tradie/service-areas`: Attaches an active location (`location_id`). Inactive locations are rejected with HTTP 422.
   - `PUT /api/v1/tradie/service-areas`: Synchronizes coverage locations (`location_ids: [1, 2]`).
   - `DELETE /api/v1/tradie/service-areas/{id}`: Detaches a location from the tradie profile.

5. **Document Verification & Deletion Rules**:
   - `GET /api/v1/tradie/documents`: Lists metadata of documents uploaded by the tradie (omitting internal filesystem paths).
   - `POST /api/v1/tradie/documents`: Uploads verification documents (PDF, JPG, PNG, max 10MB) stored on private disk storage with initial status `'pending'`.
   - `DELETE /api/v1/tradie/documents/{id}`:
     - Tradies can delete `'pending'` or `'rejected'` documents.
     - Tradies **cannot** delete `'approved'` documents (rejected with HTTP 422).
     - Deletion securely purges both the private physical file and the database record.

6. **Availability & Blackout Schedules**:
   - `GET /api/v1/tradie/availability`: Returns weekly schedule slots and date overrides.
   - `POST /api/v1/tradie/availability`: Creates recurring weekly slot (`day_of_week` 0-6, `start_time`, `end_time`) or date blackout override (`specific_date`, `is_available`, `notes`).
   - `PUT/PATCH /api/v1/tradie/availability/{id}`: Updates existing slot or override.
   - `DELETE /api/v1/tradie/availability/{id}`: Deletes slot or override.

7. **Onboarding Status Summary**:
   - `GET /api/v1/tradie/onboarding-status`: Returns component-level counts and status flags:
     - `services` (`configured`, `count`)
     - `service_areas` (`configured`, `count`)
     - `documents` (`uploaded`, `count`)
     - `verification` (`status`)
     - `availability` (`configured`, `count`)

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/tradie/profile` | `auth:sanctum`, `role:tradie` | Retrieve authenticated tradie's business profile. |
| `PUT/PATCH` | `/api/v1/tradie/profile` | `auth:sanctum`, `role:tradie` | Update authenticated tradie's business profile. |
| `GET` | `/api/v1/tradie/services` | `auth:sanctum`, `role:tradie` | List services offered by the tradie. |
| `POST` | `/api/v1/tradie/services` | `auth:sanctum`, `role:tradie` | Attach an active service to profile. |
| `PUT` | `/api/v1/tradie/services` | `auth:sanctum`, `role:tradie` | Synchronize active services. |
| `DELETE` | `/api/v1/tradie/services/{id}` | `auth:sanctum`, `role:tradie` | Detach a service from profile. |
| `GET` | `/api/v1/tradie/service-areas` | `auth:sanctum`, `role:tradie` | List locations covered by the tradie. |
| `POST` | `/api/v1/tradie/service-areas` | `auth:sanctum`, `role:tradie` | Attach an active location to coverage. |
| `PUT` | `/api/v1/tradie/service-areas` | `auth:sanctum`, `role:tradie` | Synchronize coverage locations. |
| `DELETE` | `/api/v1/tradie/service-areas/{id}` | `auth:sanctum`, `role:tradie` | Detach a location from coverage. |
| `GET` | `/api/v1/tradie/documents` | `auth:sanctum`, `role:tradie` | List tradie uploaded documents metadata. |
| `POST` | `/api/v1/tradie/documents` | `auth:sanctum`, `role:tradie` | Upload verification document. |
| `DELETE` | `/api/v1/tradie/documents/{id}` | `auth:sanctum`, `role:tradie` | Delete pending/rejected document. |
| `GET` | `/api/v1/tradie/availability` | `auth:sanctum`, `role:tradie` | List weekly slots & date overrides. |
| `POST` | `/api/v1/tradie/availability` | `auth:sanctum`, `role:tradie` | Create weekly slot or date override. |
| `PUT/PATCH` | `/api/v1/tradie/availability/{id}` | `auth:sanctum`, `role:tradie` | Update availability slot or override. |
| `DELETE` | `/api/v1/tradie/availability/{id}` | `auth:sanctum`, `role:tradie` | Delete availability slot or override. |
| `GET` | `/api/v1/tradie/onboarding-status` | `auth:sanctum`, `role:tradie` | Retrieve component-level onboarding checklist. |

---

## Open Decisions (Preserved)
1. **Re-verification Transition Trigger**: Whether uploading a replacement document automatically changes `verification_status` from `rejected` to `under_review` remains OPEN; status is currently left unchanged after document upload.
2. **Controlled Binary Document Download**: Direct streaming downloads via temporary signed links remain OPEN; metadata access is provided.
3. **Calendar Conflicts & Sync**: Calendar synchronization (Google/Outlook) and locking engines remain OPEN.
