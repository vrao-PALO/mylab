"use client";
import { useEffect, useState } from "react";

type EvidenceStatus = "Pending" | "Collected" | "Verified" | "N/A";

interface EvidenceItem {
  id: string;
  controlRef: string;
  category: string;
  title: string;
  description?: string;
  status: EvidenceStatus;
  link?: string;
  notes?: string;
  dueDate?: string;
  engagementId: string;
}

type Category = "All" | "Policy" | "Logs" | "Configuration" | "Test Results" | "Approvals" | "Architecture";

const CATEGORY_COLORS: Record<string, string> = {
  Policy:        "bg-blue-50 text-blue-700 border-blue-200",
  Logs:          "bg-purple-50 text-purple-700 border-purple-200",
  Configuration: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Test Results":"bg-orange-50 text-orange-700 border-orange-200",
  Approvals:     "bg-amber-50 text-amber-700 border-amber-200",
  Architecture:  "bg-[#edf3fc] text-[#1f4f97] border-[#c9d5e6]",
};

const STATUS_COLORS: Record<EvidenceStatus, string> = {
  Pending:   "bg-gray-100 text-gray-500 border-gray-300",
  Collected: "bg-amber-100 text-amber-700 border-amber-300",
  Verified:  "bg-green-100 text-green-700 border-green-300",
  "N/A":     "bg-gray-50 text-gray-400 border-gray-200",
};

const DEFAULT_EVIDENCE: Omit<EvidenceItem, "id" | "engagementId">[] = [
  { category: "Policy",        controlRef: "ISO 27001 A.5",  title: "Information security policy",             description: "Approved and published information security policy covering all key domains.", status: "Pending" },
  { category: "Policy",        controlRef: "PDPA Obligation", title: "Privacy notice / data protection policy", description: "Privacy notice presented to data subjects; internal DPO policy documented.", status: "Pending" },
  { category: "Policy",        controlRef: "ISO 27001 A.8",  title: "Data classification and handling policy",  description: "Policy defining INTERNAL / CONFIDENTIAL / FINANCIAL / AUDIT / PII handling rules.", status: "Pending" },
  { category: "Policy",        controlRef: "ISO 27001 A.12", title: "Backup and retention policy",              description: "Retention schedules per data class; backup frequency and restore SLA defined.", status: "Pending" },
  { category: "Configuration", controlRef: "CIS v8 Control 5", title: "MFA enforcement evidence",             description: "Screenshot or policy export showing MFA enforced for all production-access accounts.", status: "Pending" },
  { category: "Configuration", controlRef: "ISO 27001 A.9",  title: "RBAC / role assignment matrix",           description: "Export of current role-to-permission assignments; evidence of least-privilege review.", status: "Pending" },
  { category: "Configuration", controlRef: "CIS v8 Control 4", title: "Branch protection configuration",      description: "Screenshot of main branch protection rules: direct push blocked, SAST gate active, peer review required.", status: "Pending" },
  { category: "Configuration", controlRef: "NIST 800-53 SC",  title: "Secret scanning — no hardcoded credentials", description: "Output from gitleaks / truffleHog or GitHub secret scanning showing no active findings.", status: "Pending" },
  { category: "Logs",          controlRef: "MAS TRM 14.2",   title: "Audit log samples — authentication events", description: "Sample log entries covering: login, logout, failed login, privilege change, admin action.", status: "Pending" },
  { category: "Logs",          controlRef: "NIST 800-53 AU",  title: "Audit log retention validation",         description: "Evidence that logs are retained for the minimum required period (12 months for FI).", status: "Pending" },
  { category: "Logs",          controlRef: "ISO 27001 A.16",  title: "Incident response log",                  description: "Records of incidents, near-misses, or alerts raised and resolved in the last 12 months.", status: "Pending" },
  { category: "Test Results",  controlRef: "MAS TRM 14.1",   title: "VAPT report — latest",                    description: "Most recent VAPT report; Critical and High findings must show remediation evidence.", status: "Pending" },
  { category: "Test Results",  controlRef: "CIS v8 Control 16", title: "SAST scan results",                   description: "Latest CodeQL / SAST pipeline output; no unaddressed critical findings.", status: "Pending" },
  { category: "Test Results",  controlRef: "ISO 27001 A.17",  title: "DR / BCP test result",                   description: "Most recent DR test report with RTO/RPO results vs targets; signed off by management.", status: "Pending" },
  { category: "Approvals",     controlRef: "ISO 27001 A.6",   title: "Risk exception approvals",               description: "Signed risk exception records with justification, compensating controls, and expiry date.", status: "Pending" },
  { category: "Approvals",     controlRef: "PDPA Obligation",  title: "Data processing agreements (DPA)",      description: "Signed DPAs with all third-party processors handling personal data.", status: "Pending" },
  { category: "Architecture",  controlRef: "NIST 800-53 SA",  title: "Architecture diagram — current state",   description: "Up-to-date architecture diagram showing all systems, data flows, and trust boundaries.", status: "Pending" },
  { category: "Architecture",  controlRef: "ISO 27001 A.14",  title: "Secure SDLC process document",           description: "Evidence of secure SDLC: code review process, security testing in pipeline, deployment controls.", status: "Pending" },
];

const ENGAGEMENT_KEY = "form_intake-form";

function getEngagementLabel(): string {
  try {
    const stored = localStorage.getItem(ENGAGEMENT_KEY);
    if (!stored) return "Current engagement";
    const form = JSON.parse(stored);
    return `${form.engagementType ?? "Engagement"} — ${form.industry ?? ""} — ${form.timeline ?? ""}`.replace(/— $/g, "").trim();
  } catch { return "Current engagement"; }
}

const STORAGE_KEY = "evidence-items-v1";

function loadItems(): EvidenceItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as EvidenceItem[];
  } catch { /* ignore */ }
  return DEFAULT_EVIDENCE.map((e, i) => ({ ...e, id: `default-${i}`, engagementId: "local" }));
}

function saveItems(items: EvidenceItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

export default function AuditEvidencePage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [category, setCategory] = useState<Category>("All");
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | "All">("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editLink, setEditLink] = useState<Record<string, string>>({});
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [engagementLabel, setEngagementLabel] = useState("Current engagement");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Policy");
  const [newControlRef, setNewControlRef] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    setItems(loadItems());
    setEngagementLabel(getEngagementLabel());
  }, []);

  function updateItem(id: string, patch: Partial<EvidenceItem>) {
    setItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, ...patch } : i);
      saveItems(updated);
      return updated;
    });
  }

  function saveEdits(id: string) {
    const link = editLink[id];
    const notes = editNotes[id];
    if (link !== undefined || notes !== undefined) {
      updateItem(id, {
        ...(link !== undefined ? { link } : {}),
        ...(notes !== undefined ? { notes } : {}),
      });
    }
    setExpanded(null);
  }

  function addItem() {
    if (!newTitle.trim()) return;
    const item: EvidenceItem = {
      id: `custom-${Date.now()}`,
      engagementId: "local",
      controlRef: newControlRef.trim() || "Custom",
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      status: "Pending",
    };
    setItems((prev) => {
      const updated = [...prev, item];
      saveItems(updated);
      return updated;
    });
    setNewTitle(""); setNewControlRef(""); setNewDesc("");
    setShowAdd(false);
  }

  const filtered = items.filter((i) =>
    (category === "All" || i.category === category) &&
    (statusFilter === "All" || i.status === statusFilter)
  );

  const counts = {
    total: items.length,
    verified: items.filter((i) => i.status === "Verified").length,
    collected: items.filter((i) => i.status === "Collected").length,
    pending: items.filter((i) => i.status === "Pending").length,
  };
  const pct = Math.round(((counts.verified + counts.collected) / counts.total) * 100);

  function exportMarkdown() {
    const lines = [
      `# Audit Evidence Pack`,
      `**Engagement:** ${engagementLabel}`,
      `**Exported:** ${new Date().toLocaleDateString()}`,
      `**Coverage:** ${counts.verified + counts.collected}/${counts.total} items collected or verified (${pct}%)`,
      "",
      "| # | Category | Control Ref | Evidence Item | Status | Link |",
      "|---|---|---|---|---|---|",
      ...items.map((item, i) =>
        `| ${i + 1} | ${item.category} | ${item.controlRef} | ${item.title} | ${item.status} | ${item.link ?? "—"} |`
      ),
      "",
      "## Outstanding items",
      ...items.filter((i) => i.status === "Pending").map((i) => `- [ ] **${i.title}** (${i.controlRef})`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "audit-evidence-pack.md"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">11 Audit Evidence Tracker</h2>
            <p className="mt-1 text-sm text-[#33496f]">{engagementLabel}</p>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <button onClick={exportMarkdown}
              className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-1.5 text-xs font-medium text-[#2a4a80] hover:bg-[#edf3fc] transition-colors">
              Export as Markdown
            </button>
            <button onClick={() => setShowAdd(!showAdd)}
              className="rounded-md bg-[#1f4f97] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#183d7a] transition-colors">
              + Add evidence item
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#6a8ab0] mb-1">
            <span>Coverage: {counts.verified + counts.collected}/{counts.total} items collected or verified</span>
            <span className="font-semibold text-[#1f4f97]">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#e1e8f3] overflow-hidden">
            <div className="h-full rounded-full bg-[#1f4f97] transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex gap-3 text-xs flex-wrap">
            <span className="text-green-700 font-medium">{counts.verified} Verified</span>
            <span className="text-amber-700 font-medium">{counts.collected} Collected</span>
            <span className="text-gray-500">{counts.pending} Pending</span>
          </div>
        </div>
      </header>

      {/* Add form */}
      {showAdd && (
        <article className="rounded-xl border border-[#1f4f97] bg-white p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#10203d]">Add custom evidence item</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Title *</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Network segmentation diagram"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Category</label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                {["Policy","Logs","Configuration","Test Results","Approvals","Architecture"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Control reference</label>
              <input value={newControlRef} onChange={(e) => setNewControlRef(e.target.value)} placeholder="e.g. ISO 27001 A.13"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Description</label>
              <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What this evidence proves"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addItem} className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183d7a]">Add</button>
            <button onClick={() => setShowAdd(false)} className="rounded-md border border-[#c9d5e6] px-4 py-2 text-sm text-[#6a8ab0] hover:border-[#1f4f97]">Cancel</button>
          </div>
        </article>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-1">
        {(["All","Policy","Logs","Configuration","Test Results","Approvals","Architecture"] as Category[]).map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${category === c ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
          >{c}</button>
        ))}
        <div className="w-px bg-[#c9d5e6] mx-1" />
        {(["All","Pending","Collected","Verified","N/A"] as (EvidenceStatus | "All")[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${statusFilter === s ? "bg-[#10203d] text-white border-[#10203d]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#10203d]"}`}
          >{s}</button>
        ))}
      </div>

      {/* Evidence items */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const isOpen = expanded === item.id;
          return (
            <article key={item.id} className={`rounded-xl border bg-white overflow-hidden ${item.status === "Verified" ? "border-green-300" : item.status === "Collected" ? "border-amber-300" : "border-[#c9d5e6]"}`}>
              <button onClick={() => {
                setExpanded(isOpen ? null : item.id);
                if (!isOpen) {
                  setEditLink((prev) => ({ ...prev, [item.id]: item.link ?? "" }));
                  setEditNotes((prev) => ({ ...prev, [item.id]: item.notes ?? "" }));
                }
              }} className="w-full flex items-start justify-between p-4 text-left hover:bg-[#f8fbff] transition-colors">
                <div className="flex-1 pr-3">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>{item.category}</span>
                    <span className="rounded-full bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 text-xs font-mono">{item.controlRef}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                    {item.link && <span className="rounded-full bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 text-xs">🔗 linked</span>}
                  </div>
                  <p className="text-sm font-semibold text-[#10203d]">{item.title}</p>
                  {item.description && <p className="mt-0.5 text-xs text-[#4a6080]">{item.description}</p>}
                </div>
                <span className="text-[#6a8ab0] text-sm shrink-0">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-[#e4eaf4] p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-[#3a5480] mb-2">Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Pending","Collected","Verified","N/A"] as EvidenceStatus[]).map((s) => (
                        <button key={s} onClick={() => updateItem(item.id, { status: s })}
                          className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${item.status === s ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-white text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3a5480] mb-1">Evidence link (URL or file path)</label>
                    <input value={editLink[item.id] ?? ""} onChange={(e) => setEditLink((p) => ({ ...p, [item.id]: e.target.value }))}
                      placeholder="https://... or \\share\evidence\..."
                      className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3a5480] mb-1">Notes</label>
                    <textarea value={editNotes[item.id] ?? ""} onChange={(e) => setEditNotes((p) => ({ ...p, [item.id]: e.target.value }))}
                      rows={2} placeholder="Reviewer notes, caveats, or follow-up actions"
                      className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdits(item.id)}
                      className="rounded-md bg-[#1f4f97] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#183d7a]">Save</button>
                    <button onClick={() => setExpanded(null)}
                      className="rounded-md border border-[#c9d5e6] px-4 py-1.5 text-xs text-[#6a8ab0] hover:border-[#1f4f97]">Cancel</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Pending callout */}
      {counts.pending > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700 mb-1">{counts.pending} pending items — collect before presenting to auditors</p>
          <ul className="space-y-0.5 mt-1">
            {items.filter((i) => i.status === "Pending").slice(0, 5).map((i) => (
              <li key={i.id} className="text-xs text-amber-800 flex gap-2">
                <span className="font-mono text-amber-500">{i.controlRef}</span>
                <span>{i.title}</span>
              </li>
            ))}
            {items.filter((i) => i.status === "Pending").length > 5 && (
              <li className="text-xs text-amber-600 italic">…and {items.filter((i) => i.status === "Pending").length - 5} more</li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}