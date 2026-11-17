# Proposal: Biletino (SOHA → Biletino)

> **Status:** Published · **Updated:** 2026-11-17
> **Pages:** English (default) `site/proposals/biletino/` → <https://mertz1999.github.io/soha/proposals/biletino/>
> Turkish `site/proposals/biletino/tr/` → <https://mertz1999.github.io/soha/proposals/biletino/tr/>
> **Production design:** [biletino-production-architecture.md](biletino-production-architecture.md)

An interactive proposal for Biletino's founders. It presents three AI ideas as working prototypes rather than slides:

1. **AI Event Studio** (*Akıllı Etkinlik Oluşturma Stüdyosu*): an organizer describes the event in plain language (English or Turkish) and gets a ready-to-review event page.
2. **AI Poster Creator** (*AI Afiş Tasarım Stüdyosu*): three original poster directions, editable text, four output formats. This is the visual centrepiece.
3. **AI Event Suggestions** (*Sana Özel Etkinlik Önerileri*): a phone screen where ticket buyers set preferences and see three personalised events with a reason for each.

**Languages.** English is the default page and Turkish lives at `/tr/`. The **EN / TR** switch in the top bar opens the same section in the other language. Each page has its own `lang`, canonical URL, `hreflang` alternates and social preview image.

The demos are translated too: the event drafts, poster labels and dates, suggestion reasons and every control. Event, venue and area names stay as Turkish proper names in both languages. On the English page they keep Turkish capitals ("SİNYAL", "LİMAN DEPO") until the user types their own name.

**Positioning.** The ideas are presented as extensions of the current product: "eklenebilecek üç yapay zekâ katmanı" ("three AI layers that could be added"). The page never says Biletino lacks these features and makes no claim about Biletino's roadmap.

## Research notes (2026-11-17)

- **Brand guide** (`biletino.com/tr/content/brand/`):
  - The logo is an icon plus the Biletino wordmark. The icon is a "B" that also suggests a flow of tickets.
  - Official logo files are offered for light and dark backgrounds.
  - The page does not use the logo files. The mockups show "biletino" set in Nunito text instead.
- **Colours and type measured on biletino.com:**
  - Orange `#E04307` (rgb 224, 67, 7) on buttons, rings and accents.
  - Near-black `#141414` and `#0D0D0D`, with white surfaces.
  - The site font is **Nunito**.
  - The brief's `#FBB297` (soft orange) and `#444444` (charcoal) were not found on the brand page. They are used only as secondary tints.
- **Event publishing:** according to `business.biletino.com/event-publishing/`, an organizer:
  1. creates an account
  2. opens Event Management and fills in the organisation details
  3. publishes the event with its details and a **1920×1080 cover photo**

  That is why the poster studio's "Etkinlik kapağı" format is 1920 × 1080.
- **Event detail page anatomy:** the event studio's draft page copies this layout:
  - date line ("28 Kasım 2026 - Cumartesi")
  - title, organizer with a verified mark and a category pill
  - location and price range ("800,00 TRY - 1200,00 TRY")
  - an orange "BİLETLERİ GÖR" button and a 16:9 cover
  - then "Etkinlik Detayları", plus start date, end date and location
- **Listings:** horizontal event cards with a cover, title, date, an "X Gün Sonra" pill and the location. Cities include İstanbul, Ankara and İzmir.
- **Existing AI features:** none were found documented publicly for Biletino.
  - An agency case study describes work on Biletino Blog's visibility in AI search assistants. That is marketing, not a product feature.
  - News coverage from early 2026 reports that **Biletinial**, a different Turkish ticketing platform, launched AI-personalised recommendations.
  - This is useful context for the call, but it is deliberately not mentioned on the page.
- **Business facts** (`business.biletino.com`): a young audience, and more than 30,000 events and 1.2 million tickets a year. These figures are not used on the page.

## The seven sections

| # | Section | Shows |
|---|---|---|
| 1 | Hero | "SOHA × Biletino" pill, "Biletino'nun Geleceği, Yapay Zekâ ile.", the three posters, a Biletino-style event card and chips. "Fikirleri Keşfet" CTA |
| 2 | Üç Fikir | Three visual concept cards (01 AI Event Studio, 02 AI Poster Creator, 03 AI Event Suggestions), each linking to its demo |
| 3 | AI Event Studio | A desktop "Etkinlik Yönetimi" mockup, with description → draft event page (see below) |
| 4 | AI Poster Creator | Two full screens: a showcase of the three original posters, then the poster studio (see below) |
| 5 | AI Event Suggestions | Preference controls next to a large phone mockup with three recommended events |
| 6 | Oluşturmadan Keşfe | Four-step visual flow, with the same event in every step. "Her adımda son karar organizatörde" (human review) |
| 7 | Birlikte Tasarlayalım | Poster fan, "15 Dakikalık Görüşme" (mailto to `reza.tz780210@gmail.com` with a prefilled subject), a Calendly link, the SOHA site link and the independence disclosure |

### Section 3: the event studio

**Left panel:**
- Three sample events: an electronic night in İstanbul, a jazz evening in İzmir and a design workshop in Ankara.
- An editable description and three small fields: venue, organizer, price.
- Live chips showing what was read from the text: city, date, time, type and capacity.
- A **Sayfa Taslağını Oluştur** button.

**Right panel:** a Biletino-style draft page with:
- the cover, date line, title, organizer, category, location, price range and "BİLETLERİ GÖR"
- tabs for **Detaylar**, **Program**, **Biletler** and **SSS**
- an editable title and description, and tags that can be removed

**Yayın önizlemesi** opens the attendee view, labelled "Henüz yayınlanmadı" (not published yet).

### Section 4: the poster studio

**Inputs:**
- Sample event, name, date, time (24-hour), venue, area and city, category.
- Style: Otomatik, Elektronik, Editoryal or Geometrik.
- An optional organizer logo, placed on the poster.
- An optional reference image, which supplies the accent colour.

**What you can do:**
- **3 Varyasyon Üret / Yeniden Üret** gives three variations of the chosen style.
- Click a poster for full-screen viewing, with format tabs and previous and next.
- Refine the selected variation: palette, *daha sade* (simpler), *daha cesur* (bolder), layout, reset.
- Switch output formats: **Afiş 4:5 (1080×1350)**, **Etkinlik kapağı 16:9 (1920×1080)**, **Gönderi 1:1 (1080×1080)** and **Hikâye 9:16 (1080×1920)**.

Text stays accurate in every format. Stories keep text inside Instagram's safe area and add a "BİLETLER BİLETİNO'DA" prompt.

## The three poster art systems

Each art system has three variations and three curated palettes, and is drawn as SVG with grain.

| Style | Sample | Variations | Type |
|---|---|---|---|
| **A · Elektronik** | *Sinyal*, Liman Depo, Karaköy | **Spektrum:** a mirrored sound spectrum inside a dial. **Tipografik duvar:** the title as an outlined type wall with a rotating date sticker. **Kırık ızgara:** a halftone field, black slabs, wide type and an info band | Big Shoulders Display, Unbounded, Space Grotesk |
| **B · Caz & Kültür** | *Mavi Saat*, Arka Bahçe Sahne, Alsancak | **Plak:** a vinyl record with grooves, label text and a tonearm on warm paper. **Mavi saat:** a moon cut by a musical staff, with notes. **Kolaj:** a cut-paper arch with piano keys and a sun | Fraunces (roman and italic, optical sizes) |
| **C · Yaratıcı Atölye** | *Biçim Atölyesi*, Kare Stüdyo, Kavaklıdere | **Izgara:** a modular grid of quarter circles, arches, rings and stripes. **Harfler:** the event's initials in big shapes, with confetti. **Diyagonal:** stacked rounded bars and a date sticker | Syne, Space Grotesk |

- **Text fitting:** titles are measured with the real fonts and wrapped into balanced lines. Turkish capitals use `toLocaleUpperCase('tr-TR')`, so "Sinyal" becomes "SİNYAL" and "Işık" becomes "IŞIK".
- **Variation:** the seed changes the artwork details (spectrum shape, grid tiles, confetti, halftone focus). The palette and layout toggles change the composition.
- **Colour and contrast:** the reference-image accent re-tints the palette and keeps text contrast.

## How the demo stays honest

- **No model is called anywhere.** The page states this next to each demo:
  - **Event studio:** "Kural tabanlı demo". Date, time, city, district, type, capacity, duration and price are read from the text with rules (`parse()` in `demo-data.js`). The reader understands English and Turkish (for example "15 December", "March 3rd at 9pm", "150 guests", "15 Aralık'ta", "saat 21.00", "400 kişilik"). The page text comes from prewritten templates per category and language. The short "hazırlanıyor" shimmer is a transition.
  - **Poster studio:** "İnteraktif konsept". The posters come from SOHA's predesigned art systems, generated in the browser by rules, with text as editable layers. "Görüntü üreten bir model çağrılmaz" ("no image-generating model is called").
  - **Suggestions:** "Demo verisi". 33 fictional events in İstanbul, Ankara and İzmir. Dates are relative to today, so "Bu hafta sonu" always means the coming weekend.
- **How suggestions are scored:**
  - City is a hard filter.
  - Interest, date and budget add to one score, together with popularity and how soon the event is.
  - A card that misses the date or budget preference is greyed and says why, for example "Seçtiğiniz tarihlerde değil (…)" ("not on your chosen dates").
- **No Biletino data or APIs.** The page says it does not access Biletino accounts, purchase histories or APIs.
- **Uploads stay local.** Logo and reference image files are read with `FileReader` in the browser and never uploaded. The page says so.
- **Everything is fictional.** All events, venues, organizers and prices are made up. Real district names are used for realism, but the venues are invented. No artist names are used.
- **Independence:** the footer says the page is an independent SOHA proposal, not an approved partnership, and that the Biletino name is used only to explain the proposal. The page is `noindex, nofollow`.

## Run it locally

From the repository root:

```bash
python3 -m http.server 4321 --directory site
```

Open <http://localhost:4321/proposals/biletino/>. In the Claude app, the `ensa-site` preview in `.claude/launch.json` does the same thing. Fonts load from the jsDelivr CDN, so the first load needs internet access.

## Publish

The Pages workflow publishes `site/` on every push to `main`, so any later change to these files goes live as soon as it is pushed. The page is live at <https://mertz1999.github.io/soha/proposals/biletino/>.

## Files

| File | Purpose |
|---|---|
| `site/proposals/biletino/index.html` | English page (default): the seven sections, the studio forms, the viewer and the publish-preview dialogs |
| `site/proposals/biletino/tr/index.html` | Turkish page: the same markup in Turkish, loading the shared `../assets/` |
| `site/proposals/biletino/assets/posterkit.js` | **Poster renderer.** Spec → SVG poster: three art systems × three variations, palettes, intensity, layout, four formats, text fitting. No dependencies |
| `site/proposals/biletino/assets/demo-data.js` | Sample events, the 33-event catalogue, the rule-based reader and draft templates, and recommendation scoring and reasons |
| `site/proposals/biletino/assets/proposal.js` | Page logic: slides and keyboard, event studio, poster studio and viewer, suggestions with animated reordering, connected flow |
| `site/proposals/biletino/assets/biletino.css` | Page design: Biletino orange and black, Bricolage Grotesque headlines, Nunito UI. SOHA navy and turquoise only as small accents |
| `site/proposals/biletino/assets/og-image.png`, `og-image-tr.png` | 1200×630 social previews (English and Turkish), rendered from the real posters with headless Chrome |

The page reuses SOHA's logo and favicon from `site/assets/img/`. Nothing else in the site was changed.

## PosterKit

```js
const svg = PosterKit.render({
  style: 'electronic',          // 'electronic' | 'jazz' | 'workshop'
  variant: 0,                   // 0–2: the three compositions of the style
  seed: 0,                      // changes artwork details
  format: 'poster',             // 'poster' 4:5 | 'cover' 16:9 | 'post' 1:1 | 'story' 9:16
  palette: 0,                   // 0–2 shift through the style's palettes
  intensity: 1,                 // 0 "daha sade" · 1 · 2 "daha cesur"
  alt: false,                   // mirrored / alternate layout
  accent: null,                 // '#RRGGBB' from a reference image
  content: { title: 'Sinyal', kicker: 'Elektronik Gece', date: '2026-12-15', time: '21:00',
             venue: 'Liman Depo', city: 'Karaköy, İstanbul', org: 'Liman Kolektif', logo: null },
});
await PosterKit.ready();        // loads the poster fonts; re-render after it resolves
```

## Editing

- **Page copy:** `index.html` (English) and `tr/index.html` (Turkish). The two files share the same markup, so a structural change goes into both.
- **Strings set by script:** `STR` in `proposal.js` (buttons, chips, toasts, the publish preview, phone text), `TXT` in `posterkit.js` (poster labels, months and days, format, style and palette names), and `L10N`, `CAT_TXT`, `SAMPLES.texts`, `TEMPLATES[cat].en/.tr`, `BUDGET` and `WHEN` in `demo-data.js`. The language comes from `<html lang>`.
- **Sample events and descriptions:** `SAMPLES` in `demo-data.js`.
- **Draft wording per category:** `TEMPLATES` in `demo-data.js`. Phrases avoid Turkish case suffixes after variables (for example "saat 21.00 itibarıyla"), so edited text stays grammatical.
- **Suggestion catalogue:** `EVENTS` in `demo-data.js`. `day` is the offset from the coming Saturday.
- **Palettes and art:** `PALETTES` and the `eDisk`, `eWall`, `eShard`, `jRecord`, `jMoon`, `jCollage`, `wGrid`, `wLetters` and `wDiag` functions in `posterkit.js`.
- **Contact:** `#cta-call` (mailto with subject and body) and `#cta-cal` (Calendly) in section 7 of `index.html`.

## Checks done (local, 2026-11-17)

- **Viewports:**
  - 1440×900 and 1920×1080: every section fits one screen. The poster section is two screens, showcase and studio.
  - 390×844 and 375×812: no horizontal overflow anywhere, galleries scroll sideways, and the phone mockup fits its three cards for every tested filter combination.
- **Posters:** all 9 variations rendered in all 4 formats, mirrored, at palettes 0–2 and at intensity 0–2. Also tested with a long Turkish title ("Gece Yarısı Şehir Işıkları Festivali"). Text stays inside the frame and readable. Mirrored layouts no longer overlap (fixed in Kolaj 16:9, Plak 16:9 and Harfler letter order).
- **Event studio:**
  - The three samples produce different pages.
  - Editing the text to "Ankara Kızılay'da 28 Şubat'ta bir stand-up gecesi… 20.30… 150 kişilik" updates the chips. The regenerated page reads "Açık Mikrofon: Stand-up Gecesi", "28 Şubat 2027 - Pazar", "Kızılay, Ankara", with a stand-up programme and tickets.
  - Removing a tag, "BİLETLERİ GÖR" (jumps to Biletler), the tabs (with arrow keys) and the publish preview (reflects the edits) all work.
- **Poster studio:**
  - Live title, date, time and venue edits update all variations; "KIŞ GÜNDÖNÜMÜ" renders with the correct dotted and dotless i.
  - Category, style, generate, variation, format, palette, sade/cesur, layout and reset all work.
  - The full-screen viewer has format tabs and previous/next.
- **Suggestions:** city, interests, date and budget change the cards and their reasons. Example: İzmir, theatre and comedy, next week, under ₺500 gives "Bir Yaz Gecesi Rüyası", "Ege Komedi Turu", then "Fısıltı" marked as outside the chosen dates.
- **Keyboard:**
  - ↑/↓, Page Up/Down and Home/End move between the 8 stops. Keys are ignored inside fields and radio groups.
  - Arrow keys work in the sample, format and variation radio groups and in the draft-page tabs.
  - Dialogs are native `<dialog>` elements (Esc closes them) and return focus to the button that opened them.
- **Reduced motion:** no animations. Content is visible without entrance effects, and the draft and variations appear instantly (about 40 ms).
- **Both languages:** at 1440×900 every English and Turkish section fits one screen. At 375×812 neither page overflows sideways, and the top bar fits the logo, the EN/TR switch and the call button.
  - English drafts, chips, poster labels ("15 DECEMBER", "STARTS"), suggestion reasons ("Matches your interest in electronic music and your weekend preference.") and the publish preview are all in English.
  - An English description ("Stand-up comedy night in Kızılay, Ankara on February 28th at 8:30 pm. Room for 150 guests.") produces "Açık Mikrofon: Stand-up Night", "28 February 2027 - Sunday", with an English programme and tickets.
  - A typed English poster title uses English capitals ("WINTER SOLSTICE").
  - The language switch carries the current section (for example `tr/#s3`), and the Turkish page's assets, logo and SOHA link resolve from `/tr/`.
- **Fonts and console:** all seven font families load with their Latin and Latin Extended subsets (Turkish glyphs). No console errors and no broken images.
