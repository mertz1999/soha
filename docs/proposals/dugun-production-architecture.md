# Düğün.com AI products: production architecture (draft)

> **Status:** Proposal · **Updated:** 2026-11-18 · **Companion to:** [dugun.md](dugun.md)
>
> This describes how the two products shown in SOHA's prototype could work in production. The prototype calls no model and no Düğün.com system. Every Düğün.com integration point below (catalogue feed, vendor profiles, Bütçem, Web Sitem) is an assumption to validate with Düğün.com's team. We have not seen any Düğün.com API and make no claim about what exists.

## Shared principles

- **Consent first for photos.**
  - Personal photos are uploaded only after explicit, specific consent under KVKK (Turkey's personal data protection law).
  - Photos are stored encrypted with a short default retention, and deletion is one tap.
  - Photos are never used for training without separate opt-in consent.
- **AI suggests, vendors fulfil.** Generated images are inspiration. Fit, price and availability always come from the vendor, and the UI says so on every result.
- **Structured outputs, deterministic rendering.** Language models return validated JSON (a style brief, a recommendation reason, an invitation spec). Code renders the final page or file, so what the couple approves is exactly what ships.
- **Keys and models stay on the server.** Browsers never call a model. All generation runs behind Düğün.com's own API, with per-user rate limits and cost caps.
- **Measured, not assumed.** Quality, cost and conversion to vendor contact are measured in a pilot before rollout.

```
Couple ─► Try-on ─────┐
       ─► Venue ──────┼─► Style profile (colours, silhouette, mood, budget band)
       ─► Music ──────┤          │
       ─► Budget ─────┘          ▼
                          Invitation designer ─► print / mobile / save-the-date
                                 │
                                 ▼
                   Matching against Düğün.com vendor profiles ─► quote requests
```

## 1 · Virtual try-on (gelinlik and damatlık)

- **Upload:** a consent screen, then a full-length photo.
  - Client-side checks: resolution, one person, full body visible.
  - Face and body landmarks are computed on the server.
  - Photos are stored per user with a TTL (for example 30 days) and a "delete all my photos" control.
- **Garment processing (offline, per catalogue item):**
  - Background removal and garment segmentation from the vendor's existing product photos.
  - Category attributes: cut, neckline, sleeve, fabric, colour.
  - Vendors approve how their items appear.
  - Works from the catalogue Düğün.com already hosts; the ingestion format is to be agreed.
- **Generation:** an identity-preserving virtual try-on model, conditioned on the person image, the pose and the garment image.
  - Candidates: diffusion-based VTON models, or a commercial try-on API under a data-processing agreement.
  - The model must preserve face, skin tone, body shape and pose.
  - It must reproduce the garment's silhouette, lace, tulle and satin drape. Overlaying a flat PNG is not acceptable.
  - Output is checked automatically: a face-identity similarity threshold, garment similarity to the source and an NSFW and artefact filter. Results that fail are not shown.
- **Experience:**
  - A before/after slider and saving to "Listem".
  - "Mağazayı İncele" opens the vendor page, with prova appointment and quote requests.
  - The vendor sees anonymised interest counts per item.
- **Cost control:** cached results per (photo, garment) pair, a daily generation cap per user, and a queue with progress feedback.

## 2 · Venue and decoration visualisation

- **Input:** a photo of the booked venue, or the venue's own gallery images, which are already on its Düğün.com profile.
- **Analysis:** room segmentation (walls, floor, ceiling, windows, existing fixtures) and a depth map. This defines what must not change.
- **Generation:** style-conditioned image editing that preserves the architecture.
  - Depth and edge control nets, or an instruction-based edit model, with masks limited to furniture, florals, linens and lighting.
  - Style presets (Klasik Lüks, Modern Minimal, Bohem Bahçe…) are prompt templates plus reference palettes.
  - A structural-similarity check against the original rejects results where the architecture drifted.
- **Decoration recommendations:**
  - An LLM turns the chosen preset into a structured shopping list: flower types, table type, linen, lighting, colour codes.
  - The list is matched to decorators and florists whose galleries carry the same style tags.
  - Tags come from vision tagging of vendor galleries, reviewed by the vendor.
- **Output:** "Bu konsepti gerçekleştiren firmalar" sends a quote request with the concept image attached. Prices come only from vendors.

## 3 · Personalised music suggestions

- **Preference collection:** moments (giriş, ilk dans, pasta, eğlence, çıkış), styles, mood, tradition (modern, karma, geleneksel) and must-play or do-not-play lists.
- **Catalogue:** a metadata index of songs: language, tempo/BPM, energy, genre and occasion fit. It starts from Düğün.com's editorial lists and music-vendor repertoires.
- **Retrieval and ranking:**
  - Filter by moment, then score by preference match.
  - Embeddings over song descriptions handle "something like Sezen Aksu but calmer".
  - Diversity is enforced so the top three are not all the same artist.
- **Reasons:** a grounded LLM writes one sentence per pick, using only the metadata fields. A validation step rejects any reason that mentions facts not in the metadata.
- **Licensing:** no audio is hosted. Previews and playlists come only through licensed services (for example a streaming provider's official API or embeds) once an agreement exists. The plan can be shared with the couple's DJ or band booked through Düğün.com.

## 4 · Budget estimation

- **Pricing data:** verified, dated price ranges per city, venue type and service category.
  - Sources: vendor-entered price ranges, consented anonymised quote data and Düğün.com's own guides.
  - Every figure carries a "last updated" date and a source type.
- **Deterministic engine:** totals are computed by code, never by a language model.
  - Fixed costs, per-guest costs and style multipliers.
  - City and guest-count adjustments.
  - A low–high range from the spread of real quotes.
- **AI explanations:** an LLM receives the computed breakdown and the couple's budget, and writes short, grounded advice (for example "50 fewer guests saves about ₺X"). Numbers in the text are checked against the engine's output.
- **Handoff:** one tap moves the estimate into **Bütçem** as starting values, if Düğün.com wants that integration. Couples then replace estimates with real quotes.

## 5 · Invitation generation

- **Design schema:** JSON with canvas size, layers (background art, ornaments, text blocks), fonts, colours and constraints such as minimum size, safe margins and maximum line length.
  - This is the same model the prototype uses in `invite.js`.
- **AI visual directions:**
  - An LLM picks the direction, palette and font pairing from the couple's inputs and their style profile from the studio.
  - An image model may generate decorative artwork (watercolour florals, illustrations) as a background layer only.
  - Text is never rendered into pixels.
- **Editable output:** text stays as SVG or HTML layers. The couple edits names, date, venue, palette and typography live.
- **Layout validation:**
  - Text fitting with real font metrics, with a Turkish glyph check (ğ, ş, ı, İ).
  - Contrast checks and overlap detection between text and artwork.
  - Print safe areas and bleed.
- **Rendering and export:**
  - Server-side rendering (headless browser or SVG-to-PDF) for print-ready PDF with bleed and crop marks.
  - PNG for messaging and a 9:16 version for stories.
  - A save-the-date variant, and a link into **Web Sitem**.
  - Print orders route to invitation vendors listed on Düğün.com.

## Platform

- **Services:**
  - API gateway, with auth through Düğün.com accounts.
  - Generation workers (GPU) behind a job queue.
  - Object storage with TTL and an LLM service.
  - A rendering service and a vector index for music and vendor tags.
- **Safety and quality:**
  - Content filters on uploads and outputs, and identity checks in try-on.
  - A human review queue for flagged results.
  - Evaluation sets for each feature, built from consented samples.
- **Observability:** cost per generation, latency, failure rate, and conversion to vendor contact (the metric that matters to the marketplace).

## Rollout

1. **Pilot (6–8 weeks):** invitation designer and budget estimate. These are low risk: no personal photos and deterministic numbers. Run with a small group of couples.
2. **Try-on beta:** a limited set of partner boutiques and consenting users. Measure identity quality, garment accuracy and appointment requests.
3. **Venue visualisation:** with partner venues that supply their own gallery photos, then user uploads.
4. **Music and the connected studio:** add the shared style profile so each tool feeds the next and the vendor matching.
