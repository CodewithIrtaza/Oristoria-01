/** Magic link request page: email input + send button. */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon } from "../../components/ui";
import { requestMagicLink } from "../../api/auth";
import { Icons } from "../../components/ui/Icon";

export function MagicLinkRequest() {
  const navigate = useNavigate();
  // Guard for testing outside router
  if (!navigate) {
    return null;
  }
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await requestMagicLink(email);
      // Success - show toast via event or context
      // For now, navigate to a success page or show inline message
      navigate("/auth/sent", { state: { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null); // Clear error on typing
  };

  return (
    <main className="auth-page">
      <Card padding="lg" className="auth-card">
        <CardHeader>
          <div className="auth-icon" aria-hidden="true">
            <Icon name={Icons.Mail} size="2xl" color="accent" />
          </div>
          <CardTitle>Sign in to Oristoria</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a magic link to sign in.
            No password needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              error={error ?? undefined}
              autoComplete="email"
              autoFocus
              fullWidth
            />
            <div className="auth-form-actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={<Icon name={Icons.Mail} size="sm" />}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </div>
          </form>
          <p className="auth-note">
            By continuing, you agree to our{" "}
            <a href="/terms">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}