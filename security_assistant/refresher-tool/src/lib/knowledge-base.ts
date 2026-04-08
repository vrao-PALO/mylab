import { stories, Story } from "./data/stories";
import { frameworkPacks, frameworksByIndustry, FrameworkPack, FrameworkControl } from "./data/frameworks";
import { glossaryTerms, GlossaryTerm } from "./data/glossary";

export type { Story, FrameworkPack, FrameworkControl, GlossaryTerm };
export { stories, frameworkPacks, frameworksByIndustry, glossaryTerms };

// ─── Existing KnowledgeItem structure (kept for backward compatibility) ───────

export interface KnowledgeItem {
  id: string;
  title: string;
  tags: string[];
  summary: string;
  route: string;
}

export const knowledgeItems: KnowledgeItem[] = stories.map((s) => ({
  id: `k-${s.id}`,
  title: s.title,
  tags: s.tags,
  summary: s.goal,
  route: s.route,
}));

// ─── Quick Answers ────────────────────────────────────────────────────────────

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
  {
    id: "qa-vapt",
    question: "When is VAPT mandatory before go-live?",
    answer:
      "VAPT is mandatory for MAS-regulated FI engagements (MAS TRM 14.1), internet-facing applications, and any system handling sensitive personal or financial data. Critical and high findings must be remediated before production deployment.",
    tags: ["vapt", "mas trm", "go-live", "assurance"],
  },
  {
    id: "qa-soc2",
    question: "What does a client asking for SOC 2 Type II actually want?",
    answer:
      "They want independent assurance that your security (CC), availability (A), and confidentiality (C) controls operate effectively over time — typically a 6-12 month period. They are assessing vendor risk before trusting you with their data.",
    tags: ["soc 2", "fi", "vendor risk", "audit"],
  },
  {
    id: "qa-scope",
    question: "What is the most important thing to define early in an engagement?",
    answer:
      "Scope. Define in-scope systems, environments, data, users, and integrations — and explicitly state what is out of scope with rationale. Ambiguous scope leads to missed controls and audit gaps.",
    tags: ["scope", "engagement", "architecture review"],
  },
  {
    id: "qa-third-party",
    question: "How do I assess third-party vendor security risk?",
    answer:
      "Review: contractual security obligations, their most recent VAPT or audit report, data handling practices (especially if they process your client's personal data), incident response SLAs, and their sub-processor controls. For FI engagements, MAS TRM Section 5 applies.",
    tags: ["third party", "vendor risk", "mas trm", "pdpa"],
  },
];

// ─── Unified Search ───────────────────────────────────────────────────────────

export type SearchResultType = "story" | "framework" | "control" | "glossary" | "quickanswer";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  summary: string;
  route?: string;
  tags: string[];
  score: number;
}

function tokenise(text: string): string[] {
  return text.toLowerCase().split(/[\s,./;:()\[\]]+/).filter(Boolean);
}

function scoreMatch(query: string, fields: string[]): number {
  const q = query.toLowerCase().trim();
  const tokens = tokenise(q);
  let score = 0;
  const combined = fields.join(" ").toLowerCase();

  // Exact phrase match
  if (combined.includes(q)) score += 10;

  // Token matches
  for (const token of tokens) {
    if (token.length < 2) continue;
    if (combined.includes(token)) score += 2;
  }

  return score;
}

export function searchKnowledgeBase(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const results: SearchResult[] = [];

  // Search stories
  for (const s of stories) {
    const fields = [s.title, s.goal, s.outcome, ...s.tags, ...s.acceptanceCriteria.map((a) => a.criterion), ...s.notes.map((n) => n.content)];
    const score = scoreMatch(query, fields);
    if (score > 0) {
      results.push({ id: s.id, type: "story", title: s.title, summary: s.goal, route: s.route, tags: s.tags, score });
    }
  }

  // Search framework packs
  for (const fp of frameworkPacks) {
    const fields = [fp.name, fp.shortName, fp.description, ...fp.applicableSectors];
    const score = scoreMatch(query, fields);
    if (score > 0) {
      results.push({ id: fp.id, type: "framework", title: fp.shortName, summary: fp.description, tags: fp.applicableSectors, score });
    }
    // Search individual controls
    for (const ctrl of fp.controls) {
      const ctrlFields = [ctrl.title, ctrl.intent, ctrl.domain, ctrl.clause, ctrl.framework, ...ctrl.sectors];
      const ctrlScore = scoreMatch(query, ctrlFields);
      if (ctrlScore > 0) {
        results.push({ id: ctrl.id, type: "control", title: `${ctrl.framework} ${ctrl.clause} — ${ctrl.title}`, summary: ctrl.intent, tags: ctrl.sectors, score: ctrlScore });
      }
    }
  }

  // Search glossary
  for (const g of glossaryTerms) {
    const fields = [g.term, g.shortDefinition, g.plainEnglish, g.technical, g.businessFraming, ...g.tags];
    const score = scoreMatch(query, fields);
    if (score > 0) {
      results.push({ id: g.id, type: "glossary", title: g.term, summary: g.shortDefinition, tags: g.tags, score });
    }
  }

  // Search quick answers
  for (const qa of quickAnswers) {
    const fields = [qa.question, qa.answer, ...qa.tags];
    const score = scoreMatch(query, fields);
    if (score > 0) {
      results.push({ id: qa.id, type: "quickanswer", title: qa.question, summary: qa.answer, tags: qa.tags, score });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 30);
}

// ─── Framework helpers ────────────────────────────────────────────────────────

export function getFrameworksForIndustry(industry: string): FrameworkPack[] {
  const ids = frameworksByIndustry[industry] ?? frameworksByIndustry["Generic"];
  return frameworkPacks.filter((fp) => ids.includes(fp.id));
}

export function getFrameworkById(id: string): FrameworkPack | undefined {
  return frameworkPacks.find((fp) => fp.id === id);
}

// ─── Glossary helpers ─────────────────────────────────────────────────────────

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return glossaryTerms.find((g) => g.id === id);
}

export function getGlossaryByStakeholder(stakeholder: string): GlossaryTerm[] {
  return glossaryTerms.filter((g) => g.stakeholderTags.includes(stakeholder));
}
