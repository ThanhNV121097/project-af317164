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
| `text` | `text` | not null, check (`length(text) > 0`) | Exact visible copy |
| `created_at` | `timestamptz` | not null default `now()` | Creation time |
| `updated_at` | `timestamptz` | not null default `now()` | Last update time |

## Relationships

None. `greetings` is standalone singleton data.

## Seed data

Initial migration inserts:

| Table | Values |
|---|---|
| `greetings` | `id = 1`, `text = 'Hello Word'` |

## Notes

- Missing row is error state, not fallback text.
- Empty text is rejected by database constraint.
- Last saved row value is source of truth if later editing exists.
