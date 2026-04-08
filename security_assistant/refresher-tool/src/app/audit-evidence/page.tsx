"use client";

import { useState } from "react";
import { useRole } from "@/components/role-mode";
import { STORAGE_KEYS, type EvidenceItem, type EvidenceStatus } from "@/lib/workflow-state";

type Category = "All" | "Policy" | "Logs" | "Configuration" | "Test Results" | "Approvals" | "Architecture";

const CATEGORY_COLORS: Record<string, string> = {
  Policy: "bg-blue-50 text-blue-700 border-blue-200",
  Logs: "bg-purple-50 text-purple-700 border-purple-200",
  Configuration: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Test Results": "bg-orange-50 text-orange-700 border-orange-200",
  Approvals: "bg-amber-50 text-amber-700 border-amber-200",
  Architecture: "bg-[#edf3fc] text-[#1f4f97] border-[#c9d5e6]",
};

const STATUS_COLORS: Record<EvidenceStatus, string> = {
  Pending: "bg-gray-100 text-gray-500 border-gray-300",
  Collected: "bg-amber-100 text-amber-700 border-amber-300",
  Verified: "bg-green-100 text-green-700 border-green-300",
  "N/A": "bg-gray-50 text-gray-400 border-gray-200",
};

const DEFAULT_EVIDENCE: Omit<EvidenceItem, "id" | "engagementId">[] = [
  { category: "Policy", controlRef: "ISO 27001 A.5", title: "Information security policy", description: "Approved and published information security policy covering all key domains.", status: "Pending" },
  { category: "Policy", controlRef: "PDPA Obligation", title: "Privacy notice or data protection policy", description: "Privacy notice presented to data subjects; internal DPO policy documented.", status: "Pending" },
  { category: "Policy", controlRef: "ISO 27001 A.8", title: "Data classification and handling policy", description: "Policy defining INTERNAL, CONFIDENTIAL, FINANCIAL, AUDIT, and PII handling rules.", status: "Pending" },
  { category: "Policy", controlRef: "ISO 27001 A.12", title: "Backup and retention policy", description: "Retention schedules per data class; backup frequency and restore SLA defined.", status: "Pending" },
  { category: "Configuration", controlRef: "CIS v8 Control 5", title: "MFA enforcement evidence", description: "Screenshot or policy export showing MFA enforced for all production-access accounts.", status: "Pending" },
  { category: "Configuration", controlRef: "ISO 27001 A.9", title: "RBAC or role assignment matrix", description: "Export of current role-to-permission assignments; evidence of least-privilege review.", status: "Pending" },
  { category: "Configuration", controlRef: "CIS v8 Control 4", title: "Branch protection configuration", description: "Screenshot of main branch protection rules: direct push blocked, SAST gate active, peer review required.", status: "Pending" },
  { category: "Configuration", controlRef: "NIST 800-53 SC", title: "Secret scanning - no hardcoded credentials", description: "Output from secret scanning showing no active findings.", status: "Pending" },
  { category: "Logs", controlRef: "MAS TRM 14.2", title: "Audit log samples - authentication events", description: "Sample log entries covering login, logout, failed login, privilege change, and admin action.", status: "Pending" },
  { category: "Logs", controlRef: "NIST 800-53 AU", title: "Audit log retention validation", description: "Evidence that logs are retained for the minimum required period (12 months for FI).", status: "Pending" },
  { category: "Logs", controlRef: "ISO 27001 A.16", title: "Incident response log", description: "Records of incidents, near-misses, or alerts raised and resolved in the last 12 months.", status: "Pending" },
  { category: "Test Results", controlRef: "MAS TRM 14.1", title: "VAPT report - latest", description: "Most recent VAPT report; Critical and High findings must show remediation evidence.", status: "Pending" },
  { category: "Test Results", controlRef: "CIS v8 Control 16", title: "SAST scan results", description: "Latest CodeQL or SAST pipeline output; no unaddressed critical findings.", status: "Pending" },
  { category: "Test Results", controlRef: "ISO 27001 A.17", title: "DR or BCP test result", description: "Most recent DR test report with RTO or RPO results vs targets; signed off by management.", status: "Pending" },
  { category: "Approvals", controlRef: "ISO 27001 A.6", title: "Risk exception approvals", description: "Signed risk exception records with justification, compensating controls, and expiry date.", status: "Pending" },
  { category: "Approvals", controlRef: "PDPA Obligation", title: "Data processing agreements (DPA)", description: "Signed DPAs with all third-party processors handling personal data.", status: "Pending" },
  { category: "Architecture", controlRef: "NIST 800-53 SA", title: "Architecture diagram - current state", description: "Up-to-date architecture diagram showing all systems, data flows, and trust boundaries.", status: "Pending" },
  { category: "Architecture", controlRef: "ISO 27001 A.14", title: "Secure SDLC process document", description: "Evidence of secure SDLC: code review process, security testing in pipeline, deployment controls.", status: "Pending" },
];

function getEngagementLabel(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.intake);
    if (!stored) return "Current engagement";
    const form = JSON.parse(stored);
    return `${form.engagementType ?? "Engagement"} - ${form.industry ?? ""} - ${form.timeline ?? ""}`.replace(/-\s*$/, "").trim();
  } catch {
    return "Current engagement";
  }
}

function loadItems(): EvidenceItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.evidence);
    if (stored) return JSON.parse(stored) as EvidenceItem[];
  } catch {
    return [];
  }
  return DEFAULT_EVIDENCE.map((item, index) => ({ ...item, id: `default-${index}`, engagementId: "local" }));
}

function saveItems(items: EvidenceItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.evidence, JSON.stringify(items));
  } catch {
    // ignore storage failures in the browser
  }
}

export default function AuditEvidencePage() {
  const role = useRole();
  const canEdit = role !== "Presales";
  const [items, setItems] = useState<EvidenceItem[]>(loadItems);
  const [category, setCategory] = useState<Category>("All");
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | "All">("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editLink, setEditLink] = useState<Record<string, string>>({});
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [engagementLabel] = useState(getEngagementLabel);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Policy");
  const [newControlRef, setNewControlRef] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function updateItem(id: string, patch: Partial<EvidenceItem>) {
    setItems((previous) => {
      const updated = previous.map((item) => (item.id === id ? { ...item, ...patch } : item));
      saveItems(updated);
      return updated;
    });
  }

  function saveEdits(id: string) {
    const link = editLink[id];
    const notes = editNotes[id];
    updateItem(id, {
      ...(link !== undefined ? { link } : {}),
      ...(notes !== undefined ? { notes } : {}),
    });
    setExpanded(null);
  }

  function addItem() {
    if (!newTitle.trim() || !canEdit) return;
    const item: EvidenceItem = {
      id: `custom-${Date.now()}`,
      engagementId: "local",
      controlRef: newControlRef.trim() || "Custom",
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      status: "Pending",
    };
    setItems((previous) => {
      const updated = [...previous, item];
      saveItems(updated);
      return updated;
    });
    setNewTitle("");
    setNewControlRef("");
    setNewDesc("");
    setShowAdd(false);
  }

  const filtered = items.filter((item) => (category === "All" || item.category === category) && (statusFilter === "All" || item.status === statusFilter));
  const counts = {
    total: items.length,
    verified: items.filter((item) => item.status === "Verified").length,
    collected: items.filter((item) => item.status === "Collected").length,
    pending: items.filter((item) => item.status === "Pending").length,
  };
  const pct = counts.total > 0 ? Math.round(((counts.verified + counts.collected) / counts.total) * 100) : 0;

  function exportMarkdown() {
    const lines = [
      "# Audit Evidence Pack",
      `**Engagement:** ${engagementLabel}`,
      `**Exported:** ${new Date().toISOString().split("T")[0]}`,
      `**Coverage:** ${counts.verified + counts.collected}/${counts.total} items collected or verified (${pct}%)`,
      "",
      "| # | Category | Control Ref | Evidence Item | Status | Link |",
      "|---|---|---|---|---|---|",
      ...items.map((item, index) => `| ${index + 1} | ${item.category} | ${item.controlRef} | ${item.title} | ${item.status} | ${item.link ?? "-"} |`),
      "",
      "## Outstanding items",
      ...items.filter((item) => item.status === "Pending").map((item) => `- [ ] **${item.title}** (${item.controlRef})`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "audit-evidence-pack.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">11 Audit Evidence Tracker</h2>
            <p className="mt-1 text-sm text-[#33496f]">{engagementLabel}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" onClick={exportMarkdown} className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-1.5 text-xs font-medium text-[#2a4a80] hover:bg-[#edf3fc] transition-colors">
              Export as Markdown
            </button>
            {canEdit && (
              <button type="button" onClick={() => setShowAdd(!showAdd)} className="rounded-md bg-[#1f4f97] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#183d7a] transition-colors">
                Add evidence item
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-4 py-3 text-xs text-[#33496f]">
          <strong>{role} focus:</strong>{" "}
          {role === "Architect"
            ? "Use this tracker to prove the control design actually has supporting artefacts before sign-off."
            : role === "Auditor"
              ? "Treat this as the working evidence register. Status, links, and notes should support independent review."
              : "Presales mode keeps the tracker read-only so client-facing walkthroughs do not look like formal evidence acceptance."}
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-[#6a8ab0]">
            <span>Coverage: {counts.verified + counts.collected}/{counts.total} items collected or verified</span>
            <span className="font-semibold text-[#1f4f97]">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e1e8f3]">
            <div className="h-full rounded-full bg-[#1f4f97] transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <span className="font-medium text-green-700">{counts.verified} Verified</span>
            <span className="font-medium text-amber-700">{counts.collected} Collected</span>
            <span className="text-gray-500">{counts.pending} Pending</span>
          </div>
        </div>
      </header>

      {showAdd && canEdit && (
        <article className="rounded-xl border border-[#1f4f97] bg-white p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#10203d]">Add custom evidence item</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#3a5480]">Title *</label>
              <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="e.g. Network segmentation diagram" className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#3a5480]">Category</label>
              <select value={newCategory} onChange={(event) => setNewCategory(event.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                {["Policy", "Logs", "Configuration", "Test Results", "Approvals", "Architecture"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#3a5480]">Control reference</label>
              <input value={newControlRef} onChange={(event) => setNewControlRef(event.target.value)} placeholder="e.g. ISO 27001 A.13" className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#3a5480]">Description</label>
              <input value={newDesc} onChange={(event) => setNewDesc(event.target.value)} placeholder="What this evidence proves" className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={addItem} className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183d7a]">Add</button>
            <button type="button" onClick={() => setShowAdd(false)} className="rounded-md border border-[#c9d5e6] px-4 py-2 text-sm text-[#6a8ab0] hover:border-[#1f4f97]">Cancel</button>
          </div>
        </article>
      )}

      <div className="flex flex-wrap gap-1">
        {(["All", "Policy", "Logs", "Configuration", "Test Results", "Approvals", "Architecture"] as Category[]).map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${category === item ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}>
            {item}
          </button>
        ))}
        <div className="mx-1 w-px bg-[#c9d5e6]" />
        {(["All", "Pending", "Collected", "Verified", "N/A"] as Array<EvidenceStatus | "All">).map((item) => (
          <button key={item} type="button" onClick={() => setStatusFilter(item)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${statusFilter === item ? "bg-[#10203d] text-white border-[#10203d]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#10203d]"}`}>
            {item}
          </button>
        ))}
      </div>

      {role === "Presales" && (
        <div className="rounded-xl border border-[#c9d5e6] bg-white p-4 text-sm text-[#33496f]">
          <p className="font-semibold text-[#15305a]">Read-only summary</p>
          <p className="mt-1">Use this view to discuss evidence coverage and outstanding categories without editing audit records.</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((item) => {
          const isOpen = expanded === item.id;
          return (
            <article key={item.id} className={`overflow-hidden rounded-xl border bg-white ${item.status === "Verified" ? "border-green-300" : item.status === "Collected" ? "border-amber-300" : "border-[#c9d5e6]"}`}>
              <button
                type="button"
                onClick={() => {
                  setExpanded(isOpen ? null : item.id);
                  if (!isOpen) {
                    setEditLink((previous) => ({ ...previous, [item.id]: item.link ?? "" }));
                    setEditNotes((previous) => ({ ...previous, [item.id]: item.notes ?? "" }));
                  }
                }}
                className="w-full p-4 text-left hover:bg-[#f8fbff] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 pr-3">
                    <div className="mb-1 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>{item.category}</span>
                      <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-500">{item.controlRef}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                      {item.link && <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700">Linked</span>}
                    </div>
                    <p className="text-sm font-semibold text-[#10203d]">{item.title}</p>
                    {item.description && <p className="mt-0.5 text-xs text-[#4a6080]">{item.description}</p>}
                  </div>
                  <span className="shrink-0 text-sm text-[#6a8ab0]">{isOpen ? "?" : "?"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-[#e4eaf4] p-4">
                  {canEdit ? (
                    <div>
                      <p className="mb-2 text-xs font-semibold text-[#3a5480]">Status</p>
                      <div className="flex flex-wrap gap-2">
                        {(["Pending", "Collected", "Verified", "N/A"] as EvidenceStatus[]).map((status) => (
                          <button key={status} type="button" onClick={() => updateItem(item.id, { status })} className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${item.status === status ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-white text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}>
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#4a6080]">Status is read-only in Presales mode.</p>
                  )}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3a5480]">Evidence link (URL or file path)</label>
                    <input value={editLink[item.id] ?? ""} onChange={(event) => setEditLink((previous) => ({ ...previous, [item.id]: event.target.value }))} readOnly={!canEdit} placeholder="https://... or \\share\evidence\..." className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] read-only:cursor-not-allowed read-only:opacity-70" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3a5480]">Notes</label>
                    <textarea value={editNotes[item.id] ?? ""} onChange={(event) => setEditNotes((previous) => ({ ...previous, [item.id]: event.target.value }))} readOnly={!canEdit} rows={2} placeholder="Reviewer notes, caveats, or follow-up actions" className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] read-only:cursor-not-allowed read-only:opacity-70" />
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => saveEdits(item.id)} className="rounded-md bg-[#1f4f97] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#183d7a]">Save</button>
                      <button type="button" onClick={() => setExpanded(null)} className="rounded-md border border-[#c9d5e6] px-4 py-1.5 text-xs text-[#6a8ab0] hover:border-[#1f4f97]">Cancel</button>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {counts.pending > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-1 text-xs font-semibold text-amber-700">{counts.pending} pending items - collect before presenting to auditors</p>
          <ul className="mt-1 space-y-0.5">
            {items.filter((item) => item.status === "Pending").slice(0, 5).map((item) => (
              <li key={item.id} className="flex gap-2 text-xs text-amber-800">
                <span className="font-mono text-amber-500">{item.controlRef}</span>
                <span>{item.title}</span>
              </li>
            ))}
            {items.filter((item) => item.status === "Pending").length > 5 && (
              <li className="text-xs italic text-amber-600">...and {items.filter((item) => item.status === "Pending").length - 5} more</li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}


