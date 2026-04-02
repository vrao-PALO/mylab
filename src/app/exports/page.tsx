"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Package, RefreshCcw } from "lucide-react";
import { getAllExportOptions } from "@/lib/export-templates";
import { getWorkflowExportContext, type WorkflowExportContext } from "@/lib/workflow-state";

export default function ExportsPage() {
  const allOptions = getAllExportOptions();
  const [selectedId, setSelectedId] = useState(allOptions[0]?.id ?? "");
  const [context, setContext] = useState<WorkflowExportContext>(getWorkflowExportContext);

  useEffect(() => {
    setContext(getWorkflowExportContext());
  }, []);

  const selected = useMemo(
    () => allOptions.find((template) => template.id === selectedId) ?? allOptions[0],
    [allOptions, selectedId],
  );
  const output = selected.generate(context);

  function downloadMarkdown() {
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selected.id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function refreshContext() {
    setContext(getWorkflowExportContext());
  }

  const isComposite = selected.isComposite;
  const blockerCount = context.riskRegister.risks.filter((risk) => risk.isGoLiveBlocker && risk.status === "Open").length;
  const evidenceCount = context.evidence.length;

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">Export Templates</h2>
            <p className="mt-2 text-sm text-[#33496f]">
              Generate Markdown directly from the current workflow state, risk register, and audit evidence tracker.
            </p>
          </div>
          {isComposite && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Package className="h-4 w-4" />
              Recommended
            </div>
          )}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-3 text-sm text-[#33496f]">
            <p className="text-xs uppercase tracking-[0.12em] text-[#6a8ab0]">Engagement</p>
            <p className="mt-1 font-semibold text-[#15305a]">{context.intake.engagementType ?? "TBD"} - {context.intake.industry ?? "TBD"}</p>
          </div>
          <div className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-3 text-sm text-[#33496f]">
            <p className="text-xs uppercase tracking-[0.12em] text-[#6a8ab0]">Open blockers</p>
            <p className="mt-1 font-semibold text-[#15305a]">{blockerCount}</p>
          </div>
          <div className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-3 text-sm text-[#33496f]">
            <p className="text-xs uppercase tracking-[0.12em] text-[#6a8ab0]">Evidence items</p>
            <p className="mt-1 font-semibold text-[#15305a]">{evidenceCount}</p>
          </div>
        </div>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <label className="text-sm font-semibold text-[#15305a]">Select template</label>
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-2 block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm text-[#1b355f]">
          {allOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-[#4a5f82]">{selected.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={refreshContext} className="inline-flex items-center gap-2 rounded-md border border-[#c9d5e6] bg-white px-4 py-2 text-sm font-medium text-[#1f4f97] hover:bg-[#edf3fc]">
            <RefreshCcw className="h-4 w-4" />
            Refresh from workflow state
          </button>
          <button type="button" onClick={downloadMarkdown} className="inline-flex items-center gap-2 rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-medium text-white hover:bg-[#173f79]">
            <Download className="h-4 w-4" />
            Download Markdown
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4">
          <pre className="whitespace-pre-wrap text-xs text-[#253a5f]">{output}</pre>
        </div>
      </article>
    </section>
  );
}
