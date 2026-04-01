"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-02")!;

const HOSTING = ["Cloud", "On-premises", "Hybrid"] as const;
const ENVS = ["dev", "test", "prod"] as const;
const EXPOSURE = ["Internet-facing", "Internal only", "Both"] as const;

const INDUSTRY_NOTES: Record<string, string> = {
  FI: "FI scope must cover transaction-sensitive functions, card/account data flows, fraud-related workflows, and privileged operational systems.",
  GovTech: "GovTech scope must cover citizen personal data, public-facing portals, officer/admin workflows, and inter-agency access boundaries.",
  Generic: "Generic scope: customer portal, document workflows, SaaS integration exposure, and vendor access paths.",
};

export default function ScopePage() {
  const [systems, setSystems] = useState("");
  const [hosting, setHosting] = useState<string[]>([]);
  const [envs, setEnvs] = useState<string[]>([]);
  const [exposure, setExposure] = useState("");
  const [roles, setRoles] = useState("");
  const [dataDomains, setDataDomains] = useState("");
  const [integrations, setIntegrations] = useState("");
  const [outOfScope, setOutOfScope] = useState("");
  const [thirdParty, setThirdParty] = useState("");
  const [industry, setIndustry] = useState("Generic");

  const toggle = <T extends string>(arr: T[], val: T, setter: (v: T[]) => void) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const complete = systems && envs.length && roles && dataDomains && integrations;

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">02 Define Assessment Scope</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          {complete && (
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">✓ Baseline set</span>
          )}
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Principle:</strong> {story.notes[3].content}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Systems and environment</h3>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Systems in scope *</label>
            <textarea
              value={systems}
              onChange={(e) => setSystems(e.target.value)}
              rows={2}
              placeholder="e.g. Customer portal API, Admin dashboard, ETL pipeline"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Hosting model</label>
            <div className="flex gap-2 flex-wrap">
              {HOSTING.map((h) => (
                <button
                  key={h}
                  onClick={() => toggle(hosting, h, setHosting)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    hosting.includes(h)
                      ? "bg-[#1f4f97] text-white border-[#1f4f97]"
                      : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Environments in scope *</label>
            <div className="flex gap-2">
              {ENVS.map((e) => (
                <button
                  key={e}
                  onClick={() => toggle(envs, e, setEnvs)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors uppercase ${
                    envs.includes(e)
                      ? "bg-[#1f4f97] text-white border-[#1f4f97]"
                      : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            {envs.includes("dev") && envs.includes("prod") && (
              <p className="mt-1 text-xs text-amber-600 font-medium">⚠ Dev and prod both in scope — confirm they are isolated with no direct access path.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Internet exposure</label>
            <select
              value={exposure}
              onChange={(e) => setExposure(e.target.value)}
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            >
              <option value="">Select…</option>
              {EXPOSURE.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </article>

        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Users, data and integrations</h3>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">User roles *</label>
            <input
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              placeholder="e.g. End user, Admin, Support agent, Auditor"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Data domains *</label>
            <input
              value={dataDomains}
              onChange={(e) => setDataDomains(e.target.value)}
              placeholder="e.g. PII, Financial, HR, Audit logs"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Integrations and third parties *</label>
            <textarea
              value={integrations}
              onChange={(e) => setIntegrations(e.target.value)}
              rows={2}
              placeholder="e.g. Napta HR API, Azure AD, Stripe payment gateway"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Third-party / vendor boundaries</label>
            <input
              value={thirdParty}
              onChange={(e) => setThirdParty(e.target.value)}
              placeholder="e.g. Stripe scoped to payment flow only"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3a5480] mb-1">Out-of-scope items with rationale</label>
            <textarea
              value={outOfScope}
              onChange={(e) => setOutOfScope(e.target.value)}
              rows={2}
              placeholder="e.g. Legacy billing system — decommissioned Q3 2026"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none"
            />
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Industry-specific scope note</h3>
        <div className="mb-3 flex gap-2">
          {["FI", "GovTech", "Generic"].map((ind) => (
            <button key={ind} onClick={() => setIndustry(ind)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                industry === ind ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
        <p className="text-sm text-[#273f67]">{INDUSTRY_NOTES[industry]}</p>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Acceptance criteria</h3>
        <ul className="space-y-1">
          {story.acceptanceCriteria.map((ac) => (
            <li key={ac.id} className="flex gap-2 text-sm text-[#273f67]">
              <span className="text-green-600 shrink-0">✓</span>
              <span>{ac.criterion}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
