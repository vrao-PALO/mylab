"use client";

import { useMemo, useState } from "react";
import { getAllExportOptions } from "@/lib/export-templates";
import { Download, Package } from "lucide-react";

export default function ExportsPage() {
  const allOptions = getAllExportOptions();
  const [selectedId, setSelectedId] = useState(allOptions[0]?.id ?? "");

  const selected = useMemo(() => allOptions.find((t) => t.id === selectedId) ?? allOptions[0], [selectedId, allOptions]);
  const output = selected.generate();

  function downloadMarkdown() {
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selected.id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const isComposite = selected.isComposite;

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">Export Templates</h2>
            <p className="mt-2 text-sm text-[#33496f]">
              Generate export-ready Markdown for engagement summaries, risk registers, and audit evidence.
            </p>
          </div>
          {isComposite && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Package className="w-4 h-4" />
              Recommended
            </div>
          )}
        </div>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <label className="text-sm font-semibold text-[#15305a]">Select Template</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="mt-2 block w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm text-[#1b355f]"
        >
          {allOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
              {item.isComposite ? " ?" : ""}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-[#4a5f82]">{selected.description}</p>

        <div className="mt-4 rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4">
          <pre className="whitespace-pre-wrap text-xs text-[#253a5f]">{output}</pre>
        </div>

        <button
          type="button"
          onClick={downloadMarkdown}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-medium text-white hover:bg-[#173f79]"
        >
          <Download className="w-4 h-4" />
          Download Markdown
        </button>
      </article>
    </section>
  );
}

