# Customer Segments — Canvas Block 1

> **Status:** DECIDED — multi-segment test · ICP is PROPOSED · **Source:** Playbook v1.0 §3.1–3.3 · **Updated:** 2026-11-09
>
> **Related:** [Scoring models](../04-operations/scoring-models.md) (prospect qualification score) · [Segment validation experiment](../02-go-to-market/segment-validation-experiment.md) · [Segment research data](../discovery/segments/)

## 1. Target market

**Geography:** Iran, with Persian-first communication, workflows, and product analysis. The business should account for local infrastructure, payment patterns, access constraints, regulatory requirements, and the availability of Persian-language data and AI services.

**Type of buyer:** An established company that already operates a website, SaaS application, mobile app, or business software product with real users and a plausible incentive to add AI capabilities.

**Not the initial focus:** Pre-product startups without users, generic one-off chatbot buyers, organizations with no budget or decision-maker access, and customers unwilling to provide the necessary authority or integration support.

## 2. Four initial target segments

The launch is a **controlled four-segment experiment**, not a broad, unfocused campaign.

| Segment | Example software categories | Illustrative AI agents | Why the segment may buy | Initial treatment |
|---|---|---|---|---|
| **A. B2B SaaS / business software** | CRM, HR, ERP, accounting, scheduling, project management | Sales follow-up, document processing, intelligent reporting, workflow executor | Recurring tasks and measurable operational value | Equal initial research effort |
| **B. E-commerce and marketplaces** | Online stores, marketplaces, booking services, seller platforms | Product discovery, customer support, order/return handling, catalog enrichment | Conversion, support efficiency, seller productivity | Equal initial research effort |
| **C. Vertical SaaS / industry-specific platforms** | Education, real estate, logistics, healthcare administration, sector-specific operations | Domain-specific assistants, document analysis, workflow coordination | Strong domain differentiation and repeatable industry workflows | Equal initial research effort |
| **D. Consumer web/mobile apps** | Productivity, learning, travel, lifestyle, personal services | Personalized assistants, recommendations, in-app task execution | Engagement, retention, premium features | Equal initial research effort |

**HYPOTHESIS:** B2B SaaS may be a good long-term beachhead because of recurring workflows and measurable outcomes, but the explicit choice is **not** to privilege it before testing. Segment prioritization should be driven by evidence from outreach, paid discovery, conversion, technical feasibility, and unit economics.

Segment codes used in discovery data: `a-b2b-saas`, `b-ecommerce-marketplaces`, `c-vertical-saas`, `d-consumer-apps`.

## 3. Ideal Customer Profile (ICP), version 1

| Dimension | Proposed profile |
|---|---|
| Location | Iran |
| Business maturity | Established product, active customers/users |
| Approximate size | **5–150 employees**, a heuristic rather than a firm limit; an earlier draft suggested 10–100 |
| Product | Live website, SaaS product, mobile app, or specialized business system |
| Decision-maker | Founder, CEO, CTO, Head/Director of Product |
| Technical readiness | API access or other legitimate integration mechanisms; structured workflows and sufficient data |
| Commercial readiness | Budget, a sponsor with approval authority, and interest in product differentiation, efficiency, or revenue |
| Opportunity signal | Clear workflow friction, manual processing, user-experience gap, or monetizable feature potential |
| Desired engagement | Paid discovery, pilot, production feature, and optionally support |

### Disqualifiers / flags

- No real user problem
- Inability to access required data legitimately
- No buyer sponsorship
- Highly uncertain integration cost
- Uncompensated discovery demands
- Requests requiring unsafe/unauthorized use of data

## 4. Qualifying prospects

Each prospect is scored with the **100-point prospect qualification score** (AI opportunity value, technical feasibility, decision-maker access, ability to pay, repeatability, measurable impact). The full rubric and bands live in [scoring-models.md](../04-operations/scoring-models.md) so that the prospect score and the opportunity score are maintained in one place.

A high score must never override a legal, consent, privacy, or security blocker.
