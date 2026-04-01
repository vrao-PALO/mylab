"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleModeSelector } from "@/components/role-mode";

const WORKFLOW_STEPS = [
  { href: "/intake",          label: "Intake",    step: 1 },
  { href: "/scope",           label: "Scope",     step: 2 },
  { href: "/inputs",          label: "Inputs",    step: 3 },
  { href: "/control-mapping", label: "Controls",  step: 4 },
  { href: "/risk-exceptions", label: "Risk",      step: 5 },
  { href: "/checklists",      label: "Checklist", step: 6 },
  { href: "/audit-evidence",  label: "Evidence",  step: 7 },
];

const OTHER_LINKS = [
  { href: "/",                   label: "Dashboard" },
  { href: "/plain-english",      label: "Plain English" },
  { href: "/industry/fi",        label: "FI" },
  { href: "/industry/govtech",   label: "GovTech" },
  { href: "/industry/generic",   label: "Presales" },
  { href: "/architecture-review",label: "Architecture" },
  { href: "/ai-governance",      label: "AI Gov" },
  { href: "/search",             label: "Search" },
  { href: "/engagement-package", label: "Engagements" },
];

const STEP_STORAGE_KEY = "workflow-visited-steps";

function loadVisited(): Set<string> {
  try {
    const stored = localStorage.getItem(STEP_STORAGE_KEY);
    return new Set(JSON.parse(stored ?? "[]") as string[]);
  } catch { return new Set(); }
}

function markVisited(href: string) {
  try {
    const visited = loadVisited();
    visited.add(href);
    localStorage.setItem(STEP_STORAGE_KEY, JSON.stringify([...visited]));
  } catch { /* ignore */ }
}

export function TopNav() {
  const pathname = usePathname();
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setVisited(loadVisited());
  }, []);

  useEffect(() => {
    if (pathname) {
      markVisited(pathname);
      setVisited(loadVisited());
    }
  }, [pathname]);

  const visitedSteps = WORKFLOW_STEPS.filter((s) => visited.has(s.href)).length;
  const pct = Math.round((visitedSteps / WORKFLOW_STEPS.length) * 100);

  return (
    <header className="border-b border-[#d9dee8] bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#4b5d79]">Security Architect Refresher</p>
            <h1 className="text-base font-semibold text-[#10203d] leading-tight">Audit Readiness Workflow</h1>
          </div>
          <div className="flex items-center gap-3">
            <RoleModeSelector />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden rounded-md border border-[#c9d5e6] px-3 py-1.5 text-xs text-[#2a4a80]">
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Workflow progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6a8ab0]">Workflow progress — {visitedSteps}/{WORKFLOW_STEPS.length} steps visited</span>
            <span className="text-xs font-semibold text-[#1f4f97]">{pct}%</span>
          </div>
          <div className="flex gap-0.5">
            {WORKFLOW_STEPS.map((s) => {
              const isVisited = visited.has(s.href);
              const isCurrent = pathname === s.href;
              return (
                <Link key={s.href} href={s.href} title={s.label}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${isCurrent ? "bg-[#1f4f97]" : isVisited ? "bg-[#7aa4d8]" : "bg-[#e1e8f3]"}`}
                />
              );
            })}
          </div>
          {/* Step labels — visible on large screens */}
          <div className="hidden lg:flex gap-0.5 mt-1">
            {WORKFLOW_STEPS.map((s) => {
              const isVisited = visited.has(s.href);
              const isCurrent = pathname === s.href;
              return (
                <Link key={s.href} href={s.href}
                  className={`flex-1 text-center text-[10px] leading-none py-1 rounded transition-colors truncate px-0.5
                    ${isCurrent ? "font-bold text-[#1f4f97]" : isVisited ? "text-[#4a7ab0]" : "text-[#a0b4cc]"}`}>
                  {s.step}. {s.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Nav links */}
        <nav className={`mt-3 flex-wrap gap-1.5 ${mobileOpen ? "flex" : "hidden lg:flex"}`}>
          {OTHER_LINKS.map((item) => {
            const isCurrent = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md border px-2.5 py-1 text-xs transition-colors
                  ${isCurrent ? "border-[#1f4f97] bg-[#1f4f97] text-white" : "border-[#b9c6da] bg-white text-[#1b355f] hover:bg-[#e9f0fb]"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}