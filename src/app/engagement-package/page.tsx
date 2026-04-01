"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Engagement {
  id: string;
  title: string;
  status: string;
  engagementType: string;
  industry: string;
  businessObjective: string;
  timeline: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Draft:       "bg-gray-100 text-gray-500 border-gray-300",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-300",
  Complete:    "bg-green-100 text-green-700 border-green-300",
  Archived:    "bg-blue-50 text-blue-400 border-blue-200",
};

const INTAKE_KEYS = ["form_intake-form", "form_scope", "form_inputs"];

function readLocalForms() {
  try {
    const intake = JSON.parse(localStorage.getItem("form_intake-form") ?? "{}");
    const scope  = JSON.parse(localStorage.getItem("form_scope") ?? "{}");
    const inputs = JSON.parse(localStorage.getItem("form_inputs") ?? "{}");
    return { intake, scope, inputs };
  } catch { return { intake: {}, scope: {}, inputs: {} }; }
}

function restoreForms(engagement: { intake: unknown; scope: unknown; inputs: unknown }) {
  try {
    localStorage.setItem("form_intake-form", JSON.stringify(engagement.intake ?? {}));
    localStorage.setItem("form_scope", JSON.stringify(engagement.scope ?? {}));
    localStorage.setItem("form_inputs", JSON.stringify(engagement.inputs ?? {}));
  } catch { /* ignore */ }
}

export default function EngagementPackagePage() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  async function fetchEngagements() {
    try {
      const res = await fetch("/api/engagements");
      const json = await res.json();
      if (json.ok) setEngagements(json.data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { fetchEngagements(); }, []);

  async function saveEngagement() {
    if (!title.trim()) return;
    setSaving(true);
    const { intake, scope, inputs } = readLocalForms();
    const payload = {
      title: title.trim(),
      status: "In Progress",
      intake,
      scope,
      inputs,
    };
    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        setSaveStatus("ok");
        setTitle("");
        await fetchEngagements();
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
    setSaving(false);
  }

  async function loadEngagement(id: string) {
    try {
      const res = await fetch(`/api/engagements/${id}`);
      const json = await res.json();
      if (json.ok) {
        restoreForms(json.data);
        setLoadedId(id);
        setTimeout(() => setLoadedId(null), 3000);
      }
    } catch { /* ignore */ }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/engagements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setEngagements((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
    } catch { /* ignore */ }
  }

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Engagement Package</h2>
        <p className="mt-1 text-sm text-[#33496f]">
          Save your current workflow progress as a named engagement, or load a previous engagement to resume it.
        </p>
      </header>

      {/* Save current */}
      <article className="rounded-xl border border-[#1f4f97] bg-white p-5">
        <h3 className="text-sm font-semibold text-[#10203d] mb-3">Save current engagement</h3>
        <p className="text-xs text-[#6a8ab0] mb-3">
          Captures your current Intake, Scope, and Inputs form data and saves it to the database.
        </p>
        <div className="flex gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. NAPTA Internal Audit — Q2 2026"
            className="flex-1 rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            onKeyDown={(e) => e.key === "Enter" && saveEngagement()}
          />
          <button
            onClick={saveEngagement}
            disabled={saving || !title.trim()}
            className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183d7a] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
        {saveStatus === "ok" && (
          <p className="mt-2 text-xs text-green-700 font-medium">✓ Engagement saved successfully</p>
        )}
        {saveStatus === "error" && (
          <p className="mt-2 text-xs text-red-600 font-medium">Failed to save — check server connection</p>
        )}
      </article>

      {/* Saved engagements */}
      <article className="rounded-xl border border-[#c9d5e6] bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e4eaf4] bg-[#f8fbff] flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a5480]">
            Saved engagements {engagements.length > 0 ? `(${engagements.length})` : ""}
          </h3>
          <button onClick={fetchEngagements} className="text-xs text-[#6a8ab0] hover:text-[#1f4f97] transition-colors">↻ Refresh</button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#6a8ab0]">Loading…</div>
        ) : engagements.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#6a8ab0]">No saved engagements yet.</p>
            <p className="mt-1 text-xs text-[#8fa3c2]">Fill in the intake form and save your first engagement above.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#edf1f8]">
            {engagements.map((eng) => (
              <div key={eng.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 mb-1 flex-wrap">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[eng.status] ?? "bg-gray-100 text-gray-500 border-gray-300"}`}>
                        {eng.status}
                      </span>
                      <span className="rounded-full bg-[#edf3fc] text-[#1f4f97] border border-[#c9d5e6] px-2 py-0.5 text-xs">{eng.engagementType}</span>
                      <span className="rounded-full bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 text-xs">{eng.industry}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#10203d] truncate">{eng.title}</p>
                    <p className="text-xs text-[#6a8ab0] mt-0.5">{eng.businessObjective.slice(0, 80)}{eng.businessObjective.length > 80 ? "…" : ""}</p>
                    <p className="text-xs text-[#8fa3c2] mt-0.5">
                      Saved {new Date(eng.createdAt).toLocaleDateString()} · {eng.timeline}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => loadEngagement(eng.id)}
                      className="rounded-md border border-[#1f4f97] bg-[#edf3fc] px-3 py-1.5 text-xs font-medium text-[#1f4f97] hover:bg-[#1f4f97] hover:text-white transition-colors"
                    >
                      {loadedId === eng.id ? "✓ Loaded!" : "Load →"}
                    </button>
                    <select
                      value={eng.status}
                      onChange={(e) => updateStatus(eng.id, e.target.value)}
                      className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1 text-xs text-[#2a4a80] focus:outline-none focus:ring-1 focus:ring-[#1f4f97]"
                    >
                      {["Draft","In Progress","Complete","Archived"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <div className="rounded-xl border border-[#c9d5e6] bg-[#f8fbff] p-4">
        <p className="text-xs font-semibold text-[#3a5480] mb-1">Workflow links</p>
        <div className="flex gap-2 flex-wrap">
          {[
            ["/intake", "Intake"], ["/scope", "Scope"], ["/inputs", "Inputs"],
            ["/control-mapping", "Controls"], ["/risk-exceptions", "Risk Register"],
            ["/audit-evidence", "Evidence Tracker"],
          ].map(([href, label]) => (
            <Link key={href} href={href}
              className="rounded-md border border-[#c9d5e6] bg-white px-3 py-1 text-xs text-[#1f4f97] hover:bg-[#edf3fc] transition-colors">
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}