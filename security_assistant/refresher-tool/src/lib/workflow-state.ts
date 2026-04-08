import type { RequirementIntake } from "@/types/domain";
import { getFormStorageKey } from "@/lib/storage-keys";

export type RoleMode = "Architect" | "Presales" | "Auditor";
export type DataClass = "INTERNAL" | "CONFIDENTIAL" | "FINANCIAL" | "AUDIT" | "PII";
export type RiskSeverity = "Critical" | "High" | "Medium" | "Low";
export type RiskStatus = "Open" | "Accepted" | "Mitigated" | "Closed";
export type EvidenceStatus = "Pending" | "Collected" | "Verified" | "N/A";
export type ChecklistIndustry = "All" | "FI" | "GovTech" | "Generic";

export interface ScopeFormState {
  systems: string;
  hosting: string[];
  environments: string[];
  exposure: string;
  roles: string;
  dataDomains: string;
  integrations: string;
  outOfScope: string;
  thirdParty: string;
  industry: string;
}

export interface InputDataEntry {
  id: string;
  name: string;
  classification: DataClass;
  regulation: string;
  retention: string;
  controls: string;
  hasAi: boolean;
  highRisk: boolean;
}

export interface IntegrationEntry {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  authMethod: string;
  sensitivity: DataClass;
  thirdParty: boolean;
}

export interface InputsFormState {
  dataEntries: InputDataEntry[];
  integrations: IntegrationEntry[];
}

export interface MappingRow {
  id: string;
  requirement: string;
  controls: string[];
  gap: boolean;
}

export interface ControlMappingState {
  industry: string;
  rows: MappingRow[];
}

export interface RiskExceptionRecord {
  justification: string;
  compensatingControl: string;
  expiry: string;
  approver: string;
}

export interface RiskEntry {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  likelihood: "High" | "Medium" | "Low";
  impact: string;
  asset: string;
  owner: string;
  status: RiskStatus;
  framework: string;
  exception?: RiskExceptionRecord;
  isGoLiveBlocker: boolean;
}

export interface RiskRegisterState {
  risks: RiskEntry[];
}

export interface ChecklistState {
  industry: ChecklistIndustry;
  checked: Record<string, boolean>;
  expanded: string | null;
}

export interface EvidenceItem {
  id: string;
  controlRef: string;
  category: string;
  title: string;
  description?: string;
  status: EvidenceStatus;
  link?: string;
  notes?: string;
  dueDate?: string;
  engagementId: string;
}

export interface WorkflowBaselineRecord<TSnapshot> {
  version: number;
  createdAt: string;
  snapshot: TSnapshot;
  summary: string;
  reason?: string;
  approver?: string;
}

export interface WorkflowBaselinesState {
  intake: Array<WorkflowBaselineRecord<Partial<RequirementIntake>>>;
  scope: Array<WorkflowBaselineRecord<ScopeFormState>>;
}

export interface WorkflowExportContext {
  intake: Partial<RequirementIntake>;
  scope: ScopeFormState;
  inputs: InputsFormState;
  controlMapping: ControlMappingState;
  riskRegister: RiskRegisterState;
  checklists: ChecklistState;
  evidence: EvidenceItem[];
  baselines: WorkflowBaselinesState;
  role: RoleMode;
}

export type WorkflowSnapshot = WorkflowExportContext;

export const STORAGE_KEYS = {
  role: "sa-role-mode",
  intake: getFormStorageKey("intake-form"),
  scope: getFormStorageKey("scope"),
  inputs: getFormStorageKey("inputs"),
  controlMapping: getFormStorageKey("control-mapping"),
  riskRegister: getFormStorageKey("risk-exceptions"),
  checklists: getFormStorageKey("checklists"),
  evidence: "evidence-items-v1",
  baselines: getFormStorageKey("baselines"),
} as const;

export const EMPTY_SCOPE_STATE: ScopeFormState = {
  systems: "",
  hosting: [],
  environments: [],
  exposure: "",
  roles: "",
  dataDomains: "",
  integrations: "",
  outOfScope: "",
  thirdParty: "",
  industry: "Generic",
};

export const EMPTY_INPUTS_STATE: InputsFormState = {
  dataEntries: [],
  integrations: [],
};

export const EMPTY_CONTROL_MAPPING_STATE: ControlMappingState = {
  industry: "FI",
  rows: [],
};

export const EMPTY_RISK_REGISTER_STATE: RiskRegisterState = {
  risks: [],
};

export const EMPTY_CHECKLIST_STATE: ChecklistState = {
  industry: "All",
  checked: {},
  expanded: "s1",
};

export const EMPTY_EVIDENCE_STATE: EvidenceItem[] = [];

export const EMPTY_BASELINES_STATE: WorkflowBaselinesState = {
  intake: [],
  scope: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeRole(value: unknown): RoleMode {
  return value === "Architect" || value === "Presales" || value === "Auditor" ? value : "Architect";
}

function normalizeIntakeSnapshot(value: unknown): Partial<RequirementIntake> {
  return isRecord(value) ? (value as Partial<RequirementIntake>) : {};
}

function normalizeScopeState(value: unknown): ScopeFormState {
  if (!isRecord(value)) return EMPTY_SCOPE_STATE;

  const systems = value.systems;
  const roles = value.roles ?? value.userRoles;
  const dataDomains = value.dataDomains;
  const integrations = value.integrations;
  const outOfScope = value.outOfScope;

  return {
    systems: Array.isArray(systems) ? systems.filter((item): item is string => typeof item === "string").join(", ") : normalizeString(systems),
    hosting: normalizeStringArray(value.hosting),
    environments: normalizeStringArray(value.environments),
    exposure: normalizeString(value.exposure),
    roles: Array.isArray(roles) ? roles.filter((item): item is string => typeof item === "string").join(", ") : normalizeString(roles),
    dataDomains: Array.isArray(dataDomains) ? dataDomains.filter((item): item is string => typeof item === "string").join(", ") : normalizeString(dataDomains),
    integrations: Array.isArray(integrations) ? integrations.filter((item): item is string => typeof item === "string").join(", ") : normalizeString(integrations),
    outOfScope: Array.isArray(outOfScope) ? outOfScope.filter((item): item is string => typeof item === "string").join(", ") : normalizeString(outOfScope),
    thirdParty: normalizeString(value.thirdParty),
    industry: normalizeString(value.industry, "Generic"),
  };
}

function normalizeInputsState(value: unknown): InputsFormState {
  if (Array.isArray(value)) {
    return {
      dataEntries: [],
      integrations: value.filter(isRecord).map((entry, index) => ({
        id: normalizeString(entry.id, `legacy-input-${index + 1}`),
        source: normalizeString(entry.source, "Unknown source"),
        destination: normalizeString(entry.destination, "Unknown destination"),
        protocol: normalizeString(entry.protocol, "TBD"),
        authMethod: normalizeString(entry.owner, "TBD"),
        sensitivity:
          entry.dataClass === "INTERNAL" ||
          entry.dataClass === "CONFIDENTIAL" ||
          entry.dataClass === "FINANCIAL" ||
          entry.dataClass === "AUDIT" ||
          entry.dataClass === "PII"
            ? entry.dataClass
            : "INTERNAL",
        thirdParty: false,
      })),
    };
  }

  if (!isRecord(value)) return EMPTY_INPUTS_STATE;

  const dataEntries = Array.isArray(value.dataEntries)
    ? value.dataEntries.filter(isRecord).map((entry, index) => ({
        id: normalizeString(entry.id, `data-${index + 1}`),
        name: normalizeString(entry.name),
        classification:
          entry.classification === "INTERNAL" ||
          entry.classification === "CONFIDENTIAL" ||
          entry.classification === "FINANCIAL" ||
          entry.classification === "AUDIT" ||
          entry.classification === "PII"
            ? entry.classification
            : "INTERNAL",
        regulation: normalizeString(entry.regulation),
        retention: normalizeString(entry.retention),
        controls: normalizeString(entry.controls),
        hasAi: Boolean(entry.hasAi),
        highRisk: Boolean(entry.highRisk),
      }))
    : [];

  const integrations = Array.isArray(value.integrations)
    ? value.integrations.filter(isRecord).map((entry, index) => ({
        id: normalizeString(entry.id, `integration-${index + 1}`),
        source: normalizeString(entry.source),
        destination: normalizeString(entry.destination),
        protocol: normalizeString(entry.protocol),
        authMethod: normalizeString(entry.authMethod),
        sensitivity:
          entry.sensitivity === "INTERNAL" ||
          entry.sensitivity === "CONFIDENTIAL" ||
          entry.sensitivity === "FINANCIAL" ||
          entry.sensitivity === "AUDIT" ||
          entry.sensitivity === "PII"
            ? entry.sensitivity
            : "INTERNAL",
        thirdParty: Boolean(entry.thirdParty),
      }))
    : [];

  return { dataEntries, integrations };
}

function normalizeControlMappingState(value: unknown): ControlMappingState {
  if (!isRecord(value)) return EMPTY_CONTROL_MAPPING_STATE;

  return {
    industry: normalizeString(value.industry, "FI"),
    rows: Array.isArray(value.rows)
      ? value.rows.filter(isRecord).map((row, index) => ({
          id: normalizeString(row.id, `mapping-${index + 1}`),
          requirement: normalizeString(row.requirement),
          controls: normalizeStringArray(row.controls),
          gap: Boolean(row.gap),
        }))
      : [],
  };
}

function normalizeRiskRegisterState(value: unknown): RiskRegisterState {
  if (!isRecord(value)) return EMPTY_RISK_REGISTER_STATE;

  return {
    risks: Array.isArray(value.risks)
      ? value.risks.filter(isRecord).map((risk, index) => ({
          id: normalizeString(risk.id, `risk-${index + 1}`),
          title: normalizeString(risk.title),
          description: normalizeString(risk.description),
          severity:
            risk.severity === "Critical" || risk.severity === "High" || risk.severity === "Medium" || risk.severity === "Low"
              ? risk.severity
              : "Low",
          likelihood: risk.likelihood === "High" || risk.likelihood === "Medium" || risk.likelihood === "Low" ? risk.likelihood : "Low",
          impact: normalizeString(risk.impact),
          asset: normalizeString(risk.asset),
          owner: normalizeString(risk.owner),
          status:
            risk.status === "Open" || risk.status === "Accepted" || risk.status === "Mitigated" || risk.status === "Closed"
              ? risk.status
              : "Open",
          framework: normalizeString(risk.framework),
          exception: isRecord(risk.exception)
            ? {
                justification: normalizeString(risk.exception.justification),
                compensatingControl: normalizeString(risk.exception.compensatingControl),
                expiry: normalizeString(risk.exception.expiry),
                approver: normalizeString(risk.exception.approver),
              }
            : undefined,
          isGoLiveBlocker: Boolean(risk.isGoLiveBlocker),
        }))
      : [],
  };
}

function normalizeChecklistState(value: unknown): ChecklistState {
  if (!isRecord(value)) return EMPTY_CHECKLIST_STATE;

  const checked = isRecord(value.checked)
    ? Object.fromEntries(Object.entries(value.checked).map(([key, item]) => [key, Boolean(item)]))
    : {};

  return {
    industry: value.industry === "All" || value.industry === "FI" || value.industry === "GovTech" || value.industry === "Generic" ? value.industry : "All",
    checked,
    expanded: typeof value.expanded === "string" || value.expanded === null ? value.expanded : "s1",
  };
}

function normalizeEvidenceState(value: unknown): EvidenceItem[] {
  if (!Array.isArray(value)) return EMPTY_EVIDENCE_STATE;

  return value.filter(isRecord).map((item, index) => ({
    id: normalizeString(item.id, `evidence-${index + 1}`),
    controlRef: normalizeString(item.controlRef),
    category: normalizeString(item.category),
    title: normalizeString(item.title),
    description: normalizeString(item.description) || undefined,
    status: item.status === "Pending" || item.status === "Collected" || item.status === "Verified" || item.status === "N/A" ? item.status : "Pending",
    link: normalizeString(item.link) || undefined,
    notes: normalizeString(item.notes) || undefined,
    dueDate: normalizeString(item.dueDate) || undefined,
    engagementId: normalizeString(item.engagementId, "local"),
  }));
}

function normalizeBaselineRecord<TSnapshot>(
  value: unknown,
  index: number,
  normalizeSnapshot: (snapshot: unknown) => TSnapshot,
): WorkflowBaselineRecord<TSnapshot> {
  const record = isRecord(value) ? value : {};

  return {
    version: typeof record.version === "number" && Number.isFinite(record.version) && record.version > 0 ? record.version : index + 1,
    createdAt: normalizeString(record.createdAt, new Date(0).toISOString()),
    snapshot: normalizeSnapshot(record.snapshot),
    summary: normalizeString(record.summary),
    reason: normalizeString(record.reason) || undefined,
    approver: normalizeString(record.approver) || undefined,
  };
}

function normalizeBaselinesState(value: unknown): WorkflowBaselinesState {
  if (!isRecord(value)) return EMPTY_BASELINES_STATE;

  return {
    intake: Array.isArray(value.intake)
      ? value.intake.map((item, index) => normalizeBaselineRecord(item, index, normalizeIntakeSnapshot))
      : [],
    scope: Array.isArray(value.scope)
      ? value.scope.map((item, index) => normalizeBaselineRecord(item, index, normalizeScopeState))
      : [],
  };
}

export function createWorkflowSnapshot(value?: Partial<WorkflowSnapshot>): WorkflowSnapshot {
  return {
    intake: normalizeIntakeSnapshot(value?.intake),
    scope: normalizeScopeState(value?.scope),
    inputs: normalizeInputsState(value?.inputs),
    controlMapping: normalizeControlMappingState(value?.controlMapping),
    riskRegister: normalizeRiskRegisterState(value?.riskRegister),
    checklists: normalizeChecklistState(value?.checklists),
    evidence: normalizeEvidenceState(value?.evidence),
    baselines: normalizeBaselinesState(value?.baselines),
    role: normalizeRole(value?.role),
  };
}

function readStorageJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function getSavedRoleMode(): RoleMode {
  if (typeof window === "undefined") return "Architect";

  const saved = localStorage.getItem(STORAGE_KEYS.role);
  if (saved === "Architect" || saved === "Presales" || saved === "Auditor") {
    return saved;
  }
  return "Architect";
}

export function getWorkflowExportContext(): WorkflowExportContext {
  return createWorkflowSnapshot({
    intake: readStorageJson(STORAGE_KEYS.intake, {}),
    scope: readStorageJson(STORAGE_KEYS.scope, EMPTY_SCOPE_STATE),
    inputs: readStorageJson(STORAGE_KEYS.inputs, EMPTY_INPUTS_STATE),
    controlMapping: readStorageJson(STORAGE_KEYS.controlMapping, EMPTY_CONTROL_MAPPING_STATE),
    riskRegister: readStorageJson(STORAGE_KEYS.riskRegister, EMPTY_RISK_REGISTER_STATE),
    checklists: readStorageJson(STORAGE_KEYS.checklists, EMPTY_CHECKLIST_STATE),
    evidence: readStorageJson(STORAGE_KEYS.evidence, EMPTY_EVIDENCE_STATE),
    baselines: readStorageJson(STORAGE_KEYS.baselines, EMPTY_BASELINES_STATE),
    role: getSavedRoleMode(),
  });
}

export function restoreWorkflowSnapshot(snapshot: Partial<WorkflowSnapshot>) {
  if (typeof window === "undefined") return;

  const normalized = createWorkflowSnapshot(snapshot);

  localStorage.setItem(STORAGE_KEYS.intake, JSON.stringify(normalized.intake));
  localStorage.setItem(STORAGE_KEYS.scope, JSON.stringify(normalized.scope));
  localStorage.setItem(STORAGE_KEYS.inputs, JSON.stringify(normalized.inputs));
  localStorage.setItem(STORAGE_KEYS.controlMapping, JSON.stringify(normalized.controlMapping));
  localStorage.setItem(STORAGE_KEYS.riskRegister, JSON.stringify(normalized.riskRegister));
  localStorage.setItem(STORAGE_KEYS.checklists, JSON.stringify(normalized.checklists));
  localStorage.setItem(STORAGE_KEYS.evidence, JSON.stringify(normalized.evidence));
  localStorage.setItem(STORAGE_KEYS.baselines, JSON.stringify(normalized.baselines));
  localStorage.setItem(STORAGE_KEYS.role, normalized.role);
  window.dispatchEvent(new Event("storage"));
}