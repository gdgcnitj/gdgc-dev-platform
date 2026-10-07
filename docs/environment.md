# Environment settings

Use `.env` for local settings.
Next.js and the Drizzle configuration read this file.
Git ignores `.env` and keeps `.env.example` as the shared example.

| Variable | Purpose | Local example |
| --- | --- | --- |
| `POSTGRES_DB` | Docker database name | `gdgc_dev` |
| `POSTGRES_USER` | Docker database user | `gdgc` |
| `POSTGRES_PASSWORD` | Docker database password | `gdgc_dev` |
| `POSTGRES_PORT` | Host port for Docker PostgreSQL | `5433` |
| `DATABASE_URL` | App and Drizzle database connection | See `.env.example` |
| `BETTER_AUTH_URL` | App origin for authentication | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Auth signing secret | Generate at least 32 characters |
| `GITHUB_CLIENT_ID` | GitHub OAuth app identifier | Provider value |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | Provider value |
| `GOOGLE_CLIENT_ID` | Google OAuth app identifier | Provider value |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Provider value |

The example database password applies only to local development.
Production reads `/etc/gdgc/env` on the `gdgc-web` instance. That file stays on
the server. See [deployment](deployment.md).

## Change the database port

1. Stop the local database with `npm run db:down`.
2. Set `POSTGRES_PORT` to the new host port.
3. Set the same port in `DATABASE_URL`.
4. Start the database with `npm run db:up`.
5. Restart the app.

Docker credentials initialize a new volume.
Changing these values does not change users or passwords in an existing volume.

## Social sign-in

Set a provider's client ID and secret to test that provider.
Use these callback URLs for local development:

| Provider | Callback URL |
| --- | --- |
| GitHub | `http://localhost:3000/api/auth/callback/github` |
| Google | `http://localhost:3000/api/auth/callback/google` |

Email and password sign-in uses the local PostgreSQL database.
Missing OAuth settings produce provider warnings during a local build.
