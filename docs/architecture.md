# Code map

The app uses the Next.js App Router.
Pages use server components unless they declare `"use client"`.

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Club home page |
| `app/layout.tsx` | Shared page layout, fonts, navigation, and theme |
| `app/template.tsx` | Short fade when moving between pages. The header stays still. |
| `app/alumni/` | Alumni page, grouped by graduating batch |
| `app/events/` | Searchable archive, shared event page, challenge archive, scoped styles, and registration server action |
| `app/forms/mobile26/` | Unlisted app-dev response form. It is not linked from navigation or events. |
| `app/(auth)/` | Sign-in and sign-up pages |
| `app/(dashboard)/` | Dashboard pages |
| `app/api/auth/[...all]/route.ts` | Better Auth request handlers |
| `app/actions/auth.ts` | Server actions for authentication |
| `components/` | Website components |
| `components/ui/` | Shared UI components |
| `components/home-hero.tsx`, `components/home/` | Home-page sections, artwork, and photo frames |
| `lib/content/home.ts` | Faculty coordinators, departments, leads, gallery items, common questions, and community links |
| `lib/content/events/` | Validated event registry and one content file per event |
| `lib/events/` | Event schema and types, authoring presets, display helpers, registration availability checks, and tests |
| `components/events/` | Shared carousel, event cards, directory filters, content sections, registration form, and challenge viewer |
| `lib/content/problem-statements.ts` | Challenge archive lookup derived from event sections |
| `lib/content/alumni.ts` | Alumni roster and batch grouping |
| `app/home.css` | Home-page and navigation styles |
| `app/fonts/google-sans/` | Local home-page font and its license |
| `lib/auth/` | Server and client auth configuration |
| `lib/database/` | Database connection, schema, and relations |
| `drizzle/` | Database migrations and metadata |
| `middleware.ts` | Route checks for protected pages |

## Data flow

Auth forms call server actions or the Better Auth client.
Better Auth uses the Drizzle adapter to access PostgreSQL.
Event content is stored in typed files, validated with Zod on import. Published
records supply the homepage, archive, event pages, and challenge pages. Drafts do
not appear in public lookups or static route parameters. Section types determine
rendering; no route contains special cases for event slugs. The client archive
receives only card summaries rather than full challenge specifications.

The homepage, event archive, and event pages revalidate every 60 seconds so timed
featuring and registration actions refresh. The registration server action checks
availability again on every submission, including the opening/closing window,
explicit event state, and known event end time. Event registration uses the same
database and stores one row per sign-up. Event IDs stay stable independently of
URL slugs; the migration preserves all existing IDs and URLs.
The app reads `DATABASE_URL` when it creates the database connection pool.
A remote database also uses the CA certificate at `DATABASE_CA_PATH`.

Keep database code and server auth helpers in server components, server actions, or request handlers.
Use named `GET` and `POST` exports for App Router request handlers.

## Setup files

| Path | Purpose |
| --- | --- |
| `.nvmrc` | Development Node.js version |
| `.env.example` | Local environment settings |
| `compose.dev.yaml` | Local PostgreSQL service |
| `mprocs.yaml` | Development process list |
| `Makefile` | Optional command shortcuts |
| `drizzle.config.ts` | Migration and Studio settings |
| `.github/workflows/ci.yml` | PR and branch checks |
| `.github/workflows/deploy.yml` | Production deploy after a merge to `main` |
| `deploy/` | Instance bootstrap and the restricted deploy command |
