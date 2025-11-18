# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Blake Yoder's personal website built with Next.js 15 and TypeScript. It's a minimal, content-focused site with three main sections: home, about, and writing pages.

## Development Commands

- **Development server**: `yarn dev` (uses Next.js with Turbopack for faster builds)
- **Build**: `yarn build` 
- **Production server**: `yarn start`
- **Linting**: `yarn lint` (uses ESLint with Next.js config)
- **Package manager**: Uses Yarn (version 1.18.0) - prefer yarn over npm

## Architecture & Structure

### Framework & Dependencies
- **Next.js 15** with App Router (not Pages Router)
- **React 19** 
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS 4** for styling
- **Crimson Text** Google Font (serif, loaded via next/font)

### File Structure
```
src/app/
├── layout.tsx          # Root layout with font and metadata
├── page.tsx            # Home page
├── globals.css         # Global styles with CSS custom properties
├── about/page.tsx      # About page
└── writing/page.tsx    # Writing/blog page
```

### Design System
- **Typography**: Uses Crimson Text serif font with 1.618 line height
- **Layout**: Content constrained to 65ch width, centered
- **Color scheme**: CSS custom properties with automatic dark mode via `prefers-color-scheme`
- **Responsive**: Mobile-first with breakpoint at 768px

### Code Patterns
- **Components**: All pages are server components (no "use client" directives)
- **Styling**: Mix of Tailwind utilities and inline styles for specific cases
- **Navigation**: Uses Next.js `Link` component for internal navigation
- **Metadata**: Centralized in root layout.tsx

### Content Strategy
- Personal/professional site for an engineering leader
- Focus on technology, leadership, and healthcare technology
- Writing section is placeholder (coming soon)
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
