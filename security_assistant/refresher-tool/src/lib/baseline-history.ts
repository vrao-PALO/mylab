import type { RequirementIntake } from "@/types/domain";
import type { ScopeFormState, WorkflowBaselinesState, WorkflowBaselineRecord } from "@/lib/workflow-state";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isSameSnapshot<T>(left: T, right: T) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function summarizeIntake(snapshot: Partial<RequirementIntake>) {
  return [snapshot.engagementType ?? "Unspecified", snapshot.industry ?? "Unspecified", snapshot.timeline ?? "No timeline"]
    .filter(Boolean)
    .join(" | ");
}

function summarizeScope(snapshot: ScopeFormState) {
  return [snapshot.systems || "No systems recorded", snapshot.exposure || "Exposure TBD", snapshot.environments.join(", ") || "Env TBD"]
    .filter(Boolean)
    .join(" | ");
}

function appendRecord<T>(items: WorkflowBaselineRecord<T>[], snapshot: T, summary: string, meta?: { reason?: string; approver?: string }) {
  const latest = items.at(-1);
  if (latest && isSameSnapshot(latest.snapshot, snapshot)) {
    return items;
  }

  return [
    ...items,
    {
      version: items.length + 1,
      createdAt: new Date().toISOString(),
      snapshot: clone(snapshot),
      summary,
      reason: meta?.reason?.trim() || undefined,
      approver: meta?.approver?.trim() || undefined,
    },
  ];
}

export function getLatestIntakeBaseline(state: WorkflowBaselinesState) {
  return state.intake.at(-1);
}

export function getLatestScopeBaseline(state: WorkflowBaselinesState) {
  return state.scope.at(-1);
}

export function hasIntakeBaselineChanged(current: Partial<RequirementIntake>, state: WorkflowBaselinesState) {
  const latest = getLatestIntakeBaseline(state);
  return latest ? !isSameSnapshot(latest.snapshot, current) : true;
}

export function hasScopeBaselineChanged(current: ScopeFormState, state: WorkflowBaselinesState) {
  const latest = getLatestScopeBaseline(state);
  return latest ? !isSameSnapshot(latest.snapshot, current) : true;
}

export function storeIntakeBaseline(state: WorkflowBaselinesState, current: Partial<RequirementIntake>): WorkflowBaselinesState {
  return {
    ...state,
    intake: appendRecord(state.intake, current, summarizeIntake(current)),
  };
}

export function storeScopeBaseline(
  state: WorkflowBaselinesState,
  current: ScopeFormState,
  meta?: { reason?: string; approver?: string },
): WorkflowBaselinesState {
  return {
    ...state,
    scope: appendRecord(state.scope, current, summarizeScope(current), meta),
  };
}