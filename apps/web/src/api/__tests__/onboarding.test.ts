// Tests for the onboarding API client: auth header attachment + SSE parsing
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  completeWorkspace,
  listSampleSources,
  recordFirstValue,
  streamFirstQuestion,
} from "../onboarding";

const SSE_BODY = [
  'event: answer.delta\ndata: {"delta":"Grounded "}',
  'event: answer.delta\ndata: {"delta":"answer [1]"}',
  'event: citation\ndata: {"n":1,"sample_id":"s1","page":2,"excerpt":"page two text"}',
  'event: run.completed\ndata: {"citations":[{"n":1,"sample_id":"s1","page":2,"excerpt":"page two text"}]}',
  "",
]
    .join("\n\n")
    .concat("\n\n");

describe("onboarding API client", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("sends the Bearer token from the session cookie", async () => {
    document.cookie = "sb-access-token=tok-123; path=/";
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: "w1", name: "Alpha" }), { status: 200 })
    );

    await completeWorkspace("Alpha");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/workspace");
    expect(init.headers.Authorization).toBe("Bearer tok-123");
    expect(init.body).toBe(JSON.stringify({ name: "Alpha" }));
  });

  it("omits the Authorization header when no session cookie exists", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: "w1", name: "Alpha" }), { status: 200 })
    );

    await completeWorkspace("Alpha");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("lists samples and forwards the session token", async () => {
    document.cookie = "sb-access-token=tok-123; path=/";
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ samples: [{ id: "s1", title: "T", page_count: 1 }] }), {
        status: 200,
      })
    );

    const samples = await listSampleSources();

    expect(samples).toHaveLength(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer tok-123");
  });

  it("parses the SSE stream and dispatches deltas, citations, completion", async () => {
    fetchMock.mockResolvedValue(new Response(SSE_BODY, { status: 200 }));

    const deltas: string[] = [];
    const citations: unknown[] = [];
    const completed: unknown[] = [];

    await streamFirstQuestion(
      { question: "What is this?", sampleId: "s1" },
      {
        onDelta: (delta) => deltas.push(delta),
        onCitation: (citation) => citations.push(citation),
        onCompleted: (list) => completed.push(...list),
      }
    );

    expect(deltas.join("")).toBe("Grounded answer [1]");
    expect(citations).toHaveLength(1);
    expect(completed).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].body).toBe(
      JSON.stringify({ question: "What is this?", sample_id: "s1" })
    );
  });

  it("raises the server detail on a failed request", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: "Answer a sample question first" }), { status: 409 })
    );

    await expect(recordFirstValue()).rejects.toThrow("Answer a sample question first");
  });
});
