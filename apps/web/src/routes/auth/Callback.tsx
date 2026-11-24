/** Magic link callback page: verifies token, sets session, redirects. */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon } from "../../components/ui";
import { Icons } from "../../components/ui/Icon";
import { verifyMagicLink, setSessionCookie } from "../../api/auth";

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type") || "magiclink";

      if (!token) {
        setError("Missing token in URL");
        setLoading(false);
        return;
      }

      try {
        const result = await verifyMagicLink(token, type);
        await setSessionCookie(result.session.access_token, result.session.refresh_token);

        // Redirect based on whether user is new
        if (result.isNewUser) {
          navigate("/onboarding/workspace");
        } else {
          navigate("/app");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid or expired link");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <main className="auth-page">
        <Card padding="lg" className="auth-card">
          <CardHeader>
            <div className="auth-icon loading" aria-hidden="true">
              <Icon name={Icons.Loader2} size="2xl" className="spin" color="accent" />
            </div>
            <CardTitle>Verifying your link</CardTitle>
            <CardDescription>Please wait while we sign you in.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="auth-page">
        <Card padding="lg" className="auth-card">
          <CardHeader>
            <div className="auth-icon error" aria-hidden="true">
              <Icon name={Icons.AlertCircle} size="2xl" color="error" />
            </div>
            <CardTitle>Invalid or expired link</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="primary"
              onClick={() => navigate("/auth/link")}
              icon={<Icon name={Icons.ArrowLeft} size="sm" />}
            >
              Request a new link
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Should not reach here - either loading, error, or redirected
  return null;
}