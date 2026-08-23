# Architecture Overview — hello-word-6

## Scope

`hello-word-6` is a minimal full-stack proof: one PostgreSQL row stores the greeting, Go API reads it, Next.js page renders it centered on plain white background.

No auth, editing, admin UI, analytics, animation, or extra pages.

## Project shape

| Part | Included | Reason |
|---|---:|---|
| Frontend | Yes | Guest needs one browser page. |
| Backend | Yes | Frontend must not read database directly. |
| Database | Yes | Greeting must come from PostgreSQL, not hardcoded frontend copy. |

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js 15 App Router, TypeScript, Tailwind v3 | `code/frontend/`; standalone output for container runtime. |
| Backend | Go 1.22+ HTTP server | `code/backend/`; one main package at `cmd/api`. |
| Database | PostgreSQL 16 | Local compose service; deployed runtime injects `DATABASE_URL`. |
| Containers | Existing Dockerfiles + `docker-compose.yml` | Build contexts stay `code/backend` and `code/frontend`. |
| CI | `.github/workflows/ci.yml` | Runs Go build/vet/test, npm lint/build/test, CSS token checks. |

## Runtime data flow

1. Browser requests Next.js home page.
2. Home feature component calls backend API under `/v1/greeting`.
3. Go backend validates readiness, queries PostgreSQL `greetings` single row.
4. Backend returns JSON success or shared JSON error envelope.
5. Frontend renders exact stored text or error state.

## Repository layout

```text
code/
  backend/
    cmd/api/main.go
    internal/migrations/
    migrations/
      202502140001_create_greetings.up.sql
      202502140001_create_greetings.down.sql
    .env.example
    .gitignore
    Dockerfile
    go.mod
  frontend/
    app/
      globals.css
      layout.tsx
      page.tsx
    .env.example
    .eslintrc.json
    .gitignore
    Dockerfile
    next.config.js
    package.json
    postcss.config.js
    tailwind.config.ts
    tsconfig.json
docs/
  architecture/
    erd.md
    overview.md
    services.md
  home/SRS.md
```

## Backend conventions

- Module path: `github.com/ThanhNV121097/project-af317164/backend`.
- Entry point: `code/backend/cmd/api/main.go` only.
- Migrations live in `code/backend/migrations/` and are embedded by package beside that directory.
- Server reads `DATABASE_URL`, `PORT`, and optional `APP_PORT` from environment.
- Startup order: connect database, apply pending migrations, verify `SELECT 1`, then serve.
- `/healthz` returns 200 only after migrations succeeded and database ping works.
- SQL uses parameterized queries.
- API routes use `/v1/...`; no `/api` prefix inside backend.

## Frontend conventions

- App Router files live under `code/frontend/app/`.
- `app/page.tsx` is composition root only. Story components add one import and one JSX element.
- Server Components stay default. Client Components must start with literal first line `"use client"` before hooks, events, or browser APIs.
- Components use `export default function ComponentName()`.
- Shared visual tokens live only in `app/globals.css`. Story CSS modules may use tokens but must not define shared tokens.
- No hardcoded colors or large px lengths in CSS modules; CI enforces token use.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Routes | Versioned REST path | `/v1/greeting` |
| JSON fields | lower camelCase | `text` |
| Tables | plural snake_case | `greetings` |
| Columns | snake_case | `created_at` |
| Components | PascalCase default export | `GreetingDisplay` |
| Story mock files | kebab-case | `render-centered-hello-word.ts` |

## Environment variables

### Root compose `.env`

| Key | Used by | Required | Purpose |
|---|---|---:|---|
| `POSTGRES_USER` | compose db/backend | No | Local database user override. |
| `POSTGRES_PASSWORD` | compose db/backend | No | Local database password override. |
| `POSTGRES_DB` | compose db/backend | No | Local database name override. |
| `BACKEND_PORT` | compose | No | Host port for backend. |
| `FRONTEND_PORT` | compose | No | Host port for frontend. |
| `NEXT_PUBLIC_API_URL` | frontend build | No | Browser-facing backend base URL. |

### Backend

| Key | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string. |
| `PORT` | No | HTTP listen port; defaults through `APP_PORT`, then `8080`. |
| `APP_PORT` | No | Secondary HTTP port fallback. |

### Frontend

| Key | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | No | API base URL used by browser code. Local default `http://localhost:8080`. |

## Failure handling

| Failure | Backend response | Frontend behavior |
|---|---|---|
| Database unavailable | `503` error envelope | Show error state, no fallback greeting. |
| Greeting row missing | `404` error envelope | Show error state, no hardcoded greeting. |
| Greeting text empty | `422` error envelope | Show error state. |
| Unknown server fault | `500` error envelope | Show error state. |

## Security

- No secrets committed; `.env.example` contains key names and comments only.
- `DATABASE_URL` comes from environment, never assembled from secrets in code.
- Public endpoint returns only configured greeting text.
- Database access uses `database/sql` with parameterized statements.

## Observability

- Backend logs startup, migration failures, and listen failures to stderr.
- Health endpoint checks database each request.
- No metrics stack; project scope is pipeline proof only.

## How to run

```bash
cp .env.example .env
docker compose --profile local up --build
```

Then open `http://localhost:3000`.

Backend health: `http://localhost:8080/healthz`.

## Local checks

```bash
cd code/backend
go build ./...
go vet ./...
go test ./...

cd ../frontend
npm ci
npm run lint
npm run build
npm test --if-present
```

## Decisions

| Decision | Rejected alternative | Tradeoff |
|---|---|---|
| Fullstack shape | Static page with hardcoded text | Required DB/API proof, adds minimal runtime cost. |
| Go backend with `database/sql` + pgx driver | ORM | One table and one read do not need ORM abstraction. |
| Self-migrating backend | Separate migration job | Runtime starts with empty DB; self-migration removes deploy ordering gap. |
| Versioned `/v1` routes | `/api` prefix | Deploy proxy strips `/api`; backend must serve unprefixed version route. |
| Next.js Server Component composition root | Client root | Keeps browser JS minimal; feature component can opt into client only if needed. |
| CSS tokens in `globals.css` | Per-component hardcoded values | CI catches token drift; story authors avoid shared CSS edits. |

## Risks and unknowns

- Exact frontend error copy is not specified; use minimal non-greeting error state until PM clarifies.
- Migrations are enough for one table now; if concurrent deploys appear, add advisory lock around migration runner.
- No caching needed; add only if API latency becomes measured issue.
