# AI Workflow Rules

## Purpose
These rules govern how an AI coding agent must work on the Local Pages / Tredies marketplace.

## Core rule
Work in small, verified phases. Do not implement future phases automatically.

### Current development order
1. Laravel project setup
2. Database migrations
3. Models and relationships
4. Authentication
5. Roles and permissions
6. Services and service questions
7. Location system
8. Tradie onboarding
9. Customer requests
10. Matching engine
11. Tradie selection
12. Chat
13. Quotes
14. Appointments
15. Jobs
16. Reviews
17. Admin panel
18. Notifications
19. Testing
20. Security, performance and deployment

## Before changing code
1. Inspect the repository.
2. Inspect the current environment.
3. Read all context files in this directory.
4. Check the progress tracker.
5. Identify the current phase.
6. Do not overwrite existing work without inspection.
7. Do not invent unresolved business rules.

## After changing code
1. Run relevant tests.
2. Run formatting/static checks when configured.
3. Verify the feature manually where practical.
4. Update `progress-tracker.md`.
5. Document important decisions.
6. Report files changed and verification results.

## Scope control
Do NOT add unless explicitly approved:
- Payment gateways
- Tradie payouts
- Platform commissions
- SMS provider integration
- Google Reviews integration
- Mobile applications
- Complex dynamic SEO/location pages
- Automatic lead distribution
- Unnecessary microservices
- Kubernetes infrastructure
- Unnecessary third-party packages

## Open decisions
Do not invent:
- Calendar conflict handling
- Exact Scheduled → In Progress trigger
- Final file size/type limits
- Exact review moderation state model
- Future automatic lead distribution
- Final production infrastructure

Use `TODO: OPEN DECISION` where implementation needs one of these decisions.

## Coding behavior
- Prefer Laravel-native functionality.
- Keep controllers thin.
- Use Form Requests for validation.
- Use Policies for authorization.
- Use API Resources for API output.
- Use Services for complex business workflows.
- Use transactions for critical multi-record operations.
- Avoid premature abstractions.
- Do not create fake classes just to fill directories.
- Never expose secrets.

## Critical business invariant
Only one quote may be accepted for a request.

Quote acceptance must be atomic:
1. Lock relevant records.
2. Verify the quote is eligible.
3. Accept the selected quote.
4. Auto-reject remaining pending quotes.
5. Advance the request state.
6. Commit only if all steps succeed.

## Stop condition
After completing the requested phase, STOP. Do not continue into the next phase without approval.
