# GDGC Dev Platform

The GDGC NIT Jalandhar club website. A place to build digital solutions together.

## Development

```sh
npm ci
npm run dev
```

The app uses Next.js, TypeScript, Tailwind CSS, PostgreSQL, Drizzle, and Better Auth.
Database and OAuth settings are supplied through local environment variables.

## Branch workflow

- `develop` is the integration branch and intended GitHub default.
- `main` is the production branch. It receives deliberate releases from `develop`.
- Start every task on a new, descriptive branch from the latest `develop`.
- Push the task branch, open a PR into `develop`, and merge after validation.

See [CONTRIBUTING.md](CONTRIBUTING.md) for task, validation, and release steps.
