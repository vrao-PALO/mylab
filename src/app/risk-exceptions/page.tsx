import { createRecordMetadata } from "@/lib/record-metadata";

const sampleRisks = [
  {
    id: "R-001",
    title: "Audit logging not active",
    severity: "Critical",
    owner: "Security Lead",
    status: "Open",
    metadata: createRecordMetadata("security.lead"),
  },
  {
    id: "R-002",
    title: "Data-layer RBAC incomplete",
    severity: "High",
    owner: "Platform Team",
    status: "Open",
    metadata: createRecordMetadata("platform.owner"),
  },
];

export default function RiskExceptionsPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">05 Produce Risk and Exception Advisory</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Track severity, owners, and exception metadata with clear advisory boundaries.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="space-y-3">
          {sampleRisks.map((risk) => (
            <div key={risk.id} className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4">
              <p className="text-sm font-semibold text-[#15305a]">
                {risk.id} | {risk.title}
              </p>
              <p className="mt-1 text-sm text-[#30476f]">
                Severity: {risk.severity} | Owner: {risk.owner} | Status: {risk.status}
              </p>
              <p className="mt-1 text-xs text-[#4a5f82]">
                Created: {risk.metadata.createdAt} | Updated: {risk.metadata.updatedAt} | Record owner: {risk.metadata.owner}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
