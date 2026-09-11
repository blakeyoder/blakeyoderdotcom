# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Blake Yoder's personal website built with Next.js 15 and TypeScript. It's a minimal, content-focused site with home, about, bookmarks, now, contact, and vim pages.

## Development Commands

- **Development server**: `bun run dev` (uses Next.js with Turbopack for faster builds)
- **Build**: `bun run build`
- **Production server**: `bun run start`
- **Linting**: `bun run lint` (uses ESLint with Next.js config)
- **Type checking**: `bun run typecheck`
- **Tests**: `bun test` (Bun test runner; DOM tests use happy-dom)
- **Dead code detection**: `bun run knip`
- **Package manager**: Bun

## Architecture & Structure

### Framework & Dependencies

- **Next.js 15** with App Router (not Pages Router)
- **React 19**
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS 4** for styling
- **EB Garamond** (display), **Source Serif 4** (body), **IBM Plex Mono** (mono), loaded via next/font

### File Structure

```
src/app/
├── layout.tsx                 # Root layout with font and metadata
├── page.tsx                   # Home page
├── globals.css                # Global styles with CSS custom properties
├── not-found.tsx              # 404 page
├── about/page.tsx             # About page
├── howdy/page.tsx             # What I do, for prospective clients
├── sitemap.ts                 # Generated sitemap
├── robots.ts                  # Generated robots.txt
├── bookmarks/                 # Curated links (client component + metadata layout)
├── now/page.tsx               # Now page
├── contact/page.tsx           # Contact form (client component)
├── vim/                       # Interactive vim tutorial (client component + layout)
├── og/route.tsx               # Dynamic Open Graph image generation
└── api/
    ├── contact/route.ts       # Contact form submission
    └── linkedin-preview/route.ts
```

### Design System

- **Typography**: EB Garamond for headings, Source Serif 4 for body, 1.7 line height
- **Layout**: Content constrained to 680px (900px for wide pages), centered
- **Color scheme**: CSS custom properties with automatic dark mode via `prefers-color-scheme`
- **Responsive**: Mobile-first, with breakpoints at 480px and 768px

### Code Patterns

- **Components**: Pages are server components by default; contact, bookmarks, and vim are client components
- **Styling**: Mix of Tailwind utilities and design-system classes in `globals.css`
- **CSS layers**: element styles live in `@layer base`. Do not move them out; unlayered rules outrank every Tailwind utility and component class
- **Navigation**: Uses Next.js `Link` component for internal navigation
- **Metadata**: Centralized in root layout.tsx

### Content Strategy

- Personal/professional site for an engineering leader
- Focus on technology, leadership, and healthcare technology
- Professional tone with personal insights

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target ES2017 with modern module resolution

## Active Technologies

- TypeScript 5 with Next.js 15 + Next.js 15, React 19, Resend SDK (001-contact-email)
- In-memory rate limiting (Redis or Vercel KV for production scale if needed) (001-contact-email)

## Recent Changes

- 001-contact-email: Added TypeScript 5 with Next.js 15 + Next.js 15, React 19, Resend SDK
