const inputs = [
  { name: "PII and personal records", control: "PDPA mapping, retention, access control" },
  { name: "Financial and payroll data", control: "Least privilege, masking, audit logging" },
  { name: "AI model inputs and outputs", control: "Bias review, explainability, fallback rules" },
  { name: "Third-party integration payloads", control: "Protocol, trust boundary, owner" },
];

export default function InputsPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">03 Identify Data and Integration Inputs</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Map data classes and integration paths before framework control mapping.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Input matrix preview</h3>
        <div className="mt-3 overflow-hidden rounded-lg border border-[#d8e0ed]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#edf3fc] text-[#1e3d6c]">
              <tr>
                <th className="px-3 py-2 font-semibold">Input</th>
                <th className="px-3 py-2 font-semibold">Required control focus</th>
              </tr>
            </thead>
            <tbody>
              {inputs.map((row) => (
                <tr key={row.name} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
