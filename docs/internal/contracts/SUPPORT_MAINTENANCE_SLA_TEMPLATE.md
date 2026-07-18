# ChainX Support, Maintenance and Service Level Agreement

**TEMPLATE — FOR LEGAL REVIEW**
**NOT FOR SIGNATURE**

**CLASSIFICATION: CONFIDENTIAL — INTERNAL TEMPLATE**

> This is an internal master template intended for review and adaptation by
> qualified legal counsel before any customer use. It is **not** legal advice, **not**
> legally approved, and **not** ready for execution. Response times, resolution
> targets, availability percentages, service credits, RPO/RTO, and end-of-support
> dates are placeholders and must be defined per signed commercial offer and reviewed
> by counsel.
>
> This SLA does **not** modify intellectual-property rights and does **not** grant any
> software-license rights. It is subordinate to the applicable main agreement
> (`SAAS_AGREEMENT_TEMPLATE.md` / `ENTERPRISE_SOFTWARE_LICENSE_AGREEMENT_TEMPLATE.md`).
>
> This template supports multiple models: SaaS support, Enterprise support, Private
> Cloud support, and On-Premise support. SLA terms are not identical for all
> customers.
>
> Primary commercial source of truth: `../CHAINX_COMMERCIAL_POLICY.md`.

| Field         | Value                                           |
| ------------- | ----------------------------------------------- |
| Document Type | Support, Maintenance and SLA (Template)         |
| Version       | 1.0                                             |
| Status        | Template — For Legal Review — Not For Signature |
| Provider      | [CHAINX LEGAL ENTITY]                           |
| Customer      | [CUSTOMER LEGAL ENTITY]                         |
| Order Form    | [ORDER FORM]                                    |
| Support Plan  | [SUPPORT PLAN]                                  |

---

## 1. Purpose

This document defines the support, maintenance, and service-level framework that may
apply to the Service, subject to the applicable support plan and [ORDER FORM]. [LEGAL
REVIEW REQUIRED]

---

## 2. Scope

This SLA covers support and maintenance for the Service as delivered under the
selected model (SaaS, Enterprise, Private Cloud, or On-Premise). The applicable scope
is defined by the [ORDER FORM] and selected support plan.

---

## 3. Relationship to Main Agreement

This SLA supplements and is subordinate to the applicable main agreement. It does not
modify IP rights or grant license rights. In the event of conflict, the main
agreement governs unless expressly stated otherwise. [LEGAL REVIEW REQUIRED]

---

## 4. Definitions

| Term               | Meaning                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Incident           | An event that causes or may cause an interruption to, or reduction in, the quality of the Service. |
| Severity           | The classification of an Incident's impact and urgency.                                            |
| Response Time      | The target time to provide an initial substantive response to a Support Request.                   |
| Resolution Target  | The target time to resolve or provide a workaround, where applicable.                              |
| Business Hours     | The support hours defined in [SUPPORT HOURS] and [TIME ZONE].                                      |
| Maintenance Window | A scheduled period during which maintenance may occur.                                             |
| Availability       | The measure of Service availability as defined in this SLA.                                        |
| Exclusion          | A condition excluded from SLA measurement or commitments.                                          |
| Support Request    | A request submitted by the Customer through an approved Support Channel.                           |

---

## 5. Support Plan

Select the applicable plan (entitlements defined by [ORDER FORM] / current commercial
offering):

- [ ] Standard
- [ ] Business
- [ ] Enterprise
- [ ] Custom

This template does not invent current commercial entitlements.

---

## 6. Support Channels

| Channel           | Value (Placeholder) |
| ----------------- | ------------------- |
| Email             | [SUPPORT EMAIL]     |
| Portal            | [SUPPORT PORTAL]    |
| Emergency Contact | [EMERGENCY CONTACT] |
| Other             | [OTHER CHANNEL]     |

---

## 7. Support Hours

Support hours: [SUPPORT HOURS].

---

## 8. Time Zone

Reference time zone: [TIME ZONE].

---

## 9. Severity Classification

| Severity   | Label    | Generic Description                                                        |
| ---------- | -------- | -------------------------------------------------------------------------- |
| Severity 1 | Critical | Critical impact; core Service unusable or severely impaired.               |
| Severity 2 | High     | Significant impact; major functionality impaired with limited workaround.  |
| Severity 3 | Medium   | Moderate impact; partial functionality affected with workaround available. |
| Severity 4 | Low      | Minor impact; question, cosmetic, or low-priority issue.                   |

---

## 10. Severity Examples

| Severity   | Illustrative Examples (Placeholder)     |
| ---------- | --------------------------------------- |
| Severity 1 | [EXAMPLE — e.g., Service outage]        |
| Severity 2 | [EXAMPLE — e.g., major feature failure] |
| Severity 3 | [EXAMPLE — e.g., partial degradation]   |
| Severity 4 | [EXAMPLE — e.g., documentation query]   |

---

## 11. Initial Response Targets

| Severity   | Target Response      |
| ---------- | -------------------- |
| Severity 1 | [S1 RESPONSE TARGET] |
| Severity 2 | [S2 RESPONSE TARGET] |
| Severity 3 | [S3 RESPONSE TARGET] |
| Severity 4 | [S4 RESPONSE TARGET] |

Response times are not invented and must be set per signed commercial offer.

---

## 12. Resolution Targets

Resolution times are targets only unless explicitly contractually guaranteed in a
signed commercial offer. Targets: [S1 RESOLUTION TARGET], [S2 RESOLUTION TARGET],
[S3 RESOLUTION TARGET], [S4 RESOLUTION TARGET].

---

## 13. Availability Commitment

Availability commitment, if any: **[AVAILABILITY TARGET — LEGAL REVIEW REQUIRED]**.
No specific availability percentage is included unless supplied by a signed
commercial offer. ChainX does not promise 100% uptime.

---

## 14. Availability Measurement

Availability measurement methodology: [MEASUREMENT METHODOLOGY]. The calculation
window, exclusions, and monitoring source are defined per agreement. [LEGAL REVIEW
REQUIRED]

---

## 15. SLA Exclusions

The following are excluded from SLA commitments and/or availability measurement,
where applicable:

- Scheduled maintenance
- Emergency maintenance
- Customer infrastructure
- Customer misconfiguration
- Third-party outage
- Blockchain network outage
- Wallet / provider outage
- KYC provider outage
- Payment provider outage
- AI provider outage
- Force majeure
- Unauthorized modifications
- Unsupported software versions

---

## 16. Scheduled Maintenance

ChainX may perform scheduled maintenance during defined Maintenance Windows, with
notice as defined per agreement, consistent with `../RELEASE_RUNBOOK.md`. [LEGAL
REVIEW REQUIRED]

---

## 17. Emergency Maintenance

ChainX may perform emergency maintenance without advance notice where necessary to
protect Service integrity or security. [LEGAL REVIEW REQUIRED]

---

## 18. Incident Management

Incidents are logged, triaged by Severity, and managed through resolution or
workaround, with communication as defined by the support plan.

---

## 19. Escalation

Escalation paths and thresholds are defined per support plan and [ORDER FORM]. [LEGAL
REVIEW REQUIRED]

---

## 20. Customer Responsibilities

The Customer shall provide timely and accurate information, reasonable cooperation,
appropriate access, and maintain its own infrastructure and Third-Party Services as
applicable.

---

## 21. Monitoring

Monitoring responsibilities and scope depend on the deployment model and are defined
per agreement.

---

## 22. Security Incidents

Security incidents are handled in accordance with ChainX security and recovery
procedures; see `../DISASTER_RECOVERY.md`. Data-protection breach notification is
governed by the applicable Data Processing Addendum
(`DATA_PROCESSING_ADDENDUM_TEMPLATE.md`).

---

## 23. Backup and Recovery

Backup and recovery follow ChainX internal procedures; see `../DISASTER_RECOVERY.md`.
Customer-specific recovery objectives are not promised unless explicitly defined:
[RPO], [RTO]. [LEGAL REVIEW REQUIRED]

---

## 24. Updates

ChainX may provide updates to the Service as part of maintenance. Updates do not
transfer software or source code.

---

## 25. Patches

Security and corrective patches are applied as defined per deployment model and
support plan.

---

## 26. Version Support

Supported versions are defined per agreement. Unsupported versions may be excluded
from SLA commitments.

---

## 27. End of Support

End-of-support timelines are defined per agreement: [END OF SUPPORT DATE]. Support
does not imply perpetual support. [LEGAL REVIEW REQUIRED]

---

## 28. Private Cloud Responsibilities

For Private Cloud deployments, responsibility allocation between ChainX and the
Customer is defined per agreement. Certain infrastructure elements may be under
Customer control. [LEGAL REVIEW REQUIRED]

---

## 29. On-Premise Responsibilities

For On-Premise deployments, the Customer's infrastructure may be outside ChainX's
control, which may affect SLA applicability. Responsibility allocation is defined per
agreement. [LEGAL REVIEW REQUIRED]

---

## 30. Third-Party Dependencies

SLA commitments do not extend to Third-Party Services (including blockchain networks,
RPC, wallet, KYC, payment, AI, cloud, and DNS providers), which ChainX does not
control.

---

## 31. Service Credits

Service credits are not invented in this template. Applicable mechanism:
**[SERVICE CREDIT MECHANISM — LEGAL REVIEW REQUIRED]** or
**[NO SERVICE CREDITS UNLESS EXPRESSLY AGREED]**.

---

## 32. Chronic SLA Failure

Remedies for chronic or repeated SLA failure, if any, are to be defined. [LEGAL
REVIEW REQUIRED]

---

## 33. Exclusions from Support

Support excludes work outside the defined scope, including issues caused by excluded
conditions in Section 15 and unsupported configurations.

---

## 34. Professional Services

Out-of-scope work (e.g., custom development, migrations, integrations) may require a
separate quote or Statement of Work (`STATEMENT_OF_WORK_TEMPLATE.md`).

---

## 35. Change Requests

Change requests are handled through the defined change process and may affect scope,
timing, or fees. [LEGAL REVIEW REQUIRED]

---

## 36. Support Fees

Support fees are set out in the applicable [ORDER FORM] / Commercial Proposal. This
SLA does not set fixed prices.

---

## 37. Term

The term of this SLA aligns with the applicable Subscription Term or [ORDER FORM].
[LEGAL REVIEW REQUIRED]

---

## 38. Termination

Termination of support aligns with the main agreement and applicable [ORDER FORM].
[LEGAL REVIEW REQUIRED]

---

## 39. Liability

Liability under this SLA is governed by and subject to the limitations in the main
agreement. [LEGAL REVIEW REQUIRED]

---

## 40. Governance and Reporting

Reporting cadence, metrics, and format are defined per support plan. [LEGAL REVIEW
REQUIRED]

---

## 41. Service Review Meetings

Optional service review meetings may be held at a cadence defined per agreement:
[REVIEW CADENCE].

---

## 42. Contact Matrix

| Role                | Contact (Placeholder) |
| ------------------- | --------------------- |
| Provider Support    | [PLACEHOLDER]         |
| Provider Escalation | [PLACEHOLDER]         |
| Customer Primary    | [PLACEHOLDER]         |
| Customer Escalation | [PLACEHOLDER]         |

No personal data is included in this template.

---

## 43. SLA Schedule

| Severity   | Target Response      | Target Update Frequency | Target Resolution      |
| ---------- | -------------------- | ----------------------- | ---------------------- |
| Severity 1 | [S1 RESPONSE TARGET] | [S1 UPDATE FREQUENCY]   | [S1 RESOLUTION TARGET] |
| Severity 2 | [S2 RESPONSE TARGET] | [S2 UPDATE FREQUENCY]   | [S2 RESOLUTION TARGET] |
| Severity 3 | [S3 RESPONSE TARGET] | [S3 UPDATE FREQUENCY]   | [S3 RESOLUTION TARGET] |
| Severity 4 | [S4 RESPONSE TARGET] | [S4 UPDATE FREQUENCY]   | [S4 RESOLUTION TARGET] |

All values are placeholders and must be defined per signed commercial offer.

---

## 44. Revision History

| Version | Date   | Author / Owner | Description                                    |
| ------- | ------ | -------------- | ---------------------------------------------- |
| v1.0    | [DATE] | ChainX         | Initial support, maintenance and SLA template. |

---

**TEMPLATE — FOR LEGAL REVIEW · NOT FOR SIGNATURE · Internal Use Only**
