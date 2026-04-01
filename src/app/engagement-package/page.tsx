"use client";

import { useState } from "react";
import { generateEngagementPackage } from "@/lib/export-templates";
import { Download, File, CheckCircle } from "lucide-react";

export default function EngagementPackagePage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);

  function downloadPackage() {
    setIsDownloading(true);
    try {
      const output = generateEngagementPackage();
      const timestamp = new Date().toISOString().split("T")[0];
      const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `engagement-package-${timestamp}.md`;
      anchor.click();
      URL.revokeObjectURL(url);

      setJustDownloaded(true);
      setTimeout(() => setJustDownloaded(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#10203d]">📦 Generate Engagement Package</h2>
        <p className="mt-3 text-sm text-[#33496f] leading-relaxed">
          One-click export combining your engagement summary, risk register, and audit evidence pack into a single
          professional Markdown document. Perfect for sharing with your team or client.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
        <File className="mx-auto h-12 w-12 text-[#1f4f97] mb-4" />

        <h3 className="text-lg font-semibold text-[#10203d] mb-2">Complete Engagement Package</h3>
        <p className="text-sm text-[#4a5f82] mb-6">
          Includes all sections: summary, risk register, and audit evidence traceability.
        </p>

        <button
          type="button"
          onClick={downloadPackage}
          disabled={isDownloading || justDownloaded}
          className={`inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg transition-all ${
            justDownloaded
              ? "bg-green-600 text-white"
              : "bg-[#1f4f97] text-white hover:bg-[#173f79] disabled:bg-gray-400"
          }`}
        >
          {justDownloaded ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Downloaded!
            </>
          ) : isDownloading ? (
            <>
              <div className="animate-spin">⟳</div>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Package
            </>
          )}
        </button>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-lg font-semibold text-[#10203d] mb-4">What is Included</h3>
        <ul className="space-y-3 text-sm text-[#33496f]">
          <li className="flex gap-3">
            <span className="text-lg">✅</span>
            <span>
              <strong>Engagement Summary:</strong> Intake context, scope, and control direction
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">✅</span>
            <span>
              <strong>Risk Register:</strong> Severity, ownership, compensating controls, and status tracking
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">✅</span>
            <span>
              <strong>Audit Evidence Pack:</strong> Requirement-to-evidence traceability matrix
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">✅</span>
            <span>
              <strong>Classification Banner:</strong> Internal Advisory Content disclaimer included in document
            </span>
          </li>
        </ul>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-gray-50 p-6">
        <h3 className="text-sm font-semibold text-[#15305a] uppercase tracking-wide mb-3">💡 Tips</h3>
        <ul className="space-y-2 text-xs text-[#4a5f82]">
          <li>• Edit the Markdown file in your favorite editor before sharing</li>
          <li>• Include stakeholder names and dates when sending to team/client</li>
          <li>• Use the risk register to track remediation status over time</li>
          <li>• Archive downloaded packages for compliance audit trails</li>
        </ul>
      </article>
    </section>
  );
}
