"use client";
import Link from "next/link";
import { foundationRoutes } from "@/lib/workflow-data";
import { quickAnswers } from "@/lib/knowledge-base";
import { useRole, type RoleMode } from "@/components/role-mode";

const WORKFLOW = foundationRoutes.filter((route) =>
  ["/intake", "/scope", "/inputs", "/control-mapping", "/risk-exceptions", "/checklists", "/plain-english"].includes(route.path),
);
const REFERENCE = foundationRoutes.filter((route) =>
  ["/industry/fi", "/industry/govtech", "/industry/generic", "/audit-evidence", "/architecture-review", "/ai-governance"].includes(route.path),
);
const TOOLS = foundationRoutes.filter((route) =>
  ["/search", "/exports", "/engagement-package", "/pilot"].includes(route.path),
);

const ROLE_QUICK_LINKS: Record<RoleMode, { href: string; label: string; description: string }[]> = {
  Auditor: [
    { href: "/intake", label: "1. Start intake", description: "Capture engagement type, industry, and objectives" },
    { href: "/audit-evidence", label: "2. Evidence tracker", description: "Collect and verify all 18 audit evidence items" },
    { href: "/risk-exceptions", label: "3. Risk register", description: "Rate findings, assign owners, record exceptions" },
    { href: "/checklists", label: "4. Architecture checklist", description: "7-step structured review with evidence checkpoints" },
    { href: "/engagement-package", label: "5. Save engagement", description: "Save progress and resume later" },
  ],
  Presales: [
    { href: "/industry/fi", label: "FI compliance Q&A", description: "MAS TRM, VAPT, logging - live client answers" },
    { href: "/industry/govtech", label: "GovTech overlay", description: "PDPA, IM8, GovZTA presales guidance" },
    { href: "/industry/generic", label: "Presales briefing", description: "Discovery prompts, red flags, who-answers guide" },
    { href: "/plain-english", label: "Plain-English terms", description: "Explain technical controls to business stakeholders" },
    { href: "/search", label: "Search knowledge base", description: "Fast answers for live client discussions" },
  ],
  Architect: [
    { href: "/control-mapping", label: "Control mapping", description: "Map requirements to ISO, MAS TRM, NIST, OWASP" },
    { href: "/architecture-review", label: "Architecture review", description: "19 NAPTA-specific checks with pass/finding tracking" },
    { href: "/ai-governance", label: "AI governance", description: "18 AI platform controls - scoring, video, PDPA" },
    { href: "/risk-exceptions", label: "Risk & exceptions", description: "Severity rating, owners, exception records" },
    { href: "/checklists", label: "Stage checklists", description: "7-stage evidence-ready architecture review flow" },
  ],
};

const ROLE_BADGE: Record<RoleMode, string> = {
  Auditor: "bg-amber-100 text-amber-700 border-amber-300",
  Presales: "bg-purple-100 text-purple-700 border-purple-300",
  Architect: "bg-[#edf3fc] text-[#1f4f97] border-[#c9d5e6]",
};

export default function Home() {
  const role = useRole();
  const roleLinks = ROLE_QUICK_LINKS[role];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#10203d]">Security Architect Refresher</h2>
            <p className="mt-2 max-w-3xl text-sm text-[#33496f]">
              A mobile-ready reference tool for security architects across RFPs, audits, architecture reviews, and presales.
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[role]}`}>{role} mode</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["MAS TRM", "ISO 27001", "PDPA", "OWASP ASVS", "OWASP MASVS", "NIST 800-53", "CIS Controls v8", "SOC 2", "MTCS Tier 3"].map((framework) => (
            <span key={framework} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">{framework}</span>
          ))}
        </div>
      </div>

      <section>
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">{role} quick start</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {roleLinks.map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-xl border-2 border-[#c9d5e6] bg-white p-4 transition-all hover:border-[#1f4f97] hover:shadow-sm">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{item.label}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Guided workflow - all 7 steps</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {WORKFLOW.map((route) => (
            <Link key={route.path} href={route.path} className="group rounded-xl border border-[#c9d5e6] bg-white p-4 transition-all hover:border-[#1f4f97] hover:shadow-sm">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{route.title}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Industry and specialist reference</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {REFERENCE.map((route) => (
            <Link key={route.path} href={route.path} className="group rounded-xl border border-[#c9d5e6] bg-white p-4 transition-all hover:border-[#1f4f97] hover:shadow-sm">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{route.title}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Quick answers</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {quickAnswers.slice(0, 4).map((qa) => (
            <div key={qa.id} className="rounded-xl border border-[#c9d5e6] bg-white p-4">
              <p className="text-sm font-semibold text-[#15305a]">{qa.question}</p>
              <p className="mt-1 text-sm text-[#33496f]">{qa.answer}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {qa.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#edf3fc] px-2 py-0.5 text-xs text-[#1e3d6c]">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link href="/search" className="text-xs text-[#1f4f97] hover:underline">Search all content -&gt;</Link>
        </div>
      </section>

      <section>
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Tools</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {TOOLS.map((route) => (
            <Link key={route.path} href={route.path} className="group rounded-xl border border-[#c9d5e6] bg-white p-4 transition-all hover:border-[#1f4f97] hover:shadow-sm">
              <h4 className="text-sm font-semibold text-[#15305a] group-hover:text-[#1f4f97]">{route.title}</h4>
              <p className="mt-1 text-xs text-[#3f5579]">{route.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
