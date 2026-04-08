# User Story: 13 - Assess AI Platform Governance Controls

**As a** security and compliance reviewer for an AI-enabled platform engagement,
**I want** targeted governance and security checks for AI platform features including scoring, bias controls, video retention, SSO, and mobile access,
**so that** AI-enabled solutions meet Singapore regulatory expectations (PDPA), AI governance principles, and enterprise security requirements before go-live.

## Acceptance Criteria

* Assessment includes AI governance controls: model transparency (explainability of scoring), bias detection thresholds, fallback rules when AI confidence is low, and regression testing cadence.
* Video recording controls are evaluated: retention period, deletion policy, access restrictions (least privilege), audit log for playback, and cross-border transfer compliance under PDPA.
* SSO and session management requirements are assessed: authentication protocol (SAML/OIDC), institutional identity provisioning, session timeout, inactivity handling, and device/browser scope.
* Data handling checks cover: file size and type limits for uploads (resume/JD), data classification for each input type, consent mechanism (PDPA), storage location, and disposal.
* Role-based visibility is validated for admin dashboard: aggregated analytics must not expose individual student data without appropriate access control.
* Mobile browser compliance is reviewed: camera and microphone permission models, iOS/Android compatibility, in-app browser restrictions.
* OWASP MASVS controls are applied where the AI platform includes a native or hybrid mobile component.
* Assessment findings are mapped to the PDPA framework obligations and relevant AI governance guidance applicable to Singapore.

## Notes

* AI Mock Interview RFQ context (Singapore education institution, deadline April 6, 2026): 24/7 interview practice, AI scoring and feedback, video recording, multi-turn dialogue, fairness and bias controls.
* Key compliance questions surfaced in the RFQ:
  * S-01 (Resume/JD upload): file size limits, data classification, PDPA consent.
  * S-03 (Video recording): retention policy, deletion schedule, PDPA cross-border transfer.
  * S-04 (AI scoring): bias thresholds, transparency, fallback when AI confidence is low.
  * S-09 (Fairness and bias): bias metrics, regression testing, governance accountability.
  * S-10 (Video access and disposal): least privilege, audit trail, PDPA obligations.
* AI governance principle: AI decisions affecting individuals (e.g. interview scoring) must be explainable, auditable, and correctable. A human override or fallback path should exist.
* PDPA cross-border transfer rule: if video recordings or AI-processed data are stored or processed outside Singapore, a transfer impact assessment and appropriate contractual or adequacy safeguards are required.
* For mobile browser (S-08): camera and microphone permissions must be explicitly requested and scoped per session; no persistent device access should be granted.
* Framework references: PDPA (PDPC Singapore), OWASP MASVS/MASTG (mobile), OWASP ASVS (web/API), CIS Controls (baseline hardening), Singapore IMDA AI governance framework.
