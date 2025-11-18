# Quickstart: Contact Form Implementation

**Feature**: Contact Form for Beer Meetups
**Branch**: `001-contact-email`
**Date**: 2025-01-18

## Overview

This guide walks you through setting up, developing, testing, and deploying the contact form feature. Follow these steps in order for a smooth implementation experience.

## Prerequisites

Before you begin, ensure you have:

- [x] Node.js 20+ installed
- [x] Yarn 1.18.0 installed (project package manager)
- [x] Git repository cloned
- [x] Checked out branch `001-contact-email`
- [x] Editor configured (VS Code recommended with TypeScript support)

## Step 1: Environment Setup

### 1.1 Install Dependencies

First, install the Resend SDK:

```bash
yarn add resend
```

### 1.2 Configure Environment Variables

Create `.env.local` in the project root (git-ignored):

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_TO=your-email@example.com

# Optional (with defaults)
CONTACT_EMAIL_FROM=noreply@resend.dev
RATE_LIMIT_WINDOW_MS=300000
RATE_LIMIT_MAX_REQUESTS=1
SPAM_MAX_URLS=2
```

### 1.3 Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Create a new API key in the dashboard
4. Copy key to `.env.local` as `RESEND_API_KEY`
5. (Optional) Verify your domain or use test mode initially

### 1.4 Create Environment Example File

Create `.env.example` (committed to git) with placeholder values:

```bash
# Resend API Key - Get from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Email address where contact form submissions are sent
CONTACT_EMAIL_TO=your-email@example.com

# Optional: From address for outgoing emails
# CONTACT_EMAIL_FROM=noreply@yourdomain.com

# Optional: Rate limiting configuration
# RATE_LIMIT_WINDOW_MS=300000
# RATE_LIMIT_MAX_REQUESTS=1

# Optional: Spam detection thresholds
# SPAM_MAX_URLS=2
```

## Step 2: Development Workflow

### 2.1 Study Existing Patterns

Before writing code, study existing codebase patterns:

```bash
# Review existing page components
cat src/app/page.tsx
cat src/app/about/page.tsx

# Review existing styles
cat src/app/globals.css

# Review TypeScript config
cat tsconfig.json
```

**Key patterns to note**:
- Server components by default (no "use client" unless needed)
- Tailwind CSS 4 usage with custom CSS properties
- Crimson Text font via next/font
- 65ch max-width content constraint
- Mobile-first responsive design

### 2.2 Implementation Stages

Follow these stages in order (test-first for each):

#### Stage 1: Basic Form UI

**Goal**: Display contact form with all fields

**Tasks**:
1. Create `src/app/contact/page.tsx`
2. Add form with name, email, message fields
3. Add hidden honeypot field
4. Style with Tailwind matching site aesthetics
5. Verify renders correctly on mobile and desktop

**Test**: Form displays all fields with proper labels

#### Stage 2: Client-Side Validation

**Goal**: Immediate validation feedback without server round trip

**Tasks**:
1. Add "use client" directive
2. Implement validation logic (see `src/lib/validation.ts`)
3. Add error state management
4. Display field errors inline
5. Disable submit when invalid

**Test**: Errors appear immediately when fields invalid

#### Stage 3: API Route + Email Sending

**Goal**: Server-side processing and email delivery

**Tasks**:
1. Create `src/lib/validation.ts` (shared validation)
2. Create `src/lib/email.ts` (Resend wrapper)
3. Create `src/app/api/contact/route.ts`
4. Implement POST handler
5. Wire up form submission

**Test**: Valid submission sends email to Blake

#### Stage 4: Spam Prevention

**Goal**: Block spam submissions

**Tasks**:
1. Create `src/lib/rate-limit.ts`
2. Create `src/lib/spam-detection.ts`
3. Add honeypot check to API route
4. Add rate limiting to API route
5. Add content filtering to API route

**Test**: Spam submissions rejected appropriately

#### Stage 5: Polish & Deploy

**Goal**: Production-ready feature

**Tasks**:
1. Add success message state
2. Clear form after successful submission
3. Add loading states during submission
4. Verify all error cases handled
5. Run all tests
6. Deploy to Vercel

**Test**: End-to-end flow works in production

### 2.3 Test-First Development

For each stage, write tests BEFORE implementation:

```bash
# Example: Stage 1 - Form UI
# 1. Write test
touch __tests__/components/ContactForm.test.tsx

# 2. Write failing test
# Test should fail (component doesn't exist yet)
yarn test ContactForm.test.tsx

# 3. Implement minimum code to pass
# Create component with basic structure

# 4. Verify test passes
yarn test ContactForm.test.tsx

# 5. Refactor if needed (with tests passing)
```

## Step 3: File Structure

Create files in this order:

```
1. src/lib/validation.ts           # Shared validation functions
2. src/lib/config.ts                # Environment variable validation
3. src/lib/email.ts                 # Resend email wrapper
4. src/lib/rate-limit.ts            # Rate limiting logic
5. src/lib/spam-detection.ts        # Spam detection logic

6. src/app/contact/page.tsx         # Contact page + form component

7. src/app/api/contact/route.ts     # API route handler

8. __tests__/lib/validation.test.ts
9. __tests__/lib/spam-detection.test.ts
10. __tests__/components/ContactForm.test.tsx
11. __tests__/api/contact.test.ts
12. __tests__/integration/contact-flow.test.ts
```

## Step 4: Testing

### 4.1 Run Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test ContactForm.test.tsx

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### 4.2 Manual Testing Checklist

- [ ] Form renders correctly on desktop
- [ ] Form renders correctly on mobile
- [ ] All fields have proper labels
- [ ] Error messages appear for invalid input
- [ ] Successful submission shows success message
- [ ] Form clears after successful submission
- [ ] Email received with correct content
- [ ] Rate limiting blocks rapid submissions
- [ ] Honeypot field hidden from view
- [ ] Spam content detected and blocked
- [ ] Email service failures handled gracefully

### 4.3 Test Email Sending Locally

During development, use Resend test mode:

```typescript
// In src/lib/email.ts, add environment check
const resend = new Resend(process.env.RESEND_API_KEY);

// Test mode: emails only sent to your verified address
// Production: emails sent to any address
```

## Step 5: Deployment

### 5.1 Pre-Deployment Checklist

- [ ] All tests passing (`yarn test`)
- [ ] No linting errors (`yarn lint`)
- [ ] TypeScript compiles (`yarn build`)
- [ ] Environment variables documented in `.env.example`
- [ ] Sensitive data NOT committed (check `.env.local` in `.gitignore`)
- [ ] Manual testing completed

### 5.2 Deploy to Vercel

```bash
# Option 1: Git push (automatic deployment)
git add .
git commit -m "feat: add contact form for meetup requests"
git push origin 001-contact-email

# Option 2: Manual deployment
vercel
```

### 5.3 Configure Vercel Environment Variables

In Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add `RESEND_API_KEY` (production key)
3. Add `CONTACT_EMAIL_TO` (your email)
4. Optionally add `CONTACT_EMAIL_FROM` (verified domain)
5. Redeploy if needed

### 5.4 Verify Domain with Resend (Production)

For production emails from your domain:

1. Add domain in Resend dashboard
2. Add DNS records (SPF, DKIM, DMARC)
3. Wait for verification (can take 24-48 hours)
4. Update `CONTACT_EMAIL_FROM` to use verified domain

Or use default Resend sending domain (emails work immediately but may go to spam).

## Step 6: Monitoring

### 6.1 Check Email Delivery

Monitor email delivery in Resend dashboard:

1. Go to [resend.com/logs](https://resend.com/logs)
2. View delivery status for each email
3. Check for bounces or failures

### 6.2 Monitor Errors

Check Vercel logs for errors:

```bash
# Real-time logs
vercel logs --follow

# Or view in Vercel dashboard → Deployments → Logs
```

### 6.3 Set Up Alerts (Optional)

Create alerts for:

- Email delivery failures (>10% failure rate)
- API errors (>5% error rate)
- Unusual submission volume (spam attack indicator)

## Step 7: Troubleshooting

### Common Issues

#### Issue: "RESEND_API_KEY is not defined"

**Solution**:
- Verify `.env.local` exists in project root
- Check key is spelled correctly: `RESEND_API_KEY=re_...`
- Restart dev server: `yarn dev`

#### Issue: Emails not being received

**Solution**:
- Check Resend dashboard logs for delivery status
- Verify `CONTACT_EMAIL_TO` is correct
- Check spam folder
- Ensure API key has send permissions
- If using custom domain, verify DNS records

#### Issue: Rate limiting not working after restart

**Solution**:
- Expected behavior: In-memory rate limits reset on server restart
- For persistent rate limiting, upgrade to Redis/Vercel KV (future enhancement)

#### Issue: TypeScript errors in tests

**Solution**:
- Ensure `@types/jest` installed: `yarn add -D @types/jest`
- Check `tsconfig.json` includes test files
- Restart TypeScript server in editor

#### Issue: Spam detection too aggressive

**Solution**:
- Adjust thresholds in `src/lib/spam-detection.ts`
- Update `SPAM_MAX_URLS` environment variable
- Review spam keywords list and remove false positives

## Step 8: Post-Deployment

### 8.1 Test in Production

- [ ] Submit test contact form on production site
- [ ] Verify email received
- [ ] Test rate limiting (submit twice quickly)
- [ ] Test validation errors
- [ ] Test on mobile device
- [ ] Test in different browsers

### 8.2 Update Documentation

- [ ] Update README if needed
- [ ] Document any deployment-specific configuration
- [ ] Add monitoring/alert setup instructions

### 8.3 Merge to Main

Once testing complete:

```bash
# Switch to main and merge
git checkout main
git merge 001-contact-email

# Push to main
git push origin main
```

## Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/app/contact/page.tsx` | Contact page with form |
| `src/app/api/contact/route.ts` | API endpoint for form submission |
| `src/lib/validation.ts` | Validation logic (shared) |
| `src/lib/email.ts` | Email sending (Resend wrapper) |
| `src/lib/rate-limit.ts` | Rate limiting logic |
| `src/lib/spam-detection.ts` | Spam detection logic |
| `.env.local` | Local environment variables |
| `.env.example` | Example env vars (committed) |

### Commands

```bash
# Development
yarn dev                    # Start dev server
yarn build                  # Build for production
yarn start                  # Start production server

# Testing
yarn test                   # Run all tests
yarn test --watch          # Run tests in watch mode
yarn test --coverage       # Run with coverage report

# Quality
yarn lint                   # Run ESLint
yarn lint --fix            # Fix linting errors

# Deployment
git push origin 001-contact-email  # Deploy via Git
vercel                     # Manual deploy
vercel logs --follow       # Stream production logs
```

### Environment Variables

```bash
# Required
RESEND_API_KEY=re_...      # From resend.com/api-keys
CONTACT_EMAIL_TO=...       # Where to send contact form emails

# Optional
CONTACT_EMAIL_FROM=...     # From address (default: noreply@resend.dev)
RATE_LIMIT_WINDOW_MS=...   # Rate limit window (default: 300000 = 5 min)
RATE_LIMIT_MAX_REQUESTS=...# Max requests per window (default: 1)
SPAM_MAX_URLS=...          # Max URLs in message (default: 2)
```

### Useful Links

- [Resend Dashboard](https://resend.com/dashboard)
- [Resend Logs](https://resend.com/logs)
- [Resend API Docs](https://resend.com/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js API Routes Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Next Steps

After successfully deploying this feature:

1. Monitor submission volume and email delivery rate
2. Gather feedback on form UX
3. Consider enhancements:
   - Analytics on submission rate
   - A/B testing different form copy
   - Rich text emails (HTML templates)
   - Admin dashboard for viewing submissions
   - Advanced spam detection (Akismet)

Refer to `research.md` "Future Enhancements" section for detailed recommendations.
