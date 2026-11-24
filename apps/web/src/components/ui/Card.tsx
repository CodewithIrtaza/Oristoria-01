import { forwardRef, HTMLAttributes, ReactNode } from "react";
import "./Card.css";

export type CardVariant = "default" | "source" | "artifact" | "run-step" | "citation" | "empty" | "error";
export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  selected?: boolean;
  loading?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      selected = false,
      loading = false,
      hoverable = false,
      onClick,
      children,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const classNames = [
      "card",
      `card--${variant}`,
      `card--padding-${padding}`,
      selected && "card--selected",
      loading && "card--loading",
      hoverable && "card--hoverable",
      onClick && "card--clickable",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleMouseEnter = (e: React.MouseEvent) => {
      if (hoverable) {
        e.currentTarget.classList.add("card--hover");
      }
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
      if (hoverable) {
        e.currentTarget.classList.remove("card--hover");
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (hoverable && !loading) {
        e.currentTarget.classList.add("card--pressed");
      }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
      if (hoverable) {
        e.currentTarget.classList.remove("card--pressed");
      }
    };

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid="card"
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
        {...props}
      >
        {loading && <div className="card__skeleton" data-testid="card-skeleton" aria-hidden="true" />}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ============================================================================
   CARD SUB-COMPONENTS
   ============================================================================ */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`card__header ${className}`} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", children, className = "", ...props }, ref) => (
    <Component ref={ref} className={`card__title ${className}`} {...props}>
      {children}
    </Component>
  )
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = "", ...props }, ref) => (
    <p ref={ref} className={`card__description ${className}`} {...props}>
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`card__content ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";

export interface CardActionProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "destructive-filled";
  size?: "sm" | "md" | "lg";
}

export const CardAction = forwardRef<HTMLButtonElement, CardActionProps>(
  ({ variant = "ghost", size = "sm", children, className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`btn btn--${variant} btn--${size} card__action ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

CardAction.displayName = "CardAction";