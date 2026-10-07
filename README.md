# GDGC Dev Platform

The GDGC NIT Jalandhar club website. A place to build digital solutions together.

The app uses Next.js, TypeScript, Tailwind CSS, PostgreSQL, Drizzle, and Better Auth.

## Start development

1. Follow the [local setup guide](docs/development.md).
2. Start the process list:

   ```sh
   npm run mprocs
   ```

3. Open [the local website](http://localhost:3000).

## Project guides

- [Local setup and commands](docs/development.md)
- [Environment settings](docs/environment.md)
- [Code map](docs/architecture.md)
- [Website design](docs/design.md)
- [Home-page content and photos](docs/homepage-content.md)
- [Branches and pull requests](CONTRIBUTING.md)

## Branch workflow

- `develop` is the integration branch. Task work starts here.
- `main` is production. It receives an occasional release from `develop`.
- Start every task on a new branch from the latest `develop`, with a name that says what the task does, such as `feat/landing-hero` or `fix/mobile-navigation`.
- Open the pull request into `develop`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for validation and release steps.
