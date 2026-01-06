# Implementation Plan: Contact Form for Beer Meetups

**Branch**: `001-contact-email` | **Date**: 2025-01-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-contact-email/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a contact form allowing website visitors to send Blake email requests for informal beer/coffee meetups. The form will include fields for name, email, and message, with client-side and server-side validation, spam prevention (honeypot, rate limiting, content filtering), and email delivery via a transactional email service. The implementation will use Next.js 15 App Router with server-side API routes for form processing and Resend.com for email delivery.

## Technical Context

**Language/Version**: TypeScript 5 with Next.js 15
**Primary Dependencies**: Next.js 15, React 19, Resend SDK
**Storage**: In-memory rate limiting (Redis or Vercel KV for production scale if needed)
**Testing**: Jest + React Testing Library (Next.js standard testing stack)
**Target Platform**: Vercel deployment (Next.js native platform)
**Project Type**: Web application (Next.js App Router - single project structure)
**Performance Goals**: Form submission < 500ms, email delivery < 30 seconds (95th percentile)
**Constraints**: Free tier limits (Resend: 100 emails/day, 3,000/month), no database required for MVP
**Scale/Scope**: Low traffic personal site (~10-50 submissions/month expected)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Incremental Progress Over Big Bangs

✅ **PASS** - Implementation will be broken into 3-5 stages:

1. Basic form UI (compiles, displays)
2. Client-side validation (works independently)
3. Server-side API route + email delivery (tested with mock)
4. Spam prevention (honeypot, rate limiting)
5. Production deployment and monitoring

Each stage compiles, passes tests, and delivers independently testable value.

### Principle II: Test-First Development

✅ **PASS** - Test-first approach:

- Form component tests (render, validation UX) written before component
- API route tests (validation, email sending, rate limiting) written before API logic
- Integration tests (end-to-end form submission) written before full integration
- Will use existing Next.js testing patterns (Jest + React Testing Library)

### Principle III: Learn From Existing Code

✅ **PASS** - Will study existing patterns in codebase:

- Examine existing page components in `src/app/` for component patterns
- Review existing styling approach (Tailwind CSS 4 usage patterns)
- Use same TypeScript strict mode configuration
- Follow existing file organization (App Router structure)

**Note**: Current codebase has limited features, so will also reference:

- Next.js 15 official examples for form handling
- Resend.com documentation for email integration patterns
- Standard React form validation patterns

### Principle IV: Simplicity & Clarity

✅ **PASS** - Simple, boring solutions chosen:

- Standard HTML form with progressive enhancement (works without JS)
- Server-side validation as source of truth (client-side is UX enhancement)
- Single API route endpoint (POST /api/contact)
- In-memory rate limiting for MVP (no Redis complexity until proven needed)
- Direct Resend SDK usage (no abstraction layers)
- Honeypot field for spam prevention (simpler than reCAPTCHA)

### Principle V: Content-First Design

✅ **PASS** - Design aligns with site aesthetics:

- Form will use existing Crimson Text typography
- Constrained to 65ch max width (matches site content)
- Minimal, editorial styling (no generic form template aesthetics)
- Mobile-first responsive design
- Accessible HTML5 form elements with clear labels
- Error messages in user-friendly, professional tone

## Project Structure

### Documentation (this feature)

```text
specs/001-contact-email/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── api-contact.yaml # OpenAPI spec for POST /api/contact
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/app/
├── contact/
│   └── page.tsx         # Contact page with form component
├── api/
│   └── contact/
│       └── route.ts     # POST handler for form submissions
└── components/
    └── ContactForm.tsx  # Form component (if separated from page)

src/lib/
├── email.ts             # Email sending logic (Resend SDK wrapper)
├── validation.ts        # Shared validation functions
├── rate-limit.ts        # Rate limiting logic
└── spam-detection.ts    # Spam detection (honeypot, content filtering)

__tests__/
├── components/
│   └── ContactForm.test.tsx
├── api/
│   └── contact.test.ts
└── integration/
    └── contact-flow.test.ts
```

**Structure Decision**: Using Next.js App Router structure (Option 1: Single project). All source code lives in `src/app/` following App Router conventions, with shared utilities in `src/lib/`. Tests mirror source structure in `__tests__/` directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles pass.
