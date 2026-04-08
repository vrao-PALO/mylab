export interface FrameworkControl {
  id: string;
  framework: string;
  domain: string;
  clause: string;
  title: string;
  intent: string;
  evidence: string;
  sectors: string[];
}

export interface FrameworkPack {
  id: string;
  name: string;
  shortName: string;
  description: string;
  applicableSectors: string[];
  url: string;
  controls: FrameworkControl[];
}

export const frameworkPacks: FrameworkPack[] = [
  {
    id: "mas-trm",
    name: "MAS Technology Risk Management Guidelines",
    shortName: "MAS TRM",
    description: "MAS-regulated financial institutions in Singapore. Covers governance, third-party risk, security-by-design, secure SDLC, access management, operational resilience, and technology risk.",
    applicableSectors: ["FI"],
    url: "https://www.mas.gov.sg/regulation/guidelines/technology-risk-management-guidelines",
    controls: [
      { id: "mas-gov-1", framework: "MAS TRM", domain: "Governance", clause: "3.1", title: "Board and Senior Management Oversight", intent: "Board must oversee technology risk; senior management accountable for day-to-day risk management.", evidence: "Board-approved IT risk policy, risk committee minutes, CISO appointment letter.", sectors: ["FI"] },
      { id: "mas-3p-1", framework: "MAS TRM", domain: "Third-Party Risk", clause: "5.1", title: "Third-Party Risk Management", intent: "Assess and monitor security controls of all third-party service providers before and during engagement.", evidence: "Vendor risk assessment, contractual security obligations, third-party audit reports, ongoing review cadence.", sectors: ["FI"] },
      { id: "mas-sdlc-1", framework: "MAS TRM", domain: "Secure SDLC", clause: "9.1", title: "Security-by-Design in SDLC", intent: "Security requirements, code review, and assurance testing must be embedded throughout the software development lifecycle.", evidence: "Security requirements documentation, SAST/SCA scan reports, VAPT report, remediation closure sign-off.", sectors: ["FI"] },
      { id: "mas-access-1", framework: "MAS TRM", domain: "Access Management", clause: "10.1", title: "Privileged Access Control", intent: "Privileged access must be limited, logged, reviewed, and approved. Shared accounts disallowed.", evidence: "Access control matrix, PAM tool configuration, quarterly access review records, approval workflows.", sectors: ["FI"] },
      { id: "mas-logging-1", framework: "MAS TRM", domain: "Logging & Monitoring", clause: "11.2", title: "Audit Logging and Monitoring", intent: "All critical actions must be logged with tamper-proof storage; anomalies must trigger alerts.", evidence: "Log configuration evidence, SIEM integration, alert rule definitions, audit log retention policy.", sectors: ["FI"] },
      { id: "mas-vapt-1", framework: "MAS TRM", domain: "Assurance", clause: "14.1", title: "Vulnerability Assessment and Penetration Testing", intent: "VAPT must be conducted before major releases and annually; findings remediated before production.", evidence: "VAPT engagement letter, final VAPT report, remediation tracker, closure confirmation.", sectors: ["FI"] },
      { id: "mas-dr-1", framework: "MAS TRM", domain: "Resilience", clause: "7.1", title: "Business Continuity and Disaster Recovery", intent: "RTO/RPO targets defined; DR tested at least annually; recovery procedures documented.", evidence: "BCP/DR plan, DR test results, RTO/RPO metrics, board-approved targets.", sectors: ["FI"] },
    ],
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001:2022 Information Security Management System",
    shortName: "ISO 27001",
    description: "International standard for information security management systems. Applies across all sectors. Covers organisational controls, people controls, physical controls, and technology controls.",
    applicableSectors: ["FI", "GovTech", "Generic", "Education", "Real Estate"],
    url: "https://www.iso.org/standard/27001",
    controls: [
      { id: "iso-a5-1", framework: "ISO 27001", domain: "Organisational Controls", clause: "A.5.1", title: "Policies for Information Security", intent: "Define, approve, and communicate an information security policy aligned to business and regulatory requirements.", evidence: "Approved IS policy, communication records, annual review log.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "iso-a5-15", framework: "ISO 27001", domain: "Organisational Controls", clause: "A.5.15", title: "Access Control", intent: "Business and security requirements for access to information and assets must be established and enforced.", evidence: "Access control policy, RBAC matrix, provisioning/deprovisioning records, access review results.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "iso-a8-24", framework: "ISO 27001", domain: "Technology Controls", clause: "A.8.24", title: "Use of Cryptography", intent: "Rules for use of cryptography including key management must be defined and implemented.", evidence: "Encryption policy, cipher suite configuration, key management procedures.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "iso-a8-8", framework: "ISO 27001", domain: "Technology Controls", clause: "A.8.8", title: "Management of Technical Vulnerabilities", intent: "Vulnerabilities in systems must be identified, assessed, and remediated in a timely manner.", evidence: "Vulnerability scan reports, patch management records, remediation status tracker.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "iso-a5-30", framework: "ISO 27001", domain: "Organisational Controls", clause: "A.5.30", title: "ICT Readiness for Business Continuity", intent: "ICT continuity must be planned, implemented, tested, and maintained based on business continuity objectives.", evidence: "BCP, DR test results, continuity objectives alignment record.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "iso-a8-15", framework: "ISO 27001", domain: "Technology Controls", clause: "A.8.15", title: "Logging", intent: "Logs of activities, exceptions, and events must be produced, protected, and retained.", evidence: "Log configuration, log retention policy, tamper-protection evidence, review cadence.", sectors: ["FI", "GovTech", "Generic", "Education"] },
    ],
  },
  {
    id: "pdpa",
    name: "Personal Data Protection Act (Singapore)",
    shortName: "PDPA",
    description: "Singapore's primary data protection legislation. Covers collection, use, disclosure, and care obligations for personal data. Administered by PDPC. Applies to all organisations handling personal data in Singapore.",
    applicableSectors: ["FI", "GovTech", "Generic", "Education", "Real Estate"],
    url: "https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act",
    controls: [
      { id: "pdpa-consent", framework: "PDPA", domain: "Collection", clause: "13", title: "Consent Obligation", intent: "Obtain consent from individuals before collecting, using, or disclosing personal data.", evidence: "Consent forms, privacy notices, consent capture mechanism, withdrawal handling process.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "pdpa-purpose", framework: "PDPA", domain: "Use", clause: "18", title: "Purpose Limitation Obligation", intent: "Personal data must only be used for the purposes for which consent was given.", evidence: "Data use register, purpose limitation policy, system design documentation.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "pdpa-retention", framework: "PDPA", domain: "Retention", clause: "25", title: "Retention Limitation Obligation", intent: "Personal data must be disposed of when no longer needed for the purpose it was collected.", evidence: "Retention schedule, disposal procedure, deletion confirmation records.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "pdpa-protection", framework: "PDPA", domain: "Security", clause: "24", title: "Protection Obligation", intent: "Reasonable security arrangements must prevent unauthorised access, collection, use, disclosure, or disposal.", evidence: "Security controls documentation, encryption evidence, access control policy, breach response plan.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "pdpa-transfer", framework: "PDPA", domain: "Transfer", clause: "26", title: "Transfer Limitation Obligation", intent: "Personal data transferred overseas must be protected to a standard comparable to PDPA.", evidence: "Transfer impact assessment, contractual clauses, adequacy determination, cross-border data flow map.", sectors: ["FI", "GovTech", "Generic", "Education"] },
      { id: "pdpa-breach", framework: "PDPA", domain: "Breach", clause: "26A", title: "Mandatory Data Breach Notification", intent: "Notify PDPC within 3 calendar days and affected individuals where breach is likely to cause significant harm.", evidence: "Breach response procedure, PDPC notification template, staff training records.", sectors: ["FI", "GovTech", "Generic", "Education"] },
    ],
  },
  {
    id: "owasp-asvs",
    name: "OWASP Application Security Verification Standard",
    shortName: "OWASP ASVS",
    description: "Framework of security requirements and verifications for designing, developing, and testing web application security. Level 1 (automated), Level 2 (standard), Level 3 (high-assurance).",
    applicableSectors: ["FI", "GovTech", "Generic", "Education"],
    url: "https://owasp.org/www-project-application-security-verification-standard/",
    controls: [
      { id: "asvs-v1-1", framework: "OWASP ASVS", domain: "Architecture", clause: "V1.1", title: "Secure Software Development Lifecycle", intent: "Security activities must be integrated at each SDLC phase from requirements to deployment.", evidence: "Security requirements documents, threat models, SAST/SCA reports, VAPT results.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "asvs-v2-1", framework: "OWASP ASVS", domain: "Authentication", clause: "V2.1", title: "Password Security Requirements", intent: "Passwords must meet minimum length and complexity; no default credentials; MFA required for high-risk functions.", evidence: "Auth configuration, password policy, MFA setup evidence.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "asvs-v4-1", framework: "OWASP ASVS", domain: "Access Control", clause: "V4.1", title: "General Access Control Design", intent: "Access control must enforce least privilege; deny by default; fail securely; be server-enforced.", evidence: "RBAC matrix, code review findings, VAPT access control test results.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "asvs-v7-1", framework: "OWASP ASVS", domain: "Logging", clause: "V7.1", title: "Log Content Requirements", intent: "Security-relevant events logged: auth success/failure, access control failures, privilege changes, admin actions.", evidence: "Log configuration, sample log events, review against ASVS V7 checklist.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "asvs-v9-1", framework: "OWASP ASVS", domain: "Communications", clause: "V9.1", title: "Communications Security Requirements", intent: "All communications with external systems must use TLS 1.2+; no fallback to deprecated protocols.", evidence: "TLS configuration scan, cipher suite list, certificate validity.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "asvs-v14-1", framework: "OWASP ASVS", domain: "Configuration", clause: "V14.2", title: "Dependency Security", intent: "All third-party components must be inventoried; known vulnerabilities must be patched or mitigated.", evidence: "SCA scan output, dependency inventory, patch cadence, CVE remediation log.", sectors: ["FI", "GovTech", "Generic"] },
    ],
  },
  {
    id: "owasp-masvs",
    name: "OWASP Mobile Application Security Verification Standard",
    shortName: "OWASP MASVS",
    description: "Security requirements for mobile applications (iOS and Android). Applies to native, hybrid, and mobile-browser apps. Three levels: L1 (basic), L2 (in-depth defence), R (resiliency).",
    applicableSectors: ["FI", "GovTech", "Generic", "Education"],
    url: "https://mas.owasp.org/MASVS/",
    controls: [
      { id: "masvs-storage-1", framework: "OWASP MASVS", domain: "Storage", clause: "MASVS-STORAGE-1", title: "Sensitive Data Storage", intent: "No sensitive data stored insecurely on the device; use platform-protected storage mechanisms.", evidence: "Static analysis, device inspection test, secure storage configuration.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "masvs-crypto-1", framework: "OWASP MASVS", domain: "Cryptography", clause: "MASVS-CRYPTO-1", title: "Cryptography Best Practices", intent: "No hardcoded keys or secrets; use platform-standard cryptographic APIs.", evidence: "Static analysis results, secret scan output, code review.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "masvs-auth-1", framework: "OWASP MASVS", domain: "Authentication", clause: "MASVS-AUTH-1", title: "Mobile Authentication", intent: "Authentication must not rely solely on client-side controls; session tokens validated server-side.", evidence: "Auth design, server-side session validation test, OAuth/OIDC configuration.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "masvs-network-1", framework: "OWASP MASVS", domain: "Network", clause: "MASVS-NETWORK-1", title: "Secure Network Communication", intent: "All network traffic uses TLS; certificate pinning for high-assurance apps; no cleartext traffic.", evidence: "Network capture test, TLS configuration, certificate pinning configuration.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "masvs-platform-1", framework: "OWASP MASVS", domain: "Platform", clause: "MASVS-PLATFORM-1", title: "Platform Interaction Security", intent: "Camera, microphone, and location permissions must be justified, minimal, and revocable per session.", evidence: "Permission manifest review, user permission flow test, session scope configuration.", sectors: ["FI", "GovTech", "Generic"] },
    ],
  },
  {
    id: "nist-800-53",
    name: "NIST SP 800-53 Rev. 5 Security and Privacy Controls",
    shortName: "NIST SP 800-53",
    description: "Comprehensive catalog of security and privacy controls for US federal information systems, widely adopted globally. Organised into control families.",
    applicableSectors: ["FI", "GovTech", "Generic", "Education"],
    url: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final",
    controls: [
      { id: "nist-ac-1", framework: "NIST SP 800-53", domain: "Access Control (AC)", clause: "AC-1", title: "Access Control Policy and Procedures", intent: "Define, document, and enforce access control policy covering least privilege, separation of duties, and account management.", evidence: "Access control policy, procedures, role definitions, periodic review records.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "nist-au-2", framework: "NIST SP 800-53", domain: "Audit and Accountability (AU)", clause: "AU-2", title: "Event Logging", intent: "Define auditable events; capture who, what, when, and where for all security-significant actions.", evidence: "Audit log policy, log configuration, sample log review, retention records.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "nist-ia-2", framework: "NIST SP 800-53", domain: "Identification and Auth (IA)", clause: "IA-2", title: "Multi-Factor Authentication", intent: "MFA required for all privileged users; required for remote access; recommended for all users.", evidence: "MFA configuration, exception register, enrollment records.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "nist-cm-8", framework: "NIST SP 800-53", domain: "Config Management (CM)", clause: "CM-8", title: "System Component Inventory", intent: "Maintain a current and accurate inventory of all system components and software.", evidence: "Asset inventory, software bill of materials (SBOM), change records.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "nist-ir-4", framework: "NIST SP 800-53", domain: "Incident Response (IR)", clause: "IR-4", title: "Incident Handling", intent: "Incident response capability covering detection, containment, eradication, recovery, and lessons learned.", evidence: "IR plan, IR test records, post-incident reports, escalation procedures.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "nist-ra-5", framework: "NIST SP 800-53", domain: "Risk Assessment (RA)", clause: "RA-5", title: "Vulnerability Monitoring and Scanning", intent: "Regular vulnerability scans; scan before deployment; remediation tracked and time-bound.", evidence: "Scan schedule, scan reports, remediation tracker, patch records.", sectors: ["FI", "GovTech", "Generic"] },
    ],
  },
  {
    id: "cis-v8",
    name: "CIS Controls Version 8",
    shortName: "CIS Controls v8",
    description: "Prioritised set of actions to protect organisations against the most common cyber attacks. 18 controls organised into Implementation Groups IG1 (basic), IG2 (foundational), IG3 (organisational).",
    applicableSectors: ["FI", "GovTech", "Generic", "Education", "Real Estate"],
    url: "https://www.cisecurity.org/controls/v8",
    controls: [
      { id: "cis-1", framework: "CIS Controls v8", domain: "Control 1", clause: "1", title: "Inventory and Control of Enterprise Assets", intent: "Actively manage all enterprise hardware assets so only authorised devices are given access.", evidence: "Asset inventory, network discovery scan, unauthorised device policy.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "cis-2", framework: "CIS Controls v8", domain: "Control 2", clause: "2", title: "Inventory and Control of Software Assets", intent: "Actively manage all software; unauthorised or unmanaged software must be blocked.", evidence: "Software inventory, allowlist/blocklist configuration, SBOM.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "cis-5", framework: "CIS Controls v8", domain: "Control 5", clause: "5", title: "Account Management", intent: "Use processes and tools to assign and manage authorisation to credentials for user, admin, and service accounts.", evidence: "Account lifecycle procedure, orphaned account review, service account register.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "cis-8", framework: "CIS Controls v8", domain: "Control 8", clause: "8", title: "Audit Log Management", intent: "Collect, alert, review, and retain audit logs to detect, understand, and recover from attacks.", evidence: "Log management tool, retention policy, alerting rules, log review records.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "cis-12", framework: "CIS Controls v8", domain: "Control 12", clause: "12", title: "Network Infrastructure Management", intent: "Establish, implement, and actively manage network devices to prevent attackers from exploiting network services.", evidence: "Network architecture diagram, firewall/NSG rules, segmentation evidence.", sectors: ["FI", "GovTech", "Generic"] },
      { id: "cis-16", framework: "CIS Controls v8", domain: "Control 16", clause: "16", title: "Application Software Security", intent: "Manage the security lifecycle of all in-house developed and acquired software.", evidence: "SDLC security policy, SAST/SCA results, VAPT reports, patch cadence.", sectors: ["FI", "GovTech", "Generic"] },
    ],
  },
  {
    id: "soc2",
    name: "SOC 2 (Service Organisation Control 2)",
    shortName: "SOC 2",
    description: "AICPA standard for cloud and SaaS service providers. Evaluates controls across five Trust Service Criteria: Security (CC), Availability (A), Processing Integrity (PI), Confidentiality (C), Privacy (P).",
    applicableSectors: ["FI", "Generic"],
    url: "https://www.aicpa-cima.com/resources/article/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization",
    controls: [
      { id: "soc2-cc6-1", framework: "SOC 2", domain: "Logical and Physical Access (CC6)", clause: "CC6.1", title: "Logical Access Security", intent: "Logical access to systems and data is restricted to authorised users through appropriate access control mechanisms.", evidence: "Access control policy, RBAC configuration, access review records, MFA evidence.", sectors: ["FI", "Generic"] },
      { id: "soc2-cc7-1", framework: "SOC 2", domain: "System Operations (CC7)", clause: "CC7.1", title: "System Monitoring", intent: "The entity uses detection and monitoring procedures including vulnerability scanning and SIEM to identify threats.", evidence: "SIEM configuration, vulnerability scan reports, alerting rules, incident log.", sectors: ["FI", "Generic"] },
      { id: "soc2-cc8-1", framework: "SOC 2", domain: "Change Management (CC8)", clause: "CC8.1", title: "Change Control Process", intent: "Changes to infrastructure and applications follow an authorised, tested, and documented process.", evidence: "Change management policy, CAB records, pre/post deployment test evidence, branch protection config.", sectors: ["FI", "Generic"] },
      { id: "soc2-a1-1", framework: "SOC 2", domain: "Availability (A1)", clause: "A1.1", title: "Availability and Capacity Management", intent: "System availability meets commitments; capacity monitored; performance issues escalated.", evidence: "SLA documentation, uptime monitoring, capacity review records, incident history.", sectors: ["FI", "Generic"] },
    ],
  },
  {
    id: "mtcs-tier3",
    name: "Multi-Tier Cloud Security (MTCS) Tier 3",
    shortName: "MTCS Tier 3",
    description: "Singapore standard SS 584 for cloud service providers. Tier 3 is the highest level, required for highly regulated and government-sensitive workloads. Administered by CSA Singapore.",
    applicableSectors: ["GovTech", "FI"],
    url: "https://www.csa.gov.sg/our-programmes/certification-and-labelling-schemes/multi-tier-cloud-security-mtcs-certification-scheme",
    controls: [
      { id: "mtcs-am-1", framework: "MTCS Tier 3", domain: "Asset Management", clause: "AM-01", title: "Asset Classification and Management", intent: "All assets classified by sensitivity; managed throughout lifecycle with clear ownership.", evidence: "Asset register, classification policy, disposal procedures.", sectors: ["GovTech", "FI"] },
      { id: "mtcs-is-1", framework: "MTCS Tier 3", domain: "Information Security", clause: "IS-01", title: "Security Policy", intent: "Comprehensive security policy framework approved by senior management; reviewed annually.", evidence: "Policy documents, approval records, review cadence.", sectors: ["GovTech", "FI"] },
      { id: "mtcs-bc-1", framework: "MTCS Tier 3", domain: "Business Continuity", clause: "BC-01", title: "Business Continuity Management", intent: "BCP and DRP defined, tested, and maintained; RTO/RPO targets for Tier 3 workloads clearly stated.", evidence: "BCP/DRP documents, test results, RTO/RPO metrics.", sectors: ["GovTech", "FI"] },
    ],
  },
];

export const frameworksByIndustry: Record<string, string[]> = {
  FI: ["mas-trm", "iso27001", "pdpa", "owasp-asvs", "nist-800-53", "cis-v8", "soc2"],
  GovTech: ["iso27001", "pdpa", "owasp-asvs", "nist-800-53", "cis-v8", "mtcs-tier3"],
  Generic: ["iso27001", "pdpa", "owasp-asvs", "nist-800-53", "cis-v8"],
  Education: ["pdpa", "owasp-asvs", "owasp-masvs", "cis-v8"],
  "Real Estate": ["pdpa", "iso27001", "cis-v8"],
};

export const frameworkAddons: Record<string, string[]> = {
  mobile: ["owasp-masvs"],
  aws: ["aws-waf"],
};
