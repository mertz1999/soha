# KPIs & Dashboard

> **Status:** PROPOSED · **Source:** Playbook v1.0 §11 · **Updated:** 2026-11-09
>
> **Related:** [Segment validation experiment](../02-go-to-market/segment-validation-experiment.md) (funnel math, post-experiment decisions) · [Sales pipeline](../02-go-to-market/sales-pipeline.md)

| Business area | Primary KPI | Why it matters |
|---|---|---|
| Discovery | Qualified companies researched/week | Productivity of the prospecting engine |
| Ideation | Evidence-backed agent ideas/company | Quality, not just volume, of innovation |
| Outbound | Qualified meetings/personalized pitch | Relevance of outreach |
| Sales | Paid discovery conversion rate | Willingness to pay |
| Commercial | Pilot → production conversion | Proof of value and trust |
| Economics | Planned vs. actual engineering hours | Pricing accuracy and project margin |
| Agent quality | Task success and escalation rate | Real-world usefulness |
| Agent cost | Cost per successful task | Sustainable unit economics |
| Customer value | Time saved / conversion / CSAT / retention (case-dependent) | Whether the feature delivers results |
| Retention | Monthly recurring support revenue and renewal rate | Long-term relationship strength |

Track all prospecting and sales metrics by **segment** so the business can learn which vertical attracts the best paying customers.

## Data sources

| KPI group | Where the data comes from |
|---|---|
| Discovery, ideation | [`discovery/registry.csv`](../discovery/registry.csv), run logs in [`discovery/runs/`](../discovery/runs/) |
| Outbound, sales | `pipeline_stage` in the registry; contact logs in each company's `outreach.md` |
| Commercial, economics, agent quality/cost, customer value, retention | Client delivery workspace and [monthly operations reports](../templates/monthly-operations-report.md) (not yet set up) |

Avoid inventing a response rate or paid-conversion rate to make the business case look stronger.
