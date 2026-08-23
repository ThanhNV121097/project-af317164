# Render centered Hello Word

## User story
As a Guest, I want to see `Hello Word` loaded from stored data, so that the page proves frontend, backend, and PostgreSQL are wired end to end.

## In scope
- Load greeting text from backend API on home page open.
- Render the stored text centered horizontally and vertically on a plain white screen.
- Show exact stored value as visible text, with no hardcoded frontend copy.
- Show minimal error state when greeting data is missing or unreadable.

## Out of scope
- Authentication, user accounts, permissions.
- Editing, admin tools, or content management.
- Any styling beyond white background, black text, and centering.
- Any other page or route.
- Fallback greeting text when data is missing.

## UI scope
- Single home screen in approved design preview.
- States: default loading, loaded text, error.
- No extra controls, navigation, animation, or decoration.

## Acceptance criteria
1. Given stored greeting row contains `Hello Word`, when Guest opens home page, then page shows `Hello Word` centered on screen.
2. Given stored greeting row contains `Hello Word`, when page finishes loading, then background is white and text is black.
3. Given stored greeting row contains any text, when Guest opens home page, then frontend shows stored text, not hardcoded copy.
4. Given greeting data is missing or cannot be read, when Guest opens home page, then page shows error state instead of blank or misleading text.

## Dependencies
- PostgreSQL row with `greetings.id = 1` exists.
- Backend API returns stored greeting text for frontend.
- Approved design preview and design system stay unchanged for this minimal page.
