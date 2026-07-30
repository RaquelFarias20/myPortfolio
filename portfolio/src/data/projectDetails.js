export const projectDetails = {
  "bettercampus-analytics": {
    id: "bettercampus-analytics",
    category: { title: "Analytics | AI", hasDivider: true },
    title: "Building the Analytics Backbone for a 1.8M+ User Product",
    company: "BetterCampus, Inc.",
    role: "Product Analytics Specialist",
    dateStart: "Jan 2026",
    dateEnd: "Present",
    tags: ["Analytics", "SQL", "Instrumentation", "Product Growth"],

    body: [
      {
        type: "statement",
        content:
          "BetterCampus had analytics scattered across three app surfaces with no shared taxonomy, no reliable identity mapping, and no way to answer basic questions about who its users were or where revenue was coming from.",
      },

      // ── The Problem ───────────────────────────────────────────────
      { type: "heading", content: "The Problem" },
      {
        type: "paragraph",
        content:
          "BetterCampus is a browser extension that grew from a Canvas skin into a full academic productivity suite — assignments, grades, study tools, notes, themes — used by over 1.8 million students. The product had outpaced its measurement.",
      },
      {
        type: "paragraph",
        content:
          "Analytics events existed across three separate app surfaces: <strong>wxt</strong> (the main browser extension, with a richer helper that enriched every event with plan type, version, school, and browser/OS), <strong>ext-pages</strong> (extension-hosted pages with a simpler, separate tracking helper), and <strong>seo-pages</strong> (the marketing site, with its own duplicate versions of some onboarding components).",
      },
      {
        type: "paragraph",
        content:
          "Nobody could confidently say which signup flow was actually live, whether an event fired once or multiple times per action, or how product usage connected to revenue. Before any new instrumentation could be trusted, the existing setup had to be fully understood.",
      },
      {
        type: "media",
        src: "/images/bettercampus_analytics_architecture.png",
        alt: "Analytics architecture diagram — three scattered surfaces consolidated into one standardized pipeline",
      },

      // ── Process ───────────────────────────────────────────────────
      { type: "heading", content: "Process" },
      {
        type: "process-flow",
        steps: [
          { label: "Audit & Design", color: "#1B1418", textColor: "#fff" },
          { label: "Instrumentation", color: "#3A3336", textColor: "#fff" },
          { label: "Custom Tooling", color: "#6E6A6C", textColor: "#fff" },
          { label: "Insight Delivery", color: "#A39EA0", textColor: "#1B1418" },
        ],
      },

      // ── Audit & Design ────────────────────────────────────────────
      { type: "heading", content: "Audit & Design" },
      {
        type: "paragraph",
        content:
          "I started by tracing every tracking call back to its source file and route — not assuming a single source of truth, but labeling each path as live, legacy, fallback, or a genuinely separate surface. A signup questionnaire component existed in both <em>ext-pages</em> and <em>seo-pages</em> under near-identical names; matching the live product UI against the code confirmed which was actually shipping and which was a stale duplicate.",
      },
      {
        type: "paragraph",
        content:
          "Out of this audit I wrote a master analytics plan structured around three pillars the business needed answers to:",
      },
      {
        type: "list",
        content: [
          "<strong>Demographics</strong> — Who are our users: which schools, plan types, devices?",
          "<strong>Product Usage</strong> — What do they actually do, and what drives retention?",
          "<strong>Revenue</strong> — How does usage convert to trials, upgrades, and MRR?",
        ],
      },
      {
        type: "paragraph",
        content:
          "For each pillar I defined the required events, the enriched properties every event needed (user ID, school, normalized plan type, device/browser/extension version), and the specific dashboards and funnels — signup→onboarding, trial→paid, free→paid, retention — that would answer the business's key questions.",
      },

      // ── Instrumentation ───────────────────────────────────────────
      { type: "heading", content: "Instrumentation" },
      {
        type: "paragraph",
        content:
          "With the taxonomy defined, I moved into three connected engineering streams:",
      },
      {
        type: "list",
        content: [
          "<strong>Signup questionnaire metadata cleanup</strong> — standardized tracking across the two duplicate questionnaire flows so funnel data could be compared apples-to-apples",
          "<strong>Signup flow metadata</strong> — added <code>flow_type</code> / <code>flow_step</code> properties so the same event (e.g. &ldquo;signup complete&rdquo;) could be understood in the context of where in the journey it happened, not just where in the app",
          "<strong>Feature usage instrumentation</strong> — added <code>feature_used</code> tracking across five core surfaces: Study (file uploads), Notes (creation, including a voice-transcription path a bug report had missed), Tasks (drag-and-drop planning), Themes (swap + apply), and Grades (goal-setting)",
        ],
      },
      {
        type: "paragraph",
        content:
          "The most important engineering decision was <strong>separating intent from completion</strong>. For Study uploads, the event fires on user intent (clicking Upload/Continue) rather than on successful file processing — because the product question was \"did the user attempt this,\" not \"did the pipeline succeed.\" That distinction shaped where each event lived in the code and became the basis for defending the approach in code review, along with instrumenting both variants of an A/B-tested upload modal so we wouldn't silently lose half the experiment population.",
      },
      {
        type: "embed",
        src: "/blueprints/bettercampus-intent.html",
        label: "Tracking approach: intent vs. completion",
      },

      // ── Custom Tooling ────────────────────────────────────────────
      { type: "heading", content: "Custom Tooling" },
      {
        type: "paragraph",
        content:
          "Dashboards answer \"what's happening now,\" but the team also needed a way to turn raw Stripe exports into a trustworthy recurring report without manual spreadsheet work every week. I built a <strong>Python/pandas CLI tool</strong> that:",
      },
      {
        type: "list",
        content: [
          "Ingests Stripe subscription exports (CSV/XLSX)",
          "Applies a canonical definition of \"active paying\" vs. \"active with a pending cancellation request\" — encoding the business's actual logic directly rather than leaving it to manual interpretation each run",
          "Computes MRR (normalizing annual plans to a monthly equivalent), subscriber tenure (mean, median, P75, P90), cohort breakdowns by signup month, and trial-length distributions",
          "Parses free-text cancellation feedback into a reason distribution",
          "Outputs a clean, multi-tab Excel report on a single command",
        ],
      },
      {
        type: "paragraph",
        content:
          "This replaced a manual weekly process with a repeatable one-command report and became the backbone of the team's recurring business reporting.",
      },

      // ── Insight Delivery ──────────────────────────────────────────
      { type: "heading", content: "Insight Delivery" },
      {
        type: "paragraph",
        content:
          "With instrumentation live and tooling in place, I ran a full SQL-based audit against 90 days of production data to answer the questions the master plan had set out, and to sanity-check the new tracking. The findings were more consequential than expected:",
      },
      {
        type: "list",
        content: [
          "<strong>Retention crisis</strong> — day-1 return rate hovered around 1% across every signup cohort, dropping further by day 7 and day 30",
          "<strong>Live onboarding regression</strong> — profile-completion and trial-claim rates dropped sharply around a specific week, a clear signal a shipped change had broken part of onboarding, not a data artifact",
          "<strong>Broken status field</strong> — a core planning feature showed 0% completion rate across tens of thousands of created records, pointing to a tracking or state-update bug rather than genuine disuse",
          "<strong>Runaway AI cost growth</strong> — usage-driving token costs on AI features had grown over 100× in under three months, far outpacing user growth — a monetization and cost-control flag for leadership",
        ],
      },
      {
        type: "paragraph",
        content:
          "Each of these became a flagged, actionable item handed directly to product and engineering — not just a chart.",
      },

      // ── Key Decisions & Trade-offs ────────────────────────────────
      { type: "heading", content: "Key Decisions & Trade-offs" },
      {
        type: "list",
        content: [
          "<strong>Intent over completion events</strong> — chose to measure what the user tried to do, accepting that failures get counted, because that was the actual product question being asked",
          "<strong>Leaned on existing architecture</strong> — kept ext-pages and wxt on their own existing tracking helpers rather than merging them, avoiding cross-surface complexity for marginal consistency gain",
          "<strong>Canonical business definitions over raw platform fields</strong> — Stripe's status field alone didn't capture \"active but requested cancellation,\" so the business's actual definition was encoded directly into the tooling rather than left to manual interpretation each time",
          "<strong>Traced ambiguity to source</strong> — when the same flow appeared to exist twice, resolved it by matching code to live UI rather than picking whichever looked more official",
        ],
      },

      // ── Impact ────────────────────────────────────────────────────
      { type: "heading", content: "Impact" },
      {
        type: "list",
        content: [
          "Replaced an untrustworthy, three-surface analytics setup with a single documented taxonomy and a standardized enrichment pattern",
          "Shipped instrumentation covering five core product surfaces, closing gaps that had been silently under-tracking usage (voice-transcribed notes weren't counted before this work)",
          "Delivered a reusable reporting tool that turned a manual weekly process into a one-command report",
          "Surfaced a retention crisis and two live product bugs backed by a clean, audited dataset — no orphaned records, no null keys, ~1:1 referential integrity between users and subscription state",
        ],
      },

      // ── Reflection ────────────────────────────────────────────────
      { type: "heading", content: "Reflection" },
      {
        type: "paragraph",
        content:
          "The technical work here was straightforward — event tracking, SQL, pandas. What made it valuable was resisting the urge to just \"add more tracking\" and instead first asking what was already there, what could be trusted, and what specific business questions needed answering. The most useful output wasn't a dashboard — it was a small set of flagged, well-evidenced problems that the team could act on immediately.",
      },
    ],

    links: [],
    prev: null,
    next: { id: "un-ai-safety", title: "AI Engineer & Platform Lead" },
  },

  "un-ai-safety": {
    id: "un-ai-safety",
    category: { title: "Analytics | AI", hasDivider: true },
    title: "AI Engineer & Platform Lead",
    company: "United Nations ICC — AI Safety Lab",
    role: "AI Engineer & Platform Lead",
    dateStart: "Jan 2026",
    dateEnd: "May 2026",
    tags: ["AI", "UX/UI", "Zero-to-One", "Product Strategy"],

    body: [
      {
        type: "video",
        src: "https://www.youtube.com/embed/kIMYHh7Qtjw",
        alt: "Introduction to UNICC AI Safety Lab",
        caption: "Demo of the UNICC AI Safety Lab platform",
      },

      // ── Introduction / Purpose ──────────────────────────────
      { type: "heading", content: "Introduction / Purpose" },
      {
        type: "paragraph",
        content:
          "UNICC AI Safety Lab is a multi-agent AI safety assessment platform built for the United Nations International Computing Centre capstone competition. The project was designed to help evaluate whether AI systems are safe, trustworthy, auditable, and ready for responsible deployment.",
      },
      {
        type: "paragraph",
        content:
          "The original goal was to create a solution that could review AI systems against safety and governance expectations, surface key risks, and produce a structured assessment that could support decision-making. Rather than building a simple chatbot or one-off scoring tool, we built an end-to-end assessment workflow that collects evidence, organizes it into a shared case structure, evaluates it through multiple AI reviewers, arbitrates the final decision, and generates a traceable report.",
      },
      {
        type: "paragraph",
        content:
          "The core problem the project solves is that AI safety assessments are often fragmented, opaque, or difficult to compare across systems. UNICC AI Safety Lab makes the process more structured by combining evidence intake, multi-perspective review, risk scoring, final arbitration, and framework-aligned reporting in one workflow.",
      },
      {
        type: "paragraph",
        content:
          "The intended users include AI governance teams, technical reviewers, compliance stakeholders, product teams, and organizations evaluating AI systems before deployment.",
      },

      // ── What I Built ───────────────────────────────────────
      { type: "heading", content: "What I Built" },
      {
        type: "paragraph",
        content:
          "At a high level, I built a structured AI safety assessment platform with four major stages: evidence intake, evidence normalization, multi-reviewer assessment, and final report generation.",
      },
      {
        type: "paragraph",
        content:
          "The system accepts multiple types of input, including structured JSON case files, public GitHub repositories, live endpoint URLs, and generated demonstration cases. Each input type has a different evidence-collection path, but all of them are converted into the same internal system case format. This allows the downstream assessment process to remain consistent regardless of where the evidence came from.",
      },
      {
        type: "paragraph",
        content:
          "The core architecture follows this flow: input source → evidence intake → shared system case → three holistic AI reviewers → final arbitration → structured artifacts and PDF report.",
      },
      {
        type: "paragraph",
        content:
          "The reviewer architecture is courtroom-inspired. Instead of relying on one model to make a single opaque decision, the system uses three AI reviewers and a final arbitration layer. Each reviewer evaluates the system holistically across the same full risk rubric, but with a different emphasis:",
      },
      {
        type: "list",
        content: [
          "Reviewer 1 evaluates the system with stronger attention to governance, privacy, documentation, accountability, and deployment readiness.",
          "Reviewer 2 evaluates the system with stronger attention to security, misuse potential, exploitability, prompt injection, and technical failure modes.",
          "Reviewer 3 evaluates the system with stronger attention to user harm, fairness, transparency, trust, and stakeholder impact.",
        ],
      },
      {
        type: "paragraph",
        content:
          "Importantly, the reviewers are not limited to only one category. Each reviewer assesses the full system across all risk categories, but their different lenses help surface different concerns. This makes disagreement between reviewers meaningful rather than accidental.",
      },
      {
        type: "paragraph",
        content:
          "After the three reviews are complete, the final arbitration layer compares their outputs, identifies where they agree or disagree, determines which concerns are most material, and produces a final verdict, score, rationale, confidence level, and required actions.",
      },
      {
        type: "media",
        content: "System flow diagram",
        src: "/images/unicc_pipeline_architecture.png",
        alt: "UNICC AI Safety Lab pipeline architecture diagram",
        caption: "Pipeline Architecture",
        maxHeight: "340px",
      },
      {
        type: "paragraph",
        content:
          "The platform generates a full assessment package for each run, including the normalized system case, individual reviewer outputs, final arbitration output, execution trace, run summary, and a presentation-ready PDF report. The PDF is designed to act as a decision-support artifact covering the final verdict, top risks, reviewer alignment, control assessment, framework alignment, and recommended actions.",
      },
      {
        type: "paragraph",
        content:
          "<strong>Tech stack:</strong> Python, Streamlit for the UI, Pydantic for schema validation, OpenAI / Anthropic Claude / Google Gemini APIs for reviewer and arbitration roles, ReportLab for PDF generation, YAML and environment-based configuration, pytest for automated testing, and Docker support for containerized execution. The current version uses local filesystem artifact storage; there is no production database.",
      },

      // ── Tools, Techniques & Approaches Used ───────────────
      { type: "heading", content: "Tools, Techniques & Approaches Used" },
      {
        type: "paragraph",
        content:
          "The most important architectural decision was separating evidence intake from evaluation. Different input types require different ways of collecting evidence, but the evaluation layer should remain consistent. To support that, every input is normalized into one shared system case before being reviewed — allowing a repository, endpoint, JSON case, or generated scenario to all be assessed through the same rubric and reporting workflow.",
      },
      {
        type: "list",
        content: [
          "Schema-first design to enforce consistent input and output structure.",
          "Adapter-style intake logic for different evidence sources.",
          "Multi-model review using OpenAI, Claude, and Gemini.",
          "Structured JSON outputs from AI reviewers with validation and normalization.",
          "Deterministic repository evidence extraction.",
          "Safe runtime probing for simple endpoint assessment.",
          "Final arbitration layer instead of simple majority vote.",
          "Traceable artifact generation for every run.",
          "Framework-aligned reporting.",
        ],
      },
      {
        type: "paragraph",
        content: "The risk rubric covers eight major categories:",
      },
      {
        type: "list",
        content: [
          "<strong>Privacy and data leakage</strong>: Risks related to exposure of personal data, sensitive information, secrets, credentials, or confidential content.",
          "<strong>Harmful content and unsafe instructions</strong>: Risks that the system may provide dangerous, illegal, self-harm, violence, or other unsafe instructions.",
          "<strong>Cyber misuse and security abuse</strong>: Risks that the system could enable phishing, credential theft, malware development, vulnerability exploitation, or other cyber misuse.",
          "<strong>Bias, discrimination, and hate</strong>: Risks related to unfair treatment, discriminatory outputs, hateful content, or disproportionate impact on protected or vulnerable groups.",
          "<strong>Deception, impersonation, and overclaiming</strong>: Risks that the system may misrepresent its capabilities, impersonate people or institutions, fabricate authority, or make claims it cannot verify.",
          "<strong>Prompt injection and jailbreak resistance</strong>: Risks that user input or malicious instructions could override system behavior, weaken safeguards, or manipulate the model into unsafe outputs.",
          "<strong>Transparency and reliability</strong>: Risks related to unclear limitations, hallucinations, misleading confidence, unreliable outputs, or lack of user-facing explanation.",
          "<strong>Auditability and traceability</strong> — Risks related to missing logs, unclear decision history, insufficient evidence trails, or inability to reconstruct how an assessment or output was produced.",
        ],
      },
      {
        type: "paragraph",
        content:
          "A key design pattern was structured disagreement. The reviewers are expected to sometimes disagree, and that disagreement is treated as useful information. The final arbitration layer does not simply average scores — it compares the reviewers' reasoning, identifies material conflicts, and produces one final decision.",
      },
      {
        type: "paragraph",
        content:
          "For endpoint assessment, the current approach uses safe, limited runtime probes. These are lightweight text-based behavioral checks, not penetration testing or stress testing. They are intended to observe behaviors such as refusal quality, transparency, prompt injection resistance, secret handling, and capability-boundary honesty.",
      },

      // ── Challenges & Solutions ─────────────────────────────
      { type: "heading", content: "Challenges & Solutions" },
      {
        type: "paragraph",
        content:
          "One major challenge was avoiding opaque single-model judgment. A single model can miss risks, overfocus on one dimension, or produce a confident but shallow answer. To solve this, we designed a multi-reviewer architecture where each reviewer evaluates the full rubric but brings a different lens. The final arbitration layer then synthesizes their outputs into one decision.",
      },
      {
        type: "paragraph",
        content:
          "Getting AI models to return consistent structured outputs was another challenge. Since the platform depends on reviewer outputs being machine-readable, we used strict schemas, JSON validation, response normalization, and error handling to reduce failures from malformed model responses.",
      },
      {
        type: "paragraph",
        content:
          "Supporting multiple input types without creating multiple disconnected evaluation systems required a shared internal system case format. Each intake path has its own preprocessing logic, but the reviewer and reporting layers remain consistent.",
      },
      {
        type: "paragraph",
        content:
          "GitHub repository assessment created another challenge: extracting useful implementation evidence without relying on an LLM to inspect an entire codebase. The solution was deterministic repository scanning — the system prioritizes relevant files, identifies framework and dependency signals, detects possible model backends, surfaces upload or file-processing surfaces, and extracts security or logging clues.",
      },
      {
        type: "paragraph",
        content:
          "Runtime endpoint assessment was the most constrained area. The current version works for JSON APIs and simple public HTML forms, but not for complex hosted chat applications or JavaScript-heavy tools. During testing, hosted chat apps often return the web page shell instead of actual conversational behavior. The short-term solution was clearer unsupported-target detection. The long-term solution is a browser-based hosted chat runner that can interact with a real chat interface using an isolated local session.",
      },
      {
        type: "paragraph",
        content:
          "Provider reliability across multiple AI providers also required attention. The system uses different providers for different reviewer roles, which improves diversity of judgment but introduces API timeout, retry, and SDK compatibility risks. These were addressed with provider-specific clients, timeout and retry configuration, and SDK modernization.",
      },

      // ── Current State ──────────────────────────────────────
      { type: "heading", content: "Current State" },
      {
        type: "paragraph",
        content:
          "The project is currently strongest as a structured AI safety assessment and decision-support platform.",
      },
      {
        type: "media",
        src: "/images/image.png",
        alt: "UNICC AI Safety Lab interface — evaluation panel on the left, instructions and input tabs on the right",
        caption: "UNICC AI Safety Lab — live prototype",
      },
      {
        type: "paragraph",
        content: "<strong>Fully working today:</strong>",
      },
      {
        type: "list",
        content: [
          "Multi-input assessment workflow — JSON upload, GitHub repo, endpoint URL, and internal generated cases.",
          "Shared system case normalization across all input types.",
          "Three holistic AI reviewer outputs.",
          "Final arbitration layer.",
          "Eight-category risk rubric with score, confidence, rationale, risks, and mitigation outputs.",
          "Control assessment layer.",
          "Framework-aligned reporting.",
          "PDF report generation.",
          "Per-run traceable artifacts.",
          "Automated test suite.",
          "Open-source readiness documentation.",
        ],
      },
      {
        type: "pdf",
        src: "/pdfs/un-ai-safety-report.pdf",
        label: "Sample Assessment Report",
      },
      {
        type: "paragraph",
        content: "<strong>Partially complete:</strong>",
      },
      {
        type: "list",
        content: [
          "Runtime endpoint assessment works for simple APIs and forms, but not complex hosted chat apps.",
          "Confidence is currently reviewer-provided and normalized, not fully derived from evidence quality and reviewer agreement.",
          "Control assessment exists, but more detailed evidence-to-control trace tables would strengthen it.",
          "Open-source readiness materials exist, but official ownership, security contacts, and release governance still need final confirmation.",
        ],
      },

      // ── Roadmap ────────────────────────────────────────────
      { type: "heading", content: "Roadmap" },
      {
        type: "paragraph",
        content:
          "The roadmap is framed as compliance-readiness, not legal advice or a claim of compliance. Priority areas include GDPR alignment (data inventory, retention controls, deletion workflows, DPIA-style documentation), UN data governance principles (proportionality, confidentiality, accountability), EU AI Act themes (risk management, human oversight, technical documentation, logging, robustness), and alignment with NIST AI RMF and ISO/IEC 42001.",
      },
      {
        type: "paragraph",
        content:
          "Security priorities include formal release gates, dependency scanning, secret scanning, static analysis, SBOM generation, and LLM-specific risk mapping aligned to the OWASP Top 10 for LLM Applications — covering prompt injection, sensitive information disclosure, insecure output handling, excessive agency, and overreliance.",
      },
      {
        type: "paragraph",
        content:
          "For production deployment, the project would require authentication, role-based access control, audit logs, encrypted storage, retention and deletion jobs, production secrets management, monitoring, and a deployment threat model.",
      },
      {
        type: "paragraph",
        content:
          "The largest technical roadmap item is a robust endpoint assessment orchestrator with target discovery, runtime routing, safe session setup, adaptive probe orchestration, browser-based hosted chat assessment, multi-turn runtime testing, structured evidence capture, risk signal synthesis, and evidence-to-control traceability.",
      },

      // ── Summary ──────────────────────────────────
      { type: "heading", content: "Summary" },
      {
        type: "paragraph",
        content:
          "UNICC AI Safety Lab turns AI safety review into an operational workflow: multimodal evidence intake, schema-based normalization, multi-model expert review, explicit arbitration, traceable artifacts, and framework-aligned reporting. The project is strongest today as a decision-support and assessment platform; its north star is to evolve the intake layer into a more adaptive, browser-capable, compliance-ready evidence engine while preserving the same structured reviewer architecture.",
      },
    ],

    prev: { id: "bettercampus-analytics", title: "BetterCampus Analytics" },
    next: { id: "nyu-marketplace", title: "Apparel Rental Marketplace" },
  },

  "subastas-ventura": {
    id: "subastas-ventura",
    category: { title: "Technology Consultant", hasDivider: false },
    title: "Car Crane Drivers' Software Ecosystem",
    company: "Subastas Ventura",
    role: "Innovation Analyst / UX Designer",
    dateStart: "Dec 2021",
    dateEnd: "Aug 2022",
    tags: ["UX/UI", "Product Design", "Strategic Project"],

    body: [
      {
        type: "statement",
        content:
          "Car crane drivers are the physical link in vehicle auctions across Mexico — 35% of operations, 60,000 deliveries a month, and no reliable way to track any of it.",
      },

      // ── Context ──────────────────────────────────────────────
      { type: "heading", content: "Context" },
      {
        type: "paragraph",
        content:
          "Subastas Ventura runs digital vehicle auctions for insurance companies across Mexico. Car crane drivers are the physical link in that chain — they pick up auctioned vehicles and deliver them to auction yards nationwide, representing 35% of the company's operations and roughly 60,000 car deliveries a month.",
      },

      // ── Problem ───────────────────────────────────────────────
      { type: "heading", content: "Problem" },
      {
        type: "paragraph",
        content:
          "Commute time was untrackable and routes were untraceable. Several steps in the handoff between crane suppliers, drivers, and yard staff were still manual, which compounded delays across every trip.",
      },

      // ── Objectives ────────────────────────────────────────────
      { type: "heading", content: "Objectives" },
      {
        type: "list",
        content: [
          "Plan and deploy a solution to live-track car crane drivers",
          "Give stakeholders — insurers, suppliers, yard staff — transparency into the status of every unit",
          "Automate manual steps and fold them into the tracked flow",
          "Send confirmation the moment a service is completed",
        ],
      },

      // ── Key considerations ─────────────────────────────────────
      { type: "heading", content: "Key Considerations" },
      {
        type: "list",
        content: [
          "Some cranes carry up to 5 vehicles at once",
          "Signal drops out on stretches of several highways",
          "Drivers need to check in at multiple points along the route, not just at the start and end",
        ],
      },

      // ── Product strategy & mapping ─────────────────────────────
      { type: "heading", content: "Product Strategy & Mapping the Ecosystem" },
      {
        type: "process-flow",
        steps: [
          { label: "Research & Information Architecture", color: "#1535b8" },
          { label: "Ideation", color: "#2a4de0" },
          { label: "Compliance Management", color: "#6b84e8" },
          { label: "Prototype", color: "#9fb0f0" },
          { label: "Handoff to Dev", color: "#c5d0f5", textColor: "#1a3aad" },
        ],
      },
      {
        type: "paragraph",
        content:
          "The process started with research, direct interviews with crane drivers, supplier sessions, and yard staff observations, to map the current state and identify every point where the process broke down. The service blueprint below is the designed future state: a connected ecosystem of apps that replaces manual handoffs with tracked, automated flows from pickup to final delivery.",
      },
      {
        type: "embed",
        src: "/blueprints/subastas-ventura-blueprint.html",
        label: "Service Blueprint — Subastas Ventura",
      },

      // ── From Tour to App ──────────────────────────────────────
      { type: "heading", content: "From Tour to App" },
      {
        type: "paragraph",
        content:
          "The driver app's onboarding wasn't designed in isolation — it was built with the real workflow in mind. The six-screen sequence below moves a new driver from login to live data in under a minute.",
      },
      {
        type: "embed",
        src: "/blueprints/onboarding-prototype.html",
        label: "Crane Driver App — Onboarding",
      },

      // ── Supplier Web App ───────────────────────────────────────
      { type: "heading", content: "Supplier Web App" },
      {
        type: "paragraph",
        content:
          "The crane supplier's side of the ecosystem — a web dashboard that lets dispatch teams receive work orders from Ventura, assign operators and cranes, and track each service in real time.",
      },
      {
        type: "embed",
        src: "/blueprints/supplier-web-gallery.html",
        label: "Supplier Web App — Screen Gallery",
      },

      // ── Solution ──────────────────────────────────────────────
      { type: "heading", content: "Solution" },
      {
        type: "paragraph",
        content:
          "Three web apps and two mobile apps, connected through a shared database via API:",
      },
      {
        type: "list",
        content: [
          "Crane suppliers manage and dispatch services to individual drivers",
          "Insurance companies get scoped logins to track only their own units",
          "View permissions are role-based, in line with NDA and security requirements across all parties",
        ],
      },

      // ── My Role ───────────────────────────────────────────────
      { type: "heading", content: "My Role" },
      {
        type: "paragraph",
        content:
          "I owned product strategy end to end and led UX for the ecosystem, while a third-party vendor handled development.",
      },
      {
        type: "list",
        content: [
          "Defined the product strategy: what an ecosystem of connected apps needed to look like to actually solve the tracking and traceability problem, not just patch around it",
          "Conducted interviews with car crane drivers directly, along with other internal and external subject-matter experts, to ground the design in how the work actually happens on the road",
          "Mapped the end-to-end process and flows, and used those to define SLAs and write user stories",
          "Turned research into data-visualization dashboards and presented findings and recommendations to managers and C-level leads",
          "Designed the ecosystem from low-fidelity wireframes through to hi-fidelity screens for each epic, using Figma for design and Miro for flows, journey mapping, and service blueprinting",
          "Led UX design and ownership across the three-app system, working directly with the vendor's developers to hand off detailed specs and keep implementation aligned with the intended experience",
        ],
      },

      // ── Deliverables ──────────────────────────────────────────
      { type: "heading", content: "Deliverables" },
      {
        type: "list",
        content: [
          "Product strategy",
          "UX leadership",
          "Systems architecture",
          "User research & interviews",
          "Service blueprints",
          "Hi-fidelity screens",
          "Developer handoff specs",
        ],
      },
    ],

    links: [],
    prev: { id: "elipsis-fintech", title: "Elipsis (Mercado Libre ecosystem)" },
    next: { id: "sai-design", title: "Sai Design & Image Consulting" },
  },

  "vous-perfume": {
    id: "vous-perfume",
    category: { title: "Product Design", hasDivider: false },
    title: "Vous",
    company: "Raquel Farías",
    role: "Perfume Designer",
    dateStart: "2019",
    dateEnd: "2019",
    tags: ["Packaging Design", "Product Design", "Luxury Retail"],

    body: [
      // ── Concept statement ───────────────────────────────────
      {
        type: "paragraph",
        content:
          "This perfume was inspired by the geometry of a sphere framed in a wooden square — showing the simplest of forms but composing a geometrical harmony between its parts. The frame was conceived made of wood because I wanted to represent the scent of the perfume through the texture of its parts; embracing natural materials allows a bigger connection with nature and empowers the scent of it.",
      },

      // ── Hero image ──────────────────────────────────────────
      {
        type: "media",
        src: "/images/vous-hero.png",
        alt: "Vous perfume bottle — macro shot on wet stone with golden light",
        caption: "Vous — Eau de Parfum",
      },

      // ── The Bottle ──────────────────────────────────────────
      { type: "heading", content: "The Bottle" },
      {
        type: "paragraph",
        content:
          "A soda-lime glass sphere framed in a square wooden structure. The frame isn't purely decorative — it acts as structural support and as a visible texture of the scent: the wood communicates warmth and naturalness before the user even perceives the fragrance.",
      },
      {
        type: "list",
        content: [
          "Material: soda-lime glass",
          "Cap: wood, AE15 neck type",
          "Liquid color: Pantone 13-1125 TCX",
          "Volume: 100 ml / 3.4 FL.OZ",
          "Manufacturing: automatic blow-and-blow process",
        ],
      },

      // ── The Set image ───────────────────────────────────────
      {
        type: "media",
        src: "/images/vous-set.png",
        alt: "Vous bottle and case together on wet stone pedestals",
        caption: "Vous — The Set",
      },

      // ── Bottle technical drawing ────────────────────────────
      {
        type: "media",
        src: "/images/vous-general.jpg",
        alt: "Technical drawing of the Vous perfume bottle — dimensions and views",
        caption: "Bottle — Technical Drawing",
        maxHeight: "420px",
      },

      // ── The Case ────────────────────────────────────────────
      { type: "heading", content: "The Case" },
      {
        type: "paragraph",
        content:
          "Cylindrical telescope paper tube, three pieces, with a black ribbon carrying handle. A dusty pink finish with a red rose motif creates contrast between the warmth of the bottle's wood and the graphic quality of the packaging.",
      },
      {
        type: "list",
        content: [
          "Material: painted illustration paper — acrylic paint blended in red, orange, and vanilla to reach the final tone",
          "Handle: black ribbon",
          "Surface finish: stamped / Spot UV in production version",
          "Print: 4-color offset",
        ],
      },

      // ── Case drawing ────────────────────────────────────────
      {
        type: "media",
        src: "/images/vous-case-layout.jpg",
        alt: "Technical layout drawing of the Vous case",
        caption: "Case — Technical Drawing",
        maxHeight: "420px",
      },

      // ── Scent Profile ───────────────────────────────────────
      { type: "heading", content: "Scent Profile" },
      {
        type: "paragraph",
        content: "Eau de Parfum — Floral",
      },
      {
        type: "list",
        content: [
          "<strong>Top notes</strong> — magnolia, green apple, mandarin",
          "<strong>Heart notes</strong> — white currant, jasmine petals, peony",
          "<strong>Base notes</strong> — musk, sandalwood, amber wood",
        ],
      },

      // ── Closing / reveal image ──────────────────────────────
      {
        type: "media",
        src: "/images/vous-reveal.png",
        alt: "Open Vous case with lid floating, bottle visible, arched window in background",
        caption: "Vous — The Ritual",
      },

      // ── Behind the Design ───────────────────────────────────
      { type: "heading", content: "Behind the Design" },
      {
        type: "paragraph",
        content:
          "The secondary packaging was designed to withstand distribution while communicating the same material sensibility as the product itself. A single-wall corrugated kraft box handles retail and transit requirements.",
      },
      {
        type: "list",
        content: [
          "Outer box: corrugated cardboard, single-wall double-face, 3 mm, kraft — 47.5 × 38 × 12 cm",
          "Sales unit: 1 unit (80 / 100 ml)",
          "12 cases per outer box",
          "Pallet: 6 boxes per layer, 2 layers — 117 × 95 × 15 cm",
        ],
      },
      {
        type: "media",
        src: "/images/vous-box-layout.jpg",
        alt: "Box layout drawing",
        caption: "Box — Technical Drawing",
        maxHeight: "380px",
      },
      {
        type: "media",
        src: "/images/vous-stacking.jpg",
        alt: "Pallet stacking diagram",
        caption: "Stacking Diagram",
        maxHeight: "360px",
      },

      // ── Alternative Designs ─────────────────────────────────
      { type: "heading", content: "Alternative Designs" },
      {
        type: "gallery",
        images: [
          {
            src: "/images/vous_minimalistic_rose.png",
            alt: "Vous — Minimalistic Rose edition",
            caption: "Minimalistic Rose",
          },
          {
            src: "/images/vous_minimalistic_crystal_clear.png",
            alt: "Vous — Crystal Clear edition",
            caption: "Crystal Clear",
          },
          {
            src: "/images/vous_minimalistic.png",
            alt: "Vous — Minimalistic edition",
            caption: "Minimalistic",
          },
        ],
      },
    ],

    links: [],
    prev: { id: "sai-design", title: "Sai Design & Image Consulting" },
    next: null,
  },
};
