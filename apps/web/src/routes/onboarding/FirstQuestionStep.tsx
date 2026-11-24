/** Onboarding step 2: pick the sample source, ask, watch a cited answer stream. */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Input,
} from "../../components/ui";
import { Icons } from "../../components/ui/Icon";
import {
  Citation,
  listSampleSources,
  recordFirstValue,
  streamFirstQuestion,
} from "../../api/onboarding";

function mergeCitations(existing: Citation[], incoming: Citation[]): Citation[] {
  const byNumber = new Map(existing.map((citation) => [citation.n, citation]));
  for (const citation of incoming) byNumber.set(citation.n, citation);
  return [...byNumber.values()].sort((a, b) => a.n - b.n);
}

export function FirstQuestionStep() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState<{ id: string; title: string; page_count: number }[]>([]);
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listSampleSources()
      .then((list) => {
        if (cancelled) return;
        setSamples(list);
        if (list.length > 0) setSampleId(list[0].id);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load sample sources");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const canAsk = Boolean(sampleId) && question.trim().length > 0 && !streaming && !done;

  const handleAsk = async () => {
    if (!sampleId || !question.trim()) return;

    setStreaming(true);
    setError(null);
    setAnswer("");
    setCitations([]);
    try {
      await streamFirstQuestion(
        { question: question.trim(), sampleId },
        {
          onDelta: (delta) => setAnswer((previous) => previous + delta),
          onCitation: (citation) => setCitations((previous) => mergeCitations(previous, [citation])),
          onCompleted: (completed) =>
            setCitations((previous) => mergeCitations(previous, completed)),
        }
      );
      setDone(true);
      await recordFirstValue();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not get an answer");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <main className="auth-page">
      <Card padding="lg" className="auth-card">
        <CardHeader>
          <div className="auth-icon" aria-hidden="true">
            <Icon name={Icons.BookOpen} size="2xl" color="accent" />
          </div>
          <CardTitle>Ask your first question</CardTitle>
          <CardDescription>
            Try a question against the sample source. Answers cite the exact page they came from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadError && <p role="alert">{loadError}</p>}

          <fieldset className="auth-form">
            <legend>Sample source</legend>
            {samples.map((sample) => (
              <label key={sample.id}>
                <input
                  type="radio"
                  name="sample-source"
                  value={sample.id}
                  checked={sampleId === sample.id}
                  onChange={() => setSampleId(sample.id)}
                />
                <span>{sample.title}</span>
                <span aria-hidden="true"> · {sample.page_count} pages</span>
              </label>
            ))}
          </fieldset>

          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleAsk();
            }}
          >
            <Input
              label="Your question"
              placeholder="What is this document about?"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                if (error) setError(null);
              }}
              error={error ?? undefined}
              fullWidth
            />
            <div className="auth-form-actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={streaming}
                disabled={!canAsk}
              >
                {streaming ? "Asking..." : "Ask sample"}
              </Button>
            </div>
          </form>

          {answer && (
            <section aria-live="polite">
              <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
              {citations.length > 0 && (
                <ul>
                  {citations.map((citation) => (
                    <li key={citation.n}>
                      Citation {citation.n} · page {citation.page} — {citation.excerpt}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <div className="auth-form-actions">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/onboarding/workspace")}>
              Back
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/app")}>
              Skip for now
            </Button>
            {done && (
              <Button type="button" variant="primary" size="sm" onClick={() => navigate("/app")}>
                Go to workspace
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
