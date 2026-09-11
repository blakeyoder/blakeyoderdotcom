# Plan: Site audit fixes

Fixes for the issues found in the post-writing-removal review.

## Stage 1: CSS cascade layers

**Goal**: Element rules stop overriding Tailwind utilities and design-system classes.
**Success Criteria**: `p`/`h1-h4`/`a` rules live in `@layer base`; utilities on paragraphs and headings apply; dead CSS removed.
**Tests**: Compiled bundle shows the element rules nested in `@layer base`; contact field errors resolve to the accent color; Now-page `h2` resolves to the small-caps size.
**Status**: Complete

## Stage 2: Contact flow correctness

**Goal**: No lockout after a validation error; no 500s for client mistakes; no debug logging of the recipient; build works without secrets.
**Success Criteria**: Failed validation does not consume rate-limit quota; non-string and malformed bodies return 400; Resend client constructed lazily; `bun run build` succeeds with no env vars.
**Tests**: Real unit tests for rate limiting, validation edge cases, and email construction; behavioral probe of the running route.
**Status**: Complete

## Stage 3: Real tests + CI

**Goal**: The suite fails when the code is broken.
**Success Criteria**: No `expect(true).toBe(true)` remains; `bun test` runs via a `test` script; `__tests__` is typechecked; CI runs typecheck, lint, and test.
**Tests**: Suite passes; deleting a guard in the route makes a test fail.
**Status**: Complete

## Stage 4: Remove unreachable vim mode; fix the vim tutorial

**Goal**: Delete the global vim mode that can never be enabled; fix the tutorial's wrong instructions.
**Success Criteria**: `useVimMode`/`VimStatusBar` gone and unmounted from the root layout; `k` moves one line; `jj` leaves no stray character; command buffer ignores non-printable keys.
**Tests**: Motion helpers unit-tested against a multi-line buffer.
**Status**: Complete

## Stage 5: Components and a11y

**Goal**: Accessible modal, correct list rendering, safer preview fetching.
**Success Criteria**: Modal has dialog semantics, Escape, focus trap and restore; `StyledList` last-item detection survives conditional children; LinkedIn preview has a timeout, abort handling, and honest failure states; bookmarks modal shows once per session.
**Tests**: Unit tests for the list index logic and the bookmark export escaping.
**Status**: Complete

## Stage 6: SEO, headers, config, docs

**Goal**: Dead URLs redirect, every route has metadata, docs match reality.
**Success Criteria**: `/writing` URLs 301 to `/`; sitemap and robots exist; security headers set; `/contact` has its own metadata; OG image uses a real serif and clamps length; README/CLAUDE.md/constitution corrected; lint no longer uses the deprecated command.
**Tests**: Built output serves redirects; metadata present per route.
**Status**: Not Started
