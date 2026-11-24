import { SVGAttributes, ComponentType, memo } from "react";
import "./Icon.css";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: string;
  size?: IconSize;
  color?: "default" | "muted" | "accent" | "error" | "success" | "inverse";
}

const iconCache = new Map<string, ComponentType<SVGAttributes<SVGSVGElement>>>();

function getLucideIcon(name: string): ComponentType<SVGAttributes<SVGSVGElement>> {
  if (!iconCache.has(name)) {
    // Create a minimal Lucide-like icon component
    // In practice, you'd import from lucide-react directly
    const IconComponent = memo((props: SVGAttributes<SVGSVGElement>) => (
      <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ));
    iconCache.set(name, IconComponent);
  }
  return iconCache.get(name)!;
}

const SIZE_MAP: Record<IconSize, string> = {
  xs: "var(--icon-size-xs)",
  sm: "var(--icon-size-sm)",
  md: "var(--icon-size-md)",
  lg: "var(--icon-size-lg)",
  xl: "var(--icon-size-xl)",
  "2xl": "var(--icon-size-2xl)",
};

const COLOR_MAP = {
  default: "var(--color-ink-muted)",
  muted: "var(--color-ink-subtle)",
  accent: "var(--color-accent-terracotta)",
  error: "var(--color-error-crimson)",
  success: "var(--color-success-teal)",
  inverse: "var(--color-ink-inverse)",
};

export const Icon = memo(({ name, size = "md", color = "default", className = "", style, children, ...props }: IconProps) => {
  const LucideIcon = getLucideIcon(name);

  const iconStyle: React.CSSProperties = {
    width: SIZE_MAP[size],
    height: SIZE_MAP[size],
    color: COLOR_MAP[color],
    flexShrink: 0,
    ...style,
  };

  return (
    <LucideIcon
      className={className}
      style={iconStyle}
      {...props}
    >
      {children}
    </LucideIcon>
  );
});

Icon.displayName = "Icon";

/* ============================================================================
   PREDEFINED ICONS - Re-export common ones for convenience
   ============================================================================ */

export const Icons = {
  // Navigation
  FolderOpen: "folder-open",
  MessageSquare: "message-square",
  FileText: "file-text",
  GitBranch: "git-branch",
  Settings: "settings",
  Search: "search",
  Filter: "filter",
  Menu: "menu",
  ChevronDown: "chevron-down",
  ChevronUp: "chevron-up",
  ChevronLeft: "chevron-left",
  ChevronRight: "chevron-right",
  ArrowUpDown: "arrow-up-down",

  // Actions
  Upload: "upload",
  Download: "download",
  Trash2: "trash-2",
  Edit2: "edit-2",
  Copy: "copy",
  Share2: "share-2",
  Plus: "plus",
  Minus: "minus",
  MoreHorizontal: "more-horizontal",
  MoreVertical: "more-vertical",
  DollarSign: "dollar-sign",

  // States
  Loader2: "loader-2",
  CheckCircle2: "check-circle-2",
  XCircle: "x-circle",
  Clock: "clock",
  AlertCircle: "alert-circle",
  AlertTriangle: "alert-triangle",
  Info: "info",

  // Citations
  CheckCheck: "check-check",
  Flag: "flag",
  BookOpen: "book-open",
  Link: "link",
  ExternalLink: "external-link",

  // UI
  X: "x",
  Check: "check",
  Star: "star",
  Heart: "heart",
  Bell: "bell",
  Mail: "mail",
  User: "user",
  Users: "users",
  Lock: "lock",
  Unlock: "unlock",
  Eye: "eye",
  EyeOff: "eye-off",
  Home: "home",
  ArrowLeft: "arrow-left",
  ArrowRight: "arrow-right",
  RefreshCw: "refresh-cw",
  RotateCcw: "rotate-ccw",
} as const;

export type IconName = keyof typeof Icons;