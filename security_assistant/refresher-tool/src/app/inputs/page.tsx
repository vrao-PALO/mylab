"use client";

import { useEffect, useState } from "react";
import { useFormPersistence } from "@/lib/use-form-persistence";
import { stories } from "@/lib/knowledge-base";
import { EMPTY_INPUTS_STATE, getWorkflowExportContext, type DataClass, type InputsFormState } from "@/lib/workflow-state";
import { PREFILL_MARKER_KEYS, applyInputsPrefill, getIntakePrefillSignature } from "@/lib/intake-prefill";
import { useRole } from "@/components/role-mode";

const story = stories.find((s) => s.id === "story-03")!;

const CLASS_COLORS: Record<DataClass, string> = {
  INTERNAL: "bg-blue-50 text-blue-700 border-blue-200",
  CONFIDENTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  FINANCIAL: "bg-orange-50 text-orange-700 border-orange-200",
  AUDIT: "bg-purple-50 text-purple-700 border-purple-200",
  PII: "bg-red-50 text-red-700 border-red-200",
};

const REGULATION_MAP: Record<DataClass, string> = {
  INTERNAL: "ISO 27001",
  CONFIDENTIAL: "ISO 27001, PDPA",
  FINANCIAL: "MAS TRM, PDPA",
  AUDIT: "MAS TRM, ISO 27001",
  PII: "PDPA",
};

const CONTROLS_MAP: Record<DataClass, string> = {
  INTERNAL: "Access control, encryption at rest",
  CONFIDENTIAL: "RBAC, encryption in transit and at rest",
  FINANCIAL: "Least privilege, masking, audit logging, MFA",
  AUDIT: "Immutable logs, restricted access, tamper protection",
  PII: "Consent, purpose limitation, retention schedule, disposal, cross-border transfer assessment",
};

const DATA_CLASSES: DataClass[] = ["INTERNAL", "CONFIDENTIAL", "FINANCIAL", "AUDIT", "PII"];

const DEFAULT_INPUTS: InputsFormState = {
  dataEntries: [
    { id: "seed-data-1", name: "Employee HR records", classification: "CONFIDENTIAL", regulation: "ISO 27001, PDPA", retention: "7 years", controls: CONTROLS_MAP.CONFIDENTIAL, hasAi: false, highRisk: false },
    { id: "seed-data-2", name: "Finance and payroll data", classification: "FINANCIAL", regulation: "MAS TRM, PDPA", retention: "7 years", controls: CONTROLS_MAP.FINANCIAL, hasAi: false, highRisk: true },
    { id: "seed-data-3", name: "AI scoring outputs", classification: "PII", regulation: "PDPA", retention: "90 days", controls: CONTROLS_MAP.PII, hasAi: true, highRisk: true },
  ],
  integrations: [
    { id: "seed-int-1", source: "Napta HR API", destination: "PostgreSQL (ETL)", protocol: "HTTPS/REST", authMethod: "Entra bearer token", sensitivity: "CONFIDENTIAL", thirdParty: true },
    { id: "seed-int-2", source: "GitHub Actions", destination: "Azure Key Vault", protocol: "HTTPS", authMethod: "Managed Identity", sensitivity: "INTERNAL", thirdParty: false },
  ],
};

const makeId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function InputsPage() {
  const role = useRole();
  const [form, setForm] = useFormPersistence<InputsFormState>("inputs", EMPTY_INPUTS_STATE.dataEntries.length ? EMPTY_INPUTS_STATE : DEFAULT_INPUTS);
  const [newDataName, setNewDataName] = useState("");
  const [newDataClass, setNewDataClass] = useState<DataClass>("INTERNAL");
  const [newDataRetention, setNewDataRetention] = useState("");
  const [newDataHasAi, setNewDataHasAi] = useState(false);

  useEffect(() => {
    const workflow = getWorkflowExportContext();
    const signature = getIntakePrefillSignature(workflow.intake);
    if (!signature || localStorage.getItem(PREFILL_MARKER_KEYS.inputs) === signature) return;

    const next = applyInputsPrefill(form, workflow.intake);
    localStorage.setItem(PREFILL_MARKER_KEYS.inputs, signature);

    if (JSON.stringify(next) !== JSON.stringify(form)) {
      setForm(next);
    }
  }, [form, setForm]);

  const highRiskItems = form.dataEntries.filter((entry) => entry.highRisk);
  const showTechnicalControls = role !== "Presales";

  const addData = () => {
    if (!newDataName.trim()) return;

    setForm({
      ...form,
      dataEntries: [
        ...form.dataEntries,
        {
          id: makeId("data"),
          name: newDataName.trim(),
          classification: newDataClass,
          regulation: REGULATION_MAP[newDataClass],
          retention: newDataRetention || "TBD",
          controls: CONTROLS_MAP[newDataClass],
          hasAi: newDataHasAi,
          highRisk: newDataClass === "FINANCIAL" || newDataClass === "PII" || newDataHasAi,
        },
      ],
    });

    setNewDataName("");
    setNewDataRetention("");
    setNewDataHasAi(false);
  };

  const removeData = (id: string) => {
    setForm({
      ...form,
      dataEntries: form.dataEntries.filter((entry) => entry.id !== id),
    });
  };

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">03 Identify Data and Integration Inputs</h2>
        <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Principle:</strong> {story.notes[0].content}
        </div>
        <div className="mt-3 rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-4 py-3 text-xs text-[#33496f]">
          <strong>{role} focus:</strong>{" "}
          {role === "Architect"
            ? "Capture control-sensitive data classes, privileged integrations, and AI handling so the control map is defensible."
            : role === "Auditor"
              ? "Keep enough detail to trace evidence, retention, and third-party exposure during audit testing."
              : "Use this page to frame client discussion points. Detailed control implementation is intentionally hidden in Presales mode."}
        </div>
      </header>

      {highRiskItems.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">High-risk data flows detected ({highRiskItems.length})</p>
          <ul className="mt-2 space-y-1">
            {highRiskItems.map((entry) => (
              <li key={entry.id} className="text-xs text-red-600">
                {entry.name} ({entry.classification}){entry.hasAi ? " - AI component requires governance review" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Data catalog</h3>
          <span className="text-xs text-[#4a6080]">{form.dataEntries.length} entries</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#d8e0ed]">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-[#edf3fc] text-[#1e3d6c]">
              <tr>
                <th className="px-3 py-2 font-semibold">Data name</th>
                <th className="px-3 py-2 font-semibold">Class</th>
                <th className="px-3 py-2 font-semibold">Regulation</th>
                <th className="px-3 py-2 font-semibold">Retention</th>
                {showTechnicalControls && <th className="px-3 py-2 font-semibold">Required controls</th>}
                <th className="px-3 py-2 font-semibold">Flags</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {form.dataEntries.map((entry) => (
                <tr key={entry.id} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                  <td className="px-3 py-2 font-medium">{entry.name}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CLASS_COLORS[entry.classification]}`}>
                      {entry.classification}
                    </span>
                  </td>
                  <td className="px-3 py-2">{entry.regulation}</td>
                  <td className="px-3 py-2">{entry.retention}</td>
                  {showTechnicalControls && <td className="max-w-xs px-3 py-2">{entry.controls}</td>}
                  <td className="space-x-1 px-3 py-2">
                    {entry.hasAi && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">AI</span>}
                    {entry.highRisk && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">High risk</span>}
                  </td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => removeData(entry.id)} className="text-xs text-red-400 hover:text-red-600">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Name</label>
            <input value={newDataName} onChange={(event) => setNewDataName(event.target.value)} placeholder="e.g. Video recordings" className="w-44 rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1.5 text-xs text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Classification</label>
            <select value={newDataClass} onChange={(event) => setNewDataClass(event.target.value as DataClass)} className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1.5 text-xs text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
              {DATA_CLASSES.map((dataClass) => (
                <option key={dataClass}>{dataClass}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Retention</label>
            <input value={newDataRetention} onChange={(event) => setNewDataRetention(event.target.value)} placeholder="e.g. 6 months" className="w-28 rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1.5 text-xs text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
          </div>
          <label className="flex cursor-pointer items-center gap-1 text-xs text-[#3a5480]">
            <input type="checkbox" checked={newDataHasAi} onChange={(event) => setNewDataHasAi(event.target.checked)} className="rounded" />
            AI component
          </label>
          <button type="button" onClick={addData} className="rounded-md bg-[#1f4f97] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#173f79]">
            Add
          </button>
        </div>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Integration catalog</h3>
        {role === "Presales" ? (
          <div className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4 text-sm text-[#33496f]">
            <p className="font-semibold text-[#15305a]">Client-facing summary</p>
            <p className="mt-2">{form.integrations.length} integrations are currently tracked.</p>
            <p className="mt-1">Third-party integrations: {form.integrations.filter((entry) => entry.thirdParty).length}</p>
            <p className="mt-1">Most sensitive integration class: {form.integrations.some((entry) => entry.sensitivity === "PII" || entry.sensitivity === "FINANCIAL") ? "PII or FINANCIAL" : "INTERNAL or CONFIDENTIAL"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#d8e0ed]">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-[#edf3fc] text-[#1e3d6c]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Source</th>
                  <th className="px-3 py-2 font-semibold">Destination</th>
                  <th className="px-3 py-2 font-semibold">Protocol</th>
                  <th className="px-3 py-2 font-semibold">Auth method</th>
                  <th className="px-3 py-2 font-semibold">Data sensitivity</th>
                  <th className="px-3 py-2 font-semibold">3rd party</th>
                </tr>
              </thead>
              <tbody>
                {form.integrations.map((integration) => (
                  <tr key={integration.id} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                    <td className="px-3 py-2 font-medium">{integration.source}</td>
                    <td className="px-3 py-2">{integration.destination}</td>
                    <td className="px-3 py-2">{integration.protocol}</td>
                    <td className="px-3 py-2">{integration.authMethod}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CLASS_COLORS[integration.sensitivity]}`}>
                        {integration.sensitivity}
                      </span>
                    </td>
                    <td className="px-3 py-2">{integration.thirdParty ? <span className="font-semibold text-amber-600">Yes</span> : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-[#4a6080]">{story.notes[1].content}</p>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Acceptance criteria</h3>
        <ul className="space-y-1">
          {story.acceptanceCriteria.map((criterion) => (
            <li key={criterion.id} className="flex gap-2 text-sm text-[#273f67]">
              <span className="shrink-0 text-green-600">?</span>
              <span>{criterion.criterion}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

