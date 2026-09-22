# Eloquent Model Map

This document maps every marketplace Eloquent model to its underlying database table, relationships, foreign keys, attribute casts, and architectural design choices.

---

## Models Directory
Namespace: `App\Models`

---

## Model Specifications

### 1. `User`
- **Table**: `users`
- **Primary Key**: `id`
- **Relationships**:
  - `customerProfile`: `hasOne(CustomerProfile::class, 'user_id')`
  - `tradieProfile`: `hasOne(TradieProfile::class, 'user_id')`
  - `notifications`: `hasMany(Notification::class, 'user_id')`
  - `serviceRequests`: `hasMany(ServiceRequest::class, 'customer_id')`
  - `conversations`: `hasMany(Conversation::class, 'customer_id')`
  - `messages`: `hasMany(Message::class, 'sender_id')`
  - `appointments`: `hasMany(Appointment::class, 'customer_id')`
  - `reviews`: `hasMany(Review::class, 'customer_id')`
  - `auditLogs`: `hasMany(AuditLog::class, 'actor_id')`
- **Fillable**: `name`, `email`, `password`, `role`, `mobile`, `phone_verified_at`, `status`
- **Hidden**: `password`, `remember_token`
- **Casts**: `email_verified_at => datetime`, `phone_verified_at => datetime`, `password => hashed`
- **Architectural Note**: Single authenticated entity for all roles (`customer`, `tradie`, `admin`). Customers identify as `users.id`. Tradies have a linked `tradieProfile`.

### 2. `CustomerProfile`
- **Table**: `customer_profiles`
- **Primary Key**: `id`
- **Relationships**:
  - `user`: `belongsTo(User::class, 'user_id')`
- **Fillable**: `user_id`, `postcode`, `address`
- **Architectural Note**: 1-to-1 auxiliary profile data attached to a user with role `customer`.

### 3. `TradieProfile`
- **Table**: `tradie_profiles`
- **Primary Key**: `id`
- **Relationships**:
  - `user`: `belongsTo(User::class, 'user_id')`
  - `documents`: `hasMany(TradieDocument::class, 'tradie_id')`
  - `services`: `belongsToMany(Service::class, 'tradie_services', 'tradie_id', 'service_id')->withTimestamps()`
  - `serviceAreas`: `belongsToMany(Location::class, 'tradie_service_areas', 'tradie_id', 'location_id')->withTimestamps()`
  - `availability`: `hasMany(TradieAvailability::class, 'tradie_id')`
  - `requestTradies`: `hasMany(RequestTradie::class, 'tradie_id')`
  - `conversations`: `hasMany(Conversation::class, 'tradie_id')`
  - `quotes`: `hasMany(Quote::class, 'tradie_id')`
  - `appointments`: `hasMany(Appointment::class, 'tradie_id')`
  - `jobs`: `hasMany(Job::class, 'tradie_id')`
  - `reviews`: `hasMany(Review::class, 'tradie_id')`
  - `reviewResponses`: `hasMany(ReviewResponse::class, 'tradie_id')`
- **Fillable**: `user_id`, `business_name`, `abn`, `phone`, `email`, `website`, `address`, `suburb`, `state`, `postcode`, `verification_status`, `verified_at`
- **Casts**: `verified_at => datetime`
- **Architectural Note**: Authoritative business identity in the marketplace. Foreign keys throughout the domain (`quotes.tradie_id`, `jobs.tradie_id`, `reviews.tradie_id`, `conversations.tradie_id`) reference `tradie_profiles.id`.

### 4. `TradieDocument`
- **Table**: `tradie_documents`
- **Primary Key**: `id`
- **Relationships**:
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `reviewer`: `belongsTo(User::class, 'reviewed_by')`
- **Fillable**: `tradie_id`, `document_type`, `file_path`, `original_name`, `mime_type`, `file_size`, `status`, `reviewed_by`, `reviewed_at`
- **Casts**: `file_size => integer`, `reviewed_at => datetime`
- **Architectural Note**: Stores document metadata and object-storage path. Reviewer is an admin user.

### 5. `Service`
- **Table**: `services`
- **Primary Key**: `id`
- **Relationships**:
  - `questions`: `hasMany(ServiceQuestion::class, 'service_id')->orderBy('sort_order')`
  - `tradieProfiles`: `belongsToMany(TradieProfile::class, 'tradie_services', 'service_id', 'tradie_id')->withTimestamps()`
  - `serviceRequests`: `hasMany(ServiceRequest::class, 'service_id')`
- **Fillable**: `name`, `slug`, `description`, `status`

### 6. `ServiceQuestion`
- **Table**: `service_questions`
- **Primary Key**: `id`
- **Relationships**:
  - `service`: `belongsTo(Service::class, 'service_id')`
  - `options`: `hasMany(ServiceQuestionOption::class, 'question_id')->orderBy('sort_order')`
  - `answers`: `hasMany(RequestAnswer::class, 'question_id')`
- **Fillable**: `service_id`, `question_text`, `question_type`, `required`, `sort_order`, `conditional_rule`, `status`
- **Casts**: `required => boolean`, `sort_order => integer`, `conditional_rule => array`

### 7. `ServiceQuestionOption`
- **Table**: `service_question_options`
- **Primary Key**: `id`
- **Relationships**:
  - `question`: `belongsTo(ServiceQuestion::class, 'question_id')`
  - `answers`: `hasMany(RequestAnswer::class, 'selected_option_id')`
- **Fillable**: `question_id`, `label`, `value`, `sort_order`
- **Casts**: `sort_order => integer`

### 8. `Location`
- **Table**: `locations`
- **Primary Key**: `id`
- **Relationships**:
  - `parent`: `belongsTo(Location::class, 'parent_id')`
  - `children`: `hasMany(Location::class, 'parent_id')`
  - `tradieProfiles`: `belongsToMany(TradieProfile::class, 'tradie_service_areas', 'location_id', 'tradie_id')->withTimestamps()`
  - `serviceRequests`: `hasMany(ServiceRequest::class, 'location_id')`
- **Fillable**: `parent_id`, `type`, `name`, `code`, `postcode`, `status`
- **Architectural Note**: Single hierarchical table modeling State → Council → Suburb → Postcode via self-referencing `parent_id`.

### 9. `TradieService` (Pivot)
- **Table**: `tradie_services`
- **Primary Key**: `id`
- **Relationships**:
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `service`: `belongsTo(Service::class, 'service_id')`
- **Fillable**: `tradie_id`, `service_id`

### 10. `TradieServiceArea` (Pivot)
- **Table**: `tradie_service_areas`
- **Primary Key**: `id`
- **Relationships**:
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `location`: `belongsTo(Location::class, 'location_id')`
- **Fillable**: `tradie_id`, `location_id`

### 11. `TradieAvailability`
- **Table**: `tradie_availability`
- **Primary Key**: `id`
- **Relationships**:
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
- **Fillable**: `tradie_id`, `day_of_week`, `start_time`, `end_time`, `specific_date`, `is_available`, `notes`
- **Casts**: `day_of_week => integer`, `specific_date => date`, `is_available => boolean`
- **Architectural Note**: Flexible baseline supporting weekly recurring schedule slots and specific date blackout/availability overrides.

### 12. `ServiceRequest`
- **Table**: `service_requests`
- **Primary Key**: `id`
- **Relationships**:
  - `customer`: `belongsTo(User::class, 'customer_id')`
  - `service`: `belongsTo(Service::class, 'service_id')`
  - `location`: `belongsTo(Location::class, 'location_id')`
  - `answers`: `hasMany(RequestAnswer::class, 'request_id')`
  - `attachments`: `hasMany(RequestAttachment::class, 'request_id')`
  - `requestTradies`: `hasMany(RequestTradie::class, 'request_id')`
  - `quotes`: `hasMany(Quote::class, 'request_id')`
  - `conversations`: `hasMany(Conversation::class, 'request_id')`
  - `appointment`: `hasOne(Appointment::class, 'request_id')`
  - `job`: `hasOne(Job::class, 'request_id')`
- **Fillable**: `customer_id`, `service_id`, `location_id`, `postcode`, `title`, `description`, `status`, `submitted_at`
- **Casts**: `submitted_at => datetime`
- **Architectural Note**: Central marketplace transaction model. `customer_id` explicitly maps to `users.id`.

### 13. `RequestAnswer`
- **Table**: `request_answers`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
  - `question`: `belongsTo(ServiceQuestion::class, 'question_id')`
  - `selectedOption`: `belongsTo(ServiceQuestionOption::class, 'selected_option_id')`
- **Fillable**: `request_id`, `question_id`, `answer_text`, `selected_option_id`, `structured_value`
- **Casts**: `structured_value => array`

### 14. `RequestAttachment`
- **Table**: `request_attachments`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
- **Fillable**: `request_id`, `file_path`, `original_name`, `mime_type`, `file_size`
- **Casts**: `file_size => integer`

### 15. `RequestTradie`
- **Table**: `request_tradies`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
- **Fillable**: `request_id`, `tradie_id`, `selected_at`, `status`
- **Casts**: `selected_at => datetime`
- **Architectural Note**: Represents customer-selected tradies workflow. Unique `(request_id, tradie_id)` prevents duplicate selections.

### 16. `Conversation`
- **Table**: `conversations`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
  - `customer`: `belongsTo(User::class, 'customer_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `messages`: `hasMany(Message::class, 'conversation_id')->orderBy('created_at')`
- **Fillable**: `request_id`, `customer_id`, `tradie_id`, `status`, `last_message_at`
- **Casts**: `last_message_at => datetime`
- **Architectural Note**: 1-to-1 conversation per request and tradie pair.

### 17. `Message`
- **Table**: `messages`
- **Primary Key**: `id`
- **Relationships**:
  - `conversation`: `belongsTo(Conversation::class, 'conversation_id')`
  - `sender`: `belongsTo(User::class, 'sender_id')`
  - `attachments`: `hasMany(MessageAttachment::class, 'message_id')`
- **Fillable**: `conversation_id`, `sender_id`, `body`, `message_type`, `sent_at`, `read_at`
- **Casts**: `sent_at => datetime`, `read_at => datetime`

### 18. `MessageAttachment`
- **Table**: `message_attachments`
- **Primary Key**: `id`
- **Relationships**:
  - `message`: `belongsTo(Message::class, 'message_id')`
- **Fillable**: `message_id`, `file_path`, `original_name`, `mime_type`, `file_size`
- **Casts**: `file_size => integer`

### 19. `Quote`
- **Table**: `quotes`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `attachments`: `hasMany(QuoteAttachment::class, 'quote_id')`
  - `appointment`: `hasOne(Appointment::class, 'quote_id')`
- **Fillable**: `request_id`, `tradie_id`, `amount`, `description`, `valid_until`, `terms_notes`, `estimated_duration`, `proposed_date`, `status`, `accepted_at`, `rejected_at`
- **Casts**: `amount => decimal:2`, `valid_until => date`, `proposed_date => date`, `accepted_at => datetime`, `rejected_at => datetime`

### 20. `QuoteAttachment`
- **Table**: `quote_attachments`
- **Primary Key**: `id`
- **Relationships**:
  - `quote`: `belongsTo(Quote::class, 'quote_id')`
- **Fillable**: `quote_id`, `file_path`, `original_name`, `mime_type`, `file_size`
- **Casts**: `file_size => integer`

### 21. `Appointment`
- **Table**: `appointments`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
  - `quote`: `belongsTo(Quote::class, 'quote_id')`
  - `customer`: `belongsTo(User::class, 'customer_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `job`: `hasOne(Job::class, 'appointment_id')`
- **Fillable**: `request_id`, `quote_id`, `customer_id`, `tradie_id`, `starts_at`, `ends_at`, `status`, `notes`
- **Casts**: `starts_at => datetime`, `ends_at => datetime`

### 22. `Job`
- **Table**: `jobs`
- **Primary Key**: `id`
- **Relationships**:
  - `serviceRequest`: `belongsTo(ServiceRequest::class, 'request_id')`
  - `appointment`: `belongsTo(Appointment::class, 'appointment_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `review`: `hasOne(Review::class, 'job_id')`
- **Fillable**: `request_id`, `appointment_id`, `tradie_id`, `status`, `started_at`, `completed_at`
- **Casts**: `started_at => datetime`, `completed_at => datetime`
- **Architectural Note**: Represents executing work lifecycle (`scheduled` → `in_progress` → `completed`). Explicit `$table = 'jobs'` disambiguated from queue table (`queue_jobs`).

### 23. `Review`
- **Table**: `reviews`
- **Primary Key**: `id`
- **Relationships**:
  - `job`: `belongsTo(Job::class, 'job_id')`
  - `customer`: `belongsTo(User::class, 'customer_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
  - `response`: `hasOne(ReviewResponse::class, 'review_id')`
  - `reports`: `hasMany(ReviewReport::class, 'review_id')`
- **Fillable**: `job_id`, `customer_id`, `tradie_id`, `rating`, `review_text`, `moderation_status`, `published_at`, `removed_at`
- **Casts**: `rating => integer`, `published_at => datetime`, `removed_at => datetime`
- **Architectural Note**: Rating cast as integer (1–5 validated by DB check constraint). Moderation status string preserved for flexible moderation workflow.

### 24. `ReviewResponse`
- **Table**: `review_responses`
- **Primary Key**: `id`
- **Relationships**:
  - `review`: `belongsTo(Review::class, 'review_id')`
  - `tradieProfile`: `belongsTo(TradieProfile::class, 'tradie_id')`
- **Fillable**: `review_id`, `tradie_id`, `response_text`

### 25. `ReviewReport`
- **Table**: `review_reports`
- **Primary Key**: `id`
- **Relationships**:
  - `review`: `belongsTo(Review::class, 'review_id')`
  - `reporter`: `belongsTo(User::class, 'reporter_id')`
  - `resolver`: `belongsTo(User::class, 'resolved_by')`
- **Fillable**: `review_id`, `reporter_id`, `reason`, `status`, `resolved_by`, `resolved_at`
- **Casts**: `resolved_at => datetime`

### 26. `Notification`
- **Table**: `notifications`
- **Primary Key**: `id`
- **Relationships**:
  - `user`: `belongsTo(User::class, 'user_id')`
- **Fillable**: `user_id`, `type`, `title`, `body`, `data`, `read_at`
- **Casts**: `data => array`, `read_at => datetime`

### 27. `AuditLog`
- **Table**: `audit_logs`
- **Primary Key**: `id`
- **Relationships**:
  - `actor`: `belongsTo(User::class, 'actor_id')`
- **Fillable**: `actor_id`, `action`, `entity_type`, `entity_id`, `old_values`, `new_values`, `ip_address`, `user_agent`
- **Casts**: `old_values => array`, `new_values => array`
