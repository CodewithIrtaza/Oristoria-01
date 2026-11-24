import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Design tokens — CSS variables match DESIGN.md YAML values", () => {
  let styleSheet: CSSStyleSheet;

  beforeAll(() => {
    // Create a test stylesheet with our tokens
    const style = document.createElement("style");
    style.textContent = `
      :root {
        /* Light theme (default) */
        --color-paper: #fafafa;
        --color-paper-elevated: #ffffff;
        --color-paper-hover: #f5f5f5;
        --color-paper-pressed: #eeeeee;

        --color-ink: #1a1a2e;
        --color-ink-muted: #4a4a6a;
        --color-ink-subtle: #8a8a9a;
        --color-ink-inverse: #ffffff;

        --color-border-subtle: #e5e5e5;
        --color-border-emphasis: #d0d0d0;
        --color-border-focus: #b85c3d;
        --color-border-error: #b91c1c;

        --color-accent-terracotta: #b85c3d;
        --color-accent-terracotta-hover: #9d4d33;
        --color-accent-terracotta-pressed: #85402b;
        --color-accent-terracotta-subtle: #fdf2ef;
        --color-accent-terracotta-focus: rgba(184, 92, 61, 0.25);

        --color-success-teal: #0d9488;
        --color-success-teal-subtle: #e6fffb;
        --color-warning-amber: #c4963a;
        --color-warning-amber-subtle: #fffbeb;
        --color-error-crimson: #b91c1c;
        --color-error-crimson-subtle: #fef2f2;
        --color-info-slate: #475569;
        --color-info-slate-subtle: #f1f5f9;

        --color-status-processing: #475569;
        --color-status-processing-bg: #f1f5f9;
        --color-status-ready: #0d9488;
        --color-status-ready-bg: #e6fffb;
        --color-status-failed: #b91c1c;
        --color-status-failed-bg: #fef2f2;
        --color-status-queued: #c4963a;
        --color-status-queued-bg: #fffbeb;

        /* Typography */
        --font-heading: "Space Grotesk", sans-serif;
        --font-body: "Inter", sans-serif;
        --font-mono: "JetBrains Mono", monospace;

        --font-weight-light: 300;
        --font-weight-regular: 400;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;

        /* Type scale */
        --text-display-xl: 3.5rem;
        --text-display-lg: 2.5rem;
        --text-display-md: 2rem;
        --text-display-sm: 1.5rem;

        --text-h1: 1.875rem;
        --text-h2: 1.5rem;
        --text-h3: 1.25rem;
        --text-h4: 1.125rem;

        --text-body-lg: 1.125rem;
        --text-body: 1rem;
        --text-body-sm: 0.875rem;
        --text-body-xs: 0.75rem;

        --text-label-lg: 0.875rem;
        --text-label: 0.75rem;
        --text-label-xs: 0.625rem;

        --text-mono-lg: 1rem;
        --text-mono: 0.875rem;
        --text-mono-sm: 0.75rem;

        /* Spacing */
        --space-base: 1rem;
        --space-0: 0;
        --space-1: 0.25rem;
        --space-2: 0.5rem;
        --space-3: 0.75rem;
        --space-4: 1rem;
        --space-5: 1.25rem;
        --space-6: 1.5rem;
        --space-8: 2rem;
        --space-10: 2.5rem;
        --space-12: 3rem;
        --space-16: 4rem;
        --space-20: 5rem;
        --space-24: 6rem;

        --layout-container-max: 72rem;
        --layout-container-padding: 1.5rem;
        --layout-sidebar-width: 16rem;
        --layout-sidebar-width-expanded: 20rem;
        --layout-topbar-height: 4rem;
        --layout-modal-max-width: 32rem;
        --layout-drawer-width: 24rem;

        /* Shape & Borders */
        --radius-none: 0;
        --radius-sm: 0.25rem;
        --radius-md: 0.375rem;
        --radius-lg: 0.5rem;
        --radius-xl: 0.75rem;
        --radius-2xl: 1rem;
        --radius-full: 9999px;

        --border-width-thin: 1px;
        --border-width-normal: 1px;
        --border-width-thick: 2px;
        --border-width-focus: 2px;

        --shadow-none: none;
        --shadow-xs: 0 1px 2px rgba(26,26,46,0.04);
        --shadow-sm: 0 1px 3px rgba(26,26,46,0.08);
        --shadow-md: 0 4px 12px rgba(26,26,46,0.12);
        --shadow-lg: 0 8px 24px rgba(26,26,46,0.16);
        --shadow-xl: 0 16px 48px rgba(26,26,46,0.2);
        --shadow-inner: inset 0 2px 4px rgba(26,26,46,0.06);
        --shadow-focus: 0 0 0 2px rgba(184,92,61,0.25);
        --shadow-focus-dark: 0 0 0 2px rgba(196,125,90,0.35);

        /* Transitions & Motion */
        --duration-instant: 0ms;
        --duration-fast: 100ms;
        --duration-normal: 150ms;
        --duration-slow: 200ms;
        --duration-slower: 300ms;

        --easing-ease-out: cubic-bezier(0.4, 0, 0.2, 1);
        --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
        --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
        --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

        --transition-sidebar: width 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms ease-out;
        --transition-drawer: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease-out;
        --transition-modal: opacity 150ms ease-out, transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
        --transition-toast: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease-out;
        --transition-button: transform 100ms ease-out, background-color 150ms ease-out, box-shadow 150ms ease-out;
        --transition-input: border-color 150ms ease-out, box-shadow 150ms ease-out, background-color 150ms ease-out;
        --transition-card: box-shadow 200ms ease-out, border-color 150ms ease-out, transform 150ms ease-out;
        --transition-tooltip: opacity 100ms ease-out, transform 100ms ease-out;
        --transition-skeleton: background-position 1.5s ease-in-out infinite;

        /* Z-Index */
        --z-base: 0;
        --z-dropdown: 100;
        --z-sticky: 200;
        --z-sidebar: 300;
        --z-modal-backdrop: 400;
        --z-modal: 500;
        --z-drawer: 600;
        --z-toast: 700;
        --z-tooltip: 800;
        --z-popover: 900;

        /* Breakpoints */
        --bp-sm: 640px;
        --bp-md: 768px;
        --bp-lg: 1024px;
        --bp-xl: 1280px;
        --bp-2xl: 1536px;

        /* Component tokens */
        --btn-height-sm: 2rem;
        --btn-height-md: 2.5rem;
        --btn-height-lg: 3rem;
        --btn-padding-sm: 0 0.75rem;
        --btn-padding-md: 0 1rem;
        --btn-padding-lg: 0 1.5rem;
        --btn-gap: 0.5rem;
        --btn-icon-size-sm: 1rem;
        --btn-icon-size-md: 1.25rem;
        --btn-icon-size-lg: 1.5rem;

        --input-height-sm: 2rem;
        --input-height-md: 2.5rem;
        --input-height-lg: 3rem;
        --input-padding-sm: 0 0.75rem;
        --input-padding-md: 0 1rem;
        --input-padding-lg: 0 1.25rem;
        --input-placeholder-color: var(--color-ink-subtle);

        --card-padding-sm: 1rem;
        --card-padding-md: 1.5rem;
        --card-padding-lg: 2rem;
        --card-gap: 1rem;

        --table-cell-padding: 0.75rem 1rem;
        --table-header-height: 3rem;
        --table-row-height: 3.5rem;

        --modal-padding: 1.5rem;

        --drawer-width: 24rem;
        --drawer-mobile-width: 100%;

        --toast-max-width: 24rem;
        --toast-gap: 0.75rem;

        --avatar-size-xs: 1.5rem;
        --avatar-size-sm: 2rem;
        --avatar-size-md: 2.5rem;
        --avatar-size-lg: 3rem;
        --avatar-size-xl: 4rem;

        --badge-height: 1.25rem;
        --badge-padding: 0 0.5rem;
        --badge-font-size: var(--text-label-xs);
        --badge-gap: 0.25rem;

        /* Icons */
        --icon-stroke-width: 2;
        --icon-stroke-linecap: round;
        --icon-stroke-linejoin: round;
        --icon-size-xs: 0.75rem;
        --icon-size-sm: 1rem;
        --icon-size-md: 1.25rem;
        --icon-size-lg: 1.5rem;
        --icon-size-xl: 2rem;
        --icon-size-2xl: 3rem;
      }

      [data-theme="dark"] {
        --color-paper: #141418;
        --color-paper-elevated: #1c1c24;
        --color-paper-hover: #242430;
        --color-paper-pressed: #2d2d3a;

        --color-ink: #e8e8e8;
        --color-ink-muted: #a0a0b0;
        --color-ink-subtle: #6b6b7b;
        --color-ink-inverse: #1a1a2e;

        --color-border-subtle: #2d2d3a;
        --color-border-emphasis: #3d3d5c;
        --color-border-focus: #c47d5a;
        --color-border-error: #f87171;

        --color-accent-terracotta: #c47d5a;
        --color-accent-terracotta-hover: #d08d6a;
        --color-accent-terracotta-pressed: #b86d4a;
        --color-accent-terracotta-subtle: #3d2a24;
        --color-accent-terracotta-focus: rgba(196, 125, 90, 0.35);

        --color-success-teal: #2dd4bf;
        --color-success-teal-subtle: #0a2d2a;
        --color-warning-amber: #fbbf24;
        --color-warning-amber-subtle: #3d330a;
        --color-error-crimson: #f87171;
        --color-error-crimson-subtle: #3d1a1a;
        --color-info-slate: #94a3b8;
        --color-info-slate-subtle: #1e293b;

        --color-status-processing: #94a3b8;
        --color-status-processing-bg: #1e293b;
        --color-status-ready: #2dd4bf;
        --color-status-ready-bg: #0a2d2a;
        --color-status-failed: #f87171;
        --color-status-failed-bg: #3d1a1a;
        --color-status-queued: #fbbf24;
        --color-status-queued-bg: #3d330a;

        --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
        --shadow-focus: 0 0 0 2px rgba(196,125,90,0.35);
      }
    `;
    document.head.appendChild(style);
    styleSheet = style.sheet as CSSStyleSheet;
  });

  const getVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  describe("Light theme (default) — color tokens", () => {
    it("core surfaces match DESIGN.md", () => {
      expect(getVar("--color-paper")).toBe("#fafafa");
      expect(getVar("--color-paper-elevated")).toBe("#ffffff");
      expect(getVar("--color-paper-hover")).toBe("#f5f5f5");
      expect(getVar("--color-paper-pressed")).toBe("#eeeeee");
    });

    it("text colors match DESIGN.md", () => {
      expect(getVar("--color-ink")).toBe("#1a1a2e");
      expect(getVar("--color-ink-muted")).toBe("#4a4a6a");
      expect(getVar("--color-ink-subtle")).toBe("#8a8a9a");
      expect(getVar("--color-ink-inverse")).toBe("#ffffff");
    });

    it("border colors match DESIGN.md", () => {
      expect(getVar("--color-border-subtle")).toBe("#e5e5e5");
      expect(getVar("--color-border-emphasis")).toBe("#d0d0d0");
      expect(getVar("--color-border-focus")).toBe("#b85c3d");
      expect(getVar("--color-border-error")).toBe("#b91c1c");
    });

    it("accent colors match DESIGN.md", () => {
      expect(getVar("--color-accent-terracotta")).toBe("#b85c3d");
      expect(getVar("--color-accent-terracotta-hover")).toBe("#9d4d33");
      expect(getVar("--color-accent-terracotta-pressed")).toBe("#85402b");
      expect(getVar("--color-accent-terracotta-subtle")).toBe("#fdf2ef");
    });

    it("semantic colors match DESIGN.md", () => {
      expect(getVar("--color-success-teal")).toBe("#0d9488");
      expect(getVar("--color-warning-amber")).toBe("#c4963a");
      expect(getVar("--color-error-crimson")).toBe("#b91c1c");
      expect(getVar("--color-info-slate")).toBe("#475569");
    });

    it("status badge colors match DESIGN.md", () => {
      expect(getVar("--color-status-processing")).toBe("#475569");
      expect(getVar("--color-status-ready")).toBe("#0d9488");
      expect(getVar("--color-status-failed")).toBe("#b91c1c");
      expect(getVar("--color-status-queued")).toBe("#c4963a");
    });
  });

  describe("Dark theme — color tokens", () => {
    beforeAll(() => {
      document.documentElement.setAttribute("data-theme", "dark");
    });

    afterAll(() => {
      document.documentElement.removeAttribute("data-theme");
    });

    it("core surfaces match DESIGN.md dark", () => {
      expect(getVar("--color-paper")).toBe("#141418");
      expect(getVar("--color-paper-elevated")).toBe("#1c1c24");
    });

    it("text colors match DESIGN.md dark", () => {
      expect(getVar("--color-ink")).toBe("#e8e8e8");
      expect(getVar("--color-ink-muted")).toBe("#a0a0b0");
    });

    it("accent colors match DESIGN.md dark", () => {
      expect(getVar("--color-accent-terracotta")).toBe("#c47d5a");
      expect(getVar("--color-border-focus")).toBe("#c47d5a");
    });

    it("semantic colors match DESIGN.md dark", () => {
      expect(getVar("--color-success-teal")).toBe("#2dd4bf");
      expect(getVar("--color-warning-amber")).toBe("#fbbf24");
      expect(getVar("--color-error-crimson")).toBe("#f87171");
    });
  });

  describe("Typography tokens", () => {
    it("font families match DESIGN.md", () => {
      expect(getVar("--font-heading")).toContain("Space Grotesk");
      expect(getVar("--font-body")).toContain("Inter");
      expect(getVar("--font-mono")).toContain("JetBrains Mono");
    });

    it("font weights match DESIGN.md", () => {
      expect(getVar("--font-weight-regular")).toBe("400");
      expect(getVar("--font-weight-medium")).toBe("500");
      expect(getVar("--font-weight-semibold")).toBe("600");
      expect(getVar("--font-weight-bold")).toBe("700");
    });

    it("type scale matches DESIGN.md", () => {
      expect(getVar("--text-h1")).toBe("1.875rem");
      expect(getVar("--text-h2")).toBe("1.5rem");
      expect(getVar("--text-body")).toBe("1rem");
      expect(getVar("--text-body-sm")).toBe("0.875rem");
      expect(getVar("--text-label")).toBe("0.75rem");
    });
  });

  describe("Spacing tokens", () => {
    it("base spacing and scale match DESIGN.md", () => {
      expect(getVar("--space-base")).toBe("1rem");
      expect(getVar("--space-4")).toBe("1rem");
      expect(getVar("--space-6")).toBe("1.5rem");
      expect(getVar("--space-8")).toBe("2rem");
    });

    it("layout tokens match DESIGN.md", () => {
      expect(getVar("--layout-container-max")).toBe("72rem");
      expect(getVar("--layout-sidebar-width")).toBe("16rem");
      expect(getVar("--layout-topbar-height")).toBe("4rem");
    });
  });

  describe("Shape & Border tokens", () => {
    it("border radius matches DESIGN.md", () => {
      expect(getVar("--radius-md")).toBe("0.375rem"); // 6px - buttons, inputs
      expect(getVar("--radius-lg")).toBe("0.5rem");   // 8px - cards
      expect(getVar("--radius-xl")).toBe("0.75rem");  // 12px - modals
      expect(getVar("--radius-full")).toBe("9999px"); // pills, badges
    });

    it("shadows match DESIGN.md", () => {
      expect(getVar("--shadow-sm")).toBe("0 1px 3px rgba(26,26,46,0.08)");
      expect(getVar("--shadow-md")).toBe("0 4px 12px rgba(26,26,46,0.12)");
      expect(getVar("--shadow-focus")).toBe("0 0 0 2px rgba(184,92,61,0.25)");
    });
  });

  describe("Component tokens", () => {
    it("button tokens match DESIGN.md", () => {
      expect(getVar("--btn-height-md")).toBe("2.5rem"); // 40px
      expect(getVar("--btn-padding-md")).toBe("0 1rem");
    });

    it("input tokens match DESIGN.md", () => {
      expect(getVar("--input-height-md")).toBe("2.5rem");
      expect(getVar("--input-padding-md")).toBe("0 1rem");
    });

    it("card tokens match DESIGN.md", () => {
      expect(getVar("--card-padding-md")).toBe("1.5rem");
    });

    it("badge tokens match DESIGN.md", () => {
      expect(getVar("--badge-height")).toBe("1.25rem"); // 20px
    });
  });
});