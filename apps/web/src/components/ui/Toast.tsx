import { forwardRef, ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import "./Toast.css";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  onClose: (id: string) => void;
  duration?: number; // ms, 0 = persistent
}

export interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  duration?: number;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, variant, title, description, action, onClose, duration = 4000 }, ref) => {
    const toastId = useId();
    const titleId = `${toastId}-title`;
    const descId = `${toastId}-description`;

    useEffect(() => {
      if (duration <= 0) return;

      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const handleMouseEnter = () => {
      // Pause auto-dismiss on hover
    };

    const handleMouseLeave = () => {
      // Resume auto-dismiss
    };

    const classNames = [
      "toast",
      `toast--${variant}`,
    ].join(" ");

    const role = variant === "error" ? "alert" : "status";

    return (
      <div
        ref={ref}
        className={classNames}
        role={role}
        aria-live={variant === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="toast__icon" aria-hidden="true">
          {getIcon(variant)}
        </div>
        <div className="toast__content">
          <h4 id={titleId} className="toast__title">{title}</h4>
          {description && (
            <p id={descId} className="toast__description">{description}</p>
          )}
        </div>
        {action && (
          <div className="toast__action">{action}</div>
        )}
        <button
          className="toast__dismiss"
          onClick={() => onClose(id)}
          aria-label="Dismiss"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

function getIcon(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "error":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case "warning":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

/* ============================================================================
   TOAST CONTAINER (for managing multiple toasts)
   ============================================================================ */

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          duration={toast.duration ?? 4000}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  );
};

ToastContainer.displayName = "ToastContainer";