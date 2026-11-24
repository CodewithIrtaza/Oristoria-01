/** Onboarding API client (T02). */
import { API_BASE } from "./config";
import { getAccessTokenFromCookie } from "./auth";

export interface WorkspaceBrief {
  id: string;
  name: string;
}

export interface OnboardingChecklist {
  workspace_named: boolean;
  first_value: boolean;
  first_value_at: string | null;
  completed: boolean;
  next_step: "workspace" | "first-question" | "done";
}

export interface SampleSummary {
  id: string;
  title: string;
  page_count: number;
}

export interface Citation {
  n: number;
  sample_id: string;
  page: number;
  excerpt: string;
}

export interface FirstValueResponse {
  onboarding: OnboardingChecklist;
}

export interface StreamCallbacks {
  onDelta(delta: string): void;
  onCitation(citation: Citation): void;
  onCompleted(citations: Citation[]): void;
}

async function readError(response: Response, fallback: string): Promise<never> {
  const body = await response.json().catch(() => ({ detail: fallback }));
  throw new Error(body.detail || fallback);
}

/** JSON headers with the session token when one is present. */
function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAccessTokenFromCookie();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Create or rename the current user's workspace. */
export async function completeWorkspace(name: string): Promise<WorkspaceBrief> {
  const response = await fetch(`${API_BASE}/v1/workspace`, {
    method: "PATCH",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    await readError(response, "Could not save your workspace");
  }
  return response.json();
}

/** List the seeded onboarding sample sources. */
export async function listSampleSources(): Promise<SampleSummary[]> {
  const response = await fetch(`${API_BASE}/v1/onboarding/samples`, {
    headers: authHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    await readError(response, "Could not load sample sources");
  }
  const body = await response.json();
  return body.samples;
}

/** Record the first-value activation event (idempotent). */
export async function recordFirstValue(): Promise<FirstValueResponse> {
  const response = await fetch(`${API_BASE}/v1/onboarding/first-value`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    await readError(response, "Could not record first value");
  }
  return response.json();
}

function parseEventBlock(block: string): { name: string; data: unknown } | null {
  let name = "";
  let data = "";
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!name) return null;
  try {
    return { name, data: data ? JSON.parse(data) : {} };
  } catch {
    return null;
  }
}

/** Stream the sample answer via SSE and dispatch each event. */
export async function streamFirstQuestion(
  params: { question: string; sampleId: string },
  callbacks: StreamCallbacks
): Promise<void> {
  const response = await fetch(`${API_BASE}/v1/onboarding/first-question`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ question: params.question, sample_id: params.sampleId }),
  });

  if (!response.ok) {
    await readError(response, "Could not start the answer stream");
  }
  const stream = response.body;
  if (!stream) {
    throw new Error("Streaming is not supported by this browser");
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let separator = buffer.indexOf("\n\n");
    while (separator !== -1) {
      const block = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      const event = parseEventBlock(block);
      if (event) {
        if (event.name === "answer.delta") {
          callbacks.onDelta((event.data as { delta: string }).delta);
        } else if (event.name === "citation") {
          callbacks.onCitation(event.data as Citation);
        } else if (event.name === "run.completed") {
          callbacks.onCompleted((event.data as { citations: Citation[] }).citations);
        }
      }
      separator = buffer.indexOf("\n\n");
    }
  }
}
