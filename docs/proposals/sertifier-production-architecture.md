# AI Brand-Aware Certificate Designer: production architecture (draft)

> **Status:** Proposal · **Updated:** 2026-11-16 · **Companion to:** [sertifier.md](sertifier.md)
>
> This describes how the feature shown in SOHA's demo could work in production. The demo itself calls no model. Every Sertifier-specific integration point is an assumption to validate with Sertifier's team, because we have not seen their editor internals or confirmed which design actions their API supports.

## Principle: the model writes a spec, a renderer draws it

A language model should never draw the certificate directly. It produces a small, validated **design spec** (JSON). A deterministic renderer, like CertKit in the demo, turns the spec into an editable certificate, and a validator checks it. This keeps every output:

- **on-brand:** colours and fonts come from extracted tokens, not invented ones
- **editable:** the result is fields and shapes, not pixels
- **safe to issue:** the validator guarantees fit, contrast and margins for every recipient
- **cheap to refine:** "more minimal" changes a number in the spec, with no new model call

## Pipeline

```
Website / brand URL
   │  1. Fetch & extract (server-side, deterministic)
   ▼
Brand metadata  ── cached per domain
   │  2. AI brand analysis (LLM, structured output)
   ▼
Brand profile (tokens + tone)
   │  3. Design generation (LLM → 3 design specs, structured output)
   ▼
Design specs ×3
   │  4. Deterministic render + layout validation (+ repair loop)
   ▼
Validated, editable designs
   │  5. Hand-off to Sertifier's editor as an editable template (integration TBD)
   ▼
Customer refines → issues with dynamic recipient fields
```

### 1. Brand metadata extraction (no AI)

A server-side worker, never the browser, fetches the customer's homepage and a few linked pages. It respects robots.txt, sets a timeout and a size cap, and identifies itself with a generic user agent.

It collects:
- the site name and `theme-color`
- logo candidates: header images, SVG logos, the apple-touch-icon
- CSS custom properties and computed colours, weighted by how much of the page they cover
- declared font families
- a full-page screenshot, used as visual evidence for step 2

Results are cached per domain (for example, 30 days) and the customer can always correct them.

It also normalises the data: deduplicates colours, converts them to a perceptual space (OKLCH), picks a usable logo variant for light and dark backgrounds, and maps each font to a licensed or open equivalent the renderer can embed.

### 2. AI brand analysis (LLM)

- **Input:** the extracted metadata, the screenshot (image input), and the customer's answers (purpose, preferred style).
- **Output, as a strict schema via structured outputs:**
  - **Roles:** a primary, accent, paper and ink colour role for each colour, chosen only from the extracted set.
  - **Typography:** a pairing chosen from the renderer's supported fonts.
  - **Tone:** for example `formal`, `contemporary` or `technical`.
  - **Logo:** whether the logo needs a light tile behind it.
- **Constraint:** the model can only pick values that were extracted. The prompt and schema forbid inventing colours or fonts.

### 3. Design generation (LLM → JSON specs)

- **Input:** the brand profile, purpose, style, language and sample data.
- **Output:** three specs that follow the same schema the demo exports (`soha.certificate-design/0.1`):
  - **Design choices:** design system, layout, ornament and elegance levels, and the colour-role mapping.
  - **Wording:** a title and purpose line in the right language.
  - **Placement:** where each dynamic field sits.
- **Variety:** the three specs must use three different design systems, so the customer always sees genuinely different directions.
- **Growth path:** new design systems are added to the renderer, not to the model. The model only chooses and parameterises them.

### 4. Deterministic renderer + layout validation

- **Renderer:** the same code produces the preview, the editor template and the issued PDF/PNG, so what the customer approves is exactly what recipients get.
- **Validation rules (the demo implements the first four):**
  1. **Fit:** every text field fits its box at a minimum size. Names may wrap to two balanced lines and are never shortened. Long titles produce a warning.
  2. **Contrast:** WCAG AA against the actual background (4.5:1 for body text, 3:1 for large text). Colours are nudged when needed.
  3. **Safe area:** all content sits inside the print-safe margin.
  4. **Dynamic fields:** recipient name, credential title, issuer, date and credential ID are all bound to placeholders.
  5. **Stress test:** render with the longest names in the customer's recipient list (or a synthetic worst-case set) before issuing, so bulk issuance never produces a broken certificate.
  6. **Verification area:** a real verification URL or QR from Sertifier replaces the placeholder and is checked for minimum size and quiet zone.
- **Repair:** when a rule fails, the system first tries deterministic fixes, such as a smaller size or another layout variant. Only then does it ask the model to adjust the spec, with the failure report included.

### 5. User-editable design schema

The spec is the source of truth:

- **Editor edits:** text, colours, fonts and layout changes in the editor update the spec.
- **AI refinements:** "make it more minimal" or "more elegant" change ornament, elegance and layout, and are free and instant.
- **Recipient data:** recipient fields stay placeholders until issuance.
- **Versioning:** specs are versioned so a template can be reverted or duplicated.

### Sertifier integration (to validate together)

Two possible routes, depending on what Sertifier's editor supports:

- **Native:** convert the spec into Sertifier's own editor document format (layers, text boxes, dynamic fields), so it appears as a normal, fully editable template.
- **Embedded:** add the generator as a step in the existing "create credential" flow. The AI Certificate Maker already drafts the text there, and this step would add the design.

Open questions for Sertifier:
- How are editor documents represented internally?
- Which of them can be created or updated programmatically?
- How are dynamic fields named?
- Which fonts can be embedded?

The demo makes no claim about any of these.

## Model and inference costs (estimate)

Assumptions:
- Anthropic's **Claude Opus 5.5** (`claude-opus-5-5`) at list prices of **$4 per million input tokens and $20 per million output tokens**, with cache reads at $0.20 per million (prices from Anthropic's model table, November 2026; check the current pricing page before budgeting).
- Structured outputs and a moderate effort setting.
- Token counts are estimates, to be replaced by measured `usage` numbers in a pilot.

| Step | When | Input tokens | Output tokens | Est. cost |
|---|---|---|---|---|
| Brand analysis | Once per domain (cached) | ~6,000 (metadata + screenshot) | ~1,500 (incl. reasoning) | ≈ $0.05 |
| Generate 3 designs | Each "Generate" | ~5,000 (≈4,000 cached instructions/schema + 1,000 new) | ~4,000 (3 specs + reasoning) | ≈ $0.09 |
| Refinements | Each click | 0 (deterministic) | 0 | $0 |
| Repair after a failed validation | Rare | ~2,000 | ~800 | ≈ $0.02 |

**Rough budget:** about **$0.10 per generation**.
- 10,000 generations a month ≈ **$1,000**.
- 100,000 a month ≈ **$10,000**, before batching or other optimisations.

Ways to bring that down, to be measured on real requests rather than assumed:
- **Prompt caching** of the fixed instructions and schema.
- **Caching the brand profile** per domain.
- **The Batch API (50% off)** for non-interactive work, such as pre-generating templates for a new customer's whole catalogue.
- **A lower effort setting** where quality holds.

Moving the high-volume, lower-judgement brand-analysis step to a smaller model (e.g. `claude-haiku-5-5`) is an option to evaluate. It should only be adopted if a quality comparison shows no loss.

## Security and privacy

- **Keys:** API keys live only on the server. The browser never calls the model.
- **Scraping:** only server-side, from public pages, with rate limits.
- **Customer uploads:** logos are stored in the customer's tenant and its data-residency region.
- **Recipient data:** names are never sent to the model. Generation uses sample data, and real recipients are merged in at issuance by the deterministic renderer.
- **Logging:** generated specs and validation reports are logged for quality review. Personal data is excluded.

## Rollout

1. **Pilot:** a few hundred real customer websites run offline. Rate design quality, measure tokens and cost, and tune the prompts and validator.
2. **Beta:** behind a flag inside the create-credential flow, with feedback and "use this design" tracking.
3. **General availability:** add more design systems and multi-language wording, and pre-generate templates for new accounts.
