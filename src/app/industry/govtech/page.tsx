const govtechFocus = [
  "Citizen data protection and lawful access",
  "Officer/admin role separation",
  "Privacy-aware logging and accountability",
  "Public trust and service continuity",
  "Inter-agency data sharing boundaries",
];

export default function GovTechIndustryPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">GovTech Overlay Guidance</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Public-sector emphasis points for citizen-facing services and internal officer workflows.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <ul className="space-y-2 text-sm text-[#203659]">
          {govtechFocus.map((item) => (
            <li key={item} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
