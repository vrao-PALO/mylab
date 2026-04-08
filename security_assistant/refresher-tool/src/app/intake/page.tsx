"use client";
import Link from "next/link";
import { useState } from "react";
import { useFormPersistence } from "@/lib/use-form-persistence";
import { EMPTY_BASELINES_STATE, type WorkflowBaselinesState } from "@/lib/workflow-state";
import { getLatestIntakeBaseline, hasIntakeBaselineChanged, storeIntakeBaseline } from "@/lib/baseline-history";
import type { RequirementIntake } from "@/types/domain";
import { stories } from "@/lib/knowledge-base";
import { frameworkPacks } from "@/lib/data/frameworks";
import { deriveIntakeGuidance } from "@/lib/intake-guidance";

const story = stories.find((s) => s.id === "story-01")!;

const ENGAGEMENT_TYPES = ["RFP", "RFQ", "Assessment", "Internal Audit", "Advisory"] as const;
const INDUSTRIES = ["FI", "GovTech", "Education", "Real Estate", "Generic"] as const;
const RESPONDER_PERSONAS = ["Security Architect", "Solution Architect", "Presales Lead", "Internal Auditor"] as const;
const DELIVERY_MODELS = ["New SaaS", "Existing SaaS", "Internal Platform", "Third-Party Service", "Hybrid"] as const;
const HOSTING_MODELS = ["Cloud Hosted", "Client Hosted", "Hybrid", "Unknown"] as const;
const EXTERNAL_EXPOSURES = ["Internal Only", "Partner Facing", "Internet Facing"] as const;
const DATA_RESIDENCIES = ["Local Only", "Regional", "Global", "Unknown"] as const;
const YES_NO_CHOICES = ["Yes", "No"] as const;

const INITIAL_FORM: RequirementIntake = {
  engagementType: "" as RequirementIntake["engagementType"],
  industry: "" as RequirementIntake["industry"],
  responderPersona: "" as RequirementIntake["responderPersona"],
  deliveryModel: "" as RequirementIntake["deliveryModel"],
  hostingModel: "" as RequirementIntake["hostingModel"],
  externalExposure: "" as RequirementIntake["externalExposure"],
  dataResidency: "" as RequirementIntake["dataResidency"],
  storesPersonalData: "" as RequirementIntake["storesPersonalData"],
  storesFinancialData: "" as RequirementIntake["storesFinancialData"],
  hasPrivilegedAccess: "" as RequirementIntake["hasPrivilegedAccess"],
  usesAi: "" as RequirementIntake["usesAi"],
  businessObjective: "",
  expectedOutcome: "",
  successCriteria: "",
  constraints: "",
  timeline: "",
};

interface ActionStep {
  number: number;
  title: string;
  why: string;
  whatToPrepare: string[];
  route: string;
  linkLabel: string;
  keyEvidence?: string;
}

function getActionPlan(engagementType: string, industry: string): ActionStep[] {
  const isAudit = engagementType === "Internal Audit";
  const isRfp = engagementType === "RFP" || engagementType === "RFQ";
  const isFi = industry === "FI";
  const isGovTech = industry === "GovTech";

  if (isAudit) {
    return [
      {
        number: 1,
        title: "Define the audit scope",
        why: "An auditor must clearly state what systems, environments, data, and user roles are in scope and what is explicitly excluded.",
        whatToPrepare: [
          "List all systems and applications to be audited",
          "Identify which environments are in scope",
          "Document data types handled",
          "List all user roles and their access levels",
          "State what is out of scope and why",
        ],
        route: "/scope",
        linkLabel: "Define scope ->",
        keyEvidence: "Scope statement signed by audit sponsor",
      },
      {
        number: 2,
        title: "Identify data flows and integrations",
        why: "Auditors need to know where sensitive data moves, which systems send it, which receive it, and over what protocols.",
        whatToPrepare: [
          "Catalogue inbound and outbound data flows",
          "Classify each data element",
          "Identify third-party integrations and API connections",
          "Flag any AI components processing personal data",
          "Confirm encryption in transit and at rest",
        ],
        route: "/inputs",
        linkLabel: "Catalogue data inputs ->",
        keyEvidence: "Data flow diagram and data classification register",
      },
      {
        number: 3,
        title: "Map controls to compliance frameworks",
        why: "Internal audit assesses whether your controls cover what the relevant frameworks require.",
        whatToPrepare: [
          isFi ? "Map every control gap to MAS TRM or ISO 27001 clauses" : "Map every control gap to ISO 27001, PDPA, and NIST 800-53",
          "Identify which controls are implemented, partial, or missing",
          "Document evidence for each claimed control",
          "Flag expired or untested evidence",
          isGovTech ? "Check IM8 and GovZTA baseline controls" : "Check OWASP ASVS for internet-facing applications",
        ],
        route: "/control-mapping",
        linkLabel: "Map controls ->",
        keyEvidence: "Control mapping matrix with gap analysis",
      },
      {
        number: 4,
        title: "Assess risks and record exceptions",
        why: "Every unmitigated gap becomes a risk finding that needs a severity, an owner, and a remediation or exception decision.",
        whatToPrepare: [
          "Rate each gap Critical, High, Medium, or Low",
          "Assign a named owner to every open risk",
          "Determine whether to remediate, mitigate, accept, or transfer",
          "Prepare formal exception records where needed",
          "Identify blockers for go-live or regulatory submission",
        ],
        route: "/risk-exceptions",
        linkLabel: "Build risk register ->",
        keyEvidence: "Risk register with severity, owner, status, and exception records",
      },
      {
        number: 5,
        title: "Complete the architecture review checklist",
        why: "Auditors check whether the technical architecture follows secure design principles such as least privilege, segmentation, and auditability.",
        whatToPrepare: [
          "Walk through the 7-stage architecture review checklist",
          "Evidence each control as pass, finding, or not applicable",
          "Verify audit logging is active and tamper-evident",
          "Confirm access controls are enforced server-side",
          "Check CI/CD controls such as branch protection and scanning",
        ],
        route: "/checklists",
        linkLabel: "Run architecture review ->",
        keyEvidence: "Completed checklist with pass and finding status",
      },
      {
        number: 6,
        title: "Collect and organise audit evidence",
        why: "Each control claim needs an artefact tied to it such as a screenshot, log extract, policy document, or test result.",
        whatToPrepare: [
          "Collect policy documents",
          "Export log samples showing audit events",
          "Gather the latest VAPT report and remediation evidence",
          "Compile the latest DR test report",
          "Save MFA enforcement and RBAC configuration evidence",
        ],
        route: "/audit-evidence",
        linkLabel: "Track audit evidence ->",
        keyEvidence: "Evidence pack mapped to each control and risk finding",
      },
      {
        number: 7,
        title: "Produce plain-English summary for management",
        why: "Management needs a clear, jargon-free summary of what was found, what risk it represents, and what decision they need to make.",
        whatToPrepare: [
          "Summarise findings in business terms",
          "State the business impact of each critical and high finding",
          "Show a simple pass, finding, and exception view",
          "Present the remediation roadmap with owners and deadlines",
          "Identify any go or no-go decision",
        ],
        route: "/plain-english",
        linkLabel: "Generate plain-English brief ->",
        keyEvidence: "Management summary signed off by audit sponsor",
      },
    ];
  }

  if (isRfp) {
    return [
      {
        number: 1,
        title: "Define scope of solution",
        why: "RFP and RFQ responses must clearly bound what you are proposing.",
        whatToPrepare: ["List systems and components in your proposal", "State what is out of scope", "Define assumptions and dependencies"],
        route: "/scope",
        linkLabel: "Define scope ->",
      },
      {
        number: 2,
        title: "Identify data and integration points",
        why: "Clients will ask which data moves between which systems and why.",
        whatToPrepare: ["List all data exchanged", "Identify third-party integrations", "Classify data sensitivity"],
        route: "/inputs",
        linkLabel: "Catalogue inputs ->",
      },
      {
        number: 3,
        title: "Map solution to framework controls",
        why: "Most bids need a control mapping table that demonstrates how requirements are met or where gaps remain.",
        whatToPrepare: ["Map each client requirement to a framework clause", "Identify known gaps and how they will be addressed"],
        route: "/control-mapping",
        linkLabel: "Map controls ->",
      },
      {
        number: 4,
        title: "Prepare risk and exception disclosures",
        why: "Clients expect honest disclosure of residual risks and how they are handled.",
        whatToPrepare: ["List known residual risks", "Prepare exception justifications", "Define remediation timelines"],
        route: "/risk-exceptions",
        linkLabel: "Build risk register ->",
      },
      {
        number: 5,
        title: "Run presales security briefing",
        why: "Use the industry overlay to pressure-test the response before submission.",
        whatToPrepare: ["Review the relevant industry overlay", "Prepare discovery questions for the client", "Check the red-flag list"],
        route: isFi ? "/industry/fi" : isGovTech ? "/industry/govtech" : "/industry/generic",
        linkLabel: "Open presales guide ->",
      },
    ];
  }

  return [
    {
      number: 1,
      title: "Define assessment scope",
      why: "Without a clear scope, assessment findings will not be actionable.",
      whatToPrepare: ["List all in-scope systems", "State environments", "Define data domains and user roles"],
      route: "/scope",
      linkLabel: "Define scope ->",
    },
    {
      number: 2,
      title: "Catalogue data and integrations",
      why: "Data flows are often the highest-risk attack surface and should be mapped before reviewing controls.",
      whatToPrepare: ["List and classify all data flows", "Identify third-party integrations", "Flag AI or high-risk components"],
      route: "/inputs",
      linkLabel: "Catalogue inputs ->",
    },
    {
      number: 3,
      title: "Map to relevant frameworks",
      why: "Control mapping shows where the organisation stands against the frameworks relevant to its obligations.",
      whatToPrepare: ["Identify applicable frameworks", "Map each control as implemented, partial, or gap", "Document supporting evidence"],
      route: "/control-mapping",
      linkLabel: "Map controls ->",
    },
    {
      number: 4,
      title: "Identify and rate risks",
      why: "Gaps need severity, ownership, and a concrete next action.",
      whatToPrepare: ["Rate each gap", "Assign owners", "Define remediation plan or exception"],
      route: "/risk-exceptions",
      linkLabel: "Build risk register ->",
    },
    {
      number: 5,
      title: "Complete architecture review",
      why: "Work through the structured checklist to validate the technical design against secure architecture principles.",
      whatToPrepare: ["Access architecture diagrams", "Confirm observability and logging stack", "Verify access-control design"],
      route: "/checklists",
      linkLabel: "Run checklist ->",
    },
    {
      number: 6,
      title: "Communicate findings clearly",
      why: "Translate findings into language that business owners and management can act on.",
      whatToPrepare: ["Prepare a plain-English summary", "Map findings to business impact"],
      route: "/plain-english",
      linkLabel: "Generate plain-English brief ->",
    },
  ];
}

const STEP_COLORS = ["bg-[#1f4f97]", "bg-[#2a6ab8]", "bg-[#3278c8]", "bg-[#4088d8]", "bg-[#4e98e0]", "bg-[#5aa8e8]", "bg-[#4e98e0]"];

function renderSelectOptions(values: readonly string[]) {
  return values.map((value) => (
    <option key={value}>{value}</option>
  ));
}

export default function IntakePage() {
  const [storedForm, setForm] = useFormPersistence<RequirementIntake>("intake-form", INITIAL_FORM);
  const [baselines, setBaselines] = useFormPersistence<WorkflowBaselinesState>("baselines", EMPTY_BASELINES_STATE);
  const form = { ...INITIAL_FORM, ...storedForm };
  const {
    engagementType,
    industry,
    responderPersona,
    deliveryModel,
    hostingModel,
    externalExposure,
    dataResidency,
    storesPersonalData,
    storesFinancialData,
    hasPrivilegedAccess,
    usesAi,
    constraints,
    timeline,
  } = form;
  const objective = form.businessObjective;
  const outcome = form.expectedOutcome;
  const success = form.successCriteria;
  const setEngagementType = (value: string) => setForm({ ...form, engagementType: value as RequirementIntake["engagementType"] });
  const setIndustry = (value: string) => setForm({ ...form, industry: value as RequirementIntake["industry"] });
  const setResponderPersona = (value: string) => setForm({ ...form, responderPersona: value as RequirementIntake["responderPersona"] });
  const setDeliveryModel = (value: string) => setForm({ ...form, deliveryModel: value as RequirementIntake["deliveryModel"] });
  const setHostingModel = (value: string) => setForm({ ...form, hostingModel: value as RequirementIntake["hostingModel"] });
  const setExternalExposure = (value: string) => setForm({ ...form, externalExposure: value as RequirementIntake["externalExposure"] });
  const setDataResidency = (value: string) => setForm({ ...form, dataResidency: value as RequirementIntake["dataResidency"] });
  const setStoresPersonalData = (value: string) => setForm({ ...form, storesPersonalData: value as RequirementIntake["storesPersonalData"] });
  const setStoresFinancialData = (value: string) => setForm({ ...form, storesFinancialData: value as RequirementIntake["storesFinancialData"] });
  const setHasPrivilegedAccess = (value: string) => setForm({ ...form, hasPrivilegedAccess: value as RequirementIntake["hasPrivilegedAccess"] });
  const setUsesAi = (value: string) => setForm({ ...form, usesAi: value as RequirementIntake["usesAi"] });
  const setObjective = (value: string) => setForm({ ...form, businessObjective: value });
  const setOutcome = (value: string) => setForm({ ...form, expectedOutcome: value });
  const setSuccess = (value: string) => setForm({ ...form, successCriteria: value });
  const setConstraints = (value: string) => setForm({ ...form, constraints: value });
  const setTimeline = (value: string) => setForm({ ...form, timeline: value });
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const latestIntakeBaseline = getLatestIntakeBaseline(baselines);
  const intakeChanged = hasIntakeBaselineChanged(form, baselines);

  const saveIntakeBaseline = () => {
    if (!complete || !intakeChanged) return;
    setBaselines(storeIntakeBaseline(baselines, form));
  };

  const complete = Boolean(
    engagementType &&
      industry &&
      responderPersona &&
      deliveryModel &&
      hostingModel &&
      externalExposure &&
      dataResidency &&
      storesPersonalData &&
      storesFinancialData &&
      hasPrivilegedAccess &&
      usesAi &&
      objective.length >= 10 &&
      outcome.length >= 10 &&
      success.length >= 10 &&
      constraints &&
      timeline,
  );

  const guidance = complete ? deriveIntakeGuidance(form) : null;
  const applicableFrameworks = guidance?.frameworkIds ?? [];
  const actionPlan = complete ? getActionPlan(engagementType, industry) : [];

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">01 Capture Engagement Requirement</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          {complete && (
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Ready - guidance and action plan generated
            </span>
          )}
        </div>
      </header>

      {(complete || latestIntakeBaseline) && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Intake baseline history</h3>
              <p className="mt-1 text-sm text-[#33496f]">Capture dated intake versions before downstream scope and control work changes the engagement direction.</p>
            </div>
            <button
              type="button"
              onClick={saveIntakeBaseline}
              disabled={!complete || !intakeChanged}
              className="rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183d7a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {latestIntakeBaseline ? "Store new intake baseline" : "Store intake baseline"}
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3 text-sm text-[#27436e]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6a8ab0]">Latest baseline</p>
              <p className="mt-1 font-semibold text-[#15305a]">{latestIntakeBaseline ? `v${latestIntakeBaseline.version}` : "Not captured"}</p>
              <p className="mt-1 text-xs text-[#6a8ab0]">{latestIntakeBaseline ? new Date(latestIntakeBaseline.createdAt).toLocaleString() : "Capture after completing intake."}</p>
            </div>
            <div className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3 text-sm text-[#27436e]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6a8ab0]">Draft status</p>
              <p className="mt-1 font-semibold text-[#15305a]">{intakeChanged ? "Unbaselined changes present" : "Draft matches latest baseline"}</p>
            </div>
            <div className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3 text-sm text-[#27436e]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6a8ab0]">Versions recorded</p>
              <p className="mt-1 font-semibold text-[#15305a]">{baselines.intake.length}</p>
            </div>
          </div>
          {baselines.intake.length > 0 && (
            <div className="mt-4 space-y-2">
              {baselines.intake.slice(-3).reverse().map((baseline) => (
                <div key={baseline.version} className="rounded-md border border-[#e4eaf4] bg-[#f8fbff] px-3 py-2 text-sm text-[#27436e]">
                  <p className="font-semibold text-[#15305a]">Version {baseline.version}</p>
                  <p className="text-xs text-[#6a8ab0]">{new Date(baseline.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-[#33496f]">{baseline.summary || "No summary recorded"}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Responder and engagement context</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Responder persona *</label>
                <select value={responderPersona} onChange={(e) => setResponderPersona(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select persona...</option>
                  {renderSelectOptions(RESPONDER_PERSONAS)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Engagement type *</label>
                <select value={engagementType} onChange={(e) => setEngagementType(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select type...</option>
                  {renderSelectOptions(ENGAGEMENT_TYPES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Industry sector *</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select sector...</option>
                  {renderSelectOptions(INDUSTRIES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Delivery model *</label>
                <select value={deliveryModel} onChange={(e) => setDeliveryModel(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select model...</option>
                  {renderSelectOptions(DELIVERY_MODELS)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Hosting model *</label>
                <select value={hostingModel} onChange={(e) => setHostingModel(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select hosting...</option>
                  {renderSelectOptions(HOSTING_MODELS)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Exposure profile *</label>
                <select value={externalExposure} onChange={(e) => setExternalExposure(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select exposure...</option>
                  {renderSelectOptions(EXTERNAL_EXPOSURES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Data residency expectation *</label>
                <select value={dataResidency} onChange={(e) => setDataResidency(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select residency...</option>
                  {renderSelectOptions(DATA_RESIDENCIES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Timeline or deadline *</label>
                <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. Go-live June 30, 2026" className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Known constraints *</label>
                <input type="text" value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder="e.g. No downtime, limited budget, legacy systems" className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Risk signals and decision inputs</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Personal data involved? *</label>
                <select value={storesPersonalData} onChange={(e) => setStoresPersonalData(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select...</option>
                  {renderSelectOptions(YES_NO_CHOICES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Financial or regulated data involved? *</label>
                <select value={storesFinancialData} onChange={(e) => setStoresFinancialData(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select...</option>
                  {renderSelectOptions(YES_NO_CHOICES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Privileged or admin access in scope? *</label>
                <select value={hasPrivilegedAccess} onChange={(e) => setHasPrivilegedAccess(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select...</option>
                  {renderSelectOptions(YES_NO_CHOICES)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">AI or automated decisioning used? *</label>
                <select value={usesAi} onChange={(e) => setUsesAi(e.target.value)} className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                  <option value="">Select...</option>
                  {renderSelectOptions(YES_NO_CHOICES)}
                </select>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Business objective and success signal</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Business objective * <span className="text-[#8fa3c2]">(min 10 chars)</span></label>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} placeholder="What is the system and what business problem does it solve?" className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Expected outcome * <span className="text-[#8fa3c2]">(min 10 chars)</span></label>
                <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} rows={2} placeholder="What does successful delivery look like?" className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#3a5480]">Success criteria * <span className="text-[#8fa3c2]">(min 10 chars)</span></label>
                <textarea value={success} onChange={(e) => setSuccess(e.target.value)} rows={2} placeholder="How will we know the engagement succeeded?" className="w-full resize-none rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-5">
          <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Guided intake output</h3>
            {guidance ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-[#c9d5e6] bg-[#edf3fc] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#10203d]">Recommended mode: {guidance.recommendedRoleMode}</p>
                    <span className="rounded-full border border-[#c9d5e6] bg-white px-3 py-1 text-xs font-semibold text-[#1e3d6c]">{responderPersona}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#27436e]">{guidance.summary}</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Priority review themes</p>
                  <div className="space-y-2">
                    {guidance.priorityThemes.map((theme) => (
                      <div key={theme} className="rounded-md border border-[#dce6f3] bg-[#f8fbff] px-3 py-2 text-sm text-[#27436e]">{theme}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Clarification questions to ask early</p>
                  <ul className="space-y-2">
                    {guidance.clarificationQuestions.map((question) => (
                      <li key={question} className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{question}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Downstream focus</p>
                  <ul className="space-y-2">
                    {guidance.nextFocus.map((item) => (
                      <li key={item} className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#c9d5e6] bg-[#f8fbff] p-4 text-sm text-[#5d7396]">
                Fill the intake fields to generate a triage summary, recommended role mode, framework stack, and early clarification questions.
              </div>
            )}
          </article>
        </div>
      </div>

      {guidance && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Recommended framework stack</h3>
          <p className="mb-3 text-xs text-[#33496f]"><strong>Decision basis:</strong> {deliveryModel}, {externalExposure}, {dataResidency}, personal data {storesPersonalData}, AI {usesAi}</p>
          <div className="flex flex-wrap gap-2">
            {applicableFrameworks.map((frameworkId) => {
              const framework = frameworkPacks.find((item) => item.id === frameworkId);
              return framework ? (
                <span key={frameworkId} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">
                  {framework.shortName}
                </span>
              ) : null;
            })}
          </div>
        </article>
      )}

      {complete && actionPlan.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-[#1f4f97] bg-[#edf3fc] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#1f4f97] px-3 py-1 text-xs font-bold text-white">YOUR ACTION PLAN</div>
              <p className="text-sm font-semibold text-[#10203d]">
                {engagementType} - {industry} - {timeline}
              </p>
            </div>
            <p className="mt-2 text-xs text-[#2a4a80]">
              {engagementType === "Internal Audit"
                ? "Based on your inputs, here is the step-by-step path to assess and demonstrate audit readiness. Work through each step in order."
                : "Based on your inputs, here is the recommended path to complete this engagement. Work through each step in order."}
            </p>
            <p className="mt-1 text-xs text-[#2a4a80]">
              <strong>Objective:</strong> {objective} | <strong>Outcome:</strong> {outcome} | <strong>Mode:</strong> {guidance?.recommendedRoleMode}
            </p>
          </div>

          <div className="space-y-3">
            {actionPlan.map((step, index) => {
              const isOpen = expandedStep === step.number;
              return (
                <article key={step.number} className="overflow-hidden rounded-xl border border-[#c9d5e6] bg-white">
                  <button onClick={() => setExpandedStep(isOpen ? null : step.number)} className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[#f8fbff]">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${STEP_COLORS[index] ?? "bg-[#1f4f97]"} text-sm font-bold text-white`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#10203d]">{step.title}</p>
                      <p className="text-xs text-[#6a8ab0]">{step.whatToPrepare.length} preparation items - click to expand</p>
                    </div>
                    <Link href={step.route} onClick={(e) => e.stopPropagation()} className="shrink-0 rounded-md bg-[#1f4f97] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#183d7a]">
                      {step.linkLabel}
                    </Link>
                    <span aria-hidden="true" className="ml-1 shrink-0 text-sm font-semibold text-[#6a8ab0]">{isOpen ? "-" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="space-y-3 border-t border-[#e4eaf4] p-4">
                      <div className="rounded-md border border-[#c9d5e6] bg-[#edf3fc] p-3">
                        <p className="mb-1 text-xs font-semibold text-[#2a4a80]">Why this step matters</p>
                        <p className="text-sm text-[#273f67]">{step.why}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold text-[#3a5480]">What to prepare</p>
                        <ul className="space-y-1">
                          {step.whatToPrepare.map((item) => (
                            <li key={item} className="flex gap-2 text-sm text-[#273f67]">
                              <span className="shrink-0 font-bold text-[#1f4f97]">-&gt;</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {step.keyEvidence && (
                        <div className="rounded-md border border-green-200 bg-green-50 p-3">
                          <p className="mb-0.5 text-xs font-semibold text-green-700">Key evidence to produce</p>
                          <p className="text-sm text-green-900">{step.keyEvidence}</p>
                        </div>
                      )}
                      <Link href={step.route} className="inline-flex items-center rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#183d7a]">
                        Start: {step.title} -&gt;
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-1 text-xs font-semibold text-amber-700">Tip: work through the steps in order</p>
            <p className="text-xs text-amber-800">Each step produces evidence and output that feeds into the next. Start with scope and inputs before jumping to risks or checklist findings.</p>
          </div>
        </div>
      )}

      {!complete && (
        <article className="rounded-xl border border-dashed border-[#c9d5e6] bg-[#f8fbff] p-5 text-center">
          <p className="text-sm font-semibold text-[#3a5480]">Complete the intake to generate your triage output and step-by-step action plan</p>
          <p className="mt-1 text-xs text-[#6a8ab0]">The intake now derives framework hints, early clarification questions, and the recommended working mode before you move into scope and evidence capture.</p>
        </article>
      )}
    </section>
  );
}
