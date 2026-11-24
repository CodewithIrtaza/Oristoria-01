/** Onboarding step 1: name the workspace, then continue to the first question. */
import { useState } from "react";
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
import { completeWorkspace } from "../../api/onboarding";

const NAME_MAX = 80;

function validateName(value: string): string | null {
  if (!value.trim()) return "Workspace name is required";
  if (value.trim().length > NAME_MAX) return `Keep the workspace name under ${NAME_MAX} characters`;
  return null;
}

export function WorkspaceStep() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await completeWorkspace(name.trim());
      navigate("/onboarding/first-question");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Card padding="lg" className="auth-card">
        <CardHeader>
          <div className="auth-icon" aria-hidden="true">
            <Icon name={Icons.FolderOpen} size="2xl" color="accent" />
          </div>
          <CardTitle>Name your workspace</CardTitle>
          <CardDescription>
            Your workspace keeps sources, chats, and artifacts together. You can rename it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Workspace name"
              placeholder="e.g. Thesis Research"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
              error={error ?? undefined}
              autoFocus
              fullWidth
            />
            <div className="auth-form-actions">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                {loading ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app")}
          >
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
