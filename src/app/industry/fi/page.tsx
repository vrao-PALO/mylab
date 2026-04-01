const fiQuestions = [
  {
    q: "How do you enforce access controls for customer and card data?",
    a: "Use strong authentication, strict server-side authorization, object-level access checks, and privileged role segregation.",
  },
  {
    q: "What testing depth is expected before go-live?",
    a: "Perform authenticated web/API testing, authorization abuse testing, and retest closure for critical findings.",
  },
  {
    q: "How is MAS TRM alignment demonstrated?",
    a: "Map control intent to governance, SDLC, testing, logging, and third-party risk expectations with evidence.",
  },
];

export default function FiIndustryPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">09 FI Compliance Quick Answers</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          MAS TRM-focused support for financial institution discussions and presales responses.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Common client questions</h3>
        <div className="mt-3 space-y-3">
          {fiQuestions.map((row) => (
            <div key={row.q} className="rounded-lg border border-[#d8e0ed] bg-[#f8fbff] p-4">
              <p className="text-sm font-semibold text-[#15305a]">Q: {row.q}</p>
              <p className="mt-1 text-sm text-[#30476f]">A: {row.a}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
