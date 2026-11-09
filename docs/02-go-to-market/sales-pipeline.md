# Sales Pipeline

> **Status:** PROPOSED · **Source:** Playbook v1.0 §5.5 · **Updated:** 2026-11-09
>
> **Related:** [Eight-stage workflow](../04-operations/eight-stage-workflow.md) · [Discovery data rules](../discovery/README.md) · [KPIs](../06-execution/kpis-and-dashboard.md)

## Stages

| # | Stage | Meaning | `pipeline_stage` value | Set by |
|---|---|---|---|---|
| 1 | **Discovered** | Basic company/product record created. | `discovered` | Agent or human |
| 2 | **Qualified** | ICP fit assessed and score assigned. | `qualified` | Human |
| 3 | **Analyzed** | Evidence-backed product review completed. | `analyzed` | Agent or human |
| 4 | **Idea approved** | Founder selects the opportunity to pitch. | `idea-approved` | Founder |
| 5 | **Contacted** | Personalized outreach sent. | `contacted` | Human |
| 6 | **Meeting scheduled** | Decision-maker agrees to discussion. | `meeting-scheduled` | Human |
| 7 | **Discovery discussion completed** | Need, data, budget, and constraints validated. | `discovery-call-done` | Human |
| 8 | **Paid discovery proposed** | Defined deliverables and price sent. | `paid-discovery-proposed` | Human |
| 9 | **Discovery won/lost** | Decision recorded. | `paid-discovery-won` / `paid-discovery-lost` | Human |
| 10 | **Pilot proposed / won / lost** | Feasibility and value test negotiated. | `pilot-proposed` / `pilot-won` / `pilot-lost` | Human |
| 11 | **Production proposed / won / lost** | Scoped integration and acceptance criteria. | `production-proposed` / `production-won` / `production-lost` | Human |
| 12 | **Live / support / expansion** | Post-launch relationship. | `live` | Human |

Additional terminal values: `disqualified` (fails ICP or has a blocker) and `archived` (parked for later).

Agents never move a company into a human-owned stage. See the [discovery data rules](../discovery/README.md).

## What to track

Track objections, reasons for losing deals, engineering estimates, and buyer feedback. These learning signals matter more than vanity lead counts.
