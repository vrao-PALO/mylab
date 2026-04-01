"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-03")!;

type DataClass = "INTERNAL" | "CONFIDENTIAL" | "FINANCIAL" | "AUDIT" | "PII";

interface DataEntry {
  id: string;
  name: string;
  classification: DataClass;
  regulation: string;
  retention: string;
  controls: string;
  hasAi: boolean;
  highRisk: boolean;
}

interface IntegrationEntry {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  authMethod: string;
  sensitivity: DataClass;
  thirdParty: boolean;
}

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

let nextId = 1;
const makeId = () => `entry-${nextId++}`;

export default function InputsPage() {
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([
    { id: makeId(), name: "Employee HR records", classification: "CONFIDENTIAL", regulation: "ISO 27001, PDPA", retention: "7 years", controls: CONTROLS_MAP["CONFIDENTIAL"], hasAi: false, highRisk: false },
    { id: makeId(), name: "Finance / payroll data", classification: "FINANCIAL", regulation: "MAS TRM, PDPA", retention: "7 years", controls: CONTROLS_MAP["FINANCIAL"], hasAi: false, highRisk: true },
    { id: makeId(), name: "AI scoring outputs", classification: "PII", regulation: "PDPA", retention: "90 days", controls: CONTROLS_MAP["PII"], hasAi: true, highRisk: true },
  ]);
  const [integrations, setIntegrations] = useState<IntegrationEntry[]>([
    { id: makeId(), source: "Napta HR API", destination: "PostgreSQL (ETL)", protocol: "HTTPS/REST", authMethod: "Entra bearer token", sensitivity: "CONFIDENTIAL", thirdParty: true },
    { id: makeId(), source: "GitHub Actions", destination: "Azure Key Vault", protocol: "HTTPS", authMethod: "Managed Identity", sensitivity: "INTERNAL", thirdParty: false },
  ]);

  const [newDataName, setNewDataName] = useState("");
  const [newDataClass, setNewDataClass] = useState<DataClass>("INTERNAL");
  const [newDataRetention, setNewDataRetention] = useState("");
  const [newDataHasAi, setNewDataHasAi] = useState(false);

  const addData = () => {
    if (!newDataName) return;
    setDataEntries((prev) => [
      ...prev,
      {
        id: makeId(),
        name: newDataName,
        classification: newDataClass,
        regulation: REGULATION_MAP[newDataClass],
        retention: newDataRetention || "TBD",
        controls: CONTROLS_MAP[newDataClass],
        hasAi: newDataHasAi,
        highRisk: newDataClass === "FINANCIAL" || newDataClass === "PII" || newDataHasAi,
      },
    ]);
    setNewDataName(""); setNewDataRetention(""); setNewDataHasAi(false);
  };

  const removeData = (id: string) => setDataEntries((prev) => prev.filter((e) => e.id !== id));

  const highRiskItems = dataEntries.filter((e) => e.highRisk);

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">03 Identify Data and Integration Inputs</h2>
        <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Principle:</strong> {story.notes[0].content}
        </div>
      </header>

      {highRiskItems.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">⚠ High-risk data flows detected ({highRiskItems.length})</p>
          <ul className="mt-2 space-y-1">
            {highRiskItems.map((e) => (
              <li key={e.id} className="text-xs text-red-600">→ {e.name} ({e.classification}){e.hasAi ? " — AI component requires governance review" : ""}</li>
            ))}
          </ul>
        </div>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Data catalog</h3>
          <span className="text-xs text-[#4a6080]">{dataEntries.length} entries</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#d8e0ed]">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-[#edf3fc] text-[#1e3d6c]">
              <tr>
                <th className="px-3 py-2 font-semibold">Data name</th>
                <th className="px-3 py-2 font-semibold">Class</th>
                <th className="px-3 py-2 font-semibold">Regulation</th>
                <th className="px-3 py-2 font-semibold">Retention</th>
                <th className="px-3 py-2 font-semibold">Required controls</th>
                <th className="px-3 py-2 font-semibold">Flags</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {dataEntries.map((e) => (
                <tr key={e.id} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                  <td className="px-3 py-2 font-medium">{e.name}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CLASS_COLORS[e.classification]}`}>
                      {e.classification}
                    </span>
                  </td>
                  <td className="px-3 py-2">{e.regulation}</td>
                  <td className="px-3 py-2">{e.retention}</td>
                  <td className="px-3 py-2 max-w-xs">{e.controls}</td>
                  <td className="px-3 py-2 space-x-1">
                    {e.hasAi && <span className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-xs">AI</span>}
                    {e.highRisk && <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">High risk</span>}
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeData(e.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Name</label>
            <input value={newDataName} onChange={(e) => setNewDataName(e.target.value)} placeholder="e.g. Video recordings" className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1.5 text-xs text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] w-44" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Classification</label>
            <select value={newDataClass} onChange={(e) => setNewDataClass(e.target.value as DataClass)} className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1.5 text-xs text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
              {DATA_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Retention</label>
            <input value={newDataRetention} onChange={(e) => setNewDataRetention(e.target.value)} placeholder="e.g. 6 months" className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1.5 text-xs text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] w-28" />
          </div>
          <label className="flex items-center gap-1 text-xs text-[#3a5480] cursor-pointer">
            <input type="checkbox" checked={newDataHasAi} onChange={(e) => setNewDataHasAi(e.target.checked)} className="rounded" />
            AI component
          </label>
          <button onClick={addData} className="rounded-md bg-[#1f4f97] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#173f79]">+ Add</button>
        </div>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Integration catalog</h3>
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
              {integrations.map((i) => (
                <tr key={i.id} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                  <td className="px-3 py-2 font-medium">{i.source}</td>
                  <td className="px-3 py-2">{i.destination}</td>
                  <td className="px-3 py-2">{i.protocol}</td>
                  <td className="px-3 py-2">{i.authMethod}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CLASS_COLORS[i.sensitivity]}`}>{i.sensitivity}</span>
                  </td>
                  <td className="px-3 py-2">{i.thirdParty ? <span className="text-amber-600 font-semibold">Yes</span> : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[#4a6080]">{story.notes[1].content}</p>
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
