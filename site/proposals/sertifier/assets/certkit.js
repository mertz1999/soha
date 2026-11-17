/* CertKit: SOHA's certificate renderer for the Sertifier proposal.
   Turns a structured design spec into an editable SVG certificate
   (A4 landscape, 1123 × 794 units). Three design systems: heritage,
   editorial and future. It is deterministic: there is no AI call in here.
   Text is measured, wrapped and fitted, and every render returns a
   validation report (fit, contrast, safe margins, dynamic fields). */
(function (global) {
  'use strict';

  const W = 1123;
  const H = 794;
  const SAFE = 40;
  let UID = 0;

  /* ------------------------------------------------------------ fonts */
  const STACK = {
    'Cormorant Variable': "'Cormorant Variable', 'Cormorant Garamond', Georgia, serif",
    'Fraunces Variable': "'Fraunces Variable', Georgia, serif",
    'Instrument Serif': "'Instrument Serif', Georgia, serif",
    'Inter Variable': "'Inter Variable', Inter, 'Helvetica Neue', Arial, sans-serif",
    'DM Sans Variable': "'DM Sans Variable', 'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    'Space Grotesk Variable': "'Space Grotesk Variable', 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
    'JetBrains Mono Variable': "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, Menlo, monospace",
    'Mrs Saint Delafield': "'Mrs Saint Delafield', 'Snell Roundhand', cursive",
  };
  const STATIC_400 = new Set(['Instrument Serif', 'Mrs Saint Delafield']);
  const CDN = 'https://cdn.jsdelivr.net/npm/';
  const FONT_CSS = {
    'Cormorant Variable': ['@fontsource-variable/cormorant@5/index.css', '@fontsource-variable/cormorant@5/wght-italic.css'],
    'Fraunces Variable': ['@fontsource-variable/fraunces@5/index.css', '@fontsource-variable/fraunces@5/wght-italic.css'],
    'Instrument Serif': ['@fontsource/instrument-serif@5/index.css', '@fontsource/instrument-serif@5/400-italic.css'],
    'Inter Variable': ['@fontsource-variable/inter@5/index.css'],
    'DM Sans Variable': ['@fontsource-variable/dm-sans@5/index.css'],
    'Space Grotesk Variable': ['@fontsource-variable/space-grotesk@5/index.css'],
    'JetBrains Mono Variable': ['@fontsource-variable/jetbrains-mono@5/index.css'],
    'Mrs Saint Delafield': ['@fontsource/mrs-saint-delafield@5/index.css'],
  };

  const PAIRINGS = {
    classic: { label: 'Cormorant + Inter', serif: 'Cormorant Variable', sans: 'Inter Variable' },
    warm: { label: 'Fraunces + DM Sans', serif: 'Fraunces Variable', sans: 'DM Sans Variable' },
    technical: { label: 'Instrument Serif + Space Grotesk', serif: 'Instrument Serif', sans: 'Space Grotesk Variable' },
    neutral: { label: 'Instrument Serif + Inter', serif: 'Instrument Serif', sans: 'Inter Variable' },
  };

  // Clearly fictional demo brands (.example domains are reserved for examples).
  const PRESETS = {
    meridian: {
      id: 'meridian', name: 'Meridian Academy', url: 'https://meridian.example', sector: 'Education',
      pairing: 'classic', mark: { type: 'meridian' },
      colors: { primary: '#1F2E55', accent: '#B08A3E', paper: '#FBF8F1', ink: '#161D33' },
    },
    northwind: {
      id: 'northwind', name: 'Northwind Labs', url: 'https://northwind.example', sector: 'Software & AI',
      pairing: 'technical', mark: { type: 'northwind' },
      colors: { primary: '#4338CA', accent: '#06B6D4', paper: '#F5F7FB', ink: '#0B1020' },
    },
    verde: {
      id: 'verde', name: 'Atelier Verde', url: 'https://atelierverde.example', sector: 'Design studio',
      pairing: 'warm', mark: { type: 'verde' },
      colors: { primary: '#1E4D3A', accent: '#D2643A', paper: '#F6F1E7', ink: '#18241E' },
    },
  };

  const DESIGNS = {
    heritage: { name: 'Heritage Elegance', short: 'Heritage' },
    editorial: { name: 'Modern Editorial', short: 'Editorial' },
    future: { name: 'Future Minimal', short: 'Future' },
  };

  // Preferred style -> starting ornament / elegance, and the best-matching design.
  const STYLES = {
    minimal: { ornament: 0, elegance: 1, match: 'future' },
    elegant: { ornament: 2, elegance: 2, match: 'heritage' },
    modern: { ornament: 1, elegance: 0, match: 'editorial' },
    classic: { ornament: 2, elegance: 1, match: 'heritage' },
  };

  const COPY = {
    en: {
      p: {
        course: { full: 'Certificate of Completion', main: 'Certificate', sub: 'of Completion', line: 'has successfully completed', seal: 'Completed' },
        achievement: { full: 'Certificate of Achievement', main: 'Certificate', sub: 'of Achievement', line: 'is recognized for outstanding achievement in', seal: 'Awarded' },
        recognition: { full: 'Certificate of Recognition', main: 'Certificate', sub: 'of Recognition', line: 'is honored for exceptional contribution to', seal: 'Recognized' },
        event: { full: 'Certificate of Participation', main: 'Certificate', sub: 'of Participation', line: 'took part in', seal: 'Participant' },
      },
      pre: 'This certifies that', issuedBy: 'Issued by', date: 'Date', dateOfIssue: 'Date of issue',
      signature: 'Signature', authorized: 'Authorized by', id: 'Credential ID', demo: 'Demo placeholder',
      demoShort: 'Demo', demoQr: 'Demo QR · not scannable', cert: 'Certificate',
    },
    tr: {
      p: {
        course: { full: 'Tamamlama Sertifikası', main: 'Sertifika', sub: 'Program Tamamlama', line: 'aşağıdaki programı başarıyla tamamlamıştır', seal: 'Tamamlandı' },
        achievement: { full: 'Başarı Sertifikası', main: 'Sertifika', sub: 'Üstün Başarı', line: 'aşağıdaki alanda üstün başarı göstermiştir', seal: 'Başarı' },
        recognition: { full: 'Takdir Belgesi', main: 'Takdir Belgesi', sub: 'Üstün Katkı', line: 'aşağıdaki katkılarıyla takdir edilmiştir', seal: 'Takdir' },
        event: { full: 'Katılım Belgesi', main: 'Katılım Belgesi', sub: 'Etkinlik', line: 'aşağıdaki etkinliğe katılmıştır', seal: 'Katılımcı' },
      },
      pre: 'Bu sertifikanın sahibi', issuedBy: 'Veren kurum', date: 'Tarih', dateOfIssue: 'Veriliş tarihi',
      signature: 'İmza', authorized: 'Onaylayan', id: 'Sertifika no', demo: 'Demo yer tutucu',
      demoShort: 'Demo', demoQr: 'Demo QR · taranamaz', cert: 'Sertifika',
    },
  };

  /* ------------------------------------------------------------ helpers */
  const r2 = (n, d = 2) => { const k = 10 ** d; return Math.round(n * k) / k; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  const upper = (s, lang) => s.toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US');
  // Names and brands: Turkish casing only when the name itself is Turkish.
  const upperName = (s) => s.toLocaleUpperCase(/[ıİşŞğĞ]/.test(s) ? 'tr-TR' : 'en-US');
  const hash = (str) => { let h = 2166136261; for (const ch of String(str)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const initials = (name) => clean(name).split(/[\s-]+/).filter((w) => /\p{L}/u.test(w)).slice(0, 3).map((w) => w[0]).join('').toLocaleUpperCase('en-US');

  /* ------------------------------------------------------------ colour */
  const hexToRgb = (hex) => {
    let h = String(hex || '#000').replace('#', '').trim();
    if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
    const n = parseInt(h.slice(0, 6), 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
  const mix = (a, b, t) => { const A = hexToRgb(a); const B = hexToRgb(b); return rgbToHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const lum = (hex) => {
    const [r, g, b] = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const isLight = (hex) => lum(hex) > 0.45;
  // Nudge a colour toward black or white until it reaches the contrast target.
  const ensure = (fg, bg, min) => {
    if (contrast(fg, bg) >= min) return rgbToHex(hexToRgb(fg));
    const target = lum(bg) > 0.18 ? '#000000' : '#FFFFFF';
    for (let t = 0.04; t <= 1.001; t += 0.04) { const c = mix(fg, target, t); if (contrast(c, bg) >= min) return c; }
    return target;
  };
  const toHsl = (hex) => {
    const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    const max = Math.max(r, g, b); const min = Math.min(r, g, b); const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min; const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  };
  const fromHsl = (h, s, l) => {
    const k = (n) => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return rgbToHex([f(0) * 255, f(8) * 255, f(4) * 255]);
  };

  /* ------------------------------------------------------------ text measuring */
  const cv = (typeof document !== 'undefined') ? document.createElement('canvas').getContext('2d') : null;
  const fontStr = (o) => `${o.italic ? 'italic ' : ''}${STATIC_400.has(o.family) ? 400 : (o.weight || 400)} ${o.size}px ${STACK[o.family] || o.family}`;
  const lsOf = (o) => (o.lsEm ? o.lsEm * o.size : (o.ls || 0));
  const tw = (text, o) => {
    const n = [...text].length;
    if (!cv) return text.length * o.size * 0.55 + lsOf(o) * n;
    cv.font = fontStr(o);
    return cv.measureText(text).width + lsOf(o) * n;
  };
  const fitSize = (text, o, maxW, min) => {
    const w = tw(text, o);
    if (w <= maxW) return o.size;
    const n = [...text].length;
    const glyph = (w - lsOf(o) * n) / o.size;
    const s = o.lsEm ? maxW / (glyph + o.lsEm * n) : (maxW - (o.ls || 0) * n) / glyph;
    return Math.max(min, Math.floor(s * 10) / 10);
  };
  // Fit text into maxW: shrink, then (optionally) split into two balanced
  // lines, and as a last resort shorten with an ellipsis. Reports what it did.
  const layoutText = (raw, o, maxW, opt = {}) => {
    const text = clean(raw);
    const fitsAt = (str, size) => tw(str, { ...o, size }) <= maxW + 0.5;
    // break opportunities: spaces, and after hyphens inside words
    const breaks = [];
    for (let i = 1; i < text.length - 1; i += 1) {
      if (text[i] === ' ') breaks.push([text.slice(0, i), text.slice(i + 1)]);
      else if (text[i] === '-') breaks.push([text.slice(0, i + 1), text.slice(i + 1)]);
    }
    let best = null;
    if ((opt.maxLines || 1) >= 2) {
      breaks.forEach(([a, b]) => { const m = Math.max(tw(a, o), tw(b, o)); if (!best || m < best.m) best = { a, b, m }; });
    }
    const attempt = (min) => {
      const s1 = fitSize(text, o, maxW, min);
      const oneFits = fitsAt(text, s1);
      if (best) {
        const s2 = Math.min(o.size, fitSize(best.a, o, maxW, min), fitSize(best.b, o, maxW, min));
        const twoFits = fitsAt(best.a, s2) && fitsAt(best.b, s2);
        const preferTwo = opt.prefer2 ? s2 > s1 * 1.06 : (!oneFits || s1 < (opt.wrapBelow || 0));
        if (twoFits && (preferTwo || !oneFits)) return { lines: [best.a, best.b], size: s2, shrunk: s2 < o.size, truncated: false };
      }
      return oneFits ? { lines: [text], size: s1, shrunk: s1 < o.size, truncated: false } : null;
    };
    const min = opt.min || o.size * 0.5;
    const res = attempt(min) || (opt.floor ? attempt(opt.floor) : null);
    if (res) return res;
    const floor = opt.floor || min;
    let t = text; const oo = { ...o, size: floor };
    while (t.length > 1 && tw(t + '…', oo) > maxW) t = t.slice(0, -1);
    return { lines: [t.trimEnd() + '…'], size: floor, shrunk: true, truncated: true };
  };

  /* ------------------------------------------------------------ geometry (memoised) */
  const memo = new Map();
  const remember = (key, fn) => { if (!memo.has(key)) memo.set(key, fn()); return memo.get(key); };
  // Interlaced sine waves between two radii: the guilloché band used in seals.
  const ringPath = (r1, r2v, lobes, waves, steps = 240) => remember(`ring${r1}|${r2v}|${lobes}|${waves}`, () => {
    const mid = (r1 + r2v) / 2; const amp = (r2v - r1) / 2; let d = '';
    for (let j = 0; j < waves; j += 1) {
      const ph = (j * 2 * Math.PI) / waves;
      for (let i = 0; i <= steps; i += 1) {
        const t = (i / steps) * 2 * Math.PI; const r = mid + amp * Math.sin(lobes * t + ph);
        d += `${i ? 'L' : 'M'}${r2(r * Math.cos(t), 1)} ${r2(r * Math.sin(t), 1)}`;
      }
      d += 'Z';
    }
    return d;
  });
  // Hypotrochoid rosette, centred on the origin: the faint watermark.
  const spiroPath = (R, r, d, scale, steps = 900) => remember(`spiro${R}|${r}|${d}|${scale}`, () => {
    const g = (a, b) => (b ? g(b, a % b) : a); const turns = r / g(R, r); let p = '';
    for (let i = 0; i <= steps; i += 1) {
      const t = (i / steps) * 2 * Math.PI * turns; const k = (R - r) / r;
      const x = ((R - r) * Math.cos(t) + d * Math.cos(k * t)) * scale; const y = ((R - r) * Math.sin(t) - d * Math.sin(k * t)) * scale;
      p += `${i ? 'L' : 'M'}${r2(x, 1)} ${r2(y, 1)}`;
    }
    return p + 'Z';
  });
  // Two opposed waves running round a rectangular band: the guilloché border.
  const waveBorder = (inset, amp, period) => remember(`wave${inset}|${amp}|${period}`, () => {
    const sides = [[inset, inset, W - inset, inset], [W - inset, inset, W - inset, H - inset], [W - inset, H - inset, inset, H - inset], [inset, H - inset, inset, inset]];
    let d = '';
    [1, -1].forEach((sign) => sides.forEach(([x0, y0, x1, y1]) => {
      const L = Math.hypot(x1 - x0, y1 - y0); const n = Math.max(2, Math.round(L / period)); const p = L / n;
      const ux = (x1 - x0) / L; const uy = (y1 - y0) / L; const vx = -uy; const vy = ux;
      d += `M${r2(x0, 1)} ${r2(y0, 1)}`;
      for (let i = 0; i < 2 * n; i += 1) {
        const s = (i % 2 ? -1 : 1) * sign; const cx = x0 + ux * (i * p / 2 + p / 4) + vx * 2 * amp * s; const cy = y0 + uy * (i * p / 2 + p / 4) + vy * 2 * amp * s;
        d += `Q${r2(cx, 1)} ${r2(cy, 1)} ${r2(x0 + ux * ((i + 1) * p / 2), 1)} ${r2(y0 + uy * ((i + 1) * p / 2), 1)}`;
      }
    }));
    return d;
  });
  const ticksPath = (r1, r2v, count, majorEvery, majorExtra) => remember(`ticks${r1}|${r2v}|${count}|${majorEvery}|${majorExtra}`, () => {
    let d = '';
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * 2 * Math.PI - Math.PI / 2; const outer = r2v + (i % majorEvery === 0 ? majorExtra : 0);
      d += `M${r2(r1 * Math.cos(a), 1)} ${r2(r1 * Math.sin(a), 1)}L${r2(outer * Math.cos(a), 1)} ${r2(outer * Math.sin(a), 1)}`;
    }
    return d;
  });
  // A QR-like pattern that is deliberately not a real code (labelled as demo).
  const demoQr = (seedStr, size) => {
    const n = 21; const u = size / n; const rand = rng(hash(seedStr)); let d = '';
    const finder = (x, y) => (x >= 0 && x < 7 && y >= 0 && y < 7);
    const inFinder = (x, y) => finder(x, y) || finder(x - (n - 7), y) || finder(x, y - (n - 7));
    for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) {
      if (inFinder(x, y)) continue;
      if (x >= 8 && x <= 12 && y >= 8 && y <= 12) continue; // centre left clear for the DEMO tag
      if (rand() > 0.52) d += `M${r2(x * u)} ${r2(y * u)}h${r2(u)}v${r2(u)}h${r2(-u)}z`;
    }
    const fp = (x, y) => `M${r2(x * u)} ${r2(y * u)}h${r2(7 * u)}v${r2(7 * u)}h${r2(-7 * u)}zM${r2((x + 1) * u)} ${r2((y + 1) * u)}v${r2(5 * u)}h${r2(5 * u)}v${r2(-5 * u)}zM${r2((x + 2) * u)} ${r2((y + 2) * u)}h${r2(3 * u)}v${r2(3 * u)}h${r2(-3 * u)}z`;
    return d + fp(0, 0) + fp(n - 7, 0) + fp(0, n - 7);
  };

  /* ------------------------------------------------------------ render context */
  function context(spec) {
    const id = `c${(UID += 1)}`;
    const c = { id, spec, defs: [], body: [], boxes: [], pairs: [], fits: [], fields: new Set() };
    c.add = (s) => { c.body.push(s); };
    // Text with tracking compensation, bounding box and contrast bookkeeping.
    c.text = (x, y, str, o) => {
      const ls = lsOf(o); let ax = x;
      if (ls && o.anchor === 'middle') ax += ls / 2; else if (ls && o.anchor === 'end') ax += ls;
      const at = [`x="${r2(ax)}"`, `y="${r2(y)}"`, `font-family="${STACK[o.family] || o.family}"`, `font-size="${r2(o.size)}"`];
      const wt = STATIC_400.has(o.family) ? 400 : (o.weight || 400);
      if (wt !== 400) at.push(`font-weight="${wt}"`);
      if (o.italic) at.push('font-style="italic"');
      if (ls) at.push(`letter-spacing="${r2(ls)}"`);
      if (o.anchor && o.anchor !== 'start') at.push(`text-anchor="${o.anchor}"`);
      at.push(`fill="${o.fill}"`);
      if (o.opacity != null) at.push(`fill-opacity="${o.opacity}"`);
      if (o.field) { at.push(`data-field="${o.field}"`); c.fields.add(o.field); }
      if (o.transform) at.push(`transform="${o.transform}"`);
      c.add(`<text ${at.join(' ')}>${esc(str)}</text>`);
      if (!o.noBox) {
        const w = tw(str, o) - ls; const left = o.anchor === 'middle' ? x - w / 2 : o.anchor === 'end' ? x - w : x;
        c.boxes.push({ x: left, y: y - o.size * 0.78, w, h: o.size, label: o.field || str.slice(0, 18) });
      }
      if (o.bg) c.pairs.push({ ratio: contrast(o.cc || o.fill, o.bg), large: o.size >= 24 || (o.size >= 18.6 && (o.weight || 400) >= 600), label: o.field || str.slice(0, 18) });
      return tw(str, o) - ls;
    };
    // Multi-line block from layoutText. Returns its height.
    c.lines = (x, top, lt, o, lh = 1.08) => {
      const cap = lt.size * 0.74;
      lt.lines.forEach((line, i) => c.text(x, top + cap + i * lt.size * lh, line, { ...o, size: lt.size }));
      return cap + (lt.lines.length - 1) * lt.size * lh;
    };
    c.fit = (field, lt) => { c.fits.push({ field, shrunk: lt.shrunk, truncated: lt.truncated, lines: lt.lines.length }); return lt; };
    return c;
  }

  // Vertical flow: lays blocks out between top and bottom, centred (or top
  // aligned) and squeezes the gaps when content is taller than the space.
  function flow(items, top, bottom, align = 'center') {
    const list = items.filter(Boolean);
    const gaps = list.slice(1).reduce((s, it) => s + it.gap, 0);
    const solid = list.reduce((s, it) => s + it.h, 0);
    const avail = bottom - top;
    const k = solid + gaps > avail ? Math.max(0.25, (avail - solid) / Math.max(1, gaps)) : 1;
    const total = solid + gaps * k;
    let y = align === 'top' ? top : top + Math.max(0, (avail - total) / 2);
    list.forEach((it, i) => { if (i) y += it.gap * k; it.draw(y); y += it.h; });
    return { overflow: total > avail + 1 };
  }

  /* ------------------------------------------------------------ brand mark */
  function mark(b, x, y, s, color, opt = {}) {
    const m = (b && b.mark) || { type: 'monogram' };
    const k = s / 48; const tx = x - s / 2; const ty = y - s / 2;
    const g = (inner, sw = 2.2, fill = 'none') => `<g transform="translate(${r2(tx)} ${r2(ty)}) scale(${r2(k, 4)})" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
    switch (m.type) {
      case 'meridian':
        return g(`<path d="M8 40V21a8 8 0 0 1 16 0v19M24 21a8 8 0 0 1 16 0v19"/><path d="M5 44h38" stroke-width="1.6"/><path d="M24 4.5l1.6 3.4 3.4 1.6-3.4 1.6L24 14.5l-1.6-3.4-3.4-1.6 3.4-1.6z" fill="${color}" stroke="none"/>`);
      case 'northwind':
        return g(`<path d="M7 40L20 8h8L15 40z" fill="${color}" stroke="none"/><path d="M22 40L35 8h8L30 40z" fill="${color}" stroke="none" opacity=".55"/>`);
      case 'verde':
        return g(`<path d="M11 42V22a13 13 0 0 1 26 0v20"/><path d="M24 37c-6.5-5-6.5-13.5 0-19.5 6.5 6 6.5 14.5 0 19.5z" fill="${color}" stroke="none"/><path d="M24 37v5M6 42.5h36" stroke-width="1.6"/>`);
      case 'image': {
        const pad = opt.tile ? s * 0.14 : 0;
        const tile = opt.tile ? `<rect x="${r2(tx - pad)}" y="${r2(ty - pad)}" width="${r2(s + pad * 2)}" height="${r2(s + pad * 2)}" rx="${r2(s * 0.22)}" fill="#FFFFFF"/>` : '';
        return `${tile}<image href="${esc(m.src)}" x="${r2(tx)}" y="${r2(ty)}" width="${r2(s)}" height="${r2(s)}" preserveAspectRatio="xMidYMid meet"/>`;
      }
      default: {
        const ini = initials(b.name).slice(0, 2) || 'A';
        const on = opt.on || (isLight(color) ? '#111111' : '#FFFFFF');
        const fs = ini.length > 1 ? s * 0.38 : s * 0.48;
        return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(s / 2)}" fill="${color}"/><text x="${r2(x)}" y="${r2(y + fs * 0.36)}" text-anchor="middle" font-family="${STACK[b.fonts.sans] || STACK['Inter Variable']}" font-size="${r2(fs)}" font-weight="650" fill="${on}" letter-spacing="${r2(fs * 0.02)}">${esc(ini)}</text>`;
      }
    }
  }

  /* ------------------------------------------------------------ shared pieces */
  function seal(c, x, y, r, o) {
    const { ring, disc, paper, b, orn, label, fontFamily } = o;
    const pid = `${c.id}-seal${Math.round(x)}`;
    let s = `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${paper}"/>`;
    if (orn >= 1) s += `<g transform="translate(${r2(x)} ${r2(y)})" fill="none" stroke="${ring}" stroke-width=".5"><path d="${ringPath(r * 0.5, r * 0.73, 22, 4)}"/></g>`;
    else s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.72)}" fill="none" stroke="${ring}" stroke-width=".7"/>`;
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="none" stroke="${ring}" stroke-width="1.1"/>`;
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.95)}" fill="none" stroke="${ring}" stroke-width=".45"/>`;
    // circular legend
    const tr = r * 0.835; const circ = 2 * Math.PI * tr;
    let fs = r * 0.13; const lo = { family: fontFamily, size: fs, weight: 600, ls: fs * 0.18 };
    const natural = tw(label, lo);
    if (natural > circ * 0.94) fs *= (circ * 0.94) / natural;
    c.defs.push(`<path id="${pid}" d="M${r2(x - tr)} ${r2(y)}a${r2(tr)} ${r2(tr)} 0 1 1 ${r2(tr * 2)} 0a${r2(tr)} ${r2(tr)} 0 1 1 ${r2(-tr * 2)} 0"/>`);
    s += `<text font-family="${STACK[fontFamily]}" font-size="${r2(fs)}" font-weight="600" fill="${ring}"><textPath href="#${pid}" textLength="${r2(circ * 0.985)}" lengthAdjust="spacing">${esc(label)}</textPath></text>`;
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.46)}" fill="${disc}"/>`;
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.41)}" fill="none" stroke="${paper}" stroke-opacity=".55" stroke-width=".6"/>`;
    s += mark(b, x, y, r * 0.44, paper, { on: disc, tile: b.mark && b.mark.type === 'image' });
    c.add(s);
  }

  function ribbons(c, x, y, r, fill, shade) {
    const w = r * 0.32; const len = r * 1.25;
    const tail = (dx, tilt) => {
      const x0 = x + dx; const y0 = y + r * 0.35; const x1 = x0 + tilt; const y1 = y0 + len;
      return `<path d="M${r2(x0 - w / 2)} ${r2(y0)}L${r2(x0 + w / 2)} ${r2(y0)}L${r2(x1 + w / 2)} ${r2(y1)}L${r2(x1)} ${r2(y1 - w * 0.55)}L${r2(x1 - w / 2)} ${r2(y1)}Z" fill="${fill}"/><path d="M${r2(x0)} ${r2(y0)}L${r2(x1)} ${r2(y1 - w * 0.55)}" stroke="${shade}" stroke-width=".8"/>`;
    };
    c.add(tail(-r * 0.3, -r * 0.22) + tail(r * 0.3, r * 0.22));
  }

  function signature(c, cx, base, d, f, col) {
    if (!d.signer) return;
    c.text(cx, base - 16, d.signer, { family: 'Mrs Saint Delafield', size: f.sigSize || 40, fill: col.sig, anchor: 'middle', noBox: true });
    c.add(`<path d="M${r2(cx - 104)} ${r2(base)}H${r2(cx + 104)}" stroke="${col.rule}" stroke-width=".7"/>`);
    c.text(cx, base + 21, upperName(d.signer), { family: f.sans, size: 11, weight: 600, ls: 1.8, fill: col.ink, anchor: 'middle', bg: col.paper });
    if (d.role) c.text(cx, base + 40, d.role, { family: f.serif, size: 14.5, italic: true, fill: col.muted, anchor: 'middle', bg: col.paper });
  }

  /* ------------------------------------------------------------ A · Heritage Elegance */
  function heritage(c, s, d, pu, T) {
    const b = s.brand; const orn = s.ornament; const el = s.elegance; const lay = s.layout % 3; const on = s.brandColors !== false;
    const base = '#FBF8F1';
    const paper = on && isLight(b.colors.paper) ? mix(base, b.colors.paper, 0.35) : base;
    const acc0 = on ? b.colors.accent : '#A88443';
    const prim = ensure(on ? b.colors.primary : '#24324A', paper, 4.6);
    const acc = ensure(acc0, paper, 2.4);
    const accText = ensure(acc0, paper, 4.6);
    const ink = ensure(on ? mix(b.colors.ink, prim, 0.2) : '#1C2331', paper, 11);
    const muted = ensure(mix(ink, paper, 0.42), paper, 4.6);
    const serif = b.fonts.serif; const sans = b.fonts.sans; const id = c.id;
    const col = { paper, ink, muted, rule: mix(ink, paper, 0.45), sig: mix(ink, prim, 0.35) };
    let gold = acc;
    if (el >= 2) {
      c.defs.push(`<linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(acc0, '#000', 0.22)}"/><stop offset=".45" stop-color="${mix(acc0, '#FFF', 0.4)}"/><stop offset=".62" stop-color="${acc0}"/><stop offset="1" stop-color="${mix(acc0, '#000', 0.3)}"/></linearGradient>`);
      gold = `url(#${id}-gold)`;
    }
    c.defs.push(`<radialGradient id="${id}-vig" cx=".5" cy=".46" r=".78"><stop offset=".62" stop-color="${paper}"/><stop offset="1" stop-color="${mix(paper, prim, 0.07)}"/></radialGradient>`);
    c.add(`<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/>`);
    if (orn >= 2) c.add(`<g transform="translate(${lay === 2 ? 420 : W / 2} ${H / 2 + 6})" opacity=".055" fill="none" stroke="${prim}" stroke-width=".7"><path d="${spiroPath(96, 56, 70, 2.05)}"/></g>`);

    // frame
    const corner = (x, y, dx, dy, size) => {
      const px = x + dx * size; const py = y + dy * size;
      return `<path d="M${r2(px)} ${r2(py - 4.5)}l4.5 4.5-4.5 4.5-4.5-4.5z" fill="${gold}"/><path d="M${r2(px + dx * 9)} ${r2(py)}h${r2(dx * 46)}M${r2(px)} ${r2(py + dy * 9)}v${r2(dy * 46)}" stroke="${acc}" stroke-width=".7"/>`;
    };
    if (orn >= 2) {
      c.add(`<rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${prim}" stroke-width="1.3"/><rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="${prim}" stroke-width=".8"/>`);
      c.add(`<path d="${waveBorder(31, 3.2, 21)}" fill="none" stroke="${acc}" stroke-width=".55"/>`);
      c.add(`<rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="${acc}" stroke-width=".5" stroke-opacity=".8"/>`);
      [[31, 31], [W - 31, 31], [W - 31, H - 31], [31, H - 31]].forEach(([x, y]) => {
        c.add(`<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="${paper}" stroke="${prim}" stroke-width=".8"/><path d="M${x} ${y - 5}l5 5-5 5-5-5z" fill="${gold}"/>`);
      });
      c.add(corner(46, 46, 1, 1, 12) + corner(W - 46, 46, -1, 1, 12) + corner(W - 46, H - 46, -1, -1, 12) + corner(46, H - 46, 1, -1, 12));
    } else if (orn === 1) {
      c.add(`<rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="none" stroke="${prim}" stroke-width="1.2"/><rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${acc}" stroke-width=".6"/>`);
      c.add(corner(34, 34, 1, 1, 14) + corner(W - 34, 34, -1, 1, 14) + corner(W - 34, H - 34, -1, -1, 14) + corner(34, H - 34, 1, -1, 14));
    } else {
      c.add(`<rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="${acc}" stroke-width=".9"/>`);
    }

    const centered = lay !== 2;
    const X = centered ? W / 2 : 122;
    const anchor = centered ? 'middle' : 'start';
    const maxW = centered ? 790 : 600;
    const orgUp = upperName(d.org);
    const sealLabel = `${orgUp}  •  ${upper(pu.seal, d.lang)}  •  ${d.year}  •  `;
    const sealOpt = { ring: on ? acc : '#A88443', disc: prim, paper, b, orn, label: sealLabel, fontFamily: sans };
    if (el >= 2) sealOpt.ring = mix(acc0, '#000', 0.12);

    // header
    let top;
    if (lay === 0) {
      c.add(mark(b, W / 2, 106, 50, prim, { tile: false }));
      c.text(W / 2, 170, orgUp, { ...layoutFor(orgUp, { family: sans, size: 12.5, weight: 600, ls: 5 }, 620), fill: prim, anchor: 'middle', field: 'issuer.name', bg: paper });
      top = 200;
    } else if (lay === 1) {
      seal(c, W / 2, 128, 56, sealOpt);
      c.text(W / 2, 214, orgUp, { ...layoutFor(orgUp, { family: sans, size: 12.5, weight: 600, ls: 5 }, 620), fill: prim, anchor: 'middle', field: 'issuer.name', bg: paper });
      top = 236;
    } else {
      c.add(mark(b, 142, 106, 44, prim));
      c.text(178, 111, orgUp, { ...layoutFor(orgUp, { family: sans, size: 12.5, weight: 600, ls: 4.6 }, 470), fill: prim, field: 'issuer.name', bg: paper });
      top = 176;
    }
    const bottom = lay === 0 ? 584 : lay === 1 ? 600 : 600;

    // content blocks
    const mainO = { family: serif, size: centered ? 36 : 34, weight: el >= 2 ? 400 : 500, ls: el >= 2 ? 15 : 12.5 };
    const main = c.fit('title.main', layoutText(upper(pu.main, d.lang), mainO, maxW - 200, { min: 22 }));
    const subO = { family: sans, size: 11.5, weight: 600, ls: 4.6 };
    const preO = { family: serif, size: 20, italic: true };
    const nameO = { family: serif, size: el >= 2 ? 82 : 76, weight: el >= 2 ? 400 : 500, italic: el >= 2 };
    const name = c.fit('recipient.name', layoutText(d.recipient, nameO, maxW, { min: 44, floor: 28, maxLines: 2, wrapBelow: 52 }));
    const lineO = { family: serif, size: 20, italic: true };
    const line = c.fit('purpose.line', layoutText(pu.line, lineO, maxW, { min: 15, maxLines: 2 }));
    const titleO = { family: serif, size: centered ? 32 : 30, weight: STATIC_400.has(serif) ? 400 : 600 };
    const title = c.fit('credential.title', layoutText(d.title, titleO, maxW - 40, { min: 20, floor: 15, maxLines: 2 }));
    let nameW = 0;
    const items = [
      { h: main.size * 0.74, gap: 0, draw: (y) => {
        const w = c.text(X, y + main.size * 0.74, main.lines[0], { ...mainO, size: main.size, fill: ink, anchor, bg: paper });
        if (orn >= 1) {
          const yy = y + main.size * 0.37;
          if (centered) c.add(`<path d="M${r2(X - w / 2 - 92)} ${r2(yy)}h64M${r2(X + w / 2 + 28)} ${r2(yy)}h64" stroke="${acc}" stroke-width=".8"/>`);
          else c.add(`<path d="M${r2(X + w + 26)} ${r2(yy)}H${r2(X + maxW - 40)}" stroke="${acc}" stroke-width=".8"/>`);
        }
      } },
      { h: subO.size * 0.74, gap: 14, draw: (y) => c.text(X, y + subO.size * 0.74, upper(pu.sub, d.lang), { ...subO, fill: accText, anchor, bg: paper }) },
      { h: preO.size * 0.74, gap: 34, draw: (y) => c.text(X, y + preO.size * 0.74, T.pre, { ...preO, fill: muted, anchor, bg: paper }) },
      { h: name.size * 0.74 + (name.lines.length - 1) * name.size * 1.04, gap: 26, draw: (y) => {
        name.lines.forEach((ln, i) => { nameW = Math.max(nameW, c.text(X, y + name.size * 0.74 + i * name.size * 1.04, ln, { ...nameO, size: name.size, fill: ink, anchor, field: 'recipient.name', bg: paper })); });
      } },
      { h: 8, gap: 22, draw: (y) => {
        const w = Math.min(maxW, Math.max(300, nameW + 70)); const yy = y + 4;
        if (centered) {
          c.add(`<path d="M${r2(X - w / 2)} ${r2(yy)}H${r2(X - 12)}M${r2(X + 12)} ${r2(yy)}H${r2(X + w / 2)}" stroke="${acc}" stroke-width=".8"/><path d="M${r2(X)} ${r2(yy - 4.5)}l4.5 4.5-4.5 4.5-4.5-4.5z" fill="${gold}"/>`);
        } else {
          c.add(`<path d="M${r2(X)} ${r2(yy - 4.5)}l4.5 4.5-4.5 4.5-4.5-4.5z" fill="${gold}"/><path d="M${r2(X + 14)} ${r2(yy)}H${r2(X + w)}" stroke="${acc}" stroke-width=".8"/>`);
        }
      } },
      { h: line.size * 0.74 + (line.lines.length - 1) * line.size * 1.2, gap: 28, draw: (y) => c.lines(X, y, line, { ...lineO, fill: muted, anchor, bg: paper }, 1.2) },
      { h: title.size * 0.74 + (title.lines.length - 1) * title.size * 1.14, gap: 18, draw: (y) => c.lines(X, y, title, { ...titleO, fill: prim, anchor, field: 'credential.title', bg: paper }, 1.14) },
      lay === 1 ? null : { h: 9, gap: 26, draw: (y) => c.text(X, y + 9, upper(d.date, d.lang), { family: sans, size: 11.5, weight: 600, ls: 3.2, fill: muted, anchor, field: 'issue.date', bg: paper }) },
    ];
    flow(items, top, bottom);

    // footer
    const sigs = d.showSignature;
    if (lay === 0) {
      if (sigs) { signature(c, 270, 652, d, { serif, sans }, col); signature(c, W - 270, 652, { ...d, signer: d.signer2, role: d.role2 }, { serif, sans }, col); }
      seal(c, W / 2, 650, 58, sealOpt);
    } else if (lay === 1) {
      if (sigs) { signature(c, 270, 664, d, { serif, sans }, col); signature(c, W - 270, 664, { ...d, signer: d.signer2, role: d.role2 }, { serif, sans }, col); }
      c.add(`<path d="M${W / 2} 632l4.5 4.5-4.5 4.5-4.5-4.5z" fill="${gold}"/>`);
      c.text(W / 2, 668, upper(d.date, d.lang), { family: sans, size: 12, weight: 600, ls: 3.2, fill: ink, anchor: 'middle', field: 'issue.date', bg: paper });
      c.text(W / 2, 690, T.dateOfIssue, { family: serif, size: 14.5, italic: true, fill: muted, anchor: 'middle', bg: paper });
    } else {
      if (orn >= 1) ribbons(c, W - 236, 318, 92, prim, mix(prim, '#000', 0.25));
      seal(c, W - 236, 318, 92, sealOpt);
      if (sigs) { signature(c, 236, 664, d, { serif, sans }, col); signature(c, 520, 664, { ...d, signer: d.signer2, role: d.role2 }, { serif, sans }, col); }
    }
    if (d.showVerification) {
      const v = `${upper(T.id, d.lang)}  ${d.id}  ·  ${upper(T.demo, d.lang)}`;
      if (lay === 2) {
        c.text(W - 236, 672, upper(T.id, d.lang), { family: sans, size: 9.5, weight: 600, ls: 2.4, fill: muted, anchor: 'middle', bg: paper });
        c.text(W - 236, 692, d.id, { family: serif, size: 17, fill: ink, anchor: 'middle', field: 'credential.id', bg: paper });
        c.text(W - 236, 710, T.demo, { family: serif, size: 13, italic: true, fill: muted, anchor: 'middle', bg: paper });
      } else {
        c.text(W / 2, lay === 1 ? 738 : 740, v, { family: sans, size: 9, weight: 600, ls: 2.2, fill: muted, anchor: 'middle', field: 'credential.id', bg: paper });
      }
    }
    return paper;
  }

  // Shrink a single-line label to fit (used for headers / small caps).
  function layoutFor(str, o, maxW) {
    const size = fitSize(str, o, maxW, o.size * 0.6);
    return { ...o, size };
  }

  /* ------------------------------------------------------------ B · Modern Editorial */
  function editorial(c, s, d, pu, T) {
    const b = s.brand; const orn = s.ornament; const el = s.elegance; const lay = s.layout % 3; const on = s.brandColors !== false;
    const paper = on && isLight(b.colors.paper) ? mix('#FCFBF8', b.colors.paper, 0.3) : '#F7F6F2';
    const P1 = on ? b.colors.primary : '#151515';
    const A1 = on ? b.colors.accent : '#E4572E';
    const ink = ensure(on ? b.colors.ink : '#111111', paper, 13);
    const muted = ensure(mix(ink, paper, 0.45), paper, 4.8);
    const kick = ensure(P1, paper, 4.6);
    const onP = isLight(P1) ? ensure('#111111', P1, 7) : ensure('#FFFFFF', P1, 4.6);
    const sans = b.fonts.sans; const accentSerif = 'Instrument Serif'; const id = c.id;
    const nameWeight = el >= 2 ? 380 : el === 1 ? 560 : 680;
    c.defs.push(`<clipPath id="${id}-page"><rect width="${W}" height="${H}"/></clipPath>`);
    c.add(`<rect width="${W}" height="${H}" fill="${paper}"/>`);
    const g = [];
    let x0; let maxW; let top; let metaY; let metaW; let nameColor = ink; let nameBg = paper;

    if (lay === 0) {
      g.push(`<circle cx="${W - 118}" cy="248" r="272" fill="${P1}"/>`);
      if (orn >= 2) g.push(`<circle cx="${W - 118}" cy="248" r="206" fill="none" stroke="${onP}" stroke-opacity=".22"/><circle cx="${W - 118}" cy="248" r="140" fill="none" stroke="${onP}" stroke-opacity=".16"/>`);
      if (orn >= 1) g.push(`<path d="M${W - 330} ${H}a150 150 0 0 1 300 0z" fill="${A1}"/>`);
      if (orn >= 1) g.push(`<path d="M${W - 372} 0V${H}" stroke="${ink}" stroke-opacity=".1"/>`);
      c.add(`<g clip-path="url(#${id}-page)">${g.join('')}</g>`);
      c.add(mark(b, W - 214, 176, 66, onP, { on: P1, tile: true }));
      x0 = 84; maxW = W - 372 - 84 - 46; top = 176; metaY = H - 168; metaW = maxW;
      c.add(mark(b, x0 + 15, 92, 30, kick, { tile: false }));
      c.text(x0 + 42, 98.5, d.org, { ...layoutFor(d.org, { family: sans, size: 17, weight: 600 }, maxW - 50), fill: ink, field: 'issuer.name', bg: paper });
    } else if (lay === 1) {
      const pw = 352;
      g.push(`<rect width="${pw}" height="${H}" fill="${P1}"/>`);
      const ini = (clean(d.recipient)[0] || 'A').toLocaleUpperCase(d.lang === 'tr' ? 'tr-TR' : 'en-US');
      if (orn >= 1) g.push(`<text x="${pw / 2}" y="${H - 70}" text-anchor="middle" font-family="${STACK[accentSerif]}" font-style="italic" font-size="600" fill="${onP}" fill-opacity=".1">${esc(ini)}</text>`);
      if (orn >= 2) g.push(`<circle cx="${pw / 2}" cy="${H / 2 + 30}" r="128" fill="none" stroke="${onP}" stroke-opacity=".2"/>`);
      if (orn >= 1) g.push(`<circle cx="${pw}" cy="164" r="44" fill="${A1}"/>`);
      c.add(`<g clip-path="url(#${id}-page)">${g.join('')}</g>`);
      c.add(mark(b, 80, 92, 32, onP, { on: P1, tile: true }));
      const orgL = layoutText(d.org, { family: sans, size: 15, weight: 600 }, pw - 150, { min: 11, maxLines: 2 });
      orgL.lines.forEach((ln, i) => c.text(112, 97.5 + i * 18 - (orgL.lines.length - 1) * 9, ln, { family: sans, size: orgL.size, weight: 600, fill: onP, field: 'issuer.name', bg: P1 }));
      const k = upper(pu.full, d.lang); const kl = layoutText(k, { family: sans, size: 11, weight: 600, ls: 3 }, pw - 120, { min: 8.5, maxLines: 2 });
      kl.lines.forEach((ln, i) => c.text(64, H - 132 + i * 19, ln, { family: sans, size: kl.size, weight: 600, ls: 3, fill: onP, bg: P1 }));
      c.text(64, H - 76, d.date, { family: sans, size: 15, weight: 500, fill: onP, opacity: 0.85, field: 'issue.date', bg: P1, cc: mix(onP, P1, 0.15) });
      x0 = pw + 72; maxW = W - x0 - 84; top = 150; metaY = H - 168; metaW = maxW;
    } else {
      const bandH = 318;
      g.push(`<rect width="${W}" height="${bandH}" fill="${P1}"/>`);
      if (orn >= 1) g.push(`<circle cx="${W}" cy="0" r="236" fill="${A1}"/>`);
      if (orn >= 2) g.push(`<circle cx="${W}" cy="0" r="300" fill="none" stroke="${onP}" stroke-opacity=".22"/><circle cx="${W}" cy="0" r="364" fill="none" stroke="${onP}" stroke-opacity=".14"/>`);
      c.add(`<g clip-path="url(#${id}-page)">${g.join('')}</g>`);
      c.add(mark(b, 99, 88, 30, onP, { on: P1, tile: true }));
      c.text(126, 94.5, d.org, { ...layoutFor(d.org, { family: sans, size: 17, weight: 600 }, 560), fill: onP, field: 'issuer.name', bg: P1 });
      x0 = 84; maxW = W - 168; top = bandH + 52; metaY = H - 150; metaW = W - 168;
      nameColor = onP; nameBg = P1;
    }

    // recipient name: huge, tight, two lines when that makes it bigger
    const nameO = { family: sans, size: lay === 2 ? 104 : 112, weight: nameWeight, lsEm: el >= 2 ? -0.01 : -0.035 };
    const nameMax = lay === 2 ? W - 84 - 300 : maxW;
    const name = c.fit('recipient.name', layoutText(d.recipient, nameO, nameMax, { min: 46, floor: 30, maxLines: 2, prefer2: lay !== 2 }));
    const lineO = { family: sans, size: 15.5, weight: 400 };
    const line = c.fit('purpose.line', layoutText(pu.line, lineO, maxW, { min: 12, maxLines: 2 }));
    const titleO = { family: accentSerif, size: 44, italic: true };
    const title = c.fit('credential.title', layoutText(d.title, titleO, maxW - 20, { min: 26, floor: 18, maxLines: 2 }));
    const kickO = { family: sans, size: 12, weight: 600, ls: 3.2 };
    const lh = 0.94;

    if (lay === 2) {
      // name sits on the colour band
      const capH = name.size * 0.72; const nl = name.lines.length;
      const firstBase = 318 - 44 - (nl - 1) * name.size * lh;
      name.lines.forEach((ln, i) => c.text(x0, Math.max(150 + capH, firstBase) + i * name.size * lh, ln, { ...nameO, size: name.size, fill: nameColor, field: 'recipient.name', bg: nameBg }));
      flow([
        { h: 9, gap: 0, draw: (y) => { c.add(`<rect x="${x0}" y="${r2(y + 1)}" width="28" height="3" fill="${A1}"/>`); c.text(x0 + 42, y + 9, upper(pu.full, d.lang), { ...kickO, fill: kick, bg: paper }); } },
        { h: line.size * 0.74 + (line.lines.length - 1) * line.size * 1.3, gap: 30, draw: (y) => c.lines(x0, y, line, { ...lineO, fill: muted, bg: paper }, 1.3) },
        { h: title.size * 0.74 + (title.lines.length - 1) * title.size * 1.04, gap: 16, draw: (y) => c.lines(x0, y, title, { ...titleO, fill: ink, field: 'credential.title', bg: paper }, 1.04) },
      ], top, metaY - 36, 'center');
    } else {
      flow([
        lay === 0 ? { h: 9, gap: 0, draw: (y) => { c.add(`<rect x="${x0}" y="${r2(y + 1)}" width="28" height="3" fill="${A1}"/>`); c.text(x0 + 42, y + 9, upper(pu.full, d.lang), { ...kickO, fill: kick, bg: paper }); } } : null,
        { h: name.size * 0.72 + (name.lines.length - 1) * name.size * lh, gap: lay === 0 ? 44 : 0, draw: (y) => {
          name.lines.forEach((ln, i) => c.text(x0 - name.size * 0.04, y + name.size * 0.72 + i * name.size * lh, ln, { ...nameO, size: name.size, fill: nameColor, field: 'recipient.name', bg: nameBg }));
        } },
        { h: 2, gap: 38, draw: (y) => c.add(`<path d="M${x0} ${r2(y + 1)}h44" stroke="${ink}" stroke-width="1.6"/>`) },
        { h: line.size * 0.74 + (line.lines.length - 1) * line.size * 1.3, gap: 24, draw: (y) => c.lines(x0, y, line, { ...lineO, fill: muted, bg: paper }, 1.3) },
        { h: title.size * 0.74 + (title.lines.length - 1) * title.size * 1.04, gap: 14, draw: (y) => c.lines(x0, y, title, { ...titleO, fill: ink, field: 'credential.title', bg: paper }, 1.04) },
      ], top, metaY - 34, 'top');
    }

    // meta row
    c.add(`<path d="M${x0} ${metaY}H${x0 + metaW}" stroke="${ink}" stroke-opacity=".16"/>`);
    const cols = [];
    if (lay !== 1) cols.push({ label: T.issuedBy, value: d.org, field: 'issuer.name' });
    if (lay !== 1) cols.push({ label: T.date, value: d.date, field: 'issue.date' });
    if (lay === 1) cols.push({ label: T.issuedBy, value: d.org, field: 'issuer.name' });
    if (d.showSignature && d.signer) cols.push({ label: T.signature, sig: true });
    if (lay === 2 && d.showVerification) cols.push({ label: `${T.id} · ${T.demoShort}`, value: d.id, field: 'credential.id', mono: true });
    const cw = Math.min(250, metaW / Math.max(3, cols.length));
    cols.forEach((col, i) => {
      const x = x0 + i * cw; const lab = upper(col.label, d.lang);
      c.text(x, metaY + 30, lab, { family: sans, size: 10, weight: 600, ls: 2, fill: muted, bg: paper });
      if (col.sig) {
        c.text(x - 2, metaY + 70, d.signer, { family: 'Mrs Saint Delafield', size: 36, fill: mix(ink, P1, 0.3), noBox: true });
        c.text(x, metaY + 96, `${d.signer}${d.role ? ', ' + d.role : ''}`, { ...layoutFor(`${d.signer}${d.role ? ', ' + d.role : ''}`, { family: sans, size: 11.5 }, cw - 16), fill: muted, bg: paper });
      } else {
        const lt = layoutText(col.value, { family: col.mono ? 'JetBrains Mono Variable' : sans, size: col.mono ? 13.5 : 16, weight: col.mono ? 500 : 520 }, cw - 18, { min: 11, maxLines: 2 });
        lt.lines.forEach((ln, j) => c.text(x, metaY + 58 + j * (lt.size * 1.25), ln, { family: col.mono ? 'JetBrains Mono Variable' : sans, size: lt.size, weight: col.mono ? 500 : 520, fill: ink, field: col.field, bg: paper }));
      }
    });
    if (d.showVerification && lay !== 2) {
      c.text(x0, H - 44, `${upper(T.id, d.lang)} ${d.id} — ${T.demo}`, { family: 'JetBrains Mono Variable', size: 10, weight: 500, ls: 0.4, fill: muted, field: 'credential.id', bg: paper });
    }
    return paper;
  }

  /* ------------------------------------------------------------ C · Future Minimal */
  function future(c, s, d, pu, T) {
    const b = s.brand; const orn = s.ornament; const el = s.elegance; const lay = s.layout % 3; const on = s.brandColors !== false;
    const light = lay === 2;
    const P1 = on ? b.colors.primary : '#7D8797';
    const A1 = on ? b.colors.accent : '#C6CED9';
    const bg = light ? '#F4F5F7' : mix(P1, '#05070A', 0.9);
    const bg2 = light ? '#FFFFFF' : mix(bg, '#FFFFFF', 0.05);
    const text = light ? '#0D1117' : '#F3F5F9';
    const muted = ensure(mix(text, bg, 0.48), bg, 4.6);
    const faint = mix(text, bg, 0.84);
    const g1 = ensure(light ? P1 : mix(P1, '#FFFFFF', 0.25), bg, 4.6);
    const g2 = ensure(light ? A1 : mix(A1, '#FFFFFF', 0.1), bg, 4.6);
    const sans = b.fonts.sans; const mono = 'JetBrains Mono Variable'; const id = c.id;
    const thin = el >= 2 ? 1.1 : el === 1 ? 1.6 : 2.4;
    const nameWeight = el >= 2 ? 320 : el === 1 ? 460 : 600;
    c.defs.push(`<linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient>`);
    c.add(`<rect width="${W}" height="${H}" fill="${bg}"/>`);

    const oc = lay === 1 ? { x: W / 2, y: -360, r: 580 } : { x: W - 238, y: 330, r: 196 };
    if (!light && orn >= 1) {
      c.defs.push(`<radialGradient id="${id}-halo" cx="${r2(oc.x / W)}" cy="${r2(Math.max(0, oc.y) / H)}" r=".55"><stop offset="0" stop-color="${P1}" stop-opacity=".2"/><stop offset="1" stop-color="${P1}" stop-opacity="0"/></radialGradient>`);
      c.add(`<rect width="${W}" height="${H}" fill="url(#${id}-halo)"/>`);
    }
    if (orn >= 1) {
      if (light) {
        c.defs.push(`<pattern id="${id}-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${text}" stroke-opacity=".06"/></pattern>`);
        c.add(`<rect width="${W}" height="${H}" fill="url(#${id}-grid)"/>`);
      } else {
        c.defs.push(`<pattern id="${id}-dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r=".9" fill="${text}" fill-opacity=".14"/></pattern>`);
        c.defs.push(`<linearGradient id="${id}-fade" x1="0" x2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".9" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="${id}-m"><rect width="${W}" height="${H}" fill="url(#${id}-fade)"/></mask>`);
        c.add(`<rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-m)"/>`);
      }
    }
    if (light) c.add(`<rect width="10" height="${H}" fill="url(#${id}-g)"/>`);

    // orbit / arc system
    const circ = 2 * Math.PI * oc.r; const frac = { course: 1, achievement: 0.86, recognition: 0.74, event: 0.62 }[s.purpose] || 1;
    let og = `<g transform="translate(${r2(oc.x)} ${r2(oc.y)})" fill="none">`;
    og += `<circle r="${oc.r}" stroke="${text}" stroke-opacity=".12" stroke-width="1"/>`;
    og += `<circle r="${oc.r}" stroke="url(#${id}-g)" stroke-width="${thin}" stroke-linecap="round" stroke-dasharray="${r2(circ * frac * 0.92)} ${r2(circ)}" transform="rotate(${lay === 1 ? 40 : -90})"/>`;
    if (orn >= 1) og += `<path d="${ticksPath(oc.r + 16, oc.r + 22, lay === 1 ? 240 : 96, 8, 7)}" stroke="${text}" stroke-opacity=".26" stroke-width=".8"/>`;
    if (orn >= 1 && lay !== 1) og += `<circle r="${oc.r * 0.74}" stroke="${text}" stroke-opacity=".14" stroke-dasharray="2 7"/>`;
    if (orn >= 2 && lay !== 1) og += `<circle r="${oc.r * 0.52}" stroke="${text}" stroke-opacity=".1"/><circle cx="${r2(oc.r * Math.cos(-0.6))}" cy="${r2(oc.r * Math.sin(-0.6))}" r="4" fill="${g2}"/><circle cx="${r2(oc.r * 0.74 * Math.cos(2.3))}" cy="${r2(oc.r * 0.74 * Math.sin(2.3))}" r="3" fill="${g1}"/>`;
    og += '</g>';
    c.add(og);

    // minimal badge
    const bx = lay === 1 ? W / 2 : oc.x; const by = lay === 1 ? oc.y + oc.r : oc.y; const br = lay === 1 ? 46 : 60;
    const hex = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 2; return `${r2(bx + br * Math.cos(a))} ${r2(by + br * Math.sin(a))}`; }).join('L');
    c.add(`<path d="M${hex}Z" fill="${bg2}" stroke="url(#${id}-g)" stroke-width="${Math.max(1.2, thin)}" stroke-linejoin="round"/>`);
    c.add(mark(b, bx, by, br * 0.8, text, { on: bg2, tile: true }));
    if (lay !== 1) c.text(bx, by + br + 34, upper(pu.seal, d.lang), { family: mono, size: 10.5, weight: 500, ls: 3, fill: muted, anchor: 'middle', bg });

    // header
    c.add(mark(b, 98, 92, 28, text, { on: bg, tile: true }));
    c.text(126, 97.5, d.org, { ...layoutFor(d.org, { family: sans, size: 16, weight: 600 }, lay === 1 ? 300 : 440), fill: text, field: 'issuer.name', bg });
    const ym = (d.iso || '').slice(0, 7).replace('-', '.');
    if (lay !== 1) c.text(W - 84, 97, `${upper(T.cert, d.lang)} · ${ym}`, { family: mono, size: 11, weight: 500, ls: 2, fill: muted, anchor: 'end', bg });

    // content
    const centered = lay === 1;
    const x0 = centered ? W / 2 : 84; const anchor = centered ? 'middle' : 'start';
    const maxW = centered ? 820 : oc.x - oc.r - 22 - 84 - 30;
    const kickO = { family: mono, size: 12, weight: 500, ls: 2 };
    const nameO = { family: sans, size: 86, weight: nameWeight, lsEm: -0.025 };
    const name = c.fit('recipient.name', layoutText(d.recipient, nameO, maxW, { min: 42, floor: 28, maxLines: 2, wrapBelow: 60 }));
    const lineO = { family: sans, size: 15.5 };
    const line = c.fit('purpose.line', layoutText(pu.line, lineO, maxW, { min: 12, maxLines: 2 }));
    const titleO = { family: sans, size: 32, weight: 600, lsEm: -0.01 };
    const title = c.fit('credential.title', layoutText(d.title, titleO, maxW, { min: 20, floor: 15, maxLines: 2 }));
    const tW = Math.max(...title.lines.map((l) => tw(l, { ...titleO, size: title.size })));
    c.defs.push(`<linearGradient id="${id}-gt" gradientUnits="userSpaceOnUse" x1="${r2(centered ? x0 - tW / 2 : x0)}" y1="0" x2="${r2(centered ? x0 + tW / 2 : x0 + tW)}" y2="0"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient>`);
    const dataY = H - 166;
    flow([
      { h: 9, gap: 0, draw: (y) => c.text(x0, y + 9, `// ${upper(pu.full, d.lang)}`, { ...kickO, fill: g2, anchor, bg }) },
      { h: name.size * 0.72 + (name.lines.length - 1) * name.size * 1.0, gap: 34, draw: (y) => name.lines.forEach((ln, i) => c.text(x0, y + name.size * 0.72 + i * name.size, ln, { ...nameO, size: name.size, fill: text, anchor, field: 'recipient.name', bg })) },
      { h: line.size * 0.74 + (line.lines.length - 1) * line.size * 1.3, gap: 30, draw: (y) => c.lines(x0, y, line, { ...lineO, fill: muted, anchor, bg }, 1.3) },
      { h: title.size * 0.74 + (title.lines.length - 1) * title.size * 1.12, gap: 14, draw: (y) => c.lines(x0, y, title, { ...titleO, fill: `url(#${id}-gt)`, cc: contrast(g1, bg) < contrast(g2, bg) ? g1 : g2, anchor, field: 'credential.title', bg }, 1.12) },
    ], centered ? 300 : 196, dataY - 40, centered ? 'center' : 'center');

    // data row
    const qr = d.showVerification;
    const rowEnd = qr ? W - 84 - 112 : W - 84;
    c.add(`<path d="M84 ${dataY}H${W - 84}" stroke="${text}" stroke-opacity=".14"/>`);
    const cols = [{ label: T.issuedBy, value: d.org, field: 'issuer.name' }, { label: T.date, value: d.date, field: 'issue.date' }];
    if (qr) cols.push({ label: `${T.id} · ${T.demoShort}`, value: d.id, field: 'credential.id', mono: true });
    if (d.showSignature && d.signer) cols.push({ label: T.authorized, value: d.signer, sub: d.role });
    const cw = (rowEnd - 84) / cols.length;
    cols.forEach((col, i) => {
      const x = 84 + i * cw;
      c.text(x, dataY + 32, upper(col.label, d.lang), { ...layoutFor(upper(col.label, d.lang), { family: mono, size: 10, weight: 500, ls: 1.6 }, cw - 16), fill: muted, bg });
      const vo = { family: col.mono ? mono : sans, size: col.mono ? 14 : 16, weight: col.mono ? 500 : 520 };
      const lt = layoutText(col.value, vo, cw - 18, { min: 11, maxLines: 2 });
      lt.lines.forEach((ln, j) => c.text(x, dataY + 60 + j * lt.size * 1.25, ln, { ...vo, size: lt.size, fill: text, field: col.field, bg }));
      if (col.sub && lt.lines.length === 1) c.text(x, dataY + 82, col.sub, { ...layoutFor(col.sub, { family: sans, size: 12 }, cw - 18), fill: muted, bg });
    });
    if (qr) {
      const qs = 82; const qx = W - 84 - qs; const qy = dataY + 16;
      c.add(`<rect x="${qx - 8}" y="${qy - 8}" width="${qs + 16}" height="${qs + 16}" rx="6" fill="${light ? '#FFFFFF' : bg2}" stroke="${text}" stroke-opacity=".14"/>`);
      c.add(`<g transform="translate(${qx} ${qy})" fill="${text}" fill-opacity=".82"><path d="${demoQr(d.id, qs)}"/></g>`);
      c.add(`<rect x="${qx + qs / 2 - 22}" y="${qy + qs / 2 - 9}" width="44" height="18" rx="3" fill="${g2}"/>`);
      c.text(qx + qs / 2, qy + qs / 2 + 4, 'DEMO', { family: mono, size: 10, weight: 700, ls: 1.4, fill: isLight(g2) ? '#0B0F14' : '#FFFFFF', anchor: 'middle', noBox: true });
      c.text(W - 84, qy + qs + 21, upper(T.demoQr, d.lang), { family: mono, size: 8.5, weight: 500, ls: 1.2, fill: muted, anchor: 'end', bg });
    }
    return bg;
  }

  /* ------------------------------------------------------------ public API */
  const RENDERERS = { heritage, editorial, future };

  function model(spec) {
    const lang = spec.lang === 'tr' ? 'tr' : 'en';
    const T = COPY[lang]; const pu = T.p[spec.purpose] || T.p.course; const dd = spec.data || {};
    const iso = dd.date || '2026-11-16';
    let date = iso;
    try { date = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`)); } catch (e) { /* keep ISO */ }
    const org = clean(dd.organization) || spec.brand.name || 'Organization';
    const recipient = clean(dd.recipient) || (lang === 'tr' ? 'Alıcı Adı' : 'Recipient Name');
    const title = clean(dd.title) || (lang === 'tr' ? 'Program adı' : 'Program title');
    const id = `${(initials(org) || 'ID').slice(0, 3)}-${iso.replace(/-/g, '').slice(2, 6)}-${hash(recipient + title + org).toString(36).toUpperCase().slice(-4).padStart(4, '0')}`;
    return {
      T, pu, d: {
        lang, iso, date, year: iso.slice(0, 4), org, recipient, title, id,
        signer: clean(dd.signer), role: clean(dd.role), signer2: clean(dd.signer2), role2: clean(dd.role2),
        showSignature: dd.showSignature !== false, showVerification: dd.showVerification !== false,
      },
    };
  }

  function render(spec, opt = {}) {
    const c = context(spec);
    const { T, pu, d } = model(spec);
    const fn = RENDERERS[spec.design] || heritage;
    const bg = fn(c, spec, d, pu, T);
    const label = `${DESIGNS[spec.design] ? DESIGNS[spec.design].name : 'Certificate'}: ${pu.full}, ${d.recipient}, ${d.title}, ${d.org}, ${d.date}`;
    const style = opt.standalone ? `<style>${fontImports(spec)}</style>` : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${opt.standalone ? W : '100%'}" ${opt.standalone ? `height="${H}"` : ''} role="img" aria-label="${esc(label)}" class="cert-svg" data-design="${spec.design}">${style}<title>${esc(label)}</title><defs>${c.defs.join('')}</defs>${c.body.join('')}</svg>`;
    return { svg, report: report(c, bg), model: d };
  }

  function report(c) {
    const fits = c.fits; const trunc = fits.filter((f) => f.truncated); const shrunk = fits.filter((f) => f.shrunk && !f.truncated);
    const pairs = c.pairs; const minRatio = pairs.length ? Math.min(...pairs.map((p) => p.ratio)) : 21;
    const failing = pairs.filter((p) => p.ratio < (p.large ? 3 : 4.5));
    const outside = c.boxes.filter((bx) => bx.x < SAFE - 0.5 || bx.y < SAFE - 0.5 || bx.x + bx.w > W - SAFE + 0.5 || bx.y + bx.h > H - SAFE + 0.5);
    return {
      fit: { ok: trunc.length === 0, shrunk: shrunk.map((f) => f.field), truncated: trunc.map((f) => f.field), wrapped: fits.filter((f) => f.lines > 1).map((f) => f.field) },
      contrast: { ok: failing.length === 0, min: r2(minRatio, 1), failing: failing.map((p) => p.label) },
      safe: { ok: outside.length === 0, outside: outside.map((bx) => bx.label), margin: SAFE },
      fields: [...c.fields],
      boxes: c.boxes.filter((bx) => /\./.test(bx.label)).reduce((acc, bx) => {
        const a = acc[bx.label];
        if (!a) acc[bx.label] = { x: bx.x, y: bx.y, w: bx.w, h: bx.h };
        else { const x2 = Math.max(a.x + a.w, bx.x + bx.w); const y2 = Math.max(a.y + a.h, bx.y + bx.h); a.x = Math.min(a.x, bx.x); a.y = Math.min(a.y, bx.y); a.w = x2 - a.x; a.h = y2 - a.y; }
        return acc;
      }, {}),
    };
  }

  function fontsFor(brand) {
    return [...new Set([brand.fonts.serif, brand.fonts.sans, 'Instrument Serif', 'JetBrains Mono Variable', 'Mrs Saint Delafield'])];
  }
  function fontImports(spec) {
    return fontsFor(spec.brand).flatMap((f) => FONT_CSS[f] || []).map((u) => `@import url('${CDN}${u}');`).join('');
  }
  // Ask the browser to fetch the faces (incl. Turkish glyphs) before measuring.
  function loadFonts(brand) {
    if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
    const sample = 'AaBbÇçĞğİıÖöŞşÜü 0123';
    const jobs = [];
    fontsFor(brand).forEach((f) => {
      jobs.push(document.fonts.load(`400 40px ${STACK[f]}`, sample));
      jobs.push(document.fonts.load(`600 40px ${STACK[f]}`, sample));
      if (/Cormorant|Fraunces|Instrument Serif/.test(f)) jobs.push(document.fonts.load(`italic 400 40px ${STACK[f]}`, sample));
    });
    return Promise.all(jobs).catch(() => {});
  }

  function brandFromPreset(key) {
    const p = PRESETS[key];
    const pr = PAIRINGS[p.pairing];
    return { ...JSON.parse(JSON.stringify(p)), fonts: { serif: pr.serif, sans: pr.sans }, source: 'preset' };
  }

  // A starting palette for a domain we could not read: derived from its name.
  function paletteFromName(name) {
    const h = hash(name); const hue = h % 360;
    return { primary: fromHsl(hue, 0.46, 0.26), accent: fromHsl((hue + 28 + (h % 30)) % 360, 0.5, 0.56), paper: '#FAF9F6', ink: '#14161B' };
  }

  global.CertKit = {
    W, H, PRESETS, PAIRINGS, DESIGNS, STYLES, COPY,
    render, fontsFor, loadFonts, brandFromPreset, paletteFromName,
    markSvg: (b, color) => `<svg viewBox="0 0 48 48" aria-hidden="true">${mark(b, 24, 24, 40, color, { on: '#FFFFFF' })}</svg>`,
    color: { mix, contrast, ensure, isLight, lum, toHsl, hexToRgb, rgbToHex }, util: { hash, initials, clean },
  };
})(window);
