# Shopier proposal: asset manifest

Where every visual on `site/proposals/shopier/` comes from, and what it may be used for.

**Status (2026-11-20):** every visual is **photographic**: the 11 Part A images (products and backgrounds) and the 8 Part B images (try-on) from [shopier-image-prompts.md](shopier-image-prompts.md). The code-drawn illustrations remain only as the fallback.

## Third-party brand assets

| Asset | Where | Source | Notes |
|---|---|---|---|
| Shopier wordmark (SVG path) | `<symbol id="wm">` in both `index.html` files; top bar, kicker, app frames, closing | The `<svg>` logo in the header of shopier.com, read from the Wayback Machine copy of 19 Oct 2026 (the live site sits behind a Cloudflare check) | Shopier's trademark. Used only to say who the proposal is for, as the page disclosure states. Not altered; drawn in Shopier violet or white. |
| Shopier colours | `assets/shopier.css` `:root` | shopier.com page source: `#6700FF` (violet, 47 uses), `#0B0F34` (navy text, 94 uses), `#4900B5`, `#14F7C4` (mint), `#FFF400`, greys `#F7F7F7` / `#E5E5E8` | Colour values only. |
| Typeface | — | shopier.com uses **Gilroy** (commercial) | Not copied. **Plus Jakarta Sans** stands in (OFL). |

## SOHA assets

| Asset | Source |
|---|---|
| SOHA logo mark | `site/assets/img/logo-mark.png` (existing SOHA asset) |
| Favicon, touch icon | `site/assets/img/` (existing SOHA assets) |

## Fonts (all SIL Open Font License, loaded from jsDelivr / Fontsource)

| Font | Used for |
|---|---|
| Plus Jakarta Sans (variable) | Page UI and headings; Bold Social and Minimal Luxury layouts |
| Instrument Serif (regular, italic) | Editorial accents in headings; Minimal Luxury headlines |
| Bodoni Moda (variable, italic) | Fashion Editorial mastheads and headlines |

PNG and SVG exports from the campaign studio embed the latin and latin-ext subsets of these fonts, so Turkish letters survive.

## Demo visuals

Every visual below is an original, code-drawn illustration (SVG generated in the browser). Each one has a photo slot: when `assets/photos/<file>.webp` exists and is listed in `PHOTOS` in `assets/proposal.js`, the photo replaces the drawing. If a listed photo fails to load, the drawing comes back.

| Visual | Drawn by | Photo slot (file name) | Photo status |
|---|---|---|---|
| Phone-photo originals: Hilal handbag, Damla earrings on their stand, Gül serum | `assets/art-products.js` scene `original` | `<product>-original` (generated) | Delivered |
| Product cut-outs (campaign layouts, scenes) | `art-products.js` `A.product()` | `<product>-cutout` (cut from the original on a Mac with `tools/proposals/cutout.swift`, not generated) | Made |
| 8 scenes per product (studio, lifestyle, luxury campaign, seasonal × 2) | `art-products.js` `A.scene()` | Composited in the browser: `<product>-cutout` on `bg-<style>-<1–2>` (8 generated empty backgrounds shared by all products) | Backgrounds delivered |
| Models Ada and Nil ("before") | `assets/art-people.js` `A.person(id, 'before')` | `model-<id>-before` | Delivered |
| Garments: blazer and dress (catalogue) | `art-people.js` `A.garment()` | `garment-<id>` | Delivered |
| Try-on results (2 models × 2 garments) | `art-people.js` `A.person(id, garment)` | `tryon-<id>-<garment>` | Delivered |
| Campaign creatives (3 directions × 4 formats) | `assets/campaign.js` `render()` | — (always rendered live: editable text over the product image) | n/a |
| Social preview images `og-image.png`, `og-image-tr.png` | Rendered with headless Chrome from the bag photo, two composites and a campaign layout | — | Rendered from photos |

**Product preservation.** In the illustrations, every scene uses one shared product drawing. With photos, every scene draws the cut-out taken from the product's own phone photo onto an empty background. Either way the product is identical by construction: no image model ever redraws it.

**People.** The two models, Ada and Nil, are fictional, AI-generated people; neither depicts a real person. Each try-on result keeps the model's pose and framing, so each before/after pair lines up.

**Fictional content.** The brands (Saye Atelier, Ilgın Jewelry, Nemra Skin, Ela Studio), products, prices and models are invented demo content, as the page disclosure says.

## Not used

- No stock photos, no images copied from Shopier or any other site, and no image collages.
- All photos (phone photos, backgrounds, models, garments and try-on results) are AI-generated example images made from the prompts, with fictional products and people. The page labels every result a prepared example.
