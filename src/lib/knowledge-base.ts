export interface KnowledgeItem {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  route: string;
}

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "k-intake",
    title: "Capture Engagement Requirement",
    tags: ["intake", "rfp", "rfq", "business objective"],
    summary: "Record engagement type, industry, objectives, constraints, and timeline.",
    route: "/intake",
  },
  {
    id: "k-scope",
    title: "Define Assessment Scope",
    tags: ["scope", "systems", "environments", "roles"],
    summary: "Define in-scope and out-of-scope systems, roles, and trust boundaries.",
    route: "/scope",
  },
  {
    id: "k-inputs",
    title: "Identify Data and Integration Inputs",
    tags: ["data classification", "integration", "api", "third party"],
    summary: "Classify data and integration paths before mapping controls.",
    route: "/inputs",
  },
  {
    id: "k-controls",
    title: "Map Requirements to Framework Controls",
    tags: ["mas trm", "iso 27001", "pdpa", "soc 2", "nist", "cis"],
    summary: "Map each requirement to one or more framework controls.",
    route: "/control-mapping",
  },
  {
    id: "k-risk",
    title: "Risk and Exception Advisory",
    tags: ["risk", "exception", "severity", "residual risk"],
    summary: "Track risk severity, owner, status, and exception metadata.",
    route: "/risk-exceptions",
  },
  {
    id: "k-evidence",
    title: "Audit Readiness Evidence",
    tags: ["audit", "traceability", "evidence", "closure"],
    summary: "Track requirement-control-test-evidence linkage for audits.",
    route: "/audit-evidence",
  },
  {
    id: "k-ai",
    title: "AI Governance Controls",
    tags: ["ai", "bias", "video retention", "pdpa", "sso"],
    summary: "Evaluate explainability, fairness, retention, and access controls.",
    route: "/ai-governance",
  },
];

export interface QuickAnswer {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export const quickAnswers: QuickAnswer[] = [
  {
    id: "qa-mas-trm",
    question: "What should I answer when asked about MAS TRM readiness?",
    answer:
      "State governance, third-party risk management, secure SDLC, authenticated testing, and evidential logging with mapped controls and named owners.",
    tags: ["mas trm", "fi", "compliance"],
  },
  {
    id: "qa-pdpa",
    question: "What is the minimum PDPA response for new features?",
    answer:
      "Confirm data classification, purpose limitation, retention and disposal policy, access control, and cross-border transfer safeguards where applicable.",
    tags: ["pdpa", "privacy", "data handling"],
  },
  {
    id: "qa-risk",
    question: "How do I explain risk exceptions to management?",
    answer:
      "Summarize severity, business impact, compensating control, owner, expiry date, and decision required: block go-live or accept residual risk.",
    tags: ["risk", "exception", "management"],
  },
  {
    id: "qa-ai",
    question: "What should be checked first for AI interview scoring?",
    answer:
      "Check transparency of scoring logic, bias thresholds, fallback rules for low confidence, and retention/disposal of video and feedback artifacts.",
    tags: ["ai", "bias", "governance"],
  },
];
