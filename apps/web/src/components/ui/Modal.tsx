import { forwardRef, ReactNode, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = "md",
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      footer,
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

    const modalContent = (
      <div
        className="modal__backdrop"
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
      >
        <div
          ref={ref}
          className={`modal modal--${size}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <header className="modal__header">
              {title && (
                <h2 id="modal-title" className="modal__title">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="modal__description">
                  {description}
                </p>
              )}
              {showCloseButton && (
                <button
                  className="modal__close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </header>
          )}
          <div className="modal__body">{children}</div>
          {footer && (
            <footer className="modal__footer">{footer}</footer>
          )}
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";