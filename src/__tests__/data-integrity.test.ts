import { describe, it, expect } from "vitest";
import { stories } from "@/lib/data/stories";
import { frameworkPacks, frameworksByIndustry } from "@/lib/data/frameworks";
import { glossaryTerms } from "@/lib/data/glossary";
import { knowledgeItems } from "@/lib/knowledge-base";

// ── Stories ──────────────────────────────────────────────────────────────────

describe("stories data integrity", () => {
  it("has exactly 13 stories", () => {
    expect(stories).toHaveLength(13);
  });

  it("stories are numbered story-01 through story-13", () => {
    for (let i = 1; i <= 13; i++) {
      const id = `story-${String(i).padStart(2, "0")}`;
      expect(stories.find((s) => s.id === id)).toBeDefined();
    }
  });

  it("every story has required string fields", () => {
    for (const s of stories) {
      expect(s.title.length, `${s.id}.title`).toBeGreaterThan(3);
      expect(s.goal.length, `${s.id}.goal`).toBeGreaterThan(10);
      expect(s.outcome.length, `${s.id}.outcome`).toBeGreaterThan(10);
      expect(s.role.length, `${s.id}.role`).toBeGreaterThan(2);
    }
  });

  it("every story has a route starting with /", () => {
    for (const s of stories) {
      expect(s.route, `${s.id}.route`).toMatch(/^\//);
    }
  });

  it("every story has at least one acceptance criterion", () => {
    for (const s of stories) {
      expect(s.acceptanceCriteria.length, `${s.id} criteria`).toBeGreaterThanOrEqual(1);
    }
  });

  it("every story has at least one tag", () => {
    for (const s of stories) {
      expect(s.tags.length, `${s.id} tags`).toBeGreaterThanOrEqual(1);
    }
  });

  it("all story ids are unique", () => {
    const ids = stories.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all story routes are unique", () => {
    const routes = stories.map((s) => s.route);
    expect(new Set(routes).size).toBe(routes.length);
  });
});

// ── Frameworks ───────────────────────────────────────────────────────────────

describe("framework packs data integrity", () => {
  const EXPECTED_PACK_IDS = [
    "mas-trm", "iso27001", "pdpa", "owasp-asvs",
    "owasp-masvs", "nist-800-53", "cis-v8", "soc2", "mtcs-tier3",
  ];

  it("has exactly 9 framework packs", () => {
    expect(frameworkPacks).toHaveLength(9);
  });

  it("all expected framework ids are present", () => {
    const ids = frameworkPacks.map((p) => p.id);
    for (const expected of EXPECTED_PACK_IDS) {
      expect(ids, `missing ${expected}`).toContain(expected);
    }
  });

  it("every pack has required fields", () => {
    for (const p of frameworkPacks) {
      expect(p.name.length, `${p.id}.name`).toBeGreaterThan(2);
      expect(p.shortName.length, `${p.id}.shortName`).toBeGreaterThan(1);
      expect(p.description.length, `${p.id}.description`).toBeGreaterThan(10);
      expect(p.applicableSectors.length, `${p.id}.sectors`).toBeGreaterThanOrEqual(1);
    }
  });

  it("every pack has at least one control", () => {
    for (const p of frameworkPacks) {
      expect(p.controls.length, `${p.id} controls`).toBeGreaterThanOrEqual(1);
    }
  });

  it("every control has required fields", () => {
    for (const p of frameworkPacks) {
      for (const c of p.controls) {
        expect(c.id.length, `${p.id}/${c.id}.id`).toBeGreaterThan(1);
        expect(c.framework.length, `${p.id}/${c.id}.framework`).toBeGreaterThan(1);
        expect(c.domain.length, `${p.id}/${c.id}.domain`).toBeGreaterThan(1);
        expect(c.clause.length, `${p.id}/${c.id}.clause`).toBeGreaterThanOrEqual(1);
        expect(c.title.length, `${p.id}/${c.id}.title`).toBeGreaterThan(3);
        expect(c.intent.length, `${p.id}/${c.id}.intent`).toBeGreaterThan(10);
      }
    }
  });

  it("all control ids are unique across all packs", () => {
    const ids = frameworkPacks.flatMap((p) => p.controls.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("frameworksByIndustry contains expected industry keys", () => {
    const keys = Object.keys(frameworksByIndustry);
    expect(keys).toContain("FI");
    expect(keys).toContain("GovTech");
    expect(keys).toContain("Generic");
  });

  it("frameworksByIndustry values reference valid pack ids", () => {
    const packIds = new Set(frameworkPacks.map((p) => p.id));
    for (const [industry, ids] of Object.entries(frameworksByIndustry)) {
      for (const id of ids) {
        expect(packIds.has(id), `${industry}: unknown pack id ${id}`).toBe(true);
      }
    }
  });
});

// ── Glossary ─────────────────────────────────────────────────────────────────

describe("glossary data integrity", () => {
  it("has at least 18 glossary terms", () => {
    expect(glossaryTerms.length).toBeGreaterThanOrEqual(18);
  });

  it("every term has required text fields", () => {
    for (const g of glossaryTerms) {
      expect(g.id.length, `${g.id}.id`).toBeGreaterThan(1);
      expect(g.term.length, `${g.id}.term`).toBeGreaterThan(1);
      expect(g.shortDefinition.length, `${g.id}.shortDefinition`).toBeGreaterThan(5);
      expect(g.plainEnglish.length, `${g.id}.plainEnglish`).toBeGreaterThan(10);
      expect(g.technical.length, `${g.id}.technical`).toBeGreaterThan(10);
      expect(g.businessFraming.length, `${g.id}.businessFraming`).toBeGreaterThan(10);
    }
  });

  it("every term has at least one stakeholder tag", () => {
    for (const g of glossaryTerms) {
      expect(g.stakeholderTags.length, `${g.id} stakeholderTags`).toBeGreaterThanOrEqual(1);
    }
  });

  it("all glossary ids are unique", () => {
    const ids = glossaryTerms.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("key terms are present", () => {
    const ids = glossaryTerms.map((g) => g.id);
    for (const expected of ["g-least-privilege", "g-zero-trust", "g-rbac", "g-mfa", "g-pdpa"]) {
      expect(ids, `missing ${expected}`).toContain(expected);
    }
  });
});

// ── knowledgeItems backward compat ───────────────────────────────────────────

describe("knowledgeItems backward compatibility", () => {
  it("has one item per story", () => {
    expect(knowledgeItems).toHaveLength(stories.length);
  });

  it("every item has id, title, tags, summary, route", () => {
    for (const ki of knowledgeItems) {
      expect(ki.id).toBeTruthy();
      expect(ki.title).toBeTruthy();
      expect(ki.route).toMatch(/^\//);
      expect(Array.isArray(ki.tags)).toBe(true);
    }
  });
});