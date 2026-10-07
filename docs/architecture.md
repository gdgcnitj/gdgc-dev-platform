# Code map

The app uses the Next.js App Router.
Pages use server components unless they declare `"use client"`.

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Club home page |
| `app/layout.tsx` | Shared page layout, fonts, navigation, and theme |
| `app/alumni/` | Alumni page |
| `app/(auth)/` | Sign-in and sign-up pages |
| `app/(dashboard)/` | Dashboard pages |
| `app/api/auth/[...all]/route.ts` | Better Auth request handlers |
| `app/actions/auth.ts` | Server actions for authentication |
| `components/` | Website components |
| `components/ui/` | Shared UI components |
| `components/home-hero.tsx`, `components/home/` | Home-page sections, artwork, and photo frames |
| `lib/content/home.ts` | Events, departments, leads, gallery items, common questions, and community links |
| `app/home.css` | Home-page and navigation styles |
| `app/fonts/google-sans/` | Local home-page font and its license |
| `lib/auth/` | Server and client auth configuration |
| `lib/database/` | Database connection, schema, and relations |
| `drizzle/` | Database migrations and metadata |
| `middleware.ts` | Route checks for protected pages |

## Data flow

Auth forms call server actions or the Better Auth client.
Better Auth uses the Drizzle adapter to access PostgreSQL.
The app reads `DATABASE_URL` when it creates the database connection pool.

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
