/* Düğün.com proposal · venue illustration for the decoration demo
   One historic hall drawn in true one-point perspective. The architecture layer (walls, arched windows,
   doors, chandeliers, floor) is identical in every version; only light, decoration and furniture change.
   That is exactly the promise of the feature: the same venue, restyled. Everything is drawn in code. */
(function (g) {
  'use strict';
  const A = g.DArt; const { f1 } = A;
  const W = 1600, H = 1000, VX = 800, HY = 470, F = 650, CAM = 1.6;
  const RX = 7, RY = 7, RZ = 12, ZN = 1.9;
  const P = (x, y, z) => [VX + (F * x) / z, HY + (F * (CAM - y)) / z];
  const pt = (x, y, z) => { const p = P(x, y, z); return `${f1(p[0])},${f1(p[1])}`; };
  const poly = (pts) => `M${pts.map((p) => pt(p[0], p[1], p[2])).join('L')}Z`;
  const S = (z) => F / z; // pixels per metre at depth z

  const MOOD = {
    original: { sky: ['#D3E3EC', '#EEF3F0'], fol: ['#9DB08C', '#B5C5A2', '#839A73'], wall: ['#F4EFE8', '#E6DDD1'], floor: ['#CDB497', '#B2967A'], ceil: ['#F7F3EE', '#E9E1D6'], lit: 0, shafts: 0.55, chandOn: false },
    classic: { sky: ['#27314F', '#B07E73'], fol: ['#28342C', '#34433A', '#1F2924'], wall: ['#EFE3D3', '#D2BEA4'], floor: ['#B49674', '#86694E'], ceil: ['#E7D8C5', '#C6B094'], lit: 1, shafts: 0, chandOn: true, tint: ['#FFAE5C', 0.2], vignette: 0.42 },
    minimal: { sky: ['#D8E8F1', '#F6F8F4'], fol: ['#A6BB92', '#C2D1AC', '#8CA27B'], wall: ['#F8F5F1', '#ECE6DE'], floor: ['#D8C4A8', '#C0A889'], ceil: ['#FBF9F6', '#F0EAE2'], lit: 0, shafts: 1, chandOn: false, tint: ['#FFFFFF', 0.06] },
    boho: { sky: ['#EE9D63', '#F9DDB1'], fol: ['#56633F', '#6C7A50', '#434E33'], wall: ['#F3E5D3', '#DDC6A8'], floor: ['#BB9A75', '#957555'], ceil: ['#F0DFC9', '#D6BE9E'], lit: 0.7, shafts: 0.3, chandOn: false, tint: ['#FFB265', 0.16], vignette: 0.2 },
  };

  /* ------------------------------------------------------------ helpers */
  // Points of an arched opening in a wall plane. side: 'L'|'R' (x = ∓RX, spans z) or 'B' (z = RZ, spans x).
  function archPts(side, a0, a1, sill, spring) {
    const r = (a1 - a0) / 2, c = (a0 + a1) / 2, pts = [];
    const at = (u, y) => (side === 'B' ? [u, y, RZ] : [side === 'L' ? -RX : RX, y, u]);
    pts.push(at(a0, sill), at(a0, spring));
    for (let i = 1; i < 16; i++) { const t = Math.PI - (i / 16) * Math.PI; pts.push(at(c + Math.cos(t) * r, spring + Math.sin(t) * r)); }
    pts.push(at(a1, spring), at(a1, sill));
    return pts;
  }
  const bbox = (pts) => { const p = pts.map((q) => P(q[0], q[1], q[2])); const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const ell = (x, y, z, r) => { const [cx, cy] = P(x, y, z); return [cx, cy, S(z) * r, Math.max(1.2, (F * Math.abs(CAM - y) * r) / (z * z))]; };

  /* The view through a window: sky, trees, and the time of day. */
  function view(u, id, pts, m, rnd) {
    const [x0, y0, x1, y1] = bbox(pts); const w = x1 - x0, h = y1 - y0;
    let s = `<clipPath id="${u}${id}"><path d="${poly(pts)}"/></clipPath><g clip-path="url(#${u}${id})"><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" fill="url(#${u}sky)"/>`;
    for (let i = 0; i < 9; i++) {
      const cx = x0 + rnd() * w, cy = y0 + h * (0.45 + rnd() * 0.5), r = w * (0.25 + rnd() * 0.35);
      s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r)}" ry="${f1(r * 0.9)}" fill="${m.fol[i % 3]}" opacity=".9" filter="url(#${u}blur6)"/>`;
    }
    return s + `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" fill="#FFFFFF" opacity=".12"/></g>`;
  }

  /* A side or back-wall window with frame, glass, glazing bars and sill. */
  function windowAt(u, id, side, a0, a1, sill, spring, m, rnd, door) {
    const fr = 0.16;
    const outer = archPts(side, a0 - fr, a1 + fr, door ? 0 : sill - 0.1, spring);
    const glass = archPts(side, a0, a1, sill, spring);
    let s = `<path d="${poly(outer)}" fill="url(#${u}frame)"/>`;
    s += view(u, id, glass, m, rnd);
    const at = (uu, y) => (side === 'B' ? [uu, y, RZ] : [side === 'L' ? -RX : RX, y, uu]);
    const c = (a0 + a1) / 2, r = (a1 - a0) / 2;
    const L = (p, q) => `M${pt(...p)}L${pt(...q)}`;
    let bars = L(at(c, sill), at(c, spring + r));
    if (door) { bars += L(at(a0 + (a1 - a0) * 0.25, sill), at(a0 + (a1 - a0) * 0.25, spring + r * 0.66)) + L(at(a0 + (a1 - a0) * 0.75, sill), at(a0 + (a1 - a0) * 0.75, spring + r * 0.66)); }
    [0.33, 0.66, 1].forEach((k) => { bars += L(at(a0, sill + (spring - sill) * k), at(a1, sill + (spring - sill) * k)); });
    for (let i = 1; i < 4; i++) { const t = Math.PI - (i / 4) * Math.PI; bars += L(at(c, spring), at(c + Math.cos(t) * r, spring + Math.sin(t) * r)); }
    s += `<path d="${bars}" stroke="#F7F1E8" stroke-width="${door ? 3 : 2.2}" fill="none" opacity=".95"/>`;
    s += `<path d="${poly(glass)}" fill="none" stroke="#E7DCCC" stroke-width="2"/>`;
    if (!door) s += `<path d="${poly([at(a0 - fr - 0.05, sill - 0.12), at(a1 + fr + 0.05, sill - 0.12), at(a1 + fr + 0.05, sill - 0.04), at(a0 - fr - 0.05, sill - 0.04)])}" fill="#FBF7F1"/>`;
    return s;
  }

  /* A brass-and-crystal chandelier hanging at (x, y, z). */
  function chandelier(u, x, y, z, on) {
    const s = S(z); const [cx, cy] = P(x, y, z); let o = '';
    o += `<path d="M${f1(cx)},-20V${f1(cy - s * 0.62)}" stroke="#A88A57" stroke-width="${f1(Math.max(1, s * 0.012))}"/>`;
    if (on) o += A.glow(cx, cy, s * 1.6, `${u}gwarm`, 0.55);
    const tiers = [[0.68, 0.11, 10, 0], [0.42, 0.07, 7, -0.32]];
    tiers.forEach(([rx, ry, n, dy]) => {
      const ty = cy + dy * s;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2; const ax = cx + Math.cos(t) * rx * s, ay = ty + Math.sin(t) * ry * s;
        const back = Math.sin(t) < 0;
        o += `<path d="M${f1(cx)},${f1(ty + 0.05 * s)}Q${f1((cx + ax) / 2)},${f1(ty + 0.16 * s)} ${f1(ax)},${f1(ay)}" stroke="#B8975E" stroke-width="${f1(Math.max(0.8, s * 0.014))}" fill="none" opacity="${back ? 0.6 : 1}"/>`;
        o += `<rect x="${f1(ax - s * 0.014)}" y="${f1(ay - s * 0.09)}" width="${f1(s * 0.028)}" height="${f1(s * 0.09)}" fill="#FBF6EC"/>`;
        o += on ? A.glow(ax, ay - s * 0.11, s * 0.08, `${u}gbulb`) + `<circle cx="${f1(ax)}" cy="${f1(ay - s * 0.11)}" r="${f1(s * 0.018)}" fill="#FFF6DA"/>` : `<ellipse cx="${f1(ax)}" cy="${f1(ay - s * 0.115)}" rx="${f1(s * 0.02)}" ry="${f1(s * 0.03)}" fill="#FFFFFF" opacity=".85"/>`;
        for (let k = 1; k <= 3; k++) o += `<ellipse cx="${f1((cx + ax) / 2 + (ax - cx) * 0.15)}" cy="${f1(ty + 0.16 * s + k * s * 0.05)}" rx="${f1(s * 0.008)}" ry="${f1(s * 0.016)}" fill="${on ? '#FFF1D6' : '#E8EEF2'}" opacity=".9"/>`;
      }
    });
    o += `<path d="M${f1(cx - s * 0.06)},${f1(cy - s * 0.6)}C${f1(cx - s * 0.12)},${f1(cy - s * 0.2)} ${f1(cx - s * 0.1)},${f1(cy + s * 0.1)} ${f1(cx)},${f1(cy + s * 0.24)}C${f1(cx + s * 0.1)},${f1(cy + s * 0.1)} ${f1(cx + s * 0.12)},${f1(cy - s * 0.2)} ${f1(cx + s * 0.06)},${f1(cy - s * 0.6)}Z" fill="url(#${u}brass)"/>`;
    for (let i = 0; i < 9; i++) { const t = (i / 9) * Math.PI * 2; o += `<ellipse cx="${f1(cx + Math.cos(t) * s * 0.5)}" cy="${f1(cy + s * 0.13 + Math.sin(t) * s * 0.06)}" rx="${f1(s * 0.012)}" ry="${f1(s * 0.03)}" fill="${on ? '#FFE9C2' : '#EEF3F5'}" opacity=".9"/>`; }
    return o;
  }

  /* ------------------------------------------------------------ the room */
  function architecture(u, m, style) {
    const rnd = A.rng(5); let s = '';
    // ceiling, back wall, side walls, floor
    s += `<path d="${poly([[-RX, RY, ZN], [RX, RY, ZN], [RX, RY, RZ], [-RX, RY, RZ]])}" fill="url(#${u}ceil)"/>`;
    s += `<path d="${poly([[-RX, 0, RZ], [RX, 0, RZ], [RX, RY, RZ], [-RX, RY, RZ]])}" fill="url(#${u}wallB)"/>`;
    s += `<path d="${poly([[-RX, 0, ZN], [-RX, RY, ZN], [-RX, RY, RZ], [-RX, 0, RZ]])}" fill="url(#${u}wallL)"/>`;
    s += `<path d="${poly([[RX, 0, ZN], [RX, RY, ZN], [RX, RY, RZ], [RX, 0, RZ]])}" fill="url(#${u}wallR)"/>`;
    s += `<path d="${poly([[-RX, 0, ZN], [RX, 0, ZN], [RX, 0, RZ], [-RX, 0, RZ]])}" fill="url(#${u}floor)"/>`;
    // floor planks
    let pl = '';
    for (let x = -RX; x <= RX + 0.01; x += 0.34) pl += `M${pt(x, 0, ZN)}L${pt(x, 0, RZ)}`;
    for (let x = -RX; x < RX; x += 0.34) { let z = ZN + rnd() * 1.6; while (z < RZ) { pl += `M${pt(x, 0, z)}L${pt(x + 0.34, 0, z)}`; z += 1.2 + rnd() * 1.4; } }
    s += `<path d="${pl}" stroke="#6E5440" stroke-width="1" opacity=".22" fill="none"/>`;
    // ceiling coffers
    let cf = '';
    [-4.6, -1.6, 1.6, 4.6].forEach((x) => { cf += `M${pt(x, RY, 6.6)}L${pt(x, RY, RZ)}`; });
    [7.6, 9.2, 10.6].forEach((z) => { cf += `M${pt(-RX, RY, z)}L${pt(RX, RY, z)}`; });
    s += `<path d="${cf}" stroke="#FFFFFF" stroke-width="5" opacity=".55" fill="none"/><path d="${cf}" stroke="#B9A88F" stroke-width="1.2" opacity=".45" fill="none" transform="translate(0,4)"/>`;
    // cornice and wainscot on all three walls
    const band = (y0, y1, fill, op) => `<path d="${poly([[-RX, y0, ZN], [-RX, y1, ZN], [-RX, y1, RZ], [-RX, y0, RZ]])}" fill="${fill}" opacity="${op}"/><path d="${poly([[RX, y0, ZN], [RX, y1, ZN], [RX, y1, RZ], [RX, y0, RZ]])}" fill="${fill}" opacity="${op}"/><path d="${poly([[-RX, y0, RZ], [RX, y0, RZ], [RX, y1, RZ], [-RX, y1, RZ]])}" fill="${fill}" opacity="${op}"/>`;
    s += band(6.35, 7, '#FFFFFF', 0.55) + band(6.25, 6.35, '#9D8A70', 0.35) + band(0, 0.18, '#FFFFFF', 0.6) + band(0.95, 1.02, '#FFFFFF', 0.7);
    let wp = '';
    [[2.4, 3.8], [4.4, 5.6], [8.2, 8.8], [11.0, 11.7]].forEach(([z0, z1]) => { wp += `<path d="${poly([[-RX, 0.3, z0], [-RX, 0.85, z0], [-RX, 0.85, z1], [-RX, 0.3, z1]])}"/><path d="${poly([[RX, 0.3, z0], [RX, 0.85, z0], [RX, 0.85, z1], [RX, 0.3, z1]])}"/>`; });
    for (let x = -6.6; x < 6.6; x += 1.32) if (Math.abs(x + 0.66) > 2) wp += `<path d="${poly([[x + 0.12, 0.3, RZ], [x + 1.2, 0.3, RZ], [x + 1.2, 0.85, RZ], [x + 0.12, 0.85, RZ]])}"/>`;
    s += `<g fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".75">${wp}</g>`;
    // pilasters
    const pil = (x, z, w, side) => side === 'B'
      ? `<path d="${poly([[x - w / 2, 0, RZ], [x + w / 2, 0, RZ], [x + w / 2, 6.25, RZ], [x - w / 2, 6.25, RZ]])}" fill="url(#${u}pil)"/>`
      : `<path d="${poly([[side * RX, 0, z - w / 2], [side * RX, 6.25, z - w / 2], [side * RX, 6.25, z + w / 2], [side * RX, 0, z + w / 2]])}" fill="url(#${u}pil)"/>`;
    [4.9, 8.5, 11.6].forEach((z) => { s += pil(0, z, 0.42, -1) + pil(0, z, 0.42, 1); });
    [-6.3, -2.55, 2.55, 6.3].forEach((x) => { s += pil(x, 0, 0.5, 'B'); });
    // windows and the garden doors
    s += windowAt(u, 'w1', 'L', 5.8, 7.8, 0.9, 4.0, m, rnd) + windowAt(u, 'w2', 'L', 9.2, 10.9, 0.9, 4.0, m, rnd);
    s += windowAt(u, 'w3', 'R', 5.8, 7.8, 0.9, 4.0, m, rnd) + windowAt(u, 'w4', 'R', 9.2, 10.9, 0.9, 4.0, m, rnd);
    s += windowAt(u, 'w5', 'B', -5.1, -3.6, 0.9, 3.9, m, rnd) + windowAt(u, 'w6', 'B', 3.6, 5.1, 0.9, 3.9, m, rnd);
    s += windowAt(u, 'dr', 'B', -1.6, 1.6, 0, 3.7, m, rnd, true);
    return s;
  }

  /* Daylight falling through the left windows onto the floor. */
  function shafts(u, k) {
    if (!k) return '';
    const L = [0.95, -1.15, 0.35]; let s = '';
    [[5.8, 7.8], [9.2, 10.9]].forEach(([z0, z1]) => {
      const win = archPts('L', z0, z1, 0.9, 4.0);
      const hit = win.map(([x, y, z]) => { const t = y / -L[1]; return [x + L[0] * t, 0, z + L[2] * t]; });
      s += `<path d="${poly(hit)}" fill="#FFF8EA" opacity="${f1(0.42 * k)}" filter="url(#${u}blur6)"/>`;
      s += `<path d="${poly([win[1], win[9], hit[9], hit[1]])}" fill="url(#${u}beam)" opacity="${f1(0.5 * k)}"/>`;
    });
    return s;
  }

  /* ------------------------------------------------------------ furniture and flowers */
  const ROSE = {
    white: { base: '#FFFFFF', mid: '#F3EEE6', edge: '#D9CFC1' },
    ivory: { base: '#FBF3E4', mid: '#F1E2C8', edge: '#D7C29C' },
    blush: { base: '#F6DCD6', mid: '#EFC7BF', edge: '#D3A097' },
    terra: { base: '#D98E6A', mid: '#C9744F', edge: '#A9573A' },
    dusty: { base: '#E3B2A6', mid: '#D49A8C', edge: '#B4776A' },
    cream: { base: '#F6E9D2', mid: '#EBD7B5', edge: '#CDB38A' },
  };

  /* A cluster of flowers centred at screen (cx, cy) inside radius r (pixels). */
  function bouquet(cx, cy, r, palette, rnd, o = {}) {
    let s = '';
    const leaves = o.leaves == null ? 10 : o.leaves;
    for (let i = 0; i < leaves; i++) { const a = rnd() * Math.PI * 2; s += A.leaf(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.5, r * (0.5 + rnd() * 0.4), (a * 180) / Math.PI + (rnd() - 0.5) * 40, o.green || (i % 2 ? '#7D8E6C' : '#97A685')); }
    const pts = []; const n = o.n || 16;
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * r * 0.82; pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * (o.squash || 0.85)]); }
    pts.sort((a, b) => a[1] - b[1]).forEach(([x, y], i) => { s += A.rose(x, y, r * (0.2 + rnd() * 0.12), ROSE[palette[i % palette.length]], rnd() * 360); });
    return s;
  }

  function chiavari(u, x, z, col) {
    const s = S(z); const [x0, yTop] = P(x - 0.2, 0.98, z); const [x1, ySeat] = P(x + 0.2, 0.47, z); const [, yF] = P(x, 0, z);
    const sw = f1(Math.max(0.8, s * 0.024));
    let d = `M${f1(x0)},${f1(yF)}V${f1(yTop)}M${f1(x1)},${f1(yF)}V${f1(yTop)}M${f1(x0)},${f1(yTop)}H${f1(x1)}`;
    [0.33, 0.66].forEach((k) => { const yy = yTop + (ySeat - yTop) * k; d += `M${f1(x0)},${f1(yy)}H${f1(x1)}`; });
    for (let i = 1; i < 4; i++) { const xx = x0 + ((x1 - x0) * i) / 4; d += `M${f1(xx)},${f1(yTop)}V${f1(ySeat)}`; }
    return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none"/><rect x="${f1(x0)}" y="${f1(ySeat - s * 0.03)}" width="${f1(x1 - x0)}" height="${f1(s * 0.05)}" rx="${f1(s * 0.02)}" fill="#FBF6EE"/>`;
  }
  function modernChair(u, x, z, col) {
    const s = S(z); const [x0, yTop] = P(x - 0.21, 0.86, z); const [x1, ySeat] = P(x + 0.21, 0.46, z); const [, yF] = P(x, 0, z);
    const sw = f1(Math.max(0.8, s * 0.02));
    return `<path d="M${f1(x0 + s * 0.03)},${f1(yF)}L${f1(x0 + s * 0.05)},${f1(ySeat)}M${f1(x1 - s * 0.03)},${f1(yF)}L${f1(x1 - s * 0.05)},${f1(ySeat)}" stroke="#C9BBA6" stroke-width="${sw}"/><path d="M${f1(x0)},${f1(ySeat)}V${f1(yTop + s * 0.06)}Q${f1(x0)},${f1(yTop)} ${f1(x0 + s * 0.06)},${f1(yTop)}H${f1(x1 - s * 0.06)}Q${f1(x1)},${f1(yTop)} ${f1(x1)},${f1(yTop + s * 0.06)}V${f1(ySeat)}Z" fill="${col}"/><rect x="${f1(x0 - s * 0.01)}" y="${f1(ySeat - s * 0.02)}" width="${f1(x1 - x0 + s * 0.02)}" height="${f1(s * 0.05)}" rx="${f1(s * 0.02)}" fill="${col}"/>`;
  }
  function crossChair(u, x, z) {
    const s = S(z); const [x0, yTop] = P(x - 0.21, 0.92, z); const [x1, ySeat] = P(x + 0.21, 0.46, z); const [, yF] = P(x, 0, z);
    const sw = f1(Math.max(0.9, s * 0.03));
    return `<path d="M${f1(x0)},${f1(yF)}V${f1(yTop)}M${f1(x1)},${f1(yF)}V${f1(yTop)}M${f1(x0)},${f1(yTop)}H${f1(x1)}M${f1(x0)},${f1(ySeat)}H${f1(x1)}M${f1(x0)},${f1(yTop + s * 0.04)}L${f1(x1)},${f1(ySeat - s * 0.02)}M${f1(x1)},${f1(yTop + s * 0.04)}L${f1(x0)},${f1(ySeat - s * 0.02)}" stroke="#7A5638" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  }

  /* Classic round table: floor-length cloth, gold chairs, tall floral centrepiece, candles. */
  function roundTable(u, x, z, rnd, lit) {
    const r = 0.85, h = 0.76; let s = '';
    const back = [50, 90, 130].map((d) => { const a = (d * Math.PI) / 180; return chiavari(u, x + Math.cos(a) * (r + 0.3), z + Math.sin(a) * (r + 0.3), '#C9A86A'); });
    s += back.join('');
    const [cx, cy, rx, ry] = ell(x, h, z, r); const [, fy, frx0, fry] = ell(x, 0, z, r * 1.04); const frx = frx0;
    s += `<ellipse cx="${f1(cx)}" cy="${f1(fy + fry * 0.3)}" rx="${f1(frx * 1.2)}" ry="${f1(fry * 1.3)}" fill="#3E2C1E" opacity=".25" filter="url(#${u}blur6)"/>`;
    s += `<path d="M${f1(cx - rx)},${f1(cy)}L${f1(cx - frx)},${f1(fy)}A${f1(frx)},${f1(fry)} 0 0 0 ${f1(cx + frx)},${f1(fy)}L${f1(cx + rx)},${f1(cy)}A${f1(rx)},${f1(ry)} 0 0 1 ${f1(cx - rx)},${f1(cy)}Z" fill="url(#${u}cloth)"/>`;
    let fd = ''; for (let i = 1; i < 12; i++) { const t = (i / 12) * Math.PI; fd += `M${f1(cx - Math.cos(t) * rx)},${f1(cy + Math.sin(t) * ry)}L${f1(cx - Math.cos(t) * frx)},${f1(fy + Math.sin(t) * fry)}`; }
    s += `<path d="${fd}" stroke="#D8CCBC" stroke-width="${f1(Math.max(0.6, S(z) * 0.012))}" opacity=".7"/>`;
    s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#FFFDF9"/>`;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; s += `<ellipse cx="${f1(cx + Math.cos(a) * rx * 0.72)}" cy="${f1(cy + Math.sin(a) * ry * 0.72)}" rx="${f1(rx * 0.11)}" ry="${f1(ry * 0.13)}" fill="none" stroke="#C9A86A" stroke-width="${f1(Math.max(0.6, S(z) * 0.012))}"/>`; }
    // centrepiece: gold stand, floral sphere, trailing greenery, candles
    const [, topY] = P(x, h + 1.25, z); const [, ballY] = P(x, h + 1.48, z); const br = S(z) * 0.44;
    for (let i = -2; i <= 2; i++) { const cxx = cx + i * rx * 0.16; const [, c0] = P(x, h + 0.16 + Math.abs(i) * 0.03, z); s += `<rect x="${f1(cxx - S(z) * 0.018)}" y="${f1(c0)}" width="${f1(S(z) * 0.036)}" height="${f1(cy - c0)}" fill="#FBF5E8"/>`; if (lit) s += A.glow(cxx, c0 - S(z) * 0.02, S(z) * 0.12, `${u}gbulb`); }
    s += `<path d="M${f1(cx)},${f1(cy)}L${f1(cx)},${f1(topY)}" stroke="url(#${u}brass)" stroke-width="${f1(S(z) * 0.035)}"/><ellipse cx="${f1(cx)}" cy="${f1(topY)}" rx="${f1(S(z) * 0.12)}" ry="${f1(S(z) * 0.03)}" fill="#C9A86A"/>`;
    if (lit) s += A.glow(cx, ballY, br * 2.2, `${u}gwarm`, 0.35);
    for (let i = 0; i < 5; i++) s += A.sprig(cx + (i - 2) * br * 0.4, ballY + br * 0.5, br * (1.1 + rnd() * 0.6), 80 + (i - 2) * 14, { rnd, fill: '#7F9070', n: 7, leaf: br * 0.22, sw: 0.8 });
    s += bouquet(cx, ballY, br, ['white', 'ivory', 'white', 'blush'], rnd, { n: 22, leaves: 14 });
    const front = [230, 270, 310].map((d) => { const a = (d * Math.PI) / 180; return chiavari(u, x + Math.cos(a) * (r + 0.32), z + Math.sin(a) * (r + 0.32), '#C9A86A'); });
    return { z, svg: s + front.join('') };
  }

  /* Long table (modern minimal or bohemian), with chairs on both sides and things along the top. */
  function longTable(u, xc, z0, z1, kind, rnd, lit) {
    const h = 0.76, hw = 0.5; const inner = xc < 0 ? xc + hw : xc - hw; const outer = xc < 0 ? xc - hw : xc + hw;
    let back = '', top = '', items = [], front = '';
    const chair = kind === 'boho' ? crossChair : modernChair; const ccol = kind === 'boho' ? '' : '#F4F1EC';
    for (let z = z1 - 0.4; z > z0 + 0.2; z -= 0.72) back += chair(u, outer + (xc < 0 ? -0.32 : 0.32), z, ccol);
    top += `<path d="${poly([[xc - hw - 0.15, 0, z0 - 0.1], [xc + hw + 0.15, 0, z0 - 0.1], [xc + hw + 0.15, 0, z1 + 0.1], [xc - hw - 0.15, 0, z1 + 0.1]])}" fill="#3E2C1E" opacity=".22" filter="url(#${u}blur6)"/>`;
    const wood = kind === 'boho' ? `url(#${u}woodD)` : `url(#${u}woodL)`;
    [[inner, z0 + 0.12], [outer, z0 + 0.12], [inner, z1 - 0.12]].forEach(([lx, lz]) => { top += `<path d="M${pt(lx + (xc < 0 ? -0.06 : 0.06), h - 0.05, lz)}L${pt(lx + (xc < 0 ? -0.06 : 0.06), 0, lz)}" stroke="${kind === 'boho' ? '#5E412B' : '#B89E7E'}" stroke-width="${f1(S(lz) * 0.05)}"/>`; });
    top += `<path d="${poly([[inner, h, z0], [inner, h, z1], [inner, h - 0.06, z1], [inner, h - 0.06, z0]])}" fill="${kind === 'boho' ? '#5E412B' : '#B89E7E'}"/>`;
    top += `<path d="${poly([[xc - hw, h - 0.06, z0], [xc + hw, h - 0.06, z0], [xc + hw, h, z0], [xc - hw, h, z0]])}" fill="${kind === 'boho' ? '#4E3624' : '#A88E6E'}"/>`;
    top += `<path d="${poly([[xc - hw, h, z0], [xc + hw, h, z0], [xc + hw, h, z1], [xc - hw, h, z1]])}" fill="${wood}"/>`;
    if (kind === 'minimal') top += `<path d="${poly([[xc - 0.18, h + 0.002, z0], [xc + 0.18, h + 0.002, z0], [xc + 0.18, h + 0.002, z1], [xc - 0.18, h + 0.002, z1]])}" fill="#F4EFE6" opacity=".95"/>`;
    // place settings
    for (let z = z1 - 0.4; z > z0 + 0.2; z -= 0.72) [xc - 0.3, xc + 0.3].forEach((px) => { const [ex, ey, erx, ery] = ell(px, h + 0.005, z, 0.13); top += `<ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="${f1(erx)}" ry="${f1(ery)}" fill="#FFFFFF" stroke="${kind === 'boho' ? '#C9A86A' : '#D9D2C7'}" stroke-width=".8"/>`; });
    // centre-line decoration
    if (kind === 'boho') {
      let gar = ''; for (let z = z1; z > z0; z -= 0.09) { const [gx, gy] = P(xc + (rnd() - 0.5) * 0.12, h + 0.03, z); gar += A.leaf(gx, gy, S(z) * (0.1 + rnd() * 0.06), rnd() * 360, ['#6F7F5C', '#8C9B76', '#5D6B4B'][Math.floor(rnd() * 3)]); }
      top += gar;
    }
    for (let z = z1 - 0.3; z > z0 + 0.3; z -= 0.55) items.push(z);
    items.sort((a, b) => b - a).forEach((z, i) => {
      const s = S(z); const [ix, iy] = P(xc, h, z);
      if (kind === 'minimal') {
        if (i % 2 === 0) {
          top += `<path d="M${f1(ix - s * 0.05)},${f1(iy)}Q${f1(ix - s * 0.07)},${f1(iy - s * 0.12)} ${f1(ix - s * 0.03)},${f1(iy - s * 0.16)}H${f1(ix + s * 0.03)}Q${f1(ix + s * 0.07)},${f1(iy - s * 0.12)} ${f1(ix + s * 0.05)},${f1(iy)}Z" fill="#FFFFFF" stroke="#E4DDD2" stroke-width=".6"/>`;
          for (let k = 0; k < 3; k++) { const ex = ix + (k - 1) * s * 0.07, ey = iy - s * (0.36 + rnd() * 0.12); top += `<path d="M${f1(ix)},${f1(iy - s * 0.15)}Q${f1((ix + ex) / 2)},${f1(ey + s * 0.1)} ${f1(ex)},${f1(ey)}" stroke="#7E8E6E" stroke-width="${f1(Math.max(0.6, s * 0.008))}" fill="none"/>` + A.blossom(ex, ey, s * 0.035, '#FFFFFF', '#E8D9B5', rnd() * 90); }
        } else {
          [-0.06, 0.06].forEach((dx) => { const [tx, ty] = P(xc + dx, h + 0.32, z); top += `<rect x="${f1(tx - s * 0.008)}" y="${f1(ty)}" width="${f1(s * 0.016)}" height="${f1(iy - ty)}" fill="#FBFAF7"/><ellipse cx="${f1(tx)}" cy="${f1(ty - s * 0.02)}" rx="${f1(s * 0.008)}" ry="${f1(s * 0.018)}" fill="#FFD48A"/>`; });
        }
      } else {
        if (i % 2 === 0) {
          top += `<path d="M${f1(ix - s * 0.03)},${f1(iy)}V${f1(iy - s * 0.12)}L${f1(ix - s * 0.012)},${f1(iy - s * 0.18)}H${f1(ix + s * 0.012)}L${f1(ix + s * 0.03)},${f1(iy - s * 0.12)}V${f1(iy)}Z" fill="#C88A3F" opacity=".85"/>`;
          top += bouquet(ix, iy - s * 0.28, s * 0.13, ['terra', 'dusty', 'cream', 'blush'], rnd, { n: 6, leaves: 6, green: '#768456' });
          top += A.pampas(ix, iy - s * 0.18, s * 0.42, -100 + (rnd() - 0.5) * 40, '#E8D7BA', rnd, 0.7);
        } else {
          top += `<rect x="${f1(ix - s * 0.04)}" y="${f1(iy - s * 0.1)}" width="${f1(s * 0.08)}" height="${f1(s * 0.1)}" rx="${f1(s * 0.01)}" fill="#D8933F" opacity=".75"/>` + A.glow(ix, iy - s * 0.08, s * 0.16, `${u}gbulb`, lit ? 1 : 0.6);
        }
      }
    });
    for (let z = z1 - 0.4; z > z0 + 0.2; z -= 0.72) front += chair(u, inner + (xc < 0 ? 0.32 : -0.32), z, ccol);
    return { z: (z0 + z1) / 2, svg: back + top + front };
  }

  /* String lights strung across the hall (bohemian). */
  function festoon(u, z, rnd) {
    const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; const x = -RX + 2 * RX * t; const y = 5.5 - Math.sin(t * Math.PI) * 1.25; pts.push(P(x, y, z)); }
    let s = `<path d="${A.smooth(pts)}" stroke="#3B2E24" stroke-width="${f1(Math.max(0.6, S(z) * 0.01))}" fill="none" opacity=".7"/>`;
    pts.forEach(([x, y], i) => { if (i % 1 === 0) { const r = S(z) * 0.04; s += `<path d="M${f1(x)},${f1(y)}V${f1(y + r * 1.4)}" stroke="#3B2E24" stroke-width=".8" opacity=".6"/>` + A.glow(x, y + r * 2.2, r * 5, `${u}gbulb`) + `<circle cx="${f1(x)}" cy="${f1(y + r * 2.2)}" r="${f1(r)}" fill="#FFF3D1"/>`; } });
    return s;
  }

  /* What stands in front of the garden doors. */
  function stage(u, style, m, rnd) {
    let s = ''; const zA = 11.85;
    if (style === 'classic') {
      // floral arch around the doors, white drapes, and a head table
      for (let i = 0; i <= 26; i++) { const t = Math.PI - (i / 26) * Math.PI; const [ax, ay] = P(Math.cos(t) * 1.95, 3.7 + Math.sin(t) * 1.95, zA); s += bouquet(ax, ay, S(zA) * (0.32 + rnd() * 0.12), ['white', 'ivory', 'white', 'blush'], rnd, { n: 7, leaves: 6 }); }
      [-1, 1].forEach((sd) => { for (let i = 0; i < 7; i++) { const [ax, ay] = P(sd * 1.95, 3.6 - i * 0.55, zA); s += bouquet(ax, ay, S(zA) * 0.3, ['white', 'ivory', 'blush'], rnd, { n: 6, leaves: 5 }); } });
      [-1, 1].forEach((sd) => { const [x0, y0] = P(sd * 2.5, 6.2, zA); const [x1, y1] = P(sd * 3.3, 0, zA); s += `<path d="M${f1(x0)},${f1(y0)}C${f1(x0 + sd * 10)},${f1((y0 + y1) / 2)} ${f1(x1 - sd * 30)},${f1(y1 - 40)} ${f1(x1)},${f1(y1)}H${f1(x1 - sd * 50)}C${f1(x1 - sd * 50)},${f1(y1 - 120)} ${f1(x0 - sd * 30)},${f1((y0 + y1) / 2)} ${f1(x0 - sd * 26)},${f1(y0)}Z" fill="#FFFFFF" opacity=".75"/>`; });
      const zt = 10.6; const [tx0, ty] = P(-2.8, 0.76, zt); const [tx1] = P(2.8, 0.76, zt); const [, fy] = P(0, 0, zt);
      s += `<rect x="${f1(tx0)}" y="${f1(ty)}" width="${f1(tx1 - tx0)}" height="${f1(fy - ty)}" fill="url(#${u}cloth)"/><rect x="${f1(tx0)}" y="${f1(ty - 3)}" width="${f1(tx1 - tx0)}" height="5" fill="#FFFFFF"/>`;
      for (let i = 0; i < 18; i++) { const [gx] = P(-2.7 + i * 0.32, 0.76, zt); s += bouquet(gx, ty + 2, S(zt) * 0.16, ['white', 'blush', 'ivory'], rnd, { n: 4, leaves: 4 }); }
    } else if (style === 'minimal') {
      const [cx, cy] = P(0, 2.5, 11.3); const r = S(11.3) * 1.75;
      s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="none" stroke="url(#${u}brass)" stroke-width="${f1(S(11.3) * 0.06)}"/>`;
      const cl = (a, n, sc) => { const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; let o = ''; for (let i = 0; i < 4; i++) o += A.pampas(x, y, r * 0.55 * sc, (a * 180) / Math.PI + 160 + i * 22 + (rnd() - 0.5) * 10, '#E6DAC6', rnd, 0.9); for (let i = 0; i < 6; i++) o += A.leaf(x, y, r * (0.22 + rnd() * 0.15) * sc, (a * 180) / Math.PI + 90 + i * 40, i % 2 ? '#93A383' : '#B2BEA2'); for (let i = 0; i < n; i++) o += A.blossom(x + (rnd() - 0.5) * r * 0.3 * sc, y + (rnd() - 0.5) * r * 0.24 * sc, r * 0.07 * sc, '#FFFFFF', '#E9D7B4', rnd() * 90); return o; };
      s += cl((215 * Math.PI) / 180, 14, 1.5) + cl((35 * Math.PI) / 180, 8, 1.05);
      [-1, 1].forEach((sd) => { const [px, py] = P(sd * 2.6, 0.5, 11.2); const [, pf] = P(0, 0, 11.2); const pw = S(11.2) * 0.42; s += `<rect x="${f1(px - pw / 2)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(pf - py)}" fill="#F4F0EA"/>`; s += A.pampas(px, py, S(11.2) * 1.2, -90 + sd * 12, '#E3D5BE', rnd, 1.1) + A.pampas(px, py, S(11.2) * 1, -90 - sd * 18, '#EDE3D2', rnd, 1); });
    } else if (style === 'boho') {
      const z = 11.5; const [rx0, ry0] = P(-1.9, 0, 9.4); const [rx1] = P(1.9, 0, 9.4);
      s += `<path d="${poly([[-1.8, 0, 9.3], [1.8, 0, 9.3], [1.8, 0, 11.3], [-1.8, 0, 11.3]])}" fill="#A4553A"/><path d="${poly([[-1.6, 0.001, 9.45], [1.6, 0.001, 9.45], [1.6, 0.001, 11.15], [-1.6, 0.001, 11.15]])}" fill="none" stroke="#E7C79A" stroke-width="3"/>`;
      let rug = ''; for (let i = 0; i < 9; i++) { const zz = 9.6 + i * 0.18; rug += `<path d="${poly([[-1.4, 0.002, zz], [1.4, 0.002, zz], [1.4, 0.002, zz + 0.07], [-1.4, 0.002, zz + 0.07]])}" fill="${i % 3 === 0 ? '#E7C79A' : i % 3 === 1 ? '#5E6D7A' : '#7D3A2A'}" opacity=".8"/>`; } s += rug;
      // round wooden arch with pampas and dried flowers
      const [cx, cy] = P(0, 2.6, z); const R = S(z) * 2.0;
      s += `<path d="M${f1(cx - R)},${f1(P(0, 0, z)[1])}V${f1(cy)}A${f1(R)},${f1(R)} 0 0 1 ${f1(cx + R)},${f1(cy)}V${f1(P(0, 0, z)[1])}" fill="none" stroke="#8A6444" stroke-width="${f1(S(z) * 0.07)}"/>`;
      const burst = (a0, a1, n) => { let o = ''; for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * rnd(); const bx = cx + Math.cos(a) * R, by = cy - Math.abs(Math.sin(a)) * R; o += A.pampas(bx, by, R * (0.5 + rnd() * 0.4), (a * 180) / Math.PI + 180 + (rnd() - 0.5) * 60, ['#E9D8BC', '#DCC6A2', '#F2E6D3'][i % 3], rnd, 1.2); } return o; };
      s += burst(Math.PI * 0.62, Math.PI * 0.98, 14) + burst(Math.PI * 0.02, Math.PI * 0.3, 9);
      [[Math.PI * 0.78, 1], [Math.PI * 0.14, 0.8]].forEach(([a, k]) => { const bx = cx + Math.cos(a) * R, by = cy - Math.sin(a) * R; s += bouquet(bx, by, R * 0.3 * k, ['terra', 'dusty', 'cream', 'blush', 'terra'], rnd, { n: 12, leaves: 12, green: '#6E7C53' }); });
      const [lx, ly] = P(-1.2, 0, 10.2); const [lx2] = P(1.2, 0, 10.2); [lx, lx2].forEach((x) => { const s2 = S(10.2); s += `<path d="M${f1(x - s2 * 0.12)},${f1(ly)}V${f1(ly - s2 * 0.4)}L${f1(x)},${f1(ly - s2 * 0.52)}L${f1(x + s2 * 0.12)},${f1(ly - s2 * 0.4)}V${f1(ly)}Z" fill="#3D2E22" opacity=".85"/>` + A.glow(x, ly - s2 * 0.2, s2 * 0.4, `${u}gbulb`) + `<circle cx="${f1(x)}" cy="${f1(ly - s2 * 0.2)}" r="${f1(s2 * 0.04)}" fill="#FFE7B0"/>`; });
    }
    return s;
  }

  /* Classic swags along the cornice and tall drapes beside the side windows. */
  function drapes(u) {
    let s = '';
    [-1, 1].forEach((sd) => {
      [[3.0, 5.2], [5.2, 8.4], [8.4, 11.2]].forEach(([z0, z1]) => {
        const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(P(sd * RX, 6.2 - Math.sin(t * Math.PI) * 0.7, z0 + (z1 - z0) * t)); }
        const top = [P(sd * RX, 6.25, z1), P(sd * RX, 6.25, z0)];
        s += `<path d="${A.smooth(pts)}L${f1(top[0][0])},${f1(top[0][1])}L${f1(top[1][0])},${f1(top[1][1])}Z" fill="#FFFFFF" opacity=".72"/>`;
      });
      [5.55, 8.05, 8.95, 11.15].forEach((z) => { s += `<path d="${poly([[sd * RX, 0, z - 0.2], [sd * RX, 6.2, z - 0.14], [sd * RX, 6.2, z + 0.14], [sd * RX, 0, z + 0.2]])}" fill="#FFFFFF" opacity=".8"/>`; });
    });
    return s;
  }

  /* ------------------------------------------------------------ assemble */
  A.venue = function (style, opts = {}) {
    const m = MOOD[style] || MOOD.original; const u = `v${style}`; const rnd = A.rng(42);
    const defs = A.filters(u) + `
      <linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.sky[0]}"/><stop offset="1" stop-color="${m.sky[1]}"/></linearGradient>
      <linearGradient id="${u}ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.ceil[1]}"/><stop offset="1" stop-color="${m.ceil[0]}"/></linearGradient>
      <linearGradient id="${u}wallB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.wall[1]}"/><stop offset=".55" stop-color="${m.wall[0]}"/><stop offset="1" stop-color="${m.wall[1]}"/></linearGradient>
      <linearGradient id="${u}wallL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${m.wall[1]}"/><stop offset="1" stop-color="${m.wall[0]}"/></linearGradient>
      <linearGradient id="${u}wallR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${m.wall[1]}"/><stop offset="1" stop-color="${m.wall[0]}"/></linearGradient>
      <linearGradient id="${u}floor" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${m.floor[1]}"/><stop offset="1" stop-color="${m.floor[0]}"/></linearGradient>
      <linearGradient id="${u}frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF7F1"/><stop offset="1" stop-color="#EDE4D8"/></linearGradient>
      <linearGradient id="${u}pil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".1"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset="1" stop-color="#9C8B73" stop-opacity=".18"/></linearGradient>
      <linearGradient id="${u}beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFBF0" stop-opacity=".55"/><stop offset="1" stop-color="#FFFBF0" stop-opacity="0"/></linearGradient>
      <linearGradient id="${u}cloth" x1="0" x2="1"><stop offset="0" stop-color="#E4DACB"/><stop offset=".3" stop-color="#FBF8F3"/><stop offset=".6" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DDD1C0"/></linearGradient>
      <linearGradient id="${u}brass" x1="0" x2="1"><stop offset="0" stop-color="#9C7C45"/><stop offset=".45" stop-color="#E8CF95"/><stop offset="1" stop-color="#A9874C"/></linearGradient>
      <linearGradient id="${u}woodL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2CFB2"/><stop offset="1" stop-color="#CDB494"/></linearGradient>
      <linearGradient id="${u}woodD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E6646"/><stop offset="1" stop-color="#6E4C32"/></linearGradient>
      <radialGradient id="${u}gwarm"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".9"/><stop offset=".4" stop-color="#FFC27A" stop-opacity=".35"/><stop offset="1" stop-color="#FFB060" stop-opacity="0"/></radialGradient>
      <radialGradient id="${u}gbulb"><stop offset="0" stop-color="#FFF4D6" stop-opacity="1"/><stop offset=".3" stop-color="#FFD58C" stop-opacity=".55"/><stop offset="1" stop-color="#FFB45E" stop-opacity="0"/></radialGradient>
      <radialGradient id="${u}vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#1A1008" stop-opacity="0"/><stop offset="1" stop-color="#1A1008" stop-opacity="1"/></radialGradient>`;
    let body = architecture(u, m, style);
    body += shafts(u, m.shafts);
    if (style === 'classic') body += drapes(u);
    body += stage(u, style, m, rnd);
    if (style === 'classic') { body += `<path d="${poly([[-0.9, 0.003, ZN], [0.9, 0.003, ZN], [0.9, 0.003, 10.2], [-0.9, 0.003, 10.2]])}" fill="#FBF7F0" opacity=".9"/>`; for (let i = 0; i < 70; i++) { const z = ZN + rnd() * 8; const [px, py] = P((rnd() > 0.5 ? 1 : -1) * (0.75 + rnd() * 0.35), 0.004, z); body += A.blossom(px, py, S(z) * 0.03, rnd() > 0.4 ? '#FFFFFF' : '#F3D6D0', '#F3E6D6', rnd() * 90); } }
    if (style === 'boho') { body += `<path d="${poly([[-0.8, 0.003, ZN], [0.8, 0.003, ZN], [0.8, 0.003, 9.2], [-0.8, 0.003, 9.2]])}" fill="#C9A27A" opacity=".55"/><path d="${poly([[-0.62, 0.004, ZN], [0.62, 0.004, ZN], [0.62, 0.004, 9.2], [-0.62, 0.004, 9.2]])}" fill="none" stroke="#F1DEC0" stroke-width="2" opacity=".7"/>`; }
    body += chandelier(u, 0, 4.7, 9.0, m.chandOn) + chandelier(u, 0, 4.55, 5.3, m.chandOn);
    const objs = [];
    if (style === 'classic') [[-2.7, 9.2], [2.7, 9.2], [-4.9, 6.8], [4.9, 6.8], [-2.3, 6.4], [2.3, 6.4], [-3.4, 3.7], [3.4, 3.7]].forEach(([x, z]) => objs.push(roundTable(u, x, z, rnd, true)));
    if (style === 'minimal') { objs.push(longTable(u, -2.3, 2.15, 10.2, 'minimal', rnd, false)); objs.push(longTable(u, 2.3, 2.15, 10.2, 'minimal', rnd, false)); }
    if (style === 'boho') { objs.push(longTable(u, -2.4, 2.15, 9.0, 'boho', rnd, true)); objs.push(longTable(u, 2.4, 2.15, 9.0, 'boho', rnd, true)); }
    objs.sort((a, b) => b.z - a.z).forEach((o) => { body += o.svg; });
    if (style === 'boho') [9.6, 7.4, 5.4, 3.6].forEach((z) => { body += festoon(u, z, rnd); });
    if (m.tint) body += `<rect width="${W}" height="${H}" fill="${m.tint[0]}" opacity="${m.tint[1]}" style="mix-blend-mode:soft-light"/>`;
    if (m.vignette) body += `<rect width="${W}" height="${H}" fill="url(#${u}vig)" opacity="${m.vignette}"/>`;
    body += `<rect width="${W}" height="${H}" filter="url(#${u}grain)" opacity=".6"/>`;
    return A.svg(W, H, defs, body, `preserveAspectRatio="xMidYMid slice"${opts.label ? ` role="img" aria-label="${opts.label}"` : ' aria-hidden="true"'}`);
  };
  A.venueUrl = (style) => A.url(`v:${style}`, () => A.venue(style));
  A.VENUE_STYLES = Object.keys(MOOD);
})(window);
