# Oristoria — Stitch Generation Prompts

**Design System:** See `docs/DESIGN.md` for all tokens (colors, typography, spacing, components).
**Style Header (prepend to EVERY prompt):**

```
=== ORISTORIA DESIGN SYSTEM ===
Theme: Light default, dark mode supported
Accent: Terracotta #b85c3d (primary actions, links, focus rings)
Fonts: Space Grotesk (headings) + Inter (body) + JetBrains Mono (mono)
Shape: rounded-lg (8px) cards, rounded-md (6px) buttons/inputs, rounded-full pills
Shadows: Subtle — 0 1px 3px rgba(26,26,46,0.08) cards, 0 4px 12px rgba(26,26,46,0.12) modals
Density: Comfortable — 16px base unit, 1.6 line height
Icons: Lucide 2px stroke, rounded caps
Motion: Subtle, functional only (150-200ms), respects prefers-reduced-motion
Accessibility: 4.5:1 contrast, visible 2px focus rings, 44px tap targets
===
```

---

## Screen 1: Marketing / Landing Page
**Route:** `/` | **PRD:** B6 entry point

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Minimal — logo left (wordmark "Oristoria" in Space Grotesk 700, terracotta), "Sign in" ghost button right, "Get Started" primary button right. 64px height, paper bg, subtle bottom border.

2. **Hero Section:** Centered, max-w-3xl, 120px vertical padding.
   - Headline (display-lg): "Turn your documents into cited answers and finished deliverables."
   - Subtext (body-lg, ink-muted): "Upload PDFs, notes, research. Get source-grounded answers with citations. Build study guides, briefs, outlines — all traceable to your material."
   - Primary CTA: "Start free — no card required" (primary button lg, terracotta)
   - Secondary: "See how it works" (ghost button lg, links to #demo)
   - Trust line (body-sm, ink-subtle): "Private workspace. Your data, your control. Export or delete anytime."

3. **Demo Strip (optional):** Three side-by-side cards showing the workflow:
   - Card 1: "Upload" — upload icon, "Drag PDFs, docs, notes"
   - Card 2: "Ask" — chat icon, "Get cited answers from your sources"
   - Card 3: "Deliver" — file-text icon, "Generate study guides, briefs, drafts"
   Cards: elevated, hover lift, 24px padding.

4. **Feature Grid (3 columns):** 
   - "Source-grounded citations" — every claim links to your passage
   - "Multi-step workflows" — research → evidence → synthesis → deliverable
   - "Private by default" — one account, one workspace, full export/delete
   - "Usage transparency" — visible limits, manual upgrade, no surprise bills
   - "Streaming answers" — see progress, cancel anytime
   - "Durable history" — reopen runs, inspect steps, reuse artifacts

5. **Footer:** Minimal — product links, legal, social. paper bg, border-top subtle.

REAL CONTENT: Use exact headlines above. No lorem ipsum.
STATES: Show primary button hover, ghost button hover, card hover.
RESPONSIVE: Stack hero text center on mobile, grid → single column < 768px.
```

---

## Screen 2: Auth — Magic Link Request
**Route:** `/auth/link` | **PRD:** B1

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Logo only (centered), 64px height.

2. **Centered Card (max-w-md, elevated, 32px padding):**
   - Heading (h1): "Sign in to Oristoria"
   - Subtext (body, ink-muted): "Enter your email. We'll send a magic link — no password needed."
   - Form:
     - Label (label): "Email address"
     - Input (md, type=email, placeholder="you@university.edu", autoComplete="email", required)
     - Helper text (body-xs, ink-subtle): "We'll only email you for sign-in and important updates."
   - Primary Button (full-width, md): "Send magic link" — loading state shows spinner, disabled
   - Divider: "or" with horizontal rules (border-subtle)
   - Ghost Button (full-width, md): "Continue with Google" (future, disabled for beta, show as muted)
   - Error Toast (if submitted invalid): "Enter a valid email address" — error-crimson left border

3. **Footer (body-xs, ink-subtle, centered):** "By continuing, you agree to our Terms of Service and Privacy Policy."

REAL CONTENT: Exact copy above.
STATES: Default, hover, focus (2px terracotta ring), loading (spinner + disabled), error (crimson border + toast), success (toast "Check your inbox — link expires in 1 hour").
ACCESSIBILITY: Label linked to input, autocomplete, focus ring visible, 44px button height.
```

---

## Screen 3: Auth — Magic Link Success / Callback
**Route:** `/auth/callback` | **PRD:** B1

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Logo only (centered).

2. **Centered Card (max-w-md, elevated, 32px padding):**
   - Success Illustration: CheckCircle2 icon (xl, 48px, success-teal)
   - Heading (h1): "You're signed in"
   - Subtext (body, ink-muted): "Redirecting to your workspace…"
   - Progress: Subtle indeterminate bar (terracotta) or spinner
   - Fallback (body-sm, ink-muted): "Not redirecting? <a href="/app" class="underline">Click here</a>"

3. **Error State (if token invalid/expired):**
   - Illustration: XCircle icon (xl, error-crimson)
   - Heading: "Link expired or invalid"
   - Text: "Magic links expire after 1 hour. Please request a new one."
   - Primary Button: "Request new link" → redirects to /auth/link

REAL CONTENT: Exact copy.
STATES: Loading (spinner), success (check + redirect), error (crimson + action button).
MOTION: Auto-redirect after 1.5s success, no animation on error.
```

---

## Screen 4: Onboarding — Welcome + Workspace Setup
**Route:** `/onboarding/workspace` | **PRD:** B6

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Logo left, progress indicator right (Step 1 of 2: "Workspace" → "First Question").

2. **Main Content (max-w-2xl, centered, 48px vertical padding):**
   - Heading (display-md): "Welcome to your workspace"
   - Subtext (body-lg, ink-muted): "Give your workspace a name. This helps you identify it if you ever manage multiple projects."
   - Card (elevated, 24px padding, paper-elevated bg):
     - Label (label): "Workspace name"
     - Input (md, placeholder="My Research", value="My Research", autoFocus)
     - Helper (body-xs): "You can change this later in Settings."
   - Primary Button (full-width, md): "Continue" — disabled until input has value
   - Skip Link (ghost, body-sm): "Skip for now" → goes to /onboarding/first-question

3. **Sidebar (collapsed on mobile):** Empty state illustration + "Your private workspace" caption.

REAL CONTENT: Exact copy. Default workspace name "My Research".
STATES: Input focus, button disabled/enabled, skip hover.
ACCESSIBILITY: Auto-focus input, label linked, enter submits.
```

---

## Screen 5: Onboarding — Sample Upload + First Question
**Route:** `/onboarding/first-question` | **PRD:** B6, A1, A2

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Logo left, progress (Step 2 of 2: "Workspace" ✓ → "First Question"), "Skip" ghost button right.

2. **Two-Column Layout (desktop) / Stacked (mobile):**
   **LEFT — Upload Sample:**
   - Heading (h2): "Try with a sample document"
   - Text (body, ink-muted): "We've included a sample research paper on renewable energy policy. Upload it to see how Oristoria works."
   - Drop Zone (dashed border, 200px min-height, rounded-lg, paper-elevated):
     - Upload icon (lg, ink-muted)
     - Text: "Drag & drop PDF or click to browse"
     - Subtext: "Sample: renewable-energy-policy.pdf (12 pages, 2.3 MB)"
     - Primary Button (md): "Use sample document" — loads sample, shows processing
   - Processing State: Spinner + "Extracting text, chunking, embedding…" (body-sm, ink-muted)
   - Ready State: Success badge (teal) + "Ready to ask questions" + Primary Button "Ask your first question" → focuses right panel

   **RIGHT — Ask a Question:**
   - Heading (h2): "Ask your first question"
   - Text (body, ink-muted): "Try: 'What are the key policy recommendations?' or 'Summarize the methodology.'"
   - Chat Input Area (paper-elevated, rounded-lg, 16px padding):
     - Textarea (md, min-h-[100px], placeholder="What does the paper say about…", autoFocus)
     - Footer: Token estimate (mono-sm, ink-subtle: "~45 tokens") + Primary Button (md): "Send"
   - Streaming Answer Placeholder (when sent):
     - User bubble (right, accent-terracotta-subtle bg, rounded-2xl)
     - Assistant bubble (left, paper-elevated, rounded-2xl, streaming tokens)
     - Citation inline: [1] link (terracotta, underline on hover) → opens citation drawer
     - "Workspace does not establish this" state (if no evidence)

3. **Completion:** When first answer renders, show toast "First question answered! You're ready to explore." + "Continue to workspace" button.

REAL CONTENT: Sample paper title "Renewable Energy Policy Review 2024". Real questions above.
STATES: Drop zone hover/drag-active, processing, ready; textarea focus, sending (disabled + spinner), streaming, empty/error answer.
RESPONSIVE: Stack left→right on mobile. Chat input fixed bottom on mobile.
```

---

## Screen 6: Dashboard / Workspace Home
**Route:** `/app` | **PRD:** A3 overview

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar (fixed, 64px, paper-elevated, border-b subtle):**
   - Left: Hamburger (mobile) / Sidebar toggle (desktop), Logo "Oristoria", Workspace name "My Research" (label, ink-muted), ChevronDown (switch workspace — future)
   - Center: Search (md input, placeholder="Search sources, chats, artifacts…", Search icon left, 320px max-w)
   - Right: Usage indicator (badge: "Free • 3/10 answers this month" — amber), Theme toggle (sun/moon icon, ghost), Notification bell (ghost, badge count), Avatar (initials, ghost menu: Profile, Settings, Sign out)

2. **Sidebar (fixed left, 256px collapsed / 320px expanded, paper-elevated, border-r subtle):**
   - Nav Items (icon + label, 12px padding, rounded-md, hover paper-hover, active accent-terracotta-subtle + 2px left border):
     - FolderOpen "Sources" (badge: count)
     - MessageSquare "Chat" (badge: unread)
     - FileText "Artifacts" (badge: count)
     - GitBranch "Runs" (badge: running)
     - Settings "Settings"
   - Bottom: Upgrade badge (if free, amber bg, "Upgrade to Pro" — links to /app/upgrade)

3. **Main Content (flex-1, padding 24px desktop / 16px mobile):**
   - **Welcome Section (first visit only):**
     - Heading (h1): "Welcome back, [Name]"
     - Action Row: Primary "New chat" + Secondary "Upload source" + Ghost "Run research workflow"
   - **Quick Stats Row (4 cards, grid 2/4):**
     - Card: Sources (FolderOpen icon, count, "3 uploaded")
     - Card: Conversations (MessageSquare icon, count, "2 active")
     - Card: Artifacts (FileText icon, count, "1 deliverable")
     - Card: Usage (TrendingUp icon, "3/10 answers", progress bar 30% amber)
   - **Recent Activity (card list):**
     - Section header: "Recent" + "View all" ghost link
     - Items: "Chat: Renewable energy policy" (2h ago), "Source: renewable-energy-policy.pdf" (Ready, 3h ago), "Artifact: Policy Brief v1" (Completed, 1d ago)
     - Each: icon, title, meta, timestamp, hover lift

REAL CONTENT: Real counts, real timestamps, real names from sample flow.
STATES: Sidebar collapsed/expanded, search focus, usage badge colors (green <50%, amber 50-80%, crimson >80%), empty states for new users.
RESPONSIVE: Sidebar → drawer on mobile. Stats grid 1-col mobile, 2-col tablet, 4-col desktop.
```

---

## Screen 7: Sources — List + Upload
**Route:** `/app/sources` | **PRD:** A1

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same as Dashboard.

2. **Sidebar:** Same, "Sources" active.

3. **Main Content:**
   - **Header Row (flex, justify-between, mb-6):**
     - Left: Heading (h1): "Sources" + Subtext (body, ink-muted): "3 documents • 47 pages • 2.1 MB"
     - Right: Primary Button (md, Upload icon): "Upload document"

   - **Upload Modal (triggered by button):**
     - Modal (max-w-md, elevated):
       - Heading (h3): "Upload document"
       - Drop Zone (dashed, 160px h, rounded-lg): "Drag PDF or DOCX here, or click to browse" + "Max 50 MB • PDF, DOCX"
       - File List (if multiple): Rows with name, size, remove icon
       - Progress: Per-file status (processing → ready/failed)
       - Footer: Secondary "Cancel" + Primary "Upload" (disabled until files added)
       - Error Toast: "File type not supported" / "File too large"

   - **Sources Table (desktop) / Card Grid (mobile):**
     - Columns: Name (truncate), Type (badge), Status (badge), Pages, Size, Uploaded, Actions
     - Rows (real data):
       1. "renewable-energy-policy.pdf" | PDF | Ready (teal) | 12 | 2.3 MB | 2h ago | Menu (Open, Rename, Delete)
       2. "lecture-notes-week-3.pdf" | PDF | Processing (slate, spinner) | — | 1.8 MB | 5m ago | Menu
       3. "project-proposal.docx" | DOCX | Failed (crimson) | — | 0.9 MB | 1d ago | Menu (Retry, Delete)
     - Hover: Row highlight, actions visible
     - Empty State: Illustration (FolderOpen xl), "No sources yet", "Upload your first document" primary button

   - **Source Card (mobile):** Elevated card, thumbnail (PDF icon), title, status badge, pages/size/date, menu.

REAL CONTENT: Real filenames, statuses, sizes, dates from sample flow.
STATES: Table loading skeleton, empty, hover, row selected (multi-select future), modal open/close, upload progress, error/failed rows.
ACCESSIBILITY: Table headers, sortable columns (future), keyboard navigation, focus rings.
```

---

## Screen 8: Source Detail
**Route:** `/app/sources/:id` | **PRD:** A1, A9

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + back button (chevron-left ghost) left of logo.

2. **Sidebar:** Same, "Sources" active.

3. **Main Content (max-w-4xl):**
   - **Header Card (elevated, 24px padding):**
     - Row 1: File icon (lg, by type), Title (h2, truncate), Status badge (right)
     - Row 2 (flex, gap-6, text-sm, ink-muted): "12 pages" • "2.3 MB" • "PDF" • "Uploaded 2 hours ago" • "Processed 1h 58m ago"
     - Actions (flex, gap-2, mt-4): Primary "Open in viewer" (ExternalLink icon) + Secondary "Rename" + Ghost "Delete" (crimson text)

   - **Tabs (underline style, accent-terracotta indicator):**
     - **Overview (default):** 
       - "Extracted text preview" (card, mono-sm, max-h-96, overflow-auto, paper bg)
       - "Chunks & Embeddings" (table: Chunk #, Pages, Section, Tokens, Vector ID)
       - "Processing Log" (timeline: Uploaded → Queued → Processing → Embedding → Ready)
     - **Citations:** List of citations from this source across all conversations (table: Conversation, Question excerpt, Answer excerpt, Verdict)
     - **Activity:** Run history involving this source (table: Run, Workflow, Step, Status, Time)

   - **Delete Confirmation Modal:** "Delete 'renewable-energy-policy.pdf'?" + "This removes the file, all extracted text, chunks, embeddings, and citations. Cannot be undone." + Secondary "Cancel" + Destructive Filled "Delete"

REAL CONTENT: Real filename, metadata, chunk count (47), processing timestamps.
STATES: Tab active/hover, table loading, empty tabs, delete modal, processing status live update.
RESPONSIVE: Tabs scroll horizontally on mobile. Header stacks.
```

---

## Screen 9: Chat / Conversation View
**Route:** `/app/chat/:conversationId?` | **PRD:** A2, A4, A5, A6, A10, A11, C1

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + back button (if in drawer on mobile) + conversation title (editable on click, h3) + "New chat" primary button right.

2. **Sidebar:** Same, "Chat" active. Conversation list in sidebar (collapsible section): "Renewable energy policy" (active), "New conversation" + "Start new chat" ghost.

3. **Main Content (flex-col, h-full):**
   - **Message Area (flex-1, overflow-y-auto, padding 24px, max-w-3xl centered):**
     - **Empty State (no conversation):**
       - Illustration (MessageSquare xl, ink-subtle)
       - Heading (h2): "Start a conversation"
       - Text (body, ink-muted): "Select a conversation from the sidebar or click 'New chat' to begin."
       - Sample Prompts (card grid, 2-col):
         - "Summarize the key findings"
         - "What methodology was used?"
         - "Compare the policy recommendations"
         - "Create a study guide from this"
       - Each: Ghost button, click → fills input + sends

     - **Conversation View (messages):**
       - **User Message (right-aligned, max-w-[70%]):**
         - Bubble: accent-terracotta-subtle bg, rounded-2xl (br-tr: 4px), padding 12px 16px
         - Text (body): "What are the key policy recommendations?"
         - Timestamp (mono-xs, ink-subtle, mt-1, right): "2:14 PM"
       - **Assistant Message (left-aligned, max-w-[85%]):**
         - Bubble: paper-elevated bg, rounded-2xl (br-tl: 4px), border subtle, padding 16px
         - Streaming: Tokens appear incrementally (no animation)
         - Citations Inline: [1] [2] (terracotta, underline hover, cursor pointer) → click opens citation drawer
         - "Workspace does not establish this" (italic, ink-muted) if no evidence
         - Actions Row (mt-2, flex, gap-2): Copy (ghost xs) + "Audit citations" (ghost xs, opens citation audit)
         - Timestamp (mono-xs, ink-subtle, mt-1): "2:14 PM"
       - **Loading State:** Skeleton bubbles (pulse) while streaming
       - **Error State:** Crimson left border bubble: "Something went wrong. Please try again." + "Retry" ghost button

   - **Input Area (sticky bottom, paper-elevated, border-t subtle, padding 16px):**
     - Textarea (md, min-h-[56px], max-h-[200px], placeholder="Ask a question…", auto-grow)
     - Footer (flex, justify-between, mt-2):
       - Left: Token estimate (mono-xs, ink-subtle: "~120 tokens") + Paperclip icon (ghost, future: attach source)
       - Right: Primary Button (md, Send icon): "Send" — disabled if empty, loading spinner when streaming
       - Shortcut hint (mono-xs, ink-subtle): "Enter to send • Shift+Enter for new line"

   - **Citation Drawer (slide-over from right, 384px):**
     - Header: "Citation [1]" + Close X
     - Source: "renewable-energy-policy.pdf" (link to source detail)
     - Location: "Pages 3–4 • Section 2.1: Policy Framework"
     - Excerpt: Full passage (paper bg, mono-sm, padding 16px, rounded-md, max-h-60 overflow-auto)
     - Verdict Badge: "Verified" (teal) / "Needs review" (amber) / "Unsupported" (crimson)
     - Audit Buttons: "Mark verified" / "Mark unsupported" (only if not audited)
     - Navigation: Prev/Next citation arrows

REAL CONTENT: Real Q&A from sample. Real citations with page numbers. Real "workspace does not establish" for unsupported claims.
STATES: Empty, streaming, complete, error, citation drawer open/close, audit states.
RESPONSIVE: Sidebar → drawer. Input fixed bottom mobile. Message bubbles full-width mobile.
ACCESSIBILITY: ARIA live region for streaming, citation links announced, focus trap in drawer, ESC closes drawer.
```

---

## Screen 10: Citation Drawer (Detail)
**Route:** Drawer from Chat | **PRD:** C1

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

DRAWER STRUCTURE (384px, full height, paper-elevated, border-l subtle):
- Header (sticky, padding 16px, border-b subtle):
  - Title (h3): "Citation [1]"
  - Subtitle (body-sm, ink-muted): "From: renewable-energy-policy.pdf"
  - Close X (ghost, top-right)

- Body (padding 16px, overflow-y-auto):
  - **Source Info Card (elevated, 16px padding):**
    - FileText icon + "renewable-energy-policy.pdf" (link to source detail)
    - "Pages 3–4" • "Section 2.1: Policy Framework" (label + value)
    - "Chunk 12 of 47" • "384 tokens" (mono-sm, ink-muted)

  - **Excerpt (paper bg, rounded-md, padding 16px, mono-sm, line-height 1.6, max-h-72 overflow-auto):**
    "The policy framework establishes three pillars: (1) renewable portfolio standards requiring 40% clean energy by 2030, (2) grid modernization grants totaling $12B over five years, and (3) workforce transition programs for displaced fossil fuel workers. Implementation timelines vary by state, with federal oversight through the Department of Energy."

  - **Verdict Section (mt-6):**
    - Label (label): "Citation audit"
    - Radio Group (vertical, gap-3):
      - Radio + "Supported — the claim is accurately grounded in this passage" (teal accent)
      - Radio + "Unsupported — the claim goes beyond or contradicts this passage" (crimson accent)
      - Radio + "Needs review — unclear or partial support" (amber accent)
    - Selected state: Accent left border 2px, bg subtle tint
    - "Save verdict" Primary Button (full-width, mt-4) — disabled until selection

  - **Navigation (fixed bottom, padding 16px, border-t subtle):**
    - Prev/Next buttons (ghost, chevron icons) + "1 of 3" (mono-sm, ink-muted)

REAL CONTENT: Real excerpt from sample PDF. Real verdict options.
STATES: Verdict selected/unsaved/saved, prev/next disabled at ends, focus trap.
```

---

## Screen 11: Run Workflow — Research
**Route:** `/app/runs/research` | **PRD:** C3

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + back button + "Research Workflow" title.

2. **Sidebar:** Same, "Runs" active.

3. **Main Content (max-w-4xl):**
   - **Header Card (elevated, 24px padding):**
     - Heading (h1): "Guided Research Workflow"
     - Text (body, ink-muted): "Turn a broad question into a cited deliverable. Steps: Refine question → Gather evidence → Synthesize → Check citations → Generate deliverable."
     - Progress Stepper (horizontal, 5 steps, accent-terracotta active, slate completed, subtle pending):
       1. Question (active)
       2. Evidence
       3. Synthesis
       4. Citations
       5. Deliverable

   - **Step 1: Question Refinement (active):**
     - Card (elevated, 24px padding):
       - Label (label): "Research question"
       - Textarea (lg, min-h-[100px], placeholder="e.g., What are the economic impacts of renewable portfolio standards on electricity markets?", value from chat or empty)
       - Helper (body-xs): "Be specific. Oristoria will break this into sub-questions and gather evidence from your sources."
       - Chips (suggested): "Policy analysis" "Literature review" "Comparative study" — click adds to question
       - Primary Button (full-width, lg): "Start research" — disabled until question entered

   - **Step 2: Evidence Gathering (loading state):**
     - Card: "Searching your workspace…" + Spinner + "Found 12 relevant passages across 3 sources" (updates live)
     - Sub-steps: "Query expansion" ✓ • "Semantic search" (spinner) • "Cross-source mapping" (pending)
     - Evidence Preview: Expandable list of passages with source, page, relevance score

   - **Step 3: Synthesis (pending):**
     - "Synthesizing findings…" + Streaming answer preview (read-only)

   - **Step 4: Citation Check (pending):**
     - Table: Claim | Source | Page | Verdict (dropdown: Supported/Unsupported/Needs review)
     - "All citations verified" → enables next step

   - **Step 5: Deliverable (pending):**
     - Select Kind: Radio cards — "Research Brief" / "Study Guide" / "Outline" / "Draft"
     - Generate Button → Creates artifact, navigates to Artifact View

   - **Run Timeline (right drawer or bottom section):**
     - Live steps with status icons, timestamps, token counts, expandable activity logs

REAL CONTENT: Real question suggestions. Real step descriptions. Real token estimates.
STATES: Step active/completed/pending/failed, evidence loading, synthesis streaming, citation table editable, deliverable kind selection.
RESPONSIVE: Stepper vertical on mobile. Cards stack.
```

---

## Screen 12: Run History + Timeline
**Route:** `/app/runs` | **PRD:** A9

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + "Runs" title.

2. **Sidebar:** Same, "Runs" active.

3. **Main Content:**
   - Header: Heading (h1): "Run History" + Subtext: "5 runs • 2 completed • 1 running • 2 failed"
   - **Table (desktop) / Card List (mobile):**
     - Columns: Workflow (Kind badge), Question (truncate), Status (badge), Steps, Duration, Started, Actions
     - Rows (real):
       1. Research | "Economic impacts of RPS…" | Completed (teal) | 5/5 | 3m 42s | 2h ago | View artifact
       2. Research | "Compare policy frameworks" | Running (slate, spinner) | 3/5 | 1m 12s | 5m ago | View progress
       3. Research | "Methodology review" | Failed (crimson) | 2/5 | 45s | 1d ago | View error
       4. Research | "Literature synthesis" | Completed (teal) | 5/5 | 4m 10s | 3d ago | View artifact
       5. Research | "Test question" | Cancelled (slate) | 1/5 | 12s | 1w ago | View
     - Row Hover: Highlight, actions visible (View, Rerun, Delete)
     - Empty: Illustration + "No runs yet" + "Start research workflow" primary button

   - **Run Detail Drawer (click row):**
     - Header: Workflow kind + Question + Status badge + Started/Duration
     - Step Timeline (vertical, connector line):
       - Step 1: "Question refinement" ✓ (teal) | 12s | 45 tokens | Expand → shows prompt + output
       - Step 2: "Evidence gathering" ✓ | 1m 20s | 1,200 tokens | Expand → shows search queries + passages
       - Step 3: "Synthesis" ✓ | 1m 05s | 2,100 tokens | Expand → shows streaming answer
       - Step 4: "Citation check" ✓ | 30s | 8 citations | Expand → shows verdict table
       - Step 5: "Deliverable" ✓ | 25s | Artifact created | Expand → link to artifact
     - Error State (if failed): Step with crimson badge, error message, "Rerun from here" button
     - Cancelled State: Step with slate badge, "Cancelled at Step 3" + "Resume" button (if resumable)

REAL CONTENT: Real run data from sample. Real timestamps, token counts, step names.
STATES: Table loading, empty, row hover/selected, drawer open, step expanded/collapsed, error/failed/cancelled states.
```

---

## Screen 13: Artifact View
**Route:** `/app/artifacts/:id` | **PRD:** A9, C3

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + back + artifact title (editable h2) + Kind badge (Research Brief / Study Guide / Outline / Draft) + Actions: Export (Download icon, ghost) + Duplicate (Copy icon, ghost) + Delete (Trash2, ghost crimson).

2. **Sidebar:** Same, "Artifacts" active.

3. **Main Content (max-w-3xl, paper-elevated, rounded-xl, shadow-md, padding 32px):**
   - **Header Meta (flex, gap-6, mb-8, pb-6, border-b subtle):**
     - Source: "Based on 3 sources • 12 citations" (ink-muted)
     - Run: "Research workflow • Completed 2h ago" (link to run detail)
     - Stats: "2,400 words • ~8 min read" (mono-sm)

   - **Content (prose, paper bg, rounded-lg, padding 24px, max-w-none):**
     - Rendered markdown/rich text with:
       - Headings (Space Grotesk, proper hierarchy)
       - Body (Inter, 1.6 line height)
       - Inline citations: [1] [2] (terracotta, underline hover) → click opens citation drawer
       - Code blocks (JetBrains Mono, paper bg, rounded-md)
       - Blockquotes (border-l-4 accent-terracotta, pl-4, italic)
       - Tables (styled per design system)
     - **Example Content (Research Brief):**
       ```
       # Economic Impacts of Renewable Portfolio Standards
       
       ## Executive Summary
       Renewable Portfolio Standards (RPS) have measurable effects on electricity markets…
       
       ## Key Findings
       1. **Price impacts are modest** — Studies show 0.5–2% retail rate increases [1][2].
       2. **Grid reliability maintained** — No correlation between RPS stringency and outage frequency [3].
       3. **Job transition critical** — Workforce programs reduce political resistance [4].
       
       ## Policy Recommendations
       - Phase implementation to allow market adjustment
       - Fund workforce transition proportionally to affected communities
       - Establish federal reliability backstop
       
       ## Sources
       [1] Renewable Energy Policy Review 2024, pp. 3–4
       [2] Ibid., pp. 7–9
       [3] Grid Modernization Assessment, pp. 12–15
       [4] Workforce Transition Analysis, pp. 20–22
       ```

   - **Citation Panel (right side on desktop, drawer on mobile):**
     - "12 citations" + "Audit: 8 verified • 2 needs review • 2 unsupported"
     - List: Citation #, Source, Pages, Verdict badge, "Open" action

   - **Footer Actions (sticky bottom mobile, mt-8):**
     - Primary "Export as PDF" + Secondary "Export as Markdown" + Ghost "Edit in new chat"

REAL CONTENT: Real artifact from sample research run. Real citations, real structure.
STATES: Loading skeleton, citation drawer, export loading, edit navigation.
RESPONSIVE: Citation panel → drawer mobile. Prose full-width.
```

---

## Screen 14: Usage / Limits Meter
**Route:** `/app/usage` | **PRD:** B3

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + "Usage" title.

2. **Sidebar:** Same, "Settings" active (Usage in settings section).

3. **Main Content (max-w-2xl):**
   - **Plan Card (elevated, 24px padding, mb-6):**
     - Badge: "Free Plan" (slate) or "Pro Plan" (terracotta)
     - Heading (h2): "Current Plan" + "Upgrade" ghost link (if free)
     - Text: "Fair-use limits reset monthly. Upgrade for higher caps."

   - **Usage Meters (card grid, 2-col desktop, 1-col mobile):**
     Each meter = Card (elevated, 20px padding):
     - **Standard Answers:**
       - Header: "Standard Answers" + "3 / 10 this month" (right, mono)
       - Progress Bar (h-2, rounded-full, bg subtle, fill accent-terracotta): 30%
       - Subtext: "Resets Dec 1, 2026" (body-xs, ink-muted)
       - Warning (if >80%): Amber badge "Approaching limit"
     - **Research Workflows:**
       - "1 / 4 this month" • Progress 25%
     - **Document Processing:**
       - "3 / 20 documents" • "47 / 500 pages" • Progress 15% / 9%
     - **Storage Used:**
       - "2.1 MB / 1 GB" • Progress 0.2%
     - **Background Jobs:**
       - "2 / 50 this month" • Progress 4%

   - **Details Table (collapsible):**
     - Columns: Metric, Used, Cap, Period, Reset Date, Status
     - Rows for each metric above with exact numbers

   - **Upgrade CTA (if free, mt-8):**
     - Card (accent-terracotta-subtle bg, border accent-terracotta):
       - Heading (h3): "Need higher limits?"
       - Text: "Upgrade to Pro for 10× caps, priority processing, and all features."
       - Primary Button: "View upgrade options" → /app/upgrade

REAL CONTENT: Real numbers from sample (3 answers, 1 workflow, 3 docs, 47 pages, 2.1 MB).
STATES: Progress bar colors (green <50%, amber 50-80%, crimson >80%), warning badges, empty/pro states.
RESPONSIVE: Grid stacks mobile. Table horizontal scroll.
```

---

## Screen 15: Settings — Profile, Preferences, Dark Mode
**Route:** `/app/settings` | **PRD:** B4 (Should)

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + "Settings" title.

2. **Sidebar:** Same, "Settings" active (expanded sub-nav: Profile, Appearance, Privacy, Advanced).

3. **Main Content (max-w-2xl):**
   - **Tabs (Profile | Appearance | Privacy | Advanced):**

   - **Profile Tab:**
     - Card (elevated, 24px padding):
       - Heading (h3): "Profile"
       - Avatar Upload (xl, 64px, click to change, preview)
       - Fields: Name (input), Email (input, disabled, "Change email in Account"), Language (select: English)
       - Primary Button: "Save changes"

   - **Appearance Tab:**
     - Card:
       - Heading (h3): "Appearance"
       - Theme Selector (radio cards, 3 options):
         - Light (sun icon) — "Always light"
         - Dark (moon icon) — "Always dark"
         - System (monitor icon) — "Match OS" (default, selected)
       - Density: Radio cards — "Comfortable" (default) / "Compact" (12px base)
       - Primary Button: "Save"

   - **Privacy Tab:** (Links to Screen 16)

   - **Advanced Tab:**
     - Card:
       - Heading (h3): "Advanced"
       - Toggle: "Stream answers token-by-token" (on)
       - Toggle: "Auto-save citations" (on)
       - Toggle: "Share usage analytics" (off)
       - Danger Zone: "Delete account" (crimson ghost button) → modal confirmation

REAL CONTENT: Real options. Default: System theme, Comfortable density.
STATES: Toggle on/off, radio selected, save loading, avatar preview, danger zone modal.
```

---

## Screen 16: Settings — Data Export / Delete
**Route:** `/app/settings/privacy` | **PRD:** B5

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + back to Settings.

2. **Sidebar:** Same, "Privacy" active.

3. **Main Content (max-w-2xl):**
   - **Export Section (Card, elevated, 24px padding):**
     - Heading (h3): "Export your data"
     - Text (body, ink-muted): "Download all your sources, conversations, artifacts, runs, and memories in JSON + original files."
     - Checkboxes (all checked, disabled): Sources, Chats, Artifacts, Runs, Memories, Approved memories
     - Primary Button: "Prepare export" → shows "Preparing…" spinner → "Download ready" toast + file download
     - Helper: "Export includes original files from Cloudflare R2. Link expires in 24 hours."

   - **Delete Section (Card, elevated, 24px padding, border-l-4 error-crimson, mt-6):**
     - Heading (h3, error-crimson): "Delete your account"
     - Text (body, ink-muted): "Permanently deletes your account, workspace, all sources, chats, artifacts, runs, and memories. Cannot be undone."
     - Confirmation Input (input, placeholder="Type DELETE to confirm"): Required for button enable
     - Destructive Filled Button: "Delete my account" — disabled until input matches "DELETE"
     - Modal Confirmation (second layer): "This is final. Are you sure?" + Secondary "Cancel" + Destructive "Yes, delete everything"

REAL CONTENT: Exact copy. Real confirmation flow.
STATES: Export preparing/downloading, delete input validation, double confirmation modal.
ACCESSIBILITY: High contrast for delete section, focus management in modals.
```

---

## Screen 17: Upgrade / Payment Instructions (Deferred)
**Route:** `/app/upgrade` | **PRD:** B2 (Should) — **DEFERRED FOR BETA**

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE:
1. **Top Bar:** Same + "Upgrade" title.

2. **Main Content (max-w-md, centered):**
   - Card (elevated, 32px padding):
     - Heading (h2): "Upgrade to Pro"
     - Subtext: "Manual payment at launch. Contact us for banking details."
     - Plan Comparison Table:
       | Feature | Free | Pro |
       |---------|------|-----|
       | Standard answers/mo | 10 | 100 |
       | Research workflows/mo | 1 | 20 |
       | Documents | 20 | 200 |
       | Storage | 1 GB | 10 GB |
       | Background jobs | 50 | 500 |
       | Priority processing | No | Yes |
     - Text: "Price: TBD (manual bank transfer)"
     - Primary Button: "Request upgrade instructions" → Opens email composer or shows modal with payment details
     - Modal: "Payment Instructions" — Bank name, Account, Reference format (ORISTORIA-{userId}), "Email confirmation to founder@oristoria.com after transfer"

REAL CONTENT: Real plan comparison from PRD. Manual payment flow.
STATES: Modal open, copy reference button, email link.
```

---

## Screen 18: Error Pages
**Routes:** `/404`, `/500`, `/offline`, `/cap` | **PRD:** —

```
=== ORISTORIA DESIGN SYSTEM ===
[Style header above]

PAGE STRUCTURE (all same layout, centered card, max-w-md):

**404 — Not Found:**
- Illustration: Search icon (xl, ink-subtle)
- Heading (h1): "Page not found"
- Text (body, ink-muted): "The page you're looking for doesn't exist or has been moved."
- Primary Button: "Go to workspace" → /app
- Ghost Button: "Contact support"

**500 — Server Error:**
- Illustration: AlertTriangle icon (xl, error-crimson)
- Heading: "Something went wrong"
- Text: "Our team has been notified. Please try again in a moment."
- Primary Button: "Try again" (reloads)
- Ghost Button: "Go to workspace"

**Offline:**
- Illustration: WifiOff icon (xl, warning-amber)
- Heading: "You're offline"
- Text: "Check your connection. We'll reconnect automatically."
- Status: "Retrying…" (spinner) → "Reconnected" (teal check) when online
- Ghost Button: "Retry now"

**Cap Reached (/cap):**
- Illustration: AlertCircle icon (xl, warning-amber)
- Heading: "Usage limit reached"
- Text: "You've used your monthly allowance of 10 standard answers."
- Subtext: "Resets Dec 1, 2026. Upgrade to Pro for higher limits."
- Primary Button: "View usage" → /app/usage
- Ghost Button: "Upgrade" → /app/upgrade

REAL CONTENT: Exact copy. Real reset date.
STATES: Offline auto-reconnect, cap page shows current usage.
```

---

## Generation Order (Recommended Groups)

### Group 1: Auth + Onboarding (4 screens)
1. Auth: Magic Link Request
2. Auth: Magic Link Success
3. Onboarding: Welcome + Workspace
4. Onboarding: Sample Upload + First Question

### Group 2: Core Workspace (4 screens)
5. Dashboard / Workspace Home
6. Sources: List + Upload
7. Source Detail
8. Chat / Conversation View

### Group 3: Citations + Workflows (4 screens)
9. Citation Drawer
10. Run Workflow: Research
11. Run History + Timeline
12. Artifact View

### Group 4: Settings + Errors (5 screens)
13. Usage / Limits Meter
14. Settings: Profile, Preferences, Dark Mode
15. Settings: Data Export / Delete
16. Error Pages (404, 500, Offline, Cap)
17. Upgrade / Payment (Deferred)

---

## Prompt Template for Each Screen

```
=== ORISTORIA DESIGN SYSTEM ===
[Copy full style header from top of this file]

PAGE STRUCTURE:
[Copy the PAGE STRUCTURE section for the specific screen above]

REAL CONTENT: [Copy REAL CONTENT line]
STATES: [Copy STATES line]
RESPONSIVE: [Copy RESPONSIVE line if present]
ACCESSIBILITY: [Copy ACCESSIBILITY line if present]
MOTION: [Copy MOTION line if present]
```

---

## Stitch Tips

1. **Create project first** → "Oristoria" → apply design system tokens from DESIGN.md
2. **Generate in groups** → 2-4 screens per prompt batch
3. **Use real content** → Every prompt has exact copy from PRD/sample flow
4. **Show all states** → Each prompt specifies hover, focus, loading, error, empty
5. **Theme consistency pass** → After all screens, review for token adherence
6. **Export** → `design/<screen>.png` + `design/<screen>.html`
7. **Index** → `design/INDEX.md` mapping screen → route → PRD story

---

*All prompts use the Oristoria design system from `docs/DESIGN.md`. No lorem ipsum. Real data from PRD sample flow.*