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

## State Ownership
- **React Context**: Used exclusively for authentication, session, and global UI state.
- **TanStack Query (React Query)**: Used strictly for Server/API state. Do not duplicate server data into React Context.
- **Local React state (`useState`/`useReducer`)**: Used for temporary component state, form state, and UI toggles.

*Note: The Backend API remains the authoritative source of application data.*

## Security & Route Guards
- Frontend route guards improve navigation and UX, but **do not replace backend authorization**. The backend remains the final authority for authorization.

## LocalStorage Token Review
The application stores the Sanctum authentication token in `localStorage` under the key `auth_token`.
- **Storage Strategy**: The token is written to `localStorage` upon successful login inside `AuthProvider`.
- **Request Lifecycle**: The token is retrieved from `localStorage` by the `api-client.ts` class and injected as a `Bearer` token inside the `Authorization` HTTP header for all requests.
- **Revocation**: When `api.post('/auth/logout')` is called, or when the server responds with a `401 Unauthorized` globally triggering `auth:unauthorized`, the token is systematically removed via `localStorage.removeItem('auth_token')`.
- **Logging**: Tokens and credentials are never logged to the console.
- **Security Considerations (Unresolved decision for future phases)**: While `localStorage` provides ease of integration across tabs, it subjects the token to XSS vulnerabilities. An alternative would be using Laravel Sanctum's SPA cookie-based session authentication. Switching to HttpOnly cookies would mitigate XSS token theft but introduces potential CSRF complexities and requires the frontend and backend to share the same top-level domain. This remains an unresolved architectural decision.
