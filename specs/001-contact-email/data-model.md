# Data Model: Contact Form

**Feature**: Contact Form for Beer Meetups
**Date**: 2025-01-18

## Overview

This document defines the data structures for the contact form feature. Since this is a stateless feature (no database persistence), the data models represent in-memory structures used for validation, processing, and email composition.

## Entities

### ContactFormSubmission

Represents a visitor's contact form submission.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | `string` | Yes | 1-100 characters, non-empty after trim | Visitor's full name |
| `email` | `string` | Yes | Valid email format, max 254 chars | Visitor's email address |
| `message` | `string` | Yes | 1-2000 characters, non-empty after trim | Message content |
| `honeypot` | `string` | No | Must be empty | Spam trap field (hidden from humans) |
| `submittedAt` | `Date` | Yes | Auto-generated | Timestamp of submission |
| `ipAddress` | `string` | Yes | IPv4 or IPv6 format | Visitor's IP for rate limiting |

**TypeScript Interface**:

```typescript
interface ContactFormSubmission {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  submittedAt: Date;
  ipAddress: string;
}
```

**Validation Rules**:

1. **Name**:
   - Required
   - Min length: 1 character (after trim)
   - Max length: 100 characters
   - Must not be only whitespace

2. **Email**:
   - Required
   - Must match email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Max length: 254 characters (RFC 5321 limit)
   - Case-insensitive

3. **Message**:
   - Required
   - Min length: 1 character (after trim)
   - Max length: 2000 characters
   - Must not be only whitespace
   - Spam checks (see SpamDetectionResult below)

4. **Honeypot**:
   - If present and non-empty → reject as spam
   - Should be empty string or undefined for legitimate submissions

5. **IP Address**:
   - Extracted from request headers (`X-Forwarded-For` or connection IP)
   - Used for rate limiting (not stored persistently)

### ContactEmail

Represents the email sent to Blake with submission details.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | `string` | Yes | Blake's email address (from env var) |
| `from` | `string` | Yes | Sender address (Resend verified domain or test address) |
| `replyTo` | `string` | Yes | Visitor's email (for easy replies) |
| `subject` | `string` | Yes | Email subject line |
| `text` | `string` | Yes | Plain text email body |

**TypeScript Interface**:

```typescript
interface ContactEmail {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
}
```

**Template** (from ContactFormSubmission):

```typescript
function buildContactEmail(submission: ContactFormSubmission): ContactEmail {
  return {
    to: process.env.CONTACT_EMAIL_TO!,
    from: process.env.CONTACT_EMAIL_FROM || 'noreply@resend.dev',
    replyTo: submission.email,
    subject: `New contact form submission from ${submission.name}`,
    text: `
You have a new contact form submission from your website.

---
From: ${submission.name}
Email: ${submission.email}
Submitted: ${submission.submittedAt.toLocaleString('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'short'
})}

Message:
${submission.message}

---
Reply directly to this email to respond to ${submission.name}.
    `.trim()
  };
}
```

### RateLimitEntry

Represents rate limiting state for an IP address.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ipAddress` | `string` | Yes | The IP being rate limited |
| `count` | `number` | Yes | Number of submissions in current window |
| `windowStart` | `Date` | Yes | Start of current rate limit window |
| `resetAt` | `Date` | Yes | When the rate limit resets |

**TypeScript Interface**:

```typescript
interface RateLimitEntry {
  count: number;
  windowStart: Date;
  resetAt: Date;
}

// Storage: Map<ipAddress, RateLimitEntry>
type RateLimitStore = Map<string, RateLimitEntry>;
```

**Rate Limit Algorithm** (Sliding Window):

```typescript
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 1;

function checkRateLimit(ipAddress: string, store: RateLimitStore): boolean {
  const now = new Date();
  const entry = store.get(ipAddress);

  // No existing entry - allow and create entry
  if (!entry) {
    store.set(ipAddress, {
      count: 1,
      windowStart: now,
      resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS)
    });
    return true; // Allowed
  }

  // Window expired - reset and allow
  if (now >= entry.resetAt) {
    store.set(ipAddress, {
      count: 1,
      windowStart: now,
      resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS)
    });
    return true; // Allowed
  }

  // Within window - check count
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Blocked
  }

  // Within window, under limit - increment and allow
  entry.count += 1;
  return true; // Allowed
}
```

### SpamDetectionResult

Represents the result of spam detection checks.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `isSpam` | `boolean` | Yes | Whether submission is detected as spam |
| `reasons` | `string[]` | Yes | List of spam indicators detected (empty if not spam) |
| `score` | `number` | Yes | Spam score 0-100 (0 = definitely not spam, 100 = definitely spam) |

**TypeScript Interface**:

```typescript
interface SpamDetectionResult {
  isSpam: boolean;
  reasons: string[];
  score: number;
}
```

**Spam Detection Rules**:

```typescript
function detectSpam(message: string): SpamDetectionResult {
  const reasons: string[] = [];
  let score = 0;

  // Check 1: Excessive URLs
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = message.match(urlRegex) || [];
  if (urls.length > 2) {
    reasons.push('excessive_urls');
    score += 40;
  }

  // Check 2: Spam keywords (case-insensitive)
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'poker', 'lottery',
    'bitcoin', 'crypto investment', 'forex', 'make money fast',
    'click here', 'buy now', 'limited time offer', 'act now'
  ];
  const lowerMessage = message.toLowerCase();
  const foundKeywords = spamKeywords.filter(kw => lowerMessage.includes(kw));
  if (foundKeywords.length > 0) {
    reasons.push('spam_keywords');
    score += foundKeywords.length * 30;
  }

  // Check 3: Excessive capitalization (>50% caps)
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  const letterCount = (message.match(/[A-Za-z]/g) || []).length;
  if (letterCount > 0 && capsCount / letterCount > 0.5) {
    reasons.push('excessive_caps');
    score += 20;
  }

  // Check 4: Excessive special characters
  const specialCharCount = (message.match(/[!@#$%^&*()]/g) || []).length;
  if (specialCharCount > 10) {
    reasons.push('excessive_special_chars');
    score += 15;
  }

  return {
    isSpam: score >= 40, // Threshold for blocking
    reasons,
    score: Math.min(score, 100)
  };
}
```

### ValidationError

Represents field-level validation errors.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field` | `string` | Yes | The field name with error |
| `message` | `string` | Yes | User-friendly error message |
| `code` | `string` | Yes | Machine-readable error code |

**TypeScript Interface**:

```typescript
interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
```

**Common Error Codes**:

- `REQUIRED`: Field is required but missing
- `INVALID_FORMAT`: Field format is invalid (e.g., email)
- `TOO_SHORT`: Field value too short
- `TOO_LONG`: Field value too long
- `HONEYPOT_FILLED`: Honeypot field filled (spam)

**Example Validation Result**:

```typescript
const result: ValidationResult = {
  isValid: false,
  errors: [
    {
      field: 'name',
      message: 'Name is required',
      code: 'REQUIRED'
    },
    {
      field: 'email',
      message: 'Please enter a valid email address',
      code: 'INVALID_FORMAT'
    }
  ]
};
```

## State Transitions

### Form Submission Flow

```
┌─────────────┐
│   Idle      │ Initial state
└──────┬──────┘
       │ User fills form
       ▼
┌─────────────┐
│ Validating  │ Client-side validation
└──────┬──────┘
       │ Valid? No ──→ Show errors, return to Idle
       │ Valid? Yes
       ▼
┌─────────────┐
│ Submitting  │ POST to /api/contact
└──────┬──────┘
       │
       ├─→ Honeypot filled ──→ Silent rejection ──→ Show success (fake)
       │
       ├─→ Rate limited ──────→ Show rate limit error ──→ Idle
       │
       ├─→ Spam detected ─────→ Show spam error ──→ Idle
       │
       ├─→ Validation fails ──→ Show field errors ──→ Idle
       │
       ├─→ Email send fails ──→ Show server error ──→ Idle
       │
       └─→ Success ───────────→ Show success message ──→ Success state
                                 └─→ Clear form
```

### Rate Limit State Transitions

```
┌──────────────┐
│ No Entry     │ IP never submitted before
└──────┬───────┘
       │ First submission
       ▼
┌──────────────┐
│ Active       │ Within rate limit window, count < max
├──────────────┤
│ count: 1     │
│ resetAt: +5m │
└──────┬───────┘
       │
       ├─→ Submission before resetAt ──→ Blocked ──→ Return rate limit error
       │
       └─→ Time >= resetAt ──────────→ Reset ──→ Allow submission
                                        └─→ Create new window
```

## Data Flow Diagram

```
Visitor Browser                API Route                    External Services
     │                             │                              │
     │  1. Submit form             │                              │
     ├────────────────────────────►│                              │
     │                             │                              │
     │                             │  2. Validate input           │
     │                             │     - Required fields        │
     │                             │     - Email format           │
     │                             │     - Message length         │
     │                             │                              │
     │                             │  3. Check honeypot           │
     │                             │     ├─ Filled? Fake success  │
     │                             │     └─ Empty? Continue       │
     │                             │                              │
     │                             │  4. Check rate limit         │
     │                             │     ├─ Exceeded? Error 429   │
     │                             │     └─ OK? Continue          │
     │                             │                              │
     │                             │  5. Detect spam              │
     │                             │     ├─ Spam? Error 400       │
     │                             │     └─ Clean? Continue       │
     │                             │                              │
     │                             │  6. Send email               │
     │                             ├─────────────────────────────►│ Resend.com
     │                             │                              │ (Email delivery)
     │                             │◄─────────────────────────────┤
     │                             │  7. Email sent / error       │
     │                             │                              │
     │  8. Return success/error    │                              │
     │◄────────────────────────────┤                              │
     │                             │                              │
     │  9. Show message to user    │                              │
     │                             │                              │
```

## Persistence

**None** - This feature is stateless by design.

**What is NOT persisted**:
- Contact form submissions (sent via email only)
- Rate limit state (in-memory, resets on server restart)
- Spam detection results (logged but not stored)
- Validation errors (returned to client only)

**Rationale**:
- Simplicity: No database required
- Privacy: No PII stored
- Compliance: Easier GDPR/privacy compliance (no data retention)
- Scale appropriate: Low volume doesn't justify database

**Future considerations**:
- If submission volume increases, may want to persist for analytics
- If rate limiting needs to survive server restarts, use Redis/KV store
- If spam patterns need analysis, may want to store detection results

## Security Considerations

### Data Sanitization

**Input sanitization** (before processing):
- Trim whitespace from all string fields
- Limit string lengths per validation rules
- Escape HTML in message content (prevent XSS if ever displayed)

**Output sanitization** (before email):
- Escape special characters in email subject/body
- Validate email headers (prevent header injection)
- Strip potentially dangerous content (scripts, HTML)

### PII Handling

**Fields containing PII**:
- `name`: Personal identifier
- `email`: Personal identifier
- `message`: May contain personal information

**PII protection measures**:
- Not logged in clear text (hash or redact in logs)
- Transmitted over HTTPS only
- Not stored persistently
- Included in email to Blake only (who needs it)

### Rate Limiting Security

**Attack vectors addressed**:
- **Spam flooding**: Max 1 submission per IP per 5 minutes
- **DOS via email**: Rate limiting prevents excessive email sending
- **Memory exhaustion**: Periodic cleanup of expired rate limit entries

**Limitations** (acceptable for MVP):
- Shared IPs: Legitimate users behind same NAT may be affected
- IP spoofing: Headers can be manipulated (mitigated by multiple checks)
- Cold start reset: Serverless restarts clear in-memory limits (rare)

## References

- RFC 5321 (Email format specifications)
- OWASP Input Validation Cheat Sheet
- Next.js API Routes Documentation
- Resend API Documentation
