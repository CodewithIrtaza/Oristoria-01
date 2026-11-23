# Oristoria Product Requirements Document

**Status:** Draft for founder review  
**Owner:** Founder  
**Prepared:** 2026-11-22  
**Target:** Private beta approximately 12 weeks after implementation begins; the start date is not yet set.

## 1. Problem

Students, professionals, researchers, and creators accumulate information across PDFs, documents, notes, and conversations. Generic chatbots can answer from a prompt but cannot reliably work from a user's own material, show which source supports a claim, preserve context over time, or turn research into a finished piece of work. Spreadsheets can organize information but cannot interpret it, synthesize it, cite it, or execute multi-step work.

Oristoria's primary job is to turn a user's scattered material into a finished, source-grounded deliverable such as a study guide, research brief, outline, summary, or draft. It must be more trustworthy and more actionable than a generic chatbot because its work remains traceable to the user's sources and can continue through a defined workflow.

The initial product is for individual users. The business case depends on users repeatedly returning after they achieve a first useful result, not merely uploading a file and asking one question.

## 2. Users and Tenants

### Primary users

- **Students:** Turn lecture notes, readings, and textbooks into study guides, revision notes, practice material, and written assignments.
- **Professionals:** Consolidate reports, notes, and project material into briefs, plans, summaries, and drafts.
- **Researchers:** Gather evidence across sources, inspect citations, reconcile contradictions, and produce research outputs.
- **Creators:** Organize reference material and turn it into outlines, drafts, and project assets.

These are audience segments, not separate plans or product editions.

### Tenant and ownership model

- One customer is one individual account.
- Each account owns one private workspace in the initial release.
- Every source, conversation, artifact, run record, and long-term memory item is isolated to its owner.
- There are no shared workspaces, organization seats, shared ownership, or team billing in the initial release.
- Payment and entitlement records are associated with the individual account.

## 3. Goals

1. **Deliver the primary job:** Turn scattered user material into a finished, cited deliverable.
2. **Ground every useful answer:** Tie material claims to the user's sources and make evidence inspectable.
3. **Preserve work and context:** Maintain conversation context, approved cross-session memory, artifacts, and run history.
4. **Support real work:** Stream feedback, expose workflow progress, require approval for sensitive actions, and support durable long-running work.
5. **Protect user material:** Treat uploaded documents and derived data as potentially confidential, isolate them by account, and give users export and deletion controls.
6. **Validate repeat usage:** Prioritize first-value completion and 14-day return before optimizing for maximum feature breadth.
7. **Reach a private beta:** Target a private beta approximately 12 weeks after implementation starts, with only the Must scope below.
8. **Establish a viable paid path:** Test a flat individual subscription with fair-use free limits while collecting payment manually at launch.

## 4. Non-Goals

The initial product will not:

- Provide team workspaces, organization roles, shared ownership, real-time collaboration, or team billing.
- Provide native mobile applications or offline-first operation.
- Support self-hosted or on-premises enterprise deployment.
- Offer custom model training or customer-specific fine-tuning.
- Operate a public template, connector, skill, or content marketplace.
- Publish assistant outputs or source-derived content to public destinations.
- Perform broad, unrestricted automation of tasks unrelated to the user's workspace and selected workflow.
- Take consequential external actions without an explicit approval step.
- Promise general-purpose agent autonomy beyond the bounded workflows and tools approved for the product.

## 5. Features

### Tag definitions

- **mine:** Directly requested in the founder's product brief, later explicitly requested by the founder, or required by the initial SaaS feature brief.
- **suggested-accepted:** Suggested in the Phase 1 feature map or LangGraph capability review and accepted by the founder with “all recommended A, B, C.”

The priority labels define delivery order for the 12-week private beta; they do not remove any accepted feature from the product roadmap.

### 5.1 Must — private-beta scope

- **A1 — Multi-format document ingestion** — Allow users to upload PDFs and supported documents and extract usable text, metadata, page structure, and processing status. **Tag: mine**
- **A2 — Source-grounded chat with citations** — Answer questions from the user's workspace and link factual claims to supporting source passages. **Tag: mine**
- **A3 — Personal workspace and knowledge base** — Keep a user's sources, chats, artifacts, and memory in one private, organized workspace. **Tag: mine**
- **A4 — Semantic search** — Retrieve relevant source passages by meaning rather than exact keyword matching alone. **Tag: mine**
- **A5 — Cross-source synthesis** — Combine evidence across sources while preserving attribution, uncertainty, and contradictions. **Tag: mine**
- **A6 — Layered conversation and long-term memory** — Preserve context within a conversation and approved preferences or facts across sessions. **Tag: mine**
- **A7 — Multi-step work execution** — Help users plan, execute, monitor, and complete bounded study, research, writing, and organization workflows. **Tag: mine**
- **A9 — Persistent artifacts and run history** — Preserve completed outputs and make prior conversations, workflow steps, tool activity, errors, and approvals inspectable. **Tag: mine**
- **A10 — Streaming responses and live progress** — Stream answer output and show current workflow or tool activity so the user is not left waiting blindly. **Tag: mine**
- **A11 — Safety and privacy guardrails** — Detect prompt injection and prohibited content, redact sensitive information where appropriate, and record interventions. **Tag: mine**
- **B1 — Sign-up, login, and account security** — Let users securely create individual accounts through email magic links and manage account access. **Tag: mine**
- **B3 — Usage metering and plan limits** — Meter eligible usage and enforce the free and paid caps selected for each plan. **Tag: mine**
- **B5 — Data privacy controls, export, and deletion** — Let users inspect, export, and delete their account data and derived workspace data. **Tag: mine**
- **B6 — Guided onboarding** — Help a new user reach a first source-grounded deliverable without external setup. **Tag: mine**
- **C1 — Evidence inspection and citation audit** — Let users open every citation, inspect its source passage, and record whether a claim is supported. **Tag: mine**
- **C3 — Guided research workflow** — Turn a broad research question into evidence gathering, synthesis, citation checking, and a reusable deliverable. **Tag: mine**

### 5.2 Should — after the private-beta core is stable

- **A8 — MCP tools and connector management** — Connect external tools and expose their availability, permissions, health, and approval policy. **Tag: mine**
- **A12 — Human approval gates** — Require confirmation before consequential MCP actions such as sending messages, changing records, or spending money. **Tag: suggested-accepted**
- **A13 — Durable background jobs and resumable runs** — Continue long-running work after interruptions and expose queued, running, completed, failed, and cancelled states. **Tag: suggested-accepted**
- **B2 — Subscription plans and checkout** — Provide a flat individual subscription with manually collected payment at launch. **Tag: mine**
- **B4 — Profile and assistant settings** — Let users configure profile details, language, response behavior, and personal preferences. **Tag: mine**
- **C2 — User-controlled memory center** — Let users view, correct, scope, and forget remembered information. **Tag: suggested-accepted**

### 5.3 Could — optimize only after measured need

- **A14 — Semantic answer reuse and caching** — Reuse semantically similar, previously validated answers to reduce latency and model cost. **Tag: mine**

Semantic answer reuse is not a native LangGraph feature. It requires application-owned similarity matching, freshness and invalidation rules, strict account/workspace scoping, and a prohibition on reusing side-effecting tool calls.

## 6. User Stories and Acceptance Criteria

Every Must feature has at least one user story below. Each criterion is written to be observable and checkable. “Must not” statements identify important prohibited outcomes.

### US-01 — Upload and process a source

**Linked feature:** A1  
**As a** student or professional, **I want to upload my material **so that** Oristoria can work from it.

- **AC-001:** Given an eligible PDF or document, when the upload completes, the source appears in the user's workspace with a visible processing state and, on success, an indexed searchable representation.
- **AC-002:** After processing succeeds, a citation to that source identifies the source document and the supporting page or passage.
- **AC-003:** Given an unsupported, unreadable, or over-limit file, when processing is attempted, the workspace shows a specific failure reason and the source is not presented as successfully indexed.
- **Must not:** A failed or incomplete upload may not be cited as valid source evidence.

### US-02 — Ask a grounded question

**Linked feature:** A2  
**As a** researcher, **I want answers grounded in my selected material **so that** I can trust and verify the result.

- **AC-001:** Given relevant workspace sources, when the user asks a factual question, factual claims in the response are linked to one or more workspace citations.
- **AC-002:** Clicking a citation opens the cited source at the relevant page or passage.
- **AC-003:** Given sources that do not contain enough evidence, when the assistant responds, it states that the workspace does not establish the answer rather than presenting an unsupported factual claim as grounded.
- **Must not:** An answer may not cite a source outside the user's accessible workspace.

### US-03 — Keep unrelated work separate

**Linked feature:** A3  
**As a** professional working on several projects, **I want a private workspace **so that** unrelated material is not mixed together.

- **AC-001:** A user can create, rename, and delete their workspace.
- **AC-002:** Sources, chats, artifacts, and approved memory in one account's workspace are excluded from semantic retrieval for another account.
- **AC-003:** A user can identify which workspace supplied a search result, citation, or artifact.
- **Must not:** Data from one account may not appear in another account's results or run history.

### US-04 — Find evidence by meaning

**Linked feature:** A4  
**As a** student, **I want semantic search **so that** I can find useful passages even when I do not remember the exact wording.

- **AC-001:** Given a fixed set of approved test documents and a semantic-equivalence query set, relevant documents appear in the result set and each result includes the matching passage.
- **AC-002:** Search results identify the source document and location.
- **AC-003:** A user can distinguish semantic results from exact keyword matches in the interface or result metadata.
- **Must not:** A search request may not return content from an inaccessible workspace.

### US-05 — Combine multiple sources

**Linked feature:** A5  
**As a** researcher, **I want a synthesis across sources **so that** I can understand agreement and disagreement rather than reading every file again.

- **AC-001:** A multi-source response identifies the sources used for each factual cluster or claim.
- **AC-002:** When approved test sources make conflicting claims, the response represents the conflict rather than silently selecting or merging one claim.
- **AC-003:** The user can open each synthesis citation and inspect its source passage.
- **Must not:** The assistant may not silently remove a material contradiction between cited sources.

### US-06 — Preserve useful context

**Linked feature:** A6  
**As a** returning user, **I want relevant context remembered **so that** I do not repeat information in every conversation.

- **AC-001:** In a new message in the same conversation, a follow-up question uses the preceding conversation context.
- **AC-002:** A user-approved preference or fact is available in a later conversation after the persistence step completes.
- **AC-003:** An item rejected as a memory, deleted by the user, or belonging to another account is not returned as remembered context.
- **Must not:** A conversation may not silently become cross-session long-term memory.

### US-07 — Complete a multi-step workflow

**Linked feature:** A7  
**As a** professional, **I want the assistant to carry out a bounded workflow **so that** I receive completed work rather than only advice.

- **AC-001:** Starting an approved workflow displays its defined steps and their current states.
- **AC-002:** Successful completion produces the expected artifact and records it in the user's workspace.
- **AC-003:** A failed step produces a failed or blocked state with an actionable error and does not mark the workflow complete.
- **Must not:** The system may not report a deliverable as completed when a required step did not succeed.

### US-08 — Reopen completed work and prior runs

**Linked feature:** A9  
**As a** creator, **I want completed outputs and prior runs retained **so that** I can reuse and audit my work.

- **AC-001:** A saved artifact remains available after the user closes and reopens the application.
- **AC-002:** Run history lists the workflow steps, model or tool activity, timestamps, and recorded errors for a selected run.
- **AC-003:** A user can distinguish a final artifact from intermediate workflow output.
- **Must not:** Deleting an artifact may not leave an accessible duplicate in artifact listings.

### US-09 — See progress and cancel a live response

**Linked feature:** A10  
**As a** user, **I want live progress **so that** long operations remain understandable and interruptible.

- **AC-001:** During a live answer, output appears incrementally rather than only after the entire response completes.
- **AC-002:** During a tool or workflow step, the interface shows the current activity before completion.
- **AC-003:** Activating cancel stops new work and produces a cancelled or stopped state rather than an apparently completed state.
- **AC-004:** The final saved response and run history agree with the last visible state.
- **Must not:** A cancelled operation may not continue presenting new output as if it were running.

### US-10 — Resist malicious document instructions

**Linked feature:** A11  
**As a** user, **I want uploaded content treated as data **so that** a document cannot take control of the assistant.

- **AC-001:** An approved prompt-injection test set cannot cause an unapproved tool call, secret disclosure, permission change, or cross-account access.
- **AC-002:** A detected blocked or modified request produces a user-visible explanation consistent with policy and an audit record.
- **AC-003:** A benign request covered by the same test suite is not blocked by the tested guardrail.
- **Must not:** Text embedded in a source document may not be treated as a system instruction that overrides user or system policy.

### US-11 — Sign in securely

**Linked feature:** B1  
**As an** individual user, **I want passwordless sign-in **so that** my workspace is accessible without managing a password.

- **AC-001:** A valid, unexpired magic link signs the intended account into its workspace.
- **AC-002:** An expired, malformed, or already-used magic link is rejected without creating a session.
- **AC-003:** Signing out invalidates the current session and prevents subsequent access without a new valid link.
- **Must not:** Possession of a link for one account may not create access to another account.

### US-12 — Understand and enforce usage limits

**Linked feature:** B3  
**As a** customer, **I want visible plan limits **so that** I understand when I have reached my included usage.

- **AC-001:** Each defined metered event increments the displayed usage by the documented amount.
- **AC-002:** When the applicable cap is reached, the next event is blocked or routed to the selected upgrade/payment prompt rather than silently exceeding the cap.
- **AC-003:** Usage counters reset according to the documented billing period and remain associated with the correct account.
- **Must not:** Usage from one account may not affect another account's allowance.

### US-13 — Export and delete personal data

**Linked feature:** B5  
**As a** privacy-conscious user, **I want control over my data **so that** I can take it with me or remove it.

- **AC-001:** An export contains the account's sources, derived content, conversations, artifacts, run records, and retained long-term memory in a documented format.
- **AC-002:** After deletion completes, deleted items are unavailable in the active workspace and are not returned by search, chat, or memory retrieval.
- **AC-003:** The user receives a visible completion or failure state for export and deletion.
- **Must not:** A deleted item may not remain accessible through ordinary product search or chat retrieval.

### US-14 — Reach first value during onboarding

**Linked feature:** B6  
**As a** new user, **I want guided onboarding **so that** I understand the product by completing a useful task.

- **AC-001:** A new user can complete a source-grounded deliverable using provided sample material without configuring an external service.
- **AC-002:** The onboarding flow identifies the current step, progress, and the next available action.
- **AC-003:** The first successful source-grounded deliverable records one first-value activation event.
- **Must not:** The activation event may not be recorded before a deliverable is successfully produced.

### US-15 — Inspect and audit evidence

**Linked feature:** C1  
**As a** researcher, **I want to audit citations **so that** I can determine whether an answer is genuinely supported.

- **AC-001:** Every displayed citation opens the source document at the cited location.
- **AC-002:** A reviewer can mark a citation-supported claim as supported or unsupported.
- **AC-003:** A citation audit result is visible for the reviewed answer or deliverable.
- **Must not:** A citation marked unsupported may not continue to display as verified merely because it has a source link.

### US-16 — Run a guided research workflow

**Linked feature:** C3  
**As a** researcher, **I want a guided path from question to evidence **so that** I produce a defensible research output.

- **AC-001:** The workflow exposes question refinement, evidence gathering, synthesis, citation checking, and deliverable stages.
- **AC-002:** The final deliverable links each factual claim to an inspected source passage.
- **AC-003:** The completed deliverable is saved to the workspace and linked to its run history.
- **Must not:** The workflow may not report completion while a required citation check remains unresolved.

## 7. Plans and Limits

The founder selected a free plan with fair-use caps, one flat individual subscription, and manual payment collection at launch. Exact prices and numerical limits were not selected and therefore remain open rather than being invented here.

| Plan | Price | Account and workspace | Included usage and storage | Feature entitlements | Payment at launch |
| --- | --- | --- | --- | --- | --- |
| Free | $0 | One individual account; one private workspace | Fair-use caps for eligible model usage, document processing, storage, and background work: **TBD in OQ-03** | Core source-grounded work is enabled; MCP and other metered entitlement details: **TBD in OQ-03** | No payment required |
| Paid Individual | One flat subscription price: **TBD in OQ-03**; monthly versus annual billing: **TBD in OQ-04** | One individual account; one private workspace | Higher fair-use caps for eligible model usage, document processing, storage, and background work: **TBD in OQ-03** | All accepted A, B, and C features are eligible, subject to documented quotas and approvals | Manual bank transfer or locally available payment rail; instructions and reconciliation process: **TBD in OQ-08** |

### Usage-metering rules that must be finalized

The following require exact definitions before implementation so the usage counter and plan limits are testable:

- Whether document processing is metered by file, page, extracted character, or storage byte.
- Whether standard answers, research workflows, tool calls, and background jobs consume separate allowances.
- Which model and MCP costs count against a user allowance.
- The free-plan cap and the paid-plan included allowance.
- Whether limits reset monthly, annually, or through another documented period.
- The exact behavior at a cap: block, prompt for manual upgrade, or another approved policy.

## 8. External Services

All cost figures below are based on provider pricing that can change. Provider-specific rates, free-tier limits, and account access are **assumptions or open questions until verified**.

| Service | Purpose | Account status | Cost basis and launch assumption |
| --- | --- | --- | --- |
| OpenRouter | Model access and optional multi-model routing | Founder reports an existing account; live key and credit status require verification | Per-token, per-model cost plus any gateway markup; exact model and blended rate are **TBD in OQ-02** |
| Groq | Fast model inference and possible task-specific routing | Founder reports an existing account; live key and credit status require verification | Per-token model usage; exact model and rate are **TBD in OQ-02** |
| NVIDIA NIM | Model inference and possible task-specific routing | Founder reports an existing account; live key, entitlement, and credit status require verification | Hosted API entitlement or per-token usage; exact model and rate are **TBD in OQ-02** |
| Managed PostgreSQL with pgvector, using Supabase or Neon | Primary relational data, account data, document metadata, long-term memory records, and vector retrieval | No account reported; founder must create one | Hosted plan, storage, compute, and transfer costs; free-tier adequacy is an **assumption** |
| Cloudflare R2 | Original uploaded files and durable artifact files | No account reported; founder must create one | Storage and operation charges; free-tier adequacy is an **assumption** |
| Upstash or equivalent managed Redis | Semantic answer cache, rate limiting, ephemeral workflow state, and job coordination | No account reported; founder must create one | Request, memory, and storage charges; free-tier adequacy is an **assumption** |
| Resend or equivalent transactional email | Magic-link authentication and operational email | No account reported; founder must create one | Per-message or per-email cost; free-tier adequacy is an **assumption** |
| Vercel or equivalent | Next.js web application hosting | No account reported; founder must create one | Build, compute, bandwidth, and seat charges; free-tier adequacy is an **assumption** |
| Container hosting for FastAPI and LangGraph services | API, ingestion, retrieval, workflow, and worker processes | No account reported; founder must create one | Compute, memory, storage, and transfer charges; exact provider and free-tier adequacy are **TBD in OQ-01** |
| LangSmith Agent Server or self-hosted LangGraph Agent Server | Durable workflow execution and background-run support | No account reported; only if required for A13 | Hosted usage-based charges if LangSmith is selected; infrastructure cost if self-hosted; decision is **TBD in OQ-06** |
| LangSmith observability and evaluation, optional | Run traces, regression datasets, and quality monitoring | No account reported; optional | Usage-based charges; excluded from the zero-dollar launch assumption unless a verified free tier is sufficient |
| MCP servers and connected tools | User-approved external actions and data access | Provider-specific; no universal account | Third-party subscription, usage, or action charges; must be disclosed before approval and excluded from silent overage |
| Manual payment rail | Paid subscription collection | No automated payment account required at launch | No automatic processor percentage selected; bank or transfer fees, collection delay, and manual administration remain unquantified |
| Docker during development | Local reproducible services for the selected infrastructure stack | Local tooling | No incremental provider bill; developer-machine and operating costs are not included in the unit-economics scenario |

## 9. Unit Economics

### Cost drivers

- **Model inference:** The primary variable cost. OpenRouter, Groq, and NVIDIA NIM are selected provider options, but model routing and blended rates remain open.
- **Embeddings and semantic retrieval:** Additional per-token or per-request cost, included in the blended assumptions below.
- **Document processing:** Page extraction, OCR if later enabled, embedding, and indexing costs.
- **Object storage:** Original files, generated artifacts, and exports.
- **Redis:** Cache operations, ephemeral state, rate limiting, and job coordination.
- **Transactional email:** Magic-link and operational messages.
- **Hosting and bandwidth:** Web, API, worker, and background-job compute.
- **MCP and third-party tools:** Variable costs imposed by connected services. These must not be silently absorbed by the user's flat plan.
- **Manual payment administration:** Reconciliation, support, collection follow-up, and dispute handling; no per-user amount is currently measured.

### Illustrative planning scenario — assumptions, not provider quotes

The following assumptions exist only to make unit economics testable. They are not accepted prices, quotas, or provider facts:

- **U1:** One standard source-grounded answer costs **$0.10** blended across model input, model output, embeddings, retrieval overhead, and normal retries.
- **U2:** One long research workflow costs **$0.75** blended across its multiple model calls and retrieval steps.
- **U3:** A paid active user performs **30 standard answers** and **4 long research workflows** per month.
- **U4:** A free active user performs **10 standard answers** and **1 long research workflow** per month; actual free-plan caps should constrain this behavior.
- **U5:** When A14 is enabled, semantic answer reuse saves **15% of model cost** after account scoping and invalidation rules are applied.
- **U6:** Allocated non-model variable cost is **$0.75 per paid active user per month** and **$0.25 per free active user per month**, covering storage, Redis, email, and an allocation of hosting.
- **U7:** A target gross margin of **70%** is used only to illustrate a subscription-price floor.

### Calculated cost per user per month

| User scenario | Model and workflow cost | Semantic cache effect | Non-model cost | Illustrative total per user per month |
| --- | --- | --- | --- | --- |
| Free active user | (10 × $0.10) + (1 × $0.75) = **$1.75** | $0 under the scenario because U5 applies to paid usage | **$0.25** | **$2.00** |
| Paid active user before A14 | (30 × $0.10) + (4 × $0.75) = **$6.00** | $0 | **$0.75** | **$6.75** |
| Paid active user with A14 enabled | **$6.00** | 15% model saving = **−$0.90** | **$0.75** | **$5.85** |

- **Illustrative paid-price floor under U7:** $5.85 ÷ (1 − 0.70) = **$19.50 per month**. This is a planning calculation, not the selected price.
- **Free-cohort constraint:** Under the scenario, fair-use limits must keep expected cost at or below **$2.00 per active free user per month**.
- **Excluded from the scenario:** MCP charges, taxes, customer support labor, refunds, failed-payment recovery, fixed infrastructure, and developer labor.
- **Required pricing follow-up:** Set the actual price from the verified provider rates, selected free caps, actual usage distribution, desired margin, and manual-payment friction in OQ-03 and OQ-04.

## 10. Success Metrics

### Primary launch signal — assumptions

The founder selected activation and return as the primary signal. The following thresholds are **assumptions to validate**, not established benchmarks:

- **First-value activation:** At least **40% of new signups** create one source-grounded deliverable in their first session.
- **14-day return:** At least **20% of activated users** return within 14 days.

### Supporting metrics

- Percentage of new users who complete onboarding.
- Percentage of source-grounded claims accepted as supported during citation audit; threshold **TBD in OQ-10**.
- Free-to-paid conversion and median time to paid activation; threshold **TBD in OQ-03**.
- Paid-user variable cost per month compared with the verified paid price and gross-margin target.
- Background-job completion, failure, cancellation, and resume rates.
- Guardrail intervention rate and confirmed safety or cross-account data-access incidents. Any confirmed cross-account data exposure blocks launch.
- Weekly active users, source-grounded deliverables produced, and repeat use by audience segment.

## 11. Constraints

### Product and operational constraints

- The initial tenant is one individual account with one private workspace.
- Payment is collected manually at launch; no card processor or merchant-of-record dependency is assumed.
- The launch budget is **$0**. Free-tier availability, quotas, and production suitability are assumptions until verified.
- The private-beta target is approximately 12 weeks after implementation begins; no calendar start date has been selected.
- Originals, extracted text, conversations, artifacts, run history, and approved long-term memory are stored as potentially confidential data until the user deletes them.
- Backup deletion behavior, data residency, encryption-key ownership, and operational retention are unresolved.
- MCP actions can incur third-party cost and must be disclosed before approval.
- Semantic answer reuse must be account/workspace scoped, freshness-aware, invalidated when relevant source or memory content changes, and disabled for side-effecting operations.

### Accounts, projects, domains, and keys the founder must create

No secret values belong in this document or in source control. The founder must create or configure the following before the relevant production path is enabled:

1. **OpenRouter:** confirm account eligibility, create an API key, configure spending limits/credits, and decide which models are permitted.
2. **Groq:** confirm account eligibility, create an API key, configure spending limits/credits, and decide which models are permitted.
3. **NVIDIA NIM:** confirm developer/API access, create an API key, verify hosted quotas or credits, and decide which models are permitted.
4. **Managed PostgreSQL account:** create a Supabase or Neon account, project, database, credentials, backups, pgvector extension, and connection-pooling settings.
5. **Cloudflare R2:** create the account, bucket, access key ID, secret access key, lifecycle policy, and CORS/access policy.
6. **Managed Redis:** create an Upstash or equivalent account, endpoint, token, TLS configuration, and eviction policy.
7. **Transactional email:** create the Resend or equivalent account, API key, verified sending domain, DNS records, and template for magic links.
8. **Web hosting:** create the Vercel or equivalent project, deployment permissions, environment variables, and preview/production domains.
9. **Container and worker hosting:** create the chosen provider account, registry access, service secrets, persistent storage if required, and deployment configuration for FastAPI, LangGraph workers, and background jobs.
10. **Application secrets:** generate and securely store session-signing, cookie, encryption, internal API, webhook, and service-to-service credentials. The founder must own access and rotation.
11. **LangSmith, if selected:** create the account, project, API key, trace/evaluation retention settings, and data-processing approvals.
12. **MCP connectors:** create and verify each connector account, OAuth or API credentials, permissions, redirect URLs, and spending controls. Users must connect third-party accounts with their own authorization.
13. **Manual payment:** create or select the receiving bank/account, document payment instructions, define entitlement reconciliation, and establish the receipt record without placing unnecessary financial data in application logs.
14. **Domain and legal details:** configure the product domain, legal business identity, support contact, terms, privacy policy, refund policy, and tax treatment applicable to the Pakistan-based seller.
15. **Production environment configuration:** create separate development and production environments, configure secret references, database migrations, backup scheduling, log retention, alerting, and error monitoring.

## 12. Parking Lot

The following items are deliberately deferred rather than silently included in the private-beta scope:

- Team and organization workspaces, roles, permissions, shared ownership, and organization billing.
- Real-time collaboration on sources, evidence, and artifacts.
- Native mobile applications and offline-first operation.
- Self-hosted or on-premises deployment.
- Public publishing, templates, connectors, skills, or content marketplace.
- Custom model training or customer-specific fine-tuning.
- General-purpose autonomous automation outside bounded workspace workflows.
- Voice, audio, and video as first-class input modes.
- Local-first storage mode.
- Advanced checkpoint replay and run forking beyond the run history needed for support.
- Managed quality dashboards, large evaluation datasets, and continuous production evaluation.
- Public connector and task-recipe ecosystems.
- Automatic card checkout and automatic metered overage billing.

## 13. Open Questions

Every question has one accountable owner.

| ID | Open question | Owner | Blocking condition |
| --- | --- | --- | --- |
| OQ-01 | Choose Supabase or Neon and choose the container host for FastAPI and workers after verifying zero-dollar tiers and operational fit. | Founder | Blocks production infrastructure setup |
| OQ-02 | Choose the primary model provider and task-routing policy across OpenRouter, Groq, and NVIDIA NIM; define allowed models and fallback behavior. | Founder | Blocks reliable cost estimates and final model integration |
| OQ-03 | Set the flat paid price and exact free/paid caps for documents, model usage, storage, workflows, and background work. | Founder | Blocks plan enforcement and final unit economics |
| OQ-04 | Decide whether the paid subscription is monthly, annual, or both, and whether annual billing receives a discount. | Founder | Blocks checkout and entitlement-period design |
| OQ-05 | Define data residency, encryption-key ownership, backup retention, account-deletion timing, and deletion from backups. | Founder | Blocks production privacy claims |
| OQ-06 | Decide between self-hosted LangGraph Agent Server and LangSmith Agent Server; decide separately whether LangSmith observability is worth its cost. | Founder | Blocks A13 durable-job implementation |
| OQ-07 | Choose the first MCP connectors and define their credential, permission, approval, and spending policies. | Founder | Blocks A8 and A12 launch decisions |
| OQ-08 | Select the manual bank or local payment rail, write payment instructions, and define receipt reconciliation and entitlement activation. | Founder | Blocks paid plan activation |
| OQ-09 | Confirm the legal, tax, refund, privacy, and consumer terms for collecting payment as a Pakistan-based seller. | Founder | Blocks paid-plan publication |
| OQ-10 | Define supported file types, per-file limits, processing expectations, and the citation-audit quality threshold. | Founder | Blocks ingestion acceptance tests and quality reporting |
| OQ-11 | Define whether long-term memory may include source-derived facts, who can approve them, and the default retention period. | Founder | Blocks A6 and C2 behavior |
| OQ-12 | Define the implementation start date from which the 12-week private-beta target is counted. | Founder | Blocks deadline tracking |

## 14. Acceptance Summary

The PRD is ready for founder review when the founder confirms that the open questions, priority labels, and explicit assumptions reflect the intended product direction. No automatic payment provider, exact price, numerical usage limit, model choice, calendar deadline, legal treatment, or provider production tier has been presented as decided unless it was explicitly selected during the interview.
