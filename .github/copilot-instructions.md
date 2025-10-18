Project: GDGC Dev Platform

This repository is a Next.js (app directory) web app using Drizzle ORM and the `better-auth` library for authentication. The guidance below is concise and tailored to help an AI coding agent be immediately productive in this codebase.

Key points
- Framework: Next.js (v15, app router). Pages live under `app/` with server components by default.
- Database: Postgres via `drizzle-orm` with SQL migrations in `drizzle/` and schema in `lib/database/schema.ts`.
- Auth: `better-auth` configured in `lib/auth/index.ts`, using the Drizzle adapter. Server-side auth helpers live in `lib/auth/actions.ts`.
- Components: UI and small primitives live in `components/` and `components/ui/`.

Common workflows and commands
- Dev server: `npm run dev` (Next.js dev with turbopack).
- Build: `npm run build` then `npm run start` for production.
- Migrations: SQL migration files are in `drizzle/`. Use `drizzle-kit` as configured in devDependencies for migration tasks (follow local conventions; repository has a SQL snapshot `drizzle/meta`).

Project-specific conventions
- App router and server/client boundaries: Files in `app/` are server components by default. When calling browser-only APIs or using state/hooks, create a client component by adding `"use client"` at the top.
- Server actions: Authentication and other privileged ops use server actions (see `lib/auth/actions.ts` which declares `"use server"`). Prefer server actions for database and auth operations invoked from forms or UI.
- Absolute imports: Code uses TS path aliases like `@/lib/...` and `@/components/...` — preserve these when moving files.
- Environment variables: Secrets (DB URL, OAuth client IDs/secrets) live in environment variables and are referenced directly in code (see `lib/auth/index.ts` and `lib/database/index.ts`). Don't hardcode secrets in code or generated examples.

Important files to inspect when making changes
- `package.json` — scripts and dependency list.
- `app/` — application routes, API folder (see `app/api/auth/[...all]/route.ts`), pages and layouts.
- `lib/auth/index.ts` — auth configuration (social providers, adapter). Changes here affect global auth behavior.
- `lib/auth/actions.ts` — server actions wrappers used by forms/components for sign-in/up/out and session retrieval.
- `lib/database/index.ts` and `lib/database/schema.ts` — DB connection and table schemas used by Drizzle.
- `drizzle/` — migration SQL files and metadata.

Patterns and examples
- Sign-in flow (server action): `components/sign-in-form.tsx` calls server action in `lib/auth/actions.ts` which in turn calls `auth.api.signInEmail` with the request headers when needed.
- Social sign-in: helpers `signInWithGitHub` and `signInWithGoogle` in `lib/auth/actions.ts` call `auth.api.signInSocial({ provider: 'github'|'google' })`. OAuth client IDs are read from env vars in `lib/auth/index.ts`.
- DB usage: use `db` exported from `lib/database/index.ts` and Drizzle schema exports for queries. Migrations are raw SQL in `drizzle/`.

Code generation rules for AI
- Keep changes minimal and localized. Respect server vs client boundaries: moving code that uses `headers()` or database into a client component is a bug.
- When adding routes in `app/api/...`, use Next's Route Handlers pattern (export default functions for GET/POST). See existing `app/api/auth/[...all]/route.ts` for example.
- Use existing UI components in `components/ui/` for consistency (Buttons, Inputs, Card, etc.). Prefer composition over creating new primitive styles.
- Use TypeScript types already declared in `lib/auth/actions.ts` for auth payloads (e.g., `UserSignInData`). Reuse exports from `lib/database` for types where available.

Testing, linting, and quality gates
- There is no explicit test runner configured. Keep changes type-safe (TypeScript) and run the project locally to validate behavior.
- Run `npm run dev` to check the app compiles and server actions execute. If adding DB queries, ensure `DATABASE_URL` is provided and migrations applied.

Edge cases and constraints
- This codebase mixes server components and server actions heavily. Avoid introducing client-only libraries into server code (for example, DOM APIs or window/document usage in `lib/*`).
- Auth uses `better-auth` with the Next cookies plugin. Changing cookie or session behavior likely requires touching `lib/auth/index.ts` and may require DB migrations.

If you modify or add migrations
- Add SQL files under `drizzle/` and update the `drizzle/meta` snapshot if your change requires it. Follow existing naming conventions (timestamps or readable prefixes).

When in doubt, read these files first: `lib/auth/index.ts`, `lib/auth/actions.ts`, `lib/database/index.ts`, `drizzle/0000_blue_charles_xavier.sql`, and any component in `components/` that will render UI for your change.

If anything in this doc is unclear or you want the agent to follow different constraints (strict testing, code style, or commit message format), tell me and I will iterate.
