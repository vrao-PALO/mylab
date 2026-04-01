const checklist = [
  "Systems and services in scope",
  "Users and role groups",
  "Data domains and sensitivity tiers",
  "Environment segregation (dev, test, prod)",
  "Integrations and third-party boundaries",
  "Out-of-scope items with rationale",
];

export default function ScopePage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">02 Define Assessment Scope</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Create explicit boundaries for effort, control coverage, and accountability.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Scope checklist</h3>
        <div className="mt-3 space-y-2">
          {checklist.map((item) => (
            <div key={item} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-3 py-2 text-sm text-[#203659]">
              {item}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
