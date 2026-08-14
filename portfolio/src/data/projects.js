export const projects = [
  // ── Analytics | AI ─────────────────────────────────────────────
  {
    id: "bettercampus-analytics",
    category: "analytics-ai",
    role: "Product Analytics Specialist",
    company: "BetterCampus, Inc.",
    description:
      "Led analytics implementation for a 1.8M+ user platform, building SQL- and JavaScript-based tracking to measure user behavior, funnel performance, and growth opportunities, and translating results into executive dashboards and roadmap recommendations.",
    tags: ["Analytics", "Experimentation", "Product Growth"],
    href: "/projects/bettercampus-analytics",
    dateStart: "2026-01",
    dateEnd: "Present",
  },
  {
    id: "un-ai-safety",
    category: "analytics-ai",
    role: "UX Program Lead & AI Platform Engineer",
    company: "United Nations - International Computing Center (ICC)",
    description:
      "Led the winning team designing a zero-to-one AI evaluation platform, translating complex AI-safety workflows into intake flows, review states, and reporting experiences, prototyped with LLM-powered tools and structured JSON/PDF outputs.",
    tags: ["AI", "UX/UI", "Zero-to-One"],
    href: "/projects/un-ai-safety",
    dateStart: "2026-01",
    dateEnd: "2026-05",
  },

  // ── Product Management ──────────────────────────────────────────
  {
    id: "nyu-marketplace",
    category: "product-management",
    role: "Founding Product & Program Manager",
    company: "NYU Startup Program — Innovation Lab",
    description:
      "Led a peer-to-peer apparel-rental marketplace from concept to MVP,  shaping the business opportunity, running customer and competitive research, and designing end-to-end trust, discovery, and transaction flows.",
    tags: ["UX Strategy", "Marketplace", "MVP"],
    href: "/projects/nyu-marketplace",
    dateStart: "2025-06",
    dateEnd: "2025-12",
  },

  // ── UX/UI Projects ─────────────────────────────────────────────
  {
    id: "ex-squared-ux",
    category: "ux-ui",
    role: "Senior User Experience Designer",
    company: "Ex Squared",
    description:
      'Owned end-to-end UX for core features of a Customer Delivery System, from research to high-fidelity prototypes and engineering handoff, and as Product Owner for the "Posts" epic drove a 25-point NPS increase and 40% fewer handoff questions.',
    tags: ["UX/UI", "Product Owner", "Research"],
    href: "/projects/ex-squared-ux",
    dateStart: "2022-09",
    dateEnd: "2024-03",
  },

  // ── Technology Consultant ───────────────────────────────────────
  {
    id: "elipsis-fintech",
    category: "technology-consultant",
    role: "Business Technology Consultant",
    company: "Elipsis (Mercado Libre ecosystem)",
    description:
      "Led UX strategy for a financial-services product within the Mercado Libre digital-wallet ecosystem, translating business, technical, and partner requirements into scalable service experiences.",
    tags: ["UX Strategy", "Fintech", "Service Design"],
    href: "/projects/elipsis-fintech",
    dateStart: "2022-11",
    dateEnd: "2023-05",
  },
  {
    id: "subastas-ventura",
    category: "technology-consultant",
    role: "UX Designer & Innovation Analyst",
    company: "Subastas Ventura",
    description:
      "Led product-improvement initiatives across automotive digital platforms, facilitating cross-functional workshops and strengthening the connection between online discovery and offline operations for an e-commerce business with physical inventory.",
    tags: ["UX/UI", "Product Design", "Strategic Project"],
    href: "/projects/subastas-ventura",
    dateStart: "2021-12",
    dateEnd: "2022-08",
  },

  // ── Product Design ─────────────────────────────────────────────
  {
    id: "sai-design",
    category: "product-design",
    role: "Industrial Designer",
    company: "Sai Design & Image Consulting",
    description:
      "Managed end-to-end retail-store design projects for major technology clients, including Lenovo.",
    tags: ["Industrial Design", "Retail", "Physical"],
    href: "/projects/sai-design",
    dateStart: "2021-06",
    dateEnd: "2021-12",
  },
  {
    id: "vous-perfume",
    category: "product-design",
    role: "Perfume Designer",
    company: "Raquel Farías — Vous",
    description:
      "Designed an original fragrance and packaging concept inspired by the geometry of a sphere framed in a wooden square — a study in geometrical harmony and natural materials that bridges scent, form, and tactile experience.",
    tags: ["Packaging Design", "Product Design", "Luxury Retail"],
    href: "/projects/vous-perfume",
    dateStart: "2019-06",
    dateEnd: "2019-12",
  },
];

const byRecency = (a, b) => {
  const end = (p) =>
    p.dateEnd === "Present" ? Infinity : Date.parse(p.dateEnd + "-01");
  return end(b) - end(a);
};

export function projectsByCategory(categoryId) {
  return projects.filter((p) => p.category === categoryId).sort(byRecency);
}
