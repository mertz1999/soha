# Review Notes — Playbook v1.0

> **Status:** Review findings (new) · **Source:** Review of Playbook v1.0 on 2026-11-09 · **Updated:** 2026-11-09
>
> **Related:** [Open questions](../06-execution/open-questions.md) · [Decision log](decision-log.md) · [Financial scenarios](../03-commercial/financial-scenarios.md)

The playbook is well-structured and honest about what is decided and what isn't. These notes cover consistency checks, gaps, and decisions that would make execution smoother. Nothing here changes a **DECIDED** item.

## 1. Arithmetic — all checks pass

| Check | Result |
|---|---|
| Production estimate: 20 + 60 + 40 + 30 + 20 hours | 170 h ✓ · 170 × 2.5M = 425M ✓ |
| Customer lifetime: 40 + 140 + 320 + 210 | 710M ✓ · 210 / 6 = 35M/month ✓ |
| First-year revenue: 480 + 840 + 1,680 + 810 | 3,810M ✓ |
| First-year costs: 70 × 2 × 12 × 1.25 = 2,100; + 420 + 240 | 2,760M ✓ |
| Surplus and margin | 1,050M ✓ · 27.6% ✓ |
| Both scoring rubrics | Weights sum to 100 ✓ |
| Support tiers vs. planning rate | Care 20–40M for 8–15 h and Growth 45–90M for 18–35 h both imply ≈ 2.5M/h ✓ consistent with §7.5 |

## 2. Discovery and Pilot prices imply fewer hours than their durations suggest

At the 2–3M/h planning rate:

| Package | Price band | Implied effort | Stated duration |
|---|---|---|---|
| AI Discovery | 30–60M | ~10–30 h | 1–2 weeks |
| AI Pilot | 100–200M | ~33–100 h | 2–4 weeks |
| Production | 250–700M | ~83–350 h | 4–10 weeks |

If "1–2 weeks" of discovery means one engineer close to full-time (~40–80 h), the discovery price is below the planning rate. That may be intentional — discovery as a low-friction entry product — but it should be a **conscious** choice, and the hours should be tracked against the price from the first engagement. *Suggested action:* state the target effort per package alongside the price in [pricing & packages](../03-commercial/pricing-and-packages.md).

## 3. The first-year scenario hides conversion assumptions

12 discoveries → 6 pilots → 4 production projects → 3 support clients implies **50%** discovery→pilot, **67%** pilot→production and **75%** support attachment. The playbook rightly warns against inventing conversion rates (§11.1), yet the scenario depends on them. It also prices production at 420M per project, while the lifetime example charges 320M for the *remaining* production after a pilot. *Suggested action:* label these as explicit assumptions in the [financial scenarios](../03-commercial/financial-scenarios.md) and replace them with experiment data as soon as it exists.

## 4. Founder time is the real constraint in the first six weeks

Everything in the acquisition engine is founder-led: approving leads and ideas, 40 previews at ~1–2 h each (40–80 h), outreach, follow-ups, meetings, proposals. Founder compensation is also excluded from the cost scenario. *Suggested action:* estimate founder hours per week for the experiment before committing to the weekly targets, and include founder cost in the Block 9 model.

## 5. The 30-day plan and the six-week experiment don't line up

| Week | 30-day plan (§10) | Six-week experiment (§5.7) |
|---|---|---|
| 1 | Set up workspace, landing page | Build prospect database and templates |
| 2 | Research first 20 companies | Analyze first products, draft previews |
| 3 | Begin outreach | Outreach |
| 4 | **Propose paid discovery** | Outreach |
| 5 | — | **Propose paid discovery** |
| 6 | — | Compare segments |

Neither plan spreads the 80 company records over the weeks. One possible merged calendar:

| Week | Companies researched (cumulative) | Previews / pitches (cumulative) | Other |
|---|---:|---:|---|
| 1 | 20 (5 per segment) | — | Workspace, templates, landing page |
| 2 | 50 | 15 previews | First founder reviews |
| 3 | 80 | 30 previews · 20 pitches | First meetings |
| 4 | 80 | 40 previews · 40 pitches | Meetings, follow-ups, first paid-discovery proposals |
| 5 | — | — | Paid-discovery proposals to qualified buyers |
| 6 | — | — | Segment comparison and decision |

## 6. "Discovery" means two different things

Stage 1 *company discovery* (unpaid prospecting from public data) and *Paid AI Discovery* (a client engagement) share a word. That will cause confusion in pipeline stages, agent instructions, KPIs and client conversations. In this repository, `docs/discovery/` means **prospect discovery**, and pipeline values use `paid-discovery-*` for the paid package. *Suggested action:* consider a distinct client-facing name for the paid package (e.g. "AI Discovery Sprint") or call the internal stage "prospecting".

## 7. Personal data in the lead record

`verified_business_contact` and decision-maker identification (e.g. via LinkedIn) mean storing data about individuals. The playbook asks to respect privacy and contact rules but doesn't say where contact data lives or for how long. The [discovery rules](../discovery/README.md#contact-and-personal-data) set a conservative default (business channels and roles only, source always recorded). *Suggested action:* decide where the CRM lives and whether named contacts should be committed to git at all, especially if the repo is pushed to a hosted remote.

## 8. The prospect score depends on something not known yet

The prospect score's largest criterion, *AI opportunity value* (25 points), can only be judged properly after Stage 3 generates opportunities. The discovery templates therefore mark Stage 1 scores as `provisional` and re-score after Stage 3.

## 9. Pick one ICP size for the experiment

The ICP says 5–150 employees (earlier draft: 10–100). Pick one range for the six-week test, so segment comparisons are like-for-like. Record the choice in the [decision log](decision-log.md).

## 10. Gaps worth filling before the first paid engagement

- **Contract set:** NDA, master services agreement / statement of work with acceptance criteria, change-request form, data-processing terms. The playbook references these but provides no templates.
- **Outreach channels and cadence in Iran:** which channels count as legitimate business channels (email, LinkedIn, contact forms, locally used messengers) and how many follow-ups to send.
- **Definition of a "qualified meeting":** needed for the primary outbound KPI.
- **Objection / loss-reason taxonomy:** a fixed list (price, trust, unclear ROI, technical constraints, internal capacity, timing) makes segment comparisons possible.
- **Landing page / brand:** a Week 1 deliverable with no supporting doc yet.

## 11. Items still to verify

Already flagged in the source and carried over as **TO VALIDATE**: the market figures in [inflation, FX & market data](../03-commercial/inflation-fx-and-market-data.md), the 10.9M inference estimate in [usage-cost protection](../03-commercial/usage-cost-protection.md), and the regulatory claim in [Iran engineering & compliance](../04-operations/iran-engineering-and-compliance.md). The external links in [external resources](../references/external-resources.md) were not checked during this review.
