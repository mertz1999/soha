# Proposal: Aposkal (SOHA × Aposkal)

> **Status:** Published · **Updated:** 2026-11-16
> **Page:** `site/proposals/aposkal/` → https://mertz1999.github.io/soha/proposals/aposkal/

A personalised, full-screen presentation that introduces three AI ideas to the founders of [Aposkal](https://aposkal.com/isletme/), a Turkish accounting SaaS. Turkish is the default language. English is available from the TR/EN switch, or with `?lang=en`.

## The six slides

| # | Slide | Shows |
|---|---|---|
| 1 | Opening | SOHA × Aposkal composition, "Aposkal için 3 yeni AI fırsatı" |
| 2 | Akıllı Aylık Finansal Analiz | Phone mockup of the existing monthly income chart, switching to the proposed automatic monthly report (not a chatbot) |
| 3 | Aposkal, AI Asistanlarına Bağlanıyor | Proposed MCP Server + AI Skills between AI clients and the existing Aposkal API v1, with permission-controlled access |
| 4 | Akıllı Muhasebe Kapanış Asistanı | Accountant workspace: the assistant sorts and reviews month-end exceptions, and the accountant approves |
| 5 | Three ideas, one product | Three linked capability cards |
| 6 | Birlikte hayata geçirelim | `mailto:` button for a 15-minute call, plus a link to the SOHA site |

## Run it locally

From the repository root:

```bash
python3 -m http.server 4321 --directory site
```

Then open <http://localhost:4321/proposals/aposkal/>. In the Claude app, the `ensa-site` preview in `.claude/launch.json` does the same thing.

Controls:
- **Slides:** arrow keys, Page Up/Down, Home/End, the dots on the right, or normal scrolling.
- **Phones:** the slides become vertical sections that scroll naturally.

## Publish

The repository's Pages workflow (`.github/workflows/pages.yml`) publishes `site/` on every push to `main`. So publishing means committing and pushing:

```bash
git add site/proposals/aposkal docs/proposals/aposkal.md
git commit -m "Add Aposkal proposal"
git push
```

**Do not push until the proposal is approved.**

## Files

| File | Purpose |
|---|---|
| `site/proposals/aposkal/index.html` | Slides and Turkish copy |
| `site/proposals/aposkal/assets/proposal.css` | Design system (Aposkal navy/teal, Fraunces + DM Sans), layouts, mockups, motion |
| `site/proposals/aposkal/assets/proposal.js` | Slide tracking and keyboard navigation, sample chart, demos, English strings, TR/EN switch |
| `site/proposals/aposkal/assets/og-image.png` | 1200×630 social preview |

The proposal reuses the SOHA logo and favicon from `site/assets/img/`.

## Editing the copy

- **Turkish:** edit the text in `index.html`. Elements carry `data-i18n="key"`.
- **English:** edit the `EN` object at the top of `proposal.js`, using the same keys.
- **Chart data:** the sample values (Nov → Oct, ₺ thousands) are in `VALUES` in `proposal.js`. The static bars in `index.html` are only a no-JavaScript fallback; the script redraws them.

## Accuracy and tone (keep these when editing)

- All on-screen figures are **fictional sample data**, labelled «Örnek veriler». "Ege Tasarım" and the other names are invented.
- **MCP slide:** the MCP Server and AI Skills are presented as **proposed** (with a gold «Önerilen» badge). Only "Aposkal API v1" is shown as existing, because its documentation is public at `apidocs.aposkal.com`. No credentials appear anywhere. Write actions are described as needing user approval.
- **Client labels:** each AI client is labelled with its own integration type (ChatGPT: MCP app; Claude: Connector + Skill; others: MCP-compatible). The page also notes that setup differs by client.
- **Closing assistant:** it is positioned *alongside* Aposkal's existing trial balance (mizan) and rule engine (kural motoru). Every consequential change needs the accountant's «Onayla».
- **No claims:** there are no ROI, revenue or productivity claims.
- **Independence:** the page states it is an independent SOHA proposal that does not imply a partnership. It is also `noindex, nofollow`, so search engines won't list a proposal about another company.

## Checks done before hand-off

- Desktop at 1440×900 and 1920×1080: every slide fits one screen.
- Phones at 390×844 and 375×812: no horizontal overflow and no overlapping blocks. Tap targets are at least 32px, with the closing links at 44px.
- Keyboard navigation and the TR/EN switch (no Turkish strings left in English).
- Reduced motion: final states, no loops, and approval still works.
- No console errors and no broken images.
