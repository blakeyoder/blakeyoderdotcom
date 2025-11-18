---

description: "Task list for contact form implementation"
---

# Tasks: Contact Form for Beer Meetups

**Input**: Design documents from `/specs/001-contact-email/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution Principle II (Test-First Development), tests are REQUIRED and must be written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `src/app/`, `src/lib/` at repository root
- **Tests**: `__tests__/` at repository root
- Paths shown below assume Next.js App Router structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] T001 Install Resend SDK dependency via `yarn add resend`
- [ ] T002 Create `.env.local` file with environment variables: RESEND_API_KEY, CONTACT_EMAIL_TO
- [ ] T003 Create `.env.example` file documenting required environment variables
- [ ] T004 [P] Create `src/lib/` directory for shared utilities
- [ ] T005 [P] Create `__tests__/` directory structure (components/, api/, integration/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Study existing page components in src/app/page.tsx and src/app/about/page.tsx for styling patterns
- [ ] T007 [P] Create src/lib/config.ts to validate and export environment variables with TypeScript types
- [ ] T008 [P] Create src/lib/validation.ts with shared validation functions (validateEmail, validateRequired, validateLength)
- [ ] T009 Test for src/lib/validation.ts in __tests__/lib/validation.test.ts (write FIRST, verify fails)
- [ ] T010 Implement validation functions in src/lib/validation.ts to pass tests

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Send Meetup Request (Priority: P1) 🎯 MVP

**Goal**: Display contact form, accept submission, send email to Blake

**Independent Test**: Fill out form → submit → Blake receives email with visitor info and message

### Tests for User Story 1 (REQUIRED - write FIRST, verify fails)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Write component test for ContactForm in __tests__/components/ContactForm.test.tsx (render, fields present, no implementation yet)
- [ ] T012 [P] [US1] Write API route test for /api/contact in __tests__/api/contact.test.ts (POST request handling, no implementation yet)
- [ ] T013 [P] [US1] Write email service test for src/lib/email.ts in __tests__/lib/email.test.ts (Resend SDK mocking, no implementation yet)

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create src/lib/email.ts with sendContactEmail function wrapping Resend SDK
- [ ] T015 [US1] Implement sendContactEmail function in src/lib/email.ts to pass email service tests
- [ ] T016 [US1] Create src/app/contact/page.tsx with basic contact form UI (name, email, message fields)
- [ ] T017 [US1] Style contact form in src/app/contact/page.tsx using Tailwind CSS (65ch max-width, Crimson Text font, mobile-first)
- [ ] T018 [US1] Add "use client" directive and form state management to src/app/contact/page.tsx
- [ ] T019 [US1] Create src/app/api/contact/route.ts with POST handler skeleton
- [ ] T020 [US1] Implement server-side validation in src/app/api/contact/route.ts using src/lib/validation.ts
- [ ] T021 [US1] Implement email sending in src/app/api/contact/route.ts using src/lib/email.ts
- [ ] T022 [US1] Wire up form submission in src/app/contact/page.tsx to call /api/contact endpoint
- [ ] T023 [US1] Add success message state and display in src/app/contact/page.tsx
- [ ] T024 [US1] Add loading state during submission in src/app/contact/page.tsx
- [ ] T025 [US1] Verify all User Story 1 tests pass

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - visitors can submit contact form and Blake receives emails

---

## Phase 4: User Story 2 - Form Validation (Priority: P2)

**Goal**: Provide clear validation feedback for invalid form inputs

**Independent Test**: Submit form with invalid data → see appropriate error messages → fix errors → submit successfully

### Tests for User Story 2 (REQUIRED - write FIRST, verify fails)

- [ ] T026 [P] [US2] Write client-side validation tests in __tests__/components/ContactForm.test.tsx (empty fields, invalid email, error display)
- [ ] T027 [P] [US2] Write server-side validation error tests in __tests__/api/contact.test.ts (400 responses with field errors)

### Implementation for User Story 2

- [ ] T028 [P] [US2] Add client-side validation logic to src/app/contact/page.tsx (validate on blur and submit)
- [ ] T029 [P] [US2] Add error state management to src/app/contact/page.tsx (field-level errors)
- [ ] T030 [US2] Display inline error messages in src/app/contact/page.tsx (accessible, ARIA labels)
- [ ] T031 [US2] Implement server-side field validation errors in src/app/api/contact/route.ts (return 400 with field errors)
- [ ] T032 [US2] Handle validation error responses in src/app/contact/page.tsx (display server errors)
- [ ] T033 [US2] Add focus management in src/app/contact/page.tsx (move focus to first error field)
- [ ] T034 [US2] Verify all User Story 2 tests pass

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - form has complete validation with user-friendly error feedback

---

## Phase 5: User Story 3 - Spam Prevention (Priority: P3)

**Goal**: Block spam submissions using honeypot, rate limiting, and content filtering

**Independent Test**: Submit form rapidly → rate limited → submit with spam content → blocked with error message → submit with honeypot filled → silently rejected

### Tests for User Story 3 (REQUIRED - write FIRST, verify fails)

- [ ] T035 [P] [US3] Write rate limiting tests in __tests__/lib/rate-limit.test.ts (track IP, enforce limits, no implementation yet)
- [ ] T036 [P] [US3] Write spam detection tests in __tests__/lib/spam-detection.test.ts (detect URLs, keywords, no implementation yet)
- [ ] T037 [P] [US3] Write honeypot tests in __tests__/api/contact.test.ts (reject when honeypot filled)
- [ ] T038 [P] [US3] Write rate limit API tests in __tests__/api/contact.test.ts (429 response when rate limited)
- [ ] T039 [P] [US3] Write spam detection API tests in __tests__/api/contact.test.ts (400 response for spam content)

### Implementation for User Story 3

- [ ] T040 [P] [US3] Create src/lib/rate-limit.ts with in-memory rate limiting logic (Map-based storage)
- [ ] T041 [US3] Implement rate limiting functions in src/lib/rate-limit.ts to pass tests
- [ ] T042 [P] [US3] Create src/lib/spam-detection.ts with content filtering rules (max URLs, spam keywords)
- [ ] T043 [US3] Implement spam detection functions in src/lib/spam-detection.ts to pass tests
- [ ] T044 [US3] Add honeypot field to src/app/contact/page.tsx (hidden via CSS, not display:none)
- [ ] T045 [US3] Add honeypot check to src/app/api/contact/route.ts (silent rejection, fake success response)
- [ ] T046 [US3] Add rate limiting to src/app/api/contact/route.ts using src/lib/rate-limit.ts (extract IP from headers)
- [ ] T047 [US3] Add spam content detection to src/app/api/contact/route.ts using src/lib/spam-detection.ts
- [ ] T048 [US3] Add rate limit error handling to src/app/contact/page.tsx (display retry message with countdown)
- [ ] T049 [US3] Add spam detection error handling to src/app/contact/page.tsx (user-friendly message)
- [ ] T050 [US3] Verify all User Story 3 tests pass

**Checkpoint**: All user stories should now be independently functional - complete contact form with validation and spam prevention

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [ ] T051 [P] Write integration test in __tests__/integration/contact-flow.test.ts (end-to-end happy path)
- [ ] T052 [P] Add form reset after successful submission in src/app/contact/page.tsx
- [ ] T053 [P] Add loading state to submit button in src/app/contact/page.tsx (disabled during submission)
- [ ] T054 Verify all edge cases handled in src/app/api/contact/route.ts (email service failure, malformed input)
- [ ] T055 [P] Add error logging to src/app/api/contact/route.ts (console.error for failures, no PII)
- [ ] T056 [P] Verify accessibility in src/app/contact/page.tsx (ARIA labels, keyboard navigation, screen reader support)
- [ ] T057 Run `yarn lint` and fix any linting errors
- [ ] T058 Run `yarn build` and verify TypeScript compiles with no errors
- [ ] T059 [P] Update .env.example with all documented environment variables
- [ ] T060 Manual testing checklist (see quickstart.md Step 4.2)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Depends on US1 for form component to exist
  - User Story 3 (P3): Can start after Foundational - Depends on US1 for API route to exist
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (creates base form and API)
- **User Story 2 (P2)**: Depends on User Story 1 (needs form component and API route to add validation to)
- **User Story 3 (P3)**: Depends on User Story 1 (needs API route to add spam prevention to)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Lib/utility files before components that use them
- Components before API routes that serve them (unless API creates shared utilities)
- Core implementation before error handling polish
- Story complete and tests passing before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Tests for a user story marked [P] can run in parallel
- Lib files within a story marked [P] can run in parallel
- User Story 2 and 3 could theoretically run in parallel if staffed (both modify different aspects of US1)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write component test for ContactForm in __tests__/components/ContactForm.test.tsx"
Task: "Write API route test for /api/contact in __tests__/api/contact.test.ts"
Task: "Write email service test for src/lib/email.ts in __tests__/lib/email.test.ts"

# Then launch parallel implementation tasks:
Task: "Create src/lib/email.ts with sendContactEmail function wrapping Resend SDK"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (submit form, receive email)
5. Deploy to Vercel preview/production if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP - basic contact form works!)
3. Add User Story 2 → Test independently → Deploy (added validation UX)
4. Add User Story 3 → Test independently → Deploy (added spam protection)
5. Phase 6: Polish → Final production-ready deployment
6. Each story adds value without breaking previous stories

### Sequential Strategy (Single Developer)

With one developer:

1. Complete Setup (Phase 1) + Foundational (Phase 2) together
2. Implement User Story 1 (P1) - Core functionality
3. Implement User Story 2 (P2) - Validation
4. Implement User Story 3 (P3) - Spam prevention
5. Polish & deploy

Stories must complete in priority order (P1 → P2 → P3) due to dependencies.

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Tests MUST be written FIRST** per constitution Principle II (Test-First Development)
- Verify tests fail before implementing (red → green → refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Story 2 and 3 both modify US1 artifacts (page.tsx, route.ts) so have file conflicts - run sequentially

## Constitution Compliance

This task list adheres to all constitution principles:

- **Principle I (Incremental Progress)**: Each phase is independently testable and deployable
- **Principle II (Test-First)**: All implementation tasks have corresponding test tasks that MUST be written first
- **Principle III (Learn From Existing Code)**: T006 explicitly requires studying existing patterns before building
- **Principle IV (Simplicity & Clarity)**: Tasks use simple, boring solutions (in-memory rate limiting, direct Resend SDK usage)
- **Principle V (Content-First Design)**: T017 requires following existing site aesthetics (65ch, Crimson Text, mobile-first)
