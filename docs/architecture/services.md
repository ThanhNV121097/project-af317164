# Services — hello-word-6

## API conventions

- Backend serves versioned paths without `/api` prefix.
- All JSON responses use `application/json`.
- Public endpoints require no authentication.

## Error envelope

```json
{
  "error": {
    "code": "greeting_unavailable",
    "message": "Greeting is unavailable."
  }
}
```

| Field | Type | Rule |
|---|---|---|
| `error.code` | string | Stable snake_case machine code. |
| `error.message` | string | Safe user-facing message, no internal details. |

## Endpoints

### `GET /healthz`

Readiness check. Returns 200 only after migrations succeeded and database `SELECT 1` works.

Request: none.

Success response `200 text/plain`:

```text
ok
```

Failure response: non-200 plain text or unavailable connection. Compose treats as unhealthy.

### `GET /v1/greeting`

Returns stored greeting for home page.

Request: none.

Success response `200`:

```json
{
  "text": "Hello Word"
}
```

| Field | Type | Rule |
|---|---|---|
| `text` | string | Exact stored value from PostgreSQL row `greetings.id = 1`. |

Error responses:

| Status | `error.code` | Cause |
|---:|---|---|
| `404` | `greeting_not_found` | Greeting row does not exist. |
| `422` | `greeting_empty` | Greeting text is empty. |
| `503` | `greeting_unavailable` | Database cannot be reached or queried. |
| `500` | `internal_error` | Unexpected server failure. |

## Frontend integration

Frontend reads `NEXT_PUBLIC_API_URL` and calls `${NEXT_PUBLIC_API_URL}/v1/greeting`.

If API call fails, frontend renders error state and must not display hardcoded `Hello Word` fallback.
