import { forwardRef, ButtonHTMLAttributes, useState } from "react";
import "./Button.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "destructive-filled";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "start",
      fullWidth = false,
      disabled,
      children,
      className = "",
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const [isPressed, setIsPressed] = useState(false);

    const classNames = [
      "btn",
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth && "btn--full-width",
      isDisabled && "btn--disabled",
      loading && "btn--loading",
      isPressed && "btn--pressed",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        setIsPressed(true);
      }
      onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onMouseUp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading && (
          <span className="btn__spinner" aria-hidden="true">
            <svg
              className="btn__spinner-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="btn__spinner-path"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        {icon && iconPosition === "start" && !loading && (
          <span className={`btn__icon btn__icon--${size}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="btn__text">{children}</span>
        {icon && iconPosition === "end" && !loading && (
          <span className={`btn__icon btn__icon--${size}`} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";