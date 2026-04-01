const rows = [
  { requirement: "Object-level authorization", frameworks: "MAS TRM, OWASP ASVS, ISO 27001" },
  { requirement: "Sensitive data masking in logs", frameworks: "PDPA, SOC 2, CIS Controls" },
  { requirement: "Privileged access auditability", frameworks: "NIST 800-53, MAS TRM, ISO 27001" },
  { requirement: "Mobile security controls", frameworks: "OWASP MASVS, OWASP ASVS" },
];

export default function ControlMappingPage() {
  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">04 Map Requirements to Framework Controls</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Link each requirement to one or more frameworks for defensible control rationale.
        </p>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="overflow-hidden rounded-lg border border-[#d8e0ed]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#edf3fc] text-[#1e3d6c]">
              <tr>
                <th className="px-3 py-2 font-semibold">Requirement</th>
                <th className="px-3 py-2 font-semibold">Mapped framework(s)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.requirement} className="border-t border-[#e1e8f3] bg-white text-[#273f67]">
                  <td className="px-3 py-2">{row.requirement}</td>
                  <td className="px-3 py-2">{row.frameworks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
