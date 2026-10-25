# Godswill Francis — Portfolio

Personal portfolio of Godswill Francis, a software developer (web, mobile, backend and cloud) based in Lagos, Nigeria. It has an animated
home page, case-study pages, and a private admin for managing content and watching who visits.

**Stack:** Next.js 13 (pages router) · React 18 · TypeScript · styled-components · GSAP (ScrollTrigger,
SplitText) · Lenis smooth scroll · framer-motion · Supabase (Postgres, Auth, Storage, Realtime).

## Features

- **Animated front end:** preloader, glyph-portrait hero with a lens, scroll-driven sections, a liquid cursor,
  and a live "Someone joined / left" presence card.
- **Admin at `/admin`:** create, edit and delete projects (cover and gallery uploads), edit the About text,
  and read messages from the contact form. Saves update the live site immediately.
- **Analytics:** a private dashboard showing who visits and what they care about (see below).
- **Fallback content:** if Supabase isn't configured, the site uses `src/data/projects.ts`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Requires Node 24.x (pinned in `package.json` for Vercel).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run type-check` | TypeScript check |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Where to find it | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page (publishable key) | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page (secret key) | **Server only.** Never prefix with `NEXT_PUBLIC_` |
| `ADMIN_EMAILS` | You choose | Comma-separated. Only these Supabase Auth users can use `/admin` |

Locally these go in `.env.local` (git-ignored). On Vercel, add them under **Project → Settings →
Environment Variables** and redeploy. GitHub Actions secrets are not used for this.

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run in order: `supabase/schema.sql`, `supabase/analytics.sql`, then
   `supabase/analytics-v2.sql`. All are safe to re-run.
3. In **Authentication**, create your admin user (email and password) matching `ADMIN_EMAILS`.
4. Run the app and sign in at `/admin`.

Content is stored in the `projects`, `site_content` and `messages` tables and the `portfolio` storage
bucket. Pages use ISR (`revalidate: 60`) plus on-demand revalidation when you save in the admin.

## Analytics

Anonymous and cookie-less. It exists to show which projects visitors spend time on and whether a visit looks
like genuine interest.

**Measured:** pages viewed, active time (tab visible and recently used), scroll depth, project engagement,
clicks on email, resume, social and outbound links, contact-form starts and submissions, where visitors
arrive from (referrer, UTM), country and city, device, browser, language, and returning visitors.
**Issues:** JavaScript errors, broken files, 404s, rage clicks and slow loads.

The admin **Analytics** tab has Overview, Projects, Visitors, Audience and Issues views, a 1/7/30/90-day
range, and a heat score (hot, warm, casual, bounced) per visit. It can't identify a person or company; the
score is the substitute.

**Privacy:** no IP addresses are stored, and no cookies are set. A random ID in browser storage tells visits
apart. Do Not Track is respected, and your own admin browser and localhost are excluded. Bots are filtered.
Location comes from Vercel's edge headers, so it only appears on the deployed site. Coordinates are never
collected.

**Retention:** `supabase/analytics-retention.sql` deletes data older than 12 months. Run it on demand or
schedule it.

**Known limits:** private windows and cleared storage count as new visitors, ad blockers may block
`/api/collect`, and VPNs or mobile networks can show the wrong city.

## Deploying

Deploy on Vercel with the environment variables above. `next.config.js` and the `engines` field in
`package.json` pin the Node version.

## Project structure

```
src/
  components/   home, header, preloader, cursor, presence, analytics, admin, page shells
  lib/          Supabase clients, analytics tracker and report, rate limiting, auth
  pages/        site pages, /admin, and API routes (contact, collect, admin/*)
  data/         fallback projects
supabase/       SQL for the schema, analytics and retention
```
