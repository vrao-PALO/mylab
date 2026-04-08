"use client";

import { useEffect, useState } from "react";
import { useFormPersistence } from "@/lib/use-form-persistence";
import { stories, getFrameworksForIndustry } from "@/lib/knowledge-base";
import { getWorkflowExportContext, type MappingRow, type ControlMappingState } from "@/lib/workflow-state";
import { PREFILL_MARKER_KEYS, applyControlMappingPrefill, getIntakePrefillSignature } from "@/lib/intake-prefill";
import { useRole } from "@/components/role-mode";

const story = stories.find((s) => s.id === "story-04")!;

type Industry = "FI" | "GovTech" | "Education" | "Real Estate" | "Generic";

const SAMPLE_ROWS: MappingRow[] = [
  { id: "m1", requirement: "Object-level authorization - users can only access their own records", controls: ["asvs-v4-1", "mas-access-1", "iso-a5-15"], gap: false },
  { id: "m2", requirement: "Sensitive data must not appear in application logs", controls: ["asvs-v7-1", "iso-a8-15", "cis-8"], gap: false },
  { id: "m3", requirement: "Privileged admin actions require MFA and are fully audited", controls: ["nist-ia-2", "mas-access-1", "soc2-cc6-1"], gap: false },
  { id: "m4", requirement: "Mobile camera / microphone permissions scoped per session only", controls: ["masvs-platform-1"], gap: false },
  { id: "m5", requirement: "Third-party vendor must provide audit report annually", controls: ["mas-3p-1"], gap: false },
  { id: "m6", requirement: "Data retention schedule enforced and disposals evidenced", controls: ["pdpa-retention"], gap: false },
  { id: "m7", requirement: "AI scoring decisions must be explainable and correctable", controls: [], gap: true },
];

const DEFAULT_STATE: ControlMappingState = {
  industry: "FI",
  rows: SAMPLE_ROWS,
};

export default function ControlMappingPage() {
  const role = useRole();
  const [form, setForm] = useFormPersistence<ControlMappingState>("control-mapping", DEFAULT_STATE);
  const [newReq, setNewReq] = useState("");

  useEffect(() => {
    const workflow = getWorkflowExportContext();
    const signature = getIntakePrefillSignature(workflow.intake);
    if (!signature || localStorage.getItem(PREFILL_MARKER_KEYS.controlMapping) === signature) return;

    const next = applyControlMappingPrefill(form, workflow.intake);
    localStorage.setItem(PREFILL_MARKER_KEYS.controlMapping, signature);

    if (JSON.stringify(next) !== JSON.stringify(form)) {
      setForm(next);
    }
  }, [form, setForm]);

  const applicablePacks = getFrameworksForIndustry(form.industry as Industry);
  const allControls = applicablePacks.flatMap((frameworkPack) => frameworkPack.controls);
  const gaps = form.rows.filter((row) => row.gap);
  const canEditMatrix = role !== "Presales";

  const addRow = () => {
    if (!newReq.trim() || !canEditMatrix) return;
    setForm({
      ...form,
      rows: [...form.rows, { id: `m${Date.now()}`, requirement: newReq.trim(), controls: [], gap: true }],
    });
    setNewReq("");
  };

  const toggleControl = (rowId: string, controlId: string) => {
    if (!canEditMatrix) return;

    setForm({
      ...form,
      rows: form.rows.map((row) => {
        if (row.id !== rowId) return row;
        const nextControls = row.controls.includes(controlId)
          ? row.controls.filter((item) => item !== controlId)
          : [...row.controls, controlId];
        return { ...row, controls: nextControls, gap: nextControls.length === 0 };
      }),
    });
  };

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
              {gaps.length} gap{gaps.length > 1 ? "s" : ""} - resolve before go-live
            </span>
          )}
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Mapping chain:</strong> {story.notes[2].content}
        </div>
        <div className="mt-3 rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-4 py-3 text-xs text-[#33496f]">
          <strong>{role} focus:</strong>{" "}
          {role === "Architect"
            ? "Use the detailed matrix to confirm every requirement has a defensible control mapping and evidence path."
            : role === "Auditor"
              ? "Focus on gap visibility, framework traceability, and whether the claimed controls are testable."
              : "Presales mode keeps this page at summary depth so client conversations stay outcome-focused rather than implementation-heavy."}
        </div>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Industry overlay</h3>
        <div className="flex flex-wrap gap-2">
          {(["FI", "GovTech", "Education", "Real Estate", "Generic"] as Industry[]).map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => setForm({ ...form, industry })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                form.industry === industry
                  ? "bg-[#1f4f97] text-white border-[#1f4f97]"
                  : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {applicablePacks.map((frameworkPack) => (
            <span key={frameworkPack.id} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">
              {frameworkPack.shortName}
            </span>
          ))}
        </div>
      </article>

      {role === "Presales" && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Presales summary</h3>
          <p className="text-sm text-[#273f67]">{form.rows.length - gaps.length} requirements currently map cleanly. {gaps.length} still need a control response before you can present this as production-ready.</p>
          <ul className="mt-3 space-y-1 text-sm text-[#273f67]">
            {gaps.slice(0, 3).map((gap) => (
              <li key={gap.id}>{gap.requirement}</li>
            ))}
          </ul>
        </article>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Control mapping matrix</h3>
        <div className="space-y-3">
          {form.rows.map((row) => {
            const mappedControls = allControls.filter((control) => row.controls.includes(control.id));
            return (
              <div key={row.id} className={`rounded-lg border p-4 ${row.gap ? "border-red-200 bg-red-50" : "border-[#d8e0ed] bg-[#f8fbff]"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#15305a]">{row.requirement}</p>
                  {row.gap ? (
                    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">Gap</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Mapped</span>
                  )}
                </div>
                {mappedControls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mappedControls.map((control) => (
                      <button
                        key={control.id}
                        type="button"
                        onClick={() => toggleControl(row.id, control.id)}
                        disabled={!canEditMatrix}
                        className="rounded-full bg-[#1f4f97] px-2 py-0.5 text-xs text-white border border-[#1f4f97] disabled:cursor-not-allowed disabled:opacity-80"
                        title={control.intent}
                      >
                        {control.framework} {control.clause}
                      </button>
                    ))}
                  </div>
                )}
                {canEditMatrix ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-[#3a5480] hover:text-[#1f4f97]">Add control</summary>
                    <div className="mt-2 flex max-h-32 flex-wrap gap-1 overflow-y-auto">
                      {allControls.filter((control) => !row.controls.includes(control.id)).map((control) => (
                        <button
                          key={control.id}
                          type="button"
                          onClick={() => toggleControl(row.id, control.id)}
                          className="rounded-full border border-[#c9d5e6] bg-white px-2 py-0.5 text-xs text-[#2a4a80] hover:border-[#1f4f97] transition-colors"
                          title={control.intent}
                        >
                          {control.framework} {control.clause} - {control.title}
                        </button>
                      ))}
                    </div>
                  </details>
                ) : (
                  <p className="mt-2 text-xs text-[#4a6080]">Detailed control assignment is hidden in Presales mode.</p>
                )}
              </div>
            );
          })}
        </div>

        {canEditMatrix && (
          <div className="mt-4 flex gap-2">
            <input
              value={newReq}
              onChange={(event) => setNewReq(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addRow()}
              placeholder="Add a new requirement..."
              className="flex-1 rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
            <button type="button" onClick={addRow} className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173f79]">
              Add
            </button>
          </div>
        )}
      </article>

      {gaps.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Unmapped requirements - go-live blockers:</p>
          <ul className="mt-2 space-y-1">
            {gaps.map((gap) => (
              <li key={gap.id} className="text-xs text-red-600">{gap.requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {role !== "Presales" && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Framework reference - {form.industry} overlay</h3>
          <div className="space-y-4">
            {applicablePacks.map((frameworkPack) => (
              <div key={frameworkPack.id}>
                <p className="text-sm font-semibold text-[#15305a]">
                  {frameworkPack.shortName} <span className="font-normal text-[#4a6080]">- {frameworkPack.description.substring(0, 100)}...</span>
                </p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {frameworkPack.controls.map((control) => (
                    <div key={control.id} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3">
                      <p className="text-xs font-semibold text-[#1e3d6c]">{control.clause} - {control.title}</p>
                      <p className="mt-0.5 text-xs text-[#4a6080]">{control.intent}</p>
                      <p className="mt-1 text-xs italic text-[#6b7ea0]">Evidence: {control.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}

