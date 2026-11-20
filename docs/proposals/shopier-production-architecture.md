# Shopier AI visual commerce: production architecture (draft)

> **Status:** Proposal · **Updated:** 2026-11-20 · **Companion to:** [shopier.md](shopier.md)
>
> This describes how the three experiences in SOHA's prototype could work in production: the AI Product Studio, the AI Campaign Studio and AI Virtual Try-On. The prototype calls no model and no Shopier system.
>
> **What we checked, and what we didn't.** Shopier's public developer portal (developer.shopier.com) documents:
> - OAuth 2.0 seller authorisation and permission scopes such as `products:read`, `products:write` and `shop:read`
> - a Products API whose product model has a `media` array
> - webhooks
>
> We have not confirmed whether an app can upload new image files into a product's `media` through the API. Anything beyond the documented endpoints is an assumption to validate with Shopier.

## Shared principles

- **The product never changes.** Generated product images must show the seller's real product. The pipeline keeps the product's own pixels: it cuts the product out, generates only the scene around it, and composites the original product back. It then checks that the result still matches before a seller sees it.
- **Seller approval before anything is published.** Generated assets land in a review tray. Nothing reaches a listing, a storefront or a social channel until the seller approves it.
- **Editable, not baked.** Campaign text, prices and discounts live in a structured layout, never inside generated pixels. That avoids misspelled AI text and wrong prices, and the seller can always edit.
- **Personal photos only with consent.** Buyer try-on photos are processed only after explicit consent under KVKK, stored encrypted with a short retention, never used for training, and deletable in one tap.
- **Keys and models stay on the server.** Browsers never call a model. Generation runs behind SOHA's or Shopier's API with per-seller quotas and cost caps.
- **Measured before rollout.** Quality, acceptance rate, cost per approved image and the effect on listing conversion are measured in a pilot.

```
Seller catalogue (Products API, OAuth)          Seller brand profile
        │                                                │
        ▼                                                ▼
  Product photo ─► cut-out + mask ─► scene generation ─► composite ─► QA ─► review tray ─► approve ─► listing media
                         │                                                       │
                         └──────────► campaign layouts (structured, editable) ───┘─► PNG / social sizes / store banner
  Garment photo ─► garment parsing ─► try-on on model photos ─► QA ─► review tray ─► product page
```

## 1 · AI Product Studio

**Ingestion**
- Read the seller's products through the Products API (`products:read`): title, category, variations and existing `media`.
- The seller can also upload a fresh phone photo.
- Checks on upload: resolution, blur, exposure, one main product in frame. If the photo is too poor, the seller gets a short tip ("shoot in daylight, fill half the frame") before any generation runs.

**Foreground preservation**
- A segmentation model produces the product mask and a clean cut-out with edge matting. Glass, jewellery and fine hair edges get alpha matting.
- The cut-out is fixed and is never regenerated. Generation edits only the background region.
- Optional light-matching pass: shadows and reflections are generated around the cut-out, and the cut-out's own colour is only white-balanced within tight limits.

**Scene generation**
- A style preset (studio, lifestyle, luxury campaign, seasonal) plus a variation, background, light, mood and aspect ratio become a structured brief. This is the same "Brief" line the prototype shows.
- An image model generates the scene by inpainting or outpainting around the masked product, conditioned on the product's size, the camera angle and the light direction.
- Aspect ratio comes from outpainting at generation time, not by cropping a square.
- Seasonal presets come from a curated calendar for Turkey: Yılbaşı (New Year), Sevgililer Günü (Valentine's Day), Anneler Günü (Mother's Day), Ramazan Bayramı, Efsane Cuma (Black Friday) and summer.

**Quality checks (automatic, before the seller sees anything)**
- **Product identity:** compare the product region of the result with the original cut-out using perceptual and embedding similarity, colour histogram distance and edge alignment. Reject anything below threshold.
- **Artefacts:** extra or duplicated products, warped geometry, hands or people in frame, text or logos in the background, low sharpness.
- **Policy:** no restricted content, no copied brand marks.
- Rejected images are regenerated automatically within a retry budget. The seller only sees images that passed.

**Seller approval**
- The seller sees three variations per style and compares each against the original.
- They can keep, regenerate or adjust, then save to the listing.
- Saving writes to the product's `media` through `products:write`, if the API supports it, or offers a download plus "add to listing" guidance until it does.

## 2 · AI Campaign Studio

**Brand profile**
- Stored per seller: name, logo (SVG or PNG), palette, typeface choice, tone of voice and preferred directions.
- Bootstrapped from the store: logo, banner, product colours. The seller confirms it once.

**Product selection**
- Any product, using the approved studio images from section 1, so campaigns reuse the same product visuals.

**AI creative generation**
- A language model turns the campaign name, message, discount and channel into structured copy options: headline, sub-line and CTA, in Turkish and English, with length limits per format.
- The seller's own Shopier product description (from the existing AI description app, where present) can seed it.
- An image model generates **background artwork only**: textures, sets and colour fields matched to the palette. It never generates the product or the text.

**Structured, editable templates**
- Each direction (Fashion Editorial, Bold Social, Minimal Luxury, and more over time) is a set of layout rules per format, not a fixed image.
- The output is a JSON spec. The prototype already works this way: `campaign.js` turns a spec into SVG with live `<text>`.
- Fields: product image slot, background slot, headline, message, discount badge, CTA, logo slot, palette roles.
- Text fitting, wrapping and Turkish casing (İ/ı) happen in the renderer, so copy never overflows.

**Multi-format rendering**
- One spec renders to Instagram post 1:1, story 9:16, portrait ad 4:5 and store banner 16:9.
- Each format has its own composition rules (masthead placement, type scale, product size), not a crop.
- Rendering runs on the server for final export: SVG to PNG and JPG, with fonts embedded, at platform resolutions. The same renderer runs in the browser for instant preview.

**Export**
- PNG and JPG per format, a zipped campaign pack, and the editable spec saved to the seller's campaign library.
- Optional: push a discount code through the Discounts API (`discounts:write`), if the seller enables it.

## 3 · AI Virtual Try-On

**Garment ingestion**
- Uses the seller's existing product photos: flat-lay, mannequin or on-model.
- Garment parsing extracts category, segmentation, length, sleeve, neckline, fabric and print.
- Garments that need special handling (sheer fabrics, complex layering) are flagged.

**Models**
- **For sellers:** a library of licensed, consented model photos in diverse skin tones, sizes and ages, each in several poses. Sellers can also upload their own model shots, with model releases.
- **Synthetic models:** fully generated people are allowed only if clearly labelled, never resembling a real person, and approved by Shopier's policy team.

**Identity and garment preservation**
- A diffusion-based try-on model conditioned on the person image, a pose map, a body or parsing mask and the garment image.
- Checks:
  - face and identity similarity before vs after
  - garment similarity: colour, pattern and logo-free regions
  - body proportion consistency
  - background unchanged
- Results below threshold are not shown.

**Consent and privacy (buyer try-on, a later phase)**
- Off by default. Explicit KVKK consent screen.
- Photo processed in an isolated job, stored encrypted for a short TTL (for example 24 hours), never used for training, deletable at once.
- No buyer photo is ever visible to the seller.

**Evaluation**
- An offline benchmark per garment category with human ratings for realism, fit and identity.
- Online: try-on use, add-to-cart after try-on, return rate on tried-on items.

## 4 · Shopier integration

- **Authorised seller access:** distributed as a Shopier App Store app. The seller installs it and authorises it through OAuth 2.0 with only the scopes needed (`products:read`; `products:write` only if saving images back is enabled; `shop:read` for branding). Tokens are encrypted at rest and refreshed on the server.
- **Catalogue retrieval:** paginated product sync, plus product webhooks to pick up new or changed listings.
- **Linking assets to listings:** each generated asset stores `seller_id`, `product_id`, the source image hash, the preset and the approval state. Write-back into the product `media` array is subject to API confirmation with Shopier.
- **Tenant isolation:** each seller's data lives in its own storage prefix, with row-level security in the database and per-tenant encryption keys. No cross-seller retrieval. Model prompts never include other sellers' data.
- **Review and publishing permissions:** generated means draft, approved means it can be saved or published. Only the seller account (or staff roles Shopier defines) can publish. Everything is logged in an audit trail.
- **Billing:** a free tier (for example a set number of images a month) and credit packs, through the App Store's pricing model. The existing "Yapay Zekadan Ürün Açıklamaları" app uses a free trial of 10 descriptions; a similar trial fits here.

## 5 · Services and infrastructure

- **API service:** auth, catalogue sync, job orchestration, review tray, export.
- **Job queue and GPU workers:** segmentation, generation, try-on and QA, scaled to zero when idle.
- **Renderer service:** the campaign spec to SVG, PNG and JPG. The same code runs in the browser for preview.
- **Storage:** object storage with signed URLs for assets, and Postgres for specs, approvals and audit.
- **Observability:** cost per approved image, acceptance rate, QA rejection reasons, latency (target under 20 seconds for three variations).

## 6 · How the prototype becomes the product

The prototype already has the right seams:
- `PHOTOS` / `pic()` in `assets/proposal.js` resolve an image by `(product, style, variation)`. In production this becomes `GET /v1/products/{id}/images?style=…&variation=…`, returning approved or freshly generated assets.
- The prototype already composites like the production pipeline. It cuts the product out of the phone photo (Apple Vision, offline), places that cut-out on a generated empty background in a canvas, and adds a contact shadow, cast shadow and light grade. Production replaces the fixed backgrounds with backgrounds generated around the mask, plus a learned relighting pass.
- `campaign.js` `render(spec)` is the template engine. In production the same spec format is filled by the copy model and rendered both in the browser (preview) and on the server (export).
- The upload controls already keep files local. In production they post to a signed upload URL, only after the consent step for personal photos.

## 7 · Risks and how we handle them

| Risk | Mitigation |
|---|---|
| Generated image alters the product | Cut-out compositing plus an automatic identity check; the seller compares before saving |
| Wrong text or prices in creatives | Text never generated into pixels; prices and discounts come from structured fields |
| Try-on misrepresents fit | Label results as visualisations; size guidance stays with the seller; measure return rate |
| Personal data | Consent, short TTL, isolation, no training, KVKK documentation |
| Cost | Per-seller quotas, caching of presets, cheaper models for previews and the best model for the final |
| API limits | Start read-only with download export; enable write-back after Shopier confirms the endpoint |
