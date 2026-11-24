import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "oristoria-theme" }: {
  children: ReactNode;
  defaultTheme?: Theme | "system";
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) return stored;

    if (defaultTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<Theme>(theme);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // Update resolved theme and apply to document
  useEffect(() => {
    setResolvedTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(storageKey);
      if (!stored && defaultTheme === "system") {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [defaultTheme, storageKey]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/* ============================================================================
   THEME TOGGLE BUTTON
   ============================================================================ */

export function ThemeToggle({ className = "", ariaLabel = "Toggle theme", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { ariaLabel?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`btn btn--ghost btn--sm theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={ariaLabel}
      aria-pressed={theme === "dark"}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      {...props}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span className="theme-toggle__label">
        {theme === "light" ? "Dark" : "Light"}
      </span>
    </button>
  );
}