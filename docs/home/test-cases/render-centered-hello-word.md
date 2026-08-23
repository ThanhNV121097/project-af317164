# Test cases — Render centered Hello Word

Risk level: low. One read-only page, but contract coverage still matters because backend/API shape is part of story.

## Automated coverage

### Scenario: AC-1 home page shows stored greeting centered
**Given** stored greeting row contains `Hello Word` and frontend can reach backend API
**When** guest opens home page
**Then** page displays exact text `Hello Word` once, centered in viewport horizontally and vertically
Check: render_url

### Scenario: AC-2 home page uses white background and black text
**Given** stored greeting row contains `Hello Word` and frontend can reach backend API
**When** page finishes loading
**Then** visible page background is white and greeting text is black
Check: render_url

### Scenario: AC-3 home page uses stored text, not hardcoded copy
**Given** stored greeting row contains `Bonjour` and frontend can reach backend API
**When** guest opens home page
**Then** page displays `Bonjour` and does not display `Hello Word` unless that is the stored value
Check: render_url

### Scenario: AC-4 home page shows error state when greeting missing
**Given** greeting row is missing or unreadable
**When** guest opens home page
**Then** page shows error state and does not render fallback greeting text
Check: render_url

### Scenario: GET /healthz returns ok when database is ready
**Given** migrations succeeded and database answers `SELECT 1`
**When** client sends `GET /healthz`
**Then** response status is `200 OK`, `Content-Type` is `application/json; charset=utf-8`, and body is `{"status":"ok"}`
Check: fetch_url

### Scenario: GET /healthz returns database_unavailable when database is not ready
**Given** database cannot be reached or migrations are not complete
**When** client sends `GET /healthz`
**Then** response status is `503`, body has error envelope with code `database_unavailable`, and message is safe for public display
Check: fetch_url

### Scenario: GET /v1/greeting returns stored greeting text
**Given** singleton greeting row exists with text `Hello Word`
**When** client sends `GET /v1/greeting`
**Then** response status is `200 OK`, `Content-Type` is `application/json; charset=utf-8`, and body is `{"text":"Hello Word"}`
Check: fetch_url

### Scenario: GET /v1/greeting returns greeting_not_found when row is missing
**Given** singleton greeting row does not exist
**When** client sends `GET /v1/greeting`
**Then** response status is `404`, body has error envelope with code `greeting_not_found`, and message is safe for public display
Check: fetch_url

### Scenario: GET /v1/greeting returns internal_error when greeting cannot be read
**Given** greeting row exists but backend cannot read it
**When** client sends `GET /v1/greeting`
**Then** response status is `500`, body has error envelope with code `internal_error`, and no database driver error is exposed
Check: fetch_url

### Scenario: GET /v1/greeting returns database_unavailable when database is unavailable
**Given** database is unavailable
**When** client sends `GET /v1/greeting`
**Then** response status is `503`, body has error envelope with code `database_unavailable`
Check: fetch_url

### Scenario: GET /v1/greeting ignores undefined query params
**Given** singleton greeting row exists with text `Hello Word`
**When** client sends `GET /v1/greeting?extra=1`
**Then** response still returns `200 OK` with body `{"text":"Hello Word"}` and no extra field for `extra`
Check: fetch_url

## Manual coverage

### Scenario: home page has no extra UI or animation
**Given** stored greeting row contains `Hello Word`
**When** guest opens home page in browser
**Then** page shows only centered greeting on plain white screen, with no controls, no animation, and no other visible content
Check: manual

### Scenario: home page remains readable at small width
**Given** stored greeting row contains `Hello Word`
**When** guest opens home page at 320px width
**Then** page remains readable and no horizontal page scroll appears
Check: manual

### Scenario: home page contrast stays readable
**Given** stored greeting row contains `Hello Word`
**When** guest opens home page
**Then** black text on white background remains readable with expected contrast
Check: manual
