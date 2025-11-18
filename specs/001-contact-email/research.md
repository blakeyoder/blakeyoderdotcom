# Research: Contact Form Implementation

**Feature**: Contact Form for Beer Meetups
**Date**: 2025-01-18
**Branch**: 001-contact-email

## Overview

This document captures research findings and technical decisions for implementing a contact form on Blake Yoder's personal website. The form allows visitors to send email requests for informal meetups.

## Technical Decisions

### 1. Email Service Provider

**Decision**: Use Resend.com for transactional email delivery

**Rationale**:
- **Free tier sufficient**: 100 emails/day, 3,000/month covers expected traffic (10-50/month)
- **No credit card required**: Can start immediately without payment setup
- **Simple API**: RESTful API with clean TypeScript SDK
- **Next.js integration**: Official Resend SDK has excellent Next.js support
- **Deliverability focus**: Modern email service with good reputation and deliverability
- **Developer experience**: Clear documentation, helpful error messages

**Alternatives Considered**:
- **SendGrid**: More complex API, requires credit card for free tier, overkill for simple use case
- **Mailgun**: Similar complexity to SendGrid, less modern developer experience
- **Postmark**: Excellent service but no free tier, minimum $10/month
- **AWS SES**: Very cheap but requires AWS account setup, more complex IAM configuration, worse DX
- **Nodemailer + Gmail SMTP**: Free but unreliable, security concerns with app passwords, poor deliverability

**Implementation Notes**:
- Install via `yarn add resend`
- Store API key in environment variable: `RESEND_API_KEY`
- Verify domain or use test mode during development
- Rate limiting handled application-side (not relying on Resend limits)

### 2. Form Validation Strategy

**Decision**: Dual validation (client + server) with server as source of truth

**Rationale**:
- **Security**: Server-side validation prevents bypassing via browser dev tools
- **User Experience**: Client-side validation provides immediate feedback without round trip
- **Progressive Enhancement**: Form works without JavaScript (server validates)
- **Type Safety**: TypeScript validation schemas shared between client and server

**Alternatives Considered**:
- **Client-only validation**: Insecure, easily bypassed, rejected
- **Server-only validation**: Poor UX (requires round trip for every error), rejected
- **Third-party validation library (Zod, Yup)**: Adds dependency, simple validation doesn't justify it

**Implementation Notes**:
- Create shared validation functions in `src/lib/validation.ts`
- Client-side: React state + event handlers for immediate feedback
- Server-side: Validate in API route before processing
- Return structured error responses from API (field-level errors)

### 3. Rate Limiting Approach

**Decision**: In-memory rate limiting with Map-based storage for MVP

**Rationale**:
- **Simplicity**: No external dependencies (Redis, KV store) for MVP
- **Sufficient for scale**: Expected traffic (10-50/month) doesn't justify Redis
- **Easy to upgrade**: Can swap to Vercel KV or Redis later if needed
- **Development simplicity**: No local Redis setup required for development

**Alternatives Considered**:
- **Vercel KV (Redis)**: Overkill for current scale, adds cost/complexity, can add later
- **Upstash Redis**: Similar to Vercel KV, premature optimization
- **No rate limiting**: Would allow spam, rejected per requirements

**Implementation Notes**:
- Track submissions by IP address in memory: `Map<string, { count: number, resetAt: Date }>`
- 5-minute sliding window: max 1 submission per IP per 5 minutes
- Clear expired entries periodically to prevent memory leak
- Warning: In-memory approach resets on serverless cold starts (acceptable for MVP)
- For production: Consider middleware vs. API route implementation

### 4. Spam Detection Strategy

**Decision**: Multi-layered approach - honeypot + rate limiting + content filtering

**Rationale**:
- **Honeypot field**: Catches dumb bots (hidden CSS field, bots auto-fill it)
- **Rate limiting**: Prevents rapid automated submissions
- **Content filtering**: Blocks excessive links, suspicious keywords
- **No CAPTCHA**: Better UX, sufficient for low-traffic site
- **Layered defense**: Multiple simple techniques better than one complex one

**Alternatives Considered**:
- **reCAPTCHA**: Degrades UX, accessibility concerns, privacy issues, overkill for traffic level
- **hCaptcha**: Similar to reCAPTCHA, same concerns
- **Akismet**: Paid service ($5/month minimum), overkill for expected volume
- **No spam prevention**: Would result in spam submissions, rejected

**Implementation Notes**:
- **Honeypot**: Hidden input field named something tempting like `website` or `phone`
- **Content filtering rules**:
  - Max 2 URLs in message (more likely spam)
  - Reject common spam keywords (configurable blocklist)
  - Max message length: 2000 characters
- **Rate limiting**: 1 submission per IP per 5 minutes
- Silent rejection for honeypot triggers (don't tell bots they failed)
- User-friendly error for content filter triggers

### 5. Testing Strategy

**Decision**: Jest + React Testing Library + MSW for API mocking

**Rationale**:
- **Standard Next.js stack**: Jest is Next.js default testing framework
- **React Testing Library**: Encourages testing user behavior vs. implementation
- **MSW (Mock Service Worker)**: Clean API mocking without monkey-patching fetch
- **Already installed**: No new dependencies needed (part of Next.js setup)

**Alternatives Considered**:
- **Vitest**: Faster but non-standard for Next.js, not worth migration
- **Cypress/Playwright**: E2E tools are overkill for simple form, can add later if needed
- **Manual mocking**: More brittle than MSW, harder to maintain

**Test Coverage Plan**:
1. **Component tests** (`ContactForm.test.tsx`):
   - Form renders with all fields
   - Client-side validation triggers on invalid input
   - Error messages display correctly
   - Success message shows after submission
   - Honeypot field is hidden

2. **API route tests** (`contact.test.ts`):
   - Validates required fields
   - Validates email format
   - Rejects honeypot-filled submissions
   - Enforces rate limiting
   - Blocks spam content
   - Sends email on valid submission
   - Returns appropriate error responses

3. **Integration tests** (`contact-flow.test.ts`):
   - End-to-end happy path: fill form → submit → email sent
   - Error handling: invalid data → see errors → fix → submit success

**Implementation Notes**:
- Mock Resend SDK in tests (don't send real emails)
- Use MSW to intercept API calls in integration tests
- Test both with and without JavaScript enabled (progressive enhancement)

### 6. Environment Configuration

**Decision**: Environment variables with validation at startup

**Rationale**:
- **Security**: API keys never committed to repository
- **Flexibility**: Different keys for development vs. production
- **Fail fast**: Validate required env vars at application startup
- **Next.js standard**: Built-in env var support with `.env.local`

**Required Environment Variables**:
```bash
# Required
RESEND_API_KEY=re_...                    # Resend API key
CONTACT_EMAIL_TO=blake@example.com       # Where to send contact form emails

# Optional
CONTACT_EMAIL_FROM=noreply@example.com   # From address (defaults to noreply@resend.dev)
RATE_LIMIT_WINDOW_MS=300000              # Rate limit window (default: 5 minutes)
RATE_LIMIT_MAX_REQUESTS=1                # Max requests per window (default: 1)
SPAM_MAX_URLS=2                          # Max URLs in message (default: 2)
```

**Implementation Notes**:
- Create `.env.local` for local development (git ignored)
- Add `.env.example` with placeholder values (committed)
- Validate env vars in `src/lib/config.ts` at module load time
- Type-safe access via config object (not process.env directly)
- Vercel deployment: Set env vars in project settings

## Form Design Patterns

### Accessibility Requirements

**Standards to follow**:
- WCAG 2.1 Level AA compliance
- Semantic HTML5 form elements
- Proper label associations (explicit `<label for="...">`)
- ARIA labels where needed
- Error messages announced to screen readers
- Keyboard navigation support
- Focus management (error fields get focus)

**Implementation checklist**:
- [ ] All inputs have associated `<label>` elements
- [ ] Error messages have `role="alert"` for screen reader announcement
- [ ] Required fields indicated visually and in markup (`required` attribute)
- [ ] Focus moves to first error field on validation failure
- [ ] Submit button disabled during submission (with loading state)
- [ ] Success/error messages are keyboard-accessible

### Progressive Enhancement

**Base functionality (no JavaScript)**:
- Form submits via standard HTML form POST
- Server-side validation returns error page with errors pre-filled
- Success page shows after successful submission

**Enhanced functionality (with JavaScript)**:
- Inline client-side validation (immediate feedback)
- AJAX submission (no page reload)
- Loading states during submission
- In-page error/success messages
- Smooth focus management

**Implementation approach**:
- Use Next.js server actions OR standard API route (API route chosen for simplicity)
- Form `action` attribute points to `/api/contact`
- JavaScript progressively enhances via `fetch` interception

## Email Template Design

### Email to Blake (Contact Submission)

**Subject line**: New contact form submission from [Visitor Name]

**Body template**:
```
You have a new contact form submission from your website.

---
From: [Visitor Name]
Email: [Visitor Email]
Submitted: [Timestamp]

Message:
[Visitor Message]

---
Reply directly to this email to respond to [Visitor Name].
```

**Implementation notes**:
- Plain text email (simpler, better deliverability)
- Set `reply-to` header to visitor's email for easy replies
- Include timestamp in Blake's local timezone
- Sanitize all user input before including in email

### Optional: Confirmation Email to Visitor

**Subject line**: Thanks for reaching out!

**Body template**:
```
Hi [Visitor Name],

Thanks for getting in touch! I've received your message and will get back to you soon.

Best,
Blake

---
This is an automated confirmation. Please don't reply to this email.
```

**Implementation notes**:
- Send after successful submission (if enabled)
- Lower priority than email to Blake (can fail silently)
- Set `from` to no-reply address
- Include `Auto-Submitted: auto-replied` header

## Error Handling Strategy

### API Error Responses

**Format**: Structured JSON with field-level errors

```typescript
// Success response
{
  success: true,
  message: "Your message has been sent!"
}

// Validation error response
{
  success: false,
  error: "VALIDATION_ERROR",
  message: "Please check your input and try again.",
  fields: {
    name: "Name is required",
    email: "Please enter a valid email address",
    message: "Message must be less than 2000 characters"
  }
}

// Rate limit error response
{
  success: false,
  error: "RATE_LIMIT_EXCEEDED",
  message: "Please wait a few minutes before submitting again.",
  retryAfter: 180  // seconds
}

// Spam detected response
{
  success: false,
  error: "SPAM_DETECTED",
  message: "Your message appears to contain spam. Please remove links or suspicious content and try again."
}

// Server error response
{
  success: false,
  error: "SERVER_ERROR",
  message: "Something went wrong. Please try again later."
}
```

### Error Logging

**What to log**:
- All email sending failures (with error details)
- Rate limit triggers (IP, timestamp)
- Spam detection triggers (reason, content hash)
- Validation errors (aggregated, no PII)

**What NOT to log**:
- Full message content (privacy)
- Visitor email addresses (privacy)
- API keys (security)

**Implementation**:
- Use `console.error` for server errors (captured by Vercel)
- Structured logging format for easy parsing
- Include request ID for correlation

## Security Considerations

### Input Sanitization

**Client-side**:
- Trim whitespace from all inputs
- Basic XSS prevention (HTML escaping in display)

**Server-side**:
- Validate all inputs against schema
- Sanitize email content (strip HTML, escape special chars)
- Limit message length (prevent DOS via large payloads)
- Validate email format (prevent header injection)

### Rate Limiting

**Implementation details**:
- Track by IP address (X-Forwarded-For header, fallback to connection IP)
- Sliding window algorithm (not fixed window to prevent burst at boundary)
- Clear old entries to prevent memory leak
- Return 429 status code with Retry-After header

### Honeypot

**Implementation details**:
- Field name: `website` (looks legitimate to bots)
- Hidden via CSS (`position: absolute; left: -9999px; opacity: 0`)
- NOT using `display: none` (some bots detect this)
- Server rejects any submission with honeypot filled
- Silent rejection (don't tell bot it failed)

### CSRF Protection

**Next.js API routes**:
- Same-origin policy enforced by default
- Can add CSRF token if needed (likely overkill for public form)
- Verify `Origin` and `Referer` headers match domain

## Performance Considerations

### Email Sending Performance

**Approach**: Fire-and-forget with error handling

**Options**:
1. **Synchronous** (chosen for MVP): Wait for email to send, return success/error
   - Pros: User knows if email sent successfully
   - Cons: Slower response time (500ms - 2s)
   - Acceptable for low-traffic site

2. **Asynchronous** (future optimization): Queue email, return immediately
   - Pros: Faster response (<100ms)
   - Cons: More complex (need queue, worker, delayed error notification)
   - Implement later if response time becomes issue

### Bundle Size Impact

**Estimated additions**:
- Resend SDK: ~50KB (server-only, no client impact)
- Form validation: ~5KB client-side
- Spam detection: ~3KB server-only

**Total client bundle impact**: ~5KB (negligible)

### Caching Strategy

**API route caching**: None (POST endpoints not cached)

**Static assets**: Form page can be static (no dynamic data needed)

## Deployment Considerations

### Vercel Deployment

**Configuration**:
- Environment variables set in Vercel dashboard
- Domain verification for Resend (or use test domain initially)
- Monitor Vercel logs for errors
- Function timeout: Default (10s) is sufficient

**Domains for Resend**:
- Option 1: Verify `blakeyoder.com` with Resend (recommended for production)
- Option 2: Use Resend test domain initially (emails go to registered account only)

### Monitoring

**What to monitor**:
- Email delivery failures (alert if >10% failure rate)
- API error rates (alert if >5% 5xx errors)
- Form submission volume (to detect spam attacks)

**Tools**:
- Vercel Analytics (built-in)
- Resend dashboard (email delivery metrics)
- Consider: Sentry or similar for error tracking (future enhancement)

## Open Questions & Future Enhancements

### Resolved in This Research

✅ Email service provider (Resend.com)
✅ Rate limiting approach (in-memory for MVP)
✅ Spam detection strategy (honeypot + content filtering)
✅ Testing framework (Jest + RTL)
✅ Form validation approach (dual client + server)

### Future Enhancements (Out of Scope for MVP)

- **Advanced spam detection**: Akismet integration if spam becomes problem
- **Analytics**: Track form views, submission rate, error rate
- **A/B testing**: Test different form copy/layouts for better conversion
- **Email templates**: HTML email templates (currently plain text)
- **Async email sending**: Queue-based approach for faster response time
- **Admin dashboard**: View submission history, manage spam
- **CAPTCHA fallback**: Add reCAPTCHA if spam bypass rate limiting
- **Persistent rate limiting**: Redis/KV store for distributed rate limiting

## References

- [Resend Documentation](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Hook Form](https://react-hook-form.com/) - Considered but unnecessary for simple form
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
