# Frontend Integration API Contract

## Authentication Flow
1. Users register as customer or tradie via `/api/v1/auth/register/*`.
2. Login at `/api/v1/auth/login` to receive a `token` (Sanctum).
3. Include the token as a Bearer token in the `Authorization` header for all protected endpoints.
4. Email verification may be required; the user receives a link with a signed hash that hits `/api/v1/auth/email/verify/{id}/{hash}`.

## Validation & Errors
All validation errors return `422 Unprocessable Entity` with a standard JSON body:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Error message."]
  }
}
```
Authentication failures return `401 Unauthorized`.
Authorization failures return `403 Forbidden`.
Resource not found returns `404 Not Found`.

## Resources & Pagination
Collections are paginated and return `data`, `meta`, and `links`.
Dates/timestamps are generally standard MySQL strings (e.g., `2026-09-28 10:00:00`) unless modified by the frontend parser.
Decimals (like quote amounts) may return as strings depending on DB driver. Convert them to floats securely on the client.

## Notifications
Notifications can be fetched from `/api/v1/notifications`. A new unread notification will increment the count in `/api/v1/notifications/unread-count`.

## Chat
Realtime Reverb/websockets are currently NOT implemented.
Clients must poll `GET /api/v1/conversations/{id}/messages` to receive new messages.

## Attachments
File uploads return attachment IDs. Do not build direct storage URLs.
To download a file, the frontend must GET the specific entity (e.g. quote, message, request) which includes the pre-signed temporary `download_url`.
Direct calls to `/api/v1/files/{type}/{id}` without a valid signature will fail with `403`.

## Appointment & Job Lifecycle
- **Status workflow:**
  - Quote `pending` -> `accepted`.
  - ServiceRequest `draft` -> `submitted` -> `quote_accepted` -> `completed` / `cancelled`.
  - Job `scheduled` -> `in_progress` -> `completed` / `cancelled`.
- Customers and tradies can `POST /api/v1/jobs/{id}/cancel` to cancel a scheduled job.
- Only completed jobs can receive reviews.
