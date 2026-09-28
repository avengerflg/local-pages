# Frontend Architecture
This document details the frontend configuration and setup for Local Pages.
## Stack
- Next.js (App Router)
- React, TypeScript, Tailwind CSS
## Environment
Set `NEXT_PUBLIC_API_URL` to point to the Laravel backend.
## API Client
We use a centralized fetch client located in `lib/api-client.ts` to manage Sanctum token injection, 401/403/422 responses, and base URL resolution.
## Authentication
Provided by `providers/auth-provider.tsx` and protected at the route level via `components/ui/RoleGuard.tsx`.
