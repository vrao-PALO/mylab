const aiControls = [
  "Model transparency for scoring rationale",
  "Bias metrics and regression testing cadence",
  "Fallback rules for low-confidence model outputs",
  "Video retention and secure disposal policy",
  "Role-based video and analytics access",
  "PDPA consent and cross-border transfer checks",
  "SSO/session controls for institutional users",
];

export default function AiGovernancePage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">13 AI Governance Controls</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Governance checks for AI-assisted interview and analytics platforms under PDPA and enterprise control expectations.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <ul className="space-y-2 text-sm text-[#203659]">
          {aiControls.map((item) => (
            <li key={item} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
