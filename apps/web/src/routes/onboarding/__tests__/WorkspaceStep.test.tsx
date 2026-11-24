// Tests for WorkspaceStep onboarding component
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import { WorkspaceStep } from "../WorkspaceStep";
import { ThemeProvider, ToastContainer } from "../../../components/ui";
import * as onboardingApi from "../../../api/onboarding";

vi.mock("../../../api/onboarding", () => ({
  completeWorkspace: vi.fn(),
  listSampleSources: vi.fn(),
  recordFirstValue: vi.fn(),
  streamFirstQuestion: vi.fn(),
}));

const mockCompleteWorkspace = vi.mocked(onboardingApi.completeWorkspace);

const renderStep = () =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/onboarding/workspace"]}>
        <Routes>
          <Route path="/onboarding/workspace" element={<WorkspaceStep />} />
          <Route
            path="/onboarding/first-question"
            element={<div data-testid="first-question-page" />}
          />
          <Route path="/app" element={<div data-testid="app-page" />} />
        </Routes>
      </MemoryRouter>
      <ToastContainer toasts={[]} onClose={vi.fn()} />
    </ThemeProvider>
  );

describe("WorkspaceStep — validation, loading, continue navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders workspace name input and continue button", () => {
    renderStep();

    expect(screen.getByLabelText(/workspace name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("blocks continue and shows validation error for empty name", async () => {
    renderStep();

    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/required/i)).toBeInTheDocument();
    expect(mockCompleteWorkspace).not.toHaveBeenCalled();
    expect(screen.queryByTestId("first-question-page")).not.toBeInTheDocument();
  });

  it("rejects a name longer than 80 characters", async () => {
    renderStep();

    await userEvent.type(screen.getByLabelText(/workspace name/i), "x".repeat(81));
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/80/i)).toBeInTheDocument();
    expect(mockCompleteWorkspace).not.toHaveBeenCalled();
  });

  it("shows loading state while saving", async () => {
    mockCompleteWorkspace.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ id: "w1", name: "Alpha" }), 100))
    );

    renderStep();
    await userEvent.type(screen.getByLabelText(/workspace name/i), "Alpha Docs");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    });
  });

  it("saves the trimmed name and navigates to the first question step", async () => {
    mockCompleteWorkspace.mockResolvedValue({ id: "w1", name: "Alpha Docs" });

    renderStep();
    await userEvent.type(screen.getByLabelText(/workspace name/i), "  Alpha Docs  ");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockCompleteWorkspace).toHaveBeenCalledWith("Alpha Docs");
    });
    expect(await screen.findByTestId("first-question-page")).toBeInTheDocument();
  });

  it("shows the API error and stays on the step when saving fails", async () => {
    mockCompleteWorkspace.mockRejectedValue(new Error("Database exploded"));

    renderStep();
    await userEvent.type(screen.getByLabelText(/workspace name/i), "Alpha Docs");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/database exploded/i)).toBeInTheDocument();
    expect(screen.queryByTestId("first-question-page")).not.toBeInTheDocument();
  });

  it("skip link takes the user to the app", async () => {
    renderStep();

    await userEvent.click(screen.getByRole("button", { name: /skip/i }));

    expect(await screen.findByTestId("app-page")).toBeInTheDocument();
  });
});
