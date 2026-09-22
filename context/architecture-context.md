# Architecture Context

## Product
Local Pages / Tredies is a web-only local services marketplace connecting customers with tradies.

## Recommended baseline
- Backend: Laravel
- PHP: 8.3+
- Database: MySQL or PostgreSQL
- REST API
- Laravel authentication/authorization
- Laravel Policies
- Laravel Form Requests
- Laravel API Resources
- Queue: Redis or equivalent
- Real-time chat: Laravel Reverb/WebSockets or equivalent
- Object storage: S3-compatible
- Transactional email provider
- Admin: Laravel-based admin application/panel
- Frontend: React/Next.js or another approved modern web frontend

## High-level architecture

Browser
→ Web Frontend
→ Laravel API
→ Domain/application services
→ SQL database

Supporting services:
- Redis/queue
- Object storage
- Email provider
- WebSocket/realtime service

## Core modules
- Authentication
- Customer profiles
- Tradie onboarding and verification
- Services
- Service questions
- Location master data
- Matching
- Requests
- Tradie selection
- Chat
- Quotes
- Appointments
- Jobs
- Reviews/moderation
- Notifications
- Admin
- Audit logs

## Location hierarchy
State → Council/Municipality → Suburb → Postcode

The application owns this master data.

## Core request lifecycle
Register/Login
→ Select Service
→ Enter Location
→ Answer Questions
→ Submit
→ Match Tradies
→ Select Multiple Tradies
→ Chat
→ Receive Quotes
→ Compare
→ Accept One
→ Other Quotes Auto-Rejected
→ Agree Date/Time
→ Scheduled
→ In Progress
→ Completed
→ Review

## Job lifecycle
Quote Accepted → Scheduled → In Progress → Completed

Only the assigned tradie can mark a job Completed.

## Payments
Payments are currently out of scope.

## SMS
SMS provider integration is currently out of scope.

## Lead distribution
Customer-selected tradies are the current workflow. Automatic lead distribution is deferred.

## Important open architecture decisions
- Exact calendar conflict model
- Exact Scheduled → In Progress trigger
- Production hosting/infrastructure
- Final file upload limits and allowed types
