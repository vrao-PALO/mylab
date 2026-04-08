"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { getWorkflowExportContext, restoreWorkflowSnapshot } from "@/lib/workflow-state";

type EngagementRow = {
  id: string;
  title: string;
  status: string;
  industry: string;
  engagementType: string;
  businessObjective: string;
  timeline: string;
  createdAt: string;
  notes?: string | null;
  intake?: Record<string, unknown>;
  scope?: Record<string, unknown>;
  inputs?: unknown;
  workflow?: Record<string, unknown>;
};

const STATUS_OPTIONS = ["Draft", "InReview", "Approved", "Closed"] as const;

const initialForm = {
  title: "",
  status: "Draft",
  notes: "",
  intake: {
    engagementType: "Advisory",
    industry: "Generic",
    businessObjective: "",
    expectedOutcome: "",
    successCriteria: "",
    constraints: "",
    timeline: "",
  },
  scope: {},
  inputs: [],
};

function restoreEngagementWorkflow(engagement: EngagementRow) {
  restoreWorkflowSnapshot({
    ...(engagement.workflow ?? {}),
    intake: engagement.intake,
    scope: engagement.scope,
    inputs: engagement.inputs,
  });
}

export default function PilotPage() {
  const [rows, setRows] = useState<EngagementRow[]>([]);
  const [selected, setSelected] = useState<EngagementRow | null>(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready");

  const loadEngagement = useCallback(async (id: string, cachedRows?: EngagementRow[]) => {
    const cached = cachedRows?.find((row) => row.id === id);
    if (cached?.workflow || cached?.intake) {
      setSelected(cached);
      return;
    }

    const response = await fetch(`/api/engagements/${id}`, { cache: "no-store" });
    const payload = await response.json();
    if (payload.ok) {
      setSelected(payload.data as EngagementRow);
    }
  }, []);

  const loadRows = useCallback(async (selectId?: string | null) => {
    setLoading(true);
    setMessage("Loading engagements...");
    try {
      const response = await fetch("/api/engagements", { cache: "no-store" });
      const payload = await response.json();
      const data = (payload.data ?? []) as EngagementRow[];
      setRows(data);
      const preferredId = selectId === null ? undefined : selectId ?? selected?.id;
      const nextId = data.find((row) => row.id === preferredId)?.id ?? data[0]?.id;
      if (nextId) {
        await loadEngagement(nextId, data);
      } else {
        setSelected(null);
      }
      setMessage(`Loaded ${data.length} engagements`);
    } catch (error) {
      setMessage(`Failed to load: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, [loadEngagement, selected?.id]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  async function createEngagement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Creating engagement...");

    const workflow = getWorkflowExportContext();
    const response = await fetch("/api/engagements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        intake: { ...workflow.intake, ...form.intake },
        scope: workflow.scope,
        inputs: workflow.inputs,
        workflow: {
          ...workflow,
          intake: { ...workflow.intake, ...form.intake },
        },
      }),
    });

    if (!response.ok) {
      const failed = await response.json().catch(() => ({}));
      setLoading(false);
      setMessage(`Create failed: ${(failed as Record<string, string>).message ?? "Unknown error"}`);
      return;
    }

    const payload = await response.json();
    setForm(initialForm);
    await loadRows(payload.data?.id);
    setLoading(false);
    setMessage("Engagement created successfully");
  }

  async function updateSelected() {
    if (!selected) {
      return;
    }
    setLoading(true);
    setMessage("Saving changes...");

    const response = await fetch(`/api/engagements/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selected.title,
        status: selected.status,
        notes: selected.notes ?? "",
      }),
    });

    if (!response.ok) {
      setLoading(false);
      setMessage("Update failed");
      return;
    }

    await loadRows(selected.id);
    setLoading(false);
    setMessage("Engagement updated");
  }

  async function deleteSelected() {
    if (!selected) {
      return;
    }
    const deletedId = selected.id;
    setLoading(true);
    setMessage("Deleting engagement...");

    const response = await fetch(`/api/engagements/${selected.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setLoading(false);
      setMessage("Delete failed");
      return;
    }

    setSelected((current) => (current?.id === deletedId ? null : current));
    await loadRows(null);
    setLoading(false);
    setMessage("Engagement deleted");
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Pilot Console</h2>
        <p className="mt-2 text-sm text-[#33496f]">Live API-backed CRUD console for engagement creation, review, workflow restore, and cleanup.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Create engagement</h3>
          <form onSubmit={createEngagement} className="mt-4 space-y-4">
            <input type="text" placeholder="Engagement title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required className="block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm" />
            <div className="grid gap-3 md:grid-cols-2">
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-md border border-[#cfd8e6] px-3 py-2 text-sm">
                {STATUS_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <input type="text" placeholder="Industry" value={form.intake.industry} onChange={(event) => setForm({ ...form, intake: { ...form.intake, industry: event.target.value } })} className="rounded-md border border-[#cfd8e6] px-3 py-2 text-sm" />
            </div>
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} placeholder="Notes" className="block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm" />
            <button type="submit" disabled={loading} className="inline-block rounded-md bg-[#1f4f97] px-4 py-2 text-white hover:bg-[#173f79] disabled:bg-gray-400">
              {loading ? "Working..." : "Create"}
            </button>
            <p className="text-sm text-[#4a5f82]">{message}</p>
          </form>
        </article>

        <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Selected engagement</h3>
          {selected ? (
            <div className="mt-4 space-y-4">
              <input value={selected.title} onChange={(event) => setSelected({ ...selected, title: event.target.value })} className="block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm" />
              <select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value })} className="block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm">
                {STATUS_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <textarea value={selected.notes ?? ""} onChange={(event) => setSelected({ ...selected, notes: event.target.value })} rows={4} placeholder="Operational notes" className="block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm" />
              <div className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4 text-sm text-[#33496f]">
                <p><strong>Type:</strong> {selected.engagementType}</p>
                <p><strong>Industry:</strong> {selected.industry}</p>
                <p><strong>Timeline:</strong> {selected.timeline || "TBD"}</p>
                <p><strong>Objective:</strong> {selected.businessObjective || "TBD"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={updateSelected} className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#173f79]">Save changes</button>
                <button type="button" onClick={() => restoreEngagementWorkflow(selected)} className="rounded-md border border-[#1f4f97] bg-[#edf3fc] px-4 py-2 text-sm font-semibold text-[#1f4f97] hover:bg-[#dbe8fb]">Load into workflow</button>
                <button type="button" onClick={deleteSelected} className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#6a8ab0]">Select or create an engagement to inspect and update it.</p>
          )}
        </article>
      </div>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Recent engagements</h3>
          <button type="button" onClick={() => void loadRows()} className="text-xs text-[#1f4f97] hover:underline">Refresh</button>
        </div>
        <ul className="mt-3 space-y-2 text-sm">
          {rows.map((row) => (
            <li key={row.id} className={`rounded-md border p-3 ${selected?.id === row.id ? "border-[#1f4f97] bg-[#edf3fc]" : "border-[#d8e0ed] bg-[#f8fbff]"}`}>
              <button type="button" onClick={() => void loadEngagement(row.id)} className="w-full text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[#15305a]">{row.title}</span>
                  <span className="rounded-full border border-[#c9d5e6] px-2 py-0.5 text-xs text-[#1f4f97]">{row.status}</span>
                </div>
                <p className="mt-1 text-xs text-[#4a5f82]">{row.engagementType} - {row.industry} - {new Date(row.createdAt).toLocaleDateString()}</p>
              </button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
