# Shopier proposal: asset manifest

Where every visual on `site/proposals/shopier/` comes from, and what it may be used for.

**Status (2026-11-20):** all product, scene, people and garment visuals are **code-drawn illustrations** made for this proposal. Photo-realistic replacements are specified in [shopier-image-prompts.md](shopier-image-prompts.md) and have not been generated yet.

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
| Hilal handbag, Damla earrings, Gül serum (products) | `assets/art-products.js` `A.product()` | `<product>-cutout` | Not generated |
| Phone-photo originals | `art-products.js` scene `original` | `<product>-original` | Not generated |
| 12 scenes per product (studio, lifestyle, luxury campaign, seasonal × 3) | `art-products.js` `A.scene()` | `<product>-<style>-<1–3>` | Not generated |
| Models Ada, Nil, Mira ("before") | `assets/art-people.js` `A.person(id, 'before')` | `model-<id>-before` | Not generated |
| Garments: blazer, dress, jacket, co-ord (catalogue) | `art-people.js` `A.garment()` | `garment-<id>` | Not generated |
| Try-on results (3 models × 4 garments) | `art-people.js` `A.person(id, garment)` | `tryon-<id>-<garment>` | Not generated |
| Campaign creatives (3 directions × 4 formats) | `assets/campaign.js` `render()` | — (always rendered live: editable text over the product image) | n/a |
| Social preview images `og-image.png`, `og-image-tr.png` | Rendered with headless Chrome from the illustrations above | — | Re-render once photos exist |

**Product preservation.** In the illustrations, every scene uses one shared product drawing, so the product is identical by construction. The photo prompts require each scene to be an edit of the product's original photo, and the check list rejects any image where the product changes.

**People.** The three models are fictional illustrations. They share one pose, so each before/after pair lines up. None depicts a real person.

**Fictional content.** The brands (Saye Atelier, Ilgın Jewelry, Nemra Skin, Ela Studio), products, prices and models are invented demo content, as the page disclosure says.

## Not used

- No stock photos, no images copied from Shopier or any other site, and no image collages.
- No AI-generated images yet.
