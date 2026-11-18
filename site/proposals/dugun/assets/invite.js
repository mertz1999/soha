/* Düğün.com proposal · invitation engine
   An invitation is a small structured design spec (design, layout, palette, typography, format, text).
   render(spec) turns it into SVG with real <text> elements, so names, date and venue stay editable and
   Turkish characters render with the chosen web fonts. Ornaments are drawn in code; nothing is a photo. */
(function (g) {
  'use strict';
  const A = g.DArt; const { f1 } = A;

  /* ------------------------------------------------------------ text helpers */
  const LANG = /^en/i.test(document.documentElement.lang || '') ? 'en' : 'tr';
  const L = (tr, en) => (LANG === 'en' ? en : tr);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Couple, venue and city names keep Turkish casing ("İSTANBUL", "KÖŞKÜ"); copy follows the page language.
  let NAMES = new Set();
  const up = (s) => String(s).toLocaleUpperCase(LANG === 'en' && !NAMES.has(String(s)) ? 'en-US' : 'tr-TR');
  const time12 = (t) => { const [h, m] = t.split('.').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  const TX = L({
    save: 'Tarihi Kaydedin', saveLow: 'Tarihi kaydedin', kicker: 'Evleniyoruz', and: 've', soon: 'Davetiye yakında',
    inviteT: 'Hayatımızı birleştirdiğimiz bu özel günde sizi de aramızda görmekten mutluluk duyarız.',
    inviteB: 'Sevgiyle başlayan hikâyemizin en güzel gününe davetlisiniz.',
    youre: 'Davetlisiniz', loc: 'Konum', rsvpBtn: 'Katılım', rsvpShort: 'LCV', venue: 'Mekân',
    rsvpT: (d) => `Lütfen ${d} tarihine kadar katılımınızı bildiriniz.`, rsvpB: (d) => `Katılım için ${d} tarihine kadar haber veriniz.`,
    dayTime: (dp) => `${dp.day} · Saat ${dp.time}`, dayDot: (dp) => `${dp.day} · ${dp.time}`, dayComma: (dp) => `${dp.day}, saat ${dp.time}`,
    label: (n, c) => `${n} davetiye: ${c.bride} ve ${c.groom}, ${c.dp.d} ${c.dp.month} ${c.dp.y}, ${c.venue}`,
  }, {
    save: 'Save the Date', saveLow: 'Save the date', kicker: "We're getting married", and: 'and', soon: 'Invitation to follow',
    inviteT: 'Together with our families, we would be honoured to have you with us as we begin our life together.',
    inviteB: 'You are warmly invited to the most beautiful day of our love story.',
    youre: "You're invited", loc: 'Location', rsvpBtn: 'RSVP', rsvpShort: 'RSVP', venue: 'Venue',
    rsvpT: (d) => `Kindly reply by ${d}.`, rsvpB: (d) => `Please let us know by ${d}.`,
    dayTime: (dp) => `${dp.day} · ${time12(dp.time)}`, dayDot: (dp) => `${dp.day} · ${time12(dp.time)}`, dayComma: (dp) => `${dp.day}, ${time12(dp.time)}`,
    label: (n, c) => `${n} invitation: ${c.bride} and ${c.groom}, ${c.dp.d} ${c.dp.month} ${c.dp.y}, ${c.venue}`,
  });
  const cv = document.createElement('canvas').getContext('2d');
  const font = (o, size) => `${o.style || 'normal'} ${o.weight || 400} ${size}px "${o.font}"`;
  const width = (str, o, size) => { cv.font = font(o, size); return cv.measureText(str).width + (o.ls || 0) * size * Math.max(0, [...str].length - 1); };
  const fitSize = (str, o, maxW) => { let s = o.size; const w = width(str, o, s); if (w > maxW) s = Math.max(o.min || 8, (s * maxW) / w); return f1(s); };
  function T(str, x, y, o) {
    const s = o.upper ? up(str) : String(str);
    const size = o.maxW ? fitSize(s, o, o.maxW) : o.size;
    const ls = o.ls ? ` letter-spacing="${f1(o.ls * size)}"` : '';
    const anchor = o.anchor || 'middle';
    // letter-spacing adds space after the last glyph too; shift centred text back by half of it
    const dx = o.ls && anchor === 'middle' ? f1((o.ls * size) / 2) : 0;
    return `<text x="${f1(x + dx)}" y="${f1(y)}" font-family="'${o.font}'" font-size="${size}" font-weight="${o.weight || 400}" font-style="${o.style || 'normal'}" fill="${o.fill}" text-anchor="${anchor}"${ls}${o.field ? ` data-field="${o.field}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}>${esc(s)}</text>`;
  }
  function wrap(str, o, maxW) {
    const words = String(str).split(/\s+/); const lines = []; let line = '';
    words.forEach((w) => { const t = line ? `${line} ${w}` : w; if (width(t, o, o.size) > maxW && line) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line); return lines;
  }

  /* ------------------------------------------------------------ dates */
  const MONTHS = L(['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'], ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  const DAYS = L(['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  function dateParts(iso, time) {
    const [y, m, d] = String(iso || '2027-06-12').split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const rs = new Date(dt.getTime() - 28 * 864e5);
    const tm = /^\d{1,2}[.:]\d{2}$/.test(time || '') ? time.replace(':', '.') : '19.00';
    return { d: dt.getDate(), m: dt.getMonth() + 1, y: dt.getFullYear(), month: MONTHS[dt.getMonth()], day: DAYS[dt.getDay()], time: tm, rsvp: `${rs.getDate()} ${MONTHS[rs.getMonth()]}`, pad: (n) => String(n).padStart(2, '0') };
  }
  const splitVenue = (v) => { const i = String(v || '').lastIndexOf(','); return i > 0 ? [v.slice(0, i).trim(), v.slice(i + 1).trim()] : [String(v || '').trim(), '']; };
  const initial = (s) => up([...String(s || '').trim()][0] || '');

  /* ------------------------------------------------------------ ornaments */
  const GOLD = (u, id, dark) => `<linearGradient id="${u}${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dark ? '#C9A35F' : '#A9823F'}"/><stop offset=".3" stop-color="${dark ? '#F3DFA8' : '#E3CB8C'}"/><stop offset=".55" stop-color="${dark ? '#C59A53' : '#B08843'}"/><stop offset=".8" stop-color="${dark ? '#F0D9A0' : '#DCC283'}"/><stop offset="1" stop-color="${dark ? '#B98F4A' : '#9E7638'}"/></linearGradient>`;
  const CORNER = 'M6,154C6,92 34,40 88,14C104,7 122,5 140,6M6,154C12,122 26,100 48,92C62,87 74,92 72,104C70,114 58,116 54,108C51,102 56,96 62,98M140,6C116,10 98,22 92,42C88,56 94,68 106,68C116,68 120,58 114,52C110,48 104,50 104,55M30,120C42,106 56,98 74,97M96,30C102,46 101,60 94,72';
  function corner(x, y, sx, sy, k, fill) {
    let leaves = ''; [[22, 70, -60], [40, 44, -40], [62, 26, -22], [18, 92, -78]].forEach(([lx, ly, a]) => { leaves += A.leaf(lx, ly, 16, a, fill, 6); leaves += A.leaf(lx, ly, 13, a + 70, fill, 5); });
    return `<g transform="translate(${f1(x)},${f1(y)}) scale(${f1(sx * k)},${f1(sy * k)})"><path d="${CORNER}" fill="none" stroke="${fill}" stroke-width="2.2" stroke-linecap="round"/>${leaves}<circle cx="6" cy="154" r="3" fill="${fill}"/><circle cx="140" cy="6" r="3" fill="${fill}"/></g>`;
  }
  const divider = (x, y, w, fill, sw = 1.4) => `<g transform="translate(${f1(x)},${f1(y)})" fill="${fill}"><path d="M${f1(-w / 2)},0H-22M22,0H${f1(w / 2)}" stroke="${fill}" stroke-width="${sw}"/><path d="M0,-7L7,0L0,7L-7,0Z"/><circle cx="-14" cy="0" r="2.2"/><circle cx="14" cy="0" r="2.2"/></g>`;
  function laurel(cx, cy, R, fill, k = 1) {
    let s = '';
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 11; i++) {
        const a = ((100 + i * 15) * Math.PI) / 180; const x = cx + side * Math.cos(a) * R * -1, y = cy + Math.sin(a) * R;
        const tang = (Math.atan2(Math.cos(a) * R, side * Math.sin(a) * R) * 180) / Math.PI;
        s += A.leaf(x, y, 22 * k, tang - 90 - side * 28, fill, 9 * k) + A.leaf(x, y, 20 * k, tang - 90 + side * 150, fill, 8 * k);
      }
    }
    return s + `<circle cx="${f1(cx)}" cy="${f1(cy + R)}" r="${f1(3 * k)}" fill="${fill}"/>`;
  }
  function lineRose(x, y, r, stroke, sw) {
    return `<g transform="translate(${f1(x)},${f1(y)})" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round">
      <path d="M${f1(-r)},${f1(r * 0.1)}C${f1(-r)},${f1(-r * 0.8)} ${f1(r)},${f1(-r * 0.9)} ${f1(r)},${f1(0)}C${f1(r)},${f1(r * 0.8)} ${f1(-r * 0.6)},${f1(r * 0.95)} ${f1(-r * 0.7)},${f1(r * 0.2)}"/>
      <path d="M${f1(-r * 0.6)},${f1(-r * 0.05)}C${f1(-r * 0.4)},${f1(-r * 0.6)} ${f1(r * 0.6)},${f1(-r * 0.5)} ${f1(r * 0.55)},${f1(r * 0.05)}C${f1(r * 0.5)},${f1(r * 0.5)} ${f1(-r * 0.2)},${f1(r * 0.55)} ${f1(-r * 0.25)},${f1(r * 0.1)}"/>
      <path d="M${f1(-r * 0.2)},${f1(-r * 0.08)}C${f1(-r * 0.05)},${f1(-r * 0.32)} ${f1(r * 0.28)},${f1(-r * 0.2)} ${f1(r * 0.2)},${f1(r * 0.06)}C${f1(r * 0.12)},${f1(r * 0.22)} ${f1(-r * 0.06)},${f1(r * 0.18)} ${f1(0)},${f1(r * 0.02)}"/></g>`;
  }
  function crest(cx, cy, k, fill) {
    let s = lineRose(cx, cy, 26 * k, fill, 1.8 * k);
    [-1, 1].forEach((sd) => {
      s += `<path d="M${f1(cx + sd * 24 * k)},${f1(cy + 8 * k)}C${f1(cx + sd * 70 * k)},${f1(cy + 30 * k)} ${f1(cx + sd * 120 * k)},${f1(cy + 18 * k)} ${f1(cx + sd * 160 * k)},${f1(cy - 6 * k)}" fill="none" stroke="${fill}" stroke-width="${f1(1.6 * k)}" stroke-linecap="round"/>`;
      [[50, 22, 20], [86, 24, 6], [120, 14, -10], [148, 2, -22]].forEach(([dx, dy, a]) => { s += A.leaf(cx + sd * dx * k, cy + dy * k, 24 * k, sd > 0 ? a - 30 : 210 - a, 'none', 10 * k, ` stroke="${fill}" stroke-width="${f1(1.3 * k)}"`); });
      s += lineRose(cx + sd * 64 * k, cy + 14 * k, 12 * k, fill, 1.4 * k);
    });
    return s;
  }

  /* Watercolour flowers and leaves (botanical and modern designs). */
  function wcRose(x, y, r, c, rot, rnd) {
    let s = `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(rot)})">`;
    for (let i = 0; i < 7; i++) { const a = (i / 7) * 360 + rnd() * 20; s += `<ellipse cx="${f1(r * 0.42)}" cy="0" rx="${f1(r * 0.6)}" ry="${f1(r * 0.46)}" transform="rotate(${f1(a)})" fill="${c[0]}" opacity=".55"/>`; }
    for (let i = 0; i < 5; i++) { const a = (i / 5) * 360 + 30 + rnd() * 20; s += `<ellipse cx="${f1(r * 0.24)}" cy="0" rx="${f1(r * 0.4)}" ry="${f1(r * 0.3)}" transform="rotate(${f1(a)})" fill="${c[1]}" opacity=".55"/>`; }
    s += `<circle r="${f1(r * 0.22)}" fill="${c[2]}" opacity=".55"/>`;
    s += `<path d="M${f1(-r * 0.3)},${f1(r * 0.05)}A${f1(r * 0.3)},${f1(r * 0.3)} 0 0 1 ${f1(r * 0.25)},${f1(-r * 0.18)}M${f1(r * 0.32)},${f1(r * 0.02)}A${f1(r * 0.34)},${f1(r * 0.34)} 0 0 1 ${f1(-r * 0.1)},${f1(r * 0.34)}M${f1(-r * 0.55)},${f1(-r * 0.2)}A${f1(r * 0.6)},${f1(r * 0.6)} 0 0 1 ${f1(r * 0.4)},${f1(-r * 0.5)}" fill="none" stroke="${c[2]}" stroke-width="${f1(Math.max(1, r * 0.035))}" opacity=".55" stroke-linecap="round"/>`;
    return s + '</g>';
  }
  function wcStem(x, y, len, ang, cols, rnd, kind) {
    const a = (ang * Math.PI) / 180; const bend = (rnd() - 0.5) * 0.4; const pts = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8; const off = Math.sin(t * Math.PI) * len * bend; pts.push([x + Math.cos(a) * len * t - Math.sin(a) * off, y + Math.sin(a) * len * t + Math.cos(a) * off]); }
    let s = `<path d="${A.smooth(pts)}" fill="none" stroke="${cols[2]}" stroke-width="${f1(Math.max(1.2, len * 0.012))}" opacity=".7" stroke-linecap="round"/>`;
    for (let i = 1; i <= 8; i++) {
      const p = pts[i]; const side = i % 2 ? 1 : -1; const sz = len * (kind === 'euca' ? 0.075 : 0.13) * (0.7 + 0.5 * Math.sin((i / 8) * Math.PI));
      if (kind === 'euca') s += `<ellipse cx="${f1(p[0] + Math.cos(a + side * 1.4) * sz * 0.9)}" cy="${f1(p[1] + Math.sin(a + side * 1.4) * sz * 0.9)}" rx="${f1(sz)}" ry="${f1(sz * 0.86)}" fill="${cols[i % 2]}" opacity=".62"/>`;
      else s += A.leaf(p[0], p[1], sz * 2, ang + side * 48, cols[i % 2], sz * 0.7, ' opacity=".62"');
    }
    return s;
  }
  function wcCluster(cx, cy, r, pal, rnd, k = 1) {
    let s = '';
    for (let i = 0; i < 7; i++) s += wcStem(cx, cy, r * (1.3 + rnd() * 0.9) * k, rnd() * 360, pal.leaves, rnd, i % 2 ? 'euca' : 'olive');
    for (let i = 0; i < 3; i++) { const a = rnd() * 6.28, d = r * 0.4 * k; s += wcRose(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r * (0.42 + rnd() * 0.2) * k, pal.flowers, rnd() * 360, rnd); }
    for (let i = 0; i < 10; i++) { const a = rnd() * 6.28, d = r * (0.6 + rnd() * 0.7) * k; s += `<circle cx="${f1(cx + Math.cos(a) * d)}" cy="${f1(cy + Math.sin(a) * d)}" r="${f1(r * 0.05 * k)}" fill="${pal.flowers[2]}" opacity=".6"/>`; }
    return s;
  }

  /* ------------------------------------------------------------ the three design directions */
  const DESIGNS = {
    timeless: {
      name: L('Zamansız Zarafet', 'Timeless Elegance'),
      layouts: L(['Çerçeve', 'Kemer', 'Madalyon'], ['Frame', 'Arch', 'Medallion']),
      palettes: [
        { name: L('Fildişi & Altın', 'Ivory & Gold'), bg: '#FBF7EF', bg2: '#F2E9DA', ink: '#4F3F2B', soft: '#7A6650', dark: false, sw: ['#FBF7EF', '#C9A86A'] },
        { name: L('Pudra & Altın', 'Blush & Gold'), bg: '#FAF0EC', bg2: '#F1DED7', ink: '#5A403B', soft: '#86665F', dark: false, sw: ['#F4E2DC', '#C9A86A'] },
        { name: L('Gece & Altın', 'Night & Gold'), bg: '#1F2842', bg2: '#151C31', ink: '#F4E8D0', soft: '#D9CBB0', dark: true, sw: ['#1F2842', '#D9B877'] },
      ],
      types: [
        { name: L('Klasik', 'Classic'), script: 'Pinyon Script', serif: 'Cormorant Garamond Variable' },
        { name: L('Zarif', 'Elegant'), script: 'Great Vibes', serif: 'Playfair Display Variable' },
        { name: L('Yalın', 'Plain'), script: null, serif: 'Cormorant Garamond Variable' },
      ],
    },
    modern: {
      name: L('Modern Romantizm', 'Modern Romance'),
      layouts: L(['Asimetrik', 'Büyük &', 'Bölünmüş'], ['Asymmetric', 'Big &', 'Split']),
      palettes: [
        { name: L('Gül', 'Rose'), bg: '#FCF8F5', ink: '#2E2828', soft: '#6E6262', accent: '#C46B7B', panel: '#F2DCDA', flowers: ['#F4CFCF', '#E5A0A8', '#C46B7B'], leaves: ['#9AA58E', '#B5BDA8', '#7E8A72'], sw: ['#F2DCDA', '#C46B7B'] },
        { name: L('Toprak', 'Earth'), bg: '#FAF5EE', ink: '#33291F', soft: '#73624F', accent: '#B0704A', panel: '#EFDCC9', flowers: ['#F3D7BE', '#E0A57D', '#B0704A'], leaves: ['#8E9A78', '#AAB394', '#727E5E'], sw: ['#EFDCC9', '#B0704A'] },
        { name: L('Nötr', 'Neutral'), bg: '#F7F6F3', ink: '#222222', soft: '#5E5E5A', accent: '#7F866F', panel: '#E5E3DC', flowers: ['#EEE9E1', '#D8CFC1', '#B5A995'], leaves: ['#A3AA97', '#BFC4B5', '#868D7A'], sw: ['#E5E3DC', '#4A4A46'] },
      ],
      types: [
        { name: 'Bodoni', display: 'Bodoni Moda Variable', sans: 'Jost Variable', italic: true },
        { name: 'Playfair', display: 'Playfair Display Variable', sans: 'Manrope Variable', italic: true },
        { name: L('Geometrik', 'Geometric'), display: 'Jost Variable', sans: 'Jost Variable', italic: false, light: true },
      ],
    },
    botanical: {
      name: L('Sanatsal Botanik', 'Artistic Botanical'),
      layouts: L(['Çelenk', 'Köşe', 'Kemer'], ['Wreath', 'Corner', 'Arch']),
      palettes: [
        { name: L('Adaçayı', 'Sage'), bg: '#F8F4EA', ink: '#3E5140', soft: '#6B7C68', flowers: ['#F8E3D5', '#F1C3A9', '#E19F81'], leaves: ['#8EA281', '#A8B89A', '#6C8264'], sw: ['#F8F4EA', '#8EA281'] },
        { name: L('Zeytin', 'Olive'), bg: '#F7F2E5', ink: '#46462B', soft: '#77765A', flowers: ['#F5E4E1', '#E8BCB7', '#CB8986'], leaves: ['#8B8F5E', '#A6A97A', '#6D7146'], sw: ['#F7F2E5', '#8B8F5E'] },
        { name: L('Lavanta', 'Lavender'), bg: '#F6F4F1', ink: '#4A4560', soft: '#7A7590', flowers: ['#ECE6F4', '#CEC2E2', '#A896C8'], leaves: ['#92A491', '#B0BEAD', '#738772'], sw: ['#ECE6F4', '#8F82B2'] },
      ],
      types: [
        { name: L('El yazısı', 'Handwritten'), script: 'Allura', serif: 'EB Garamond Variable' },
        { name: L('Romantik', 'Romantic'), script: 'Parisienne', serif: 'Lora Variable' },
        { name: L('Kaligrafi', 'Calligraphy'), script: 'Mrs Saint Delafield', serif: 'Cormorant Garamond Variable' },
      ],
    },
  };
  const FORMATS = { print: [1000, 1400], story: [900, 1600], std: [1200, 1200] };

  /* Copy shared by the designs. */
  function copy(spec) {
    const dp = dateParts(spec.date, spec.time); const [venue, city] = splitVenue(spec.venue);
    return { dp, venue: venue || TX.venue, city, bride: (spec.bride || 'Elif').trim(), groom: (spec.groom || 'Mert').trim() };
  }

  /* Timeless Elegance: ivory paper, gold ornament, classical centred balance. */
  function timeless(c, spec, W, H, u) {
    const D = DESIGNS.timeless; const p = D.palettes[spec.palette || 0]; const ty = D.types[spec.type || 0]; const lay = spec.layout || 0;
    const gold = `url(#${u}gold)`; const std = spec.format === 'std'; const story = spec.format === 'story';
    let s = `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#${u}paper)"/>`;
    const m = W * 0.06;
    if (lay === 0) {
      s += `<rect x="${f1(m)}" y="${f1(m)}" width="${f1(W - 2 * m)}" height="${f1(H - 2 * m)}" fill="none" stroke="${gold}" stroke-width="2.4"/><rect x="${f1(m + 12)}" y="${f1(m + 12)}" width="${f1(W - 2 * m - 24)}" height="${f1(H - 2 * m - 24)}" fill="none" stroke="${gold}" stroke-width="1"/>`;
      const k = W / 1000;
      s += corner(m + 20, m + 20, 1, 1, k, gold) + corner(W - m - 20, m + 20, -1, 1, k, gold) + corner(m + 20, H - m - 20, 1, -1, k, gold) + corner(W - m - 20, H - m - 20, -1, -1, k, gold);
    } else if (lay === 1) {
      const ax = m + 18, aw = W - 2 * ax, top = std ? H * 0.32 : H * 0.3;
      const arch = (o) => `M${f1(ax + o)},${f1(H - m - o)}V${f1(top)}A${f1(aw / 2 - o)},${f1(aw / 2 - o)} 0 0 1 ${f1(W - ax - o)},${f1(top)}V${f1(H - m - o)}Z`;
      s += `<path d="${arch(0)}" fill="${p.bg2}" opacity=".6"/><path d="${arch(0)}" fill="none" stroke="${gold}" stroke-width="2.4"/><path d="${arch(12)}" fill="none" stroke="${gold}" stroke-width="1"/>`;
    } else {
      s += `<rect x="${f1(m)}" y="${f1(m)}" width="${f1(W - 2 * m)}" height="${f1(H - 2 * m)}" fill="none" stroke="${gold}" stroke-width="1.2"/>`;
      let beads = ''; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; beads += `<circle cx="${f1(W / 2 + Math.cos(a) * W * 0.13)}" cy="${f1(H * (std ? 0.25 : 0.2) + Math.sin(a) * W * 0.13)}" r="${i % 4 === 0 ? 3.2 : 1.8}" fill="${gold}"/>`; }
      s += beads + `<circle cx="${f1(W / 2)}" cy="${f1(H * (std ? 0.25 : 0.2))}" r="${f1(W * 0.115)}" fill="none" stroke="${gold}" stroke-width="1.4"/>`;
    }
    // vertical flow of text
    const cx = W / 2; const maxW = W - 2 * m - (lay === 1 ? 90 : 120);
    const sf = (size, extra = {}) => ({ font: ty.serif, size, fill: p.ink, ...extra });
    const names = ty.script ? { font: ty.script, size: std ? 140 : 168, fill: p.ink } : { font: ty.serif, size: std ? 116 : 138, style: 'italic', weight: 400, fill: p.ink };
    const blocks = [];
    if (lay === 0) blocks.push({ h: 150, draw: (y) => `<g>${laurel(cx, y + 75, 62, gold, 1)}</g>` + T(`${initial(c.bride)}${initial(c.groom)}`.split('').join(' & '), cx, y + 88, sf(40, { fill: gold, weight: 500, ls: 0.05 })) });
    if (lay === 1) blocks.push({ h: 70, draw: (y) => crest(cx, y + 30, W / 1000, gold) });
    if (lay === 2) blocks.push({ h: std ? 0 : 0, draw: () => T(`${initial(c.bride)} ${initial(c.groom)}`, cx, H * (std ? 0.25 : 0.2) + 22, sf(64, { fill: gold, weight: 500, ls: 0.25 })) });
    if (std) {
      blocks.push({ h: 40, gap: 30, draw: (y) => T(TX.save, cx, y + 32, sf(36, { upper: true, ls: 0.32, fill: p.soft, weight: 500, maxW })) });
    } else {
      const inv = wrap(TX.inviteT, sf(36, { style: 'italic' }), maxW * 0.84);
      blocks.push({ h: inv.length * 48, gap: 34, draw: (y) => inv.map((l, i) => T(l, cx, y + 36 + i * 48, sf(36, { style: 'italic', fill: p.soft }))).join('') });
    }
    blocks.push({ h: names.size * 0.95, gap: 26, draw: (y) => T(c.bride, cx, y + names.size * 0.78, { ...names, maxW, field: 'bride' }) });
    blocks.push({ h: 66, gap: 2, draw: (y) => T('&', cx, y + 54, sf(70, { style: 'italic', fill: gold })) });
    blocks.push({ h: names.size * 0.95, gap: 4, draw: (y) => T(c.groom, cx, y + names.size * 0.78, { ...names, maxW, field: 'groom' }) });
    blocks.push({ h: 20, gap: 30, draw: (y) => divider(cx, y + 10, Math.min(360, maxW * 0.6), gold) });
    blocks.push({ h: 56, gap: 30, draw: (y) => T(`${c.dp.d} ${c.dp.month} ${c.dp.y}`, cx, y + 46, sf(std ? 58 : 54, { upper: true, ls: 0.14, weight: 500, maxW, field: 'date' })) });
    blocks.push({ h: 34, gap: 14, draw: (y) => T(TX.dayTime(c.dp), cx, y + 28, sf(30, { upper: true, ls: 0.22, fill: p.soft, maxW })) });
    blocks.push({ h: 46, gap: 38, draw: (y) => T(c.venue, cx, y + 37, sf(40, { weight: 600, ls: 0.06, maxW, field: 'venue' })) });
    if (c.city) blocks.push({ h: 32, gap: 8, draw: (y) => T(c.city, cx, y + 26, sf(28, { upper: true, ls: 0.3, fill: p.soft, maxW })) });
    if (!std) blocks.push({ h: 30, gap: 44, draw: (y) => T(TX.rsvpT(c.dp.rsvp), cx, y + 23, sf(26, { style: 'italic', fill: p.soft, maxW })) });
    if (std) blocks.push({ h: 26, gap: 34, draw: (y) => T(TX.soon, cx, y + 20, sf(24, { style: 'italic', fill: p.soft })) });
    const top = lay === 2 ? H * (std ? 0.25 : 0.2) + W * 0.15 : lay === 1 ? (std ? H * 0.2 : H * 0.17) : m + 50;
    s += flow(blocks, top, story ? H - 170 : H - m - (lay === 1 ? 40 : 50));
    return s;
  }

  /* Modern Romance: contemporary type, asymmetric layout, painted florals. */
  function modern(c, spec, W, H, u) {
    const D = DESIGNS.modern; const p = D.palettes[spec.palette || 0]; const ty = D.types[spec.type || 0]; const lay = spec.layout || 0;
    const std = spec.format === 'std'; const story = spec.format === 'story'; const rnd = A.rng(17 + lay);
    const dsp = (size, extra = {}) => ({ font: ty.display, size, fill: p.ink, style: ty.italic ? 'italic' : 'normal', weight: ty.light ? 300 : 400, ...extra });
    const sans = (size, extra = {}) => ({ font: ty.sans, size, fill: p.ink, weight: 400, ...extra });
    let s = `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#${u}paper)"/>`;
    const nameTxt = (str, field) => (ty.light ? up(str) : str);
    if (lay === 0) {
      s += `<g filter="url(#${u}wc)" style="mix-blend-mode:multiply">${wcRose(W * 0.86, H * 0.08, W * 0.2, p.flowers, 20, rnd)}${wcRose(W * 0.62, H * 0.03, W * 0.13, p.flowers, 80, rnd)}${wcRose(W * 0.98, H * 0.27, W * 0.12, p.flowers, 140, rnd)}</g>`;
      s += `<g fill="none" stroke="${p.leaves[2]}" stroke-width="1.6" stroke-linecap="round" opacity=".8">${[[0.7, 0.2, 200], [0.78, 0.26, 230], [0.55, 0.1, 190]].map(([x, y, a]) => `<path d="M${f1(W * x)},${f1(H * y)}q${f1(-W * 0.08)},${f1(H * 0.04)} ${f1(-W * 0.16)},${f1(H * 0.12)}"/>` + A.leaf(W * x - W * 0.08, H * y + H * 0.05, W * 0.06, a, 'none', W * 0.025, ` stroke="${p.leaves[2]}"`)).join('')}</g>`;
      const x = W * 0.1; const maxW = W * 0.8; const base = std ? H * 0.4 : story ? H * 0.46 : H * 0.45;
      const nsz = std ? 150 : story ? 156 : 156;
      s += T(std ? TX.saveLow : TX.kicker, x, base, sans(26, { upper: true, ls: 0.42, fill: p.accent, anchor: 'start', weight: 500 }));
      s += T(nameTxt(c.bride), x, base + nsz * 1.0, dsp(nsz, { anchor: 'start', maxW, field: 'bride' }));
      s += T('&', x + W * 0.02, base + nsz * 1.72, dsp(nsz * 0.62, { anchor: 'start', fill: p.accent }));
      s += T(nameTxt(c.groom), x + W * 0.14, base + nsz * 1.98, dsp(nsz, { anchor: 'start', maxW: maxW - W * 0.14, field: 'groom' }));
      const y2 = base + nsz * 2.35;
      s += `<path d="M${f1(x)},${f1(y2)}H${f1(x + W * 0.12)}" stroke="${p.accent}" stroke-width="2"/>`;
      s += T(`${c.dp.pad(c.dp.d)} · ${c.dp.pad(c.dp.m)} · ${c.dp.y}`, x, y2 + 74, sans(std ? 64 : 58, { anchor: 'start', weight: 300, ls: 0.06, maxW, field: 'date' }));
      s += T(TX.dayComma(c.dp), x, y2 + 118, sans(26, { anchor: 'start', fill: p.soft, maxW }));
      s += T(c.venue, x, y2 + 176, sans(28, { anchor: 'start', upper: true, ls: 0.2, weight: 500, maxW, field: 'venue' }));
      if (c.city) s += T(c.city, x, y2 + 214, sans(24, { anchor: 'start', upper: true, ls: 0.3, fill: p.soft, maxW }));
      if (!std && !story) s += T(`${TX.rsvpShort} · ${c.dp.rsvp}`, x, H - W * 0.08, sans(22, { anchor: 'start', upper: true, ls: 0.3, fill: p.accent }));
    } else if (lay === 1) {
      s += T('&', W / 2, H * (std ? 0.78 : 0.68), dsp(std ? 980 : 1100, { fill: 'none', op: 0.9 })).replace('fill="none"', `fill="none" stroke="${p.panel}" stroke-width="3"`);
      s += `<g filter="url(#${u}wc)" style="mix-blend-mode:multiply">${wcRose(W * 0.12, H * 0.96, W * 0.16, p.flowers, 10, rnd)}${wcRose(W * 0.3, H * 1.0, W * 0.11, p.flowers, 60, rnd)}${wcRose(W * 0.9, H * 0.97, W * 0.13, p.flowers, 120, rnd)}</g>`;
      const cx = W / 2; const maxW = W * 0.8; const nsz = std ? 140 : 146; let y = std ? H * 0.17 : H * 0.2;
      s += T(std ? TX.saveLow : TX.kicker, cx, y, sans(26, { upper: true, ls: 0.42, fill: p.accent, weight: 500 }));
      y += 60 + nsz * 0.8; s += T(nameTxt(c.bride), cx, y, dsp(nsz, { maxW, field: 'bride' }));
      y += nsz * 0.62; s += T(TX.and, cx, y, sans(28, { upper: true, ls: 0.4, fill: p.accent }));
      y += nsz * 0.9; s += T(nameTxt(c.groom), cx, y, dsp(nsz, { maxW, field: 'groom' }));
      y += 150; const parts = [c.dp.pad(c.dp.d), c.dp.pad(c.dp.m), String(c.dp.y)];
      parts.forEach((t, i) => { s += T(t, cx + (i - 1) * W * 0.2, y, sans(std ? 70 : 62, { weight: 300, field: 'date' })); });
      s += `<path d="M${f1(cx - W * 0.1)},${f1(y - 50)}V${f1(y + 8)}M${f1(cx + W * 0.1)},${f1(y - 50)}V${f1(y + 8)}" stroke="${p.accent}" stroke-width="1.6"/>`;
      y += 54; s += T(TX.dayDot(c.dp), cx, y, sans(26, { upper: true, ls: 0.24, fill: p.soft }));
      y += 64; s += T(c.venue, cx, y, sans(30, { upper: true, ls: 0.16, weight: 500, maxW, field: 'venue' }));
      if (c.city) { y += 40; s += T(c.city, cx, y, sans(24, { upper: true, ls: 0.3, fill: p.soft, maxW })); }
      if (!std && story) s += T(`${TX.rsvpShort} · ${c.dp.rsvp}`, cx, H * 0.83, sans(22, { upper: true, ls: 0.3, fill: p.accent }));
    } else {
      const pw = W * 0.34;
      s += `<rect width="${f1(pw)}" height="${H}" fill="${p.panel}"/>`;
      s += `<g filter="url(#${u}wc)" style="mix-blend-mode:multiply">${wcRose(pw, H * 0.2, W * 0.12, p.flowers, 40, rnd)}${wcRose(pw - W * 0.06, H * 0.27, W * 0.08, p.flowers, 100, rnd)}${wcRose(pw + W * 0.03, H * 0.83, W * 0.09, p.flowers, 160, rnd)}</g>`;
      s += `<g transform="translate(${f1(pw * 0.5)},${f1(H * 0.6)}) rotate(-90)">${T(`${c.dp.d} ${c.dp.month} ${c.dp.y}`, 0, 16, sans(std ? 54 : 50, { upper: true, ls: 0.28, fill: p.ink, weight: 300, maxW: H * 0.5, field: 'date' }))}</g>`;
      const x = pw + W * 0.08; const maxW = W - x - W * 0.07; const nsz = std ? 120 : 112; let y = H * (std ? 0.3 : 0.34);
      s += T(std ? TX.saveLow : TX.kicker, x, y, sans(24, { upper: true, ls: 0.42, fill: p.accent, anchor: 'start', weight: 500 }));
      y += 30 + nsz * 0.9; s += T(nameTxt(c.bride), x, y, dsp(nsz, { anchor: 'start', maxW, field: 'bride' }));
      y += nsz * 0.85; s += T('&', x, y, dsp(nsz * 0.6, { anchor: 'start', fill: p.accent }));
      y += nsz * 0.95; s += T(nameTxt(c.groom), x, y, dsp(nsz, { anchor: 'start', maxW, field: 'groom' }));
      y += 90; s += T(TX.dayComma(c.dp), x, y, sans(26, { anchor: 'start', fill: p.soft, maxW }));
      y += 58; s += T(c.venue, x, y, sans(28, { anchor: 'start', upper: true, ls: 0.18, weight: 500, maxW, field: 'venue' }));
      if (c.city) { y += 38; s += T(c.city, x, y, sans(23, { anchor: 'start', upper: true, ls: 0.3, fill: p.soft, maxW })); }
      if (!std && !story) s += T(`${TX.rsvpShort} · ${c.dp.rsvp}`, x, H - W * 0.08, sans(22, { anchor: 'start', upper: true, ls: 0.3, fill: p.accent }));
    }
    return s;
  }

  /* Artistic Botanical: watercolour greenery and flowers, handwritten names. */
  function botanical(c, spec, W, H, u) {
    const D = DESIGNS.botanical; const p = D.palettes[spec.palette || 0]; const ty = D.types[spec.type || 0]; const lay = spec.layout || 0;
    const std = spec.format === 'std'; const story = spec.format === 'story'; const rnd = A.rng(31 + lay * 7);
    const sf = (size, extra = {}) => ({ font: ty.serif, size, fill: p.ink, ...extra });
    const script = (size, extra = {}) => ({ font: ty.script, size: ty.script === 'Mrs Saint Delafield' ? size * 1.15 : size, fill: p.ink, ...extra });
    let s = `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#${u}paper)"/>`;
    let art = ''; const cx = W / 2;
    let nameTop, maxW;
    if (lay === 0) {
      const wy = std ? H * 0.36 : story ? H * 0.3 : H * 0.33; const R = W * (std ? 0.25 : 0.3);
      for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; const x = cx + Math.cos(a) * R, y = wy + Math.sin(a) * R; art += wcStem(x, y, R * 0.42, (a * 180) / Math.PI + 100, p.leaves, rnd, i % 3 ? 'euca' : 'olive'); }
      art += wcCluster(cx - R * 0.72, wy + R * 0.7, R * 0.3, p, rnd) + wcCluster(cx + R * 0.7, wy - R * 0.72, R * 0.24, p, rnd);
      nameTop = wy; maxW = R * 1.5;
      s += `<g filter="url(#${u}wc)" style="mix-blend-mode:multiply">${art}</g>`;
      const nsz = std ? 120 : 118;
      s += T(c.bride, cx, wy - nsz * 0.2, script(nsz, { maxW, field: 'bride' }));
      s += T('&', cx, wy + nsz * 0.35, sf(40, { style: 'italic', fill: p.soft }));
      s += T(c.groom, cx, wy + nsz * 0.98, script(nsz, { maxW, field: 'groom' }));
      const blocks = [];
      const mw = W * 0.8;
      if (std) blocks.push({ h: 40, draw: (y) => T(TX.save, cx, y + 32, sf(34, { upper: true, ls: 0.3, fill: p.soft, weight: 500 })) });
      else { const inv = wrap(TX.inviteB, sf(34, { style: 'italic' }), mw); blocks.push({ h: inv.length * 46, draw: (y) => inv.map((l, i) => T(l, cx, y + 34 + i * 46, sf(34, { style: 'italic', fill: p.soft }))).join('') }); }
      blocks.push({ h: 54, gap: 26, draw: (y) => T(`${c.dp.d} ${c.dp.month} ${c.dp.y}`, cx, y + 45, sf(std ? 52 : 50, { upper: true, ls: 0.14, weight: 500, maxW: mw, field: 'date' })) });
      blocks.push({ h: 34, gap: 12, draw: (y) => T(TX.dayDot(c.dp), cx, y + 28, sf(29, { upper: true, ls: 0.22, fill: p.soft })) });
      blocks.push({ h: 44, gap: 30, draw: (y) => T(c.venue, cx, y + 35, sf(38, { weight: 600, maxW: mw, field: 'venue' })) });
      if (c.city) blocks.push({ h: 32, gap: 8, draw: (y) => T(c.city, cx, y + 25, sf(27, { upper: true, ls: 0.3, fill: p.soft })) });
      if (!std) blocks.push({ h: 30, gap: 34, draw: (y) => T(TX.rsvpB(c.dp.rsvp), cx, y + 23, sf(25, { style: 'italic', fill: p.soft, maxW: mw })) });
      s += flow(blocks, wy + R + 70, story ? H - 170 : H - W * 0.07);
      return s;
    }
    if (lay === 1) {
      art += wcCluster(W * 0.05, H * 0.03, W * 0.16, p, rnd, 1) + wcCluster(W * 0.95, H * 0.97, W * 0.16, p, rnd, 1);
      for (let i = 0; i < 6; i++) art += wcStem(W * 0.02, H * 0.02, W * (0.28 + rnd() * 0.16), 18 + i * 11, p.leaves, rnd, i % 2 ? 'euca' : 'olive') + wcStem(W * 0.98, H * 0.98, W * (0.28 + rnd() * 0.16), 198 + i * 11, p.leaves, rnd, i % 2 ? 'euca' : 'olive');
    } else {
      const top = std ? H * 0.12 : H * 0.1; const R = W * 0.36; const cy0 = top + R;
      for (let i = 0; i <= 30; i++) { const a = Math.PI + (i / 30) * Math.PI; const x = cx + Math.cos(a) * R, y = cy0 + Math.sin(a) * R; art += wcStem(x, y, W * 0.09, (a * 180) / Math.PI + (i % 2 ? 80 : -80), p.leaves, rnd, i % 2 ? 'euca' : 'olive'); }
      [0.15, 0.5, 0.85].forEach((t, i) => { const a = Math.PI + t * Math.PI; art += wcCluster(cx + Math.cos(a) * R, cy0 + Math.sin(a) * R, W * (i === 1 ? 0.09 : 0.07), p, rnd); });
      [-1, 1].forEach((sd) => { for (let i = 0; i < 3; i++) art += wcStem(cx + sd * R, cy0 + i * 30, W * 0.18, 90 + sd * (8 + i * 6), p.leaves, rnd, 'euca'); });
    }
    s += `<g filter="url(#${u}wc)" style="mix-blend-mode:multiply">${art}</g>`;
    maxW = W * 0.72; const nsz = std ? 132 : 150;
    const blocks = [];
    if (std) blocks.push({ h: 40, draw: (y) => T(TX.save, cx, y + 32, sf(34, { upper: true, ls: 0.3, fill: p.soft, weight: 500 })) });
    else { const inv = wrap(TX.inviteB, sf(34, { style: 'italic' }), maxW); blocks.push({ h: inv.length * 46, draw: (y) => inv.map((l, i) => T(l, cx, y + 34 + i * 46, sf(34, { style: 'italic', fill: p.soft }))).join('') }); }
    blocks.push({ h: nsz * 0.95, gap: 30, draw: (y) => T(c.bride, cx, y + nsz * 0.78, script(nsz, { maxW, field: 'bride' })) });
    blocks.push({ h: 44, gap: 0, draw: (y) => T('&', cx, y + 34, sf(42, { style: 'italic', fill: p.soft })) });
    blocks.push({ h: nsz * 0.95, gap: 0, draw: (y) => T(c.groom, cx, y + nsz * 0.78, script(nsz, { maxW, field: 'groom' })) });
    blocks.push({ h: 54, gap: 34, draw: (y) => T(`${c.dp.d} ${c.dp.month} ${c.dp.y}`, cx, y + 45, sf(std ? 52 : 50, { upper: true, ls: 0.14, weight: 500, maxW, field: 'date' })) });
    blocks.push({ h: 34, gap: 12, draw: (y) => T(TX.dayDot(c.dp), cx, y + 28, sf(29, { upper: true, ls: 0.22, fill: p.soft })) });
    blocks.push({ h: 44, gap: 30, draw: (y) => T(c.venue, cx, y + 35, sf(38, { weight: 600, maxW, field: 'venue' })) });
    if (c.city) blocks.push({ h: 32, gap: 8, draw: (y) => T(c.city, cx, y + 25, sf(27, { upper: true, ls: 0.3, fill: p.soft })) });
    if (!std) blocks.push({ h: 30, gap: 34, draw: (y) => T(TX.rsvpB(c.dp.rsvp), cx, y + 23, sf(25, { style: 'italic', fill: p.soft, maxW })) });
    const top = lay === 2 ? (std ? H * 0.34 : H * 0.3) : W * 0.16;
    s += flow(blocks, top, story ? H - 170 : H - W * 0.12);
    return s;
  }

  /* Stack blocks vertically and centre the stack between top and bottom. */
  function flow(blocks, top, bottom) {
    const total = blocks.reduce((t, b, i) => t + b.h + (i ? b.gap || 0 : 0), 0);
    let y = top + Math.max(0, (bottom - top - total) / 2); let s = '';
    blocks.forEach((b, i) => { if (i) y += b.gap || 0; s += b.draw(y); y += b.h; });
    return s;
  }

  /* Mobile (9:16) extras: a header and two tappable-looking chips, as a digital invitation would have. */
  function storyChrome(spec, W, H, ink, accent, bg) {
    const y = H - 96; const btn = (x, label) => `<g><rect x="${f1(x - 150)}" y="${f1(y - 34)}" width="300" height="64" rx="32" fill="${bg}" stroke="${accent}" stroke-width="1.6"/>${T(label, x, y + 8, { font: 'Jost Variable', size: 22, fill: ink, upper: true, ls: 0.2, weight: 500 })}</g>`;
    return T(TX.youre, W / 2, 74, { font: 'Jost Variable', size: 20, fill: accent, upper: true, ls: 0.5, weight: 500 }) + btn(W / 2 - 165, TX.loc) + btn(W / 2 + 165, TX.rsvpBtn);
  }

  /* ------------------------------------------------------------ public API */
  let seq = 0;
  function render(spec) {
    const [W, H] = FORMATS[spec.format] || FORMATS.print; const u = `iv${++seq}`;
    const c = copy(spec); NAMES = new Set([c.bride, c.groom, c.venue, c.city]); const D = DESIGNS[spec.design] || DESIGNS.timeless; const p = D.palettes[spec.palette || 0];
    const dark = !!p.dark;
    const defs = A.filters(u) + GOLD(u, 'gold', dark) + `<pattern id="${u}paper" width="240" height="240" patternUnits="userSpaceOnUse"><rect width="240" height="240" fill="${dark ? '#FFFFFF' : '#8A7355'}" filter="url(#${u}grain)" opacity="${dark ? 0.25 : 0.5}"/></pattern>`;
    let body = spec.design === 'modern' ? modern(c, spec, W, H, u) : spec.design === 'botanical' ? botanical(c, spec, W, H, u) : timeless(c, spec, W, H, u);
    if (spec.format === 'story') body += storyChrome(spec, W, H, dark ? '#F4E8D0' : (p.ink || '#333'), dark ? '#D9B877' : (p.accent || p.leaves?.[2] || '#B08843'), dark ? '#1F2842' : (p.bg || '#fff'));
    const label = TX.label(D.name, c);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}"><defs>${defs}</defs>${body}</svg>`;
  }

  /* Every web font the invitations use, so a page can preload them and an export can embed them. */
  const FONT_FILES = {
    'Cormorant Garamond Variable': ['@fontsource-variable/cormorant-garamond@5/files/cormorant-garamond', 'wght', true],
    'Playfair Display Variable': ['@fontsource-variable/playfair-display@5/files/playfair-display', 'wght', true],
    'Bodoni Moda Variable': ['@fontsource-variable/bodoni-moda@5/files/bodoni-moda', 'wght', true],
    'EB Garamond Variable': ['@fontsource-variable/eb-garamond@5/files/eb-garamond', 'wght', true],
    'Lora Variable': ['@fontsource-variable/lora@5/files/lora', 'wght', true],
    'Jost Variable': ['@fontsource-variable/jost@5/files/jost', 'wght', false],
    'Manrope Variable': ['@fontsource-variable/manrope@5/files/manrope', 'wght', false],
    'Pinyon Script': ['@fontsource/pinyon-script@5/files/pinyon-script', '400', false],
    'Great Vibes': ['@fontsource/great-vibes@5/files/great-vibes', '400', false],
    'Allura': ['@fontsource/allura@5/files/allura', '400', false],
    'Parisienne': ['@fontsource/parisienne@5/files/parisienne', '400', false],
    'Mrs Saint Delafield': ['@fontsource/mrs-saint-delafield@5/files/mrs-saint-delafield', '400', false],
  };
  const fontsIn = (svg) => Object.keys(FONT_FILES).filter((f) => svg.includes(`'${f}'`));
  function ready() {
    if (!document.fonts) return Promise.resolve();
    const loads = [];
    Object.keys(FONT_FILES).forEach((f) => { loads.push(document.fonts.load(`400 40px "${f}"`, 'Ağ Iİ şŞ çÇ')); if (FONT_FILES[f][2]) loads.push(document.fonts.load(`italic 400 40px "${f}"`, 'Ağ Iİ şŞ')); });
    return Promise.all(loads).catch(() => {});
  }
  const b64 = (buf) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };
  /* Inline the fonts (latin + latin-ext, so Turkish letters survive) for a self-contained SVG or a PNG. */
  async function embedFonts(svg) {
    const faces = [];
    for (const fam of fontsIn(svg)) {
      const [base, axis, italic] = FONT_FILES[fam];
      const styles = italic ? ['normal', 'italic'] : ['normal'];
      for (const st of styles) for (const sub of ['latin', 'latin-ext']) {
        const url = `https://cdn.jsdelivr.net/npm/${base}-${sub}-${axis}-${st}.woff2`;
        try { const r = await fetch(url); if (!r.ok) continue; faces.push(`@font-face{font-family:'${fam}';font-style:${st};font-weight:${axis === 'wght' ? '100 900' : '400'};src:url(data:font/woff2;base64,${b64(await r.arrayBuffer())}) format('woff2');}`); } catch (e) { /* offline: the export falls back to system fonts */ }
      }
    }
    return svg.replace('<defs>', `<defs><style>${faces.join('')}</style>`);
  }
  async function toPng(svg, scale = 1.5) {
    const full = await embedFonts(svg);
    const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(full); const w = +vb[1] * scale, h = +vb[2] * scale;
    const img = new Image(); const url = URL.createObjectURL(new Blob([full], { type: 'image/svg+xml' }));
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    return new Promise((res) => c.toBlob(res, 'image/png'));
  }

  g.DInvite = { render, ready, embedFonts, toPng, DESIGNS, FORMATS, dateParts, MONTHS, DAYS, LANG };
})(window);
