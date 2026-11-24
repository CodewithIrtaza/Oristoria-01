/** Auth API client. */
import { API_BASE } from "./config";

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  message: string;
}

export interface MeResponse {
  user_id: string;
  email: string;
  role: string;
}

export interface VerifyMagicLinkResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
  isNewUser: boolean;
}

/** Request magic link email. */
export async function requestMagicLink(
  email: string
): Promise<MagicLinkResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/magic-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to send magic link" }));
    throw new Error(error.detail || "Failed to send magic link");
  }

  return response.json();
}

/** Verify magic link token and return session. */
export async function verifyMagicLink(
  token: string,
  type: string = "magiclink"
): Promise<VerifyMagicLinkResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, type }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Invalid or expired link" }));
    throw new Error(error.detail || "Invalid or expired link");
  }

  return response.json();
}

/** Logout - revoke session. */
export async function logout(): Promise<MagicLinkResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Logout failed" }));
    throw new Error(error.detail || "Logout failed");
  }

  return response.json();
}

/** Get current user profile. */
export async function getMe(accessToken: string): Promise<MeResponse> {
  const response = await fetch(`${API_BASE}/v1/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const error = await response.json().catch(() => ({ detail: "Failed to get profile" }));
    throw new Error(error.detail || "Failed to get profile");
  }

  return response.json();
}

/** Set session cookie (called after magic link verification). */
export async function setSessionCookie(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  // Cookies are set by the API via Set-Cookie headers
  // This is a placeholder for any client-side cookie management
  document.cookie = `sb-access-token=${accessToken}; path=/; Secure; SameSite=Lax`;
  document.cookie = `sb-refresh-token=${refreshToken}; path=/; Secure; SameSite=Lax`;
}

/** Clear session cookies. */
export async function clearSessionCookies(): Promise<void> {
  document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax";
  document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax";
}

/** Get access token from cookie. */
export function getAccessTokenFromCookie(): string | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "sb-access-token") {
      return value;
    }
  }
  return null;
}