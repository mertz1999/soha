# Internal AI-Assisted Operations — Minimal Workspace

> **Status:** PROPOSED · **Source:** Playbook v1.0 §9.1–9.2 · **Updated:** 2026-11-09
>
> **Related:** [Internal agent roles](internal-agent-roles.md) · [Discovery data](../discovery/README.md) · [Reuse & productization](reuse-and-productization.md)

## 1. Do not overbuild before selling

The first business goal is **real paying demand**, not a complex autonomous agent platform. Begin with simple, reliable tools plus human review. Automate only after repeated manual work patterns become clear.

## 2. Five foundational systems

| # | System | Contents | Current implementation |
|---|---|---|---|
| 1 | **Company database** | Companies, apps, categories, contacts, product evidence, qualification score. | [`discovery/companies/*/company.md`](../discovery/README.md) + [`registry.csv`](../discovery/registry.csv) |
| 2 | **Opportunity database** | Proposed agents, hypotheses, business case, integrations, scores, confidence, reuse potential. | [`discovery/companies/*/opportunities.md`](../discovery/README.md) |
| 3 | **Sales CRM** | Outreach messages, meetings, proposals, stages, objections, outcomes. | `outreach.md` per company up to *Contacted*; a dedicated CRM is still TO DECIDE |
| 4 | **Delivery workspace** | Requirements, tasks, repositories, PRs, tests/evaluations, environment access, release gates, support tickets. | Not set up — create per client when the first paid engagement starts |
| 5 | **Reusable agent toolkit** | Provider adapters, model-routing and cost tracking, agent orchestration patterns, connector templates, authentication, approvals, evaluations, logs, deployment components. | Not started — grows from delivered projects |

The Markdown + CSV implementation in `docs/discovery/` is intentionally lightweight. Move to a database or CRM when the volume or collaboration needs justify it; the field names in the [templates](../discovery/_templates/) are designed to migrate cleanly.
