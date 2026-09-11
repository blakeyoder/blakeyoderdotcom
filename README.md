# blakeyoder.com

Blake Yoder's personal site. Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, deployed on Vercel.

## Getting started

This project uses [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

The dev server runs at http://localhost:3000.

## Environment

Copy `env.example` to `.env.local` and fill it in. Only the contact form needs
these; the rest of the site builds and runs without them.

| Variable                  | Required          | Purpose                                          |
| ------------------------- | ----------------- | ------------------------------------------------ |
| `RESEND_API_KEY`          | yes, to send mail | Resend API key                                   |
| `CONTACT_EMAIL_TO`        | yes, to send mail | Where contact submissions are delivered          |
| `CONTACT_EMAIL_FROM`      | no                | Sender address, defaults to `noreply@resend.dev` |
| `RATE_LIMIT_WINDOW_MS`    | no                | Submission window, defaults to 5 minutes         |
| `RATE_LIMIT_MAX_REQUESTS` | no                | Submissions per window, defaults to 1            |

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `bun run dev`       | Dev server with Turbopack           |
| `bun run build`     | Production build                    |
| `bun run start`     | Serve the production build          |
| `bun test`          | Run the test suite                  |
| `bun run typecheck` | `tsc --noEmit` across src and tests |
| `bun run lint`      | ESLint                              |
| `bun run format`    | Prettier, writing in place          |
| `bun run knip`      | Dead code and dependency detection  |

CI runs typecheck, lint, format check, tests, knip, and a build on every push
and pull request.

## Structure

```
src/
├── app/              # Routes (App Router)
│   ├── api/          # Contact submission and LinkedIn preview endpoints
│   ├── og/           # Dynamic Open Graph image generation
│   ├── sitemap.ts    # Generated sitemap
│   └── robots.ts     # Generated robots.txt
├── components/       # Shared UI
└── lib/              # Config, validation, email, rate limiting, motions
```

## Notes

- Fonts are EB Garamond (display), Source Serif 4 (body), and IBM Plex Mono,
  loaded through `next/font`.
- `src/app/globals.css` puts its element styles in `@layer base` on purpose.
  Unlayered rules would outrank every Tailwind utility and component class.
- Retired `/writing` URLs are redirected in `next.config.ts`.
