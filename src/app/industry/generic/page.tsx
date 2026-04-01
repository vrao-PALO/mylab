const baseline = [
  { name: "OWASP ASVS", purpose: "Application security requirements baseline" },
  { name: "OWASP WSTG", purpose: "Web/API testing methodology" },
  { name: "CIS Controls v8", purpose: "Prioritized safeguard implementation" },
  { name: "NIST SP 800-53", purpose: "Deep security and privacy control catalog" },
  { name: "PDPA", purpose: "Singapore personal data obligations" },
];

export default function GenericIndustryPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Generic Industry Baseline</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Cross-sector control stack for education, real estate, insurance, and SaaS workflows.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="overflow-hidden rounded-lg border border-[#d8e0ed]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#edf3fc] text-[#1e3d6c]">
              <tr>
                <th className="px-3 py-2 font-semibold">Framework</th>
                <th className="px-3 py-2 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {baseline.map((row) => (
                <tr key={row.name} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
