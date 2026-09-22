# Database Schema Documentation

## Database System
- Engine: MySQL 9.3+ (InnoDB)
- Character set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`

---

## Tables Overview

The marketplace schema consists of **27 domain entities** plus standard framework infrastructure tables (`migrations`, `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `queue_jobs`, `job_batches`, `failed_jobs`).

| # | Table Name | Purpose | Key Relationships |
|---|---|---|---|
| 1 | `users` | Core user identity & authentication (customer, tradie, admin) | 1:1 `customer_profiles`, 1:1 `tradie_profiles` |
| 2 | `customer_profiles` | Customer address and postal details | Belongs to `users` |
| 3 | `tradie_profiles` | Tradie business details, ABN, contact information & verification status | Belongs to `users` |
| 4 | `tradie_documents` | Verification documents metadata (licences, insurance, identity) | Belongs to `tradie_profiles`, reviewer in `users` |
| 5 | `services` | Marketplace service catalog | Has many `service_questions`, `tradie_services` |
| 6 | `service_questions` | Service-specific configurable intake questions | Belongs to `services`, has many options |
| 7 | `service_question_options` | Predefined choices for multiple/single choice questions | Belongs to `service_questions` |
| 8 | `locations` | Geographic hierarchy (State → Council → Suburb → Postcode) | Self-referencing parent-child |
| 9 | `tradie_services` | Pivot table linking tradies to services offered | `tradie_profiles` ↔ `services` |
| 10 | `tradie_service_areas` | Pivot table linking tradies to served locations | `tradie_profiles` ↔ `locations` |
| 11 | `tradie_availability` | Tradie availability slots and blackout dates | Belongs to `tradie_profiles` |
| 12 | `service_requests` | Customer job requests | Belongs to `users` (customer), `services`, `locations` |
| 13 | `request_answers` | Customer responses to service questions | Belongs to `service_requests`, `service_questions` |
| 14 | `request_attachments` | Files and photos attached to service requests | Belongs to `service_requests` |
| 15 | `request_tradies` | Tradies selected by customer for a request | `service_requests` ↔ `tradie_profiles` |
| 16 | `conversations` | 1-to-1 platform communication channels | Belongs to `service_requests`, `users`, `tradie_profiles` |
| 17 | `messages` | Chat messages exchanged within conversations | Belongs to `conversations`, `users` (sender) |
| 18 | `message_attachments` | File and image attachments sent in chat messages | Belongs to `messages` |
| 19 | `quotes` | Formal price estimates issued by tradies | Belongs to `service_requests`, `tradie_profiles` |
| 20 | `quote_attachments` | Specification sheets, estimates or brochures attached to quotes | Belongs to `quotes` |
| 21 | `appointments` | Scheduled job dates and time windows | Belongs to `service_requests`, `quotes`, `users`, `tradie_profiles` |
| 22 | `jobs` | Executed work tracking (`scheduled` → `in_progress` → `completed`) | Belongs to `service_requests`, `appointments`, `tradie_profiles` |
| 23 | `reviews` | Customer ratings (1-5) and feedback on completed jobs | Belongs to `jobs`, `users` (customer), `tradie_profiles` |
| 24 | `review_responses` | Tradie public responses to customer reviews | Belongs to `reviews`, `tradie_profiles` |
| 25 | `review_reports` | Moderation flags and dispute reports on reviews | Belongs to `reviews`, `users` (reporter, resolver) |
| 26 | `notifications` | In-app user notifications | Belongs to `users` |
| 27 | `audit_logs` | Security and administrative audit trail | Belongs to `users` (actor, nullable) |

---

## Detailed Table Specifications

### 1. `users`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `role`: VARCHAR(20) DEFAULT 'customer' INDEX (values: `customer`, `tradie`, `admin`)
  - `name`: VARCHAR(255)
  - `email`: VARCHAR(255) UNIQUE
  - `email_verified_at`: TIMESTAMP NULL
  - `mobile`: VARCHAR(30) NULL UNIQUE
  - `phone_verified_at`: TIMESTAMP NULL
  - `password`: VARCHAR(255)
  - `status`: VARCHAR(20) DEFAULT 'active' INDEX (values: `active`, `suspended`, `pending`)
  - `remember_token`: VARCHAR(100) NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Notes**: Adapts framework user table with role, mobile verification state, and account status.

### 2. `customer_profiles`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `user_id`: BIGINT UNSIGNED UNIQUE (FK → `users.id` ON DELETE CASCADE)
  - `postcode`: VARCHAR(10) NULL INDEX
  - `address`: VARCHAR(255) NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 3. `tradie_profiles`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `user_id`: BIGINT UNSIGNED UNIQUE (FK → `users.id` ON DELETE CASCADE)
  - `business_name`: VARCHAR(255) INDEX
  - `abn`: VARCHAR(20) NULL INDEX
  - `phone`: VARCHAR(30) NULL
  - `email`: VARCHAR(255) NULL
  - `website`: VARCHAR(255) NULL
  - `address`: VARCHAR(255) NULL
  - `suburb`: VARCHAR(255) NULL
  - `state`: VARCHAR(10) NULL
  - `postcode`: VARCHAR(10) NULL INDEX
  - `verification_status`: VARCHAR(30) DEFAULT 'pending' INDEX (values: `pending`, `verified`, `rejected`, `under_review`)
  - `verified_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 4. `tradie_documents`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE CASCADE)
  - `document_type`: VARCHAR(50) INDEX (e.g. `identity`, `business_registration`, `licence`, `insurance`)
  - `file_path`: VARCHAR(255)
  - `original_name`: VARCHAR(255)
  - `mime_type`: VARCHAR(100)
  - `file_size`: BIGINT UNSIGNED
  - `status`: VARCHAR(30) DEFAULT 'pending' INDEX (values: `pending`, `approved`, `rejected`)
  - `reviewed_by`: BIGINT UNSIGNED NULL (FK → `users.id` ON DELETE SET NULL)
  - `reviewed_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 5. `services`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `name`: VARCHAR(255)
  - `slug`: VARCHAR(255) UNIQUE
  - `description`: TEXT NULL
  - `status`: VARCHAR(20) DEFAULT 'active' INDEX
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 6. `service_questions`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `service_id`: BIGINT UNSIGNED (FK → `services.id` ON DELETE CASCADE)
  - `question_text`: VARCHAR(255)
  - `question_type`: VARCHAR(30) INDEX (values: `multiple_choice`, `single_choice`, `text`, `file_upload`, `image_upload`)
  - `required`: BOOLEAN DEFAULT TRUE
  - `sort_order`: INT UNSIGNED DEFAULT 0
  - `conditional_rule`: JSON NULL
  - `status`: VARCHAR(20) DEFAULT 'active' INDEX
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 7. `service_question_options`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `question_id`: BIGINT UNSIGNED (FK → `service_questions.id` ON DELETE CASCADE)
  - `label`: VARCHAR(255)
  - `value`: VARCHAR(255)
  - `sort_order`: INT UNSIGNED DEFAULT 0
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(question_id, sort_order)`

### 8. `locations`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `parent_id`: BIGINT UNSIGNED NULL (FK → `locations.id` ON DELETE SET NULL)
  - `type`: VARCHAR(30) INDEX (values: `state`, `council`, `suburb`, `postcode`)
  - `name`: VARCHAR(255) INDEX
  - `code`: VARCHAR(20) NULL INDEX
  - `postcode`: VARCHAR(10) NULL INDEX
  - `status`: VARCHAR(20) DEFAULT 'active' INDEX
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 9. `tradie_services`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE CASCADE)
  - `service_id`: BIGINT UNSIGNED (FK → `services.id` ON DELETE CASCADE)
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Constraints**: UNIQUE `(tradie_id, service_id)`

### 10. `tradie_service_areas`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE CASCADE)
  - `location_id`: BIGINT UNSIGNED (FK → `locations.id` ON DELETE CASCADE)
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Constraints**: UNIQUE `(tradie_id, location_id)`

### 11. `tradie_availability`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE CASCADE)
  - `day_of_week`: TINYINT UNSIGNED NULL (0 = Sunday, 6 = Saturday)
  - `start_time`: TIME NULL
  - `end_time`: TIME NULL
  - `specific_date`: DATE NULL
  - `is_available`: BOOLEAN DEFAULT TRUE
  - `notes`: VARCHAR(255) NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(tradie_id, day_of_week)`, `(tradie_id, specific_date)`
- **Open Decision Note**: Supports recurring weekly slots and specific date overrides without locking into an overly rigid calendar engine.

### 12. `service_requests`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `customer_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE RESTRICT)
  - `service_id`: BIGINT UNSIGNED (FK → `services.id` ON DELETE RESTRICT)
  - `location_id`: BIGINT UNSIGNED NULL (FK → `locations.id` ON DELETE SET NULL)
  - `postcode`: VARCHAR(10) INDEX
  - `title`: VARCHAR(255) NULL
  - `description`: TEXT NULL
  - `status`: VARCHAR(30) DEFAULT 'draft' INDEX (values: `draft`, `submitted`, `matching`, `quoting`, `quote_accepted`, `scheduled`, `in_progress`, `completed`, `cancelled`)
  - `submitted_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 13. `request_answers`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE CASCADE)
  - `question_id`: BIGINT UNSIGNED (FK → `service_questions.id` ON DELETE RESTRICT)
  - `answer_text`: TEXT NULL
  - `selected_option_id`: BIGINT UNSIGNED NULL (FK → `service_question_options.id` ON DELETE SET NULL)
  - `structured_value`: JSON NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(request_id, question_id)`

### 14. `request_attachments`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE CASCADE)
  - `file_path`: VARCHAR(255)
  - `original_name`: VARCHAR(255)
  - `mime_type`: VARCHAR(100)
  - `file_size`: BIGINT UNSIGNED
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 15. `request_tradies`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE CASCADE)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `selected_at`: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `status`: VARCHAR(30) DEFAULT 'selected' INDEX (values: `selected`, `contacted`, `declined`)
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Constraints**: UNIQUE `(request_id, tradie_id)`

### 16. `conversations`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE CASCADE)
  - `customer_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE RESTRICT)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `status`: VARCHAR(30) DEFAULT 'active' INDEX
  - `last_message_at`: TIMESTAMP NULL INDEX
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Constraints**: UNIQUE `(request_id, tradie_id)`

### 17. `messages`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `conversation_id`: BIGINT UNSIGNED (FK → `conversations.id` ON DELETE CASCADE)
  - `sender_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE RESTRICT)
  - `body`: TEXT NULL
  - `message_type`: VARCHAR(30) DEFAULT 'text' INDEX (values: `text`, `image`, `document`, `system`)
  - `sent_at`: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `read_at`: TIMESTAMP NULL INDEX
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(conversation_id, created_at)`

### 18. `message_attachments`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `message_id`: BIGINT UNSIGNED (FK → `messages.id` ON DELETE CASCADE)
  - `file_path`: VARCHAR(255)
  - `original_name`: VARCHAR(255)
  - `mime_type`: VARCHAR(100)
  - `file_size`: BIGINT UNSIGNED
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 19. `quotes`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE RESTRICT)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `amount`: DECIMAL(10, 2) NOT NULL
  - `description`: TEXT NOT NULL
  - `valid_until`: DATE NULL
  - `terms_notes`: TEXT NULL
  - `estimated_duration`: VARCHAR(100) NULL
  - `proposed_date`: DATE NULL
  - `status`: VARCHAR(30) DEFAULT 'pending' INDEX (values: `pending`, `accepted`, `rejected`, `auto_rejected`, `expired`)
  - `accepted_at`: TIMESTAMP NULL
  - `rejected_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(request_id, status)`, `(tradie_id, status)`

### 20. `quote_attachments`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `quote_id`: BIGINT UNSIGNED (FK → `quotes.id` ON DELETE CASCADE)
  - `file_path`: VARCHAR(255)
  - `original_name`: VARCHAR(255)
  - `mime_type`: VARCHAR(100)
  - `file_size`: BIGINT UNSIGNED
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 21. `appointments`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE RESTRICT)
  - `quote_id`: BIGINT UNSIGNED (FK → `quotes.id` ON DELETE RESTRICT)
  - `customer_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE RESTRICT)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `starts_at`: DATETIME NOT NULL INDEX
  - `ends_at`: DATETIME NULL
  - `status`: VARCHAR(30) DEFAULT 'scheduled' INDEX (values: `scheduled`, `rescheduled`, `completed`, `cancelled`)
  - `notes`: TEXT NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(tradie_id, starts_at)`, `(customer_id, starts_at)`

### 22. `jobs`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `request_id`: BIGINT UNSIGNED (FK → `service_requests.id` ON DELETE RESTRICT)
  - `appointment_id`: BIGINT UNSIGNED NULL (FK → `appointments.id` ON DELETE SET NULL)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `status`: VARCHAR(30) DEFAULT 'scheduled' INDEX (values: `scheduled`, `in_progress`, `completed`)
  - `started_at`: TIMESTAMP NULL
  - `completed_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(tradie_id, status)`, `(request_id, status)`

### 23. `reviews`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `job_id`: BIGINT UNSIGNED UNIQUE (FK → `jobs.id` ON DELETE RESTRICT)
  - `customer_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE RESTRICT)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `rating`: TINYINT UNSIGNED NOT NULL
  - `review_text`: TEXT NOT NULL
  - `moderation_status`: VARCHAR(30) DEFAULT 'pending' INDEX (values: `pending`, `approved`, `rejected`, `flagged`)
  - `published_at`: TIMESTAMP NULL
  - `removed_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Constraints**:
  - CHECK `(rating >= 1 AND rating <= 5)`
- **Indexes**: `(tradie_id, moderation_status)`

### 24. `review_responses`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `review_id`: BIGINT UNSIGNED UNIQUE (FK → `reviews.id` ON DELETE CASCADE)
  - `tradie_id`: BIGINT UNSIGNED (FK → `tradie_profiles.id` ON DELETE RESTRICT)
  - `response_text`: TEXT NOT NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 25. `review_reports`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `review_id`: BIGINT UNSIGNED (FK → `reviews.id` ON DELETE CASCADE)
  - `reporter_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE RESTRICT)
  - `reason`: TEXT NOT NULL
  - `status`: VARCHAR(30) DEFAULT 'pending' INDEX (values: `pending`, `reviewed`, `dismissed`, `action_taken`)
  - `resolved_by`: BIGINT UNSIGNED NULL (FK → `users.id` ON DELETE SET NULL)
  - `resolved_at`: TIMESTAMP NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 26. `notifications`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `user_id`: BIGINT UNSIGNED (FK → `users.id` ON DELETE CASCADE)
  - `type`: VARCHAR(100) INDEX
  - `title`: VARCHAR(255)
  - `body`: TEXT
  - `data`: JSON NULL
  - `read_at`: TIMESTAMP NULL INDEX
  - `created_at`, `updated_at`: TIMESTAMP NULL

### 27. `audit_logs`
- **Columns**:
  - `id`: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  - `actor_id`: BIGINT UNSIGNED NULL (FK → `users.id` ON DELETE SET NULL)
  - `action`: VARCHAR(100) INDEX
  - `entity_type`: VARCHAR(100) NULL INDEX
  - `entity_id`: BIGINT UNSIGNED NULL INDEX
  - `old_values`: JSON NULL
  - `new_values`: JSON NULL
  - `ip_address`: VARCHAR(45) NULL
  - `user_agent`: TEXT NULL
  - `created_at`, `updated_at`: TIMESTAMP NULL
- **Indexes**: `(entity_type, entity_id)`

---

## Technical Adaptation: Framework Queue Table
Laravel's database queue driver default table was changed from `jobs` to `queue_jobs` via:
- Migration `0001_01_01_000002_create_jobs_table.php` (`queue_jobs`)
- Configuration in `config/queue.php` (`'table' => env('DB_QUEUE_TABLE', 'queue_jobs')`)
- Environment variable `DB_QUEUE_TABLE=queue_jobs` in `.env` and `.env.example`

This allows table #22 to cleanly represent the domain marketplace `jobs` table without collisions.
