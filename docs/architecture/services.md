# Service Contracts — hello-word-6

## Scope

Backend exposes health and greeting read endpoint. Paths intentionally omit `/api`; deployment proxy strips `/api` before backend receives request.

## Common response headers

| Header | Value |
|---|---|
| `Content-Type` | `application/json; charset=utf-8` |

## Error envelope

All non-2xx JSON errors use same shape:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Rules:

- `code` is stable machine-readable snake_case.
- `message` is safe for public display/logging.
- Backend does not expose database driver errors.

## Endpoints

### `GET /healthz`

Readiness probe. Returns success only when migrations have succeeded and database answers `SELECT 1`.

Request body: none.

Success response: `200 OK`

```json
{
  "status": "ok"
}
```

Errors:

| Status | Code | Meaning |
|---:|---|---|
| `503` | `database_unavailable` | Database cannot be reached or migrations are not complete |

### `GET /v1/greeting`

Returns singleton greeting for home page.

Request body: none.

Success response: `200 OK`

```json
{
  "text": "Hello Word"
}
```

Errors:

| Status | Code | Meaning |
|---:|---|---|
| `404` | `greeting_not_found` | Singleton greeting row does not exist |
| `500` | `internal_error` | Greeting cannot be read |
| `503` | `database_unavailable` | Database is unavailable |

## Frontend use

Frontend calls `${NEXT_PUBLIC_API_URL}/v1/greeting`. If request fails or response is non-2xx, frontend shows error state and does not render fallback greeting text.
