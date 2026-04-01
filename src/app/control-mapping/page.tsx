"use client";
import { useState } from "react";
import { stories, frameworkPacks, getFrameworksForIndustry } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-04")!;

type Industry = "FI" | "GovTech" | "Education" | "Real Estate" | "Generic";

interface MappingRow {
  id: string;
  requirement: string;
  controls: string[];
  gap: boolean;
}

const SAMPLE_ROWS: MappingRow[] = [
  { id: "m1", requirement: "Object-level authorization — users can only access their own records", controls: ["asvs-v4-1", "mas-access-1", "iso-a5-15"], gap: false },
  { id: "m2", requirement: "Sensitive data must not appear in application logs", controls: ["asvs-v7-1", "iso-a8-15", "cis-8"], gap: false },
  { id: "m3", requirement: "Privileged admin actions require MFA and are fully audited", controls: ["nist-ia-2", "mas-access-1", "soc2-cc6-1"], gap: false },
  { id: "m4", requirement: "Mobile camera / microphone permissions scoped per session only", controls: ["masvs-platform-1"], gap: false },
  { id: "m5", requirement: "Third-party vendor must provide audit report annually", controls: ["mas-3p-1"], gap: false },
  { id: "m6", requirement: "Data retention schedule enforced and disposals evidenced", controls: ["pdpa-retention"], gap: false },
  { id: "m7", requirement: "AI scoring decisions must be explainable and correctable", controls: [], gap: true },
];

export default function ControlMappingPage() {
  const [industry, setIndustry] = useState<Industry>("FI");
  const [rows, setRows] = useState<MappingRow[]>(SAMPLE_ROWS);
  const [newReq, setNewReq] = useState("");

  const applicablePacks = getFrameworksForIndustry(industry);
  const allControls = applicablePacks.flatMap((fp) => fp.controls);

  const addRow = () => {
    if (!newReq.trim()) return;
    setRows((prev) => [...prev, { id: `m${Date.now()}`, requirement: newReq.trim(), controls: [], gap: true }]);
    setNewReq("");
  };

  const toggleControl = (rowId: string, ctrlId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const next = r.controls.includes(ctrlId) ? r.controls.filter((c) => c !== ctrlId) : [...r.controls, ctrlId];
        return { ...r, controls: next, gap: next.length === 0 };
      })
    );
  };

  const gaps = rows.filter((r) => r.gap);

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">04 Map Requirements to Framework Controls</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          {gaps.length > 0 && (
            <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              {gaps.length} gap{gaps.length > 1 ? "s" : ""} — resolve before go-live
            </span>
          )}
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Mapping chain:</strong> {story.notes[2].content}
        </div>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Industry overlay</h3>
        <div className="flex flex-wrap gap-2">
          {(["FI", "GovTech", "Education", "Real Estate", "Generic"] as Industry[]).map((ind) => (
            <button key={ind} onClick={() => setIndustry(ind)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                industry === ind ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {applicablePacks.map((fp) => (
            <span key={fp.id} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">
              {fp.shortName}
            </span>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Control mapping matrix</h3>
        <div className="space-y-3">
          {rows.map((row) => {
            const mappedControls = allControls.filter((c) => row.controls.includes(c.id));
            return (
              <div key={row.id} className={`rounded-lg border p-4 ${row.gap ? "border-red-200 bg-red-50" : "border-[#d8e0ed] bg-[#f8fbff]"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#15305a]">{row.requirement}</p>
                  {row.gap
                    ? <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">GAP ⚠</span>
                    : <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Mapped ✓</span>
                  }
                </div>
                {mappedControls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mappedControls.map((c) => (
                      <button key={c.id} onClick={() => toggleControl(row.id, c.id)}
                        className="rounded-full bg-[#1f4f97] text-white border border-[#1f4f97] px-2 py-0.5 text-xs hover:bg-red-600 hover:border-red-600 transition-colors"
                        title={c.intent}
                      >
                        {c.framework} {c.clause}
                      </button>
                    ))}
                  </div>
                )}
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-[#3a5480] hover:text-[#1f4f97]">+ Add control</summary>
                  <div className="mt-2 flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {allControls.filter((c) => !row.controls.includes(c.id)).map((c) => (
                      <button key={c.id} onClick={() => toggleControl(row.id, c.id)}
                        className="rounded-full border border-[#c9d5e6] bg-white px-2 py-0.5 text-xs text-[#2a4a80] hover:border-[#1f4f97] transition-colors"
                        title={c.intent}
                      >
                        {c.framework} {c.clause} — {c.title}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <input value={newReq} onChange={(e) => setNewReq(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRow()}
            placeholder="Add a new requirement…"
            className="flex-1 rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
          />
          <button onClick={addRow} className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173f79]">+ Add</button>
        </div>
      </article>

      {gaps.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Unmapped requirements — go-live blockers:</p>
          <ul className="mt-2 space-y-1">
            {gaps.map((g) => <li key={g.id} className="text-xs text-red-600">→ {g.requirement}</li>)}
          </ul>
        </div>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Framework reference — {industry} overlay</h3>
        <div className="space-y-4">
          {applicablePacks.map((fp) => (
            <div key={fp.id}>
              <p className="text-sm font-semibold text-[#15305a]">{fp.shortName} <span className="font-normal text-[#4a6080]">— {fp.description.substring(0, 100)}…</span></p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {fp.controls.map((c) => (
                  <div key={c.id} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3">
                    <p className="text-xs font-semibold text-[#1e3d6c]">{c.clause} — {c.title}</p>
                    <p className="mt-0.5 text-xs text-[#4a6080]">{c.intent}</p>
                    <p className="mt-1 text-xs text-[#6b7ea0] italic">Evidence: {c.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
