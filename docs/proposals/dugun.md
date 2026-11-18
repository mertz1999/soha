# Proposal: Düğün.com (SOHA → Düğün.com)

> **Status:** Built locally, not published · **Updated:** 2026-11-18
> **Pages:**
> - English (default): `site/proposals/dugun/` → <https://mertz1999.github.io/soha/proposals/dugun/> (after publishing)
> - Turkish: `site/proposals/dugun/tr/` → <https://mertz1999.github.io/soha/proposals/dugun/tr/>
>
> **Production design:** [dugun-production-architecture.md](dugun-production-architecture.md)
> **Optional photo prompts:** [dugun-image-prompts.md](dugun-image-prompts.md)

An interactive proposal for Düğün.com's founders. It presents two AI products as working prototypes rather than slides:

1. **AI Düğün Deneyim Stüdyosu** (AI Wedding Experience Studio): one studio with four tools:
   - **Gelinlik ve damatlık deneme** (virtual try-on), the main visual feature
   - **Mekân tasarımcısı** (the same venue in three decoration concepts)
   - **Kişisel müzik önerileri** (suggestions for each moment of the wedding)
   - **Akıllı bütçe tahmini** (a budget estimate with a category breakdown)
2. **AI Davetiye Tasarım Stüdyosu** (AI Invitation Designer): three distinct, editable invitation designs from a few inputs, in print, mobile and save-the-date formats.

**Languages.** English is the default page and Turkish lives at `/tr/`, following the repository rule in `AGENTS.md`.
- The **EN / TR** switch in the top bar opens the same section in the other language.
- Each page has its own `lang`, canonical URL, `hreflang` alternates (`x-default` points to English) and social preview image.
- Everything script-generated is translated too: catalogue labels, song reasons, budget categories and currency format (₺664,000 / ₺664.000), toasts, drawers and the invitation copy and dates.
- Couple, venue and city names keep Turkish casing on the English page ("DEFNE KÖŞKÜ", "İSTANBUL").

**Positioning.** Every idea is presented as an extension of what Düğün.com already has: the dress catalogue, vendor profiles, the Bütçem budget tool, the music articles and the invitation vendors. The page never claims Düğün.com lacks a feature and says nothing about its roadmap. The music panel is framed as personalisation ("Size Göre"), not as Düğün.com's first music feature.

## Research notes (2026-11-18)

- **Brand, measured on dugun.com:**
  - Logo pink `#E21B71`; UI pink `#DB0962` on buttons and links.
  - Teal accent `#098483`, blush `#FEF4F1`, text `#4A4A4A` and `#1A1A1A`.
  - The site uses the system font stack (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto…`), mostly 10px radii and pill-shaped CTAs.
  - The page does not use the logo file. "düğün.com" appears as bold pink text in the product mockups.
- **Dress catalogue** (`dugun.com/gelinlik`):
  - "2027 Gelinlik Modelleri ve Fiyatları", 9,921 dresses.
  - Style circles (A Kesim, Balık, Bohem, Helen, Prenses…) and filters for price, city, cut and neckline.
  - Mobile shows a two-column grid of photo cards: a heart ("Listeme Ekle"), vendor name in bold, product name and price.
  - The try-on catalogue copies this card anatomy.
- **Vendor categories:** gelinlik, damatlık, organizasyon, çiçekçi, müzik, ışık-ses, davetiye and more, each with İstanbul listing pages.
  - Invitation listings include digital invitation companies (for example "E-Davet", "Dijital Davetiyem", "Davetiye Sitesi").
- **Planning tools** (`araclar.dugun.com`):
  - Web Sitem, Ajandam, Bütçem, Oturma Planı and Hava Durumu.
  - Bütçem needs a membership; couples pick categories and type in amounts.
  - A guide article ("Düğün Masrafları") gives a sample wedding total of about 440,000 TL.
- **Music:** articles such as "2026 En İyi Düğün Şarkıları Listesi" and "Unutulmaz İlk Danslar" list songs by moment.
- **Overlaps and how the page treats them:**
  - **Budget:** Bütçem exists. The demo is an instant, input-light estimate that could feed Bütçem.
  - **Music:** song lists exist. The demo personalises by moment, style, mood and tradition.
  - **Invitations:** vendors and Web Sitem exist. The designer is a design layer that could hand off to them.
  - **Try-on and venue visualisation:** no public evidence was found either way. Both are presented as proposals.

## The eight sections

| # | Section | Shows |
|---|---|---|
| 1 | Opening | "SOHA × Düğün.com" pill and "Hayalinizdeki Düğün, Yapay Zekâ ile.", with a venue arch, a bride in the Aurora dress, the Timeless invitation and UI chips (try-on, first dance, live budget). "Fikirleri Keşfet" CTA |
| 2 | AI Düğün Deneyim Stüdyosu | "Düğününüzü Önce Hayal Edin. Sonra Görün.": four image-led cards linking to the demos |
| 3 | Try-on | Düğün.com-style app frame: **Kişi** (two demo models, local-only photo upload), **Katalog** (3 dresses and 2 suits from a fictional boutique), **Sonuç** (before/after slider, enlarge, reset, "Mağazayı İncele") |
| 4 | Venue | One hall in four states (original, Klasik Lüks, Modern Minimal, Bohem Bahçe), a compare slider, full screen, "Bu konsepti seç" and "Bu Konsepti Gerçekleştiren Firmaları Gör" |
| 5 | Music & budget | Moment tabs and preference chips with three songs and a reason for each. City, guests, style, venue type and budget give a donut, breakdown and tip |
| 6 | Invitations | Names, date, time, venue, style and colour lead to three designs. The viewer refines layout, palette, typography and format, and downloads PNG or SVG |
| 7 | One experience | "Hayalden Gerçeğe. Tek Bir Deneyim.": five steps that show the visitor's own choices, ending at real Düğün.com category pages |
| 8 | Closing | "Düğün.com'un Geleceğini Birlikte Tasarlayalım.", a "15 Dakikalık Görüşme" mailto to `reza.tz780210@gmail.com`, Calendly, the SOHA site link and the independence disclosure |

## Visual assets: photos, with illustrations as fallback

**Photos** (`assets/photos/`, WebP):
- 15 photo-realistic images, generated in advance by the user with an image model from the prompts in [dugun-image-prompts.md](dugun-image-prompts.md). They were delivered on 2026-11-19 as `dugun_all_16_proposal_images.zip`.
- What they are:
  - Model A and Model B in everyday clothes, and the five try-on results (three gowns on A, two suits on B).
  - The five catalogue garments on dress forms and mannequins.
  - The venue in Klasik Lüks, Modern Minimal and Bohem Bahçe.
- All people are fictional.
- Processing: the JPEGs were converted to WebP (quality 82), 1.4 MB in total.
- Four files had a white vertical line left from being cut out of a contact sheet: `model-a-before`, `tryon-a-lina`, `cat-aurora` and `cat-kenan`. The line was painted out with the neighbouring colours.
- The delivered `venue-original.jpg` is **not used**:
  - It shows a different, decorated seaside terrace, not the empty hall from the three concept photos.
  - Until a matching empty-hall photo exists, the venue slider compares two concepts, for example Modern Minimal against Klasik Lüks.
  - The prompt for that missing photo (`venue-empty.webp`, item 17) is in the prompts doc. To switch the slider back to "Original vs concept", set `VENUE_EMPTY_PHOTO` in `proposal.js`.
- The page labels the photos as examples generated in advance with an image model ("Örnek sonuç", "Örnek görsel", the section notes and the closing disclosure), never as live output.

**Illustrations** (`art-people.js`, `art-venue.js`):
- The code-drawn artwork is kept as the fallback. If a photo fails to load, its illustration is drawn in its place.
- Illustrations are only drawn when needed, so they cost nothing otherwise.
- **People:** four fictional illustrated models share one pose, so outfits line up exactly.
- **Venue:** a historic hall in true one-point perspective. The architecture layer is identical in all four versions (original, Klasik Lüks, Modern Minimal, Bohem Bahçe).

**Invitations** (`invite.js`) stay fully code-drawn with editable text: see below.

## Invitation engine

`DInvite.render(spec)` turns a design spec into SVG with real `<text>` elements. The spec holds the design, layout, palette, type, format and the couple's text.

- **Three directions, three layouts each:**
  - **Zamansız Zarafet:** ivory paper, gold flourishes, laurel monogram, arch frame or beaded medallion.
  - **Modern Romantizm:** asymmetric layout with painted blooms, giant outline ampersand, or split colour panel.
  - **Sanatsal Botanik:** watercolour wreath, corner sprays, or greenery arch.
- **Refinements:** three palettes and three font pairings per direction. Formats are print 5×7 (1000×1400), mobile 9:16 (with "Konum / Katılım" chips) and a square save-the-date.
- **Fonts:** all twelve families load from jsDelivr (Fontsource) with the latin-ext subset, so ğ, ş, ı and İ render correctly. Text is uppercased with `toLocaleUpperCase('tr-TR')`.
- **Fitting:** long names shrink to fit, measured with canvas `measureText`. Tested with "Gülşen Nur Karaağaçlıoğlu & İsmail Çağatay Öztürkoğlu".
- **Downloads:** SVG and PNG. The export inlines the fonts (latin + latin-ext woff2 as base64), so the file renders correctly anywhere.

## How the demo stays honest

- **No model and no external API is called.** Each demo carries a "Demo" badge and a one-line explanation.
- **Uploads never leave the device.**
  - The try-on photo is shown from an object URL and is never processed. The page says the result is shown on the demo model.
  - The venue upload is not used at all, and the page says so.
- **Fictional boutique:** "Atölye Beyaz" is labelled "kurgusal demo mağaza", with no prices, availability or reviews. "Mağazayı İncele" explains what the real button would do and links to Düğün.com's real gelinlik or damatlık category page.
- **Vendor matching** links only to real, existing Düğün.com category pages (organizasyon, çiçekçi, ışık-ses). It does not invent vendors, quotes or availability.
- **Music:** an illustrative dataset of 55 real songs (titles and artists are facts), with rule-based scoring and reasons. No audio, no embeds and no claim of streaming rights.
- **Budget:** a deterministic formula with illustrative TRY amounts and a ±12% range. The page states it is not a current market price or quote.
- **Independence:** the closing disclosure states the page is an independent SOHA proposal and not an approved partnership, and that models, boutique, venue, prices and results are fictional. The page is `noindex, nofollow`.

## Run it locally

```bash
python3 -m http.server 4321 --directory site
```

Open <http://localhost:4321/proposals/dugun/>. The `ensa-site` preview in `.claude/launch.json` does the same. Fonts come from jsDelivr, so the first load needs internet access.

## Files

| File | Purpose |
|---|---|
| `site/proposals/dugun/index.html` | English page (default): the eight sections, the lightbox, the invitation viewer and the vendor drawer |
| `site/proposals/dugun/tr/index.html` | Turkish page: the same markup in Turkish, loading the shared `../assets/` |
| `site/proposals/dugun/assets/dugun.css` | Design system and all section styles, responsive rules and reduced motion |
| `site/proposals/dugun/assets/art-core.js` | SVG helpers: seeded randomness, smooth paths, limbs, leaves, roses, pampas, filters, cached object URLs |
| `site/proposals/dugun/assets/photos/*.webp` | 15 example photos generated in advance: models, try-on results, catalogue garments, venue concepts |
| `site/proposals/dugun/assets/art-people.js` | Fallback fashion illustrations: four models and six outfits on a 600×800 canvas |
| `site/proposals/dugun/assets/art-venue.js` | The perspective venue and its four styles on a 1600×1000 canvas |
| `site/proposals/dugun/assets/invite.js` | Invitation engine: designs, text fitting, dates, font preloading, SVG/PNG export |
| `site/proposals/dugun/assets/data.js` | Catalogue, song dataset with `recommend()`, budget rules with `estimate()` |
| `site/proposals/dugun/assets/proposal.js` | All interactions, the journey summary and slide navigation |
| `site/proposals/dugun/assets/og-image.png`, `og-image-tr.png` | 1200×630 social previews (English and Turkish), rendered from the page artwork with headless Chrome |

## Editing

- **Copy:** `index.html` (English) and `tr/index.html` (Turkish). They share one markup, so a structural change goes into both.
- **Strings set by script:** `STR` in `proposal.js` (toasts, drawers, labels), the `L(tr, en)` values and `N_EN` in `data.js` (catalogue, song notes, budget names), and `TX`, the month and day names and the design names in `invite.js`. The language comes from `<html lang>`.
- **Outfits:** add an entry to `OUTFITS` in `data.js` and a matching drawing to `OUT` in `art-people.js`. The drawing must use the shared `BODY` pose.
- **Venue styles:** add a mood to `MOOD` and a branch in `stage()`, plus furniture in `A.venue()`.
- **Invitation designs:** palettes and font pairs live in `DESIGNS` in `invite.js`. Any new font must also be added to `FONT_FILES` and loaded in `index.html`.
- **Budget figures:** `CITIES`, `VENUES`, `STYLES` and `estimate()` in `data.js`.

## Checks done (local, 2026-11-18)

- **Layout:**
  - At 1440×900 every section is one screen tall, give or take 15 px. At 1920×1080 all eight are exactly 1080.
  - At 390×844 and 375×812 the document is exactly the viewport width; catalogue, venue styles, feature cards and invitations become swipeable rows.
- **Try-on:**
  - Choosing an outfit sweeps the before/after split on the same figure.
  - Choosing a suit while Model A is selected switches to Model B with a toast.
  - Enlarge, reset and the boutique drawer all work. On mobile the result scrolls into view.
- **Venue:** style switching, compare, full screen, choosing a concept (reflected in section 7) and the vendor drawer all work. The architecture is pixel-identical across styles by construction.
- **Music:** preferences change the picks meaningfully, for example:
  - Gelin Girişi with Klasik, Zarif and Modern: Pachelbel, Bach, Wagner.
  - Eğlence with Geleneksel: Ankara'nın Bağları, Hüdayda, Bregović.
  - Pasta Kesimi with Yabancı Pop and Neşeli: Maroon 5, DNCE, Nat King Cole.
- **Budget:** İstanbul, 250 guests, Klasik, Düğün Salonu gives ₺664,000 (₺584,000–₺744,000). Ankara, 150, Sade, Salon gives ₺334,000. The over-budget tip suggests a guest cut and a cheaper venue type.
- **Invitations:**
  - All nine layouts render in all three formats.
  - Long Turkish names fit.
  - PNG export embeds 6 font faces and produces a 1500×2100 image.
- **Both languages:**
  - The English page reads "Aurora · A-line tulle gown", "Its string arrangement and slow tempo open the bridal entrance gracefully…", "₺664,000" and "3 designs ready · Elif & Mert, 12 June 2027".
  - English invitations show "12 JUNE 2027" and "SATURDAY · 7:00 PM".
  - The Turkish page at `/tr/` loads every asset, logo and font from `../`, with no 404s and no broken images.
  - At 375×812 the top bar fits the logo, the EN/TR switch and the call button.
- **Photos (2026-11-19):**
  - On both pages, all 19 image slots load photos, with no fallbacks and no broken images.
  - At 1440×900 the try-on result is a 363×484 portrait frame, so the full gown shows.
  - On mobile the before/after slider is full width.
- **Console:** no script errors.
