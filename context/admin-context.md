# Admin Management & Platform Operations Context

## Overview
Phase 13 establishes the administrative backend architecture, security boundaries, domain actions, and REST APIs required for platform operators to manage marketplace users, tradies, documents, service catalogs, intake questionnaires, geographic hierarchies, audit trails, and platform operational metrics.

---

## Key Invariants & Architectural Rules

1. **Unified Admin Authorization**:
   - Every administrative endpoint is prefixed with `/api/v1/admin` and guarded by `auth:sanctum` and `role:admin`.
   - Customers, tradies, and unauthenticated users are strictly blocked with HTTP 401 or HTTP 403.
   - Admin actor identity is always derived server-side from `auth()->user()`.

2. **Transactional Audit Logging**:
   - Material administrative mutations create an audit trail in the `audit_logs` table via `LogAuditAction`.
   - Audit logging runs within the same database transaction as the primary mutation, guaranteeing that failed mutations roll back and never persist false audit entries.
   - Sensitive fields (passwords, tokens, credentials, private file paths) are strictly excluded from audit payloads.

3. **User Account Administration**:
   - `GET /api/v1/admin/users`: Paginated list filterable by `role` (`customer`, `tradie`, `admin`) and `status` (`active`, `suspended`, `pending`), searchable by name, email, or mobile.
   - `GET /api/v1/admin/users/{id}`: Detailed user profile without exposing sensitive fields (`password`, `remember_token`, access tokens).
   - `PATCH /api/v1/admin/users/{id}/status`: Validated status transition. Admin self-deactivation is strictly rejected with HTTP 422 to prevent platform lockout.

4. **Tradie Verification & Document Management**:
   - `GET /api/v1/admin/tradies`: Paginated list filterable by `verification_status` (`pending`, `verified`, `rejected`, `under_review`) and user account status.
   - `GET /api/v1/admin/tradies/{id}`: Full profile including services, service areas, availability, and document counts.
   - `PATCH /api/v1/admin/tradies/{id}/verification`: Update verification status with automatic `verified_at` timestamp setting on approval.
   - `GET /api/v1/admin/tradies/{id}/documents`: Metadata-only document listing. Private storage filesystem paths are omitted.
   - `PATCH /api/v1/admin/tradie-documents/{id}/status`: Review document metadata (`pending`, `approved`, `rejected`), recording `reviewed_by` and `reviewed_at`.

5. **Service Catalog & Questionnaire Management**:
   - `services`: Full admin CRUD and status activation/deactivation (`active`, `inactive`). Unique slugs auto-generated or validated.
   - `service_questions`: Ordered intake question management (`multiple_choice`, `single_choice`, `text`, `file_upload`, `image_upload`) with support for conditional rules.
   - `service_question_options`: Option choices for single/multiple choice questions with sort orders.

6. **Geographic Hierarchy Enforcement**:
   - Strict application-owned hierarchy: `state` (null parent) → `council` (state parent) → `suburb` (council parent) → `postcode` (suburb parent).
   - Parent relationships are strictly validated against expected parent types; invalid parent attachments are rejected with HTTP 422.

7. **Platform Operations Dashboard**:
   - `GET /api/v1/admin/dashboard`: Read-only aggregated counts for operational monitoring across users, tradies, service requests, quotes, appointments, jobs, reviews, and services.
   - Financial metrics (revenue, payouts, commissions, invoices) are strictly omitted.

---

## Endpoint Catalog

| Method | URI | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | `auth:sanctum`, `role:admin` | Retrieve operational platform summary statistics. |
| `GET` | `/api/v1/admin/users` | `auth:sanctum`, `role:admin` | List platform users with filters and search. |
| `GET` | `/api/v1/admin/users/{id}` | `auth:sanctum`, `role:admin` | View single user profile details. |
| `PATCH` | `/api/v1/admin/users/{id}/status` | `auth:sanctum`, `role:admin` | Update user status (active, suspended, pending). |
| `GET` | `/api/v1/admin/tradies` | `auth:sanctum`, `role:admin` | List tradie profiles with filters and search. |
| `GET` | `/api/v1/admin/tradies/{id}` | `auth:sanctum`, `role:admin` | View full tradie profile details. |
| `PATCH` | `/api/v1/admin/tradies/{id}/verification` | `auth:sanctum`, `role:admin` | Update tradie verification status. |
| `GET` | `/api/v1/admin/tradies/{id}/documents` | `auth:sanctum`, `role:admin` | List document metadata for a tradie. |
| `PATCH` | `/api/v1/admin/tradie-documents/{id}/status` | `auth:sanctum`, `role:admin` | Review document status (approved/rejected). |
| `GET` | `/api/v1/admin/services` | `auth:sanctum`, `role:admin` | List services catalog. |
| `POST` | `/api/v1/admin/services` | `auth:sanctum`, `role:admin` | Create a new service. |
| `GET` | `/api/v1/admin/services/{id}` | `auth:sanctum`, `role:admin` | View service details with questions. |
| `PATCH` | `/api/v1/admin/services/{id}` | `auth:sanctum`, `role:admin` | Update service details. |
| `PATCH` | `/api/v1/admin/services/{id}/status` | `auth:sanctum`, `role:admin` | Activate or deactivate a service. |
| `GET` | `/api/v1/admin/services/{id}/questions` | `auth:sanctum`, `role:admin` | List questions for a service. |
| `POST` | `/api/v1/admin/services/{id}/questions` | `auth:sanctum`, `role:admin` | Create an intake question for a service. |
| `GET` | `/api/v1/admin/service-questions/{id}` | `auth:sanctum`, `role:admin` | View single question with options. |
| `PATCH` | `/api/v1/admin/service-questions/{id}` | `auth:sanctum`, `role:admin` | Update question details. |
| `POST` | `/api/v1/admin/service-questions/{id}/options` | `auth:sanctum`, `role:admin` | Add choice option to a question. |
| `PATCH` | `/api/v1/admin/service-question-options/{id}` | `auth:sanctum`, `role:admin` | Update choice option. |
| `GET` | `/api/v1/admin/locations` | `auth:sanctum`, `role:admin` | List locations with hierarchy filters. |
| `POST` | `/api/v1/admin/locations` | `auth:sanctum`, `role:admin` | Create location with hierarchy validation. |
| `GET` | `/api/v1/admin/locations/{id}` | `auth:sanctum`, `role:admin` | View location details. |
| `PATCH` | `/api/v1/admin/locations/{id}` | `auth:sanctum`, `role:admin` | Update location details. |
| `PATCH` | `/api/v1/admin/locations/{id}/status` | `auth:sanctum`, `role:admin` | Activate or deactivate a location. |
| `GET` | `/api/v1/admin/reviews` | `auth:sanctum`, `role:admin` | List pending reviews (Phase 11). |
| `POST` | `/api/v1/admin/reviews/{id}/approve` | `auth:sanctum`, `role:admin` | Approve pending review (Phase 11). |
| `POST` | `/api/v1/admin/reviews/{id}/reject` | `auth:sanctum`, `role:admin` | Reject review (Phase 11). |

---

## Open Decisions (Documented)
1. **Destructive Catalog/Location Deletion**: Destructive deletion of services, questions, or locations that may have foreign key dependencies in existing requests remains OPEN; safe deactivation (`status = 'inactive'`) is provided.
2. **Direct Document Binary Download**: Streaming binary document downloads via signed temporary links remains OPEN; metadata access is provided.
3. **Role Elevation & Reassignment**: Assigning or altering user roles via API endpoints remains OPEN.
