# Design System — hello-word-6

> Source of truth: the approved `index.html` (preview: design/index.html).
> Every value below is extracted from it. Changing a value here without
> changing the approved design is a defect.

Last updated: 2025-02-14

## 1. Foundations

### 1.1 Color

Semantic tokens. Name by job, never by hue.

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-text` | `#000000` | Body text |

#### Contrast audit

Every text-on-background pair actually used. Body text ≥ 4.5:1, large text (≥ 18.66px bold or ≥ 24px) ≥ 3:1, UI borders ≥ 3:1.

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `--color-text` | `--color-bg` | `21:1` | AA / AA Large / AAA |

### 1.2 Spacing

Base unit: `0px`. Layout uses full-viewport centering only; no internal spacing scale is defined in the approved design.

| Token | Value |
|---|---|
| `--space-0` | `0px` |

### 1.3 Typography

Font families (include the fallback stack and how the font is loaded):

- Body: `Arial, Helvetica, sans-serif` from system fonts
- Headings: `Arial, Helvetica, sans-serif` from system fonts
- Mono: not used

| Token | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| `--text-xs` | not used | not used | not used | not used |
| `--text-sm` | not used | not used | not used | not used |
| `--text-base` | not used | not used | not used | not used |
| `--text-lg` | not used | not used | not used | not used |
| `--text-xl` | not used | not used | not used | not used |
| `--text-2xl` | not used | not used | not used | not used |
| `--text-3xl` | `clamp(2.5rem, 8vw, 6rem)` | `1` | `400` | Page title |

Heading levels are used in order and never skipped for visual sizing.

### 1.4 Radius, border, shadow, motion

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | not used | Input, badge |
| `--radius-md` | not used | Button, card |
| `--radius-lg` | not used | Modal |
| `--radius-full` | not used | Avatar, pill |
| `--border-width` | not used | Default border |
| `--shadow-sm` | not used | Resting card |
| `--shadow-md` | not used | Dropdown, popover |
| `--shadow-lg` | not used | Modal |
| `--duration-fast` | not used | Hover, focus |
| `--duration-base` | not used | Panel open/close |
| `--easing` | not used | All transitions |

Motion respects `prefers-reduced-motion: reduce`: state changes remain, movement is removed.

### 1.5 Layout and breakpoints

| Name | Min width | Container | Columns | Gutter |
|---|---|---|---|---|
| `sm` | not used | not used | not used | not used |
| `md` | not used | not used | not used | not used |
| `lg` | not used | not used | not used | not used |
| `xl` | not used | not used | not used | not used |

Z-index scale (only these values are allowed):

| Layer | Value |
|---|---|
| Base | `0` |
| Sticky header | not used |
| Dropdown | not used |
| Modal backdrop | not used |
| Modal | not used |
| Toast | not used |

## 2. Components

No reusable components. Single static page with one centered `h1`.

## 3. Content and formatting

- Voice and tone in one line: plain, minimal, no decoration.
- Date, time, number, and currency formats: not used.
- Capitalization rule for buttons, headings, and labels: title case on page heading only; no buttons or labels.
- Empty-state and error-message wording pattern: not used.

## 4. Known deviations

Places where the approved design does not follow its own rules or the
anti-patterns in `references/ai-defaults.md`. Record, do not silently fix.

| Where | Deviation | Why it stands | Follow-up |
|---|---|---|---|
| `h1` sizing | Uses `clamp(2.5rem, 8vw, 6rem)` instead of a fixed type ramp token | Only one title exists, and responsive sizing is part of approved mockup | Keep as-is unless design changes |
| Whole page | No reusable components, states, or interactive focus behavior | Product is single static display only | None |
| Whole page | No borders, shadows, gradients, or motion | Approved design intentionally minimal | None |
| Whole page | No breakpoints or z-index layers used beyond base | Single-screen layout does not need them | None |

## 5. Change log

| Date | Change | Design PR |
|---|---|---|
| 2025-02-14 | Initial design system extracted from approved minimal mockup | pending |
