// Tests for Callback component
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Callback } from "../Callback";
import { ThemeProvider, ToastContainer } from "../../../components/ui";
import { MemoryRouter, Routes, Route } from "react-router";
import * as authApi from "../../../api/auth";

vi.mock("../../../api/auth", () => ({
  verifyMagicLink: vi.fn(),
  setSessionCookie: vi.fn(),
}));

const mockVerifyMagicLink = vi.mocked(authApi.verifyMagicLink);
const mockSetSessionCookie = vi.mocked(authApi.setSessionCookie);

const renderWithRouter = (component: React.ReactNode, initialEntries = ["/auth/callback"]) => {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/auth/callback" element={component} />
          <Route path="/onboarding/workspace" element={<div data-testid="onboarding-page">Onboarding</div>} />
          <Route path="/app" element={<div data-testid="app-page">App</div>} />
        </Routes>
      </MemoryRouter>
      <ToastContainer toasts={[]} onClose={vi.fn()} />
    </ThemeProvider>
  );
};

describe("Callback — valid token → redirect, invalid → error toast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to onboarding for new user with valid token", async () => {
    mockVerifyMagicLink.mockResolvedValue({
      user: { id: "user-123", email: "test@example.com" },
      session: { access_token: "token-123", refresh_token: "refresh-123" },
      isNewUser: true,
    });
    mockSetSessionCookie.mockResolvedValue(undefined);

    renderWithRouter(<Callback />, ["/auth/callback?token=valid-token&type=magiclink"]);

    await waitFor(() => {
      expect(screen.getByTestId("onboarding-page")).toBeInTheDocument();
    });
  });

  it("redirects to app for returning user with valid token", async () => {
    mockVerifyMagicLink.mockResolvedValue({
      user: { id: "user-123", email: "test@example.com" },
      session: { access_token: "token-123", refresh_token: "refresh-123" },
      isNewUser: false,
    });
    mockSetSessionCookie.mockResolvedValue(undefined);

    renderWithRouter(<Callback />, ["/auth/callback?token=valid-token&type=magiclink"]);

    await waitFor(() => {
      expect(screen.getByTestId("app-page")).toBeInTheDocument();
    });
  });

  it("shows error toast for invalid token", async () => {
    mockVerifyMagicLink.mockRejectedValue(new Error("Invalid token"));

    renderWithRouter(<Callback />, ["/auth/callback?token=invalid-token&type=magiclink"]);

    await waitFor(() => {
      expect(screen.getByText(/invalid token/i)).toBeInTheDocument();
    });
  });

  it("shows error toast for missing token", async () => {
    renderWithRouter(<Callback />, ["/auth/callback"]);

    await waitFor(() => {
      expect(screen.getByText(/missing token/i)).toBeInTheDocument();
    });
  });

  it("shows loading state while verifying", async () => {
    let resolveVerify: (value: any) => void;
    mockVerifyMagicLink.mockImplementation(() => new Promise((resolve) => {
      resolveVerify = resolve;
    }));

    renderWithRouter(<Callback />, ["/auth/callback?token=valid-token&type=magiclink"]);

    expect(screen.getByText(/verifying/i)).toBeInTheDocument();

    resolveVerify!({
      user: { id: "user-123" },
      session: { access_token: "token-123" },
      isNewUser: true,
    });

    await waitFor(() => {
      expect(screen.getByTestId("onboarding-page")).toBeInTheDocument();
    });
  });
});