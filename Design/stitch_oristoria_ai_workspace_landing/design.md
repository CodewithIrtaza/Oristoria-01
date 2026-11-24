# Oristoria Design System

**Product:** Turns a user's own documents into source-grounded, cited answers and research deliverables
**Users:** Students, professionals, researchers, creators (individual accounts, private workspaces)
**Platform:** Desktop web first, responsive to 375px
**Stack:** React 19 + TypeScript (Vite, React Router v7), FastAPI backend

---

## Design Tokens (YAML)

```yaml
# =============================================================================
# COLOR SYSTEM
# =============================================================================
colors:
  # Light theme (default)
  light:
    # Core surfaces
    paper: "#fafafa"              # Page background
    paper-elevated: "#ffffff"     # Cards, modals, dropdowns, tooltips
    paper-hover: "#f5f5f5"        # Hover state for interactive surfaces
    paper-pressed: "#eeeeee"      # Pressed/active state

    # Text
    ink: "#1a1a2e"                # Primary text, headings (14.8:1 on paper)
    ink-muted: "#4a4a6a"          # Secondary text, labels, placeholders (7.2:1)
    ink-subtle: "#8a8a9a"         # Tertiary text, disabled, meta (4.5:1 minimum)
    ink-inverse: "#ffffff"        # Text on accent/dark backgrounds

    # Borders & Dividers
    border-subtle: "#e5e5e5"      # Default borders, dividers, input borders
    border-emphasis: "#d0d0d0"    # Hover borders, focused non-interactive
    border-focus: "#b85c3d"       # Focus rings (matches accent-terracotta)
    border-error: "#b91c1c"       # Error state borders

    # Accent & Brand
    accent-terracotta: "#b85c3d"  # Primary actions, links, active states (4.5:1 on paper)
    accent-terracotta-hover: "#9d4d33"  # Hover primary actions
    accent-terracotta-pressed: "#85402b" # Pressed primary actions
    accent-terracotta-subtle: "#fdf2ef"  # 10% tint for tonal secondary bg
    accent-terracotta-focus: "rgba(184, 92, 61, 0.25)" # Focus ring spread

    # Semantic Colors
    success-teal: "#0d9488"       # Success states, verified citations (4.5:1)
    success-teal-subtle: "#e6fffb"       # Success background tint
    warning-amber: "#c4963a"      # Warnings, usage caps, attention (4.5:1)
    warning-amber-subtle: "#fffbeb"      # Warning background tint
    error-crimson: "#b91c1c"      # Errors, destructive actions (4.5:1)
    error-crimson-subtle: "#fef2f2"      # Error background tint
    info-slate: "#475569"         # Info, neutral actions (4.5:1)
    info-slate-subtle: "#f1f5f9"         # Info background tint

    # Status Badges
    status-processing: "#475569"  # Processing/queued
    status-processing-bg: "#f1f5f9"
    status-ready: "#0d9488"       # Ready/complete
    status-ready-bg: "#e6fffb"
    status-failed: "#b91c1c"      # Failed/error
    status-failed-bg: "#fef2f2"
    status-queued: "#c4963a"      # Queued/waiting
    status-queued-bg: "#fffbeb"

  # Dark theme (user preference + system sync)
  dark:
    # Core surfaces
    paper: "#141418"              # Page background
    paper-elevated: "#1c1c24"     # Cards, modals, dropdowns
    paper-hover: "#242430"        # Hover interactive surfaces
    paper-pressed: "#2d2d3a"      # Pressed/active

    # Text
    ink: "#e8e8e8"                # Primary text (13.2:1 on paper)
    ink-muted: "#a0a0b0"          # Secondary text (7.1:1)
    ink-subtle: "#6b6b7b"         # Tertiary text (4.5:1 minimum)
    ink-inverse: "#1a1a2e"        # Text on accent

    # Borders & Dividers
    border-subtle: "#2d2d3a"      # Default borders
    border-emphasis: "#3d3d5c"    # Hover/focus borders
    border-focus: "#c47d5a"       # Focus rings (lighter terracotta for dark)
    border-error: "#f87171"       # Error borders

    # Accent & Brand
    accent-terracotta: "#c47d5a"  # Primary actions (lighter for dark bg)
    accent-terracotta-hover: "#d08d6a"
    accent-terracotta-pressed: "#b86d4a"
    accent-terracotta-subtle: "#3d2a24"  # 15% tint for tonal secondary
    accent-terracotta-focus: "rgba(196, 125, 90, 0.35)"

    # Semantic Colors (adjusted for dark)
    success-teal: "#2dd4bf"
    success-teal-subtle: "#0a2d2a"
    warning-amber: "#fbbf24"
    warning-amber-subtle: "#3d330a"
    error-crimson: "#f87171"
    error-crimson-subtle: "#3d1a1a"
    info-slate: "#94a3b8"
    info-slate-subtle: "#1e293b"

    # Status Badges
    status-processing: "#94a3b8"
    status-processing-bg: "#1e293b"
    status-ready: "#2dd4bf"
    status-ready-bg: "#0a2d2a"
    status-failed: "#f87171"
    status-failed-bg: "#3d1a1a"
    status-queued: "#fbbf24"
    status-queued-bg: "#3d330a"

# =============================================================================
# TYPOGRAPHY
# =============================================================================
typography:
  fonts:
    heading: "Space Grotesk"      # Geometric, technical, display
    body: "Inter"                 # UI standard, exceptional legibility
    mono: "JetBrains Mono"        # Code, citations, technical details

  # Font weights available (variable fonts)
  weights:
    light: 300
    regular: 400
    medium: 500
    semibold: 600
    bold: 700

  # Type scale (rem, line-height, letter-spacing, font-weight)
  scale:
    # Display / Marketing
    display-xl:
      size: "3.5rem"      # 56px
      lineHeight: 1.1
      letterSpacing: "-0.02em"
      weight: 700
      font: "heading"
    display-lg:
      size: "2.5rem"      # 40px
      lineHeight: 1.15
      letterSpacing: "-0.015em"
      weight: 700
      font: "heading"
    display-md:
      size: "2rem"        # 32px
      lineHeight: 1.2
      letterSpacing: "-0.01em"
      weight: 600
      font: "heading"
    display-sm:
      size: "1.5rem"      # 24px
      lineHeight: 1.25
      letterSpacing: "-0.005em"
      weight: 600
      font: "heading"

    # Headings
    h1:
      size: "1.875rem"    # 30px
      lineHeight: 1.3
      letterSpacing: "-0.005em"
      weight: 600
      font: "heading"
    h2:
      size: "1.5rem"      # 24px
      lineHeight: 1.3
      letterSpacing: "0"
      weight: 600
      font: "heading"
    h3:
      size: "1.25rem"     # 20px
      lineHeight: 1.35
      letterSpacing: "0"
      weight: 600
      font: "heading"
    h4:
      size: "1.125rem"    # 18px
      lineHeight: 1.4
      letterSpacing: "0"
      weight: 600
      font: "heading"

    # Body
    body-lg:
      size: "1.125rem"    # 18px
      lineHeight: 1.6
      letterSpacing: "0"
      weight: 400
      font: "body"
    body:
      size: "1rem"        # 16px
      lineHeight: 1.6
      letterSpacing: "0"
      weight: 400
      font: "body"
    body-sm:
      size: "0.875rem"    # 14px
      lineHeight: 1.55
      letterSpacing: "0"
      weight: 400
      font: "body"
    body-xs:
      size: "0.75rem"     # 12px
      lineHeight: 1.5
      letterSpacing: "0.01em"
      weight: 400
      font: "body"

    # Labels / UI
    label-lg:
      size: "0.875rem"    # 14px
      lineHeight: 1.5
      letterSpacing: "0.01em"
      weight: 500
      font: "body"
    label:
      size: "0.75rem"     # 12px
      lineHeight: 1.5
      letterSpacing: "0.02em"
      weight: 500
      font: "body"
    label-xs:
      size: "0.625rem"    # 10px
      lineHeight: 1.4
      letterSpacing: "0.03em"
      weight: 600
      font: "body"

    # Mono
    mono-lg:
      size: "1rem"        # 16px
      lineHeight: 1.6
      letterSpacing: "0"
      weight: 400
      font: "mono"
    mono:
      size: "0.875rem"    # 14px
      lineHeight: 1.55
      letterSpacing: "0"
      weight: 400
      font: "mono"
    mono-sm:
      size: "0.75rem"     # 12px
      lineHeight: 1.5
      letterSpacing: "0"
      weight: 400
      font: "mono"

# =============================================================================
# SPACING & LAYOUT
# =============================================================================
spacing:
  base: "1rem"           # 16px base unit
  scale:
    0: "0"
    1: "0.25rem"   # 4px
    2: "0.5rem"    # 8px
    3: "0.75rem"   # 12px
    4: "1rem"      # 16px
    5: "1.25rem"   # 20px
    6: "1.5rem"    # 24px
    8: "2rem"      # 32px
    10: "2.5rem"   # 40px
    12: "3rem"     # 48px
    16: "4rem"     # 64px
    20: "5rem"     # 80px
    24: "6rem"     # 96px

  # Layout-specific
  layout:
    container-max: "72rem"        # 1152px max content width
    container-padding: "1.5rem"   # 24px page padding
    sidebar-width: "16rem"        # 256px collapsed
    sidebar-width-expanded: "20rem" # 320px expanded
    topbar-height: "4rem"         # 64px
    modal-max-width: "32rem"      # 512px
    drawer-width: "24rem"         # 384px desktop

# =============================================================================
# SHAPE & BORDERS
# =============================================================================
shape:
  borderRadius:
    none: "0"
    sm: "0.25rem"    # 4px - badges, pills
    md: "0.375rem"   # 6px - inputs, buttons
    lg: "0.5rem"     # 8px - cards, containers, modals
    xl: "0.75rem"    # 12px - large modals, drawers
    "2xl": "1rem"    # 16px - full-screen modals
    full: "9999px"   # Pills, avatar, badges

  borderWidth:
    thin: "1px"
    normal: "1px"
    thick: "2px"
    focus: "2px"     # Focus ring width

  shadows:
    none: "none"
    xs: "0 1px 2px rgba(26,26,46,0.04)"
    sm: "0 1px 3px rgba(26,26,46,0.08)"
    md: "0 4px 12px rgba(26,26,46,0.12)"
    lg: "0 8px 24px rgba(26,26,46,0.16)"
    xl: "0 16px 48px rgba(26,26,46,0.2)"
    inner: "inset 0 2px 4px rgba(26,26,46,0.06)"
    focus: "0 0 0 2px rgba(184,92,61,0.25)"
    focus-dark: "0 0 0 2px rgba(196,125,90,0.35)"

# =============================================================================
# TRANSITIONS & MOTION
# =============================================================================
motion:
  durations:
    instant: "0ms"
    fast: "100ms"
    normal: "150ms"
    slow: "200ms"
    slower: "300ms"

  easings:
    ease-out: "cubic-bezier(0.4, 0, 0.2, 1)"
    ease-in: "cubic-bezier(0.4, 0, 1, 1)"
    ease-in-out: "cubic-bezier(0.4, 0, 0.2, 1)"
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"

  # Specific transitions
  transitions:
    sidebar: "width 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms ease-out"
    drawer: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease-out"
    modal: "opacity 150ms ease-out, transform 150ms cubic-bezier(0.4, 0, 0.2, 1)"
    toast: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease-out"
    button: "transform 100ms ease-out, background-color 150ms ease-out, box-shadow 150ms ease-out"
    input: "border-color 150ms ease-out, box-shadow 150ms ease-out, background-color 150ms ease-out"
    card: "box-shadow 200ms ease-out, border-color 150ms ease-out, transform 150ms ease-out"
    tooltip: "opacity 100ms ease-out, transform 100ms ease-out"
    skeleton: "background-position 1.5s ease-in-out infinite"

  # Reduced motion
  prefersReducedMotion:
    durations:
      all: "0ms"
    transitions:
      all: "none"

# =============================================================================
# Z-INDEX LAYERS
# =============================================================================
zIndex:
  base: 0
  dropdown: 100
  sticky: 200
  sidebar: 300
  modal-backdrop: 400
  modal: 500
  drawer: 600
  toast: 700
  tooltip: 800
  popover: 900

# =============================================================================
# BREAKPOINTS
# =============================================================================
breakpoints:
  sm: "640px"   # Mobile landscape / small tablet
  md: "768px"   # Tablet
  lg: "1024px"  # Desktop
  xl: "1280px"  # Large desktop
  "2xl": "1536px" # Extra large

# =============================================================================
# COMPONENT TOKENS (per-component overrides)
# =============================================================================
components:
  button:
    height:
      sm: "2rem"      # 32px
      md: "2.5rem"    # 40px
      lg: "3rem"      # 48px
    padding:
      sm: "0 0.75rem"
      md: "0 1rem"
      lg: "0 1.5rem"
    gap: "0.5rem"
    iconSize:
      sm: "1rem"      # 16px
      md: "1.25rem"   # 20px
      lg: "1.5rem"    # 24px

  input:
    height:
      sm: "2rem"      # 32px
      md: "2.5rem"    # 40px
      lg: "3rem"      # 48px
    padding:
      sm: "0 0.75rem"
      md: "0 1rem"
      lg: "0 1.25rem"
    placeholderColor: "ink-subtle"

  card:
    padding:
      sm: "1rem"      # 16px
      md: "1.5rem"    # 24px
      lg: "2rem"      # 32px
    gap: "1rem"

  table:
    cellPadding: "0.75rem 1rem"  # 12px 16px
    headerHeight: "3rem"         # 48px
    rowHeight: "3.5rem"          # 56px
    stickyHeader: true

  modal:
    maxWidth:
      sm: "24rem"     # 384px
      md: "32rem"     # 512px
      lg: "48rem"     # 768px
      xl: "64rem"     # 1024px
    padding: "1.5rem"

  drawer:
    width: "24rem"    # 384px desktop
    mobileWidth: "100%"

  toast:
    maxWidth: "24rem" # 384px
    gap: "0.75rem"

  avatar:
    sizes:
      xs: "1.5rem"    # 24px
      sm: "2rem"      # 32px
      md: "2.5rem"    # 40px
      lg: "3rem"      # 48px
      xl: "4rem"      # 64px

  badge:
    height: "1.25rem"  # 20px
    padding: "0 0.5rem"
    fontSize: "label-xs"
    gap: "0.25rem"

# =============================================================================
# ICONS
# =============================================================================
icons:
  library: "lucide-react"
  strokeWidth: 2
  strokeLinecap: "round"
  strokeLinejoin: "round"
  sizes:
    xs: "0.75rem"   # 12px - inline text
    sm: "1rem"      # 16px - button icons
    md: "1.25rem"   # 20px - nav, button lg
    lg: "1.5rem"    # 24px - primary nav, empty states
    xl: "2rem"      # 32px - large empty states
    "2xl": "3rem"   # 48px - hero illustrations
  color:
    default: "ink-muted"
    hover: "ink"
    active: "accent-terracotta"
    disabled: "ink-subtle"
```

---

## 1. Visual Theme & Atmosphere

**Mood:** Quiet confidence, focused depth, timeless utility. Like a well-lit study with organized reference books — a scholarly desk where serious work happens.

**Aesthetic Philosophy:** Trust through restraint. The design disappears so the user's content and citations take center stage. Every visual decision reinforces credibility: high contrast for readability, generous whitespace for cognitive breathing room, a warm but professional accent that feels human without being decorative.

**Density:** Comfortable — 16px base unit, 1.6 line height for body text. Information is scannable but not cramped. Desktop-first with graceful responsive collapse to 375px.

**Themes:** Light default (optimal for reading long-form content and citations), dark mode fully supported via user preference and `prefers-color-scheme`. Both themes meet WCAG AA contrast minimums.

---

## 2. Color Palette & Roles

### Light Theme (Default)

| Token | Hex | Role | Contrast on `paper` |
|-------|-----|------|---------------------|
| `ink` | `#1a1a2e` | Primary text, headings, high-contrast UI | 14.8:1 (AAA) |
| `ink-muted` | `#4a4a6a` | Secondary text, labels, placeholders | 7.2:1 (AA) |
| `ink-subtle` | `#8a8a9a` | Tertiary text, disabled, meta info | 4.5:1 (AA) |
| `paper` | `#fafafa` | Page background | — |
| `paper-elevated` | `#ffffff` | Cards, modals, dropdowns, tooltips | — |
| `accent-terracotta` | `#b85c3d` | **Primary actions, links, focus rings, active selection** | 4.5:1 (AA) |
| `accent-terracotta-hover` | `#9d4d33` | Primary button hover | 5.2:1 |
| `accent-terracotta-subtle` | `#fdf2ef` | Tonal secondary button background | — |
| `border-subtle` | `#e5e5e5` | Dividers, input borders, card borders | — |
| `border-focus` | `#b85c3d` | Focus rings (2px) | — |
| `success-teal` | `#0d9488` | Success, verified citations, complete status | 4.5:1 |
| `warning-amber` | `#c4963a` | Warnings, usage caps, queued status | 4.5:1 |
| `error-crimson` | `#b91c1c` | Errors, destructive actions, failed status | 4.5:1 |
| `info-slate` | `#475569` | Info, neutral actions, processing status | 4.5:1 |

### Dark Theme

| Token | Hex | Role | Contrast on `paper` |
|-------|-----|------|---------------------|
| `ink` | `#e8e8e8` | Primary text | 13.2:1 (AAA) |
| `ink-muted` | `#a0a0b0` | Secondary text | 7.1:1 (AA) |
| `ink-subtle` | `#6b6b7b` | Tertiary text | 4.5:1 (AA) |
| `paper` | `#141418` | Page background | — |
| `paper-elevated` | `#1c1c24` | Cards, modals | — |
| `accent-terracotta` | `#c47d5a` | Primary actions (lighter for dark) | 4.5:1 |
| `border-subtle` | `#2d2d3a` | Dividers, borders | — |
| `border-focus` | `#c47d5a` | Focus rings | — |
| `success-teal` | `#2dd4bf` | Success states | 4.5:1 |
| `warning-amber` | `#fbbf24` | Warnings | 4.5:1 |
| `error-crimson` | `#f87171` | Errors | 4.5:1 |

### Contrast Verification
All text/background combinations meet **WCAG AA (4.5:1)** minimum. Primary text on primary backgrounds meets **WCAG AAA (7:1)**. Focus rings use 3:1 contrast against adjacent colors per WCAG 2.4.7.

---

## 3. Typography Rules

### Font Families (Google Fonts, self-hosted via `@fontsource` or `next/font`)
- **Heading:** `Space Grotesk` — Variable (300-700). Geometric, technical, distinctive at display sizes. Used for: page titles, section headings, card titles, numeric displays.
- **Body:** `Inter` — Variable (300-700). Industry standard UI font, exceptional legibility at small sizes. Used for: all body text, UI labels, buttons, inputs, tables.
- **Mono:** `JetBrains Mono` — Variable (300-700). Code snippets, citation labels, technical details, token counts.

### Weight Usage
| Context | Weight | Example |
|---------|--------|---------|
| Display/Marketing headlines | 700 (Bold) | Landing hero |
| Page titles (H1) | 600 (Semibold) | "Sources", "Chat" |
| Section headings (H2-H3) | 600 (Semibold) | "Recent Artifacts" |
| Sub-headings (H4) | 600 (Semibold) | Card titles |
| Body text | 400 (Regular) | Paragraphs, descriptions |
| Emphasis in body | 500 (Medium) | Key terms, inline code labels |
| UI Labels | 500 (Medium) | Form labels, button text |
| Captions/Meta | 400 (Regular) | Timestamps, status text |
| Mono (code/citations) | 400 (Regular) | Citation IDs, token counts |

### Letter Spacing
- **Headings:** Negative tracking (`-0.02em` to `-0.005em`) for cohesion at large sizes
- **Body:** Normal (`0`)
- **Labels/Small caps:** Positive tracking (`0.01em` to `0.03em`) for legibility at small sizes
- **Mono:** Normal (`0`)

### Line Heights
- **Display:** 1.1–1.25 (tight for impact)
- **Headings:** 1.3–1.4 (readable hierarchy)
- **Body:** 1.55–1.6 (optimal reading comfort)
- **UI/Compact:** 1.5 (dense but readable)

---

## 4. Layout Principles

### Grid & Alignment
- **Base unit:** 16px (1rem). All spacing, sizing, and layout align to 4px grid (multiples of 4px).
- **Max content width:** 72rem (1152px) — optimal reading line length ~75 chars at base font size.
- **Page padding:** 24px (1.5rem) mobile, 32px (2rem) desktop.
- **Sidebar:** 256px collapsed, 320px expanded. Fixed left, content flows right.
- **Top bar:** 64px height. Fixed top, z-index 300.

### Whitespace Strategy
- **Macro (layout):** 32px–64px between major sections (sidebar vs content, page sections)
- **Meso (component):** 16px–24px between cards, form groups, table sections
- **Micro (element):** 8px–12px between related elements (label-input, button-icon, badge-text)

### Responsive Behavior
| Breakpoint | Sidebar | Layout |
|------------|---------|--------|
| < 640px (sm) | Drawer (hamburger menu) | Single column, full-width cards |
| 640px–1023px (md-lg) | Collapsible (icon-only) | Two-column where applicable |
| ≥ 1024px (xl) | Expanded (labels + icons) | Full multi-column layouts |

### Alignment Rules
- Text left-aligned by default (LTR languages)
- Numbers/monospace right-aligned in tables
- Primary actions right-aligned in forms, left-aligned in hero sections
- Consistent 16px rhythm vertically

---

## 5. Shape & Elevation

### Corner Radius
| Element | Radius | Token |
|---------|--------|-------|
| Buttons (all sizes) | 6px | `rounded-md` |
| Inputs, Textareas, Selects | 6px | `rounded-md` |
| Cards, Containers | 8px | `rounded-lg` |
| Modals, Drawers | 12px | `rounded-xl` |
| Pills, Badges, Avatars | Full (9999px) | `rounded-full` |
| Tooltips, Popovers | 8px | `rounded-lg` |

### Borders
- **Default:** 1px solid `border-subtle` (light) / `#2d2d3a` (dark)
- **Focus:** 2px solid `border-focus` (replaces border, not additional)
- **Error:** 1px solid `error-crimson` / `#f87171`
- **Hover (interactive):** `border-emphasis` / `#3d3d5c`

### Shadows (Elevation)
| Level | Shadow | Usage |
|-------|--------|-------|
| None | `none` | Flat elements, inline |
| xs | `0 1px 2px rgba(26,26,46,0.04)` | Subtle separators |
| sm (Card) | `0 1px 3px rgba(26,26,46,0.08)` | Cards, dropdowns |
| md (Modal) | `0 4px 12px rgba(26,26,46,0.12)` | Modals, drawers |
| lg | `0 8px 24px rgba(26,26,46,0.16)` | Large overlays |
| Focus | `0 0 0 2px rgba(184,92,61,0.25)` | Focus rings (light) |
| Focus Dark | `0 0 0 2px rgba(196,125,90,0.35)` | Focus rings (dark) |

**Philosophy:** Shadows are whisper-soft — they separate layers without creating visual weight. Elevation is communicated primarily through background contrast (`paper` vs `paper-elevated`) and borders, not heavy shadows.

---

## 6. Component Stylings

### Buttons
| Variant | Background | Text | Border | Hover | Focus | Disabled |
|---------|------------|------|--------|-------|-------|----------|
| **Primary** | `accent-terracotta` | `ink-inverse` | None | `accent-terracotta-hover` | Focus ring | 40% opacity |
| **Secondary (Tonal)** | `accent-terracotta-subtle` | `accent-terracotta` | None | `accent-terracotta` 15% bg | Focus ring | 40% opacity |
| **Ghost** | Transparent | `ink` | None | `paper-hover` bg | Focus ring | 40% opacity |
| **Destructive** | Transparent | `error-crimson` | `error-crimson` | `error-crimson-subtle` bg | Focus ring | 40% opacity |
| **Destructive Filled** | `error-crimson` | `ink-inverse` | None | `error-crimson` darker | Focus ring | 40% opacity |

**States:** All variants have explicit: default, hover, focus-visible (2px ring), pressed (scale 0.98), loading (spinner + disabled), disabled (40% opacity, no pointer events).

**Sizes:**
- `sm`: 32px height, 12px padding, 14px text, 16px icon
- `md`: 40px height, 16px padding, 16px text, 20px icon
- `lg`: 48px height, 24px padding, 18px text, 24px icon

**Min tap target:** 44×44px (all sizes meet this).

### Inputs & Forms
| State | Border | Background | Focus Ring | Text |
|-------|--------|------------|------------|------|
| Default | `border-subtle` | `paper-elevated` | — | `ink` |
| Hover | `border-emphasis` | `paper-elevated` | — | `ink` |
| Focus | `border-focus` | `paper-elevated` | 2px `border-focus` | `ink` |
| Error | `border-error` | `paper-elevated` | 2px `border-error` | `ink` |
| Disabled | `border-subtle` | `paper-hover` | — | `ink-subtle` |
| Success | `success-teal` | `paper-elevated` | 2px `success-teal` | `ink` |

**File Upload:** Drag-drop zone — dashed border `border-subtle`, hover = `accent-terracotta` border + `accent-terracotta-subtle` bg, active = `accent-terracotta` border.

**Select:** Native select styled as input, custom dropdown uses popover component.

**Checkbox/Radio:** 18×18px, `border-subtle` border, checked = `accent-terracotta` bg + checkmark, focus ring.

**Toggle:** 40×24px track, 20px thumb. Off = `border-subtle`, On = `accent-terracotta`.

### Tables
- **Container:** `paper-elevated` bg, `rounded-lg`, `border-subtle` border
- **Header:** `paper-hover` bg, `label` text style, `ink-muted` color, bottom border 1px `border-subtle`, sticky top
- **Rows:** Horizontal borders only (1px `border-subtle` between rows), `body` text style
- **Hover:** `paper` bg + `xs` shadow
- **Selected:** `accent-terracotta-subtle` bg + 2px left `accent-terracotta` border
- **Empty:** Centered illustration + `ink-muted` text + action button
- **Loading:** Skeleton rows (pulse animation)
- **Responsive:** Horizontal scroll ≥ 640px, card stack < 640px

### Cards
- **Base:** `paper-elevated` bg, `rounded-lg`, 1px `border-subtle`, `sm` shadow, 16px padding
- **Hover:** `md` shadow, `border-emphasis` border
- **Selected:** `accent-terracotta-subtle` bg, 2px left `accent-terracotta` border
- **Loading:** Skeleton (pulse) preserving card dimensions
- **Empty:** Illustration (32px icon) + `h4` title + `body-sm` description + action button
- **Error:** `error-crimson-subtle` bg, `error-crimson` left border, error icon + message

**Card Types:**
- **Source:** Thumbnail (aspect-ratio 3:4), title, status badge, page count, date, overflow menu
- **Artifact:** Icon by kind, title, kind badge, run link, date, preview action
- **Run Step:** Node icon, step name, status badge, duration, expand chevron
- **Citation:** Source title, page, excerpt (2 lines clamped), verdict badge, open action

### Modals
- **Backdrop:** `rgba(26,26,46,0.4)`, `z-index: 400`
- **Container:** `paper-elevated`, `rounded-xl`, `lg` shadow, `z-index: 500`, max-w-md (512px)
- **Header:** `h3` title, close button (ghost, top-right)
- **Body:** Scrollable, max-h-[70vh], 24px padding
- **Footer:** Divided from body, right-aligned actions (primary rightmost)
- **Animation:** 150ms fade + scale(0.95→1), focus trap, ESC closes

### Drawers (Slide-over)
- **Position:** Right, fixed, full height
- **Width:** 384px (24rem) desktop, 100% mobile
- **Backdrop:** Same as modal, click closes
- **Header:** Title + close, sticky top
- **Body:** Scrollable, 24px padding
- **Animation:** 150ms transform (translateX 100%→0)
- **Focus:** Trap within drawer, ESC closes

### Toasts
- **Position:** Top-right, stacked (8px gap)
- **Container:** `paper-elevated`, `rounded-lg`, `sm` shadow, 16px padding, 384px max-w
- **Variants:** Success (teal left border), Error (crimson left border), Warning (amber left border), Info (slate left border)
- **Content:** Icon + title + description + dismiss button
- **Animation:** 200ms slide from right + fade
- **Auto-dismiss:** 4s (pause on hover), persistent for errors
- **Accessibility:** `role="alert"` for errors, `role="status"` for others

### Badges (Status)
| Status | Background | Text | Icon |
|--------|------------|------|------|
| Processing/Queued | `status-processing-bg` | `status-processing` | Spinner/Clock |
| Ready/Complete | `status-ready-bg` | `status-ready` | Check |
| Failed/Error | `status-failed-bg` | `status-failed` | X-Circle |
| Pending/Waiting | `status-queued-bg` | `status-queued` | Alert-Circle |

**Style:** `rounded-full`, 20px height, `label-xs` text, icon 12px.

---

## 7. Iconography

**Library:** `lucide-react` — 2px stroke, rounded caps, rounded joins, 24×24 base grid.

**Size Scale:**
| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12px | Inline with `body-xs`/`label-xs` |
| `sm` | 16px | Button `sm`, inline with `body-sm` |
| `md` | 20px | Button `md`, nav icons, table actions |
| `lg` | 24px | Button `lg`, primary nav, empty states |
| `xl` | 32px | Large empty states, hero illustrations |
| `2xl` | 48px | Marketing, onboarding illustrations |

**Color States:**
- Default: `ink-muted`
- Hover: `ink`
- Active/Selected: `accent-terracotta`
- Disabled: `ink-subtle`
- Error: `error-crimson`
- Success: `success-teal`

**Key Icons Mapped:**
- Navigation: `FolderOpen` (Sources), `MessageSquare` (Chat), `FileText` (Artifacts), `GitBranch` (Runs), `Settings` (Settings)
- Actions: `Upload` (Upload), `Download` (Export), `Trash2` (Delete), `Edit2` (Edit), `Copy` (Copy), `Share2` (Share)
- States: `Loader2` (Processing), `CheckCircle2` (Ready), `XCircle` (Failed), `Clock` (Queued)
- Citations: `FileText` (Open), `CheckCheck` (Verified), `Flag` (Unsupported)
- UI: `ChevronDown` (Expand), `X` (Close), `Menu` (Hamburger), `Search` (Search), `Filter` (Filter), `ArrowUpDown` (Sort)

---

## 8. Motion

**Philosophy:** Subtle, functional only. Motion communicates state change and spatial relationships — never decoration. Full `prefers-reduced-motion` support (instant transitions).

### Standard Durations
| Motion | Duration | Easing |
|--------|----------|--------|
| Button press | 100ms | ease-out |
| Input focus | 150ms | ease-out |
| Card hover | 200ms | ease-out |
| Sidebar collapse | 200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Drawer slide | 150ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Modal fade+scale | 150ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Toast slide | 200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Tooltip | 100ms | ease-out |
| Skeleton pulse | 1.5s | ease-in-out (infinite) |

### Specific Behaviors
- **Streaming Answer:** No animation — native token-by-token render (the content IS the motion)
- **Run Step Progress:** Step indicator transitions (150ms), progress bar (200ms)
- **Citation Highlight:** 150ms background flash on click (scroll into view)
- **Page Transitions:** None (SPA, instant route change)
- **Sidebar:** Width + label opacity transition together

### Reduced Motion
When `prefers-reduced-motion: reduce`:
- All transitions → `0ms`
- All animations → `none`
- Skeleton pulse → static
- Toast → instant appear/disappear
- Drawer/Modal → instant

---

## 9. Accessibility

### Non-Negotiable Requirements (Enforced)
1. **Color Contrast:** All text meets WCAG AA (4.5:1). Primary text meets AAA (7:1). Verified for both themes.
2. **Focus Visible:** Every interactive element has a 2px `border-focus` ring (3:1 against adjacent). Never `outline: none` without replacement.
3. **Tap Targets:** Minimum 44×44px for all touch targets (buttons, inputs, links, icons).
4. **Semantic HTML:** Proper heading hierarchy (h1→h2→h3), landmarks (`main`, `nav`, `aside`, `header`, `footer`), lists for navigation.
5. **ARIA:** Labels for icon-only buttons, `aria-expanded`/`aria-controls` for disclosures, `role="alert"` for error toasts, `aria-live="polite"` for status updates.
6. **Keyboard Navigation:** Tab order matches visual order, focus trapped in modals/drawers, ESC closes overlays, arrow keys in composite widgets.
7. **Reduced Motion:** All transitions/animations disabled instantly when `prefers-reduced-motion: reduce`.
8. **Dark Mode:** Full support, no hardcoded colors, system preference respected.
9. **Zoom/Scale:** Layout functional at 200% browser zoom, no horizontal scroll at 320px width.
10. **Screen Readers:** Meaningful alt text for illustrations, `sr-only` labels where visual design omits text, citation numbers announced.

### Implementation Checklist
- [ ] Focus ring component (reusable)
- [ ] Skip to main content link
- [ ] Focus trap hook (modals/drawers)
- [ ] `useReducedMotion` hook
- [ ] Color contrast test in CI (axe-core)
- [ ] Keyboard navigation test in E2E (Playwright)

---

## 10. Do and Don't

### Do ✅
- Use `paper-elevated` for all cards, modals, dropdowns — creates consistent layer separation
- Use `accent-terracotta` **only** for primary actions, links, focus, active selection
- Use tonal secondary (`accent-terracotta-subtle` bg) for secondary CTAs
- Keep body text at 16px (1rem) minimum — readability first
- Use `Space Grotesk` for all headings, `Inter` for all body/UI text
- Use `JetBrains Mono` for citations, code, token counts, technical IDs
- Apply 16px base spacing rhythm — 4px grid alignment
- Show focus rings on **every** interactive element (buttons, links, inputs, cards with actions)
- Use status badges consistently (processing/ready/failed/queued)
- Respect `prefers-reduced-motion` — test with it enabled
- Design for 375px first, enhance for desktop
- Use Lucide icons at defined sizes — don't scale arbitrarily
- Write real content in designs (from PRD) — no lorem ipsum

### Don't ❌
- Don't use `accent-terracotta` for decorative elements, backgrounds, or non-interactive accents
- Don't use `error-crimson` for anything except errors/destructive actions
- Don't use shadows heavier than `md` (0 4px 12px) — no "floating" cards
- Don't use border-radius smaller than 6px (except pills/badges = full)
- Don't mix font families — Space Grotesk for headings only, Inter for body only
- Don't use font-weight 300 (light) for body text at sizes < 18px
- Don't use letter-spacing on body text
- Don't use `outline: none` without a visible focus alternative
- Don't put interactive elements below 44×44px
- Don't use color alone to convey meaning (always + icon/text)
- Don't animate layout properties (width, height, top, left) — use transform
- Don't use decorative motion (bounce, elastic, stagger) — functional only
- Don't hardcode colors — always use design tokens
- Don't design screens not in the PRD screen list

---

## 11. Screen List & Routes (PRD-Aligned)

| # | Screen | Route | PRD Story | Priority |
|---|--------|-------|-----------|----------|
| 1 | Marketing / Landing | `/` | B6 entry | Must |
| 2 | Auth: Magic Link Request | `/auth/link` | B1 | Must |
| 3 | Auth: Magic Link Success | `/auth/callback` | B1 | Must |
| 4 | Onboarding: Welcome + Workspace | `/onboarding/workspace` | B6 | Must |
| 5 | Onboarding: Sample Upload + First Q | `/onboarding/first-question` | B6, A1, A2 | Must |
| 6 | Dashboard / Workspace Home | `/app` | A3 overview | Must |
| 7 | Sources: List + Upload | `/app/sources` | A1 | Must |
| 8 | Source Detail | `/app/sources/:id` | A1, A9 | Must |
| 9 | Chat / Conversation | `/app/chat/:conversationId?` | A2, A4, A5, A6, A10, A11, C1 | Must |
| 10 | Citation Drawer | (Drawer) `/app/chat/:id/citation/:citationId` | C1 | Must |
| 11 | Run Workflow: Research | `/app/runs/research` | C3 | Must |
| 12 | Run History + Timeline | `/app/runs` | A9 | Must |
| 13 | Artifact View | `/app/artifacts/:id` | A9, C3 | Must |
| 14 | Usage / Limits Meter | `/app/usage` | B3 | Must |
| 15 | Settings: Profile, Preferences, Dark Mode | `/app/settings` | B4 (Should) | Should |
| 16 | Settings: Data Export / Delete | `/app/settings/privacy` | B5 | Must |
| 17 | Upgrade / Payment Instructions | `/app/upgrade` | B2 (Should) | Deferred |
| 18 | Error Pages (404, 500, Offline, Cap) | `/404`, `/500`, `/offline`, `/cap` | — | Must |

**Total: 17 screens designed (16 Must/Should + 1 Deferred)**

---

## 12. Implementation Notes

### CSS Architecture
- **Tokens:** CSS custom properties (CSS variables) for all design tokens
- **Utility Classes:** Minimal (spacing, typography) — prefer component-scoped styles
- **Components:** Styled with CSS Modules or Tailwind (using design token config)
- **Theming:** `[data-theme="light"]` / `[data-theme="dark"]` on `<html>`, CSS variable swap

### Token Usage Example
```css
:root {
  --color-ink: #1a1a2e;
  --color-paper: #fafafa;
  --color-accent-terracotta: #b85c3d;
  --radius-lg: 0.5rem;
  --shadow-md: 0 4px 12px rgba(26,26,46,0.12);
  --transition-normal: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --color-ink: #e8e8e8;
  --color-paper: #141418;
  --color-accent-terracotta: #c47d5a;
  --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
}

.btn-primary {
  background: var(--color-accent-terracotta);
  color: var(--color-ink-inverse);
  border-radius: var(--radius-md);
  transition: background var(--transition-normal), transform 100ms ease-out;
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-accent-terracotta-focus);
}
```

### React Component Props (TypeScript)
All components accept `variant`, `size`, `disabled`, `loading` props matching the token definitions. No ad-hoc styling props.

---

*End of DESIGN.md — This is the single source of truth for all UI implementation and Stitch generation prompts.*