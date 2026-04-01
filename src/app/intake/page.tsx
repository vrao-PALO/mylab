"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";
import { frameworksByIndustry, frameworkPacks } from "@/lib/data/frameworks";

const story = stories.find((s) => s.id === "story-01")!;

const ENGAGEMENT_TYPES = ["RFP", "RFQ", "Assessment", "Internal Audit", "Advisory"] as const;
const INDUSTRIES = ["FI", "GovTech", "Education", "Real Estate", "Generic"] as const;

const FRAMEWORK_HINTS: Record<string, string> = {
  FI: "MAS TRM + ISO 27001 + OWASP ASVS + NIST 800-53 + CIS Controls",
  GovTech: "ISO 27001 + PDPA + OWASP ASVS + NIST 800-53 + MTCS Tier 3",
  Education: "PDPA + OWASP ASVS + OWASP MASVS + CIS Controls",
  "Real Estate": "PDPA + ISO 27001 + CIS Controls",
  Generic: "ISO 27001 + PDPA + OWASP ASVS + NIST 800-53 + CIS Controls",
};

export default function IntakePage() {
  const [engagementType, setEngagementType] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [outcome, setOutcome] = useState("");
  const [success, setSuccess] = useState("");
  const [constraints, setConstraints] = useState("");
  const [timeline, setTimeline] = useState("");

  const complete =
    engagementType && industry && objective.length >= 10 && outcome.length >= 10 && success.length >= 10 && constraints && timeline;

  const applicableFrameworks = industry ? (frameworksByIndustry[industry] ?? []) : [];

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">01 Capture Engagement Requirement</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          {complete && (
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ✓ Ready to proceed
            </span>
          )}
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Why this matters:</strong> {story.notes[0].content}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Engagement context</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Engagement type *</label>
              <select
                value={engagementType}
                onChange={(e) => setEngagementType(e.target.value)}
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
              >
                <option value="">Select type…</option>
                {ENGAGEMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Industry sector *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
              >
                <option value="">Select sector…</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Timeline / deadline *</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. Go-live June 30, 2026"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Known constraints *</label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. No downtime, limited budget, legacy systems"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
              />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Business objectives</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Business objective * (min 10 chars)</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                placeholder="What is the system and what business problem does it solve?"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Expected outcome * (min 10 chars)</label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={2}
                placeholder="What does successful delivery look like?"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Success criteria * (min 10 chars)</label>
              <textarea
                value={success}
                onChange={(e) => setSuccess(e.target.value)}
                rows={2}
                placeholder="How will we know the engagement succeeded?"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none"
              />
            </div>
          </div>
        </article>
      </div>

      {industry && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">
            Framework overlay for {industry}
          </h3>
          <p className="mb-3 text-sm text-[#33496f]">
            <strong>Default stack:</strong> {FRAMEWORK_HINTS[industry]}
          </p>
          <div className="flex flex-wrap gap-2">
            {applicableFrameworks.map((fwId) => {
              const fw = frameworkPacks.find((f) => f.id === fwId);
              return fw ? (
                <span key={fwId} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">
                  {fw.shortName}
                </span>
              ) : null;
            })}
          </div>
        </article>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Key intake questions</h3>
        <ul className="space-y-1 text-sm text-[#273f67]">
          {story.notes[2].content.replace("Key intake questions: ", "").split(". ").filter(Boolean).map((q, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#1f4f97] font-bold shrink-0">→</span>
              <span>{q.endsWith("?") ? q : q + "?"}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Acceptance criteria</h3>
        <ul className="space-y-1">
          {story.acceptanceCriteria.map((ac) => (
            <li key={ac.id} className="flex gap-2 text-sm text-[#273f67]">
              <span className="text-green-600 shrink-0">✓</span>
              <span>{ac.criterion}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
