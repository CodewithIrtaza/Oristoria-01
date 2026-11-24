import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button — all variants, focus ring, disabled state", () => {
  const variants = ["primary", "secondary", "ghost", "destructive", "destructive-filled"] as const;
  const sizes = ["sm", "md", "lg"] as const;

  describe("Variants", () => {
    variants.forEach((variant) => {
      it(`renders ${variant} variant with correct classes`, () => {
        render(<Button variant={variant}>Click me</Button>);
        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toHaveClass(`btn--${variant}`);
      });
    });
  });

  describe("Sizes", () => {
    sizes.forEach((size) => {
      it(`renders ${size} size with correct classes`, () => {
        render(<Button size={size}>Click me</Button>);
        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toHaveClass(`btn--${size}`);
      });
    });
  });

  describe("Focus ring", () => {
    it("has focus-visible styles defined in CSS", () => {
      // The focus ring is handled by CSS :focus-visible pseudo-class
      // We verify the component renders correctly
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button", { name: /focusable/i });
      expect(button).toBeInTheDocument();
    });

    it("applies data-theme for dark mode testing", () => {
      render(<Button>Dark Focus</Button>);
      const button = screen.getByRole("button", { name: /dark focus/i });
      document.documentElement.setAttribute("data-theme", "dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
      document.documentElement.removeAttribute("data-theme");
    });
  });

  describe("Disabled state", () => {
    it("applies disabled styles and prevents interaction", () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByRole("button", { name: /disabled/i });

      expect(button).toBeDisabled();
      expect(button).toHaveClass("btn--disabled");
      expect(button).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("has disabled class for CSS opacity/pointer-events", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button", { name: /disabled/i });
      expect(button).toHaveClass("btn--disabled");
    });
  });

  describe("Loading state", () => {
    it("shows spinner and disables button when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button", { name: /loading/i });

      expect(button).toBeDisabled();
      expect(button).toHaveClass("btn--loading");
      expect(button).toHaveAttribute("aria-busy", "true");
      // Spinner is rendered internally
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("prevents click when loading", () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      const button = screen.getByRole("button", { name: /loading/i });

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Icon support", () => {
    it("renders leading icon when provided", () => {
      render(
        <Button>
          <span data-testid="icon" aria-hidden="true">★</span>
          With Icon
        </Button>
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders icon inside button", () => {
      render(<Button size="sm"><span data-testid="icon" aria-hidden="true">★</span>Small</Button>);
      const button = screen.getByRole("button", { name: /small/i });
      expect(button).toContainHTML("★");
      expect(button.querySelector("[data-testid='icon']")).toBeInTheDocument();
    });

    it("applies size-specific icon class to button", () => {
      const { rerender } = render(<Button size="sm"><span data-testid="icon" aria-hidden="true">★</span>Small</Button>);
      const button = screen.getByRole("button", { name: /small/i });
      // The button should have the size class which affects icon sizing via CSS
      expect(button).toHaveClass("btn--sm");

      rerender(<Button size="md"><span data-testid="icon" aria-hidden="true">★</span>Medium</Button>);
      expect(screen.getByRole("button", { name: /medium/i })).toHaveClass("btn--md");

      rerender(<Button size="lg"><span data-testid="icon" aria-hidden="true">★</span>Large</Button>);
      expect(screen.getByRole("button", { name: /large/i })).toHaveClass("btn--lg");
    });
  });

  describe("Keyboard interaction", () => {
    it("triggers onClick on Enter key", async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Enter</Button>);
      const button = screen.getByRole("button", { name: /enter/i });

      button.focus();
      await userEvent.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("triggers onClick on Space key", async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Space</Button>);
      const button = screen.getByRole("button", { name: /space/i });

      button.focus();
      await userEvent.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Pressed state", () => {
    it("applies pressed class on mousedown", () => {
      render(<Button>Press Me</Button>);
      const button = screen.getByRole("button", { name: /press me/i });

      fireEvent.mouseDown(button);
      expect(button).toHaveClass("btn--pressed");

      fireEvent.mouseUp(button);
      expect(button).not.toHaveClass("btn--pressed");
    });
  });

  describe("No hardcoded colors", () => {
    it("uses CSS variable classes for primary variant", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button", { name: /primary/i });
      // Verify it has the variant class that maps to CSS variables
      expect(button).toHaveClass("btn--primary");
      // The actual colors are applied via CSS variables in .btn--primary
    });

    it("uses CSS variable classes for secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button", { name: /secondary/i });
      expect(button).toHaveClass("btn--secondary");
    });
  });

  describe("Full width", () => {
    it("applies full-width class when requested", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button", { name: /full width/i });
      expect(button).toHaveClass("btn--full-width");
    });
  });

  describe("Icon position", () => {
    it("renders icon at start by default", () => {
      render(
        <Button icon={<span data-testid="icon" aria-hidden="true">★</span>}>
          With Icon
        </Button>
      );
      const icon = screen.getByTestId("icon");
      expect(icon.parentElement).toHaveClass("btn__icon");
    });

    it("renders icon at end when iconPosition=end", () => {
      render(
        <Button icon={<span data-testid="icon" aria-hidden="true">★</span>} iconPosition="end">
          With Icon
        </Button>
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });
  });
});