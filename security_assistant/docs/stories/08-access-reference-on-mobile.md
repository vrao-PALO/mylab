# User Story: 8 - Access Reference On Mobile

**As a** consultant working across client meetings, RFP reviews, and presales discussions away from my laptop,
**I want** the reference content to be fully usable on a mobile device with fast access to key topics,
**so that** I can answer security and compliance questions confidently on the go without being blocked by format or connectivity constraints.

## Acceptance Criteria

* Core guidance pages — framework summaries, control checklists, plain-English explanations — render correctly on common mobile screen sizes without horizontal scrolling.
* Navigation allows reaching any key stage or topic within three taps.
* The most recently viewed topics are bookmarked and easy to reopen.
* Content loads quickly; no dependency on large file downloads during a meeting.
* Offline access is supported for the core reference content (framework guides, checklists, and plain-English explanations).
* Search allows the user to type a term (e.g. "MAS TRM", "SOC 2", "PDPA", "zero trust") and receive a focused result.
* The tool works in both a mobile browser and as an installable PWA (Progressive Web App) without an app store requirement.

## Notes

* The primary need is rapid on-the-go reference, not full workflow completion. Mobile UX must prioritize speed and readability over feature completeness.
* The most accessed content on mobile is likely to be: framework summaries (MAS TRM, PDPA, ISO 27001, SOC 2, MTCS Tier 3), plain-English explanations, the 10 core architecture principles, and the stakeholder communication guide.
* A PWA approach is recommended for Phase 3 (after the markdown playbook is stable) because: no native app build required, works on phone and laptop, can be installed from the browser, and can be updated without an app store release.
* Alternative: a well-structured mkdocs or Docusaurus site with a mobile-responsive theme is a fast-to-build Phase 1.5 option that delivers mobile readability before a full app.
