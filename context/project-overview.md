# Project Overview

## Name
Local Pages / Tredies Services Marketplace

## Purpose
A web platform that allows customers to find local tradies, select multiple matching tradies, communicate through platform chat, receive quotes, accept one quote, schedule the work and review the completed service.

## User roles

### Customer
Can:
- Register/login
- Submit service requests
- Answer service-specific questions
- Provide location
- View matching tradies
- Select multiple tradies
- Chat with selected tradies
- Receive and compare quotes
- Accept/reject quotes
- Agree on appointment date/time
- Review completed work

### Tradie
Can:
- Register/onboard
- Provide business details
- Submit verification documents
- Configure services
- Configure service areas
- Configure availability
- View selected requests
- Chat with customers
- Submit quotes
- Manage appointments/jobs
- Mark assigned work completed
- Respond to reviews

### Admin
Can:
- Manage customers/tradies
- Verify tradies
- Manage services
- Manage service questions
- Manage location data
- Monitor requests/quotes/jobs
- Moderate reviews
- Manage reports
- Review audit activity

## Customer workflow
Register/Login
→ Service
→ Location
→ Questions
→ Submit
→ Matching
→ Select Multiple Tradies
→ Chat
→ Quotes
→ Accept One
→ Schedule
→ In Progress
→ Completed
→ Review

## Core business rules
- Guest requests are not allowed.
- One request may receive multiple quotes.
- Only one quote may be accepted.
- Other pending quotes are automatically rejected after acceptance.
- Customer/tradie communication occurs through platform chat.
- Only the assigned tradie can mark a job completed.
- Reviews require admin approval.
- Payments are out of scope.
- SMS provider integration is out of scope.
- Automatic lead distribution is deferred.

## Scope exclusions
- Mobile apps
- Payment processing
- Tradie payouts
- Platform commission
- Google Reviews
- Cost calculators/guides
- Complex dynamic SEO/location pages
- Automatic lead distribution

## Current technical direction
Laravel backend with REST API, relational database, modern web frontend, realtime chat, object storage and transactional email.

## Product principle
Build a modular marketplace where business rules are explicit, testable and easy to extend.
