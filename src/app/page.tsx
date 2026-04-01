import Link from "next/link";
import { foundationRoutes } from "@/lib/workflow-data";
import { quickAnswers } from "@/lib/knowledge-base";

const WORKFLOW = foundationRoutes.filter((r) =>
  ["/intake", "/scope", "/inputs", "/control-mapping", "/risk-exceptions", "/checklists", "/plain-english"].includes(r.path)
);

const REFERENCE = foundationRoutes.filter((r) =>
  ["/industry/fi", "/industry/govtech", "/industry/generic", "/audit-evidence", "/architecture-review", "/ai-governance"].includes(r.path)
);

const TOOLS = foundationRoutes.filter((r) =>
  ["/search", "/exports", "/engagement-package", "/pilot"].includes(r.path)
);

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#10203d]">Security Architect Refresher</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#33496f]">
          A mobile-ready reference tool for security architects across RFPs, audits, architecture reviews, and presales.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["MAS TRM", "ISO 27001", "PDPA", "OWASP ASVS", "OWASP MASVS", "NIST 800-53", "CIS Controls v8", "SOC 2", "MTCS Tier 3"].map((fw) => (
            <span key={fw} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">{fw}</span>
          ))}
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480] px-1">Guided workflow</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {WORKFLOW.map((route) => (
            <Link key={route.path} href={route.path} className="rounded-xl border border-[#c9d5e6] bg-white p-4 hover:border-[#1f4f97] hover:shadow-sm transition-all group">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{route.title}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480] px-1">Industry and specialist reference</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {REFERENCE.map((route) => (
            <Link key={route.path} href={route.path} className="rounded-xl border border-[#c9d5e6] bg-white p-4 hover:border-[#1f4f97] hover:shadow-sm transition-all group">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{route.title}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480] px-1">Quick answers</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {quickAnswers.slice(0, 4).map((qa) => (
            <div key={qa.id} className="rounded-xl border border-[#c9d5e6] bg-white p-4">
              <p className="text-sm font-semibold text-[#15305a]">{qa.question}</p>
              <p className="mt-1 text-sm text-[#33496f]">{qa.answer}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {qa.tags.map((t) => <span key={t} className="rounded-full bg-[#edf3fc] px-2 py-0.5 text-xs text-[#1e3d6c]">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link href="/search" className="text-xs text-[#1f4f97] hover:underline">Search all content</Link>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480] px-1">Tools</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {TOOLS.map((route) => (
            <Link key={route.path} href={route.path} className="rounded-xl border border-[#c9d5e6] bg-white p-4 hover:border-[#1f4f97] hover:shadow-sm transition-all group">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{route.title}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}