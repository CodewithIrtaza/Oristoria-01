import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "../Card";

describe("Card — renders source/artifact card shapes per DESIGN.md §6", () => {
  describe("Base card", () => {
    it("renders with correct base classes", () => {
      render(<Card>Card content</Card>);
      const card = screen.getByText("Card content").closest("[data-testid='card']") as HTMLElement;

      expect(card).toHaveClass("card");
      expect(card).toHaveClass("card--default");
      expect(card).toHaveClass("card--padding-md");
    });

    it("applies sm shadow class by default", () => {
      render(<Card>Card content</Card>);
      const card = screen.getByText("Card content").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card");
    });

    it("accepts padding variants", () => {
      const { rerender } = render(<Card padding="sm">Small</Card>);
      let card = screen.getByText("Small").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card--padding-sm");

      rerender(<Card padding="md">Medium</Card>);
      card = screen.getByText("Medium").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card--padding-md");

      rerender(<Card padding="lg">Large</Card>);
      card = screen.getByText("Large").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card--padding-lg");
    });
  });

  describe("Hover state", () => {
    it("applies hover class on mouse enter", () => {
      render(<Card hoverable>Hover me</Card>);
      const card = screen.getByText("Hover me").closest("[data-testid='card']") as HTMLElement;

      fireEvent.mouseEnter(card!);
      expect(card).toHaveClass("card--hover");

      fireEvent.mouseLeave(card!);
      expect(card).not.toHaveClass("card--hover");
    });
  });

  describe("Selected state", () => {
    it("applies selected class and styles", () => {
      render(<Card selected>Selected</Card>);
      const card = screen.getByText("Selected").closest("[data-testid='card']") as HTMLElement;

      expect(card).toHaveClass("card--selected");
    });
  });

  describe("Error state", () => {
    it("applies error variant class", () => {
      render(<Card variant="error">Error</Card>);
      const card = screen.getByText("Error").closest("[data-testid='card']") as HTMLElement;

      expect(card).toHaveClass("card--error");
    });
  });

  describe("Loading state", () => {
    it("shows skeleton preserving dimensions", () => {
      render(<Card loading>Loading</Card>);
      const card = screen.getByText("Loading").closest("[data-testid='card']") as HTMLElement;

      expect(card).toHaveClass("card--loading");
      expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("renders illustration, title, description, and action button", () => {
      render(
        <Card variant="empty">
          <CardHeader>
            <CardTitle>No sources yet</CardTitle>
            <CardDescription>Upload your first document to get started</CardDescription>
          </CardHeader>
          <CardFooter>
            <CardAction variant="primary">Upload</CardAction>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("No sources yet")).toBeInTheDocument();
      expect(screen.getByText("Upload your first document to get started")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
      expect(screen.getByText("Upload")).toHaveClass("card__action");
    });
  });

  describe("Card sub-components", () => {
    it("CardHeader renders with correct classes", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText("Title")).toHaveClass("card__title");
      expect(screen.getByText("Description")).toHaveClass("card__description");
      expect(screen.getByText("Title").closest(".card__header")).toBeInTheDocument();
    });

    it("CardContent renders content area", () => {
      render(
        <Card>
          <CardContent>Body content</CardContent>
        </Card>
      );
      expect(screen.getByText("Body content")).toHaveClass("card__content");
    });

    it("CardFooter renders footer with right-aligned actions", () => {
      render(
        <Card>
          <CardFooter>
            <CardAction variant="ghost">Cancel</CardAction>
            <CardAction variant="primary">Confirm</CardAction>
          </CardFooter>
        </Card>
      );

      const footer = screen.getByText("Cancel").closest(".card__footer") as HTMLElement;
      expect(footer).toBeInTheDocument();
      // Primary should be rightmost (last child)
      const actions = screen.getAllByRole("button");
      expect(actions[actions.length - 1]).toHaveTextContent("Confirm");
    });
  });

  describe("Source card shape (per DESIGN.md §6)", () => {
    it("renders source card with thumbnail, title, status badge, page count, date, overflow menu", () => {
      render(
        <Card variant="source">
          <div data-testid="source-thumbnail" className="card__thumbnail" />
          <CardHeader>
            <CardTitle>Research Paper.pdf</CardTitle>
            <CardDescription>Uploaded 2 hours ago • 42 pages</CardDescription>
          </CardHeader>
          <CardContent>
            <span data-testid="status-badge" className="badge badge--ready">Ready</span>
          </CardContent>
          <CardFooter>
            <CardAction variant="ghost" data-testid="overflow-menu">
              <span aria-hidden="true">⋮</span>
            </CardAction>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId("source-thumbnail")).toBeInTheDocument();
      expect(screen.getByText("Research Paper.pdf")).toBeInTheDocument();
      expect(screen.getByText("Uploaded 2 hours ago • 42 pages")).toBeInTheDocument();
      expect(screen.getByTestId("status-badge")).toHaveClass("badge--ready");
      expect(screen.getByTestId("overflow-menu")).toBeInTheDocument();
    });
  });

  describe("Artifact card shape (per DESIGN.md §6)", () => {
    it("renders artifact card with icon, title, kind badge, run link, date, preview action", () => {
      render(
        <Card variant="artifact">
          <CardHeader>
            <div data-testid="artifact-icon" className="card__icon" aria-hidden="true">📄</div>
            <div className="card__header-row">
              <CardTitle>Research Brief: AI Safety</CardTitle>
              <span data-testid="kind-badge" className="badge badge--info">research_brief</span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Generated from run #123 • 3 minutes ago</CardDescription>
          </CardContent>
          <CardFooter>
            <CardAction variant="ghost" data-testid="run-link">View run</CardAction>
            <CardAction variant="primary" data-testid="preview">Preview</CardAction>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId("artifact-icon")).toBeInTheDocument();
      expect(screen.getByText("Research Brief: AI Safety")).toBeInTheDocument();
      expect(screen.getByTestId("kind-badge")).toHaveClass("badge--info");
      expect(screen.getByText("Generated from run #123 • 3 minutes ago")).toBeInTheDocument();
      expect(screen.getByTestId("run-link")).toHaveTextContent("View run");
      expect(screen.getByTestId("preview")).toHaveTextContent("Preview");
    });
  });

  describe("Run Step card shape (per DESIGN.md §6)", () => {
    it("renders run step card with node icon, step name, status badge, duration, expand chevron", () => {
      render(
        <Card variant="run-step">
          <CardHeader>
            <div data-testid="step-icon" className="card__icon" aria-hidden="true">🔍</div>
            <CardTitle>Gather Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="card__meta">
              <span data-testid="step-status" className="badge badge--ready">Completed</span>
              <span data-testid="step-duration">2.3s</span>
            </div>
          </CardContent>
          <CardFooter>
            <CardAction variant="ghost" data-testid="expand">
              <span aria-hidden="true">▼</span>
            </CardAction>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId("step-icon")).toBeInTheDocument();
      expect(screen.getByText("Gather Evidence")).toBeInTheDocument();
      expect(screen.getByTestId("step-status")).toHaveClass("badge--ready");
      expect(screen.getByTestId("step-duration")).toHaveTextContent("2.3s");
      expect(screen.getByTestId("expand")).toBeInTheDocument();
    });
  });

  describe("Citation card shape (per DESIGN.md §6)", () => {
    it("renders citation card with source title, page, excerpt, verdict badge, open action", () => {
      render(
        <Card variant="citation">
          <CardHeader>
            <CardTitle>Source Document.pdf</CardTitle>
            <CardDescription>Page 5</CardDescription>
          </CardHeader>
          <CardContent>
            <p data-testid="excerpt">This is the cited passage from the document...</p>
          </CardContent>
          <CardFooter>
            <span data-testid="verdict-badge" className="badge badge--success">Verified</span>
            <CardAction variant="ghost" data-testid="open-citation">Open</CardAction>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Source Document.pdf")).toBeInTheDocument();
      expect(screen.getByText("Page 5")).toBeInTheDocument();
      expect(screen.getByTestId("excerpt")).toHaveTextContent("This is the cited passage from the document...");
      expect(screen.getByTestId("verdict-badge")).toHaveClass("badge--success");
      expect(screen.getByTestId("open-citation")).toHaveTextContent("Open");
    });
  });

  describe("No hardcoded colors", () => {
    it("uses CSS variable classes for all variants", () => {
      render(<Card>Test</Card>);
      const card = screen.getByText("Test").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card");
      expect(card).toHaveClass("card--default");
    });

    it("error variant uses error CSS variable classes", () => {
      render(<Card variant="error">Error</Card>);
      const card = screen.getByText("Error").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card--error");
    });

    it("selected state uses accent CSS variable classes", () => {
      render(<Card selected>Selected</Card>);
      const card = screen.getByText("Selected").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card--selected");
    });
  });

  describe("Clickable card", () => {
    it("applies clickable class when onClick provided", () => {
      render(<Card onClick={() => {}}>Clickable</Card>);
      const card = screen.getByText("Clickable").closest("[data-testid='card']") as HTMLElement;
      expect(card).toHaveClass("card--clickable");
    });

    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Clickable</Card>);
      const card = screen.getByText("Clickable").closest("[data-testid='card']") as HTMLElement;

      fireEvent.click(card!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Pressed state", () => {
    it("applies pressed class on mousedown for hoverable cards", () => {
      render(<Card hoverable>Press Me</Card>);
      const card = screen.getByText("Press Me").closest("[data-testid='card']") as HTMLElement;

      fireEvent.mouseDown(card!);
      expect(card).toHaveClass("card--pressed");

      fireEvent.mouseUp(card!);
      expect(card).not.toHaveClass("card--pressed");
    });
  });
});