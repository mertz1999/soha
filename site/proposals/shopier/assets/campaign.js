/* Shopier proposal · campaign layouts
   Three creative directions (Fashion Editorial, Bold Social, Minimal Luxury), each with its own composition
   for four formats: post 1:1, story 9:16, store banner 16:9 and portrait ad 4:5. Text is real SVG <text>,
   so every word stays editable; the product image is placed separately from the artwork.
   render(spec) returns an SVG string; toPng(svg) rasterises it with the fonts and images embedded.
   The page language comes from <html lang>. */
(function (g) {
  'use strict';
  const LANG = (document.documentElement.lang || 'en').slice(0, 2) === 'tr' ? 'tr' : 'en';
  const L = (tr, en) => (LANG === 'tr' ? tr : en);
  const f1 = (n) => Math.round(n * 10) / 10;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const up = (s) => String(s).toLocaleUpperCase(LANG === 'tr' ? 'tr-TR' : 'en-US');
  // Brand names keep their own spelling: Turkish casing only when the name itself has Turkish letters.
  const upName = (s) => String(s).toLocaleUpperCase(/[çğıöşüÇĞİÖŞÜ]/.test(s) ? 'tr-TR' : 'en-US');

  const FORMATS = {
    post: { w: 1080, h: 1080, name: L('Instagram gönderisi', 'Instagram post'), ratio: '1:1' },
    story: { w: 1080, h: 1920, name: L('Instagram hikâyesi', 'Instagram story'), ratio: '9:16' },
    banner: { w: 1920, h: 1080, name: L('Mağaza bannerı', 'Store banner'), ratio: '16:9' },
    portrait: { w: 1080, h: 1350, name: L('Dikey reklam', 'Portrait ad'), ratio: '4:5' },
  };
  const DIRECTIONS = {
    editorial: { name: L('Moda Editoryal', 'Fashion Editorial') },
    bold: { name: L('Cesur Sosyal', 'Bold Social') },
    minimal: { name: L('Minimal Lüks', 'Minimal Luxury') },
  };
  const PALETTES = [
    { id: 'sand', name: L('Kum', 'Sand'), bg: '#F1E9DE', ink: '#2A2119', accent: '#E9C46A', strong: '#B5763E' },
    { id: 'night', name: L('Gece', 'Night'), bg: '#F3F0EA', ink: '#0B0F34', accent: '#C9A35A', strong: '#0B0F34' },
    { id: 'violet', name: 'Shopier', bg: '#F4F0FF', ink: '#0B0F34', accent: '#14F7C4', strong: '#6700FF' },
    { id: 'terra', name: L('Kiremit', 'Terracotta'), bg: '#F6EDE6', ink: '#3A1D12', accent: '#F2C14E', strong: '#B4532F' },
  ];

  /* ---------------------------------------------------------------- colour */
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const toHex = (r) => `#${r.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const lum = (h) => { const [r, gg, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * gg + 0.0722 * b; };
  const on = (h, ink = '#0B0F34') => (lum(h) > 0.42 ? ink : '#FFFFFF');

  /* ---------------------------------------------------------------- type */
  const FONTS = { serif: 'Bodoni Moda Variable', sans: 'Plus Jakarta Sans Variable', ital: 'Instrument Serif' };
  const cv = document.createElement('canvas').getContext('2d');
  const font = (o, size) => `${o.style || 'normal'} ${o.weight || 400} ${size}px "${o.font}"`;
  const width = (str, o, size) => { cv.font = font(o, size); return cv.measureText(str).width + (o.ls || 0) * size * Math.max(0, [...str].length - 1); };
  const prep = (str, o) => (o.upper === 'name' ? upName(str) : o.upper ? up(str) : String(str));
  // Greedy word wrap at the largest size (down to o.min) that fits maxLines lines of maxW.
  function wrap(str, o, maxW, maxLines) {
    const words = prep(str, o).split(/\s+/).filter(Boolean); if (!words.length) return { lines: [], size: o.size };
    for (let size = o.size; ; size = Math.max(o.min || 10, size * 0.94)) {
      const lines = []; let cur = '';
      words.forEach((w) => { const t = cur ? `${cur} ${w}` : w; if (!cur || width(t, o, size) <= maxW) cur = t; else { lines.push(cur); cur = w; } });
      lines.push(cur);
      const widest = Math.max(...lines.map((l) => width(l, o, size)));
      if ((lines.length <= maxLines && widest <= maxW) || size <= (o.min || 10)) return { lines, size: f1(size) };
    }
  }
  const fit = (str, o, maxW) => { const s = prep(str, o); const w = width(s, o, o.size); return w > maxW ? Math.max(o.min || 8, f1((o.size * maxW) / w)) : o.size; };
  function T(str, x, y, o) {
    const s = prep(str, o); if (!s) return '';
    const size = o.fitW ? fit(str, o, o.fitW) : o.size;
    const anchor = o.anchor || 'start';
    const ls = o.ls ? ` letter-spacing="${f1(o.ls * size)}"` : '';
    const dx = o.ls && anchor === 'middle' ? f1((o.ls * size) / 2) : o.ls && anchor === 'end' ? f1(o.ls * size) : 0;
    return `<text x="${f1(x + dx)}" y="${f1(y)}" font-family="'${o.font}'" font-size="${size}" font-weight="${o.weight || 400}" font-style="${o.style || 'normal'}" fill="${o.fill}" text-anchor="${anchor}"${ls}${o.op != null ? ` fill-opacity="${o.op}"` : ''}${o.field ? ` data-field="${o.field}"` : ''}>${esc(s)}</text>`;
  }
  // Several lines; y is the first baseline. Returns { svg, end } where end is the last baseline.
  function TL(lines, x, y, lh, o) { let s = ''; lines.forEach((l, i) => { s += T(l, x, y + i * lh, { ...o, upper: false }); }); return { svg: s, end: y + (lines.length - 1) * lh }; }

  /* ---------------------------------------------------------------- shared pieces */
  const disc = (n) => (n ? L(`%${n}`, `${n}%`) : '');
  const discWord = () => L('İNDİRİM', 'OFF');
  const RATIO = { bag: 1.03, earrings: 1.07, serum: 0.41 }; // illustrated cut-out width / height (photos pass their own as img.ratio)
  // The product cutout in a box whose bottom centre is (cx, by). The image keeps its own proportions.
  function product(c, cx, by, h, opt = {}) {
    const w = h * 2.2; const pw = Math.min(w, h * (c.img.ratio || RATIO[c.kind] || 1));
    const sh = opt.shadow === false ? '' : `<ellipse cx="${f1(cx)}" cy="${f1(by + h * 0.012)}" rx="${f1(pw * 0.5)}" ry="${f1(Math.max(6, h * 0.035))}" fill="${opt.shadowCol || '#000'}" opacity="${opt.shadowOp || 0.28}" filter="url(#${c.u}soft)"/>`;
    return `${sh}<image href="${c.img.cut}" x="${f1(cx - w / 2)}" y="${f1(by - h)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="xMidYMax meet" data-field="product"/>`;
  }
  // `ad` picks the version of the scene with the product raised above a bottom headline, when there is one.
  const scene = (c, x, y, w, h, align = 'xMidYMid', ad = false) => `<image href="${(ad && c.img.sceneAd) || c.img.scene}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${align} slice" data-field="product"/>`;
  // Brand: the uploaded logo if there is one, otherwise the brand name set in type.
  function brand(c, x, y, o, boxH) {
    if (c.s.logo) {
      const h = boxH || o.size * 1.3; const w = h * 4; const ax = o.anchor === 'middle' ? x - w / 2 : o.anchor === 'end' ? x - w : x;
      const pa = o.anchor === 'middle' ? 'xMidYMid' : o.anchor === 'end' ? 'xMaxYMid' : 'xMinYMid';
      return `<image href="${c.s.logo}" x="${f1(ax)}" y="${f1(y - h * 0.82)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="${pa} meet" data-field="brand"/>`;
    }
    return T(c.s.brand, x, y, { ...o, upper: o.upper ? 'name' : false, field: 'brand' });
  }
  const pill = (x, y, w, h, fill, stroke) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ''}/>`;
  function ctaPill(c, cx, cy, size, fill, color, outline) {
    const o = { font: FONTS.sans, size, weight: 700, ls: 0.06, upper: true, fill: color, anchor: 'middle', field: 'cta' };
    const w = width(up(c.s.cta), o, size) + size * 2.6; const h = size * 2.5;
    return pill(cx - w / 2, cy - h / 2, w, h, outline ? 'none' : fill, outline ? color : null) + T(c.s.cta, cx, cy + size * 0.36, o);
  }

  /* ---------------------------------------------------------------- A · Fashion Editorial
     A magazine cover: the product photographed in a real scene, a masthead set in a high-contrast serif,
     an italic headline and very few, small details. */
  function editorial(c) {
    const { W, H, P, s } = c; const fmt = c.format;
    const serif = { font: FONTS.serif, weight: 500 }; const sans = { font: FONTS.sans };
    const mast = (x, y, maxW, size, fill, anchor = 'middle') => brand(c, x, y, { ...serif, size, fitW: maxW, upper: true, ls: 0.06, fill, anchor, weight: 500 }, size * 0.9);
    const scrim = (id, y0, y1, a0, a1) => `<linearGradient id="${c.u}${id}" x1="0" y1="${y0}" x2="0" y2="${y1}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#140D08" stop-opacity="${a0}"/><stop offset="1" stop-color="#140D08" stop-opacity="${a1}"/></linearGradient>`;
    let defs = ''; let b = '';
    const d = disc(s.discount);
    if (fmt === 'post' || fmt === 'portrait') {
      defs += scrim('st', 0, H * 0.34, 0.55, 0) + scrim('sb', H * 0.5, H, 0, 0.68);
      b += scene(c, 0, 0, W, H, 'xMidYMid', true) + `<rect width="${W}" height="${H}" fill="url(#${c.u}st)"/><rect width="${W}" height="${H}" fill="url(#${c.u}sb)"/>`;
      b += mast(W / 2, fmt === 'post' ? 150 : 170, W - 160, fmt === 'post' ? 118 : 128, '#FFFFFF');
      b += `<path d="M${W / 2 - 60},${fmt === 'post' ? 196 : 220}H${W / 2 + 60}" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="2"/>`;
      const t = wrap(s.title, { ...serif, style: 'italic', size: fmt === 'post' ? 86 : 96, min: 46 }, W - 150, 2);
      const lh = t.size * 1.06; const yMsg = H - 108; const y0 = yMsg - 64 - (t.lines.length - 1) * lh;
      b += TL(t.lines, 72, y0, lh, { ...serif, style: 'italic', size: t.size, fill: '#FFFFFF', field: 'title' }).svg;
      b += T(s.message, 74, yMsg, { ...sans, size: 27, weight: 500, fill: '#FFFFFF', op: 0.92, fitW: W * 0.58, field: 'message' });
      b += T(s.cta, W - 72, yMsg, { ...sans, size: 24, weight: 700, ls: 0.14, upper: true, fill: '#FFFFFF', anchor: 'end', field: 'cta' });
      const cw = width(up(s.cta), { ...sans, size: 24, weight: 700, ls: 0.14 }, 24);
      b += `<path d="M${f1(W - 72 - cw)},${yMsg + 14}H${W - 72}" stroke="#FFFFFF" stroke-width="2"/>`;
      if (d) b += T(`${d} ${discWord()}`, W - 72, y0 - t.size * 0.95, { ...sans, size: 22, weight: 700, ls: 0.22, fill: '#FFFFFF', anchor: 'end', field: 'discount' });
    } else if (fmt === 'story') {
      const ph = 1240;
      defs += scrim('st', 0, 560, 0.6, 0);
      b += `<rect width="${W}" height="${H}" fill="${P.bg}"/>` + scene(c, 0, 0, W, ph) + `<rect width="${W}" height="${ph}" fill="url(#${c.u}st)"/>`;
      b += mast(W / 2, 230, W - 150, 150, '#FFFFFF');
      b += T(L('KOLEKSİYON', 'THE COLLECTION'), W / 2, 300, { ...sans, size: 22, weight: 600, ls: 0.4, fill: '#FFFFFF', anchor: 'middle', op: 0.9 });
      let y = ph + 120;
      if (d) { b += T(`${d} ${discWord()}`, W / 2, y, { ...sans, size: 26, weight: 700, ls: 0.24, fill: P.strong, anchor: 'middle', field: 'discount' }); y += 30; }
      const t = wrap(s.title, { ...serif, style: 'italic', size: 104, min: 54 }, W - 140, 2);
      const r = TL(t.lines, W / 2, y + t.size * 0.95, t.size * 1.04, { ...serif, style: 'italic', size: t.size, fill: P.ink, anchor: 'middle', field: 'title' });
      b += r.svg;
      b += T(s.message, W / 2, r.end + 84, { ...sans, size: 32, weight: 500, fill: P.ink, op: 0.78, anchor: 'middle', fitW: W - 160, field: 'message' });
      b += ctaPill(c, W / 2, H - 150, 26, 'none', P.ink, true);
    } else {
      const px = 900;
      b += `<rect width="${W}" height="${H}" fill="${P.bg}"/>` + scene(c, px, 0, W - px, H);
      b += mast(130, 170, 640, 56, P.ink, 'start');
      b += `<path d="M130,214H230" stroke="${P.strong}" stroke-width="3"/>`;
      let y = 400;
      if (d) b += T(`${d} ${discWord()}`, 130, y - 70, { ...sans, size: 24, weight: 700, ls: 0.24, fill: P.strong, field: 'discount' });
      const t = wrap(s.title, { ...serif, style: 'italic', size: 116, min: 60 }, px - 230, 2);
      const r = TL(t.lines, 126, y + t.size * 0.7, t.size * 1.04, { ...serif, style: 'italic', size: t.size, fill: P.ink, field: 'title' });
      b += r.svg; y = r.end + 90;
      b += T(s.message, 130, y, { ...sans, size: 32, weight: 500, fill: P.ink, op: 0.75, fitW: px - 260, field: 'message' });
      b += T(s.cta, 130, H - 150, { ...sans, size: 26, weight: 700, ls: 0.14, upper: true, fill: P.ink, field: 'cta' });
      const cw = width(up(s.cta), { ...sans, size: 26, weight: 700, ls: 0.14 }, 26);
      b += `<path d="M130,${H - 134}H${f1(130 + cw)}" stroke="${P.strong}" stroke-width="3"/>`;
    }
    return { defs, body: b };
  }

  /* ---------------------------------------------------------------- B · Bold Social
     Strong brand colour, a giant word set behind the product, a sticker and geometric shapes. */
  function bold(c) {
    const { W, H, P, s } = c; const fmt = c.format;
    const bg = P.strong; const fg = on(bg, P.ink); const acc = P.accent; const accFg = on(acc, P.ink);
    const big = { font: FONTS.sans, weight: 800, upper: true, ls: -0.035 };
    const sans = { font: FONTS.sans };
    const d = disc(s.discount);
    let b = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
    const sticker = (cx, cy, r, rot) => (d ? `<g transform="translate(${f1(cx)},${f1(cy)}) rotate(${rot})"><circle r="${r}" fill="${acc}"/>
      <circle r="${f1(r - 12)}" fill="none" stroke="${accFg}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 7"/>
      ${T(d, 0, f1(r * 0.12), { ...sans, size: f1(r * 0.62), weight: 800, fill: accFg, anchor: 'middle', ls: -0.03, field: 'discount' })}
      ${T(discWord(), 0, f1(r * 0.5), { ...sans, size: f1(r * 0.2), weight: 800, fill: accFg, anchor: 'middle', ls: 0.16, field: 'discount' })}</g>` : '');
    const words = (maxW, maxLines, size, min) => wrap(s.title, { ...big, size, min }, maxW, maxLines);
    if (fmt === 'banner') {
      b += `<circle cx="1420" cy="560" r="400" fill="${mix(bg, '#FFFFFF', 0.14)}"/><circle cx="1420" cy="560" r="400" fill="none" stroke="${fg}" stroke-opacity=".18" stroke-width="2"/>`;
      b += pill(1040, 150, 180, 64, 'none', fg) + `<rect x="1580" y="880" width="220" height="64" rx="32" fill="${acc}"/>`;
      b += brand(c, 120, 150, { ...sans, size: 34, weight: 800, fill: fg, ls: 0.02 }, 46);
      const t = words(860, 3, 150, 70); const lh = t.size * 0.92;
      const r = TL(t.lines, 112, 300 + t.size * 0.8, lh, { ...big, size: t.size, fill: fg, field: 'title' }); b += r.svg;
      b += T(s.message, 120, r.end + 100, { ...sans, size: 34, weight: 600, fill: fg, op: 0.86, fitW: 820, field: 'message' });
      const cw = width(up(s.cta), { ...sans, size: 28, weight: 700, ls: 0.06 }, 28) + 28 * 2.6;
      b += ctaPill(c, 120 + cw / 2, H - 150, 28, fg, bg);
      b += product(c, 1420, 900, 640, { shadowOp: 0.35 });
      b += sticker(1700, 300, 120, -12);
    } else {
      const story = fmt === 'story'; const port = fmt === 'portrait';
      const top = story ? 300 : 210; const lines = story ? 4 : 3;
      const t = words(W - 120, lines, story ? 220 : 190, 90); const lh = t.size * 0.9;
      const cr = story ? 430 : port ? 360 : 320; const cy = story ? 1080 : port ? 760 : 640;
      b += `<circle cx="${W / 2}" cy="${cy}" r="${cr}" fill="${mix(bg, '#FFFFFF', 0.14)}"/>`;
      const r = TL(t.lines, W / 2, top + t.size * 0.78, lh, { ...big, size: t.size, fill: fg, anchor: 'middle', field: 'title' }); b += r.svg;
      b += `<rect x="${story ? 90 : 70}" y="${story ? 1500 : port ? 1030 : 860}" width="${story ? 130 : 110}" height="${story ? 130 : 110}" rx="${story ? 30 : 26}" fill="none" stroke="${fg}" stroke-opacity=".3" stroke-width="3" transform="rotate(14 ${story ? 155 : 125} ${story ? 1565 : port ? 1085 : 915})"/>`;
      b += brand(c, 70, story ? 140 : 110, { ...sans, size: story ? 36 : 32, weight: 800, fill: fg, ls: 0.02 }, 44);
      const ph = story ? 820 : port ? 620 : 520; const by = story ? 1450 : port ? 1080 : 920;
      b += product(c, W / 2, by, ph, { shadowOp: 0.35 });
      b += sticker(W - (story ? 190 : 170), story ? 1180 : port ? 820 : 700, story ? 130 : 110, -12);
      const yb = H - (story ? 200 : 90);
      b += T(s.message, 70, yb, { ...sans, size: story ? 36 : 30, weight: 600, fill: fg, op: 0.9, fitW: W * 0.52, field: 'message' });
      const cs = story ? 30 : 26; const cw = width(up(s.cta), { ...sans, size: cs, weight: 700, ls: 0.06 }, cs) + cs * 2.6;
      b += ctaPill(c, W - 70 - cw / 2, yb - cs * 0.36, cs, fg, bg);
    }
    return { defs: '', body: b };
  }

  /* ---------------------------------------------------------------- C · Minimal Luxury
     A pale tint of the brand colour, the product small and centred, hairlines and a quiet serif. */
  function minimal(c) {
    const { W, H, P, s } = c; const fmt = c.format;
    const bg = mix(P.strong, '#FFFFFF', 0.9); const ink = P.ink; const line = P.strong;
    const sans = { font: FONTS.sans }; const ital = { font: FONTS.ital };
    const d = disc(s.discount);
    const brandO = { ...sans, size: 22, weight: 600, ls: 0.42, upper: true, fill: ink };
    let b = `<rect width="${W}" height="${H}" fill="${bg}"/><rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="${line}" stroke-opacity=".28" stroke-width="1.5"/>`;
    const small = (str, x, y, anchor, field) => T(str, x, y, { ...sans, size: 20, weight: 600, ls: 0.3, upper: true, fill: ink, op: 0.62, anchor, field });
    if (fmt === 'banner') {
      b += `<rect x="1080" y="28" width="812" height="${H - 56}" fill="${mix(P.strong, '#FFFFFF', 0.82)}"/>`;
      b += product(c, 1486, 840, 560, { shadowOp: 0.16 });
      b += brand(c, 170, 210, { ...brandO, anchor: 'start' }, 34);
      b += `<path d="M170,250H250" stroke="${line}" stroke-width="2"/>`;
      const t = wrap(s.title, { ...ital, size: 104, min: 56 }, 760, 2);
      const r = TL(t.lines, 166, 420 + t.size * 0.6, t.size * 1.02, { ...ital, size: t.size, fill: ink, field: 'title' }); b += r.svg;
      b += T(s.message, 170, r.end + 80, { ...sans, size: 28, weight: 400, fill: ink, op: 0.72, fitW: 760, field: 'message' });
      if (d) b += small(`${d} ${discWord()}`, 170, r.end + 140, 'start', 'discount');
      b += T(s.cta, 170, H - 170, { ...sans, size: 22, weight: 700, ls: 0.3, upper: true, fill: ink, field: 'cta' });
      b += `<path d="M170,${H - 150}H${f1(170 + width(up(s.cta), { ...sans, size: 22, weight: 700, ls: 0.3 }, 22))}" stroke="${line}" stroke-width="2"/>`;
    } else {
      const story = fmt === 'story'; const port = fmt === 'portrait';
      const yBrand = story ? 230 : 128; const by = story ? 1190 : port ? 860 : 690; const ph = story ? 640 : port ? 500 : 410;
      b += brand(c, W / 2, yBrand, { ...brandO, anchor: 'middle', size: story ? 26 : 22 }, story ? 40 : 34);
      b += `<path d="M${W / 2 - 40},${yBrand + 36}H${W / 2 + 40}" stroke="${line}" stroke-width="2"/>`;
      b += `<circle cx="${W / 2}" cy="${f1(by - ph * 0.46)}" r="${f1(ph * 0.58)}" fill="${mix(P.strong, '#FFFFFF', 0.8)}" opacity=".7"/>`;
      b += product(c, W / 2, by, ph, { shadowOp: 0.16 });
      const t = wrap(s.title, { ...ital, size: story ? 92 : 70, min: 44 }, W - 220, 2);
      const r = TL(t.lines, W / 2, by + (story ? 190 : 120), t.size * 1.04, { ...ital, size: t.size, fill: ink, anchor: 'middle', field: 'title' }); b += r.svg;
      b += T(s.message, W / 2, r.end + (story ? 80 : 60), { ...sans, size: story ? 30 : 24, weight: 400, fill: ink, op: 0.72, anchor: 'middle', fitW: W - 240, field: 'message' });
      if (d) b += small(`${d} ${discWord()}`, W / 2, r.end + (story ? 150 : 108), 'middle', 'discount');
      const cy = H - (story ? 190 : 96);
      b += T(s.cta, W / 2, cy, { ...sans, size: story ? 24 : 20, weight: 700, ls: 0.3, upper: true, fill: ink, anchor: 'middle', field: 'cta' });
      const cw = width(up(s.cta), { ...sans, size: story ? 24 : 20, weight: 700, ls: 0.3 }, story ? 24 : 20);
      b += `<path d="M${f1(W / 2 - cw / 2)},${cy + 16}H${f1(W / 2 + cw / 2)}" stroke="${line}" stroke-width="2"/>`;
    }
    return { defs: '', body: b };
  }

  const LAYOUT = { editorial, bold, minimal };
  let n = 0;
  /* spec: { direction, format, kind, brand, title, message, discount, cta, logo, palette, color, img: { cut, scene, sceneAd, ratio } } */
  function render(spec) {
    const F = FORMATS[spec.format]; const base = PALETTES.find((p) => p.id === spec.palette) || PALETTES[0];
    const P = spec.color ? { ...base, strong: spec.color } : base;
    const c = { W: F.w, H: F.h, P, s: spec, format: spec.format, kind: spec.kind, img: spec.img, u: `cm${n++}` };
    const out = LAYOUT[spec.direction](c);
    const defs = `<filter id="${c.u}soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f1(F.w / 90)}"/></filter>${out.defs}`;
    const label = `${DIRECTIONS[spec.direction].name} · ${F.name} · ${spec.title}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${F.w} ${F.h}" role="img" aria-label="${esc(label)}"><defs>${defs}</defs><g>${out.body}</g></svg>`;
  }

  /* ---------------------------------------------------------------- fonts and export */
  const FONT_FILES = {
    'Bodoni Moda Variable': ['@fontsource-variable/bodoni-moda@5/files/bodoni-moda', 'wght', true],
    'Plus Jakarta Sans Variable': ['@fontsource-variable/plus-jakarta-sans@5/files/plus-jakarta-sans', 'wght', false],
    'Instrument Serif': ['@fontsource/instrument-serif@5/files/instrument-serif', '400', false],
  };
  function ready() {
    if (!document.fonts) return Promise.resolve();
    const t = 'Ağ Iİ şŞ çÇ ğĞ öÖ üÜ %';
    return Promise.all([
      document.fonts.load(`500 40px "${FONTS.serif}"`, t), document.fonts.load(`italic 500 40px "${FONTS.serif}"`, t),
      document.fonts.load(`800 40px "${FONTS.sans}"`, t), document.fonts.load(`400 40px "${FONTS.sans}"`, t), document.fonts.load(`400 40px "${FONTS.ital}"`, t),
    ]).catch(() => {});
  }
  const b64 = (buf) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };
  const dataUrl = async (url) => { if (url.startsWith('data:')) return url; const r = await fetch(url); const bl = await r.blob(); return `data:${bl.type || 'image/png'};base64,${b64(await bl.arrayBuffer())}`; };
  // Self-contained SVG: fonts (latin + latin-ext, so Turkish letters survive) and every image inlined.
  async function standalone(svg) {
    const faces = [];
    for (const fam of Object.keys(FONT_FILES).filter((f) => svg.includes(`'${f}'`))) {
      const [baseUrl, axis, italic] = FONT_FILES[fam];
      for (const st of italic ? ['normal', 'italic'] : ['normal']) for (const sub of ['latin', 'latin-ext']) {
        try { const r = await fetch(`https://cdn.jsdelivr.net/npm/${baseUrl}-${sub}-${axis}-${st}.woff2`); if (!r.ok) continue; faces.push(`@font-face{font-family:'${fam}';font-style:${st};font-weight:${axis === 'wght' ? '100 900' : '400'};src:url(data:font/woff2;base64,${b64(await r.arrayBuffer())}) format('woff2');}`); } catch (e) { /* offline: system fonts */ }
      }
    }
    const urls = [...new Set([...svg.matchAll(/<image href="([^"]+)"/g)].map((m) => m[1]))];
    for (const u of urls) { try { svg = svg.split(`href="${u}"`).join(`href="${await dataUrl(u)}"`); } catch (e) { /* keep the link */ } }
    return svg.replace('<defs>', `<defs><style>${faces.join('')}</style>`);
  }
  async function toPng(svg, scale = 1) {
    const full = await standalone(svg);
    const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(full); const w = +vb[1] * scale, h = +vb[2] * scale;
    const img = new Image(); const url = URL.createObjectURL(new Blob([full], { type: 'image/svg+xml' }));
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const cnv = document.createElement('canvas'); cnv.width = w; cnv.height = h; cnv.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    return new Promise((res) => cnv.toBlob(res, 'image/png'));
  }

  g.SCampaign = { render, ready, standalone, toPng, FORMATS, DIRECTIONS, PALETTES, LANG, L, up, mix };
})(window);
