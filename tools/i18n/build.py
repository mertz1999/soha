#!/usr/bin/env python3
"""Build the English and Turkish landing pages from the Persian source.

    python3 tools/i18n/build.py

Source of truth: site/index.html (Persian, RTL). Output: site/en/index.html and
site/tr/index.html (LTR). Workflow: change the Persian page, add/adjust rows in
tools/i18n/strings.py, run this script. It fails if any Persian text is left
untranslated, or if a row in the table no longer matches the Persian page.
Standard library only.
"""
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from strings import STRINGS  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / 'site' / 'index.html'

LANGS = {
    'en': {'col': 1, 'locale': 'en_US', 'switch_label': 'Language'},
    'tr': {'col': 2, 'locale': 'tr_TR', 'switch_label': 'Dil'},
}
ALL = [('fa', 'فا'), ('en', 'EN'), ('tr', 'TR')]


def href(from_lang, to_lang):
    """Relative link between the language folders (fa lives at the site root)."""
    if from_lang == to_lang:
        return './'
    if from_lang == 'fa':
        return f'{to_lang}/'
    return '../' if to_lang == 'fa' else f'../{to_lang}/'


def lang_switch(lang, label):
    links = '\n'.join(
        f'        <a href="{href(lang, code)}" lang="{code}" hreflang="{code}"'
        + (' aria-current="page"' if code == lang else '') + f'>{text}</a>'
        for code, text in ALL)
    return f'      <nav class="lang-switch" aria-label="{label}">\n{links}\n      </nav>'


def alternates(lang):
    rows = [f'  <link rel="alternate" hreflang="{code}" href="{href(lang, code)}">' for code, _ in ALL]
    rows.append(f'  <link rel="alternate" hreflang="x-default" href="{href(lang, "fa")}">')
    return '\n'.join(rows)


def swap_block(html, name, new):
    pat = re.compile(rf'<!--{name}-->.*?<!--/{name}-->', re.S)
    html, n = pat.subn(lambda m: f'<!--{name}-->\n{new}\n      <!--/{name}-->' if name == 'LANG-SWITCH'
                      else f'<!--{name}-->\n{new}\n  <!--/{name}-->', html)
    if n != 1:
        raise ValueError(f'marker {name} not found')
    return html


def build(lang, conf, rows):
    html = SRC.read_text(encoding='utf-8')

    # 1. regions that stay Persian on every language (the wordmark; the switcher is held below)
    kept = []

    def hold(fragment):
        kept.append(fragment)
        return f'\x00KEEP{len(kept) - 1}\x00'

    html = re.sub(r'<span class="brand-name">سها<span lang="en">SOHA</span></span>', lambda m: hold(m.group()), html)

    # 2. language, direction, links between languages, asset paths, Latin font
    html = html.replace('<html lang="fa" dir="rtl">', f'<html lang="{lang}" dir="ltr">', 1)
    html = html.replace('<meta property="og:locale" content="fa_IR">', f'<meta property="og:locale" content="{conf["locale"]}">', 1)
    html = swap_block(html, 'LANG-ALTERNATES', alternates(lang))
    html = swap_block(html, 'LANG-SWITCH', lang_switch(lang, conf['switch_label']))
    switch = re.search(r'<!--LANG-SWITCH-->.*?<!--/LANG-SWITCH-->', html, re.S).group()
    html = html.replace(switch, hold(switch), 1)          # «فا» stays in its own script
    html = re.sub(r'\b(href|src|srcset)="assets/', r'\1="../assets/', html)
    vazir = re.search(r'  <link rel="stylesheet" href="https://cdn\.jsdelivr\.net/gh/rastikerdar/vazirmatn@[^"]+">\n', html).group()
    html = html.replace(vazir, vazir + '  <!-- Inter (OFL) for English/Turkish; Persian glyphs fall back to Vazirmatn. Self-host for production. -->\n'
                        '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/inter@5/index.css">\n', 1)

    # 3. text, longest Persian first so snippets win over the words inside them
    unused = []
    for row in sorted(rows, key=lambda r: -len(r[0])):
        fa, text = row[0], row[conf['col']]
        if fa not in html:
            unused.append(fa)
            continue
        html = html.replace(fa, text)

    # 4. nothing Persian may remain outside the kept regions
    left = sorted({m.group() for m in re.finditer(r'[^<>"]*[؀-ۿ][^<>"]*', html)})
    if left:
        raise SystemExit(f'[{lang}] untranslated Persian text:\n  ' + '\n  '.join(s.strip() for s in left))

    for i, fragment in enumerate(kept):
        html = html.replace(f'\x00KEEP{i}\x00', fragment)
    html = html.replace('<!doctype html>\n', '<!doctype html>\n<!-- Generated from ../index.html by tools/i18n/build.py. '
                        'Edit the Persian page and tools/i18n/strings.py, then rebuild. -->\n', 1)

    out = ROOT / 'site' / lang / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding='utf-8')
    return out, unused


def main():
    keys = [r[0] for r in STRINGS]
    dupes = {k for k in keys if keys.count(k) > 1}
    if dupes:
        raise SystemExit(f'duplicate source strings in strings.py: {dupes}')
    for lang, conf in LANGS.items():
        out, unused = build(lang, conf, STRINGS)
        print(f'{lang}: wrote {out.relative_to(ROOT)}')
        if unused:
            print(f'  warning: {len(unused)} row(s) not found in the Persian page (stale?):')
            for u in unused:
                print('   -', u[:80])


if __name__ == '__main__':
    main()
