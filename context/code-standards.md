# Code Standards

## General
- Follow Laravel conventions.
- Use clear, descriptive names.
- Prefer simple code over unnecessary abstractions.
- Keep methods focused.
- Keep controllers thin.
- Keep business rules out of UI components.
- Do not duplicate business logic.

## PHP
- Use PHP 8.3+ compatible syntax.
- Use strict typing where appropriate.
- Follow PSR standards.
- Use Laravel Pint for formatting where configured.
- Avoid magic values; use configuration/enums/constants when appropriate.

## Laravel
Use:
- Form Requests for validation
- Policies/Gates for authorization
- API Resources for response shaping
- Eloquent relationships
- Service classes for complex workflows
- Events/listeners for appropriate side effects
- Jobs for asynchronous work
- Notifications for user-facing notifications

## Controllers
Controllers should:
1. Authorize
2. Validate
3. Call the appropriate application/domain service
4. Return a response

Do not put large business workflows directly inside controllers.

## Database
- Use migrations for every schema change.
- Add foreign keys for core relationships.
- Add indexes based on actual query patterns.
- Use unique constraints for business invariants where appropriate.
- Avoid unnecessary duplicated data.
- Use transactions for multi-step critical operations.

## API
Base path:
`/api/v1`

Use consistent:
- HTTP status codes
- JSON structures
- validation responses
- authorization responses
- pagination

Do not return uncontrolled Eloquent models directly.

## Security
Never commit:
- `.env`
- API keys
- passwords
- private keys
- production credentials

Never log:
- passwords
- bearer tokens
- sensitive document contents

Validate and authorize every protected operation.

## Files
- Store sensitive uploads outside the public web root.
- Validate MIME type, extension and size.
- Use non-guessable object keys.
- Use authorized/signed downloads.

## Testing
Every important business rule must have automated coverage.

Critical tests include:
- Authorization
- Quote acceptance race conditions
- Auto-rejection of other quotes
- Job completion permissions
- Review moderation
- File upload security

## Git
Use small, meaningful commits.

Example:
`feat: add customer authentication`

Avoid commits such as:
`changes`, `update`, `stuff`, `fix`.

## Comments
Comment WHY, not obvious WHAT.

Do not leave unexplained temporary code.

## Open decisions
Use:
`TODO: OPEN DECISION — <description>`

Do not silently choose a business rule that has not been approved.
