import { describe, it, expect } from "vitest";
import {
  searchKnowledgeBase,
  getFrameworksForIndustry,
  getFrameworkById,
  getGlossaryTerm,
  getGlossaryByStakeholder,
  quickAnswers,
} from "@/lib/knowledge-base";

// searchKnowledgeBase

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
    for (const result of results) {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("summary");
      expect(result).toHaveProperty("score");
      expect(result.score).toBeGreaterThan(0);
    }
  });

  it("returns relevant type for glossary query", () => {
    const results = searchKnowledgeBase("least privilege");
    const types = results.map((result) => result.type);
    expect(types).toContain("glossary");
  });

  it("returns relevant type for framework query", () => {
    const results = searchKnowledgeBase("ISO 27001");
    const types = results.map((result) => result.type);
    expect(types.some((type) => type === "framework" || type === "control")).toBe(true);
  });

  it("returns quick answer type for compliance query", () => {
    const results = searchKnowledgeBase("SOC 2 audit vendor");
    const types = results.map((result) => result.type);
    expect(types).toContain("quickanswer");
  });
});

describe("getFrameworksForIndustry", () => {
  it("returns FI frameworks for Financial Institution", () => {
    const packs = getFrameworksForIndustry("FI");
    expect(packs.length).toBeGreaterThan(0);
    const ids = packs.map((pack) => pack.id);
    expect(ids).toContain("mas-trm");
    expect(ids).toContain("pdpa");
  });

  it("returns GovTech frameworks for GovTech", () => {
    const packs = getFrameworksForIndustry("GovTech");
    expect(packs.length).toBeGreaterThan(0);
    const ids = packs.map((pack) => pack.id);
    expect(ids).toContain("pdpa");
  });

  it("falls back to Generic for unknown industry", () => {
    const generic = getFrameworksForIndustry("Generic");
    const unknown = getFrameworksForIndustry("UnknownSector");
    expect(unknown.map((pack) => pack.id)).toEqual(generic.map((pack) => pack.id));
  });

  it("returns non-empty array for all known industries", () => {
    const industries = ["Financial Institution", "GovTech", "Generic", "Education", "Real Estate"];
    for (const industry of industries) {
      expect(getFrameworksForIndustry(industry).length).toBeGreaterThan(0);
    }
  });
});

describe("framework lookups", () => {
  it("finds framework by id", () => {
    const framework = getFrameworkById("mas-trm");
    expect(framework?.id).toBe("mas-trm");
  });

  it("returns undefined for unknown framework id", () => {
    expect(getFrameworkById("unknown-framework")).toBeUndefined();
  });
});

describe("glossary lookups", () => {
  it("finds glossary term by id", () => {
    const term = getGlossaryTerm("g-least-privilege");
    expect(term?.id).toBe("g-least-privilege");
  });

  it("returns undefined for unknown glossary id", () => {
    expect(getGlossaryTerm("unknown-term")).toBeUndefined();
  });

  it("filters glossary by stakeholder", () => {
    const terms = getGlossaryByStakeholder("business-owner");
    expect(terms.length).toBeGreaterThan(0);
  });
});

describe("quickAnswers", () => {
  it("contains quick answers for live briefing scenarios", () => {
    expect(quickAnswers.length).toBeGreaterThan(0);
  });
});

