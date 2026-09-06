# online-store

An online store, built on Next.js with a clean, layered backend. The front-end
(Next.js App Router + FSD-style components) is kept strictly separate from
business logic (TypeScript use cases, Drizzle repositories) so the backend
can be extracted to a different runtime later without touching the client.

## Features

- **OTP-based authentication** by email or phone, with a single user table
  for guests and registered users, hashed session tokens, and an
  OTP/rate-limit layer backed by Redis.
- **Layered backend**: Domain is dependency-free, Application orchestrates
  use cases through ports, Infrastructure (Drizzle, Redis, object storage,
  email/SMS) provides the implementations.
- **Feature-Sliced Design** for the front-end — `shared / entities /
features / widgets / pages / app`.
- **Strict TypeScript** with branded identifiers and no `any`.
- **Request-scoped DI** so per-request state cannot leak between users.
- **Transactional use cases** through a Unit-of-Work port that lets domain
  errors pass through unmasked.
- **Unified error handling** via composable middlewares: validation, OTP,
  rate limit, transaction, user-access, invariant, fallback.
- **Container Components** caching model for modern PPR-style data flow.
- **Async background work** through job queues (BullMQ).
- **Structured logging** with Pino.

## Tech Stack

| Concern         | Choice                                        |
| --------------- | --------------------------------------------- |
| Framework       | Next.js (App Router)                          |
| Language        | TypeScript (strict)                           |
| UI              | React, Tailwind CSS                           |
| Database        | PostgreSQL via Drizzle ORM                    |
| Cache / OTP     | Redis                                         |
| Object storage  | S3-compatible (MinIO in development), AWS SDK |
| Email           | Resend                                        |
| Background jobs | BullMQ                                        |
| DI              | Awilix                                        |
| Validation      | Zod                                           |
| Logging         | Pino                                          |
| Image pipeline  | Sharp                                         |
| Tooling         | ESLint, Prettier, Husky, lint-staged          |
| Local stack     | Docker Compose (Postgres, Redis, MinIO)       |

## Project Structure

```
src/
├── app/             Next.js App Router pages and route handlers
├── domain/          Entities, repository interfaces, domain errors
├── application/     Use cases, DTOs, ports
├── infrastructure/  Drizzle, Redis, object storage, email/SMS implementations
├── di/              Composition root
└── common/          Cross-cutting helpers
```

Dependencies flow inward: `app → application → domain`, while
`infrastructure` implements the ports and is wired in through the DI root.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 11+
- Docker + Docker Compose

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and adjust the values if needed. The defaults
are wired to the local Docker Compose stack.

### 3. Start the infrastructure

```bash
pnpm docker:up
```

This brings up Postgres, Redis, and MinIO (with the configured bucket
created automatically). The MinIO console is available at
`http://localhost:9001`.

### 4. Apply database schema and migrations

For local development (sync schema + apply additional SQL helpers):

```bash
pnpm db:push
```

For production-style migrations (generated files + apply additional SQL
helpers):

```bash
pnpm db:full-migrate
```

### 5. Run the dev server

```bash
pnpm dev
```

Open <http://localhost:3000>.

## Available Scripts

All scripts are defined in `package.json` and run with `pnpm <name>`.

### Application

| Script  | Description                  |
| ------- | ---------------------------- |
| `dev`   | Start the Next.js dev server |
| `build` | Production build             |
| `start` | Run the production build     |

### Code quality

| Script         | Description                                       |
| -------------- | ------------------------------------------------- |
| `lint`         | Run ESLint (fails on warnings)                    |
| `lint:fix`     | Run ESLint with `--fix`                           |
| `format`       | Format the codebase with Prettier                 |
| `format:check` | Check Prettier formatting without writing changes |

Pre-commit hooks (Husky + lint-staged) run `lint:fix` and `format` on
staged files automatically.

### Local infrastructure

| Script           | Description                                 |
| ---------------- | ------------------------------------------- |
| `docker:up`      | Start all containers in detached mode       |
| `docker:down`    | Stop and remove the containers              |
| `docker:restart` | Restart the containers                      |
| `docker:logs`    | Follow container logs                       |
| `docker:ps`      | List running containers                     |
| `redis:cli`      | Open a Redis CLI inside the Redis container |

### Database

| Script             | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `db:generate`      | Generate a new migration from the schema                            |
| `db:push`          | Sync the schema with the database (dev) and apply extra SQL helpers |
| `db:migrate`       | Apply pending migrations                                            |
| `db:full-migrate`  | Run migrations followed by extra SQL helpers                        |
| `db:apply-scripts` | Apply additional idempotent SQL helpers                             |
| `db:studio`        | Open the Drizzle Studio web UI                                      |
| `db:drop`          | Drop a migration                                                    |
| `db:check`         | Validate the migration snapshot                                     |

All database commands have `*:verbose` variants (e.g. `db:push:verbose`)
that enable Drizzle's verbose logging.

## License

This project is proprietary software. See the [LICENSE](./LICENSE.md) file for the full terms of use.
**In short:** non‑commercial use is allowed; commercial use is prohibited without explicit permission.
