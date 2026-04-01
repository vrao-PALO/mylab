const fields = [
  "Engagement type",
  "Industry",
  "Business objective",
  "Expected outcome",
  "Success criteria",
  "Constraints",
  "Timeline",
];

export default function IntakePage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">01 Capture Engagement Requirement</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Record the core request and business context so security guidance is aligned early.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Required fields</h3>
        <ul className="mt-3 grid gap-2 text-sm text-[#203659] md:grid-cols-2">
          {fields.map((item) => (
            <li key={item} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
