import { describe, it, expect } from "vitest";
import {
  searchKnowledgeBase,
  getFrameworksForIndustry,
  getFrameworkById,
  getGlossaryTerm,
  getGlossaryByStakeholder,
  quickAnswers,
  stories,
  frameworkPacks,
  glossaryTerms,
} from "@/lib/knowledge-base";

// ── searchKnowledgeBase ──────────────────────────────────────────────────────

describe("searchKnowledgeBase", () => {
  it("returns empty for blank query", () => {
    expect(searchKnowledgeBase("")).toHaveLength(0);
  });

  it("returns empty for single-character query", () => {
    expect(searchKnowledgeBase("m")).toHaveLength(0);
  });

  it("returns results for MAS TRM", () => {
    const results = searchKnowledgeBase("MAS TRM");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results for PDPA", () => {
    const results = searchKnowledgeBase("PDPA");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results for audit logging", () => {
    const results = searchKnowledgeBase("audit logging");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results for zero trust", () => {
    const results = searchKnowledgeBase("zero trust");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results for VAPT", () => {
    const results = searchKnowledgeBase("VAPT");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results sorted by score descending", () => {
    const results = searchKnowledgeBase("PDPA privacy");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("returns no more than 30 results", () => {
    const results = searchKnowledgeBase("security");
    expect(results.length).toBeLessThanOrEqual(30);
  });

  it("each result has required fields", () => {
    const results = searchKnowledgeBase("risk");
    for (const r of results) {
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("type");
      expect(r).toHaveProperty("title");
      expect(r).toHaveProperty("summary");
      expect(r).toHaveProperty("score");
      expect(r.score).toBeGreaterThan(0);
    }
  });

  it("returns relevant type for glossary query", () => {
    const results = searchKnowledgeBase("least privilege");
    const types = results.map((r) => r.type);
    expect(types).toContain("glossary");
  });

  it("returns relevant type for framework query", () => {
    const results = searchKnowledgeBase("ISO 27001");
    const types = results.map((r) => r.type);
    expect(types.some((t) => t === "framework" || t === "control")).toBe(true);
  });

  it("returns quick answer type for compliance query", () => {
    const results = searchKnowledgeBase("SOC 2 audit vendor");
    const types = results.map((r) => r.type);
    expect(types).toContain("quickanswer");
  });
});

// ── getFrameworksForIndustry ─────────────────────────────────────────────────

describe("getFrameworksForIndustry", () => {
  it("returns FI frameworks for Financial Institution", () => {
    const packs = getFrameworksForIndustry("FI");
    expect(packs.length).toBeGreaterThan(0);
    const ids = packs.map((p) => p.id);
    expect(ids).toContain("mas-trm");
    expect(ids).toContain("pdpa");
  });

  it("returns GovTech frameworks for GovTech", () => {
    const packs = getFrameworksForIndustry("GovTech");
    expect(packs.length).toBeGreaterThan(0);
    const ids = packs.map((p) => p.id);
    expect(ids).toContain("pdpa");
  });

  it("falls back to Generic for unknown industry", () => {
    const generic = getFrameworksForIndustry("Generic");
    const unknown = getFrameworksForIndustry("UnknownSector");
    expect(unknown.map((p) => p.id)).toEqual(generic.map((p) => p.id));
  });

  it("returns non-empty array for all known industries", () => {
    const industries = ["Financial Institution", "GovTech", "Generic", "Education", "Real Estate"];
    for (const ind of industries) {
      expect(getFrameworksForIndustry(ind).length).toBeGreaterThan(0);
    }
  });
});

// ── getFrameworkById ─────────────────────────────────────────────────────────

describe("getFrameworkById", () => {
  it("returns mas-trm pack", () => {
    const pack = getFrameworkById("mas-trm");
    expect(pack).toBeDefined();
    expect(pack!.shortName).toBe("MAS TRM");
  });

  it("returns iso27001 pack", () => {
    const pack = getFrameworkById("iso27001");
    expect(pack).toBeDefined();
  });

  it("returns undefined for unknown id", () => {
    expect(getFrameworkById("not-a-framework")).toBeUndefined();
  });
});

// ── getGlossaryTerm ──────────────────────────────────────────────────────────

describe("getGlossaryTerm", () => {
  it("returns least-privilege term", () => {
    const term = getGlossaryTerm("g-least-privilege");
    expect(term).toBeDefined();
    expect(term!.term).toBe("Least Privilege");
  });

  it("returns zero-trust term", () => {
    const term = getGlossaryTerm("g-zero-trust");
    expect(term).toBeDefined();
  });

  it("returns undefined for unknown id", () => {
    expect(getGlossaryTerm("not-a-term")).toBeUndefined();
  });
});

// ── getGlossaryByStakeholder ─────────────────────────────────────────────────

describe("getGlossaryByStakeholder", () => {
  it("returns terms for engineering stakeholder", () => {
    const terms = getGlossaryByStakeholder("engineering");
    expect(terms.length).toBeGreaterThan(0);
  });

  it("returns terms for senior-management stakeholder", () => {
    const terms = getGlossaryByStakeholder("senior-management");
    expect(terms.length).toBeGreaterThan(0);
  });

  it("returns empty for unknown stakeholder", () => {
    const terms = getGlossaryByStakeholder("unknown-role-xyz");
    expect(terms).toHaveLength(0);
  });
});

// ── quickAnswers fixture ─────────────────────────────────────────────────────

describe("quickAnswers", () => {
  it("has at least 8 entries", () => {
    expect(quickAnswers.length).toBeGreaterThanOrEqual(8);
  });

  it("each entry has question, answer, tags, and id", () => {
    for (const qa of quickAnswers) {
      expect(qa.id).toBeTruthy();
      expect(qa.question.length).toBeGreaterThan(5);
      expect(qa.answer.length).toBeGreaterThan(10);
      expect(Array.isArray(qa.tags)).toBe(true);
    }
  });

  it("has unique ids", () => {
    const ids = quickAnswers.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});