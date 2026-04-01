"use client";

import { FormEvent, useEffect, useCallback, useMemo, useState } from "react";

type EngagementRow = {
  id: string;
  title: string;
  status: string;
  industry: string;
  engagementType: string;
  createdAt: string;
};

const initialForm = {
  title: "",
  status: "Draft",
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

export default function PilotPage() {
  const [rows, setRows] = useState<EngagementRow[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready");

  const loadRows = useCallback(async () => {
    setLoading(true);
    setMessage("Loading engagements...");
    try {
      const response = await fetch("/api/engagements", { cache: "no-store" });
      const payload = await response.json();
      setRows(payload.data ?? []);
      setMessage(`Loaded ${payload.data?.length ?? 0} engagements`);
    } catch (error) {
      setMessage(`Failed to load: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  async function createEngagement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("Creating engagement...");

    const response = await fetch("/api/engagements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const failed = await response.json().catch(() => ({}));
      setLoading(false);
      setMessage(`Create failed: ${(failed as Record<string, string>).message ?? "Unknown error"}`);
      return;
    }

    setForm(initialForm);
    await loadRows();
    setLoading(false);
    setMessage("Engagement created successfully");
  }

  const latest = useMemo(() => rows.slice(0, 5), [rows]);

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Pilot Console</h2>
        <p className="mt-2 text-sm text-[#33496f]"></p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Create Engagement</h3>
        <form onSubmit={createEngagement} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Engagement title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-block px-4 py-2 bg-[#1f4f97] text-white rounded-md hover:bg-[#173f79] disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <p className="text-sm text-[#4a5f82]">{message}</p>
        </form>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Recent Engagements</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {latest.map((row) => (
            <li key={row.id} className="p-2 border border-[#d8e0ed] rounded-md bg-[#f8fbff]">
              {row.title} ({row.status})
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
