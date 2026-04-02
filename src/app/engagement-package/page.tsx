"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWorkflowExportContext, restoreWorkflowSnapshot } from "@/lib/workflow-state";

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
  intake?: unknown;
  scope?: unknown;
  inputs?: unknown;
  workflow?: unknown;
}

const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-500 border-gray-300",
  InReview: "bg-amber-100 text-amber-700 border-amber-300",
  Approved: "bg-green-100 text-green-700 border-green-300",
  Closed: "bg-blue-50 text-blue-500 border-blue-200",
};

function readCurrentWorkflow() {
  return getWorkflowExportContext();
}

function restoreEngagementWorkflow(engagement: { workflow?: unknown; intake: unknown; scope: unknown; inputs: unknown }) {
  restoreWorkflowSnapshot({
    ...(typeof engagement.workflow === "object" && engagement.workflow !== null ? (engagement.workflow as Record<string, unknown>) : {}),
    intake: engagement.intake,
    scope: engagement.scope,
    inputs: engagement.inputs,
  });
}

export default function EngagementPackagePage() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  async function fetchEngagements() {
    setLoading(true);
    try {
      const response = await fetch("/api/engagements", { cache: "no-store" });
      const payload = await response.json();
      if (payload.ok) setEngagements(payload.data);
    } catch {
      // ignore fetch errors and keep current list
    }
    setLoading(false);
  }

  useEffect(() => {
    const workflow = readCurrentWorkflow();
    const suggestedTitle = [workflow.intake.engagementType, workflow.intake.industry, workflow.intake.timeline].filter(Boolean).join(" - ");
    if (suggestedTitle) setTitle(suggestedTitle);
    void fetchEngagements();
  }, []);

  async function saveEngagement() {
    if (!title.trim()) return;
    setSaving(true);
    const workflow = readCurrentWorkflow();
    const payload = {
      title: title.trim(),
      status: "Draft",
      intake: workflow.intake,
      scope: workflow.scope,
      inputs: workflow.inputs,
      workflow,
    };
    try {
      const response = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.ok) {
        setSaveStatus("ok");
        await fetchEngagements();
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
      const response = await fetch(`/api/engagements/${id}`);
      const payload = await response.json();
      if (payload.ok) {
        restoreEngagementWorkflow(payload.data);
        setLoadedId(id);
        setTimeout(() => setLoadedId(null), 3000);
      }
    } catch {
      // ignore load failures for now
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/engagements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setEngagements((previous) => previous.map((engagement) => (engagement.id === id ? { ...engagement, status } : engagement)));
    } catch {
      // ignore update failures for now
    }
  }

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Engagement Package</h2>
        <p className="mt-1 text-sm text-[#33496f]">Save your current workflow progress as a named engagement, or load a previous engagement to resume it.</p>
      </header>

      <article className="rounded-xl border border-[#1f4f97] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-[#10203d]">Save current engagement</h3>
        <p className="mb-3 text-xs text-[#6a8ab0]">Captures the current workflow state and saves it to the database for later restore.</p>
        <div className="flex gap-3">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. NAPTA Internal Audit - Q2 2026" className="flex-1 rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" onKeyDown={(event) => event.key === "Enter" && saveEngagement()} />
          <button type="button" onClick={saveEngagement} disabled={saving || !title.trim()} className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183d7a] disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        {saveStatus === "ok" && <p className="mt-2 text-xs font-medium text-green-700">Engagement saved successfully</p>}
        {saveStatus === "error" && <p className="mt-2 text-xs font-medium text-red-600">Failed to save - check server connection</p>}
      </article>

      <article className="overflow-hidden rounded-xl border border-[#c9d5e6] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4eaf4] bg-[#f8fbff] px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a5480]">Saved engagements {engagements.length > 0 ? `(${engagements.length})` : ""}</h3>
          <button type="button" onClick={fetchEngagements} className="text-xs text-[#6a8ab0] hover:text-[#1f4f97] transition-colors">Refresh</button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#6a8ab0]">Loading...</div>
        ) : engagements.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#6a8ab0]">No saved engagements yet.</p>
            <p className="mt-1 text-xs text-[#8fa3c2]">Fill in the workflow and save your first engagement above.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#edf1f8]">
            {engagements.map((engagement) => (
              <div key={engagement.id} className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[engagement.status] ?? "bg-gray-100 text-gray-500 border-gray-300"}`}>{engagement.status}</span>
                      <span className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-2 py-0.5 text-xs text-[#1f4f97]">{engagement.engagementType}</span>
                      <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{engagement.industry}</span>
                    </div>
                    <p className="truncate text-sm font-semibold text-[#10203d]">{engagement.title}</p>
                    <p className="mt-0.5 text-xs text-[#6a8ab0]">{engagement.businessObjective.slice(0, 80)}{engagement.businessObjective.length > 80 ? "..." : ""}</p>
                    <p className="mt-0.5 text-xs text-[#8fa3c2]">Saved {new Date(engagement.createdAt).toLocaleDateString()} - {engagement.timeline}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button type="button" onClick={() => loadEngagement(engagement.id)} className="rounded-md border border-[#1f4f97] bg-[#edf3fc] px-3 py-1.5 text-xs font-medium text-[#1f4f97] hover:bg-[#1f4f97] hover:text-white transition-colors">
                      {loadedId === engagement.id ? "Loaded" : "Load"}
                    </button>
                    <select value={engagement.status} onChange={(event) => updateStatus(engagement.id, event.target.value)} className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1 text-xs text-[#2a4a80] focus:outline-none focus:ring-1 focus:ring-[#1f4f97]">
                      {["Draft", "InReview", "Approved", "Closed"].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <div className="rounded-xl border border-[#c9d5e6] bg-[#f8fbff] p-4">
        <p className="mb-1 text-xs font-semibold text-[#3a5480]">Workflow links</p>
        <div className="flex flex-wrap gap-2">
          {[["/intake", "Intake"], ["/scope", "Scope"], ["/inputs", "Inputs"], ["/control-mapping", "Controls"], ["/risk-exceptions", "Risk Register"], ["/audit-evidence", "Evidence Tracker"]].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md border border-[#c9d5e6] bg-white px-3 py-1 text-xs text-[#1f4f97] hover:bg-[#edf3fc] transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
