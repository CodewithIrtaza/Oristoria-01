import { forwardRef, HTMLAttributes } from "react";
import "./Badge.css";

export type BadgeVariant =
  | "processing"
  | "ready"
  | "failed"
  | "queued"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", icon, children, className = "", ...props }, ref) => {
    const classNames = [
      "badge",
      `badge--${variant}`,
      `badge--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classNames} {...props}>
        {icon && <span className="badge__icon" aria-hidden="true">{icon}</span>}
        <span className="badge__text">{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";