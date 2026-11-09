# Illustrative Agent Opportunities

> **Status:** Concept examples (HYPOTHESIS) · **Source:** Playbook v1.0 §4.5 · **Updated:** 2026-11-09
>
> **Related:** [Value proposition](value-proposition.md) · [Scoring models](../04-operations/scoring-models.md) · [Opportunity record template](../discovery/_templates/opportunities.md)

These are **concept examples**, not claims that named Iranian companies need or would purchase the features. Real, company-specific opportunities are recorded in [`discovery/companies/`](../discovery/companies/).

## Example A — CRM: AI Sales Follow-up Agent

**Current workflow:** Salesperson opens leads → reads history → decides next action → writes follow-up → updates the CRM.

**Proposed workflow:** Agent reads authorized lead data → summarizes context → recommends action → prepares a follow-up → obtains human approval → uses an authorized channel to send → logs the result to the CRM.

**Business hypothesis:** Less manual work, faster response, potentially higher lead conversion.

**Metrics:** Time per lead, recommendation approval rate, response rate, conversion rate, cost per successful follow-up.

## Example B — Accounting SaaS: AI Invoice Processing Agent

**Workflow:** Reads Persian invoices and supporting documents, extracts fields, matches records, detects discrepancies, and prepares accounting entries for review.

**Metrics:** Processing time per invoice, extraction accuracy, discrepancy-detection precision, correction effort, error rate, cost per processed invoice.

**Guardrail:** Financial postings should require defined permissions and approval processes.

## Example C — E-commerce: AI After-Sales Agent

**Workflow:** Answers order-status questions, assists with return requests, suggests valid options according to policy, and escalates exceptions to a human.

**Metrics:** First-response time, successful self-service resolution, agent escalation rate, CSAT, support cost.

**Guardrail:** Refunds or account changes should be controlled by authorization, policy, and audit logging.

## Other opportunities considered

- Personalized product search and recommendations for marketplaces.
- Seller-support and catalog-enrichment agents.
- Workflow coordinators in logistics, real estate, and vertical software.
- Intelligent reporting and business data-exploration agents.
- User-facing personal assistants in educational and productivity apps.
