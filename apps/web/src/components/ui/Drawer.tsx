import { forwardRef, ReactNode, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Drawer.css";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  position?: "right" | "left";
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      position = "right",
    },
    ref
  ) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === "Escape") {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const drawerContent = (
      <div
        className="drawer__backdrop"
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
      >
        <div
          ref={ref}
          className={`drawer drawer--${position}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "drawer-title" : undefined}
          aria-describedby={description ? "drawer-description" : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <header className="drawer__header">
              <div>
                {title && (
                  <h2 id="drawer-title" className="drawer__title">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="drawer-description" className="drawer__description">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  className="drawer__close"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </header>
          )}
          <div className="drawer__body">{children}</div>
        </div>
      </div>
    );

    return createPortal(drawerContent, document.body);
  }
);

Drawer.displayName = "Drawer";