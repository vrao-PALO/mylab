const reviewFlow = [
  "Step 1 Intake and context gathering",
  "Step 2 Identify trust boundaries and high-risk components",
  "Step 3 Derive security requirements",
  "Step 4 Review design controls",
  "Step 5 Determine assurance activities",
  "Step 6 Identify gaps and recommend actions",
  "Step 7 Document closure and residual risk",
];

export default function ArchitectureReviewPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">12 Internal Platform Architecture Review</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Structured review path for platforms such as NAPTA with segregation, RBAC, and observability controls.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <ul className="space-y-2 text-sm text-[#203659]">
          {reviewFlow.map((item) => (
            <li key={item} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
