# Scoring Models

> **Status:** PROPOSED — operational hypotheses, not statistically validated thresholds · **Source:** Playbook v1.0 §3.4, §8.4 · **Updated:** 2026-11-09
>
> **Related:** [Customer segments & ICP](../01-market-and-offer/customer-segments.md) · [Company record template](../discovery/_templates/company.md) · [Opportunities template](../discovery/_templates/opportunities.md)

ENSA uses two separate 100-point scores. Keep them separate: the **prospect score** rates the *company*; the **opportunity score** rates a *proposed AI agent*.

## How to calculate

Rate each criterion from **0 to 5**, then:

```text
weighted points = weight × rating / 5
total score     = sum of weighted points   (0–100)
```

*Example:* a rating of 4 on a 25-point criterion gives `25 × 4 / 5 = 20` points.

## 1. Prospect qualification score (company)

Used at **Stage 1 — Company discovery**. Recorded in `company.md`.

| Criterion | Weight |
|---|---:|
| AI opportunity value | 25 |
| Technical feasibility | 20 |
| Access to a decision-maker | 20 |
| Ability to pay | 15 |
| Repeatability of solution | 10 |
| Measurable business impact | 10 |
| **Total** | **100** |

**Proposed qualification bands:**

- **80–100:** High-priority account for personalized research and outreach.
- **60–79:** Investigate missing information before investing more effort.
- **Below 60:** Deprioritize until the fit changes.

The Stage 1 score is **provisional** (`score_status: provisional`): "AI opportunity value" can only be estimated roughly before opportunities are generated. Re-score after Stage 3 and when a human reviews the record (`score_status: reviewed`).

## 2. Opportunity score (proposed AI agent)

Used at **Stage 3 — Opportunity generation and ranking**. Recorded per opportunity in `opportunities.md`.

| Criterion | Weight |
|---|---:|
| Expected business value | 30 |
| Technical feasibility | 25 |
| Measurable outcome | 15 |
| Repeatability across customers | 15 |
| Evidence of customer demand | 15 |
| **Total** | **100** |

**Preliminary action threshold:** **80+ to prioritize**, **60–79 to investigate**, **below 60 to deprioritize**, subject to learning from actual results.

## Overriding rule

These thresholds are operational hypotheses, **not statistically validated thresholds**. A high score must never override a legal, consent, privacy, or security blocker. Record any blocker in the `blocker` field and treat the record as blocked regardless of score.
