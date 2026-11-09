# Discovery Data

> **What this is:** the working output of ENSA's **AI Opportunity Engine** — the discovery agents (Company Discovery, Product Analysis, AI Innovation, Proposal) and the people who review them. It is the first, lightweight version of the *company database* and *opportunity database* described in [internal-workspace.md](../04-operations/internal-workspace.md).
>
> **What this is not:** "Discovery" here means **prospect discovery** — finding and studying companies from public information *before* any sales conversation (workflow Stages 1–4). It is **not** the client-paid *AI Discovery* engagement (Stage 5). Paid-discovery work contains client-confidential information and belongs in a separate client workspace, using the [Discovery Report template](../templates/discovery-report.md).

Every agent writing here must read this file first. Humans reviewing the data should too.

## Layout

```text
discovery/
├── README.md                 This file — rules for agents and reviewers
├── registry.csv              One row per company: the pipeline index
├── _templates/               Copy these to create records; never fill them in place
│   ├── company.md
│   ├── product-analysis.md
│   ├── opportunities.md
│   ├── outreach.md
│   └── run-log.md
├── segments/                 One file per test segment: experiment tracker + landscape notes
│   ├── a-b2b-saas.md
│   ├── b-ecommerce-marketplaces.md
│   ├── c-vertical-saas.md
│   └── d-consumer-apps.md
├── companies/                One folder per company
│   └── <company-id>/
│       ├── company.md            Stage 1 — company record + prospect score
│       ├── product-analysis.md   Stage 2 — evidence-backed product review
│       ├── opportunities.md      Stage 3 — ranked AI-agent ideas
│       ├── outreach.md           Stage 4 — draft pitch, approval, contact log
│       └── evidence/             Optional — screenshots of public pages
└── runs/                     One log per agent run: what was searched, added, skipped
    └── YYYY-MM-DD-<agent>-<topic>.md
```

## Workflow — who writes what

| Stage | File | Written by | Gate before the next stage |
|---|---|---|---|
| 1. Discover | `company.md` + `registry.csv` row | Company Discovery Agent | A human reviews the record and sets `qualified` or `disqualified` |
| 2. Analyze | `product-analysis.md` | Product Analysis Agent | — (agent sets `analyzed` when done) |
| 3. Ideate | `opportunities.md` | AI Innovation Agent | Founder approves 1–2 ideas → `idea-approved` |
| 4. Pitch | `outreach.md` | Proposal Agent drafts | Founder approves and sends → `contacted` |
| 5+ | — | Humans | Conversation moves to the CRM / client workspace |

### Pipeline stages

`pipeline_stage` uses the values from the [sales pipeline](../02-go-to-market/sales-pipeline.md):

| Value | Set by |
|---|---|
| `discovered` | Agent or human |
| `qualified` | **Human only** |
| `analyzed` | Agent or human |
| `idea-approved` | **Founder only** |
| `contacted`, `meeting-scheduled`, `discovery-call-done`, `paid-discovery-proposed`, `paid-discovery-won`, `paid-discovery-lost`, `pilot-proposed`, `pilot-won`, `pilot-lost`, `production-proposed`, `production-won`, `production-lost`, `live` | **Human only** |
| `disqualified`, `archived` | Human (an agent may *recommend* it in `next_action`) |

## Rules for agents

These come straight from the playbook's gates ([eight-stage workflow](../04-operations/eight-stage-workflow.md), [lead research](../02-go-to-market/lead-research.md), [outreach playbook](../02-go-to-market/outreach-playbook.md)) and are not optional.

1. **Public information only.** No logging in to a company's product, no bypassing paywalls or authentication, no scraping protected data, no claiming to have inspected non-public features.
2. **Evidence for every claim.** Each factual statement gets a source URL and access date in the Evidence table. Rate confidence `high` / `medium` / `low`.
3. **Never fabricate.** Not features, metrics, customers, team size, contacts, or prior relationships. If something is unknown, write `unknown` and list it under unknowns.
4. **Hypotheses, not promises.** Business value is always phrased as a hypothesis to validate with the client.
5. **No outreach.** Agents never send messages, submit contact forms, or contact anyone. They write drafts in `outreach.md`; a human approves and sends.
6. **Stay out of human stages.** Agents never set `qualified`, `idea-approved`, or any later stage.
7. **Blockers beat scores.** If you see a legal, consent, privacy, or security problem, fill the `blocker` field. A blocked record stays blocked whatever its score.
8. **Respect the Stage 1 gate.** Run Stages 2–3 only for companies a human has marked `qualified` — unless the founder explicitly authorizes a batch to go straight through. Note that authorization in the run log.
9. **Keep previews lean.** The free preview is capped at roughly 1–2 hours of effort per qualified lead. Aim for about three focused ideas, not an exhaustive study.

## Contact and personal data

- Record **business** contact channels from public sources: company email, contact form URL, official company page, the buyer's **role**.
- For a named individual, store only name, role and the public source. No personal phone numbers, private emails, home addresses, or data from leaks or people-search aggregators.
- Always fill `contact_source`.
- If this repository is pushed to a shared or hosted remote, consider keeping named-individual contact details in the CRM instead of here.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Company folder / `company_id` | kebab-case Latin brand name | `companies/example-crm/` |
| Persian name | `company_name_fa` field | — |
| Duplicate check | Primary website domain, plus Latin and Persian name variants, searched in `registry.csv` | — |
| Several products, one company | One company folder; extra analyses as `product-analysis-<product-slug>.md` | `product-analysis-seller-app.md` |
| Opportunity ID | `<company-id>-op<N>` | `example-crm-op1` |
| Run log | `runs/YYYY-MM-DD-<agent>-<topic>.md` | `runs/2026-11-10-company-discovery-b2b-saas.md` |
| Segment code | `a-b2b-saas`, `b-ecommerce-marketplaces`, `c-vertical-saas`, `d-consumer-apps` | — |
| Dates | ISO `YYYY-MM-DD` (Gregorian) | `2026-11-09` |
| Evidence files | `evidence/YYYY-MM-DD-<what>.png` | `evidence/2026-11-10-pricing-page.png` |

## The registry

[`registry.csv`](registry.csv) has one row per company and is the quick view for the founder and for KPI counts.

- `company.md` frontmatter is the **source of truth**. Whenever you change it, update the matching registry row in the same run.
- Keep the column order. Leave a cell empty rather than writing `N/A`.
- Wrap values containing commas in double quotes.

| Column | Meaning |
|---|---|
| `company_id` | Folder name |
| `company_name`, `company_name_fa` | Latin and Persian names |
| `segment` | Segment code |
| `product_type` | `website`, `saas`, `mobile-app`, or `business-software` |
| `website` | Primary domain (duplicate-check key) |
| `prospect_score` | 0–100, from [scoring models](../04-operations/scoring-models.md) |
| `score_status` | `provisional` or `reviewed` |
| `pipeline_stage` | See the table above |
| `top_opportunity_id`, `top_opportunity_score` | Highest-ranked idea from `opportunities.md` |
| `blocker` | Short description, or empty |
| `owner` | Accountable human |
| `last_updated` | ISO date |
| `next_action` | One short sentence |

## Checklist for each agent run

1. Read this README, the template you will fill, [scoring models](../04-operations/scoring-models.md), and [customer segments & ICP](../01-market-and-offer/customer-segments.md).
2. Create a run log in `runs/` from [`_templates/run-log.md`](_templates/run-log.md).
3. For each company: check for duplicates → copy the template into `companies/<company-id>/` → fill it in → add or update the registry row.
4. Update the counts in the relevant `segments/*.md` tracker, and add any recurring opportunity pattern you noticed.
5. Close the run log: what was added or skipped, issues, and what needs human review.
