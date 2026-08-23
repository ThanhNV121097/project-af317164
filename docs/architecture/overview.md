# Architecture Overview — hello-word-6

## Scope

`hello-word-6` is one full-stack proof page. Frontend renders one centered value. Backend reads one row from PostgreSQL. Database stores greeting text.

No auth, editing, analytics, animation, theming, queues, workers, or admin UI.

## Stack

| Layer | Choice | Version | Reason |
|---|---|---:|---|
| Frontend | Next.js App Router + TypeScript | 15.x | Default stack, server rendering, small UI |
| Styling | Tailwind CSS + CSS tokens | v3 | Default styling, CI token checks |
| Backend | Go HTTP server | 1.22 | Default stack, small binary, simple API |
| Database | PostgreSQL | 16 | Required source of truth for greeting row |
| Local run | `docker compose up` | Compose v2 | Boots DB, backend, frontend together |
| CI | `.github/workflows/ci.yml` | existing | Runs build, vet, tests, lint, token checks |

## Runtime shape

```text
browser
  │ GET /
  ▼
Next.js frontend
  │ GET {NEXT_PUBLIC_API_URL}/v1/greeting
  ▼
Go backend
  │ SELECT text FROM greetings WHERE id = 1
  ▼
PostgreSQL
```

## Repository layout

```text
code/
  backend/
    cmd/api/main.go              # one main package, server entrypoint
    internal/migrate/            # embedded SQL migration runner
    migrations/                  # timestamped .up.sql/.down.sql files
    go.mod
    .env.example
    Dockerfile
  frontend/
    app/layout.tsx               # root layout only
    app/page.tsx                 # composition root only
    app/globals.css              # finished shared tokens and base styles
    package.json
    next.config.js
    tailwind.config.ts
    postcss.config.js
    tsconfig.json
    .env.example
    Dockerfile
docs/
  architecture/
    overview.md
    erd.md
    services.md
```

## Backend conventions

- One Go module at `code/backend`.
- Exactly one `main` package: `code/backend/cmd/api`.
- Standard `net/http` router only until need proves otherwise.
- All routes mount without `/api` prefix. Public contract paths start with `/v1/...`.
- Startup order:
  1. Read `DATABASE_URL`.
  2. Open PostgreSQL connection.
  3. Apply all pending migrations from embedded `migrations/` files.
  4. Verify database with `SELECT 1`.
  5. Listen on `PORT`, then `APP_PORT`, then `8080`.
- `/healthz` returns 200 only after migrations and database ping succeed.
- SQL uses parameterized queries.
- External errors return generic JSON error envelope.

## Frontend conventions

- Next.js App Router files live under `code/frontend/app`.
- `app/page.tsx` stays server component and composition root.
- Story components use `export default function ComponentName()`.
- Components using hooks, events, or browser APIs start with first line `"use client"`.
- Shared tokens and base styles live only in `app/globals.css`.
- Story CSS modules may use only tokens already defined in `globals.css`; no token fallbacks.
- Frontend reads only `NEXT_PUBLIC_API_URL` for backend origin.

## Data conventions

- PostgreSQL owns greeting text.
- `greetings.id = 1` is canonical singleton row.
- Migrations are timestamped and applied in filename order.
- Applied versions are stored in `schema_migrations`.
- Re-running migrations is no-op.

## Environment variables

### Root compose

| Key | Used by | Purpose |
|---|---|---|
| `POSTGRES_USER` | db/backend | Local database user |
| `POSTGRES_PASSWORD` | db/backend | Local database password |
| `POSTGRES_DB` | db/backend | Local database name |
| `BACKEND_PORT` | compose | Host port for backend |
| `FRONTEND_PORT` | compose | Host port for frontend |
| `NEXT_PUBLIC_API_URL` | frontend | Browser-visible backend base URL |

### Backend

| Key | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `PORT` | runtime | HTTP listen port |
| `APP_PORT` | fallback | HTTP listen port fallback |

### Frontend

| Key | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | yes | Backend base URL visible to browser |

## Local run

```bash
cp .env.example .env
cp code/backend/.env.example code/backend/.env
cp code/frontend/.env.example code/frontend/.env.local
docker compose --profile local up --build
```

Open frontend at `http://localhost:3000`. Backend health check: `http://localhost:8080/healthz`.

## Checks

Backend:

```bash
cd code/backend
go mod download
go build ./...
go vet ./...
go test ./...
```

Frontend:

```bash
cd code/frontend
npm ci
npm run lint
npm run build
npm test --if-present
```

## Decisions

| Decision | Rejected alternative | Tradeoff |
|---|---|---|
| Fullstack shape | Static hardcoded page | Required data source is PostgreSQL through API |
| Go `net/http` server | Gin/Echo/Fiber | Less dependency surface; few endpoints need no framework |
| PostgreSQL singleton row | Frontend constant or env var | Meets requirement that copy is stored data |
| Self-migrating backend | Separate migration job | Runtime starts with empty DB; one binary guarantees schema exists |
| JSON error envelope | Plain text errors | Consistent frontend handling; tiny extra code |
| Tailwind v3 + CSS tokens | Component hardcoded CSS | CI can enforce design values |
| `NEXT_PUBLIC_API_URL` | Relative-only fetch | Local browser must reach backend host port; deploy may set `/api` |

## Risks and constraints

| Risk | Handling |
|---|---|
| Empty database on first boot | Backend applies embedded migrations before health turns green |
| Backend marked healthy without DB | `/healthz` runs database ping after migration success |
| Token drift in story CSS | CI checks CSS modules for hardcoded values and undefined tokens |
| `/api` route mismatch | Contracts and backend use `/v1/...`; deploy proxy owns `/api` stripping |
| Overbuilt feature work in scaffold | Scaffold stops at health and blank composition shell; feature story mounts UI later |

## Unknowns

- Exact error copy for unavailable greeting is product-open. Until decided, frontend story should show minimal error state without fallback greeting.
