"use client";

import { useFormPersistence } from "@/lib/use-form-persistence";
import { stories } from "@/lib/knowledge-base";
import { EMPTY_SCOPE_STATE, type ScopeFormState } from "@/lib/workflow-state";
import { useRole } from "@/components/role-mode";

const story = stories.find((s) => s.id === "story-02")!;

const HOSTING = ["Cloud", "On-premises", "Hybrid"] as const;
const ENVS = ["dev", "test", "prod"] as const;
const EXPOSURE = ["Internet-facing", "Internal only", "Both"] as const;

const INDUSTRY_NOTES: Record<string, string> = {
  FI: "FI scope must cover transaction-sensitive functions, card/account data flows, fraud-related workflows, and privileged operational systems.",
  GovTech: "GovTech scope must cover citizen personal data, public-facing portals, officer/admin workflows, and inter-agency access boundaries.",
  Generic: "Generic scope: customer portal, document workflows, SaaS integration exposure, and vendor access paths.",
};

const ROLE_NOTES = {
  Architect: "Capture the real trust boundaries, environment split, and privileged paths. This page feeds control mapping and design review.",
  Presales: "Keep the scope statement crisp and client-safe. Focus on assumptions, third-party boundaries, and what is explicitly out of scope.",
  Auditor: "Document enough detail that another reviewer can test scope completeness and challenge unsupported exclusions.",
} as const;

export default function ScopePage() {
  const role = useRole();
  const [form, setForm] = useFormPersistence<ScopeFormState>("scope", EMPTY_SCOPE_STATE);

  const toggle = <T extends string>(arr: T[], val: T, key: keyof ScopeFormState) => {
    setForm({
      ...form,
      [key]: arr.includes(val) ? arr.filter((item) => item !== val) : [...arr, val],
    } as ScopeFormState);
  };

  const complete = Boolean(form.systems && form.environments.length && form.roles && form.dataDomains && form.integrations);
  const showAcceptanceCriteria = role !== "Presales";

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">02 Define Assessment Scope</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          {complete && (
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Baseline set</span>
          )}
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Principle:</strong> {story.notes[3].content}
        </div>
        <div className="mt-3 rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-4 py-3 text-xs text-[#33496f]">
          <strong>{role} focus:</strong> {ROLE_NOTES[role]}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Systems and environment</h3>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Systems in scope *</label>
            <textarea
              value={form.systems}
              onChange={(event) => setForm({ ...form, systems: event.target.value })}
              rows={2}
              placeholder="e.g. Customer portal API, Admin dashboard, ETL pipeline"
              className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Hosting model</label>
            <div className="flex flex-wrap gap-2">
              {HOSTING.map((hosting) => (
                <button
                  key={hosting}
                  type="button"
                  onClick={() => toggle(form.hosting, hosting, "hosting")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.hosting.includes(hosting)
                      ? "bg-[#1f4f97] text-white border-[#1f4f97]"
                      : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
                  }`}
                >
                  {hosting}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Environments in scope *</label>
            <div className="flex gap-2">
              {ENVS.map((environment) => (
                <button
                  key={environment}
                  type="button"
                  onClick={() => toggle(form.environments, environment, "environments")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium uppercase transition-colors ${
                    form.environments.includes(environment)
                      ? "bg-[#1f4f97] text-white border-[#1f4f97]"
                      : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
                  }`}
                >
                  {environment}
                </button>
              ))}
            </div>
            {form.environments.includes("dev") && form.environments.includes("prod") && (
              <p className="mt-1 text-xs font-medium text-amber-600">Dev and prod are both in scope. Confirm they are isolated with no direct access path.</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Internet exposure</label>
            <select
              value={form.exposure}
              onChange={(event) => setForm({ ...form, exposure: event.target.value })}
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            >
              <option value="">Select...</option>
              {EXPOSURE.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </article>

        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Users, data and integrations</h3>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">User roles *</label>
            <input
              value={form.roles}
              onChange={(event) => setForm({ ...form, roles: event.target.value })}
              placeholder="e.g. End user, Admin, Support agent, Auditor"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Data domains *</label>
            <input
              value={form.dataDomains}
              onChange={(event) => setForm({ ...form, dataDomains: event.target.value })}
              placeholder="e.g. PII, Financial, HR, Audit logs"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Integrations and third parties *</label>
            <textarea
              value={form.integrations}
              onChange={(event) => setForm({ ...form, integrations: event.target.value })}
              rows={2}
              placeholder="e.g. Napta HR API, Azure AD, Stripe payment gateway"
              className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Third-party and vendor boundaries</label>
            <input
              value={form.thirdParty}
              onChange={(event) => setForm({ ...form, thirdParty: event.target.value })}
              placeholder="e.g. Stripe scoped to payment flow only"
              className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#3a5480]">Out-of-scope items with rationale</label>
            <textarea
              value={form.outOfScope}
              onChange={(event) => setForm({ ...form, outOfScope: event.target.value })}
              rows={2}
              placeholder="e.g. Legacy billing system - decommissioned Q3 2026"
              className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]"
            />
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Industry-specific scope note</h3>
        <div className="mb-3 flex gap-2">
          {["FI", "GovTech", "Generic"].map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => setForm({ ...form, industry })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                form.industry === industry
                  ? "bg-[#1f4f97] text-white border-[#1f4f97]"
                  : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
        <p className="text-sm text-[#273f67]">{INDUSTRY_NOTES[form.industry] ?? INDUSTRY_NOTES.Generic}</p>
      </article>

      {role === "Presales" ? (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Presales framing</h3>
          <ul className="space-y-1 text-sm text-[#273f67]">
            <li>State the primary systems and environments without exposing internal-only implementation detail.</li>
            <li>Call out any third-party boundary that requires client clarification or assumption sign-off.</li>
            <li>Keep the out-of-scope statement explicit so residual pricing and liability stay bounded.</li>
          </ul>
        </article>
      ) : (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Acceptance criteria</h3>
          <ul className="space-y-1">
            {showAcceptanceCriteria && story.acceptanceCriteria.map((criterion) => (
              <li key={criterion.id} className="flex gap-2 text-sm text-[#273f67]">
                <span className="shrink-0 text-green-600">?</span>
                <span>{criterion.criterion}</span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
