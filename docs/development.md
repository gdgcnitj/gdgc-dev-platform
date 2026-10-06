# Local development

## Required tools

| Tool | Purpose |
| --- | --- |
| Node.js 22 and npm | Run the app and checks |
| Docker with Compose v2 | Run local PostgreSQL |
| mprocs | Control the process list |
| Make | Run optional command shortcuts |

Use [the mprocs install guide](https://github.com/pvolok/dekit/blob/master/README-mprocs.md#installation) for other platforms.
On macOS, install mprocs with Homebrew:

```sh
brew install mprocs
```

## First setup

1. Start your Docker engine.
2. Select the project Node.js version:

   ```sh
   nvm install
   nvm use
   ```

3. Install the project packages:

   ```sh
   npm ci
   ```

4. If `.env` does not exist, copy the environment example:

   ```sh
   cp .env.example .env
   ```

5. Make an auth secret:

   ```sh
   openssl rand -hex 32
   ```

6. Set `BETTER_AUTH_SECRET` in `.env` to the generated value.
7. Start the local database:

   ```sh
   npm run db:up
   ```

8. Apply the database migrations:

   ```sh
   npm run db:migrate
   ```

9. Start the process list:

   ```sh
   npm run mprocs
   ```

10. Open [the local website](http://localhost:3000).

The database uses host port `5433` by default.
Its named Docker volume keeps data between sessions.
See [the environment guide](environment.md) for port and sign-in settings.

## Process list

| Process | Starts automatically | Command |
| --- | --- | --- |
| `database` | Yes | `npm run db:dev` |
| `web` | Yes | `npm run dev` |
| `database-studio` | No | `npm run db:studio` |
| `checks` | No | `npm run check` |

Use the arrow keys to select a process.
Press `s` to start it.
Press `r` to restart it.
Press `q` to stop the processes and exit mprocs.

The database process uses Docker Compose in the foreground.
Stopping that process stops its PostgreSQL container.
The named volume remains available for the next session.
If a container remains active, run `npm run db:down` to stop it.

## Other commands

| Command | Result |
| --- | --- |
| `npm run dev` | Start only Next.js |
| `npm run dev:all` | Start mprocs |
| `npm run check` | Run lint and type checks |
| `npm run build` | Make a production build |
| `npm run db:up` | Start PostgreSQL and wait for its health check |
| `npm run db:down` | Stop PostgreSQL and keep its data |
| `npm run db:logs` | Follow PostgreSQL logs |
| `npm run db:generate` | Make a migration from schema changes |
| `npm run db:migrate` | Apply existing migrations |
| `npm run db:studio` | Start Drizzle Studio |
| `make help` | Show Make shortcuts |

The type check first generates the Next.js declarations.
It therefore works in a new checkout without an earlier build.

## Common problems

| Problem | Action |
| --- | --- |
| Docker cannot connect to its engine | Start Docker Desktop or Colima |
| Host port `5433` is busy | Change `POSTGRES_PORT` and `DATABASE_URL` in `.env` |
| `mprocs` is missing | Install mprocs and check your `PATH` |
| `DATABASE_URL` is missing | Complete the environment setup |
| A database table is missing | Run `npm run db:migrate` |
| Social sign-in fails | Check the provider settings in the environment guide |

To use a custom process list, copy `mprocs.yaml` to `mprocs.local.yaml`.
Then run `mprocs --config mprocs.local.yaml`.
Git ignores the local process file.
