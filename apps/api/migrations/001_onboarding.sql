-- 001_onboarding.sql — T02 onboarding: profiles, workspaces, sample sources.
-- DEV database only; applies after founder approval.
-- Note: RLS policies are deliberately deferred to T03 (three-layer isolation
-- test owns them); every T02 query filters owner_user_id explicitly.

CREATE TABLE IF NOT EXISTS profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email text,
    onboarding_state jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspaces (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name varchar(80) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- One active workspace per account (TECH_DESIGN 4.2).
CREATE UNIQUE INDEX IF NOT EXISTS workspaces_one_active_per_owner
    ON workspaces (owner_user_id)
    WHERE is_active;

CREATE INDEX IF NOT EXISTS workspaces_owner_created_idx
    ON workspaces (owner_user_id, created_at DESC);

-- Global, non-tenant sample fixtures used only during onboarding.
CREATE TABLE IF NOT EXISTS onboarding_samples (
    id text PRIMARY KEY,
    title text NOT NULL,
    summary text NOT NULL,
    pages jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
