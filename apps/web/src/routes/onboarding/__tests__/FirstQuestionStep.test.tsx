// Tests for FirstQuestionStep onboarding component
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import { FirstQuestionStep } from "../FirstQuestionStep";
import { ThemeProvider, ToastContainer } from "../../../components/ui";
import * as onboardingApi from "../../../api/onboarding";

vi.mock("../../../api/onboarding", () => ({
  completeWorkspace: vi.fn(),
  listSampleSources: vi.fn(),
  recordFirstValue: vi.fn(),
  streamFirstQuestion: vi.fn(),
}));

const mockListSampleSources = vi.mocked(onboardingApi.listSampleSources);
const mockStreamFirstQuestion = vi.mocked(onboardingApi.streamFirstQuestion);
const mockRecordFirstValue = vi.mocked(onboardingApi.recordFirstValue);

const SAMPLE = { id: "sample-onboarding-handbook", title: "Oristoria Sample Handbook", page_count: 2 };
const CITATION = { n: 1, sample_id: SAMPLE.id, page: 1, excerpt: "Welcome to Oristoria." };
const CHECKLIST = {
  workspace_named: true,
  first_value: true,
  first_value_at: "2026-11-24T00:00:00+00:00",
  completed: true,
  next_step: "done",
} as const;

const renderStep = () =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/onboarding/first-question"]}>
        <Routes>
          <Route path="/onboarding/first-question" element={<FirstQuestionStep />} />
          <Route path="/onboarding/workspace" element={<div data-testid="workspace-page" />} />
          <Route path="/app" element={<div data-testid="app-page" />} />
        </Routes>
      </MemoryRouter>
      <ToastContainer toasts={[]} onClose={vi.fn()} />
    </ThemeProvider>
  );

describe("FirstQuestionStep — sample select, question input, streaming render", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListSampleSources.mockResolvedValue([SAMPLE]);
    mockRecordFirstValue.mockResolvedValue({ onboarding: CHECKLIST });
  });

  it("lists the seeded sample source", async () => {
    renderStep();

    expect(await screen.findByText(SAMPLE.title)).toBeInTheDocument();
    expect(mockListSampleSources).toHaveBeenCalled();
  });

  it("keeps the ask button disabled until a question is typed", async () => {
    renderStep();
    await screen.findByText(SAMPLE.title);

    expect(screen.getByRole("button", { name: /ask/i })).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/your question/i), "What is this document about?");

    expect(screen.getByRole("button", { name: /ask/i })).toBeEnabled();
  });

  it("renders streamed answer tokens incrementally with citations", async () => {
    mockStreamFirstQuestion.mockImplementation(async (_params, callbacks) => {
      callbacks.onDelta("This document ");
      callbacks.onDelta("is about onboarding [1]");
      callbacks.onCitation(CITATION);
      callbacks.onCompleted([CITATION]);
    });

    renderStep();
    await screen.findByText(SAMPLE.title);
    await userEvent.type(screen.getByLabelText(/your question/i), "What is this document about?");
    await userEvent.click(screen.getByRole("button", { name: /ask/i }));

    await waitFor(() => {
      expect(screen.getByText(/is about onboarding \[1\]/)).toBeInTheDocument();
    });
    expect(mockStreamFirstQuestion).toHaveBeenCalledWith(
      { question: "What is this document about?", sampleId: SAMPLE.id },
      expect.anything()
    );
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();
  });

  it("records first value after the answer completes", async () => {
    mockStreamFirstQuestion.mockImplementation(async (_params, callbacks) => {
      callbacks.onDelta("Grounded answer [1]");
      callbacks.onCompleted([CITATION]);
    });

    renderStep();
    await screen.findByText(SAMPLE.title);
    await userEvent.type(screen.getByLabelText(/your question/i), "What is this document about?");
    await userEvent.click(screen.getByRole("button", { name: /ask/i }));

    await waitFor(() => {
      expect(mockRecordFirstValue).toHaveBeenCalled();
    });
  });

  it("shows an error when streaming fails", async () => {
    mockStreamFirstQuestion.mockRejectedValue(new Error("Stream broke"));

    renderStep();
    await screen.findByText(SAMPLE.title);
    await userEvent.type(screen.getByLabelText(/your question/i), "What is this document about?");
    await userEvent.click(screen.getByRole("button", { name: /ask/i }));

    expect(await screen.findByText(/stream broke/i)).toBeInTheDocument();
  });

  it("back button returns to the workspace step", async () => {
    renderStep();
    await screen.findByText(SAMPLE.title);

    await userEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(await screen.findByTestId("workspace-page")).toBeInTheDocument();
  });
});
