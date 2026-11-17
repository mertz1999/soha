/* PosterKit: the poster renderer for the SOHA × Biletino proposal.
   Every poster is two layers:
     1. background artwork drawn from one of SOHA's predesigned art systems
        (SVG shapes, gradients and grain, varied by a seed), and
     2. editable text layers (title, date, venue…) fitted to the format with
        real font measurements.
   It is deterministic: the same spec always gives the same poster.
   No model is called and nothing leaves the browser. */
(() => {
  'use strict';

  /* ------------------------------------------------------------ constants */
  const FORMATS = {
    poster: { w: 1080, h: 1350, label: 'Afiş', ratio: '4:5', use: 'Baskı ve paylaşım afişi' },
    cover: { w: 1920, h: 1080, label: 'Etkinlik kapağı', ratio: '16:9', use: 'Biletino etkinlik sayfası kapağı' },
    post: { w: 1080, h: 1080, label: 'Instagram gönderisi', ratio: '1:1', use: 'Instagram akışı' },
    story: { w: 1080, h: 1920, label: 'Hikâye', ratio: '9:16', use: 'Instagram ve WhatsApp hikâyesi' },
  };
  const STYLES = {
    electronic: { name: 'Elektronik', desc: 'Dev tipografi, turuncu ve siyah', variants: ['Spektrum', 'Tipografik duvar', 'Kırık ızgara'] },
    jazz: { name: 'Editoryal', desc: 'Zarif serif, sıcak kâğıt dokusu', variants: ['Plak', 'Mavi saat', 'Kolaj'] },
    workshop: { name: 'Geometrik', desc: 'Cesur biçimler, canlı renkler', variants: ['Izgara', 'Harfler', 'Diyagonal'] },
  };
  const FAM = {
    cond: 'Big Shoulders Display Variable', wide: 'Unbounded Variable', grot: 'Space Grotesk Variable',
    serif: 'Fraunces Variable', syne: 'Syne Variable',
  };
  const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const SEASONS = ['Kış', 'Kış', 'İlkbahar', 'İlkbahar', 'İlkbahar', 'Yaz', 'Yaz', 'Yaz', 'Sonbahar', 'Sonbahar', 'Sonbahar', 'Kış'];

  // Three curated palettes per art system. Index 0 is the default unless a
  // variant prefers another one (see DEFAULT_PAL).
  const PALETTES = {
    electronic: [
      { name: 'Gece', bg: '#0C0C0C', fg: '#F6F1EB', acc: '#E04307', acc2: '#FF8A3D', echo: '#E04307', dark: true },
      { name: 'Turuncu', bg: '#E04307', fg: '#0C0C0C', acc: '#0C0C0C', acc2: '#3A1103', echo: '#FFD9C7', dark: false },
      { name: 'Şeftali', bg: '#17110E', fg: '#FDE8DC', acc: '#FBB297', acc2: '#E04307', echo: '#E04307', dark: true },
    ],
    jazz: [
      { name: 'Kâğıt', bg: '#EFE6D5', fg: '#1F1A16', acc: '#C4471C', acc2: '#2F4858', muted: '#7C6B58', disc: '#16130F', dark: false },
      { name: 'Mavi saat', bg: '#1B2431', fg: '#F1E7D6', acc: '#E59B52', acc2: '#86A9BA', muted: '#A3ACB6', disc: '#0E131A', dark: true },
      { name: 'Bordo', bg: '#4B1D20', fg: '#F4E7D5', acc: '#E9B45E', acc2: '#C9805F', muted: '#D4B4A3', disc: '#260C0E', dark: true },
    ],
    workshop: [
      { name: 'Kâğıt', bg: '#F3EFE6', fg: '#141414', cols: ['#E04307', '#2C4FE0', '#F5B5CB', '#F6C32C', '#141414'], dark: false },
      { name: 'Gece', bg: '#151515', fg: '#F3EFE6', cols: ['#E04307', '#5D7BFF', '#F5B5CB', '#F6C32C', '#F3EFE6'], dark: true },
      { name: 'Kobalt', bg: '#2C4FE0', fg: '#FAF6EE', cols: ['#E04307', '#F5B5CB', '#F6C32C', '#FAF6EE', '#141414'], dark: true },
    ],
  };
  const DEFAULT_PAL = { electronic: [0, 0, 1], jazz: [0, 1, 0], workshop: [0, 0, 0] };

  /* ------------------------------------------------------------ small utils */
  const r = (n) => Math.round(n * 10) / 10;
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const up = (s) => String(s).toLocaleUpperCase('tr-TR');
  const pad = (n) => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const ff = (k) => (k === 'serif' ? `'${FAM[k]}', Georgia, serif` : `'${FAM[k]}', Arial, sans-serif`);
  let uid = 0;

  const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgbHex = (a) => '#' + a.map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  const mix = (a, b, t) => { const A = hexRgb(a), B = hexRgb(b); return rgbHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const lum = (h) => { const c = hexRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const onColor = (bg, dark = '#0C0C0C', light = '#FFFFFF') => (contrast(bg, dark) >= contrast(bg, light) ? dark : light);

  /* ------------------------------------------------------------ text measurement and fitting */
  const cv = document.createElement('canvas').getContext('2d');
  const mcache = new Map();
  const measure = (text, f) => {
    const key = `${f.k}|${f.w}|${f.i ? 1 : 0}|${text}`;
    let v = mcache.get(key);
    if (v === undefined) { cv.font = `${f.i ? 'italic ' : ''}${f.w} 100px '${FAM[f.k]}'`; v = cv.measureText(text).width; mcache.set(key, v); }
    return v;
  };
  // Width at 100 units, including letter-spacing (f.ls is in em).
  const w100 = (text, f) => measure(text, f) + (f.ls || 0) * 100 * [...text].length;

  const splits = (words, n) => {
    const out = [];
    const rec = (start, k, acc) => {
      if (k === 1) { out.push([...acc, words.slice(start)]); return; }
      for (let i = start + 1; i <= words.length - k + 1; i++) rec(i, k - 1, [...acc, words.slice(start, i)]);
    };
    rec(0, n, []);
    return out;
  };
  const greedy = (words, n, f) => {
    const total = w100(words.join(' '), f); const target = total / n; const lines = []; let cur = [];
    words.forEach((w) => { cur.push(w); if (w100(cur.join(' '), f) >= target && lines.length < n - 1) { lines.push(cur); cur = []; } });
    if (cur.length) lines.push(cur);
    return lines;
  };
  // Finds the line split and size that make the text as large as possible
  // inside box (w × h). Prefers fewer lines unless more lines are clearly bigger.
  function fit(text, f, box, o = {}) {
    let t = String(text || '').trim(); if (o.upper) t = up(t);
    let words = t.split(/\s+/).filter(Boolean); if (!words.length) words = ['—'];
    const lh = o.lh || 1; const capH = o.capH || 0.72; const desc = o.desc || 0;
    const maxL = Math.min(o.maxLines || 2, words.length);
    let best = null;
    for (let n = 1; n <= maxL; n++) {
      const cands = words.length > 11 ? [greedy(words, n, f)] : splits(words, n);
      let pick = null;
      cands.forEach((g) => { const lines = g.map((a) => a.join(' ')); const wd = Math.max(...lines.map((l) => w100(l, f))); if (!pick || wd < pick.wd) pick = { lines, wd }; });
      const size = Math.min(o.maxSize || 1e9, box.w / (pick.wd / 100), box.h / (capH + lh * (n - 1) + desc));
      if (!best || size > best.size * 1.06) best = { lines: pick.lines, size, wd: pick.wd, n };
    }
    best.size = Math.max(o.minSize || 1, best.size);
    best.lh = lh; best.capH = capH;
    best.width = (best.wd / 100) * best.size;
    best.height = best.size * (capH + lh * (best.n - 1) + desc);
    return best;
  }
  const fontAttrs = (f, size) => `font-family="${ff(f.k)}" font-weight="${f.w}"${f.i ? ' font-style="italic"' : ''} font-size="${r(size)}"${f.ls ? ` letter-spacing="${r(f.ls * size)}"` : ''}`;
  // Draws a fitted block. y is the top of the block (cap line of line 1).
  function drawFit(F, x, y, f, o = {}) {
    let s = `<text x="${r(x)}" y="${r(y + F.size * F.capH)}" ${fontAttrs(f, F.size)} text-anchor="${o.anchor || 'start'}" fill="${o.fill || 'none'}"`;
    if (o.stroke) s += ` stroke="${o.stroke}" stroke-width="${r(o.sw)}" stroke-linejoin="round"`;
    if (o.opacity != null) s += ` opacity="${o.opacity}"`;
    s += '>';
    F.lines.forEach((l, i) => { s += `<tspan x="${r(x)}"${i ? ` dy="${r(F.size * F.lh)}"` : ''}>${esc(l)}</tspan>`; });
    return s + '</text>';
  }
  function block(text, f, box, o = {}) {
    const F = fit(text, f, box, o);
    const y = o.valign === 'bottom' ? box.y + box.h - F.height : o.valign === 'middle' ? box.y + (box.h - F.height) / 2 : box.y;
    const x = o.anchor === 'middle' ? box.x + box.w / 2 : o.anchor === 'end' ? box.x + box.w : box.x;
    return { svg: drawFit(F, x, y, f, o), F, x, y, bottom: y + F.height };
  }
  // One line at a given baseline, shrunk only if it would overflow maxW.
  function line(text, f, x, y, size, maxW, o = {}) {
    const t = o.upper ? up(text) : String(text);
    const s = maxW ? Math.min(size, maxW / Math.max(1, w100(t, f) / 100)) : size;
    return `<text x="${r(x)}" y="${r(y)}" ${fontAttrs(f, s)} text-anchor="${o.anchor || 'start'}" fill="${o.fill}"${o.opacity != null ? ` opacity="${o.opacity}"` : ''}>${esc(t)}</text>`;
  }

  /* ------------------------------------------------------------ content and context */
  function normContent(c0 = {}) {
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(c0.date || '') ? c0.date : '2026-12-15';
    const [y, mo, d] = iso.split('-').map(Number);
    const wd = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
    const time = String(c0.time || '21:00').slice(0, 5).replace(':', '.');
    return {
      title: String(c0.title || '').trim() || 'Etkinlik adı', kicker: String(c0.kicker || 'Etkinlik').trim(),
      d: String(d), dd: pad(d), mm: pad(mo), yy: String(y).slice(2), y, month: MONTHS[mo - 1], wd, time,
      venue: String(c0.venue || '').trim() || 'Mekân', city: String(c0.city || '').trim(), org: String(c0.org || '').trim(),
      logo: c0.logo || null, season: SEASONS[mo - 1],
    };
  }
  const kindOf = (W, H) => { const a = H / W; return a >= 1.6 ? 'tall' : a >= 1.15 ? 'portrait' : a >= 0.87 ? 'square' : 'wide'; };
  function makeCtx(spec) {
    const fmt = FORMATS[spec.format] || FORMATS.poster; const W = fmt.w; const H = fmt.h;
    const kind = kindOf(W, H); const u = Math.min(W, H) / 100; const m = Math.round(u * 6.5);
    return {
      W, H, kind, u, m, sTop: kind === 'tall' ? H * 0.085 : m, sBot: kind === 'tall' ? H * 0.125 : m,
      c: normContent(spec.content), rnd: rng(hash(`${spec.style}:${spec.variant}:${spec.seed | 0}`)),
      inten: clamp(spec.intensity == null ? 1 : spec.intensity, 0, 2), alt: !!spec.alt, id: `pk${++uid}`, defs: [],
    };
  }
  function palFor(spec) {
    const list = PALETTES[spec.style]; const v = spec.variant % 3;
    const p = { ...list[(DEFAULT_PAL[spec.style][v] + (spec.palette | 0)) % list.length] };
    if (p.cols) p.cols = [...p.cols];
    const a = /^#[0-9A-F]{6}$/i.test(spec.accent || '') ? spec.accent.toUpperCase() : null;
    if (a) {
      if (spec.style === 'electronic') {
        if (p.bg === p.acc2 || !p.dark) { p.bg = a; p.fg = onColor(a); p.acc = p.fg; p.acc2 = mix(a, p.fg, 0.55); p.echo = mix(a, '#FFFFFF', 0.6); }
        else { p.acc = a; p.acc2 = mix(a, '#FFFFFF', 0.35); p.echo = a; }
      } else if (spec.style === 'jazz') { p.acc = a; }
      else { p.cols[0] = a; }
    }
    return p;
  }
  // Organizer logo (if uploaded) or organizer name, right-aligned at the top.
  function orgMark(X, pal, xr, yTop, size, f, color) {
    const { c, u } = X;
    if (c.logo) { const h = size * 2.6; return `<image href="${esc(c.logo)}" x="${r(xr - h * 3.2)}" y="${r(yTop - h * 0.2)}" width="${r(h * 3.2)}" height="${r(h)}" preserveAspectRatio="xMaxYMid meet"/>`; }
    if (!c.org) return '';
    return line(c.org, f, xr, yTop + size * 0.74, size, u * 34, { fill: color, anchor: 'end', upper: true, opacity: 0.85 });
  }
  const grain = (X, op, blend) => `<rect width="${X.W}" height="${X.H}" fill="url(#pk-grain)" opacity="${op}" style="mix-blend-mode:${blend}"/>`;

  /* ============================================================ A · ELECTRONIC */
  const E_TOP = { k: 'grot', w: 600, ls: 0.14 };
  function eTop(X, pal) {
    const { u, m, sTop, W, c } = X; const sz = u * 2.1;
    return line(c.kicker, E_TOP, m, sTop + sz * 0.74, sz, W * 0.5, { fill: pal.fg, upper: true }) + orgMark(X, pal, W - m, sTop, sz, E_TOP, pal.fg);
  }
  // Three-column info strip: date · venue · time.
  function eMeta(X, pal, x, y, w, o = {}) {
    const { u, c } = X; const fg = o.fg || pal.fg;
    const big = { k: 'wide', w: 700, ls: -0.01 }; const small = { k: 'grot', w: 600, ls: 0.1 };
    const cols = [
      [`${c.d} ${up(c.month)}`, `${up(c.wd)} · ${c.y}`],
      [up(c.venue), up(c.city)],
      [c.time, 'BAŞLANGIÇ'],
    ];
    const ws = [0.38, 0.42, 0.2]; const gap = u * 2.4; const inner = w - gap * 2;
    let s = o.noRule ? '' : `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(u * 0.3)}" fill="${fg}" opacity=".9"/>`;
    let cx = x;
    cols.forEach(([a, b], i) => {
      const cw = inner * ws[i];
      s += line(a, big, cx, y + u * 5.6, u * 3.3, cw, { fill: fg });
      s += line(b, small, cx, y + u * 9, u * 1.75, cw, { fill: fg, opacity: 0.68 });
      cx += cw + gap;
    });
    return s;
  }

  // A1 · Spectrum disc: a mirrored sound spectrum inside a dial.
  function eDisk(X, pal) {
    const { W, H, kind, u, m, sTop, c, rnd, inten, alt, id } = X;
    let cx; let cy; let R; let tb; let mb; let anchor = 'middle';
    if (kind === 'wide') { cx = alt ? W * 0.28 : W * 0.72; cy = H * 0.5; R = H * 0.37; tb = { x: alt ? W * 0.53 : m, y: H * 0.2, w: W * 0.43, h: H * 0.42 }; mb = { x: tb.x, y: H * 0.72, w: W * 0.43 }; anchor = 'start'; }
    else if (kind === 'square') { cx = alt ? W * 0.32 : W * 0.68; cy = H * 0.355; R = W * 0.25; tb = { x: m, y: H * 0.535, w: W - 2 * m, h: H * 0.225 }; mb = { x: m, y: H * 0.8, w: W - 2 * m }; anchor = alt ? 'end' : 'start'; }
    else if (kind === 'tall') { cx = W / 2; cy = alt ? H * 0.53 : H * 0.355; R = W * 0.39; tb = alt ? { x: m, y: sTop + u * 9, w: W - 2 * m, h: H * 0.16 } : { x: m, y: H * 0.585, w: W - 2 * m, h: H * 0.16 }; mb = { x: m, y: H * 0.775, w: W - 2 * m }; }
    else { cx = W / 2; cy = alt ? H * 0.565 : H * 0.375; R = W * 0.35; tb = alt ? { x: m, y: sTop + u * 8, w: W - 2 * m, h: H * 0.18 } : { x: m, y: H * 0.63, w: W - 2 * m, h: H * 0.175 }; mb = { x: m, y: H - m - u * 10.5, w: W - 2 * m }; }

    X.defs.push(
      `<radialGradient id="${id}-glow"><stop offset="0" stop-color="${pal.acc}" stop-opacity="${pal.dark ? 0.42 : 0.25}"/><stop offset="1" stop-color="${pal.acc}" stop-opacity="0"/></radialGradient>`,
      `<linearGradient id="${id}-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.acc2}"/><stop offset=".5" stop-color="${pal.acc}"/><stop offset="1" stop-color="${pal.acc2}"/></linearGradient>`,
      `<clipPath id="${id}-c"><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}"/></clipPath>`,
    );
    const N = Math.round(30 + inten * 9); const bw = (2 * R) / N;
    const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28]; const fq = [1 + rnd() * 1.2, 3 + rnd() * 2, 7 + rnd() * 4];
    let bars = '';
    for (let i = 0; i < N; i++) {
      const t = ((i + 0.5) / N) * 2 - 1; const env = Math.sqrt(Math.max(0, 1 - t * t));
      const n = 0.56 + 0.26 * Math.sin(fq[0] * t * 3 + ph[0]) + 0.12 * Math.sin(fq[1] * t * 3 + ph[1]) + 0.06 * Math.sin(fq[2] * t * 3 + ph[2]);
      const h = R * env * clamp(n * (0.78 + inten * 0.14), 0.1, 1);
      bars += `<rect x="${r(cx - R + i * bw + bw * 0.17)}" y="${r(cy - h)}" width="${r(bw * 0.66)}" height="${r(2 * h)}" rx="${r(bw * 0.33)}"/>`;
    }
    let ticks = '';
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2; const long = k % 6 === 0; const r1 = R * 1.07; const r2 = R * (long ? 1.15 : 1.105);
      ticks += `M${r(cx + Math.cos(a) * r1)} ${r(cy + Math.sin(a) * r1)}L${r(cx + Math.cos(a) * r2)} ${r(cy + Math.sin(a) * r2)}`;
    }
    let s = `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 1.9)}" fill="url(#${id}-glow)"/>`;
    s += `<g clip-path="url(#${id}-c)" fill="url(#${id}-bar)">${bars}</g>`;
    s += `<line x1="${r(cx - R)}" y1="${r(cy)}" x2="${r(cx + R)}" y2="${r(cy)}" stroke="${pal.bg}" stroke-width="${r(u * 0.55)}"/>`;
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}" fill="none" stroke="${pal.acc}" stroke-width="${r(u * 0.4)}"/>`;
    s += `<path d="${ticks}" stroke="${pal.fg}" stroke-width="${r(u * 0.22)}" opacity=".5"/>`;
    s += grain(X, pal.dark ? 0.16 : 0.22, pal.dark ? 'screen' : 'multiply');
    if (kind === 'portrait' || kind === 'tall') {
      const rep = `${up(c.title)} ● ${c.d} ${up(c.month)} ● ${up(c.venue)} ● `;
      s += `<text transform="translate(${r(W - m * 0.42)} ${r(sTop)}) rotate(90)" ${fontAttrs({ k: 'grot', w: 500, ls: 0.16 }, u * 1.5)} fill="${pal.fg}" opacity=".45">${esc(rep.repeat(8))}</text>`;
    }
    const f = { k: 'cond', w: 900, ls: -0.005 };
    const T = block(c.title, f, tb, { upper: true, maxLines: 2, lh: 0.86, capH: 0.74, maxSize: kind === 'wide' ? H * 0.25 : W * 0.25, anchor, valign: kind === 'wide' ? 'middle' : 'top' });
    const off = T.F.size * 0.035;
    s += drawFit(T.F, T.x + off, T.y + off, f, { anchor, stroke: pal.echo, sw: T.F.size * 0.012 });
    s += T.svg.replace('fill="none"', `fill="${pal.fg}"`);
    s += eTop(X, pal) + eMeta(X, pal, mb.x, mb.y, mb.w);
    return s;
  }

  // A2 · Type wall: the title repeated as a wall, one solid row is the real title.
  function eWall(X, pal) {
    const { W, H, kind, u, m, sTop, c, rnd, inten, alt, id } = X;
    const my = kind === 'tall' ? H * 0.775 : H - m - u * 10.5;
    const top = sTop + u * 6; const bottom = my - u * 3.5; const regionH = bottom - top;
    const f = { k: 'cond', w: 900, ls: 0 }; const TU = up(c.title);
    const wd = w100(TU, f) / 100;
    // Decorative rows fill fixed slots; the real title spans two slots.
    const n = { tall: 9, portrait: 7, square: 5, wide: 5 }[kind];
    const rowH = regionH / n; const deco = rowH / 0.84;
    const k = alt ? n - 3 : Math.floor((n - 2) / 2);
    const heroSize = Math.min((W - 2 * m) / wd, (rowH * 2) / 0.8);
    X.defs.push(`<clipPath id="${id}-w"><rect x="0" y="${r(top - u * 1.5)}" width="${W}" height="${r(regionH + u * 3)}"/></clipPath>`);
    let rows = '';
    for (let i = 0; i < n; i++) {
      if (i === k || i === k + 1) continue;
      const base = top + rowH * i + (rowH + deco * 0.74) / 2;
      const shift = (rnd() - 0.5) * W * (0.3 + inten * 0.2);
      const outline = (i < k ? k - i : i - k - 1) % 2 === 1;
      const op = inten === 0 ? 0.35 : inten === 1 ? 0.9 : 1;
      rows += `<text x="${r(W / 2 + shift)}" y="${r(base)}" ${fontAttrs(f, deco)} text-anchor="middle" ${outline ? `fill="none" stroke="${pal.acc}" stroke-width="${r(deco * 0.016)}"` : `fill="${pal.acc}"`} opacity="${op}">${esc(`${TU}  ${TU}  ${TU}  ${TU}`)}</text>`;
    }
    let s = `<g clip-path="url(#${id}-w)">${rows}</g>`;
    const kb = top + rowH * k + (rowH * 2 + heroSize * 0.74) / 2;
    s += `<text x="${r(W / 2)}" y="${r(kb)}" ${fontAttrs(f, heroSize)} text-anchor="middle" fill="${pal.fg}">${esc(TU)}</text>`;
    // date sticker, on a decorative row next to the title
    const R = Math.min(W, H) * (0.115 + inten * 0.018);
    const sSlot = k + 2 < n ? k + 2 : k - 1;
    const sx = alt ? m + R * 0.9 : W - m - R * 0.9; const sy = clamp(top + rowH * (sSlot + 0.5), top + R * 0.6, bottom - R * 0.6);
    const Rt = R * 0.8;
    X.defs.push(`<path id="${id}-sp" d="M${r(sx - Rt)} ${r(sy)}a${r(Rt)} ${r(Rt)} 0 1 1 ${r(2 * Rt)} 0a${r(Rt)} ${r(Rt)} 0 1 1 ${r(-2 * Rt)} 0"/>`);
    const ring = `${up(c.wd)} · ${c.time} · ${up(c.venue)} · `;
    let ringTxt = ring; while (ringTxt.length < 44) ringTxt += ring;
    s += `<g transform="rotate(-11 ${r(sx)} ${r(sy)})"><circle cx="${r(sx)}" cy="${r(sy)}" r="${r(R)}" fill="${pal.fg}"/>`;
    s += `<text ${fontAttrs({ k: 'grot', w: 700, ls: 0.06 }, R * 0.12)} fill="${pal.bg}"><textPath href="#${id}-sp" textLength="${r(2 * Math.PI * Rt * 0.985)}" lengthAdjust="spacing">${esc(ringTxt.slice(0, 60))}</textPath></text>`;
    s += line(c.d, { k: 'wide', w: 800, ls: -0.04 }, sx, sy + R * 0.16, R * 0.58, R * 1.15, { fill: pal.bg, anchor: 'middle' });
    s += line(up(c.month), { k: 'grot', w: 700, ls: 0.12 }, sx, sy + R * 0.42, R * 0.15, R * 1.05, { fill: pal.bg, anchor: 'middle' });
    s += '</g>';
    s += grain(X, pal.dark ? 0.14 : 0.2, pal.dark ? 'screen' : 'multiply');
    s += eTop(X, pal) + eMeta(X, pal, m, my, W - 2 * m);
    return s;
  }

  // A3 · Shards: halftone field, black slabs, wide type, solid info band.
  function eShard(X, pal) {
    const { W, H, kind, u, m, sTop, c, rnd, inten, alt, id } = X;
    let art; let tb; let bandY; let bandH = u * 14; let anchor = 'start';
    if (kind === 'wide') { art = { x: alt ? 0 : W * 0.5, y: 0, w: W * 0.5, h: H - bandH }; bandY = H - bandH; tb = { x: alt ? W * 0.53 : m, y: sTop + u * 9, w: W * 0.44, h: bandY - u * 6 - (sTop + u * 9) }; anchor = alt ? 'end' : 'start'; }
    else if (kind === 'square') { bandY = H - bandH; art = { x: alt ? 0 : W * 0.3, y: 0, w: W * 0.7, h: H * 0.5 }; tb = { x: m, y: H * 0.47, w: W - 2 * m, h: bandY - u * 4 - H * 0.47 }; anchor = alt ? 'end' : 'start'; }
    else if (kind === 'tall') { bandY = H * 0.745; art = { x: 0, y: sTop + u * 4, w: W, h: H * 0.4 }; tb = { x: m, y: H * 0.5, w: W - 2 * m, h: bandY - u * 4 - H * 0.5 }; }
    else { bandH = u * 15; bandY = H - bandH; art = { x: 0, y: sTop + u * 5, w: W, h: H * 0.45 }; tb = { x: m, y: H * 0.52, w: W - 2 * m, h: bandY - u * 4 - H * 0.52 }; }
    X.defs.push(`<clipPath id="${id}-a"><rect x="${r(art.x)}" y="${r(art.y)}" width="${r(art.w)}" height="${r(art.h)}"/></clipPath>`);
    const fx = art.x + art.w * (alt ? 0.32 : 0.68) + (rnd() - 0.5) * art.w * 0.15; const fy = art.y + art.h * (0.42 + (rnd() - 0.5) * 0.2);
    const Rf = Math.max(art.w, art.h) * (0.55 + inten * 0.08); const d = u * (3.6 - inten * 0.35);
    let dots = '';
    for (let y = art.y + d / 2; y < art.y + art.h; y += d) {
      for (let x = art.x + d / 2; x < art.x + art.w; x += d) {
        const v = 1 - Math.hypot(x - fx, y - fy) / Rf; if (v <= 0) continue;
        const rr = d * 0.54 * Math.pow(v, 0.75); if (rr < d * 0.08) continue;
        dots += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}"/>`;
      }
    }
    let s = `<g clip-path="url(#${id}-a)"><g fill="${pal.acc}">${dots}</g>`;
    const ang = alt ? 14 : -14; const acx = art.x + art.w / 2; const acy = art.y + art.h / 2;
    const slabs = 2 + (inten > 0 ? 1 : 0);
    for (let i = 0; i < slabs; i++) {
      const th = u * (5 + rnd() * 8); const yy = art.y + art.h * (0.22 + i * 0.3 + (rnd() - 0.5) * 0.08);
      const col = i === 1 ? pal.fg : pal.acc;
      s += `<g transform="rotate(${ang} ${r(acx)} ${r(acy)})"><rect x="${r(art.x - art.w * 0.4)}" y="${r(yy)}" width="${r(art.w * 1.8)}" height="${r(th)}" fill="${col}"/>`;
      if (i === 0 && th > u * 6) s += `<text x="${r(art.x - art.w * 0.3)}" y="${r(yy + th * 0.66)}" ${fontAttrs({ k: 'grot', w: 700, ls: 0.18 }, th * 0.42)} fill="${pal.bg}">${esc(`● ${up(c.kicker)} ● ${c.d} ${up(c.month)} `.repeat(6))}</text>`;
      s += '</g>';
    }
    s += '</g>';
    s += grain(X, pal.dark ? 0.14 : 0.22, pal.dark ? 'screen' : 'multiply');
    const f = { k: 'wide', w: 800, ls: -0.03 };
    const T = block(c.title, f, tb, { upper: true, maxLines: 3, lh: 0.98, capH: 0.73, maxSize: kind === 'wide' ? H * 0.2 : W * 0.22, anchor, valign: 'bottom' });
    s += T.svg.replace('fill="none"', `fill="${pal.fg}"`);
    s += `<rect x="0" y="${r(bandY)}" width="${W}" height="${r(bandH)}" fill="${pal.fg}"/>`;
    s += eMeta(X, pal, m, bandY + u * 0.6, W - 2 * m, { fg: pal.bg, noRule: true });
    s += eTop(X, pal);
    return s;
  }

  /* ============================================================ B · JAZZ & CULTURE */
  const J_CAP = { k: 'serif', w: 600, ls: 0.2 };
  function jTop(X, pal) {
    const { u, m, sTop, W, c } = X; const sz = u * 1.65; const yLine = sTop + u * 3.4;
    let s = line(`${c.kicker} — ${c.season} ${c.y}`, J_CAP, m, sTop + sz * 0.74, sz, W * 0.58, { fill: pal.fg, upper: true });
    s += orgMark(X, pal, W - m, sTop, sz, J_CAP, pal.fg);
    s += `<rect x="${r(m)}" y="${r(yLine)}" width="${r(W - 2 * m)}" height="${r(u * 0.14)}" fill="${pal.fg}" opacity=".75"/>`;
    return s;
  }
  function jMeta(X, pal, x, y, w) {
    const { u, c } = X;
    const val = { k: 'serif', w: 420, ls: -0.005 }; const sub = { k: 'serif', w: 400, i: true, ls: 0 };
    const cols = [['TARİH', `${c.d} ${c.month}`, c.wd], ['SAAT', c.time, ''], ['MEKÂN', c.venue, c.city]];
    const ws = [0.36, 0.2, 0.44]; const gap = u * 2.4; const inner = w - gap * 2;
    let s = `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(u * 0.14)}" fill="${pal.fg}" opacity=".75"/>`;
    let cx = x;
    cols.forEach(([lab, a, b], i) => {
      const cw = inner * ws[i];
      s += line(lab, J_CAP, cx, y + u * 3.6, u * 1.45, cw, { fill: pal.muted });
      s += line(a, val, cx, y + u * 7.4, u * 3, cw, { fill: pal.fg });
      if (b) s += line(b, sub, cx, y + u * 10.4, u * 2.15, cw, { fill: pal.muted });
      cx += cw + gap;
    });
    return s;
  }
  function paper(X, pal) {
    const { W, H, id } = X;
    X.defs.push(`<radialGradient id="${id}-vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${pal.dark ? '#000' : '#5A3A1A'}" stop-opacity="${pal.dark ? 0.38 : 0.2}"/></radialGradient>`);
    return grain(X, pal.dark ? 0.2 : 0.2, pal.dark ? 'soft-light' : 'multiply') + `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/>`;
  }
  const J_TITLE = { k: 'serif', w: 380, i: true, ls: -0.02 };

  // B1 · Record: a vinyl with grooves, label and tonearm on warm paper.
  function jRecord(X, pal) {
    const { W, H, kind, u, m, sTop, c, inten, alt, id } = X;
    let cx; let cy; let R; let tb; let mb;
    if (kind === 'wide') { cx = W * 0.73; cy = H * 0.52; R = H * 0.39; tb = { x: m, y: H * 0.25, w: W * 0.46, h: H * 0.33 }; mb = { x: m, y: H * 0.71, w: W * 0.46 }; }
    else if (kind === 'square') { cx = W * 0.68; cy = H * 0.355; R = W * 0.24; tb = { x: m, y: H * 0.6, w: W * 0.8, h: H * 0.16 }; mb = { x: m, y: H * 0.8, w: W - 2 * m }; }
    else if (kind === 'tall') { cx = W * 0.57; cy = H * 0.33; R = W * 0.39; tb = { x: m, y: H * 0.555, w: W - 2 * m, h: H * 0.13 }; mb = { x: m, y: H * 0.765, w: W - 2 * m }; }
    else { cx = W * 0.6; cy = H * 0.355; R = W * 0.35; tb = { x: m, y: H * 0.625, w: W - 2 * m, h: H * 0.14 }; mb = { x: m, y: H * 0.835, w: W - 2 * m }; }
    if (alt) { cx = W - cx; if (kind === 'wide') { tb.x = W - tb.x - tb.w; mb.x = W - mb.x - mb.w; } }
    const dir = alt ? -1 : 1;
    X.defs.push(
      `<linearGradient id="${id}-sh" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".09"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
      `<path id="${id}-lp" d="M${r(cx - R * 0.235)} ${r(cy)}a${r(R * 0.235)} ${r(R * 0.235)} 0 1 1 ${r(R * 0.47)} 0a${r(R * 0.235)} ${r(R * 0.235)} 0 1 1 ${r(-R * 0.47)} 0"/>`,
    );
    let s = `<circle cx="${r(cx + u * 1.2)}" cy="${r(cy + u * 1.6)}" r="${r(R)}" fill="#000" opacity="${pal.dark ? 0.35 : 0.14}"/>`;
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}" fill="${pal.disc}"/>`;
    let gro = '';
    for (let k = 0; k < 24; k++) { const rr = R * (0.37 + k * 0.026); gro += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" stroke-opacity="${k % 4 === 0 ? 0.13 : 0.055}"/>`; }
    s += `<g fill="none" stroke="#fff" stroke-width="${r(u * 0.12)}">${gro}</g>`;
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}" fill="url(#${id}-sh)"/>`;
    if (pal.dark) s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}" fill="none" stroke="${pal.fg}" stroke-opacity=".22" stroke-width="${r(u * 0.2)}"/>`;
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.31)}" fill="${pal.acc}"/>`;
    s += `<text ${fontAttrs({ k: 'serif', w: 600, ls: 0.12 }, R * 0.05)} fill="${pal.disc}"><textPath href="#${id}-lp" textLength="${r(2 * Math.PI * R * 0.235 * 0.98)}" lengthAdjust="spacing">${esc(`${up(c.title)} · ${up(c.kicker)} · ${up(c.season)} ${c.y} · `)}</textPath></text>`;
    s += line(c.title.length > 14 ? 'A' : up(c.title), { k: 'serif', w: 500, i: true, ls: 0 }, cx, cy + R * 0.1, R * 0.12, R * 0.36, { fill: pal.disc, anchor: 'middle' });
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 0.022)}" fill="${pal.bg}"/>`;
    // tonearm
    const px = cx + dir * R * 1.02; const py = cy - R * 0.86;
    if (px > m && px < W - m * 0.6 && py > sTop + u * 5) {
      const ex = cx + dir * R * 0.36; const ey = cy - R * 0.12;
      s += `<g stroke="${pal.fg}" stroke-linecap="round" fill="none"><path d="M${r(px)} ${r(py)}L${r(px - dir * R * 0.08)} ${r(cy - R * 0.38)}L${r(ex)} ${r(ey)}" stroke-width="${r(u * 0.75)}"/></g>`;
      s += `<rect x="${r(ex - u * 1.6)}" y="${r(ey - u * 0.9)}" width="${r(u * 3.2)}" height="${r(u * 1.8)}" rx="${r(u * 0.3)}" fill="${pal.fg}" transform="rotate(${r(dir * 34)} ${r(ex)} ${r(ey)})"/>`;
      s += `<circle cx="${r(px)}" cy="${r(py)}" r="${r(u * 2.4)}" fill="${pal.fg}"/><circle cx="${r(px)}" cy="${r(py)}" r="${r(u * 1)}" fill="${pal.bg}"/>`;
    }
    if (inten > 1) s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 1.12)}" fill="none" stroke="${pal.acc}" stroke-width="${r(u * 0.25)}" stroke-dasharray="${r(u * 0.6)} ${r(u * 1.4)}"/>`;
    s += paper(X, pal);
    const anchor = alt && kind !== 'wide' ? 'end' : 'start';
    const T = block(c.title, J_TITLE, tb, { maxLines: 2, lh: 0.94, capH: 0.7, desc: 0.12, maxSize: kind === 'wide' ? H * 0.2 : W * 0.19, anchor, valign: 'bottom' });
    s += T.svg.replace('fill="none"', `fill="${pal.fg}"`);
    s += jTop(X, pal) + jMeta(X, pal, mb.x, mb.y, mb.w);
    return s;
  }

  // B2 · Blue hour: a moon behind a musical staff, centred editorial type.
  function jMoon(X, pal) {
    const { W, H, kind, u, m, sTop, c, rnd, inten, alt, id } = X;
    let cx; let cy; let R; let tb; let mb; let anchor = 'middle';
    if (kind === 'wide') { cx = alt ? W * 0.28 : W * 0.72; cy = H * 0.47; R = H * 0.3; tb = { x: alt ? W * 0.52 : m, y: H * 0.2, w: W * 0.44, h: H * 0.34 }; mb = { x: tb.x, y: H * 0.71, w: W * 0.44 }; anchor = 'start'; }
    else if (kind === 'square') { cx = alt ? W * 0.3 : W * 0.7; cy = H * 0.36; R = W * 0.2; tb = { x: m, y: H * 0.56, w: W * 0.8, h: H * 0.17 }; mb = { x: m, y: H * 0.79, w: W - 2 * m }; anchor = alt ? 'end' : 'start'; if (alt) tb.x = W * 0.2 - m; }
    else if (kind === 'tall') { cx = W / 2; cy = H * 0.47; R = W * 0.3; tb = { x: m, y: sTop + u * 9, w: W - 2 * m, h: H * 0.15 }; mb = { x: m, y: H * 0.765, w: W - 2 * m }; }
    else { cx = W / 2; cy = H * 0.5; R = W * 0.25; tb = { x: m, y: sTop + u * 8.5, w: W - 2 * m, h: H * 0.165 }; mb = { x: m, y: H * 0.835, w: W - 2 * m }; }
    const hi = mix(pal.acc, '#FFFFFF', 0.4);
    X.defs.push(`<radialGradient id="${id}-mn" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="${hi}"/><stop offset=".6" stop-color="${pal.acc}"/><stop offset="1" stop-color="${mix(pal.acc, pal.bg, 0.25)}"/></radialGradient>`);
    let s = `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 1.55)}" fill="${pal.acc}" opacity=".07"/><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R * 1.25)}" fill="${pal.acc}" opacity=".08"/>`;
    s += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}" fill="url(#${id}-mn)"/>`;
    // faint stars
    let stars = ''; const nStars = 10 + inten * 8;
    for (let i = 0; i < nStars; i++) { const x = rnd() * W; const y = sTop + u * 6 + rnd() * (cy - sTop); if (Math.hypot(x - cx, y - cy) < R * 1.5) continue; stars += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(u * (0.15 + rnd() * 0.25))}"/>`; }
    s += `<g fill="${pal.fg}" opacity=".55">${stars}</g>`;
    // staff lines across the moon, with a few notes trailing away
    const sp = R * 0.13; const y0 = cy + R * 0.18;
    // in the wide format the staff stays on the moon's side, clear of the title
    const sx0 = kind === 'wide' && !alt ? tb.x + tb.w + u * 4 : 0; const sx1 = kind === 'wide' && alt ? tb.x - u * 4 : W;
    let staff = '';
    for (let i = 0; i < 5; i++) staff += `<line x1="${r(sx0)}" y1="${r(y0 + i * sp)}" x2="${r(sx1)}" y2="${r(y0 + i * sp)}"/>`;
    X.defs.push(`<clipPath id="${id}-mc"><circle cx="${r(cx)}" cy="${r(cy)}" r="${r(R)}"/></clipPath>`);
    s += `<g stroke="${pal.fg}" stroke-width="${r(u * 0.2)}" opacity=".6">${staff}</g>`;
    s += `<g clip-path="url(#${id}-mc)" stroke="${pal.bg}" stroke-width="${r(u * 0.38)}">${staff}</g>`;
    const nNotes = 4 + inten * 2;
    let notes = '';
    for (let i = 0; i < nNotes; i++) {
      const side = i % 2 === 0 ? 1 : -1; const step = Math.floor(i / 2);
      const nx = cx + side * (R * 1.3 + step * R * 0.5 + (rnd() - 0.5) * R * 0.12); const ny = y0 + sp * ((i * 3 + 1) % 5) - (i % 3 === 0 ? sp * 0.5 : 0);
      if (nx < Math.max(m, sx0) + sp || nx > Math.min(W - m, sx1) - sp) continue;
      if (nx > tb.x - sp * 2 && nx < tb.x + tb.w + sp * 2 && ny - sp * 3 < tb.y + tb.h + u * 7 && ny > tb.y) continue;
      notes += `<ellipse cx="${r(nx)}" cy="${r(ny)}" rx="${r(sp * 0.62)}" ry="${r(sp * 0.44)}" transform="rotate(-22 ${r(nx)} ${r(ny)})"/><rect x="${r(nx + sp * 0.5)}" y="${r(ny - sp * 3)}" width="${r(u * 0.25)}" height="${r(sp * 3)}"/>`;
    }
    s += `<g fill="${pal.fg}" opacity=".8">${notes}</g>`;
    s += paper(X, pal);
    const f = { k: 'serif', w: 460, ls: -0.025 };
    const T = block(c.title, f, tb, { maxLines: 2, lh: 0.95, capH: 0.7, desc: 0.1, maxSize: kind === 'wide' ? H * 0.19 : W * 0.17, anchor, valign: kind === 'wide' || kind === 'square' ? 'bottom' : 'top' });
    s += T.svg.replace('fill="none"', `fill="${pal.fg}"`);
    const ax = anchor === 'middle' ? tb.x + tb.w / 2 : anchor === 'end' ? tb.x + tb.w : tb.x;
    s += line(`${c.d} ${c.month} · ${c.wd} akşamı`, { k: 'serif', w: 400, i: true, ls: 0 }, ax, T.bottom + u * 4.6, u * 2.8, tb.w, { fill: pal.acc, anchor });
    s += jTop(X, pal) + jMeta(X, pal, mb.x, mb.y, mb.w);
    return s;
  }

  // B3 · Collage: a cut-paper arch with piano keys and a sun, title beside it.
  function jCollage(X, pal) {
    const { W, H, kind, u, m, sTop, c, inten, alt, id } = X;
    let a; let tb; let mb;
    if (kind === 'wide') { a = { x: W * 0.07, y: H * 0.18, w: H * 0.5, h: H * 0.7 }; tb = { x: W * 0.42, y: H * 0.22, w: W * 0.52, h: H * 0.34 }; mb = { x: W * 0.42, y: H * 0.71, w: W * 0.52 }; }
    else if (kind === 'square') { a = { x: m, y: H * 0.17, w: W * 0.38, h: H * 0.57 }; tb = { x: W * 0.51, y: H * 0.2, w: W * 0.49 - m, h: H * 0.42 }; mb = { x: m, y: H * 0.8, w: W - 2 * m }; }
    else if (kind === 'tall') { a = { x: m, y: sTop + u * 14, w: W * 0.6, h: H * 0.38 }; tb = { x: m, y: H * 0.6, w: W - 2 * m, h: H * 0.13 }; mb = { x: m, y: H * 0.765, w: W - 2 * m }; }
    else { a = { x: m, y: H * 0.17, w: W * 0.46, h: H * 0.58 }; tb = { x: W * 0.6, y: H * 0.2, w: W * 0.4 - m, h: H * 0.45 }; mb = { x: m, y: H * 0.835, w: W - 2 * m }; }
    if (alt) { a.x = W - a.x - a.w; if (kind !== 'tall') tb.x = W - tb.x - tb.w; if (kind === 'wide') mb.x = W - mb.x - mb.w; }
    const arch = (x, y, w, h) => `M${r(x)} ${r(y + h)}L${r(x)} ${r(y + w / 2)}A${r(w / 2)} ${r(w / 2)} 0 0 1 ${r(x + w)} ${r(y + w / 2)}L${r(x + w)} ${r(y + h)}Z`;
    const ins = a.w * 0.09;
    X.defs.push(`<clipPath id="${id}-ar"><path d="${arch(a.x + ins, a.y + ins, a.w - ins * 2, a.h - ins)}"/></clipPath>`);
    const shadow = pal.dark ? 0.3 : 0.14;
    const sr = a.w * (0.24 + inten * 0.025); const sx = alt ? a.x + a.w * 0.2 : a.x + a.w * 0.8; const sy = a.y + a.w * 0.1;
    let s = `<circle cx="${r(sx)}" cy="${r(sy)}" r="${r(sr)}" fill="${pal.acc}"/>`;
    s += `<path d="${arch(a.x + u * 1.1, a.y + u * 1.4, a.w, a.h)}" fill="#000" opacity="${shadow}"/>`;
    s += `<path d="${arch(a.x, a.y, a.w, a.h)}" fill="${pal.acc2}"/>`;
    s += `<path d="${arch(a.x + ins, a.y + ins, a.w - ins * 2, a.h - ins)}" fill="${mix(pal.acc2, '#000', 0.32)}"/>`;
    // piano keys in the lower part of the inner arch
    const kx = a.x + ins; const kw = a.w - ins * 2; const ky = a.y + a.h * 0.62; const kh = a.h * 0.38;
    const nk = 7; const wkey = kw / nk;
    let keys = `<rect x="${r(kx)}" y="${r(ky)}" width="${r(kw)}" height="${r(kh)}" fill="${pal.bg}"/>`;
    for (let i = 1; i < nk; i++) keys += `<rect x="${r(kx + i * wkey - u * 0.12)}" y="${r(ky)}" width="${r(u * 0.24)}" height="${r(kh)}" fill="${pal.disc}"/>`;
    [1, 2, 4, 5, 6].forEach((i) => { keys += `<rect x="${r(kx + i * wkey - wkey * 0.28)}" y="${r(ky)}" width="${r(wkey * 0.56)}" height="${r(kh * 0.6)}" rx="${r(u * 0.3)}" fill="${pal.disc}"/>`; });
    s += `<g clip-path="url(#${id}-ar)">${keys}</g>`;
    // a small paper moon inside the arch, and thin sound arcs where there is room
    const mr = a.w * 0.07; const mx = alt ? a.x + a.w * 0.68 : a.x + a.w * 0.32; const my = a.y + a.w * 0.42;
    s += `<circle cx="${r(mx)}" cy="${r(my)}" r="${r(mr)}" fill="${pal.bg}" opacity=".9"/>`;
    if (kind === 'tall' || (kind === 'portrait' && !alt)) {
      const dir = alt ? -1 : 1; const ax = a.x + (alt ? 0 : a.w); const ay = a.y + a.h * 0.42;
      let arcs = '';
      for (let i = 1; i <= 2 + (inten > 0 ? 1 : 0); i++) { const rr = a.w * 0.06 * i; arcs += `<path d="M${r(ax + dir * u * 2)} ${r(ay - rr)}A${r(rr)} ${r(rr)} 0 0 ${dir > 0 ? 1 : 0} ${r(ax + dir * u * 2)} ${r(ay + rr)}"/>`; }
      s += `<g fill="none" stroke="${pal.fg}" stroke-width="${r(u * 0.3)}" stroke-linecap="round" opacity=".75">${arcs}</g>`;
    }
    s += paper(X, pal);
    const anchor = 'start';
    const T = block(c.title, J_TITLE, tb, { maxLines: kind === 'tall' ? 2 : 4, lh: 0.92, capH: 0.7, desc: 0.12, maxSize: kind === 'wide' ? H * 0.2 : W * 0.17, anchor, valign: kind === 'tall' ? 'top' : 'middle' });
    s += line(c.kicker, { k: 'serif', w: 600, ls: 0.2 }, tb.x, T.y - u * 2.6, u * 1.6, tb.w, { fill: pal.acc, upper: true });
    s += T.svg.replace('fill="none"', `fill="${pal.fg}"`);
    s += jTop(X, pal) + jMeta(X, pal, mb.x, mb.y, mb.w);
    return s;
  }

  /* ============================================================ C · CREATIVE WORKSHOP */
  const W_LAB = { k: 'grot', w: 600, ls: 0.1 };
  function wTop(X, pal) {
    const { u, m, sTop, W, c } = X; const sz = u * 1.9;
    const label = up(c.kicker); const f = { k: 'grot', w: 700, ls: 0.08 };
    const tw = Math.min(W * 0.5, (w100(label, f) / 100) * sz); const ph = sz * 2;
    let s = `<rect x="${r(m)}" y="${r(sTop - sz * 0.35)}" width="${r(tw + sz * 1.6)}" height="${r(ph)}" rx="${r(ph / 2)}" fill="${pal.fg}"/>`;
    s += line(label, f, m + sz * 0.8, sTop - sz * 0.35 + ph * 0.5 + sz * 0.36, sz, W * 0.5, { fill: pal.bg });
    s += orgMark(X, pal, W - m, sTop, sz, W_LAB, pal.fg);
    return s;
  }
  function wMeta(X, pal, x, y, w) {
    const { u, c } = X;
    const val = { k: 'syne', w: 700, ls: -0.01 }; const sub = { k: 'grot', w: 500, ls: 0.02 };
    const cols = [['TARİH', `${c.d} ${c.month}`, `${c.wd}, ${c.y}`], ['SAAT', c.time, ''], ['MEKÂN', c.venue, c.city]];
    const ws = [0.38, 0.18, 0.44]; const gap = u * 2.4; const inner = w - gap * 2;
    let s = ''; let cx = x;
    cols.forEach(([lab, a, b], i) => {
      const cw = inner * ws[i];
      s += line(lab, W_LAB, cx, y + u * 1.6, u * 1.5, cw, { fill: pal.fg, opacity: 0.6 });
      s += line(a, val, cx, y + u * 5.4, u * 3.1, cw, { fill: pal.fg });
      if (b) s += line(b, sub, cx, y + u * 8.4, u * 1.95, cw, { fill: pal.fg, opacity: 0.75 });
      cx += cw + gap;
    });
    return s;
  }
  function wLayout(X) {
    const { W, H, kind, u, m, sTop, alt } = X;
    if (kind === 'wide') { const ax = alt ? m : W * 0.53; return { art: { x: ax, y: m, w: W * 0.47 - m, h: H - 2 * m }, tb: { x: alt ? W * 0.52 : m, y: sTop + u * 9, w: W * 0.43, h: H * 0.4 }, my: H * 0.73, mx: alt ? W * 0.52 : m, mw: W * 0.43 }; }
    if (kind === 'square') return alt ? { art: { x: m, y: H * 0.43, w: W - 2 * m, h: H * 0.36 }, tb: { x: m, y: sTop + u * 7, w: W - 2 * m, h: H * 0.25 }, my: H - m - u * 9.5, mx: m, mw: W - 2 * m } : { art: { x: m, y: sTop + u * 7, w: W - 2 * m, h: H * 0.4 }, tb: { x: m, y: H * 0.585, w: W - 2 * m, h: H * 0.215 }, my: H - m - u * 9.5, mx: m, mw: W - 2 * m };
    if (kind === 'tall') return alt ? { art: { x: m, y: H * 0.37, w: W - 2 * m, h: H * 0.36 }, tb: { x: m, y: sTop + u * 8, w: W - 2 * m, h: H * 0.17 }, my: H * 0.765, mx: m, mw: W - 2 * m } : { art: { x: m, y: sTop + u * 7, w: W - 2 * m, h: H * 0.4 }, tb: { x: m, y: H * 0.545, w: W - 2 * m, h: H * 0.16 }, my: H * 0.765, mx: m, mw: W - 2 * m };
    return alt ? { art: { x: m, y: H * 0.37, w: W - 2 * m, h: H * 0.44 }, tb: { x: m, y: sTop + u * 8, w: W - 2 * m, h: H * 0.2 }, my: H - m - u * 9.5, mx: m, mw: W - 2 * m } : { art: { x: m, y: sTop + u * 7, w: W - 2 * m, h: H * 0.48 }, tb: { x: m, y: H * 0.615, w: W - 2 * m, h: H * 0.2 }, my: H - m - u * 9.5, mx: m, mw: W - 2 * m };
  }
  const W_TITLE = { k: 'syne', w: 800, ls: -0.035 };
  function wText(X, pal, L) {
    const { kind, H, W } = X;
    const T = block(X.c.title, W_TITLE, L.tb, { maxLines: 3, lh: 0.9, capH: 0.7, desc: 0.14, maxSize: kind === 'wide' ? H * 0.17 : W * 0.155, valign: 'middle' });
    return T.svg.replace('fill="none"', `fill="${pal.fg}"`) + wTop(X, pal) + wMeta(X, pal, L.mx, L.my, L.mw);
  }
  const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length) % arr.length];

  // C1 · Grid: a modular grid of quarter circles, arches, rings and stripes.
  function wGrid(X, pal) {
    const { u, rnd, inten } = X; const L = wLayout(X); const A = L.art;
    const t0 = Math.sqrt((A.w * A.h) / 18); const cols = Math.max(2, Math.round(A.w / t0)); const rows = Math.max(1, Math.round(A.h / t0));
    const t = Math.min(A.w / cols, A.h / rows); const gx = A.x + (A.w - cols * t) / 2; const gy = A.y;
    const shapes = ['quarter', 'quarter', 'half', 'circle', 'ring', 'dot', 'tri', 'stripes', 'arch'];
    const blankP = [0.42, 0.18, 0.05][inten];
    let s = ''; let prev = null;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = gx + i * t; const y = gy + j * t; const cxp = x + t / 2; const cyp = y + t / 2;
        const rot = Math.floor(rnd() * 4) * 90;
        let colA = pick(rnd, pal.cols); if (colA === prev) colA = pal.cols[(pal.cols.indexOf(colA) + 1) % pal.cols.length];
        let colB = rnd() < 0.45 ? null : pick(rnd, pal.cols); if (colB === colA) colB = null;
        prev = colA;
        if (colB) s += `<rect x="${r(x)}" y="${r(y)}" width="${r(t + 0.5)}" height="${r(t + 0.5)}" fill="${colB}"/>`;
        if (rnd() < blankP) continue;
        const sh = pick(rnd, shapes); const tr = ` transform="rotate(${rot} ${r(cxp)} ${r(cyp)})"`;
        if (sh === 'quarter') s += `<path d="M${r(x)} ${r(y)}L${r(x + t)} ${r(y)}A${r(t)} ${r(t)} 0 0 1 ${r(x)} ${r(y + t)}Z" fill="${colA}"${tr}/>`;
        else if (sh === 'half') s += `<path d="M${r(x)} ${r(y + t)}A${r(t / 2)} ${r(t / 2)} 0 0 1 ${r(x + t)} ${r(y + t)}Z" fill="${colA}"${tr}/>`;
        else if (sh === 'circle') s += `<circle cx="${r(cxp)}" cy="${r(cyp)}" r="${r(t * 0.46)}" fill="${colA}"/>`;
        else if (sh === 'ring') s += `<circle cx="${r(cxp)}" cy="${r(cyp)}" r="${r(t * 0.33)}" fill="none" stroke="${colA}" stroke-width="${r(t * 0.17)}"/>`;
        else if (sh === 'dot') s += `<rect x="${r(x + t * 0.12)}" y="${r(y + t * 0.12)}" width="${r(t * 0.76)}" height="${r(t * 0.76)}" fill="${colA}"/><circle cx="${r(cxp)}" cy="${r(cyp)}" r="${r(t * 0.18)}" fill="${colB || pal.bg}"/>`;
        else if (sh === 'tri') s += `<path d="M${r(x)} ${r(y)}L${r(x + t)} ${r(y)}L${r(x)} ${r(y + t)}Z" fill="${colA}"${tr}/>`;
        else if (sh === 'stripes') s += `<g fill="${colA}"${tr}><rect x="${r(x)}" y="${r(y + t * 0.1)}" width="${r(t)}" height="${r(t * 0.16)}"/><rect x="${r(x)}" y="${r(y + t * 0.42)}" width="${r(t)}" height="${r(t * 0.16)}"/><rect x="${r(x)}" y="${r(y + t * 0.74)}" width="${r(t)}" height="${r(t * 0.16)}"/></g>`;
        else s += `<path d="M${r(x)} ${r(y + t)}L${r(x)} ${r(y + t / 2)}A${r(t / 2)} ${r(t / 2)} 0 0 1 ${r(x + t)} ${r(y + t / 2)}L${r(x + t)} ${r(y + t)}Z" fill="${colA}"${tr}/>`;
      }
    }
    s += grain(X, pal.dark ? 0.12 : 0.16, pal.dark ? 'screen' : 'multiply');
    return s + wText(X, pal, L) + (u ? '' : '');
  }

  // C2 · Letters: the event's initials set inside big playful shapes.
  function wLetters(X, pal) {
    const { u, c, rnd, inten, alt, id } = X; const L = wLayout(X); const A = L.art;
    const words = up(c.title).replace(/[^A-ZÇĞİÖŞÜ0-9\s&]/g, ' ').split(/\s+/).filter((w) => /[A-ZÇĞİÖŞÜ0-9]/.test(w));
    const letters = words.length >= 2 ? [words[0][0], words[1][0] === '&' ? (words[2] || words[0])[0] : words[1][0]] : [(words[0] || 'A')[0], (words[0] || 'AB')[1] || '•'];
    const vertical = A.h > A.w * 1.05;
    if (alt && !vertical) letters.reverse(); // mirrored: the square (first letter) sits on the left
    const D = vertical ? Math.min(A.w * 0.82, A.h * 0.58) : Math.min(A.w * 0.58, A.h * 0.96);
    const S = D * 0.86;
    const c1 = vertical ? { x: A.x + D / 2 + (alt ? A.w - D : 0), y: A.y + D / 2 } : { x: A.x + D / 2 + (alt ? A.w - D : 0) + A.w * 0.01, y: A.y + A.h / 2 };
    const s0 = vertical ? { x: alt ? A.x : A.x + A.w - S, y: A.y + A.h - S } : { x: alt ? A.x : A.x + A.w - S - A.w * 0.01, y: A.y + (A.h - S) / 2 + A.h * 0.04 };
    const colC = pal.cols[0]; const colS = pal.cols[1];
    const f = { k: 'syne', w: 800, ls: 0 };
    let s = '';
    // confetti behind the letters
    const nc = 10 + inten * 5; const kinds = ['dot', 'tri', 'plus', 'zig', 'ring'];
    for (let i = 0; i < nc; i++) {
      const x = A.x + rnd() * A.w; const y = A.y + rnd() * A.h; const z = u * (1.8 + rnd() * 2.8); const col = pal.cols[(i + 2) % pal.cols.length]; const k = pick(rnd, kinds); const rot = Math.round(rnd() * 360);
      if (k === 'dot') s += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(z * 0.5)}" fill="${col}"/>`;
      else if (k === 'tri') s += `<path d="M${r(x)} ${r(y - z * 0.6)}L${r(x + z * 0.55)} ${r(y + z * 0.4)}L${r(x - z * 0.55)} ${r(y + z * 0.4)}Z" fill="${col}" transform="rotate(${rot} ${r(x)} ${r(y)})"/>`;
      else if (k === 'plus') s += `<path d="M${r(x - z * 0.5)} ${r(y)}H${r(x + z * 0.5)}M${r(x)} ${r(y - z * 0.5)}V${r(y + z * 0.5)}" stroke="${col}" stroke-width="${r(z * 0.24)}" stroke-linecap="round" transform="rotate(${rot} ${r(x)} ${r(y)})"/>`;
      else if (k === 'zig') s += `<path d="M${r(x - z)} ${r(y)}l${r(z * 0.5)} ${r(-z * 0.4)}l${r(z * 0.5)} ${r(z * 0.8)}l${r(z * 0.5)} ${r(-z * 0.8)}l${r(z * 0.5)} ${r(z * 0.4)}" fill="none" stroke="${col}" stroke-width="${r(z * 0.2)}" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rot} ${r(x)} ${r(y)})"/>`;
      else s += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(z * 0.45)}" fill="none" stroke="${col}" stroke-width="${r(z * 0.16)}"/>`;
    }
    const rot2 = alt ? -8 : 8;
    s += `<g transform="rotate(${rot2} ${r(s0.x + S / 2)} ${r(s0.y + S / 2)})"><rect x="${r(s0.x)}" y="${r(s0.y)}" width="${r(S)}" height="${r(S)}" rx="${r(S * 0.16)}" fill="${colS}"/>`;
    s += line(letters[1], f, s0.x + S / 2, s0.y + S / 2 + S * 0.25, S * 0.72, S * 0.84, { fill: onColor(colS, '#141414', '#FAF6EE'), anchor: 'middle' }) + '</g>';
    s += `<circle cx="${r(c1.x)}" cy="${r(c1.y)}" r="${r(D / 2)}" fill="${colC}"/>`;
    s += line(letters[0], f, c1.x, c1.y + D * 0.25, D * 0.72, D * 0.8, { fill: onColor(colC, '#141414', '#FAF6EE'), anchor: 'middle' });
    s += grain(X, pal.dark ? 0.12 : 0.16, pal.dark ? 'screen' : 'multiply');
    X.defs.push(`<g id="${id}-noop"/>`);
    return s + wText(X, pal, L);
  }

  // C3 · Diagonal: a stack of rounded bars at an angle and a date sticker.
  function wDiag(X, pal) {
    const { u, c, rnd, inten, alt, id } = X; const L = wLayout(X); const A = L.art;
    X.defs.push(`<clipPath id="${id}-d"><rect x="${r(A.x)}" y="${r(A.y)}" width="${r(A.w)}" height="${r(A.h)}" rx="${r(u * 1.6)}"/></clipPath>`);
    const ang = ((alt ? 28 : -28) * Math.PI) / 180; const dx = Math.cos(ang); const dy = Math.sin(ang); const nx = -dy; const ny = dx;
    const cx = A.x + A.w / 2; const cy = A.y + A.h / 2; const Ld = Math.hypot(A.w, A.h);
    const T = Math.min(A.w, A.h) * (0.13 + inten * 0.03); const step = T * 1.32; const n = Math.ceil(Ld / step) + 1;
    const order = [...pal.cols].sort(() => rnd() - 0.5);
    let bars = '';
    for (let i = 0; i < n; i++) {
      const o = (i - (n - 1) / 2) * step; const a0 = -Ld / 2 + rnd() * Ld * 0.35; const a1 = Ld / 2 - rnd() * Ld * 0.35;
      const x1 = cx + nx * o + dx * a0; const y1 = cy + ny * o + dy * a0; const x2 = cx + nx * o + dx * a1; const y2 = cy + ny * o + dy * a1;
      const col = order[i % order.length];
      bars += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${col}" stroke-width="${r(T)}" stroke-linecap="round"/>`;
      if (rnd() < 0.5) bars += `<circle cx="${r(x2 - dx * T * 0.1)}" cy="${r(y2 - dy * T * 0.1)}" r="${r(T * 0.2)}" fill="${pal.bg}"/>`;
    }
    let s = `<g clip-path="url(#${id}-d)">${bars}</g>`;
    const R = Math.min(A.w, A.h) * 0.2; const sx = alt ? A.x + R * 0.95 : A.x + A.w - R * 0.95; const sy = A.y + A.h - R * 0.95;
    s += `<g transform="rotate(${alt ? -12 : 12} ${r(sx)} ${r(sy)})"><circle cx="${r(sx)}" cy="${r(sy)}" r="${r(R)}" fill="${pal.fg}"/>`;
    s += line(c.d, { k: 'syne', w: 800, ls: -0.03 }, sx, sy + R * 0.12, R * 0.68, R * 1.3, { fill: pal.bg, anchor: 'middle' });
    s += line(up(c.month), { k: 'grot', w: 700, ls: 0.1 }, sx, sy + R * 0.42, R * 0.17, R * 1.2, { fill: pal.bg, anchor: 'middle' });
    s += line(c.time, { k: 'grot', w: 600, ls: 0.06 }, sx, sy - R * 0.5, R * 0.15, R, { fill: pal.bg, anchor: 'middle', opacity: 0.75 });
    s += '</g>';
    s += grain(X, pal.dark ? 0.12 : 0.16, pal.dark ? 'screen' : 'multiply');
    return s + wText(X, pal, L);
  }

  // Stories get a ticket prompt inside the safe area.
  function storyPill(X, pal) {
    if (X.kind !== 'tall') return '';
    const { W, H, u } = X; const f = { k: 'grot', w: 700, ls: 0.14 }; const t = "BİLETLER BİLETİNO'DA"; const sz = u * 1.75;
    const tw = (w100(t, f) / 100) * sz; const ph = sz * 2.7; const y = H * 0.848;
    return `<rect x="${r((W - tw) / 2 - sz * 1.6)}" y="${r(y)}" width="${r(tw + sz * 3.2)}" height="${r(ph)}" rx="${r(ph / 2)}" fill="none" stroke="${pal.fg}" stroke-opacity=".55" stroke-width="${r(u * 0.2)}"/>`
      + line(t, f, W / 2 + sz * 0.07, y + ph / 2 + sz * 0.36, sz, 0, { fill: pal.fg, anchor: 'middle' });
  }

  const DRAW = { electronic: [eDisk, eWall, eShard], jazz: [jRecord, jMoon, jCollage], workshop: [wGrid, wLetters, wDiag] };

  /* ------------------------------------------------------------ public */
  function render(spec) {
    const sp = { style: 'electronic', variant: 0, seed: 0, format: 'poster', palette: 0, intensity: 1, alt: false, ...spec };
    if (!DRAW[sp.style]) sp.style = 'electronic';
    const X = makeCtx(sp); const pal = palFor(sp);
    const body = DRAW[sp.style][((sp.variant % 3) + 3) % 3](X, pal) + storyPill(X, pal);
    const label = `${X.c.title} afişi: ${STYLES[sp.style].name} tarzı, ${STYLES[sp.style].variants[sp.variant % 3]} varyasyonu, ${FORMATS[sp.format] ? FORMATS[sp.format].label : 'Afiş'} formatı`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${X.W} ${X.H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label)}"><defs>${X.defs.join('')}</defs><rect width="${X.W}" height="${X.H}" fill="${pal.bg}"/>${body}</svg>`;
  }

  // Shared grain texture, created once and referenced as url(#pk-grain).
  function installDefs() {
    if (document.getElementById('pk-grain')) return;
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const img = x.createImageData(128, 128); const rnd = rng(7);
    for (let i = 0; i < img.data.length; i += 4) { const v = (rnd() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    x.putImageData(img, 0, 0);
    const holder = document.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = `<svg width="0" height="0" focusable="false"><defs><pattern id="pk-grain" width="150" height="150" patternUnits="userSpaceOnUse"><image href="${c.toDataURL('image/png')}" width="150" height="150"/></pattern></defs></svg>`;
    document.body.prepend(holder);
  }

  const FONT_TESTS = [
    "900 40px 'Big Shoulders Display Variable'", "800 40px 'Unbounded Variable'", "700 40px 'Unbounded Variable'",
    "600 40px 'Space Grotesk Variable'", "700 40px 'Space Grotesk Variable'", "italic 380 40px 'Fraunces Variable'",
    "460 40px 'Fraunces Variable'", "600 40px 'Fraunces Variable'", "800 40px 'Syne Variable'", "700 40px 'Syne Variable'",
  ];
  let readyP = null;
  const ready = () => {
    if (!readyP) {
      readyP = (document.fonts && document.fonts.load
        ? Promise.all(FONT_TESTS.map((f) => document.fonts.load(f, 'AaİıŞşĞğÇçÖöÜü0123').catch(() => null)))
        : Promise.resolve()).then(() => { mcache.clear(); });
    }
    return readyP;
  };

  const dateParts = (iso) => { const c = normContent({ date: iso }); return { d: c.d, month: c.month, wd: c.wd, y: c.y, season: c.season }; };

  window.PosterKit = { FORMATS, STYLES, PALETTES, DEFAULT_PAL, MONTHS, DAYS, render, ready, installDefs, dateParts, up, util: { contrast, mix, onColor, hash } };
})();
