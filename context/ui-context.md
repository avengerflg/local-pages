# UI Context

## Product UI direction
The application is a professional local-services marketplace. UI should be clear, trustworthy, responsive and task-focused.

The frontend must work well on:
- Desktop
- Tablet
- Mobile web

No native mobile application is currently planned.

## Customer UX

### Main flow
1. Register/Login
2. Choose service
3. Enter postcode/address
4. Answer guided questions
5. Review request
6. Submit
7. View matching tradies
8. Select multiple tradies
9. Start platform chat
10. Receive quotes
11. Compare quotes
12. Accept one
13. Agree date/time
14. Track scheduled/in-progress/completed state
15. Review tradie

### Customer dashboard
Should provide clear access to:
- Active requests
- Quotes
- Conversations
- Upcoming appointments
- Completed jobs
- Reviews
- Profile

## Tradie UX

### Main flow
1. Register
2. Complete business profile
3. Upload verification documents
4. Wait for/admin verification
5. Configure services
6. Configure service areas
7. Configure availability
8. View selected customer requests
9. Chat
10. Create quote
11. Manage appointments
12. Manage jobs
13. Complete work
14. Respond to reviews

### Tradie dashboard
Should clearly surface:
- Verification state
- New requests
- Active conversations
- Quotes
- Upcoming appointments
- Active jobs
- Completed jobs
- Reviews

## Admin UX
Admin should prioritize operational workflows:
- Verification queue
- Service/question management
- Location management
- Requests
- Quotes
- Jobs
- Review moderation
- Reports
- Audit logs

## UI states
Every important screen should define:
- Loading
- Empty
- Success
- Validation error
- Server error
- Permission denied
- Not found
- Conflict

## Matching empty state
Use a clear state for:
"No matching tradies are currently available."

Do not imply that a tradie will necessarily be contacted automatically because automatic lead distribution is deferred.

## Quote UI
The customer should be able to compare:
- Tradie
- Amount
- Description
- Valid until
- Estimated duration
- Proposed date
- Terms/notes
- Attachments

The UI must make it clear that accepting one quote causes other pending quotes to be rejected.

## Job status UI
Show the baseline lifecycle:

Quote Accepted
→ Scheduled
→ In Progress
→ Completed

Do not expose unsupported cancellation controls after quote acceptance. Direct the customer to platform/admin support according to the approved workflow.

## Chat UI
Support:
- Text
- Images
- PDFs
- Other configured files
- Upload progress
- File validation errors
- Read state where implemented

## Accessibility
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Form labels
- Useful validation messages
- Sufficient contrast
- Accessible modal/dialog behavior
- Do not rely only on color for status

## Design system
Use reusable components for:
- Buttons
- Inputs
- Selects
- Cards
- Modals
- Tables
- Status badges
- Alerts
- File upload
- Chat messages
- Quote cards
- Appointment cards

Avoid page-specific duplicated components where a reusable component is appropriate.

## Responsive principle
Design mobile-first where practical, but ensure desktop workflows remain efficient for admin and tradie dashboards.

## UI business-rule principle
The UI must reflect backend authorization and state. Never assume that hiding a button is sufficient security.
