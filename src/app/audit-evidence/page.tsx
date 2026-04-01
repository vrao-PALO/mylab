const evidenceTemplates = [
  "Architecture review record",
  "Threat model and control decisions",
  "VAPT report and retest closure",
  "Role/access review evidence",
  "Risk exception approvals with expiry date",
  "Logging validation and retention settings",
];

export default function AuditEvidencePage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">11 Track Audit Readiness Evidence</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Maintain traceability from requirement to control to assurance test to evidence artifact.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Evidence checklist</h3>
        <ul className="mt-3 space-y-2 text-sm text-[#203659]">
          {evidenceTemplates.map((item) => (
            <li key={item} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
