# Biletino AI layers: production architecture (draft)

> **Status:** Proposal · **Updated:** 2026-11-17 · **Companion to:** [biletino.md](biletino.md)
>
> This describes how the three ideas shown in SOHA's prototype could work in production. The prototype itself calls no model and no Biletino API. Every Biletino-specific integration point below is an assumption to validate with Biletino's team.
>
> Biletino Business lists an "API for Developers" for partners, but we have not seen its documentation and make no claim about what it supports.

## Shared principles

- **AI drafts, people decide.** Nothing generated is published automatically:
  - Organizers approve every event page and poster.
  - Ticket buyers only see suggestions drawn from already-published events.
- **Structured outputs, deterministic rendering.**
  - Language models return validated JSON: an event draft, a poster spec, a recommendation reason.
  - Deterministic code turns that JSON into pages and artwork, so what is approved is exactly what ships.
- **Keys and data stay on the server.** Browsers never call a model. Personal data is minimised and handled under KVKK (Turkey's personal data protection law), with explicit consent for personalisation.
- **Measured, not assumed.** Quality, cost and impact are measured in a pilot before any rollout decision.

```
Organizer text ──► 1 · Event draft (LLM → JSON) ──► review in Event Management ──► publish
                          │
                          ▼
                 2 · Poster specs (LLM → JSON) + background art (image model, optional)
                          │      ▼
                          │   deterministic renderer: text layers, formats, validation
                          ▼
                 review & pick ──► cover 16:9 · post 1:1 · story 9:16 · print 4:5
                          │
Published event metadata ─┴──► 3 · Recommendations: candidates → ranking → reason (LLM, grounded)
```

## 1 · AI Event Studio: description to event draft

**Input:**
- The organizer's free text.
- Optional fields: venue, organisation, base price.
- Organizer context Biletino already has, such as past events, their default venue and their invoice entity.

**Step 1: extract and draft.** One LLM call with structured output returns an event draft JSON:

```json
{
  "title": "Sinyal: Elektronik Kış Gecesi",
  "category": "electronic",
  "tags": ["Elektronik", "Techno", "Gece", "Karaköy", "18+"],
  "start": "2026-12-15T21:00:00+03:00",
  "end": null,
  "city": "İstanbul", "district": "Karaköy", "venue_ref": "venue:liman-depo | null",
  "capacity": 400,
  "description": ["…", "…"],
  "schedule": [{"time": "21:00", "label": "Kapılar açılır"}],
  "ticket_types": [{"name": "Erken Kayıt", "price_try": 520, "quota": 100}],
  "faq": [{"q": "Yaş sınırı var mı?", "a": "…"}],
  "missing": ["end_time", "age_limit_confirmed"],
  "confidence": {"start": "explicit", "capacity": "explicit", "ticket_types": "suggested"}
}
```

**Rules for the draft:**
- **Facts versus suggestions.**
  - Facts must come from the organizer's text or account (date, time, place, capacity, price).
  - Anything the model adds, such as FAQ answers, ticket tiers or schedule times, is marked `suggested` and highlighted for review.
- **Missing information.** Gaps are listed in `missing` and shown as questions, not invented. For example, "Bitiş saati?" asks for the end time.
- **Venue matching.** The venue is matched against Biletino's venue directory by deterministic search, not by the model.

**Step 2: validate.**
- **Dates:** in the future, with the correct timezone.
- **Prices:** non-negative, in TRY.
- **Category:** in Biletino's taxonomy.
- **Text:** required texts are within length limits, and Turkish spelling is checked.
- **Policy:** for example, an age limit is required for nightlife events.

**Step 3: review and publish.**
- The draft opens in the existing Event Management form, pre-filled. Suggested fields are marked.
- The organizer edits, confirms and publishes through the normal flow. Payouts, invoicing and moderation are unchanged.

**Model.**
- Assumed model: a strong LLM with structured outputs, for example Claude Opus 5.5 (`claude-opus-5-5`).
- Expected size: a few thousand input tokens (instructions, taxonomy, the organizer's text) and about 1–2 thousand output tokens per draft.
- Measure real usage and cost in the pilot against the provider's current price list. No figures are assumed here.

## 2 · AI Poster Creator: posters in four formats

**What the user experiences.** The organizer enters the event details, optionally a logo and a reference image, then picks a style. They get three distinct directions, which they can refine and export in the formats Biletino and social channels need.

**Why a hybrid.** Image models are good at atmosphere and texture but unreliable at typography. They misspell words, garble Turkish characters and shift dates. The production design keeps those two jobs apart:

1. **Art systems.**
   - A library of designed poster systems, like the nine in the prototype (Spektrum, Plak, Izgara…). Each defines a composition, a type scale, palettes and layout rules for every format.
   - Designers own this library, and new styles are added there.
2. **Spec generation (LLM).**
   - Input: the event draft and the chosen style. Output: three poster specs (system, variation, palette, intensity, layout, short kicker text).
   - It is the same spec format the prototype renders (`PosterKit.render`).
3. **Background art (optional image model).**
   - Some systems allow a generated background plate, for example abstract light, texture or an illustrative scene, with no text.
   - The prompt is built from the event category, the style and the brand colours. Organizer reference images guide colour and mood.
   - Each plate is checked automatically for text artefacts, faces or logos and safety, and is discarded if it fails.
4. **Deterministic renderer.**
   - It places all text (title, date, venue, organizer logo) as real type, fitted with font metrics.
   - It uses Turkish-aware casing (`İ`/`ı`) and keeps text inside safe areas: the Instagram story UI, and the Biletino cover's crop on listing cards.
   - Outputs: cover 1920×1080 (the size Biletino's event publishing asks for), post 1080×1080, story 1080×1920 and print 4:5 as PNG/PDF, plus the editable spec.
5. **Validation.**
   - Contrast against the actual background, minimum text size per format, and that date and venue match the event record exactly.
   - Logo clear space.
   - A "readability at thumbnail size" check for listing cards.

**Brand and rights.**
- The organizer's logo and images are stored in their account.
- Generated plates come from a provider whose terms allow commercial use.
- No real artist photos or likenesses are generated.
- Fonts are licensed for embedding. The prototype uses open-licence fonts.

**Cost drivers.**
- LLM spec generation is small, about one call per "generate".
- Image plates, when used, dominate cost, so they are cached per event and regenerated only on request.
- Refinements (palette, intensity, layout, format) are deterministic and free.

## 3 · AI Event Suggestions: personalised discovery

**Signals, with consent:**
- **Explicit:** city, interests, preferred days and budget. These are the same controls as the prototype, asked once in onboarding and editable later.
- **Implicit:** views, saves, shares, ticket purchases and attended categories, kept as aggregated features. Raw history is not sent to any LLM.
- **Event side:** category, tags, date, venue, district, price range, organizer, popularity (sales velocity) and remaining capacity.

**Pipeline:**
1. **Candidate generation (deterministic).** Published, upcoming, purchasable events in or near the user's city, inside the date window.
2. **Ranking.**
   - Start with a transparent scoring model, as in the prototype: interest match, date fit, budget fit, popularity and recency.
   - Graduate to a learned ranker (for example gradient-boosted trees on the features above) once there is enough interaction data.
   - Add diversity rules so one category or organizer does not fill the list, and a cold-start fallback for new users and new events.
3. **Reason text.**
   - The "why" line ("Elektronik müzik ilginize ve hafta sonu tercihinize uygun.") is built from the matched features.
   - Templates are enough at first. An LLM can rephrase them for variety, but only from the matched-feature list it is given, never inventing reasons.
4. **Serving.** Precompute per-user lists periodically, with a real-time re-rank on the device or edge when the user changes preferences, so the prototype's instant response holds in production.

**Evaluation:**
- Offline: recall and NDCG on historical purchases.
- Online: an A/B test of click-through rate, ticket conversion and the share of recommended events that sell.
- Fairness checks for small organizers.

**Integration points to validate:** where the module sits (home feed, a "Sana Özel" tab, push and email), the event and catalogue feeds, the interaction events Biletino already logs, and its consent management.

## Human review and publishing workflow

| Step | Who | Gate |
|---|---|---|
| Draft created | Organizer | Suggested fields highlighted; required gaps block publishing |
| Poster chosen | Organizer | Exact date and venue check; contrast and safe-area validation |
| Publish | Organizer, plus Biletino's usual moderation | Unchanged from today |
| Suggestions | Automatic, from published events only | Ranking monitored; reasons limited to matched features |

Generated drafts, specs, validation reports and organizer edits are logged without personal data. They are used to improve the prompts, art systems and validators.

## Rollout

1. **Pilot (4–6 weeks):**
   - Run the event studio and poster creator for a handful of volunteer organizers, offline or behind a flag.
   - Measure time to publish, edit rate per field, poster pick rate and cost per event.
2. **Beta:** inside Event Management for opted-in organizers. Suggestions run as an A/B test for a share of logged-in users.
3. **General availability:** more art systems and English output, organizer-level brand kits, and suggestions extended to email and push.
