# Security Architect Refresher Tool

Security Architect Refresher is a Next.js decision-support tool for security architects, presales leads, and auditors working on assessments, architecture reviews, audit readiness, and regulated-environment client responses.

It provides a guided seven-step workflow, role-aware views, industry overlays, evidence tracking, engagement snapshot save and restore, and export templates for stakeholder-ready outputs.

## Core Capabilities

- Guided intake that derives a framework stack, review focus areas, and clarification questions.
- Role-aware workflow views for Architect, Presales, and Auditor modes.
- Seven-step engagement flow covering intake, scope, inputs, control mapping, risk, checklists, and plain-English explanation.
- Industry and specialist reference pages for FI, GovTech, architecture review, audit evidence, and AI governance.
- Search, export, pilot console, and engagement save and restore utilities.
- Local workflow persistence plus SQLite-backed engagement snapshots through Prisma.

## Workflow Overview

1. Intake captures the engagement type, industry, hosting, exposure, data sensitivity, AI usage, and delivery context.
2. Scope defines the systems, environments, roles, data domains, integrations, and third-party boundary.
3. Inputs classifies key data elements and integrations.
4. Control Mapping links requirements to framework and control references.
5. Risk and Exceptions records findings, owners, severity, blockers, and exceptions.
6. Checklists provides stage-guided review prompts and evidence expectations.
7. Plain-English explanation turns technical outputs into stakeholder-ready explanations.

## Baseline And Prefill Workflow

The current workflow now includes baseline history and intake-driven automation.

### Intake Baselines

- The intake page can store dated intake baselines once the form is complete.
- The latest intake baseline is shown with version number, timestamp, and summary.
- The page indicates whether the current draft has changed since the last intake baseline.

### Scope Baselines And Change Control

- The scope page can store an initial scope baseline once scope is complete.
- Later scope revisions require both a change reason and an approver before a revised baseline is stored.
- Recent scope baseline versions are displayed so users can track the latest approved direction.

### Intake-Driven Prefills

Once the intake is complete, downstream workflow stages can be prefilled from the captured signals.

- Scope can inherit suggested hosting, environments, exposure, roles, data domains, integrations, and third-party boundary notes.
- Inputs can seed likely data classes and integration entries.
- Control Mapping can seed requirement rows and adjust the industry pack.
- Risk and Exceptions can seed likely initial risks and likely go-live blockers.

The prefill logic is additive. Existing user-entered records are preserved rather than overwritten.

### Save, Restore, And Export Behavior

- Engagement save and restore now includes workflow baselines together with the rest of the workflow snapshot.
- The engagement package page shows the latest intake and scope baseline version before saving.
- Exported engagement summaries now include the latest intake baseline, latest scope baseline, and scope-change count.

## Main Routes

- `/` dashboard and role-based quick start
- `/intake` guided intake and triage
- `/scope` assessment scope and baseline history
- `/inputs` data and integration catalog
- `/control-mapping` requirement-to-control mapping
- `/risk-exceptions` risk register and exception tracking
- `/checklists` guided review stages
- `/plain-english` stakeholder-friendly plain-English output
- `/audit-evidence` evidence tracker
- `/engagement-package` save and restore engagement snapshots
- `/exports` markdown export templates
- `/pilot` API-backed pilot console
- `/search` knowledge-base search

## Local Development

### Prerequisites

- Node.js 20 or later recommended
- npm

### Install And Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run db:generate
npm run db:push
npm run db:studio
```

## Data And Persistence

- Browser localStorage stores in-progress workflow state, role mode, evidence state, and baseline history.
- Prisma with SQLite stores saved engagement snapshots for restore and export flows.
- Local database path: `prisma/dev.db`.

## Project Notes

- Tests currently run with Vitest.
- The UI is mobile-ready and optimized for guided reference use.
- Guidance is advisory and should be validated against the applicable framework source and internal governance process.

## Supporting Documentation

- `docs/high-level-architecture-and-disclaimer.md`
- `docs/implementation-plan.md`