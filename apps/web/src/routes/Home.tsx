import { useEffect, useState } from "react";

type HealthStatus = "checking" | "ready" | "offline";

const statusCopy: Record<HealthStatus, string> = {
  checking: "Checking the API connection",
  ready: "API connection is ready",
  offline: "API connection is unavailable",
};

export default function Home() {
  const [status, setStatus] = useState<HealthStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    async function checkHealth() {
      try {
        const response = await fetch("/healthz", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Health check failed");
        }

        const payload = (await response.json()) as { status?: string };
        setStatus(payload.status === "ok" ? "ready" : "offline");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setStatus("offline");
        }
      }
    }

    void checkHealth();
    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <section className="intro" aria-labelledby="page-title">
        <h1 id="page-title">Oristoria</h1>
        <p className="lede">Your documents, in conversation.</p>
      </section>

      <aside className="status" aria-live="polite" aria-label="API connection status">
        <span className={`status-dot status-dot--${status}`} aria-hidden="true" />
        <p>{statusCopy[status]}</p>
      </aside>
    </main>
  );
}
