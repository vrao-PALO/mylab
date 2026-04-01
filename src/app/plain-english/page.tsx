const translations = [
  {
    topic: "Least privilege",
    technical: "Access is constrained by role and function with periodic review.",
    business: "People only see what they need, so mistakes and misuse are reduced.",
  },
  {
    topic: "Defense in depth",
    technical: "Multiple controls are layered across identity, app, API, and monitoring.",
    business: "If one lock fails, others still protect the business.",
  },
  {
    topic: "Auditability",
    technical: "Security-relevant actions are attributable and retained for investigation.",
    business: "We can prove what happened, who did it, and when.",
  },
];

export default function PlainEnglishPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">07 Generate Plain-English Explanations</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Translate technical controls into business-friendly communication for non-technical stakeholders.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="space-y-3">
          {translations.map((row) => (
            <div key={row.topic} className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4">
              <h3 className="text-sm font-semibold text-[#15305a]">{row.topic}</h3>
              <p className="mt-1 text-sm text-[#30476f]">Technical: {row.technical}</p>
              <p className="mt-1 text-sm text-[#30476f]">Business: {row.business}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
