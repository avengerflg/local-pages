# Progress Tracker

## Project
Local Pages / Tradies Services Marketplace

## Current phase
**Phase 13 — Admin Management & Platform Operations (COMPLETE)**

## Overall status

| Phase | Status |
|---|---|
| 1. Laravel project setup | COMPLETE |
| 2. Database migrations | COMPLETE |
| 3. Models + relationships | COMPLETE |
| 4. Authentication | COMPLETE |
| 5. Customer service requests | COMPLETE |
| 6. Tradie matching & selection | COMPLETE |
| 7. Tradie lead dashboard & management | COMPLETE |
| 8. Customer ↔ tradie platform chat | COMPLETE |
| 9. Quotations / Quote management | COMPLETE |
| 10. Appointments & Job lifecycle foundation | COMPLETE |
| 11. Reviews & Ratings | COMPLETE |
| 12. Notifications & Communication | COMPLETE |
| 13. Admin panel | COMPLETE |
| 14. Testing & Hardening | NOT STARTED |
| 15. Security/performance/deployment | NOT STARTED |

## Phase 1 checklist
- [x] Inspect existing repository
- [x] Verify PHP version
- [x] Verify Composer
- [x] Verify Node/npm
- [x] Verify database
- [x] Create/confirm Laravel project
- [x] Configure `.env.example`
- [x] Configure Git
- [x] Configure API foundation
- [x] Create `/api/v1/health`
- [x] Add health endpoint test
- [x] Configure logging
- [x] Configure code formatting/testing
- [x] Create project documentation
- [x] Run tests
- [x] Commit Phase 1

## Phase 2 checklist
- [x] Adapt users table migration (role, mobile, phone verification, status)
- [x] Rename framework queue table to queue_jobs to avoid collision with domain jobs table
- [x] Create customer_profiles migration
- [x] Create tradie_profiles migration
- [x] Create tradie_documents migration
- [x] Create services migration
- [x] Create service_questions migration
- [x] Create service_question_options migration
- [x] Create locations migration (self-referencing hierarchy)
- [x] Create tradie_services migration
- [x] Create tradie_service_areas migration
- [x] Create tradie_availability migration
- [x] Create service_requests migration
- [x] Create request_answers migration
- [x] Create request_attachments migration
- [x] Create request_tradies migration
- [x] Create conversations migration
- [x] Create messages migration
- [x] Create message_attachments migration
- [x] Create quotes migration
- [x] Create quote_attachments migration
- [x] Create appointments migration
- [x] Create jobs migration (marketplace domain entity)
- [x] Create reviews migration with rating 1-5 constraint
- [x] Create review_responses migration
- [x] Create review_reports migration
- [x] Create notifications migration
- [x] Create audit_logs migration
- [x] Verify migrate:fresh against local MySQL
- [x] Verify migrate:status lists all 29 migrations
- [x] Run tests (php artisan test)
- [x] Run Pint code style check (./vendor/bin/pint --test)
- [x] Document schema in context/database-schema.md
- [x] Commit Phase 2

## Phase 3 checklist
- [x] Update User model with marketplace relationships and mass assignment protection
- [x] Create all 26 marketplace domain and pivot Eloquent models
- [x] Configure explicit foreign keys matching Phase 2 schema
- [x] Configure attribute casts (integers, booleans, dates, datetimes, decimals, json arrays)
- [x] Create Model Factories for core testing entities
- [x] Implement comprehensive model relationship feature tests (17 tests, 36 assertions)
- [x] Run test suite and verify 100% pass (20 tests, 40 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document models in context/model-map.md
- [x] Commit Phase 3

## Phase 4 checklist
- [x] Install and configure Laravel Sanctum
- [x] Migrate personal_access_tokens table
- [x] Update User model with HasApiTokens, MustVerifyEmail, and role helper methods
- [x] Implement Form Requests with normalization (RegisterCustomerRequest, RegisterTradieRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest)
- [x] Implement API Resources (UserResource, CustomerProfileResource, TradieProfileResource, AuthResponseResource)
- [x] Implement EnsureUserHasRole middleware and alias in bootstrap/app.php
- [x] Implement AuthController (registerCustomer, registerTradie, login, logout, me) with DB transactions
- [x] Implement EmailVerificationController (signed URL verify, resend)
- [x] Implement PasswordResetController (forgotPassword, resetPassword)
- [x] Configure /api/v1/auth routes with rate limiters (throttle:10,1 / throttle:6,1 / throttle:5,1)
- [x] Add cryptographic signed URL validation, expiration enforcement, and authenticated cross-account verification protection
- [x] Write comprehensive Feature tests in tests/Feature/AuthTest.php (19 tests covering all authentication & security flows)
- [x] Verify 100% test pass rate across full test suite (39 tests, 135 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document authentication architecture in context/authentication-context.md
- [x] Commit Phase 4 (commit `d85ae79`)

## Phase 5 checklist
- [x] Create API Resources (ServiceResource, ServiceQuestionResource, ServiceQuestionOptionResource, LocationResource, RequestAnswerResource, RequestAttachmentResource, ServiceRequestResource)
- [x] Create CreateServiceRequestAction encapsulating question validation, conditional rules, and transactional persistence
- [x] Create CreateServiceRequestRequest form request with customer authorization and file validation
- [x] Create ServiceController for active services and question discovery
- [x] Create ServiceRequestController for creating and scoping customer requests
- [x] Register API routes (/api/v1/services, /api/v1/services/{service}, /api/v1/service-requests)
- [x] Write comprehensive Feature tests in tests/Feature/ServiceRequestTest.php (18 tests covering discovery, answers, conditional rules, attachments, scoping, security)
- [x] Verify 100% test pass rate across full test suite (58 tests, 200 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document request intake architecture in context/service-request-context.md
- [x] Commit Phase 5

## Phase 6 checklist
- [x] Create FindMatchingTradiesAction (matching by service, active location hierarchy / postcode, and verified tradie eligibility)
- [x] Create SelectMatchingTradiesAction (atomic customer selection and request_tradies persistence)
- [x] Create SelectMatchingTradiesRequest form request with customer authorization
- [x] Create API Resources (MatchingTradieResource, RequestTradieResource)
- [x] Create MatchingController (matchingTradies and selectTradies endpoints)
- [x] Register API routes (/api/v1/service-requests/{id}/matching-tradies GET & POST)
- [x] Write comprehensive Feature tests in tests/Feature/TradieMatchingTest.php (13 tests covering service matching, location matching, eligibility, customer selection, empty states, security)
- [x] Verify 100% test pass rate across full test suite (74 tests, 240 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document matching architecture in context/tradie-matching-context.md
- [x] Commit Phase 6

## Phase 7 checklist
- [x] Create GetTradieLeadsAction (paginated retrieval of authenticated tradie's assigned leads)
- [x] Create GetTradieLeadDetailAction (scoped retrieval of single lead with answers, attachments, and customer details)
- [x] Create API Resources (TradieLeadResource, TradieLeadDetailResource)
- [x] Create TradieLeadController (index and show actions)
- [x] Register API routes (/api/v1/tradie/leads GET & /api/v1/tradie/leads/{id} GET with auth:sanctum and role:tradie)
- [x] Write comprehensive Feature tests in tests/Feature/TradieLeadManagementTest.php (8 tests covering auth, multi-tenant scoping, pagination, answers, attachments, security)
- [x] Verify 100% test pass rate across full test suite (83 tests, 291 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document tradie leads architecture in context/tradie-leads-context.md
- [x] Commit Phase 7

## Phase 8 checklist
- [x] Create GetConversationsAction (paginated listing of user conversations with recent message previews)
- [x] Create GetOrCreateConversationAction (authorized, idempotent conversation initiation)
- [x] Create GetConversationMessagesAction (scoped conversation detail and chronological paginated message history)
- [x] Create SendMessageAction (transactional message sending with file attachment processing and timestamp tracking)
- [x] Create Form Requests (CreateConversationRequest, SendMessageRequest)
- [x] Create API Resources (ConversationResource, ConversationDetailResource, MessageResource, MessageAttachmentResource)
- [x] Create ConversationController
- [x] Register API routes (/api/v1/conversations, /api/v1/conversations/{id}, /api/v1/conversations/{id}/messages)
- [x] Write comprehensive Feature tests in tests/Feature/ChatTest.php (21 tests covering auth, participant authorization, message exchange, attachments metadata, empty validation, security)
- [x] Verify 100% test pass rate across full test suite (104 tests, 386 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document chat architecture in context/chat-context.md
- [x] Commit Phase 8

## Phase 9 checklist
- [x] Create CreateQuoteAction (tradie quote creation with request_tradies authorization, eligibility check, and private attachment handling)
- [x] Create GetCustomerQuotesAction (paginated retrieval of quotes for customer's service request)
- [x] Create GetQuoteDetailAction (scoped retrieval of single quote for customer or tradie author)
- [x] Create AcceptQuoteAction (atomic quote acceptance, pessimistic lock, auto-rejection of pending quotes, and quote_accepted status transition)
- [x] Create RejectQuoteAction (explicit individual quote rejection)
- [x] Create Form Request CreateQuoteRequest with validation rules
- [x] Create API Resources (QuoteResource, QuoteDetailResource, QuoteAttachmentResource)
- [x] Create QuoteController
- [x] Register API routes (/api/v1/service-requests/{id}/quotes, /api/v1/quotes/{id}, /api/v1/quotes/{id}/accept, /api/v1/quotes/{id}/reject)
- [x] Write comprehensive Feature tests in tests/Feature/QuoteManagementTest.php (18 tests covering tradie submission, customer comparison, single view authorization, atomic acceptance, cascading rejection, input validation, and privacy)
- [x] Verify 100% test pass rate across full test suite (122 tests, 485 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document quote architecture in context/quotes-context.md
- [x] Commit Phase 9

## Phase 10 checklist
- [x] Create CreateAppointmentAction (atomic appointment & job creation on quote_accepted request)
- [x] Create GetAppointmentDetailAction (scoped retrieval of appointment for customer or assigned tradie)
- [x] Create GetJobDetailAction (scoped retrieval of job for assigned tradie or customer)
- [x] Create StartJobAction (tradie start job transition from scheduled to in_progress)
- [x] Create CompleteJobAction (tradie complete job transition from in_progress to completed)
- [x] Create CreateAppointmentRequest form request with validation
- [x] Create API Resources (AppointmentResource, JobResource)
- [x] Create Controllers (AppointmentController, JobController)
- [x] Register API routes (/api/v1/service-requests/{id}/appointments, /api/v1/appointments/{id}, /api/v1/jobs/{id}, /api/v1/jobs/{id}/start, /api/v1/jobs/{id}/complete)
- [x] Write comprehensive Feature tests in tests/Feature/AppointmentAndJobLifecycleTest.php (11 tests covering creation, authorization, start, complete, invalid state transitions, and duplicate prevention)
- [x] Verify 100% test pass rate across full test suite (133 tests, 566 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document appointment and job architecture in context/appointments-context.md and context/jobs-context.md
- [x] Commit Phase 10

## Phase 11 checklist
- [x] Confirm reviews schema (job_id UNIQUE, moderation_status vocabulary, review_responses UNIQUE review_id)
- [x] Create CreateReviewAction (DB::transaction + lockForUpdate, server-side customer_id/tradie_id, eligibility check, duplicate check)
- [x] Create GetTradieReviewsAction (approved-only public listing, paginated)
- [x] Create RespondToReviewAction (ownership check, one-response enforcement, lockForUpdate)
- [x] Create AdminGetPendingReviewsAction (paginated pending listing)
- [x] Create AdminApproveReviewAction (pending → approved, records published_at)
- [x] Create AdminRejectReviewAction (pending/flagged → rejected, records removed_at, soft-removal)
- [x] Create StoreReviewRequest (rating: 1-5 integer, review_text: required string max:10000)
- [x] Create StoreReviewResponseRequest (response_text: required string max:10000)
- [x] Create ReviewResource (public fields only; no moderation internals)
- [x] Create ReviewResponseResource (public fields)
- [x] Create AdminReviewResource (includes moderation_status, published_at, removed_at)
- [x] Create ReviewController (6 thin methods delegating to actions)
- [x] Register Phase 11 API routes (6 routes: customer store, tradie respond, public listing, admin 3)
- [x] Write ReviewManagementTest.php (28 tests, 67 assertions covering all auth paths, visibility, eligibility, duplicate prevention, moderation, response cardinality, immutability)
- [x] Verify 100% test pass rate across full suite (161 tests, 633 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document review architecture in context/reviews-context.md
- [x] No new migrations required (schema from Phase 2 is sufficient)
- [x] review_reports left unused — documented as OPEN
- [x] Commit Phase 11

## Phase 12 checklist
- [x] Confirm notifications schema (`notifications`: user_id, type, title, body, data, read_at, timestamps)
- [x] Create CreateNotificationAction (central trusted synchronous notification creator with server-side recipient derivation)
- [x] Create GetNotificationsAction (paginated newest-first listing scoped to authenticated user)
- [x] Create MarkNotificationReadAction (idempotent mark read with tenant isolation)
- [x] Create MarkAllNotificationsReadAction (bulk mark all unread notifications read for authenticated user)
- [x] Integrate notification triggers into existing domain actions (`tradie_selected`, `new_message`, `new_quote`, `quote_accepted`, `quote_rejected`, `appointment_scheduled`, `job_started`, `job_completed`, `review_submitted`, `review_approved`, `review_rejected`, `review_responded`)
- [x] Create NotificationResource (sanitized user-facing representation with dynamic is_read calculation)
- [x] Create NotificationController (index, show, unreadCount, markRead, markAllRead)
- [x] Register Phase 12 API routes (`/api/v1/notifications`, `unread-count`, `read-all`, `{id}`, `{id}/read`)
- [x] Create NotificationFactory
- [x] Write NotificationInboxTest.php (9 tests covering auth, tenant isolation, unread counting, pagination, single show, idempotent mark read, bulk mark all read, spoofing protection)
- [x] Write NotificationEventTest.php (14 tests covering all 12 domain trigger events, payload integrity, and rollback atomicity)
- [x] Verify 100% test pass rate across full suite (185 tests, 721 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document notifications architecture in context/notifications-context.md
- [x] Auto-rejected quotes notification and push/SMS delivery channels documented as OPEN
- [x] Commit Phase 12

## Phase 13 checklist
- [x] Create LogAuditAction (centralized transactional audit logging)
- [x] Implement User Management actions & endpoints (GetAdminUsersAction, GetAdminUserDetailAction, UpdateUserStatusAction)
- [x] Implement self-deactivation guard for administrators (HTTP 422)
- [x] Implement Tradie & Document Administration actions & endpoints (GetAdminTradiesAction, GetAdminTradieDetailAction, UpdateTradieVerificationAction, GetAdminTradieDocumentsAction, UpdateTradieDocumentStatusAction)
- [x] Implement Service Catalog & Questionnaire actions & endpoints (GetAdminServicesAction, CreateServiceAction, UpdateServiceAction, UpdateServiceStatusAction, GetAdminServiceQuestionsAction, CreateServiceQuestionAction, UpdateServiceQuestionAction, CreateQuestionOptionAction, UpdateQuestionOptionAction)
- [x] Implement Location Management with strict geographic hierarchy validation (`state` → `council` → `suburb` → `postcode`)
- [x] Implement Platform Operations Dashboard (GetAdminDashboardAction with operational counts, no financial data)
- [x] Connect audit logging to existing Phase 11 review moderation actions (AdminApproveReviewAction, AdminRejectReviewAction)
- [x] Create Form Requests with strict validation across all mutation endpoints
- [x] Create sanitized Admin API Resources omitting passwords, tokens, credentials, and private storage paths
- [x] Register all Phase 13 admin endpoints under `auth:sanctum` and `role:admin`
- [x] Write comprehensive Feature tests in tests/Feature/AdminManagementTest.php (13 tests, 117 assertions)
- [x] Verify 100% test pass rate across full test suite (198 tests, 838 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document admin architecture in context/admin-context.md
- [x] Complete Phase 13

## Phase 14 checklist
- [x] Implement Tradie Profile self-service endpoints (`GET /api/v1/tradie/profile`, `PUT/PATCH /api/v1/tradie/profile`)
- [x] Implement Whitelist filtering on profile updates to protect `verification_status`, `verified_at`, `user_id`, and `role`
- [x] Implement Tradie Services self-service endpoints (`GET`, `POST`, `PUT`, `DELETE /api/v1/tradie/services`)
- [x] Enforce active service requirement and prevent inactive service attachment
- [x] Implement Tradie Service Areas self-service endpoints (`GET`, `POST`, `PUT`, `DELETE /api/v1/tradie/service-areas`)
- [x] Enforce active location requirement and prevent inactive location attachment
- [x] Implement Tradie Verification Document self-service endpoints (`GET`, `POST`, `DELETE /api/v1/tradie/documents`)
- [x] Enforce private document storage with non-exposed file paths, MIME verification, and max 10MB file limit
- [x] Enforce document deletion rules (pending and rejected documents can be deleted; approved documents cannot be deleted)
- [x] Implement Tradie Availability self-service endpoints (`GET`, `POST`, `PUT/PATCH`, `DELETE /api/v1/tradie/availability`)
- [x] Support weekly schedule slots (`day_of_week`, `start_time`, `end_time`) and date blackout overrides (`specific_date`, `is_available`, `notes`)
- [x] Implement Tradie Onboarding Status summary endpoint (`GET /api/v1/tradie/onboarding-status`)
- [x] Enforce strict multi-tenant IDOR protection across all self-service resources
- [x] Create dedicated Form Requests and API Resources
- [x] Write comprehensive Feature tests in `tests/Feature/TradieProfileManagementTest.php` (16 tests, 135 assertions)
- [x] Verify 100% test pass rate across full regression test suite (214 tests, 973 assertions)
- [x] Run Laravel Pint code style verification (passed)
- [x] Document onboarding architecture in `context/tradie-onboarding-context.md`
- [x] Complete Phase 14

## Rules for updating this file
The AI agent must update this tracker after each completed phase.

Use:
- NOT STARTED
- IN PROGRESS
- BLOCKED
- COMPLETE

Do not mark a phase COMPLETE unless its acceptance criteria have been verified.

## Open decisions
- Calendar conflict handling
- Scheduled → In Progress trigger
- File limits/types
- Review moderation details
- Future automatic lead distribution
- Production infrastructure
- Auto-rejected quotes notification
- Push and SMS delivery channels
- Destructive catalog / location cascading deletion
- Controlled binary document streaming downloads
