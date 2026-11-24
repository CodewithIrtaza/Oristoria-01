import React, { forwardRef, HTMLAttributes, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import "./Avatar.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: "circle" | "square";
  fallback?: ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = "md", shape = "circle", fallback, className = "", ...props }, ref) => {
    const initials = useMemo(() => {
      if (!name) return "?";
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }, [name]);

    const hasImage = Boolean(src);
    const imageErrorRef = useRef(false);

    const handleError = () => {
      imageErrorRef.current = true;
    };

    const classNames = [
      "avatar",
      `avatar--${size}`,
      `avatar--${shape}`,
      hasImage && !imageErrorRef.current ? "avatar--has-image" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classNames}
        role="img"
        aria-label={name || alt || "Avatar"}
        {...props}
      >
        {hasImage && !imageErrorRef.current ? (
          <img
            src={src}
            alt={alt || name || ""}
            className="avatar__image"
            onError={handleError}
            loading="lazy"
          />
        ) : fallback ? (
          <span className="avatar__fallback">{fallback}</span>
        ) : (
          <span className="avatar__initials">{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";