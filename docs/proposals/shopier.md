# Proposal: Shopier (SOHA → Shopier)

> **Status:** Published with illustrations (photos pending) · **Updated:** 2026-11-20
> **Pages:**
> - English (default): `site/proposals/shopier/` → <https://mertz1999.github.io/soha/proposals/shopier/>
> - Turkish: `site/proposals/shopier/tr/` → <https://mertz1999.github.io/soha/proposals/shopier/tr/>
>
> **Production design:** [shopier-production-architecture.md](shopier-production-architecture.md)
> **Photo prompts:** [shopier-image-prompts.md](shopier-image-prompts.md) · **Asset manifest:** [shopier-assets.md](shopier-assets.md)

An interactive proposal for Shopier's founders and product team. It presents three AI visual-commerce experiences as working prototypes:

1. **AI Ürün Fotoğraf Stüdyosu** (AI Product Studio), the centrepiece: one phone photo becomes studio, lifestyle, luxury campaign and seasonal images, with the product unchanged.
2. **AI Kampanya Tasarım Stüdyosu** (AI Campaign Studio): product, brand and one line of copy become a coordinated, editable campaign in four formats and three creative directions.
3. **AI Sanal Deneme Stüdyosu** (AI Virtual Try-On): garments shown on three fictional models, with before/after comparisons.

The central idea: *Shopier sellers could create their entire visual commerce experience from their existing product photos.*

**Languages.** The brief asked for Turkish as the default. The repository rule in `AGENTS.md` says every public page opens in English, so:
- English is the default page and Turkish lives at `/tr/`.
- The **EN / TR** switch keeps the current section.
- Each page has its own `lang`, canonical URL, `hreflang` alternates (`x-default` → English) and social image.
- Script-generated strings follow `<html lang>`: control labels, the brief line, toasts, prices (₺3,490 / 3.490 TL) and the campaign copy and casing (YENİ SEZON).
- Brand names keep their own spelling in every language (SAYE ATELIER, not ATELİER).

## Research notes (2026-11-20)

shopier.com and appstore.shopier.com sit behind a Cloudflare bot check that automated browsers cannot pass. The notes below come from Wayback Machine copies (homepage 19 Oct 2026, App Store 8 Nov 2026) and the live developer portal.

- **Brand.**
  - Colours: violet `#6700FF`, deep navy `#0B0F34` for text, darker violet `#4900B5`, mint `#14F7C4` and yellow `#FFF400` accents, light greys.
  - Typeface: Gilroy (commercial; replaced here by Plus Jakarta Sans).
  - Logo: a lowercase "shopier" wordmark.
  - Tagline: "Senin e-ticaretin!"
- **Positioning.**
  - For independent sellers ("bağımsız girişimci"), with a free store ("Size ait bir dükkan").
  - Selling on social channels ("Müşteri nerede, siz orada").
  - The Shop by Shopier buyer app.
  - A deliberately simple panel ("Az karmaşa, çok özellik!"), extended through the App Store.
- **App Store.** Categories: Mağaza & Ürün, Kargo & Teslimat, Muhasebe & Faturalama, Pazarlama, Veri & Analiz. Relevant existing apps:
  - **Yapay Zekadan Ürün Açıklamaları** (AI product descriptions, free trial of 10)
  - **Ürün Videoları** (product videos)

  So the proposal does **not** pitch text generation. It pitches visual generation inside the product workflow.
- **Developer portal** (developer.shopier.com):
  - Third-party apps, listed or unlisted, reaching "hundreds of thousands of Shopier merchants".
  - OAuth 2.0, permission scopes (`products:read/write`, `shop:read`, `discounts:*` and more), a Products API with a `media` array, and webhooks.
  - It lists "digital marketing campaigns" and "product automation" as intended app types.
  - Image upload into `media` is not confirmed; the page and the architecture say so.

## The seven sections

| # | Section | What it shows |
|---|---|---|
| 1 | Opening: "Bir Ürün Fotoğrafından Sınırsız Yaratıcılık." | The Hilal handbag wipes from phone photo → studio → lifestyle → campaign. Auto-advances, pauses on hover/focus, and is manual with reduced motion. A "same product" badge and a store-card chip. |
| 2 | "Bir Fotoğraf. Üç Akıllı Deneyim." | Three large visual cards linking to the demos. A swipeable row on mobile. |
| 3 | AI Product Studio: "Stüdyo Çekimi Olmadan, Stüdyo Kalitesinde." | Seller-panel frame. **Original** (3 demo products, local-only upload) · **Controls** (4 styles, 3 backgrounds per style, lighting, mood, format, the live brief line) · **Results** (compare slider, 3 variations, full size, reset). |
| 4 | AI Campaign Studio: "Üründen Kampanyaya. Tek Bir Akışta." | Product, brand name, palette or custom colour, logo upload, campaign name, message, discount, button. 3 directions × 4 formats rendered live. Click text in the preview to edit it. "The full set" shows all four formats at once. PNG/SVG export. |
| 5 | AI Virtual Try-On: "Satın Almadan Önce Üzerinizde Görün." | 4 garments, 3 models, before/after slider, results-on-this-model strip, full size, reset. The upload card states the photo was not processed. |
| 6 | "Tek Ürün. Tüm Görsel İçerikler." | The journey: upload → product photography → campaign → fashion visualisation → storefront (phone mock-up). Five workflow steps. "Shopier App Store için yeni bir AI deneyimi", marked as a possible future flow. |
| 7 | "Shopier Satıcıları İçin Bir Sonraki Adım." | 15-minute call (mailto), Calendly, SOHA link, clients line, independence disclosure. |

## How the demo stays honest

- Every result is labelled **"Prepared example"**, and the app frames carry a "Demo" badge.
- **Uploads never leave the browser.** The studio shows the seller's photo in the Original slot and states that live generation is off. It never puts their photo into a result. The try-on upload says the photo was not processed. There are no network calls besides fonts.
- **Lighting and mood** are real CSS adjustments to the preview, and the page says that in production they feed the generation brief. **Format** really changes the crop. **Background** picks the variation.
- **Campaign creatives are actually generated in the browser** from the inputs, so they are labelled as running in your browser, not as prepared.
- The disclosure states: independent proposal, not endorsed or sponsored by Shopier, no partner agreement, logo used only for identification, fictional products, brands, models and prices, images are examples.
- Nothing claims a feature is missing from Shopier or on its roadmap. The App Store item is "a possible future flow, not an existing integration".

## Images: illustrations now, photos later

All visuals are code-drawn (see [shopier-assets.md](shopier-assets.md)):
- `art-products.js`: three products and 13 scenes.
- `art-people.js`: three models and four garments, adapted from the Düğün.com people drawings.

Every scene draws the same product drawing, so the product is identical across all variations.

To add photos:
1. Generate them with [shopier-image-prompts.md](shopier-image-prompts.md).
2. Convert each to WebP: `cwebp -q 82 in.jpg -o site/proposals/shopier/assets/photos/<name>.webp`. Use `-exact` for transparent cut-outs.
3. Add each base name to `PHOTOS` in `assets/proposal.js`, for example `'bag-studio-1'`.

Missing or broken photos fall back to the illustration automatically. Then re-render the social images (below).

## Run it locally

```bash
python3 -m http.server 4321 --directory site
```

Open <http://localhost:4321/proposals/shopier/> (Turkish: `/proposals/shopier/tr/`). It also runs as the `ensa-site` entry in `.claude/launch.json`. No build step, no API keys.

## Files

| File | Role |
|---|---|
| `site/proposals/shopier/index.html` | English page (the source for the Turkish page) |
| `site/proposals/shopier/tr/index.html` | Turkish page, generated by `tools/proposals/shopier_tr.py` |
| `assets/shopier.css` | Design system, layouts, responsive rules |
| `assets/art-core.js` | Shared drawing helpers (from the Düğün.com proposal, namespace `SArt`) |
| `assets/art-products.js` | Products, cut-outs and the 13 scenes |
| `assets/art-people.js` | Models, garments, try-on and catalogue drawings |
| `assets/campaign.js` | Campaign layout engine (3 directions × 4 formats), font loading, PNG/SVG export |
| `assets/proposal.js` | Demo content, all interactions, photo resolver, navigation |
| `assets/og-image.png`, `og-image-tr.png` | Social previews, 1200 × 630 |
| `assets/photos/` | Photo slots (empty for now) |

## Editing

- **English copy:** edit `index.html`, then run `python3 tools/proposals/shopier_tr.py`. It fails loudly if a translated string changed, so update the pair in the script.
- **Script strings, products, garments and copy defaults:** `PRODUCTS`, `STYLES`, `COPY`, `GARMENTS` and `STR` in `proposal.js`, all written as `L(tr, en)`.
- **Campaign directions:** `editorial()`, `bold()` and `minimal()` in `campaign.js`. Each branches per format.
- **Social images:** render a 1200 × 717 composition with headless Chrome (`--window-size=1200,717`), then crop the top 1200 × 630 with `ffmpeg -vf crop=1200:630:0:0`.

## Checks done (local, 2026-11-20)

- Every section fits in one screen at 1440 × 900 and 1920 × 1080, in both languages (each slide exactly one viewport tall).
- No console errors. No horizontal overflow at 390 px.
- Every control was exercised by script:
  - Studio: product, style, variation, lighting/mood filters, format, full size, upload notice, reset.
  - Campaign: product switch, title edit appears in the SVG, discount toggle, palette and custom colour change the background, direction, format, the set thumbnails, click-to-edit focus.
  - Try-on: model, garment, looks strip, full size, reset.
- Keyboard: arrow keys move inside every radio group. Arrow Up/Down, Page Up/Down, Home and End move between slides outside controls. The EN/TR switch keeps the section (`tr/#s4`).
- Exports: PNG export returns a PNG; SVG export is self-contained (fonts and images inlined, no `blob:` links).
- Turkish: all visible strings, alt text and ARIA labels translated; Turkish casing in campaign copy; brand names keep their spelling.
- Mobile layouts checked at 390 px and 375 px through fixed-width iframes, because headless Chrome won't render a window under about 500 px.
