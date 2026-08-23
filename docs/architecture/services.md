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

Auth: none.

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

Auth: none.

Request body: none.

Success response: `200 OK`

```json
{
  "text": "Hello Word"
}
```

Response contract:

| Field | Type | Nullability | Source |
|---|---|---|---|
| `text` | `string` | never null, never empty | `greetings.text` where `id = 1` |

Reviewed UI mock shape:

```ts
type GreetingResponse = {
  text: string;
};
```

Backend response matches mock field names and types. Difference: backend never intentionally returns empty `text`; database rejects empty values. Frontend still treats empty or missing `text` as error for defensive handling.

Errors:

| Status | Code | Meaning |
|---:|---|---|
| `404` | `greeting_not_found` | Singleton greeting row does not exist |
| `500` | `internal_error` | Greeting cannot be read |
| `503` | `database_unavailable` | Database is unavailable |

Error response example:

```json
{
  "error": {
    "code": "greeting_not_found",
    "message": "greeting not found"
  }
}
```

## Frontend use

Frontend calls `${NEXT_PUBLIC_API_URL || '/api'}/v1/greeting`. If request fails, response is non-2xx, `text` is missing, or `text` is empty after trimming, frontend shows error state and does not render fallback greeting text.

## Story support: Render centered Hello Word

`HOME-001` needs only `GET /v1/greeting`. No write endpoints, auth, pagination, or extra error format are added.

Migration/service rollout plan:

1. Apply database migration that creates and seeds `greetings` before enabling backend readiness.
2. Backend `GET /healthz` returns `503 database_unavailable` until migrations complete and database answers `SELECT 1`.
3. Backend `GET /v1/greeting` reads `greetings.id = 1` and returns `{ "text": "<stored value>" }`.
4. Rollback removes `GET /v1/greeting` use from frontend before dropping `greetings`, otherwise page must show error state.

Safety on populated systems:

- Adding this read endpoint is backward compatible.
- Removing the endpoint is not backward compatible with deployed frontend.
- Dropping `greetings` deletes stored greeting data; only safe after backup/export or before production data matters.
