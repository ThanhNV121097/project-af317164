# Test Cases — Render centered Hello Word

Risk level: low. One public read-only page, but it spans frontend, backend, and DB; cover success, stored-vs-hardcoded source, and failure state.

## Cases

### Scenario: Home page shows stored greeting centered
**Given** stored greeting row contains `Hello Word` and backend returns it from `GET /v1/greeting`
**When** guest opens home page
**Then** browser displays `Hello Word` centered horizontally and vertically on screen
**Check:** render_url

### Scenario: Home page uses white background and black text
**Given** stored greeting row contains `Hello Word` and backend returns it from `GET /v1/greeting`
**When** page finishes loading
**Then** visible page background is white and greeting text is black
**Check:** render_url

### Scenario: Home page renders stored text, not hardcoded copy
**Given** stored greeting row contains `Bonjour` and backend returns it from `GET /v1/greeting`
**When** guest opens home page
**Then** browser displays `Bonjour` as visible greeting text
**Check:** render_url

### Scenario: Home page shows error when greeting missing or unreadable
**Given** greeting data is missing or backend cannot read it
**When** guest opens home page
**Then** page shows error state and does not display fallback greeting text
**Check:** render_url

### Scenario: GET /v1/greeting returns stored greeting success shape
**Given** singleton greeting row exists with text `Hello Word`
**When** client calls `GET /v1/greeting`
**Then** response is `200 OK` with JSON body `{ "text": "Hello Word" }` and `Content-Type: application/json; charset=utf-8`
**Check:** fetch_url

### Scenario: GET /v1/greeting returns error envelope when greeting row missing
**Given** singleton greeting row does not exist
**When** client calls `GET /v1/greeting`
**Then** response is `404 Not Found` with JSON body matching `{ "error": { "code": "greeting_not_found", "message": "string" } }`
**Check:** fetch_url

### Scenario: GET /v1/greeting returns error envelope when greeting cannot be read
**Given** greeting read fails for internal or DB reason
**When** client calls `GET /v1/greeting`
**Then** response is `500 Internal Server Error` or `503 Service Unavailable` with JSON body matching `{ "error": { "code": "internal_error" | "database_unavailable", "message": "string" } }` and no driver detail exposed
**Check:** fetch_url

### Scenario: GET /v1/greeting has no request body or extra parameters
**Given** client prepares request with no body and no query parameters
**When** client calls `GET /v1/greeting`
**Then** endpoint ignores any body/query not defined by contract and returns normal greeting success or defined error response
**Check:** fetch_url
