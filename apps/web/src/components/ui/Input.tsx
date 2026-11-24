import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useId, useRef, useCallback, DragEvent, ChangeEvent, useState } from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = "md",
      fullWidth = false,
      leadingIcon,
      trailingIcon,
      id: providedId,
      className = "",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const classNames = [
      "input-wrapper",
      `input-wrapper--${size}`,
      fullWidth && "input-wrapper--full-width",
      error && "input-wrapper--error",
      disabled && "input-wrapper--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputClassNames = [
      "input",
      `input--${size}`,
      error && "input--error",
      disabled && "input--disabled",
    ]
      .filter(Boolean)
      .join(" ");

    const describedBy = [error && errorId, helperText && helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={classNames}>
        {label && (
          <label htmlFor={id} className="input__label">
            {label}
            {required && <span className="input__required" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="input__field">
          {leadingIcon && <span className="input__icon input__icon--leading" aria-hidden="true">{leadingIcon}</span>}
          <input
            ref={ref}
            id={id}
            className={inputClassNames}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            aria-required={required}
            {...props}
          />
          {trailingIcon && <span className="input__icon input__icon--trailing" aria-hidden="true">{trailingIcon}</span>}
        </div>
        {error && (
          <p id={errorId} className="input__error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="input__helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/* ============================================================================
   TEXTAREA
   ============================================================================ */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = "md",
      fullWidth = false,
      id: providedId,
      className = "",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const classNames = [
      "input-wrapper",
      `input-wrapper--${size}`,
      fullWidth && "input-wrapper--full-width",
      error && "input-wrapper--error",
      disabled && "input-wrapper--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const textareaClassNames = [
      "textarea",
      `textarea--${size}`,
      error && "textarea--error",
      disabled && "textarea--disabled",
    ]
      .filter(Boolean)
      .join(" ");

    const describedBy = [error && errorId, helperText && helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={classNames}>
        {label && (
          <label htmlFor={id} className="input__label">
            {label}
            {required && <span className="input__required" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={textareaClassNames}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="input__error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="input__helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/* ============================================================================
   FILE UPLOAD ZONE
   ============================================================================ */

export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const FileUpload = ({
  label,
  error,
  helperText,
  accept,
  multiple = false,
  maxSize,
  onFilesSelect,
  disabled = false,
  fullWidth = false,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const id = `file-upload-${generatedId}`;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  }, [disabled, maxSize, accept, onFilesSelect]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
    // Reset input value to allow selecting same file again
    if (e.target) e.target.value = "";
  }, [maxSize, accept, onFilesSelect]);

  const validateFiles = (files: File[]): File[] => {
    const valid: File[] = [];

    for (const file of files) {
      // Check accept
      if (accept) {
        const acceptTypes = accept.split(",").map(t => t.trim());
        const matches = acceptTypes.some(type => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type || file.name.endsWith(type);
        });
        if (!matches) continue;
      }

      // Check max size
      if (maxSize && file.size > maxSize) continue;

      valid.push(file);
    }

    return valid;
  };

  const describedBy = [error && errorId, helperText && helperId].filter(Boolean).join(" ") || undefined;

  const classNames = [
    "file-upload",
    fullWidth && "file-upload--full-width",
    disabled && "file-upload--disabled",
    isDragActive && "file-upload--drag-active",
    error && "file-upload--error",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      {label && (
        <label htmlFor={id} className="file-upload__label">
          {label}
        </label>
      )}
      <div
        className="file-upload__zone"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={describedBy}
        aria-label={label || "File upload"}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="file-upload__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="file-upload__content">
          <span className="file-upload__icon" aria-hidden="true">📁</span>
          <p className="file-upload__text">
            {isDragActive ? "Drop files here" : "Drag & drop files here, or click to browse"}
          </p>
          <p className="file-upload__hint">
            {accept ? `Accepted: ${accept}` : "All file types"}
            {maxSize && ` • Max ${formatFileSize(maxSize)}`}
          </p>
        </div>
      </div>
      {error && (
        <p id={errorId} className="file-upload__error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="file-upload__helper">
          {helperText}
        </p>
      )}
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

FileUpload.displayName = "FileUpload";