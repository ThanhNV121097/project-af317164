# ERD — hello-word-6

## Scope

Database stores one greeting row used by home page. No users, no audit trail, no editing workflow.

## Tables

### `schema_migrations`

Tracks backend-applied SQL migrations.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `version` | `text` | primary key | Migration filename without suffix |
| `applied_at` | `timestamptz` | not null default `now()` | Application time |

### `greetings`

Stores visible greeting text.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `smallint` | primary key, check (`id = 1`) | Singleton row |
| `text` | `text` | not null, check (`length(text) > 0`) | Exact visible copy returned as `text` by `GET /v1/greeting` |
| `created_at` | `timestamptz` | not null default `now()` | Creation time |
| `updated_at` | `timestamptz` | not null default `now()` | Last update time |

## Relationships

None. `greetings` is standalone singleton data.

## Indexes

No secondary indexes. Primary key on `greetings.id` serves singleton lookup query: `SELECT text FROM greetings WHERE id = 1`.

## Seed data

Initial migration inserts:

| Table | Values |
|---|---|
| `greetings` | `id = 1`, `text = 'Hello Word'` |

## Story support: Render centered Hello Word

`HOME-001` needs only existing singleton `greetings` row. Reviewed UI mock returns:

```ts
type GreetingResponse = {
  text: string;
};
```

Schema source for that API field is `greetings.text`.

No new tables, columns, foreign keys, or indexes are needed for this story.

## Migration plan

Forward:

1. Create `schema_migrations` if migration runner does not create it separately.
2. Create `greetings` with singleton `id = 1` check, non-empty `text` check, timestamps, and primary key.
3. Insert seed row `id = 1`, `text = 'Hello Word'`.

Backward:

1. Drop `greetings`.
2. Drop `schema_migrations` only if owned by this project's initial migration runner.

Safety on populated tables:

- Forward migration is safe on empty database, which is initial deploy state.
- Forward migration is not safe to re-run without `IF NOT EXISTS` and idempotent seed insert; backend migrations must record applied versions in `schema_migrations`.
- Backward migration deletes stored greeting data. Safe only before production data matters or after backup/export.

## Notes

- Missing row is error state, not fallback text.
- Empty text is rejected by database constraint.
- Last saved row value is source of truth if later editing exists.
