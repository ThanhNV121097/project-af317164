# SRS — hello-word-6

Module: `home`
Last updated: 2025-02-14
Design: [View the approved design](http://localhost:8080/design/af317164-ae24-4662-8105-845fcf7a1275)
Design system: `design/design-system.md`

> One file per module, at `docs/{module}/SRS.md`. It covers only the functions
> that belong to this module. Never write `docs/SRS.md`.

## 1. Purpose

`home` exists to show one minimal end-to-end page for `hello-word-6`: a white
screen with centered black text loaded from PostgreSQL through backend API.
Without this module, project has no visible proof that data storage, API, and
frontend wiring all work together.

## 2. Actors

| Actor | Who they are | What they may do in this module |
|---|---|---|
| Guest | Any visitor without authentication | View home page and receive displayed greeting |
| System | Backend and database runtime | Read stored greeting and return it to frontend |

## 3. Scope

**In scope** — the functions specified below, by their plan titles:

- Render centered Hello Word

**Out of scope** — name what a reader would reasonably expect here and say
where it lives instead. This section prevents the same argument twice.

- Authentication, user accounts, and permissions — not built for this project.
- Editing, admin tools, or content management — deliberately not built; page only displays one stored value.
- Styling beyond plain white background, black text, and centering — deliberately not built; design is intentionally minimal.
- Any other page or route — belongs outside `home` and is not part of this project.

## 4. Functional requirements

### 4.1 Render centered Hello Word

**Requirement HOME-001 — Stored greeting is shown**

*As a* Guest, *I want to* see greeting text loaded from stored data, *so that* page proves frontend reads backend content instead of hardcoded copy.

Behaviour:

1. When Guest opens home page, system loads greeting text from backend-backed stored value.
2. System renders fetched text centered horizontally and vertically in viewport.
3. System uses exact stored value as visible text, including case and spacing.
4. System keeps page otherwise empty: white background, black text, no extra controls, no animation.

**Acceptance criteria** — each maps one-to-one onto a test case in
`docs/home/test-cases/render-centered-hello-word.md`. Given/When/Then, no compound
conditions: one behaviour per criterion.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Stored greeting row contains `Hello Word` | Guest opens home page | Page shows `Hello Word` centered on screen |
| AC-2 | Stored greeting row contains `Hello Word` | Page finishes loading | Background is white and text is black |
| AC-3 | Stored greeting row contains any text | Guest opens home page | Frontend shows stored text, not hardcoded copy |
| AC-4 | Greeting data is missing or cannot be read | Guest opens home page | Page shows error state instead of blank or misleading text |

**Failure, boundary and permission behaviour** — the part most often skipped
and most often the source of bugs. Every row needs a defined outcome; "should
not happen" is not an outcome.

| Case | Condition | Expected behaviour |
|---|---|---|
| Invalid input | Stored greeting is empty string | Page does not invent replacement copy; error state or empty-state handling is shown by product decision, not silent fallback |
| Boundary | Greeting text length is 1 character or very long for one line | Text remains centered and visible without extra UI; if it wraps, layout still stays centered |
| Not found | Greeting row does not exist | Error state shown; page does not hardcode fallback text |
| Not permitted | Actor lacks the permission | Not applicable; home page is public |
| Conflict | Two actors change same greeting | Last saved greeting is what page reads on next request |
| Upstream failure | Backend or database unavailable | Page shows error state and no partial greeting is displayed |

**Data touched** — the fields this function reads and writes, in product terms.
The physical schema is TL's job in `docs/architecture/erd.md`; this is the list
that document has to satisfy.

| Field | Type | Required | Rule |
|---|---|---|---|
| Greeting text | text | yes | One stored row provides visible copy; exact value is rendered as-is |
| Greeting source status | availability state | yes | Missing or unreadable data produces error state, not fallback copy |

## 5. Screens

The design is the source of truth for appearance; this section maps functions
onto it so nothing in the design is unaccounted for and nothing specified here
is missing from the design.

| Screen | Section in the design | Functions it serves | States that must exist |
|---|---|---|---|
| Single home screen | Approved design preview | HOME-001 | default, loading, error |

## 6. Non-functional requirements

Only what is real for this module. Delete rows that do not apply rather than
inventing a number nobody will check.

| Area | Requirement |
|---|---|
| Performance | Home page renders stored greeting within 2s on a typical connection after backend responds |
| Accessibility | Text remains readable with contrast ≥ 4.5:1 and is reachable in page order without keyboard trap |
| Responsive | Works at 320px and up; no horizontal page scroll |
| Localisation | Copy is exactly `Hello Word` in English |
| Privacy | No personal data is stored or displayed |

## 7. Dependencies and assumptions

- **Depends on:** PostgreSQL, for storing one greeting row.
- **Depends on:** Backend API, for returning stored greeting to frontend.
- **Assumption:** Empty or missing greeting is treated as error state; if product later wants fallback text, `HOME-001` must be revised.

| Open question | Proposed default | Who decides |
|---|---|---|
| What exact error message appears when greeting data is unavailable? | Minimal error state with no greeting text and no extra UI | Stakeholder / TL |

## 8. Traceability

Every plan item in this module appears exactly once, and every requirement id
traces to a test case. A gap in this table is a gap in the build.

| Plan item | Requirement ids | Test cases |
|---|---|---|
| Render centered Hello Word | HOME-001 | `test-cases/render-centered-hello-word.md` |
