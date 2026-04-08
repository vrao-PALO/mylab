"use client";
import * as React from "react";
import { STORAGE_KEYS } from "@/lib/workflow-state";

export type RoleMode = "Architect" | "Presales" | "Auditor";

const DEFAULT_ROLE: RoleMode = "Architect";

const ROLES: { value: RoleMode; label: string; description: string }[] = [
  { value: "Architect", label: "Architect", description: "Security architecture, control mapping, risk assessment" },
  { value: "Presales", label: "Presales", description: "Client briefings, FI/GovTech overlays, presales Q&A" },
  { value: "Auditor", label: "Auditor", description: "Audit readiness, evidence collection, compliance gaps" },
];

function getSavedRole(): RoleMode {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const saved = window.localStorage.getItem(STORAGE_KEYS.role);
  if (saved === "Architect" || saved === "Presales" || saved === "Auditor") return saved;
  return DEFAULT_ROLE;
}

type RoleContextValue = {
  role: RoleMode;
  setRole: (next: RoleMode) => void;
};

export const RoleContext = React.createContext<RoleContextValue | null>(null);

export function useRole(): RoleMode {
  return React.useContext(RoleContext)?.role ?? DEFAULT_ROLE;
}

function persistRole(next: RoleMode) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEYS.role, next);
  window.dispatchEvent(new Event("storage"));
}

export function RoleModeProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<RoleMode>(DEFAULT_ROLE);

  React.useEffect(() => {
    const handler = () => setRole(getSavedRole());

    handler();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function updateRole(next: RoleMode) {
    setRole(next);
    persistRole(next);
  }

  return <RoleContext.Provider value={{ role, setRole: updateRole }}>{children}</RoleContext.Provider>;
}

export function RoleModeSelector() {
  const context = React.useContext(RoleContext);
  const role = context?.role ?? DEFAULT_ROLE;

  function onChange(next: RoleMode) {
    if (context) {
      context.setRole(next);
      return;
    }

    persistRole(next);
  }

  const current = ROLES.find((item) => item.value === role)!;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full px-2 py-0.5 text-xs font-semibold border
        ${role === "Auditor" ? "bg-amber-100 text-amber-700 border-amber-300" : role === "Presales" ? "bg-purple-100 text-purple-700 border-purple-300" : "bg-[#edf3fc] text-[#1f4f97] border-[#c9d5e6]"}`}
      >
        {role}
      </div>
      <select
        value={role}
        onChange={(event) => onChange(event.target.value as RoleMode)}
        title={current.description}
        className="rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-2 py-1 text-xs text-[#1b355f] focus:outline-none focus:ring-1 focus:ring-[#1f4f97]"
      >
        {ROLES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
