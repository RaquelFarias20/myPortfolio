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
      {
        type: "heading",
        content: "Introduction / Purpose",
      },
      {
        type: "paragraph",
        content:
          "UNICC AI Safety Lab is a courtroom-style AI safety assessment platform built for the United Nations International Computing Centre capstone context. Its purpose is to help reviewers evaluate whether an AI system is safe, trustworthy, auditable, and deployment-ready across several evidence sources.",
      },
      {
        type: "paragraph",
        content:
          'The original brief was to create a system that could evaluate AI behavior and assign safety/risk judgments aligned with governance expectations. We approached that by building a structured assessment workflow rather than a one-off "verdict generator" — one that accepts different types of evidence, normalizes them into one internal case format, runs specialized AI reviewers, arbitrates their disagreement, and generates traceable artifacts plus a report.',
      },
      {
        type: "paragraph",
        content:
          "The core problem it solves: <strong>AI safety assessments are often opaque, inconsistent, and hard to operationalize.</strong> This project turns assessment into a repeatable pipeline with evidence intake, schema validation, expert review, final arbitration, framework alignment, and report generation.",
      },

      {
        type: "heading",
        content: "What I Built",
      },
      {
        type: "paragraph",
        content:
          "The architecture is schema-first. Every input path becomes a shared SystemCase object, and the pipeline evaluates that case through three specialized judges and one final arbiter. The main flow: evidence source → intake adapter → SystemCase → Judge 1 / Judge 2 / Judge 3 → Ultimate Judge → JSON artifacts → PDF report → UI.",
      },
      {
        type: "media",
        content: "System flow diagram",
      },
      {
        type: "paragraph",
        content:
          "Evidence can arrive as a JSON case file, a public GitHub repository, or a live app/endpoint URL. GitHub ingestion deterministically prioritizes key files and extracts explainable signals; runtime probing sends safe, limited text probes to JSON APIs and simple forms. Each reviewer applies a specialized lens, and the Ultimate Judge receives only the three judge outputs to produce one structured final decision — persisted alongside a per-run artifact trail.",
      },

      {
        type: "heading",
        content: "Tools, Techniques & Approaches Used",
      },
      {
        type: "paragraph",
        content:
          "The most important decision was separating evidence intake from evaluation, so GitHub, endpoint, JSON, and generated cases all converge into the same SystemCase and the reviewer pipeline stays consistent. Key techniques included schema-first design with validation, an adapter pattern for intake, a provider abstraction across model vendors, a multi-reviewer architecture, and an arbitration layer that resolves structured disagreement rather than averaging scores.",
      },
      {
        type: "list",
        content: [
          "Judge 1 — compliance lens (conservative)",
          "Judge 2 — security lens (adversarial)",
          "Judge 3 — user impact & fairness lens",
          "Ultimate Judge — final arbiter over the three outputs",
        ],
      },
      {
        type: "paragraph",
        content:
          "Models produce structured JSON validated against strict schemas, with normalization helpers to recover imperfect outputs, and artifact-first traceability through per-run files and a PDF report.",
      },

      {
        type: "heading",
        content: "Challenges & Solutions",
      },
      {
        type: "paragraph",
        content:
          "A major challenge was making multiple LLMs return reliable structured outputs; the solution was a strict schema layer, JSON extraction, normalization, and validation. Another was avoiding a single opaque verdict — solved by the courtroom-style panel of specialized reviewers plus a final arbiter.",
      },
      {
        type: "paragraph",
        content:
          "Runtime endpoint assessment created the biggest scope challenge: hosted chat apps often returned HTML shell content instead of real behavior. We identified that as an intake-layer limitation, added clearer unsupported-target detection, and defined a north-star browser-based runner as the path forward.",
      },

      {
        type: "heading",
        content: "Current State",
      },
      {
        type: "paragraph",
        content:
          "Fully working today: a UI with four input modes, JSON case upload, public GitHub ingestion, runtime probing for simple APIs and forms, three specialized reviewer outputs, Ultimate Judge arbitration, an eight-category rubric, PDF report generation, a per-run artifact trail, and framework-alignment views. Partially done: richer confidence derivation, deeper control-to-evidence tracing, and complex hosted-chat probing remain in progress.",
      },

      {
        type: "heading",
        content: "Roadmap",
      },
      {
        type: "paragraph",
        content:
          "The roadmap is framed as compliance-readiness, not a claim of compliance. It maps toward GDPR and UN data-governance principles, EU AI Act themes, accessibility standards, and AI risk-management frameworks such as NIST AI RMF and ISO/IEC 42001 — alongside security hardening and a more adaptive, browser-capable intake layer.",
      },

      {
        type: "heading",
        content: "Case Study Thesis",
      },
      {
        type: "paragraph",
        content:
          "UNICC AI Safety Lab turns AI safety review into an operational workflow: multimodal evidence intake, schema-based normalization, multi-model expert review, explicit arbitration, traceable artifacts, and framework-aligned reporting. It is strongest today as a decision-support and assessment platform; its north star is to evolve the intake layer into a more adaptive, compliance-ready evidence engine while preserving the same structured reviewer architecture.",
      },
    ],

    links: [
      { label: "View Prototype", href: "#", primary: true },
      { label: "Read Case Study", href: "#", primary: false },
    ],

    prev: { id: "bettercampus-analytics", title: "BetterCampus Analytics" },
    next: { id: "nyu-marketplace", title: "Apparel Rental Marketplace" },
  },
};
