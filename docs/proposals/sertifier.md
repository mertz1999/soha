# Proposal: Sertifier (SOHA → Sertifier)

> **Status:** Published · **Updated:** 2026-11-17
> **Page:** `site/proposals/sertifier/` → <https://mertz1999.github.io/soha/proposals/sertifier/>
> **Production design:** [sertifier-production-architecture.md](sertifier-production-architecture.md)

One feature, proposed to Sertifier's founder: an **AI Brand-Aware Certificate Designer**. It takes a company website and a few answers, and produces three beautiful, brand-consistent, editable certificate designs. The page is English, with Turkish certificate text available in the demo.

**Positioning.** Sertifier already has an "AI Certificate Maker". According to its public page and FAQ, that tool drafts the certificate name, description and criteria, campaign settings and emails, while the customer still designs the certificate. The proposal therefore presents AI *design* as the next layer on top of what Sertifier already has: website-to-brand extraction, context-aware design, several editable variations and automated layout validation. It does not claim Sertifier lacks AI.

## The six sections

| # | Section | Shows |
|---|---|---|
| 1 | Opening | "What if certificates designed themselves?" with a floating certificate that cycles through the three design styles |
| 2 | The idea | Animated four-step sequence: website → brand analysis → three designs → an editable certificate with selection handles |
| 3 | Try it | The working generator: website or demo brand, certificate details, **Generate 3 Designs**, results with live validation |
| 4 | Showcase | The three generated designs in an overlapping gallery (a swipe carousel on phones). Refinements, enlarged preview and exports |
| 5 | Ready for Sertifier | Conceptual five-step architecture and three qualities. Clearly marked as a concept |
| 6 | Closing | The user's three designs in a fan, a `mailto:` button, the SOHA site link and the independence disclosure |

## How the demo stays honest

- **No AI model is called.** CertKit (`assets/certkit.js`) is a deterministic layout engine that runs in the browser, and the page says so next to the generator. The short "generating" animation is a transition, not a model call.
- **Demo presets** (Meridian Academy, Northwind Labs, Atelier Verde) are fictional and use reserved `.example` domains. The brand card is labelled **Demo preset** and says no website was read.
- **SOHA → "Read live"** genuinely fetches SOHA's public English page (`/soha/en/`) from the same site. It extracts the name, logo, colour values and fonts with a simple heuristic, and labels the result **Read live** with what it found.
- **Any other address** is first fetched directly from the visitor's browser. If the site allows that (CORS), its brand is read live. If not, which is most sites, the card switches to **Demo mode** and explains that the starting colours come from the domain name.
- **`sertifier.com`** is a special case. Its public colours and type (forest `#092C25`, green `#00A356`, Inter) are entered by SOHA, so the founder can try their own brand. It is labelled **Demo mode … entered by SOHA … Nothing was fetched**, and the page does not use Sertifier's logo file; it shows an "S" monogram instead.
- **Credential IDs and QR codes are placeholders.** IDs are marked "Demo placeholder". The QR is a deliberately non-scannable pattern with a "DEMO" tag and the caption "Demo QR · not scannable".
- **Sertifier integration is conceptual.** Section 5 says integration points depend on Sertifier's editor and API and would be validated together.
- **Independence:** the footer says the page is an independent SOHA proposal with no endorsement or partnership. The page is `noindex, nofollow`.

## Run it locally

From the repository root:

```bash
python3 -m http.server 4321 --directory site
```

Open <http://localhost:4321/proposals/sertifier/>. In the Claude app, the `ensa-site` preview in `.claude/launch.json` does the same thing.

- **Live brand reading:** it needs the SOHA English page (`site/en/`) to be served from the same server, which the command above does.
- **Fonts:** the certificate fonts load from the jsDelivr CDN, so the first load needs internet access.

## Publish

The Pages workflow publishes `site/` on every push to `main`, so any later change to these files goes live as soon as it is pushed. The page is live at <https://mertz1999.github.io/soha/proposals/sertifier/>.

## Files

| File | Purpose |
|---|---|
| `site/proposals/sertifier/index.html` | The six sections, the generator form, the preview dialog |
| `site/proposals/sertifier/assets/certkit.js` | **Certificate renderer.** Design spec → editable SVG; text fitting, contrast control, validation report. No dependencies |
| `site/proposals/sertifier/assets/proposal.js` | Page logic: slides, brand reading and demo mode, generator, showcase and refinements, preview, exports, shared links |
| `site/proposals/sertifier/assets/sertifier.css` | Page design in Sertifier's visual language (Inter, `#111` ink, `#F8F8F7`, green pills, forest `#092C25`) |
| `site/proposals/sertifier/assets/og-image.png` | 1200×630 social preview |

The proposal reuses SOHA's logo and favicon from `site/assets/img/`. Nothing else in the site was changed.

## CertKit: the reusable certificate component

```js
const spec = {
  design: 'heritage',            // 'heritage' | 'editorial' | 'future'
  layout: 0,                     // 0–2, three compositions per design
  ornament: 2, elegance: 2,      // 0–2 each ("more minimal" / "more elegant")
  brandColors: true,             // false = the design's neutral palette
  purpose: 'course',             // 'course' | 'achievement' | 'recognition' | 'event'
  lang: 'en',                    // 'en' | 'tr'
  brand: CertKit.brandFromPreset('meridian'),
  data: { recipient: 'Deniz Yılmaz', title: 'Advanced Product Design', organization: 'Meridian Academy',
          date: '2026-11-16', signer: 'Elif Aksoy', role: 'Program Director',
          signer2: 'James Whitfield', role2: 'Head of Learning', showSignature: true, showVerification: true },
};
const { svg, report } = CertKit.render(spec);                 // inline SVG + validation report
const file = CertKit.render(spec, { standalone: true }).svg;  // self-contained SVG with font imports
```

- **Page size:** A4 landscape, 1123 × 794 units. The certificates are pure SVG text and shapes, so they stay sharp at any size and every field remains editable.
- **The three designs:**
  - **Heritage Elegance** is a serif, symmetrical design with a guilloché border and seal, a faint rosette watermark and ribbons.
  - **Modern Editorial** has a huge, tightly set name, Instrument Serif italics and large brand shapes in three asymmetric layouts.
  - **Future Minimal** uses a dark or light grid, an orbit with tick marks and a progress arc, a hexagon badge and mono labels.
- **Text fitting:** text is measured with the real fonts. It shrinks, splits into two balanced lines (also at hyphens), and only as a last resort is shortened with "…", which the report flags as a warning.
- **Contrast control:** brand colours are nudged until text meets WCAG AA against its own background.
- **Report:** `report.fit`, `report.contrast` (minimum ratio), `report.safe` (40-unit margin), `report.fields` (dynamic placeholders such as `recipient.name`) and `report.boxes` (where each field sits).
- **Turkish:** fixed copy uses Turkish casing (`SERTİFİKA`). Names keep their own casing unless they contain Turkish letters.

## Editing

- **Page copy:** edit `index.html`.
- **Certificate wording (EN/TR):** the `COPY` object in `certkit.js`.
- **Demo brands:** `PRESETS` and `PAIRINGS` in `certkit.js`.
- **Default demo data and per-purpose default titles:** `defaultsData()` and `DEFAULT_TITLES` in `proposal.js`.
- **Contact:** in the closing section of `index.html`, `#cta-call` is the Calendly booking link (`https://calendly.com/reza-tanakizadeh/soha`) and `#cta-mail` is the email button, which shows the address.

## Checks done before hand-off

- **Viewports:**
  - Desktop at 1440×900 and 1920×1080: each section fits one screen, except the generator, whose results panel stays fixed while the form scrolls.
  - Phones at 390×844 and 375×812: no horizontal overflow, the rotated full-screen preview fits the screen, and closing links are 44px tall.
- **Generator flow:**
  - Brand changes update the colours, logo and organization across the results, showcase and closing.
  - Name, title, purpose, style and language changes update every preview live.
  - Purpose changes swap in a matching default title.
  - Turkish text renders correctly (`KATILIM BELGESİ`, `KASIM 2026`).
- **Brand sources:** SOHA is read live (`#1D2B64` and its green, logo, fonts). An unknown domain falls back to demo mode, `sertifier.com` uses the entered palette, and `meridian.example` maps to its preset.
- **Refinements:** "more minimal", "more elegant", "try another layout", "use brand colors" and reset all change the actual design, and the buttons disable at their limits.
- **Exports and sharing:** SVG export produces valid XML, design JSON follows `soha.certificate-design/0.1`, and a shared link restores the brand, data and refinements.
- **Validation sweep:** 2,160 combinations, covering 5 brands (including a deliberately pale one) × 3 designs × 3 layouts × ornament × elegance × colour mode × purpose × short, medium and very long names. All of them pass the fit, contrast and safe-margin checks.
- **Reduced motion:** no animation, instant results, the opening certificate stays still, and refinements still work.
- **Keyboard:** arrow keys, Page Up/Down and Home/End move between sections; radio groups, buttons, the gallery and the dialog (Esc) are keyboard reachable; focus rings are visible.
- **Console and images:** no console errors on a fresh load, and no broken images.
