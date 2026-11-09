# Future Internal Agent Roles

> **Status:** PROPOSED — planned roles, not built capabilities · **Source:** Playbook v1.0 §9.3 · **Updated:** 2026-11-09
>
> **Related:** [Internal workspace](internal-workspace.md) · [Discovery data rules](../discovery/README.md) · [Customer relationships — human vs. AI](../02-go-to-market/customer-relationships.md#4-human-vs-ai-responsibilities)

These are planned roles rather than already built capabilities. The first four make up the **AI Opportunity Engine** and write to [`docs/discovery/`](../discovery/README.md).

| Agent | Engine | Writes to |
|---|---|---|
| Company Discovery Agent | Opportunity | `company.md`, `registry.csv`, `runs/` |
| Product Analysis Agent | Opportunity | `product-analysis.md` |
| AI Innovation Agent | Opportunity | `opportunities.md`, segment pattern notes |
| Proposal Agent | Opportunity | `outreach.md` (drafts only) |
| Sales/CRM Assistant | Opportunity → Delivery | CRM (TO DECIDE) |
| Implementation Assistant | Delivery | Client repositories (authorized) |
| Quality & Operations Assistant | Delivery | Evaluation and operations reports |

## Company Discovery Agent

- Researches publicly available products and categories.
- Updates candidate records and source links.
- Deduplicates companies and identifies incomplete data.

## Product Analysis Agent

- Describes observable features and user journeys.
- Identifies plausible workflow gaps and integration clues.
- Marks uncertainty; does not pretend to have internal access.

## AI Innovation Agent

- Generates product-specific agent ideas.
- Links each idea to a user pain point and success metric.
- Evaluates business value, feasibility, and repeatability.

## Proposal Agent

- Prepares a short customer-specific pitch and demo outline.
- Uses reviewed evidence; does not fabricate product findings.
- Produces drafts for human approval.

## Sales/CRM Assistant

- Captures meetings and outcomes, proposes next actions.
- Helps produce discovery questions, statements of work, and pilot proposals.
- Never commits to prices or sends messages without appropriate approval.

## Implementation Assistant

- Helps with architecture, coding, integrations, tests, and documentation.
- Uses project-specific authorized repositories and environments.
- Creates reviewable changes and follows release gates.

## Quality & Operations Assistant

- Runs evaluations, flags failures, analyzes alerts and costs.
- Suggests fixes but does not silently change client production systems.
