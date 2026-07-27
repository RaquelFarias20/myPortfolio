export const projectDetails = {
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
      { type: "video" },

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
    ],

    links: [],
    prev: { id: "sai-design", title: "Sai Design & Image Consulting" },
    next: null,
  },
};
