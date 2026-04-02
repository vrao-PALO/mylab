import type { WorkflowExportContext } from "@/lib/workflow-state";

export interface ExportTemplate {
  id: string;
  title: string;
  description: string;
  generate: (context: WorkflowExportContext) => string;
}

const disclaimer =
  "Classification: Internal Advisory Content. Validate against official framework sources before external sharing.";

function listOrFallback(values: Array<string | undefined>, fallback = "TBD") {
  const cleaned = values.map((value) => value?.trim()).filter(Boolean) as string[];
  return cleaned.length > 0 ? cleaned.join(", ") : fallback;
}

function safeText(value: string | undefined, fallback = "TBD") {
  return value?.trim() ? value.trim() : fallback;
}

function escapeTable(value: string | undefined) {
  return safeText(value, "-").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function generatedDate() {
  return new Date().toISOString().split("T")[0];
}

export function generateEngagementSummary(context: WorkflowExportContext) {
  const openRisks = context.riskRegister.risks.filter((risk) => risk.status === "Open");
  const blockers = openRisks.filter((risk) => risk.isGoLiveBlocker);
  const evidenceCoverage = context.evidence.length
    ? `${context.evidence.filter((item) => item.status === "Collected" || item.status === "Verified").length}/${context.evidence.length}`
    : "0/0";

  return [
    "# Engagement Summary",
    "",
    disclaimer,
    "",
    `Generated: ${generatedDate()}`,
    `Role view: ${context.role}`,
    "",
    "## Engagement Context",
    `- Type: ${safeText(context.intake.engagementType)}`,
    `- Industry: ${safeText(context.intake.industry)}`,
    `- Business Objective: ${safeText(context.intake.businessObjective)}`,
    `- Expected Outcome: ${safeText(context.intake.expectedOutcome)}`,
    `- Success Criteria: ${safeText(context.intake.successCriteria)}`,
    `- Timeline: ${safeText(context.intake.timeline)}`,
    `- Constraints: ${safeText(context.intake.constraints)}`,
    "",
    "## Scope",
    `- Systems in scope: ${safeText(context.scope.systems)}`,
    `- Hosting model: ${listOrFallback(context.scope.hosting)}`,
    `- Environments: ${listOrFallback(context.scope.environments)}`,
    `- Exposure: ${safeText(context.scope.exposure)}`,
    `- User roles: ${safeText(context.scope.roles)}`,
    `- Data domains: ${safeText(context.scope.dataDomains)}`,
    `- Integrations: ${safeText(context.scope.integrations)}`,
    `- Third-party boundaries: ${safeText(context.scope.thirdParty, "None recorded")}`,
    `- Out of scope: ${safeText(context.scope.outOfScope, "None recorded")}`,
    "",
    "## Control Direction",
    `- Control mapping overlay: ${safeText(context.controlMapping.industry)}`,
    `- Requirements mapped: ${context.controlMapping.rows.length - context.controlMapping.rows.filter((row) => row.gap).length}`,
    `- Unmapped gaps: ${context.controlMapping.rows.filter((row) => row.gap).length}`,
    `- Open risks: ${openRisks.length}`,
    `- Go-live blockers: ${blockers.length}`,
    `- Evidence coverage: ${evidenceCoverage}`,
    "",
    "## Next Actions",
    ...blockers.slice(0, 5).map((risk) => `- Resolve ${risk.id}: ${risk.title}`),
    ...(blockers.length === 0 ? ["- No open go-live blockers recorded."] : []),
  ].join("\n");
}

export function generateRiskRegister(context: WorkflowExportContext) {
  const rows = context.riskRegister.risks.length
    ? context.riskRegister.risks.map(
        (risk) =>
          `| ${escapeTable(risk.id)} | ${escapeTable(risk.title)} | ${escapeTable(risk.severity)} | ${escapeTable(risk.owner)} | ${escapeTable(risk.exception?.compensatingControl)} | ${escapeTable(risk.status)} | ${escapeTable(risk.exception?.expiry ?? (risk.isGoLiveBlocker ? "Before go-live" : "TBD"))} |`,
      )
    : ["| - | No risks recorded | - | - | - | - | - |"]; 

  return [
    "# Risk Register",
    "",
    disclaimer,
    "",
    `Generated: ${generatedDate()}`,
    "",
    "| ID | Risk | Severity | Owner | Compensating Control | Status | Review Date |",
    "|----|------|----------|-------|----------------------|--------|-------------|",
    ...rows,
  ].join("\n");
}

export function generateAuditEvidencePack(context: WorkflowExportContext) {
  const rows = context.evidence.length
    ? context.evidence.map(
        (item) =>
          `| ${escapeTable(item.controlRef)} | ${escapeTable(item.category)} | ${escapeTable(item.title)} | ${escapeTable(item.link)} | ${escapeTable(item.notes)} | ${escapeTable(item.status)} |`,
      )
    : ["| - | - | No evidence items recorded | - | - | Pending |"]; 

  return [
    "# Audit Evidence Pack",
    "",
    disclaimer,
    "",
    `Generated: ${generatedDate()}`,
    "",
    "| Control | Category | Evidence Item | Evidence Link | Notes | Status |",
    "|---------|----------|---------------|---------------|-------|--------|",
    ...rows,
  ].join("\n");
}

export function generateEngagementPackage(context: WorkflowExportContext) {
  return [
    `# Complete Engagement Package`,
    "",
    `Generated: ${generatedDate()}`,
    "",
    disclaimer,
    "",
    generateEngagementSummary(context).replace(`${disclaimer}\n\n`, ""),
    "\n---\n",
    generateRiskRegister(context).replace(`${disclaimer}\n\n`, ""),
    "\n---\n",
    generateAuditEvidencePack(context).replace(`${disclaimer}\n\n`, ""),
  ].join("\n");
}

export const exportTemplates: ExportTemplate[] = [
  {
    id: "engagement-summary",
    title: "Engagement Summary",
    description: "Executive summary for intake, scope, risk posture, and next actions.",
    generate: generateEngagementSummary,
  },
  {
    id: "risk-register",
    title: "Risk Register",
    description: "Data-driven Markdown register for severity, owners, controls, and decision state.",
    generate: generateRiskRegister,
  },
  {
    id: "audit-evidence-pack",
    title: "Audit Evidence Pack",
    description: "Traceability template populated from the evidence tracker.",
    generate: generateAuditEvidencePack,
  },
];

export function getAllExportOptions(): Array<ExportTemplate & { isComposite?: boolean }> {
  return [
    ...exportTemplates,
    {
      id: "engagement-package",
      title: "Complete Engagement Package",
      description: "All-in-one file: summary, risk register, and audit evidence.",
      generate: generateEngagementPackage,
      isComposite: true,
    },
  ];
}
