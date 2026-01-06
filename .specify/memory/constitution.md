# Blake Yoder Personal Site Constitution

<!--
Sync Impact Report:
Version Change: [INITIAL] → 1.0.0
Modified Principles: N/A (initial constitution)
Added Sections:
  - Core Principles (5 principles)
  - Design & Content Standards
  - Development Workflow
  - Governance
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligned with principles
  ✅ spec-template.md - Requirements align with design principles
  ✅ tasks-template.md - Task structure supports incremental development
Follow-up TODOs: None
-->

## Core Principles

### I. Incremental Progress Over Big Bangs

Every change must compile and pass tests. No broken intermediate states.

**Rules**:

- All commits MUST compile successfully and pass all existing tests
- Break complex work into 3-5 stages documented in `IMPLEMENTATION_PLAN.md`
- Each stage MUST have specific deliverables and testable outcomes
- Update stage status as work progresses; remove plan when all stages complete
- Commit working code incrementally—never accumulate non-functional changes

**Rationale**: Small, verified steps reduce risk and maintain codebase stability. Large, unverified changes introduce compounding errors and make debugging exponentially harder.

### II. Test-First Development

Write tests before implementation. Red → Green → Refactor.

**Rules**:

- Tests MUST be written before implementation code
- Tests MUST fail initially (red), proving they test actual behavior
- Implementation proceeds only after test failure is confirmed
- Never disable or skip tests—fix them or fix the code
- Use project's existing test framework and patterns

**Rationale**: Writing tests first ensures they actually verify behavior. Tests written after implementation often test the implementation details rather than requirements, creating false confidence.

### III. Learn From Existing Code

Study before building. Find 3 similar implementations, identify patterns.

**Rules**:

- Before implementing, find 3 similar features/components in the codebase
- Identify common patterns, libraries, and conventions
- Use same utilities and test patterns when possible
- Maximum 3 attempts per issue—after that, STOP and research alternatives
- Document what failed and why before trying different approaches

**Rationale**: Every codebase has implicit conventions and patterns. Learning from existing code ensures consistency and leverages proven solutions rather than introducing competing approaches.

### IV. Simplicity & Clarity

Boring, obvious code over clever solutions.

**Rules**:

- Single responsibility per function/class
- Avoid premature abstractions—wait for 3+ use cases
- Choose boring, well-understood solutions over clever ones
- If explanation is needed, the code is too complex
- Explicit data flow and dependencies—no hidden magic

**Rationale**: Code is read 10× more than written. Clever code saves minutes writing but costs hours in comprehension and maintenance. Boring code is maintainable code.

### V. Content-First Design

Design serves content, not vice versa. Minimal, distinctive aesthetics.

**Rules**:

- Typography and readability take priority over decoration
- Content constrained to readable widths (65ch max)
- Responsive design is mobile-first
- Avoid generic AI aesthetics—distinctive and editorial feel required
- CSS custom properties for theming; support light and dark modes
- Professional tone with personal insights—no marketing fluff

**Rationale**: This is a personal site for an engineering leader. The content—writing, insights, professional background—is the value. Design should make content accessible and pleasant to read, not overshadow it.

## Design & Content Standards

### Visual Design

- **Typography**: Serif font (Crimson Text) with 1.618 line height for readability
- **Layout**: Max-width 65ch, centered, adequate whitespace
- **Color Scheme**: CSS custom properties with automatic dark mode via `prefers-color-scheme`
- **Responsive**: Mobile-first breakpoint at 768px
- **No Generic Templates**: Avoid cookie-cutter SaaS/startup aesthetics

### Content Strategy

- Personal/professional site for engineering leadership
- Topics: technology, leadership, healthcare technology
- Professional tone with authentic personal insights
- No hyperbole or marketing language
- Writing section for long-form thought pieces

### Technical Standards

- **Framework**: Next.js 15 with App Router (server components by default)
- **Styling**: Tailwind CSS 4 with inline styles for specific cases
- **Type Safety**: TypeScript strict mode enabled
- **Code Quality**: ESLint with Next.js config, no warnings tolerated
- **Package Manager**: Yarn (v1.18.0)—prefer yarn over npm

## Development Workflow

### Planning & Execution

1. **Understand**: Study existing patterns in the codebase first
2. **Test**: Write test first, ensure it fails (red)
3. **Implement**: Minimal code to pass test (green)
4. **Refactor**: Clean up with tests passing
5. **Commit**: Clear message explaining "why"

### When Stuck (3-Attempt Rule)

After 3 failed attempts:

1. Document what failed and specific error messages
2. Research 2-3 alternative approaches from similar implementations
3. Question fundamentals: wrong abstraction level? Can this be simpler?
4. Try a different architectural pattern or remove abstraction entirely

### Quality Gates

**Every commit MUST**:

- Compile successfully (TypeScript, no errors)
- Pass all existing tests
- Include tests for new functionality
- Pass ESLint with no warnings
- Follow existing code formatting

**Before committing**:

- Run `yarn lint`
- Self-review changes
- Ensure commit message explains context and rationale

### Error Handling

- Fail fast with descriptive error messages
- Include debugging context
- Handle errors at the appropriate level
- Never silently swallow exceptions

## Governance

### Amendment Procedure

1. Propose changes via pull request to `.specify/memory/constitution.md`
2. Document rationale and impact on existing workflows
3. Update dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`)
4. Increment version according to semantic versioning
5. Approval required before merge

### Versioning Policy

- **MAJOR**: Backward-incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance

- All pull requests and code reviews MUST verify constitution compliance
- Complexity violations require explicit justification in `IMPLEMENTATION_PLAN.md`
- Constitution supersedes all other practices
- Development guidance in `CLAUDE.md` files provides runtime context but must align with constitution

**Version**: 1.0.0 | **Ratified**: 2025-01-18 | **Last Amended**: 2025-01-18
