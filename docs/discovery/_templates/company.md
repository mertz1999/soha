---
record_type: company
company_id: example-company          # = folder name; kebab-case Latin brand name
company_name: ""
company_name_fa: ""
website: ""                          # primary domain — duplicate-check key
product_name: ""
product_url: ""
product_type: ""                     # website | saas | mobile-app | business-software
segment: ""                          # a-b2b-saas | b-ecommerce-marketplaces | c-vertical-saas | d-consumer-apps
sub_category: ""                     # e.g. CRM, accounting, online store, real estate
company_size_estimate: ""            # employee range + source; ICP heuristic is 5–150
likely_buyer_role: ""                # Founder | CEO | CTO | Head/Director of Product
verified_business_contact: ""        # public business channel only — see discovery/README.md
contact_source: ""                   # URL where the contact was found
prospect_score: null                 # 0–100 — see docs/04-operations/scoring-models.md
score_status: provisional            # provisional | reviewed
pipeline_stage: discovered           # allowed values and who may set them: discovery/README.md
blocker: ""                          # legal / consent / privacy / security blocker, if any
owner: ""                            # accountable human
discovered_by: ""                    # agent name + run id, or person
discovered_on: YYYY-MM-DD
last_contact_date: ""
last_updated: YYYY-MM-DD
next_action: ""
---

# [Company name] — Company Record

## Company description

<!-- 2–4 sentences from public sources: what the company does, who its users are. -->

## Public product features

-

## Other products

<!-- Other products from the same company, if any. Each analyzed product gets its own product-analysis-<slug>.md. -->

## Technical integration clues

<!-- Public API docs, developer portal, webhooks, integrations marketplace, SDKs, mobile apps, import/export. "None found" is a valid answer. -->

## Hypothesized customer pain

<!-- Hypotheses only — to be validated with the client. -->

## Prospect qualification score

| Criterion | Weight | Rating (0–5) | Points | Rationale |
|---|---:|---:|---:|---|
| AI opportunity value | 25 | | | |
| Technical feasibility | 20 | | | |
| Access to a decision-maker | 20 | | | |
| Ability to pay | 15 | | | |
| Repeatability of solution | 10 | | | |
| Measurable business impact | 10 | | | |
| **Total** | **100** | | | |

Points = weight × rating / 5 · Bands: 80–100 high priority · 60–79 investigate · below 60 deprioritize.

## Disqualifiers / flags

<!-- Check against the ICP disqualifiers: no real user problem, no legitimate data access, no buyer sponsor, highly uncertain integration cost, uncompensated discovery demands, unsafe/unauthorized data use. -->

## Research evidence

| # | Claim | Source URL | Accessed | Confidence |
|---|---|---|---|---|
| 1 | | | | |

## Confidence and unknowns

-

## History

| Date | By | Change |
|---|---|---|
| YYYY-MM-DD | | Record created |
