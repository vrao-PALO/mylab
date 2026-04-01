import Link from "next/link";
import { RoleModeSelector } from "@/components/role-mode";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/pilot", label: "Pilot" },
  { href: "/intake", label: "Intake" },
  { href: "/scope", label: "Scope" },
  { href: "/inputs", label: "Inputs" },
  { href: "/control-mapping", label: "Controls" },
  { href: "/risk-exceptions", label: "Risk" },
  { href: "/checklists", label: "Checklists" },
  { href: "/plain-english", label: "Plain English" },
  { href: "/industry/fi", label: "FI" },
  { href: "/audit-evidence", label: "Evidence" },
  { href: "/architecture-review", label: "Architecture" },
  { href: "/ai-governance", label: "AI Governance" },
  { href: "/search", label: "Search" },
  { href: "/exports", label: "Exports" },
  { href: "/engagement-package", label: "Package" },
];

export function TopNav() {
  return (
    <header className="border-b border-[#d9dee8] bg-[#f8fafc]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#4b5d79]">Security Architect Refresher</p>
          <h1 className="text-lg font-semibold text-[#10203d]">Workflow Foundation</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-[#b9c6da] bg-white px-3 py-1.5 text-sm text-[#1b355f] transition hover:bg-[#e9f0fb]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <RoleModeSelector />
        </div>
      </div>
    </header>
  );
}