# ChainX Commercial Policy

**Internal Commercial, Licensing, Payment and Delivery Policy**

**CLASSIFICATION: INTERNAL USE ONLY — DO NOT DISTRIBUTE**

| Field             | Value                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Document Owner    | ChainX                                                                                                      |
| Version           | 1.0                                                                                                         |
| Status            | Approved Internal Policy / Draft for Legal Review                                                           |
| Last Updated      | 2026-07-18                                                                                                  |
| Review Cycle      | Annual or upon material commercial-model change                                                             |
| Classification    | Internal Use Only                                                                                           |
| Related Documents | `CHAINX_MASTER_ASSETS.md`, `RELEASE_RUNBOOK.md`, `DISASTER_RECOVERY.md`, `CUSTOMER_DEPLOYMENT_CHECKLIST.md` |

> This document is an internal operational and commercial policy. It is **not** a
> customer contract and **not** legal advice. It does not replace a Software License
> Agreement, SaaS Agreement, Master Services Agreement (MSA), Statement of Work
> (SOW), Data Processing Agreement (DPA), Service Level Agreement (SLA), or any
> other legally reviewed customer agreement. Final contractual terms are always
> governed by the applicable signed agreement.
>
> This document contains no secrets. Where secrets are referenced, only their
> storage location is described (see `CHAINX_MASTER_ASSETS.md`).

---

## 1. Purpose and Scope

This policy defines ChainX's internal commercial principles for the qualification,
proposal, sale, delivery, and handover of its technology and software offerings.
It governs the internal rules applied to:

- Customer qualification
- Commercial proposals
- SaaS subscriptions
- Enterprise licensing
- Implementation and delivery
- Payment milestones
- Delivery timelines
- Customer dependencies
- Acceptance
- Change requests
- Source-code arrangements
- Project suspension
- Handover

Commercial terms may be adapted to the circumstances of each customer. This policy
establishes the internal default position; the final, binding terms for any
engagement always depend on the signed agreement between ChainX and the customer.

---

## 2. Commercial Models

ChainX offers the following commercial models. Plan names and any published SaaS
pricing remain governed by the current commercial offering and are not modified by
this policy.

### A. SaaS

Subscription-based access to ChainX-operated infrastructure, offered in tiers:

- Starter
- Business
- Enterprise

Existing public SaaS pricing is not changed by this policy, and no new SaaS prices
are introduced here. Tier names and pricing follow the current published offering.

### B. Dedicated Enterprise Deployment

A customer-specific, isolated deployment. Depending on the agreement, it may include:

- Dedicated infrastructure
- Custom domain
- White-label configuration
- Customer-specific integrations
- KYC provider integration
- Database configuration
- Additional third-party providers
- Advanced infrastructure

### C. Private Cloud

Deployment within dedicated private cloud infrastructure according to the agreed
architecture.

### D. On-Premise

Deployment within customer-controlled infrastructure. Delivery for this model
depends heavily on customer-side factors, including:

- Customer IT readiness
- Network access
- Security approvals
- Infrastructure availability
- Credentials provisioning
- Firewall rules
- Internal customer procedures

### E. Perpetual Enterprise License

A commercial licensing model provided through an individual commercial proposal.
There is no fixed price. Pricing is provided as a **custom quotation** — an
**individual commercial proposal following technical discovery**.

### F. Optional Source-Code Transfer

Source-code transfer is optional, negotiated individually, and subject to technical
and legal review and a specific written agreement.

Purchasing a license does **not** automatically transfer ChainX intellectual
property. Delivery of source code does **not** automatically transfer copyright,
trademarks, platform ownership, or pre-existing ChainX IP. Any transfer, assignment,
or licensing of source code and intellectual-property rights must be explicitly
defined in the applicable signed agreement. Third-party libraries, SDKs, APIs,
open-source components, and external services remain subject to their respective
licenses and terms.

---

## 3. Commercial Principles

- No production implementation without an approved commercial agreement.
- No dedicated deployment work before the agreed initial payment is received.
- No Enterprise license preparation before the agreed initial payment is received.
- No source-code delivery before contractual conditions and payment milestones are
  satisfied.
- Customer-specific work must have a defined scope.
- Out-of-scope work requires a Change Request (Section 12).
- Third-party costs may be excluded unless explicitly included in the proposal.
- Taxes are handled according to the applicable proposal/agreement.
- ChainX provides technology infrastructure and software services.
- ChainX does not provide investment advice.
- ChainX does not guarantee financial returns.
- ChainX does not guarantee regulatory approval.

ChainX technology is designed to support compliant digital-asset workflows where
appropriately configured. This statement does not constitute a guarantee of
regulatory compliance under MiCA, ERC-3643, or any other framework; regulatory
outcomes depend on the customer's configuration, jurisdiction, and independent
compliance obligations.

---

## 4. Project Activation Rule

For Enterprise projects, a project becomes **ACTIVE** only when **both** of the
following conditions are satisfied:

1. The applicable commercial agreement / SOW / license agreement has been signed.
2. The agreed initial payment has been received and cleared.

For applicable Enterprise licensing and dedicated deployment projects, the standard
commercial baseline is **50% initial payment before project activation**.

This is the default internal commercial policy. Individual contracts may define a
different milestone structure, and where they do, the signed agreement prevails. No
implementation timeline starts before Project Activation.

---

## 5. Payment Milestones

The recommended default Enterprise milestone structure is:

| Milestone                        | Share | Trigger / Coverage                                                                                                                                |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project Activation               | 50%   | Resource allocation, project initiation, technical preparation, deployment planning, initial configuration                                        |
| Deployment Ready / UAT           | 25%   | Agreed environment prepared, core configuration complete, platform ready for agreed customer acceptance testing                                   |
| Production Handover / Acceptance | 25%   | Per the applicable agreement: production deployment or agreed handover completed, required documentation delivered, acceptance criteria satisfied |

The exact milestone structure may be adapted per project. For large projects, an
alternative such as **40 / 30 / 20 / 10** may be used. Alternative structures are
optional and not mandatory; the signed agreement governs the final structure.

---

## 6. SaaS Payment Model

SaaS billing is separate from Enterprise project milestones.

- SaaS subscriptions follow the applicable subscription billing cycle.
- Starter / Business / Enterprise SaaS pricing remains governed by the current
  commercial offering. No new prices are introduced by this policy.

Custom implementation work associated with a SaaS subscription may require a
separate setup fee, implementation fee, integration fee, or professional services
agreement — only when explicitly quoted and agreed.

---

## 7. Delivery Timelines

The following are **internal planning estimates**, expressed in business days/weeks.
They are not unconditional delivery guarantees.

| Model                                                 | Recommended Planning Range |
| ----------------------------------------------------- | -------------------------- |
| SaaS Starter                                          | 2–5 business days          |
| SaaS Business                                         | 5–10 business days         |
| SaaS Enterprise                                       | 10–20 business days        |
| Private Cloud                                         | 2–4 weeks                  |
| On-Premise                                            | 4–8 weeks                  |
| Perpetual Enterprise License                          | 3–6 weeks                  |
| Enterprise License with optional source-code transfer | 4–8 weeks                  |

These are internal planning estimates only. The final delivery schedule must be
defined after technical discovery.

> Approved external wording: "Estimated delivery timelines depend on the selected
> deployment model, integrations, infrastructure requirements and customer
> readiness. The final delivery schedule is established following technical
> discovery."

---

## 8. Delivery Clock

Delivery timelines commence only after all of the following are in place:

- Project Activation (Section 4)
- Initial payment received and cleared
- Required technical information received
- Required customer contacts assigned
- Required infrastructure / access available

If critical information is missing, the delivery clock may not start. If customer
dependencies become unavailable during the engagement, the delivery clock may be
paused for the duration of the unavailability and resumed once the dependency is
restored.

---

## 9. Customer Responsibilities

Depending on the model and scope, the customer may be responsible for providing:

- Corporate information
- Technical contacts
- Domain / DNS access
- Cloud infrastructure access
- On-Premise access
- Network configuration
- Firewall approvals
- KYC provider credentials
- Third-party provider accounts
- Database requirements
- Branding assets
- Legal copy
- Regulatory requirements
- Customer-specific policies
- Acceptance-test participants
- Timely approvals

ChainX does not request private keys or wallet seed phrases through normal
onboarding procedures. Credential handling and storage follow
`CHAINX_MASTER_ASSETS.md`.

---

## 10. Customer-Caused Delays

Delays caused by missing or unavailable customer-controlled dependencies may extend
the delivery schedule. Such dependencies include, without limitation:

- Information
- Credentials
- Infrastructure
- Access
- Customer approvals
- Third-party approvals
- Security reviews
- Legal reviews controlled by the customer
- Customer-requested scope changes

ChainX is not responsible for delays caused by customer-controlled dependencies.
Affected timelines are adjusted on a neutral, good-faith basis and documented.

---

## 11. Third-Party Dependencies

Engagements may depend on third-party providers, including:

- Cloud providers
- Domain / DNS providers
- Thirdweb
- Blockchain networks
- RPC providers
- KYC providers
- Payment providers
- AI providers
- Database providers
- Customer infrastructure

ChainX does not control the availability of external providers. Third-party
commercial costs must be defined in the applicable proposal; they are excluded
unless explicitly included.

---

## 12. Change Request Policy

A Change Request is required whenever the customer requests work outside the agreed
scope. Each Change Request may affect:

- Price
- Timeline
- Technical architecture
- Infrastructure
- Delivery milestones

No material out-of-scope work begins without written approval of the corresponding
Change Request.

---

## 13. Acceptance and UAT

- User Acceptance Testing (UAT): the customer receives an agreed review period.
- Acceptance criteria should be defined in the SOW or commercial agreement.
- Items raised during UAT are classified as:
  - Defect — behavior not matching the agreed scope.
  - Configuration issue — a setting to be adjusted within scope.
  - Change Request — work outside the agreed scope (Section 12).
  - New feature — functionality not part of the agreed scope.

This policy does not define legally binding automatic acceptance. Any automatic
acceptance applies only where explicitly established by the applicable customer
agreement.

---

## 14. Source-Code Policy

ChainX source code is a protected commercial asset.

- Standard SaaS does **not** include source-code transfer.
- Standard Enterprise deployment does **not** automatically include source-code
  transfer.
- Source-code access or transfer must be explicitly negotiated.

Possible arrangements may include:

- No source access
- Limited repository access
- Escrow arrangement
- Licensed source-code access
- Source-code delivery
- IP assignment where specifically negotiated

None of these are automatically included. Each arrangement requires:

- Defined scope
- Defined repositories
- Defined exclusions
- Third-party license review
- IP rights definition
- Payment conditions
- Delivery conditions
- Confidentiality obligations
- A written contractual agreement

---

## 15. Intellectual Property

- **A. Pre-existing ChainX IP** — technology, architecture, reusable components,
  frameworks, know-how, and other assets developed independently of the customer
  project. These remain ChainX property.
- **B. Customer-specific deliverables** — defined according to the applicable
  agreement.
- **C. Third-party IP** — remains subject to the respective third-party licenses.
- **D. Trademarks** — ChainX trademarks are not transferred unless explicitly agreed
  in writing.

This policy avoids absolute legal claims. The final treatment of intellectual
property is governed by the applicable signed agreement.

---

## 16. Project Suspension

A project may be suspended in circumstances including:

- Payment milestone overdue
- Customer dependency unavailable for an extended period
- Security risk
- Legal / compliance issue requiring clarification
- Material scope dispute
- Customer-requested pause

Restart dates may depend on resource availability at the time the blocking
condition is resolved.

---

## 17. Cancellation / Termination

Cancellation, termination, refunds, and outstanding payment obligations are
governed by the applicable signed customer agreement. This commercial policy does
not create refund rights and does not override contractual terms.

---

## 18. Production Handover

Where applicable, the handover includes:

- Production deployment
- Environment confirmation
- Domain confirmation
- Configuration confirmation
- Documentation
- Customer admin access
- Operational contacts
- Support handover
- Known limitations
- Third-party dependencies

The operational handover procedure is defined in
`CUSTOMER_DEPLOYMENT_CHECKLIST.md` and is not duplicated here.

---

## 19. Support and Maintenance

Support and maintenance differ by model and are defined separately in the
applicable agreement:

- **SaaS subscription support** — as included in the applicable subscription.
- **Enterprise license support** — as defined in the applicable license/support
  terms.
- **Custom professional services** — quoted and agreed separately.

A perpetual license does not imply lifetime support or perpetual maintenance.
Maintenance, updates, and support are defined separately in the applicable
commercial agreement.

---

## 20. Security and Secrets

Security practices, secret storage locations, and recovery procedures are defined
in `CHAINX_MASTER_ASSETS.md` and `DISASTER_RECOVERY.md` and are not duplicated here.

This document never stores API keys, private keys, passwords, mnemonics, recovery
codes, or production secrets. Only their storage locations are referenced.

---

## 21. Release and Deployment Control

Production releases and customer deployments must follow the approved internal
procedures defined in `RELEASE_RUNBOOK.md` and `CUSTOMER_DEPLOYMENT_CHECKLIST.md`.

---

## 22. Commercial Approval Checklist

Before sending a final Enterprise proposal:

- [ ] Customer identified
- [ ] Deployment model selected
- [ ] Technical discovery completed
- [ ] Scope defined
- [ ] Integrations identified
- [ ] Customer dependencies identified
- [ ] Third-party costs identified
- [ ] Delivery estimate defined
- [ ] Payment milestones defined
- [ ] IP / source-code terms defined if applicable
- [ ] Support model defined
- [ ] Acceptance criteria identified
- [ ] Legal agreement required
- [ ] Initial payment requirement included

---

## 23. Project Activation Checklist

- [ ] Agreement signed
- [ ] Initial invoice issued
- [ ] Initial payment received and cleared
- [ ] Technical contacts assigned
- [ ] Customer requirements received
- [ ] Required access available
- [ ] Project owner assigned
- [ ] Delivery timeline confirmed
- [ ] Project status changed to ACTIVE

No implementation work begins before activation, except explicitly approved
pre-sales discovery.

---

## 24. Commercial Decision Matrix

| Model                                   | Commercial Type               | Typical Delivery Range | Initial Payment Rule     | Source Code Included?         | Infrastructure Owner          | Customization Level | Support Model      |
| --------------------------------------- | ----------------------------- | ---------------------- | ------------------------ | ----------------------------- | ----------------------------- | ------------------- | ------------------ |
| SaaS (Starter / Business / Enterprise)  | Subscription                  | 2–20 business days     | Per subscription billing | No                            | ChainX                        | Low–Medium          | Per subscription   |
| Dedicated Enterprise Deployment         | Project + agreement           | 2–4 weeks (indicative) | 50% default baseline     | Not by default                | ChainX (dedicated)            | High                | Per agreement      |
| Private Cloud                           | Project + agreement           | 2–4 weeks              | 50% default baseline     | Not by default                | ChainX / customer (as agreed) | High                | Per agreement      |
| On-Premise                              | Project + license             | 4–8 weeks              | 50% default baseline     | Not by default                | Customer                      | High                | Per agreement      |
| Perpetual Enterprise License            | License (custom quotation)    | 3–6 weeks              | 50% default baseline     | Not by default                | Per agreement                 | High                | Defined separately |
| License + Optional Source-Code Transfer | License + negotiated transfer | 4–8 weeks              | 50% default baseline     | Only if explicitly contracted | Per agreement                 | High                | Defined separately |

Values under "Source Code Included?" never imply automatic transfer; source-code
access or transfer applies only if explicitly contracted (Section 14).

---

## 25. Customer-Facing Standard Wording

Reusable approved wording for proposals:

**A. Project Activation**

> "Project execution begins once the applicable agreement has been signed and the
> agreed initial payment has been received."

**B. Delivery**

> "Estimated delivery timelines depend on the selected deployment model,
> integrations, infrastructure requirements and customer readiness. The final
> delivery schedule is established following technical discovery."

**C. Customer Dependencies**

> "Delivery schedules assume timely access to the information, infrastructure,
> credentials and approvals required from the customer and relevant third-party
> providers."

**D. Source Code**

> "Source-code access or transfer is not included unless explicitly stated in the
> applicable commercial proposal and agreement."

**E. Enterprise Pricing**

> "Enterprise licensing and dedicated deployment models are provided through an
> individual commercial proposal following technical discovery."

No fixed Enterprise, perpetual, or source-code license prices are included.

---

## 26. Governance and Exceptions

Any exception to the following must be explicitly approved before the customer
agreement is finalized:

- Initial payment requirements
- Payment milestones
- Delivery structure
- Source-code policy
- IP treatment
- Support model

Approved exceptions must be documented in writing and retained with the engagement
record.

---

## 27. Revision History

| Version | Date       | Author / Owner | Description                        |
| ------- | ---------- | -------------- | ---------------------------------- |
| v1.0    | 2026-07-18 | ChainX         | Initial official commercial policy |

---

**End of document. Internal Use Only.**
