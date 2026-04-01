"use client";
import { useState } from "react";
import { glossaryTerms } from "@/lib/knowledge-base";

type Audience = "All" | "business-owner" | "senior-management" | "engineering" | "audit" | "delivery-team";

const AUDIENCE_LABELS: Record<string, string> = {
  "business-owner": "Business owner",
  "senior-management": "Senior management",
  "engineering": "Engineering",
  "audit": "Audit / risk",
  "delivery-team": "Delivery team",
};

export default function PlainEnglishPage() {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState<Audience>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = glossaryTerms.filter((g) => {
    const matchAudience = audience === "All" || g.stakeholderTags.includes(audience);
    const q = search.toLowerCase();
    const matchSearch = !q || g.term.toLowerCase().includes(q) || g.tags.some((t) => t.includes(q)) || g.shortDefinition.toLowerCase().includes(q);
    return matchAudience && matchSearch;
  });

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">07 Generate Plain-English Explanations</h2>
        <p className="mt-1 text-sm text-[#33496f]">
          Translate technical controls into the right language for every stakeholder — business owner, management, engineering, or audit.
        </p>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Key insight:</strong> Stakeholder communication is as important as technical knowledge. A Security Architect succeeds by working through people, not only by knowing controls.
        </div>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms… (e.g. PDPA, zero trust, logging)"
          className="flex-1 min-w-[200px] rounded-md border border-[#c9d5e6] bg-white px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
        />
        <div className="flex flex-wrap gap-1">
          {(["All", "business-owner", "senior-management", "engineering", "audit", "delivery-team"] as Audience[]).map((a) => (
            <button key={a} onClick={() => setAudience(a)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${audience === a ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
            >
              {a === "All" ? "All audiences" : AUDIENCE_LABELS[a]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#4a6080]">{filtered.length} term{filtered.length !== 1 ? "s" : ""} shown</p>

      <div className="space-y-3">
        {filtered.map((g) => (
          <article key={g.id} className="rounded-xl border border-[#c9d5e6] bg-white overflow-hidden">
            <button
              className="w-full flex items-start justify-between p-5 text-left hover:bg-[#f8fbff] transition-colors"
              onClick={() => setExpanded(expanded === g.id ? null : g.id)}
            >
              <div className="flex-1 pr-4">
                <p className="text-sm font-bold text-[#10203d]">{g.term}</p>
                <p className="mt-0.5 text-sm text-[#33496f]">{g.shortDefinition}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {g.stakeholderTags.map((t) => (
                    <span key={t} className="rounded-full bg-[#edf3fc] border border-[#c9d5e6] px-2 py-0.5 text-xs text-[#1e3d6c]">
                      {AUDIENCE_LABELS[t] ?? t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[#3a5480] text-sm shrink-0">{expanded === g.id ? "▲" : "▼"}</span>
            </button>

            {expanded === g.id && (
              <div className="border-t border-[#e1e8f3] p-5 space-y-4">
                <div className="rounded-md bg-green-50 border border-green-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green-700 mb-1">Plain English</p>
                  <p className="text-sm text-[#1a3a1a]">{g.plainEnglish}</p>
                </div>

                <div className="rounded-md bg-[#f8fbff] border border-[#d8e0ed] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3a5480] mb-1">Technical summary</p>
                  <p className="text-sm text-[#273f67]">{g.technical}</p>
                </div>

                <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-700 mb-1">Business framing</p>
                  <p className="text-sm text-[#3a2a00]">{g.businessFraming}</p>
                </div>

                {g.relatedTerms.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#3a5480] mb-1">Related terms</p>
                    <div className="flex flex-wrap gap-1">
                      {g.relatedTerms.map((r) => {
                        const rel = glossaryTerms.find((t) => t.id === r);
                        return rel ? (
                          <button key={r} onClick={() => setExpanded(r)}
                            className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-2 py-0.5 text-xs text-[#1e3d6c] hover:border-[#1f4f97] transition-colors"
                          >
                            {rel.term}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {g.tags.map((t) => (
                    <span key={t} className="rounded-full border border-[#d8e0ed] bg-[#f8fbff] px-2 py-0.5 text-xs text-[#4a6080]">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-[#c9d5e6] bg-white p-8 text-center text-sm text-[#4a6080]">
            No terms match your filter. Try a different search or audience.
          </div>
        )}
      </div>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">How to frame security for each stakeholder</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { audience: "Business owner / product owner", framing: "Focus on fraud exposure, financial loss, customer trust, service disruption, and go-live confidence." },
            { audience: "Project manager", framing: "Focus on checkpoints, timelines, entry/exit criteria, testing dependencies, and what is a blocker vs. manageable." },
            { audience: "Engineering team", framing: "Focus on practical patterns, why a control is needed, how to implement it, and priority by actual risk — not abstract policy." },
            { audience: "Audit / risk team", framing: "Focus on traceability, evidence, control-to-requirement mapping, and residual risk documentation." },
            { audience: "Senior management", framing: "Focus on the most material risks, decisions needed, and whether security is proportionate and under control." },
          ].map((row) => (
            <div key={row.audience} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3">
              <p className="text-xs font-semibold text-[#1f4f97]">{row.audience}</p>
              <p className="mt-1 text-sm text-[#273f67]">{row.framing}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
