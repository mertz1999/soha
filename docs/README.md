# ENSA AI — Documentation

This folder is ENSA AI's working knowledge base. It was created by splitting the **Business Model Canvas & Operating Playbook v1.0** (9 November 2026) into focused documents that can be updated independently. The original is kept unchanged in [`references/source/`](references/source/ENSA_AI_Business_Model_Canvas_and_Operating_Playbook_v1.0.md); the files below are the living versions.

## Where to start

1. [Executive summary](00-overview/executive-summary.md) — what ENSA is and the decisions made so far.
2. [Business Model Canvas](00-overview/business-model-canvas.md) — the nine blocks at a glance, each linked to its detail doc.
3. [Decision log](00-overview/decision-log.md) — what is decided and what is still open.
4. [Review notes](00-overview/v1-review-notes.md) — consistency checks and gaps found in v1.0.
5. [Action plan](06-execution/action-plan.md) — what happens next.

## Structure

```text
docs/
├── 00-overview/           Summary, canvas snapshot, decisions, labels, review notes
├── 01-market-and-offer/   Canvas Blocks 1–2 — who we sell to and what we sell
├── 02-go-to-market/       Canvas Blocks 3–4 — how we find, win and keep customers
├── 03-commercial/         Canvas Block 5 — revenue, pricing, financial scenarios
├── 04-operations/         Canvas Block 6 — delivery system, scoring, quality, internal agents
├── 05-organization/       Canvas Blocks 7–9 — resources, partners, costs (TO DECIDE)
├── 06-execution/          30-day plan, KPIs, action plan, risks, open questions
├── templates/             Client-facing deliverables and outreach message
├── discovery/             Discovery agent data — companies, analyses, opportunities, runs
└── references/            External resources and the original source document
```

## Document map

### 00 — Overview

| Document | Covers | Source |
|---|---|---|
| [executive-summary.md](00-overview/executive-summary.md) | Concept, positioning, six decisions, current milestone | Header, §1 |
| [business-model-canvas.md](00-overview/business-model-canvas.md) | Nine-block snapshot with status | §2 |
| [decision-log.md](00-overview/decision-log.md) | Decisions, alternatives, pending choices, change history | §1, App. A |
| [conventions-and-status-labels.md](00-overview/conventions-and-status-labels.md) | DECIDED / PROPOSED / HYPOTHESIS / TO VALIDATE, currency, doc headers | Status note, App. B |
| [v1-review-notes.md](00-overview/v1-review-notes.md) | Review findings on v1.0 | New |

### 01 — Market & offer (Blocks 1–2)

| Document | Covers | Source |
|---|---|---|
| [customer-segments.md](01-market-and-offer/customer-segments.md) | Target market, four segments, ICP, disqualifiers | §3.1–3.3 |
| [value-proposition.md](01-market-and-offer/value-proposition.md) | EN/FA positioning, three outcomes, why ENSA | §4.1–4.4 |
| [agent-opportunity-examples.md](01-market-and-offer/agent-opportunity-examples.md) | CRM, invoice, after-sales examples | §4.5 |
| [offer-structure.md](01-market-and-offer/offer-structure.md) | Preview → Discovery → Pilot/Production → Operations | §4.6 |

### 02 — Go-to-market (Blocks 3–4)

| Document | Covers | Source |
|---|---|---|
| [channels.md](02-go-to-market/channels.md) | Founder-led approach, channel mix | §5.1–5.2 |
| [lead-research.md](02-go-to-market/lead-research.md) | Research sources, lead record fields | §5.3–5.4 |
| [sales-pipeline.md](02-go-to-market/sales-pipeline.md) | Twelve pipeline stages and who sets them | §5.5 |
| [outreach-playbook.md](02-go-to-market/outreach-playbook.md) | Message format and rules | §5.6 |
| [customer-relationships.md](02-go-to-market/customer-relationships.md) | Lifecycle, principles, human vs. AI | §6 |
| [segment-validation-experiment.md](02-go-to-market/segment-validation-experiment.md) | 80 companies / 40 pitches, funnel math, post-test questions | §3.5, §5.7, §11.1–11.2 |

### 03 — Commercial (Block 5)

| Document | Covers | Source |
|---|---|---|
| [revenue-streams.md](03-commercial/revenue-streams.md) | Hybrid model decision, streams overview | §7.1 |
| [pricing-and-packages.md](03-commercial/pricing-and-packages.md) | Package prices, ENSA Care / Growth, payment terms | §7.2–7.4 |
| [pricing-method.md](03-commercial/pricing-method.md) | Planning rate, 170-hour example | §7.5 |
| [financial-scenarios.md](03-commercial/financial-scenarios.md) | Customer lifetime revenue, first-year scenario | §7.6–7.7 |
| [usage-cost-protection.md](03-commercial/usage-cost-protection.md) | Inference cost rule and arrangements | §7.8 |
| [inflation-fx-and-market-data.md](03-commercial/inflation-fx-and-market-data.md) | Quote validity, figures to validate | §7.9–7.10 |

### 04 — Operations (Block 6)

| Document | Covers | Source |
|---|---|---|
| [key-activities.md](04-operations/key-activities.md) | Two-engine model, agent/human matrix | §8.1, §8.3 |
| [eight-stage-workflow.md](04-operations/eight-stage-workflow.md) | Stages 1–8 with gates, workflow diagram | §8.2, §9.4 |
| [scoring-models.md](04-operations/scoring-models.md) | Prospect score and opportunity score | §3.4, §8.4 |
| [delivery-quality-checklist.md](04-operations/delivery-quality-checklist.md) | Minimum checklist, standards | §8.5 |
| [iran-engineering-and-compliance.md](04-operations/iran-engineering-and-compliance.md) | Providers, hosting, Persian, legal | §8.6 |
| [internal-workspace.md](04-operations/internal-workspace.md) | Don't overbuild; five foundational systems | §9.1–9.2 |
| [internal-agent-roles.md](04-operations/internal-agent-roles.md) | Seven planned internal agents | §9.3 |
| [reuse-and-productization.md](04-operations/reuse-and-productization.md) | Reusable components, Option C path | §9.5 |

### 05 — Organization (Blocks 7–9, TO DECIDE)

| Document | Covers | Source |
|---|---|---|
| [key-resources.md](05-organization/key-resources.md) | Team options A/B/C, required resources | §14 |
| [key-partners.md](05-organization/key-partners.md) | Partner categories, terms to define | §15 |
| [cost-structure.md](05-organization/cost-structure.md) | Cost categories, model requirements | §16 |

### 06 — Execution

| Document | Covers | Source |
|---|---|---|
| [first-30-days.md](06-execution/first-30-days.md) | Week-by-week start-up plan | §10 |
| [kpis-and-dashboard.md](06-execution/kpis-and-dashboard.md) | KPIs and their data sources | §11 |
| [action-plan.md](06-execution/action-plan.md) | Ten-step sequence with status | §18 |
| [risk-register.md](06-execution/risk-register.md) | Thirteen risks and mitigations | §13 |
| [open-questions.md](06-execution/open-questions.md) | Business, delivery, organization questions | §17 |

### Templates

| Template | Used at | Source |
|---|---|---|
| [ai-opportunity-preview.md](templates/ai-opportunity-preview.md) | Stage 4 — free preview | §12.1 |
| [outreach-message.md](templates/outreach-message.md) | Stage 4 — Persian opening message + checklist | §5.6 |
| [discovery-report.md](templates/discovery-report.md) | Stage 5 — paid discovery | §12.2 |
| [pilot-acceptance-report.md](templates/pilot-acceptance-report.md) | Stage 6 — pilot | §12.3 |
| [monthly-operations-report.md](templates/monthly-operations-report.md) | Stage 8 — support | §12.4 |

### Discovery data

[discovery/README.md](discovery/README.md) explains the layout, naming, pipeline stages, agent rules, and the registry. Agents must read it before writing any data.

## Working with these docs

- **Edit in place** and update the `Updated` date in the document header.
- **Decisions first:** when a decision changes, add it to the [decision log](00-overview/decision-log.md), then update the affected documents.
- **Keep labels honest:** move an item from HYPOTHESIS or TO VALIDATE to validated only with evidence (see [what counts as validation](00-overview/conventions-and-status-labels.md#what-counts-as-validation)).
- **Never edit the source file** in `references/source/`. If a v2 playbook is produced, add it alongside v1.0.
- **Keep client-confidential material out of `docs/`.** Signed contracts, client data, credentials, and meeting notes under NDA belong in a separate, access-controlled client workspace.
