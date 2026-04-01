interface ExportTemplate {
  id: string;
  title: string;
  description: string;
  generate: () => string;
}

const disclaimer =
  "Classification: Internal Advisory Content. Validate against official framework sources before external sharing.";

export const exportTemplates: ExportTemplate[] = [
  {
    id: "engagement-summary",
    title: "Engagement Summary",
    description: "Executive summary for intake, scope, and key control direction.",
    generate: () => `# Engagement Summary\n\n${disclaimer}\n\n## Engagement Context\n- Type:\n- Industry:\n- Business Objective:\n- Timeline:\n\n## Scope\n- In scope:\n- Out of scope:\n\n## Control Direction\n- Primary frameworks:\n- Top risks:\n- Next actions:\n`,
  },
  {
    id: "risk-register",
    title: "Risk Register",
    description: "Template for severity, owners, controls, and decision state.",
    generate: () => `# Risk Register\n\n${disclaimer}\n\n| ID | Risk | Severity | Owner | Compensating Control | Status | Review Date |\n|----|------|----------|-------|----------------------|--------|-------------|\n| R-001 |  |  |  |  | Open |  |\n`,
  },
  {
    id: "audit-evidence-pack",
    title: "Audit Evidence Pack",
    description: "Traceability template from requirement to evidence artifact.",
    generate: () => `# Audit Evidence Pack\n\n${disclaimer}\n\n| Requirement | Control | Test/Assurance Activity | Evidence Artifact | Owner | Status |\n|-------------|---------|-------------------------|-------------------|-------|--------|\n|  |  |  |  |  |  |\n`,
  },
];

/**
 * Composite engagement package combining all three core templates.
 * Generates a single markdown file with all sections.
 */
export function generateEngagementPackage(): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const title = `# Complete Engagement Package\n\nGenerated: ${timestamp}\n\n${disclaimer}`;

  const sections = exportTemplates
    .map((t) => {
      // Remove disclaimer from individual sections to avoid duplication
      const content = t.generate().replace(disclaimer, "").trim();
      return `\n---\n\n${content}`;
    })
    .join("\n");

  return `${title}${sections}`;
}

/**
 * Get all templates plus the composite package option.
 */
export function getAllExportOptions(): Array<ExportTemplate & { isComposite?: boolean }> {
  return [
    ...exportTemplates,
    {
      id: "engagement-package",
      title: "Complete Engagement Package",
      description:
        "All-in-one file: summary + risk register + audit evidence (recommended for sharing with team/client)",
      generate: generateEngagementPackage,
      isComposite: true,
    },
  ];
}