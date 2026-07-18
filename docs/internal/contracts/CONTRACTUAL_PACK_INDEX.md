# ChainX Contractual Pack Index

**Master Contract Selection, Governance and Document Hierarchy Guide**

**CLASSIFICATION: INTERNAL USE ONLY — NOT CUSTOMER-FACING**

| Field          | Value                                  |
| -------------- | -------------------------------------- |
| Document Owner | ChainX                                 |
| Version        | 1.0                                    |
| Status         | Internal Operational Guide             |
| Last Updated   | 2026-07-18                             |
| Review Cycle   | Annual or upon contractual-pack change |

> This is an internal operational guide. It does **not** replace the underlying
> agreements and does **not** constitute legal advice. Where a document or clause
> requires legal review, qualified legal counsel must be engaged before customer use
> or signature. Primary commercial source of truth: `../CHAINX_COMMERCIAL_POLICY.md`.

---

## 1. Purpose

This document is the central navigation guide for the ChainX contractual framework.
It helps internal teams answer:

- Which contract or document do we use?
- In what order should documents be assembled?
- Which documents apply to which commercial model?
- Which document controls which subject matter?
- Which documents require customer signature?
- Which documents require legal review?
- When should optional documents be included?

This index does **not** replace the underlying agreements. Only executed agreements
govern customer relationships. Templates must be adapted and, where required,
reviewed by legal counsel before use.

---

## 2. Contractual Document Inventory

| Document                                            | Purpose                                                    | Commercial Model                                                | Mandatory / Optional          | Customer-Facing? | Signature Required?           | Legal Review Required? | Primary Subject            |
| --------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------- | ---------------- | ----------------------------- | ---------------------- | -------------------------- |
| `COMMERCIAL_PROPOSAL_TEMPLATE.md`                   | States what is commercially offered                        | All                                                             | Usually Required              | Yes              | Conditional (if incorporated) | Recommended            | Commercial offer           |
| `STATEMENT_OF_WORK_TEMPLATE.md`                     | Defines what is delivered, how and when                    | Enterprise, Private Cloud, On-Premise, SaaS with implementation | Conditional                   | Yes              | Yes (if used)                 | Recommended            | Scope and delivery         |
| `ENTERPRISE_SOFTWARE_LICENSE_AGREEMENT_TEMPLATE.md` | Software license rights for dedicated/licensed deployments | Enterprise, Private Cloud, On-Premise, Perpetual                | Conditional (model-dependent) | Yes              | Yes                           | Required               | Software license rights    |
| `SOURCE_CODE_TRANSFER_ADDENDUM_TEMPLATE.md`         | Optional source-code arrangement only                      | Enterprise + source-code arrangement                            | Optional                      | Yes              | Yes (if used)                 | Required               | Source-code arrangement    |
| `SAAS_AGREEMENT_TEMPLATE.md`                        | Subscription access rights and obligations                 | SaaS (Starter/Business/Enterprise)                              | Conditional (model-dependent) | Yes              | Yes                           | Required               | SaaS subscription rights   |
| `DATA_PROCESSING_ADDENDUM_TEMPLATE.md`              | Personal-data processing responsibilities                  | Any where personal data is processed                            | Conditional                   | Yes              | Yes (if used)                 | Required               | Data protection            |
| `SUPPORT_MAINTENANCE_SLA_TEMPLATE.md`               | Support, maintenance and service-level commitments         | Any with contractual support                                    | Optional / Conditional        | Yes              | Yes (if used)                 | Required               | Support and service levels |

> "Mandatory / Optional" and "Signature Required?" are context-dependent and subject
> to the executed agreement and legal review.

---

## 3. Document Role Summary

Each document has a distinct, non-overlapping role:

- **Commercial Proposal** — what is commercially offered.
- **Statement of Work (SOW)** — what will be delivered, how and when.
- **Enterprise License Agreement** — software license rights.
- **Source Code Transfer Addendum** — optional source-code arrangement only.
- **SaaS Agreement** — subscription access rights and obligations.
- **Data Processing Addendum (DPA)** — personal-data processing responsibilities.
- **Support / Maintenance SLA** — support, maintenance and service-level commitments.

Documents must not silently overlap. A SOW must not expand license or IP rights; a
DPA must not grant license rights; an SLA must not modify IP rights.

---

## 4. Contractual Path by Commercial Model

| #   | Commercial Model                                      | Recommended Documents                                                                                                                                                 |
| --- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | SaaS Starter                                          | Commercial Proposal or Order Form; SaaS Agreement; DPA if applicable; SLA if contractually included                                                                   |
| 2   | SaaS Business                                         | Commercial Proposal / Order Form; SaaS Agreement; DPA if applicable; SLA if applicable; SOW if implementation/integration work exists                                 |
| 3   | SaaS Enterprise                                       | Commercial Proposal; SaaS Agreement; SOW; DPA if applicable; SLA; Customer Deployment Checklist (internal)                                                            |
| 4   | Dedicated Enterprise Deployment                       | Commercial Proposal; SOW; Enterprise Software License Agreement or SaaS Agreement (model-dependent); DPA if applicable; SLA; Customer Deployment Checklist (internal) |
| 5   | Private Cloud                                         | Commercial Proposal; SOW; Enterprise Software License Agreement; DPA if applicable; SLA; Customer Deployment Checklist                                                |
| 6   | On-Premise                                            | Commercial Proposal; SOW; Enterprise Software License Agreement; SLA; DPA if applicable; Customer Deployment Checklist                                                |
| 7   | Perpetual Enterprise License                          | Commercial Proposal; SOW; Enterprise Software License Agreement; SLA / Maintenance Agreement if purchased; DPA if applicable                                          |
| 8   | Enterprise License + Optional Source-Code Arrangement | Commercial Proposal; SOW; Enterprise Software License Agreement; Source Code Transfer Addendum; SLA / Maintenance if purchased; DPA if applicable                     |

Internal references: `../CUSTOMER_DEPLOYMENT_CHECKLIST.md`, `../RELEASE_RUNBOOK.md`.

---

## 5. Quick Decision Tree

```
Is the customer buying subscription access?
  YES → Use SaaS Agreement
  NO  → Is the customer licensing a dedicated deployment?
          YES → Use Enterprise Software License Agreement

Does the customer require implementation / customization?
  YES → Add Statement of Work (SOW)

Does ChainX process personal data for / on behalf of the customer?
  YES / MAYBE → Evaluate DPA with legal counsel

Does the customer require contractual support / service levels?
  YES → Add Support / Maintenance SLA

Does the customer request source-code access or delivery?
  YES → Source Code Transfer Addendum required
```

No source code may be included silently. No support commitment may be added
automatically. No DPA role may be assumed.

---

## 6. Mandatory vs Optional Documents

| Commercial Model                 | Core Agreement             | SOW              | DPA         | SLA              | Source Code Addendum |
| -------------------------------- | -------------------------- | ---------------- | ----------- | ---------------- | -------------------- |
| SaaS Starter                     | Required (SaaS)            | Optional         | Conditional | Conditional      | Not Applicable       |
| SaaS Business                    | Required (SaaS)            | Conditional      | Conditional | Conditional      | Not Applicable       |
| SaaS Enterprise                  | Required (SaaS)            | Usually Required | Conditional | Usually Required | Not Applicable       |
| Dedicated Enterprise Deployment  | Required (License or SaaS) | Usually Required | Conditional | Usually Required | Optional             |
| Private Cloud                    | Required (License)         | Usually Required | Conditional | Usually Required | Optional             |
| On-Premise                       | Required (License)         | Usually Required | Conditional | Usually Required | Optional             |
| Perpetual Enterprise License     | Required (License)         | Usually Required | Conditional | Conditional      | Optional             |
| Enterprise License + Source Code | Required (License)         | Usually Required | Conditional | Conditional      | Required             |

Values are internal guidance only and are context-dependent; final requirements are
determined by the executed agreement and legal review.

---

## 7. Contract Hierarchy

Recommended internal default hierarchy, subject to the express precedence clause in
the executed agreements:

1. Signed Order Form / Commercial Proposal where expressly incorporated
2. Main Agreement — SaaS Agreement **or** Enterprise Software License Agreement
3. Statement of Work
4. Data Processing Addendum
5. Support / Maintenance SLA
6. Source Code Transfer Addendum
7. Other expressly incorporated schedules

> This hierarchy is **not** legally definitive. It is a recommended internal default,
> subject to the express precedence clause in the executed agreements and to legal
> review.

---

## 8. Document Precedence

Each executed agreement must include a clear conflict/precedence clause. Suggested
internal logic (subject to legal review):

- Specific negotiated terms may override general terms where explicitly stated.
- The Source Code Transfer Addendum governs source-code matters only.
- The DPA governs data-protection conflicts where legally required and expressly agreed.
- The SLA governs support and service-level matters only.
- The SOW governs project scope and deliverables but must not silently expand license
  or IP rights.

All precedence rules are subject to legal review and to the executed agreement's own
conflict clause.

---

## 9. Commercial Workflow

Standard internal commercial flow:

1. Lead identified
2. Qualification
3. Demo
4. Technical discovery
5. Deployment model selected
6. Commercial Proposal issued
7. Legal documents selected
8. Legal review / negotiation
9. Contract signed
10. Initial invoice issued
11. Initial payment received
12. Project status = ACTIVE
13. Implementation begins
14. Deployment / UAT
15. Remaining milestone payments
16. Production handover
17. Support / maintenance begins if applicable

---

## 10. Project Activation

See `../CHAINX_COMMERCIAL_POLICY.md`.

Default Enterprise activation requires:

- The signed applicable agreement, and
- The agreed initial payment received and cleared.

The default internal baseline is **50% Project Activation**. Final terms are governed
by the signed agreement. No dedicated implementation begins before Project Activation,
except approved pre-sales discovery.

---

## 11. Source Code Decision Rule

**Source code is never assumed included.**

If a customer asks any of the following:

- "Do we get the source code?"
- "Can we host it ourselves?"
- "Can we modify it?"
- "Can we resell it?"
- "Can we sublicense it?"

ChainX must STOP and explicitly define:

- Source access
- Modification rights
- Redistribution rights
- Sublicensing rights
- Resale rights
- IP ownership
- Third-party-license restrictions

Use `SOURCE_CODE_TRANSFER_ADDENDUM_TEMPLATE.md` where applicable. No source-code
arrangement is created without an executed addendum and legal review.

---

## 12. Data Protection Decision Rule

Before using the DPA, determine:

- Does ChainX process personal data?
- On whose instructions?
- What role does each party have?
- Are subprocessors involved?
- Are international transfers involved?
- Is a DPA legally required?

Do not assume a Processor or Controller role. The role must be determined per use case
with legal review. See `DATA_PROCESSING_ADDENDUM_TEMPLATE.md`.

---

## 13. SLA Decision Rule

Do not include SLA commitments automatically. Before adding an SLA, define:

- Support plan
- Support hours
- Severity levels
- Response targets
- Resolution targets
- Uptime target
- Exclusions
- Maintenance windows
- Third-party dependencies
- RPO / RTO if applicable
- Service credits if any

No values may be promised unless commercially approved and, where required, legally
reviewed. See `SUPPORT_MAINTENANCE_SLA_TEMPLATE.md`.

---

## 14. Legal Review Triggers

Situations that require external legal counsel:

- [ ] New jurisdiction
- [ ] New governing law
- [ ] Source-code transfer
- [ ] IP assignment
- [ ] On-Premise deployment
- [ ] Data processing outside standard scope
- [ ] International data transfers
- [ ] Custom indemnity
- [ ] Custom liability cap
- [ ] Service credits
- [ ] Financial-services use case
- [ ] Regulated tokenized assets
- [ ] Customer-specific compliance obligations
- [ ] Exclusivity
- [ ] Resale rights
- [ ] Sublicensing
- [ ] White-label rights
- [ ] Perpetual license
- [ ] Large enterprise transaction

---

## 15. Internal Approval Checklist

Before sending final documents:

- [ ] Correct commercial model selected
- [ ] Correct main agreement selected
- [ ] Proposal matches scope
- [ ] SOW matches scope
- [ ] Payment terms match policy
- [ ] Delivery estimate approved
- [ ] Source-code terms checked
- [ ] IP terms checked
- [ ] DPA decision made
- [ ] SLA decision made
- [ ] Legal review completed if required
- [ ] Customer dependencies documented
- [ ] Third-party costs identified
- [ ] Support model defined
- [ ] Acceptance criteria defined

---

## 16. Customer-Specific Contract Folder

Recommended structure (documented only — do not create these directories, no real
customer names):

```
customers/
  [CUSTOMER_NAME]/
    01-commercial/
    02-contracts/
    03-sow/
    04-data-protection/
    05-sla/
    06-source-code/
    07-signatures/
    08-handover/
```

---

## 17. Naming Convention

Recommended pattern:

```
YYYY-MM-DD_CUSTOMER_DOCUMENT_VERSION_STATUS
```

Example:

```
YYYY-MM-DD_CUSTOMER_SAAS-AGREEMENT_v1.0_DRAFT.pdf
```

Statuses: `DRAFT`, `LEGAL-REVIEW`, `CUSTOMER-REVIEW`, `FINAL`, `SIGNED`.

---

## 18. Document Status Control

| Status          | Meaning                                                         |
| --------------- | --------------------------------------------------------------- |
| TEMPLATE        | Internal master template; not for signature without adaptation. |
| DRAFT           | Work-in-progress customer draft.                                |
| LEGAL REVIEW    | Under review by legal counsel.                                  |
| CUSTOMER REVIEW | Shared with the customer for review.                            |
| FINAL           | Finalized, pending signature.                                   |
| SIGNED          | Executed and governing.                                         |
| SUPERSEDED      | Replaced by a later version.                                    |

Only **SIGNED** documents govern customer relationships. Templates must never be sent
for signature without adaptation and legal review where required.

---

## 19. Version Control Policy

- Internal templates remain versioned in Git.
- Customer-specific signed agreements must **not** automatically be stored in the
  source-code repository.
- Use a secure document-management approach approved by ChainX (provider not specified
  here).
- No personal or customer-sensitive documents in public repositories.

---

## 20. Escalation Rule

If there is uncertainty about any of the following:

- IP
- Source code
- Data protection
- Liability
- Regulation
- Exclusivity
- Sublicensing
- Resale
- Governing law

STOP. Do not improvise contract language. Escalate for legal review.

---

## 21. Master Document Map

| Question                                    | Document                                      |
| ------------------------------------------- | --------------------------------------------- |
| What are we offering?                       | Commercial Proposal                           |
| What are we building / delivering?          | Statement of Work                             |
| What software rights does the customer get? | Enterprise License Agreement / SaaS Agreement |
| Are we processing personal data?            | Data Processing Addendum                      |
| What support / service levels apply?        | Support / Maintenance SLA                     |
| Is source code involved?                    | Source Code Transfer Addendum                 |

---

## 22. Revision History

| Version | Date       | Owner  | Description                     |
| ------- | ---------- | ------ | ------------------------------- |
| v1.0    | 2026-07-18 | ChainX | Initial Contractual Pack Index. |

---

**INTERNAL USE ONLY · NOT CUSTOMER-FACING · DOES NOT REPLACE LEGAL REVIEW**
