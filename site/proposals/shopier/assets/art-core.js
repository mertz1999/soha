/* Shopier proposal · illustration core (shared with the Düğün.com proposal)
   Small helpers shared by the product, scene and people artwork:
   seeded randomness, smooth paths, limbs, leaves, flowers, glows and the SVG wrapper.
   Everything is drawn in code, so there are no photographs and no external images. */
(function (g) {
  'use strict';
  const A = (g.SArt = g.SArt || {});
  const f1 = (n) => Math.round(n * 10) / 10;
  A.f1 = f1;

  /* Deterministic random numbers (xorshift32), so every drawing is identical on every load. */
  A.rng = function (seed) {
    let s = (Math.imul(seed | 0 || 1, 2654435761) >>> 0) || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  };

  /* Catmull-Rom curve through points. `through` returns only the C segments, so it can extend another path. */
  A.through = function (pts, closed) {
    const n = pts.length; let d = '';
    const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
    }
    return d;
  };
  A.smooth = (pts, closed) => `M${f1(pts[0][0])},${f1(pts[0][1])}${A.through(pts, closed)}${closed ? 'Z' : ''}`;
  A.mirror = (pts, cx = 300) => pts.map(([x, y]) => [2 * cx - x, y]);

  /* A tapered limb (arm, sleeve, stem) from a centre line and a width at every point. */
  A.limb = function (c, w) {
    const L = [], R = [];
    for (let i = 0; i < c.length; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const h = w[i] / 2;
      L.push([c[i][0] - ty * h, c[i][1] + tx * h]); R.push([c[i][0] + ty * h, c[i][1] - tx * h]);
    }
    return A.smooth(L.concat(R.reverse()), true);
  };

  /* A leaf with its base at (x, y), pointing at `ang` degrees. */
  A.leaf = (x, y, len, ang, fill, wid, extra = '') => {
    const w = wid || len * 0.36;
    return `<path d="M0,0C${f1(len * 0.22)},${f1(-w / 2)} ${f1(len * 0.68)},${f1(-w / 2)} ${f1(len)},0C${f1(len * 0.68)},${f1(w / 2)} ${f1(len * 0.22)},${f1(w / 2)} 0,0Z" transform="translate(${f1(x)},${f1(y)}) rotate(${f1(ang)})" fill="${fill}"${extra}/>`;
  };

  /* A stem with alternating leaves, for olive, eucalyptus and greenery sprays. */
  A.sprig = (x, y, len, ang, o = {}) => {
    const rnd = o.rnd || A.rng(7); const col = o.fill || '#8E9B7E'; const leafLen = o.leaf || len * 0.22;
    const a = (ang * Math.PI) / 180; const bend = o.bend == null ? 0.18 : o.bend;
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; const off = Math.sin(t * Math.PI) * len * bend; pts.push([x + Math.cos(a) * len * t - Math.sin(a) * off, y + Math.sin(a) * len * t + Math.cos(a) * off]); }
    let s = `<path d="${A.smooth(pts)}" fill="none" stroke="${o.stem || col}" stroke-width="${o.sw || 1.1}" stroke-linecap="round"/>`;
    const n = o.n || 9;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 0.6); const k = Math.min(5, Math.floor(t * 6)); const u = t * 6 - k;
      const p = [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u];
      const side = i % 2 ? 1 : -1; const la = ang + side * (38 + rnd() * 20);
      const ll = leafLen * (0.7 + 0.5 * Math.sin(t * Math.PI)) * (0.85 + rnd() * 0.3);
      const fills = o.fills || [col];
      s += A.leaf(p[0], p[1], ll, la, fills[i % fills.length], ll * (o.round || 0.36), o.leafExtra || '');
    }
    if (o.tip !== false) s += A.leaf(pts[6][0], pts[6][1], leafLen * 0.8, ang, (o.fills || [col])[0], leafLen * 0.28);
    return s;
  };

  /* A rose seen from above: a soft disc and spiral petal edges. `c` = { base, mid, edge }. */
  A.rose = (x, y, r, c, rot = 0) => {
    const R = f1(r);
    let s = `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(rot)})"><circle r="${R}" fill="${c.base}"/>`;
    for (let i = 0; i < 5; i++) { const a = (i * 72 * Math.PI) / 180; s += `<circle cx="${f1(Math.cos(a) * r * 0.3)}" cy="${f1(Math.sin(a) * r * 0.3)}" r="${f1(r * 0.68)}" fill="${c.mid}" opacity=".5"/>`; }
    if (r > 2.2) {
      const sw = f1(Math.max(0.4, r * 0.07));
      s += `<path d="M${f1(-r * 0.78)},${f1(r * 0.1)}A${f1(r * 0.8)},${f1(r * 0.8)} 0 0 1 ${f1(r * 0.55)},${f1(-r * 0.6)}M${f1(r * 0.7)},${f1(-r * 0.2)}A${f1(r * 0.75)},${f1(r * 0.75)} 0 0 1 ${f1(-r * 0.2)},${f1(r * 0.72)}M${f1(-r * 0.42)},${f1(-r * 0.12)}A${f1(r * 0.45)},${f1(r * 0.45)} 0 0 1 ${f1(r * 0.38)},${f1(-r * 0.05)}A${f1(r * 0.3)},${f1(r * 0.3)} 0 0 1 ${f1(-r * 0.05)},${f1(r * 0.32)}A${f1(r * 0.16)},${f1(r * 0.16)} 0 0 1 ${f1(-r * 0.15)},${f1(r * 0.02)}" fill="none" stroke="${c.edge}" stroke-width="${sw}" stroke-linecap="round" opacity=".75"/>`;
    }
    return s + '</g>';
  };

  /* A small five-petal blossom (filler flowers, lace, crowns). */
  A.blossom = (x, y, r, fill, center = '#E9D3A3', rot = 0) => {
    let s = `<g transform="translate(${f1(x)},${f1(y)}) rotate(${f1(rot)})">`;
    for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="${f1(-r * 0.55)}" rx="${f1(r * 0.42)}" ry="${f1(r * 0.6)}" fill="${fill}" transform="rotate(${i * 72})"/>`;
    return s + `<circle r="${f1(r * 0.26)}" fill="${center}"/></g>`;
  };

  /* A pampas plume: a curved stem with feathery strands. */
  A.pampas = (x, y, len, ang, col, rnd, wid = 1) => {
    rnd = rnd || A.rng(3);
    const a = (ang * Math.PI) / 180, nx = Math.cos(a), ny = Math.sin(a);
    const bend = (rnd() - 0.5) * 0.3;
    let s = `<g stroke="${col}" stroke-linecap="round" fill="none">`;
    const P = (t) => [x + nx * len * t - ny * Math.sin(t * Math.PI) * len * bend, y + ny * len * t + nx * Math.sin(t * Math.PI) * len * bend];
    s += `<path d="M${f1(x)},${f1(y)}L${f1(P(1)[0])},${f1(P(1)[1])}" stroke-width="${f1(0.9 * wid)}" opacity=".7"/>`;
    for (let i = 0; i < 46; i++) {
      const t = 0.3 + (i / 46) * 0.7; const [px, py] = P(t);
      const fl = len * 0.16 * Math.sin(((t - 0.3) / 0.7) * Math.PI) * (0.7 + rnd() * 0.5) * wid;
      const side = i % 2 ? 1 : -1; const da = a + side * (0.5 + rnd() * 0.35);
      s += `<path d="M${f1(px)},${f1(py)}q${f1(Math.cos(da) * fl * 0.6)},${f1(Math.sin(da) * fl * 0.6)} ${f1(Math.cos(da - side * 0.25) * fl)},${f1(Math.sin(da - side * 0.25) * fl)}" stroke-width="${f1((0.5 + rnd() * 0.6) * wid)}" opacity="${f1(0.35 + rnd() * 0.4)}"/>`;
    }
    return s + '</g>';
  };

  /* A soft round glow (candles, bulbs, chandeliers). Needs a radial gradient id. */
  A.glow = (x, y, r, gid, op = 1) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#${gid})" opacity="${op}"/>`;

  /* Shared SVG filters. `u` keeps ids unique when several drawings sit on one page. */
  A.filters = (u) => `
    <filter id="${u}blur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="${u}blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="${u}blur14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="${u}grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer></filter>
    <filter id="${u}wc" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".5"/></filter>`;

  A.svg = (w, h, defs, body, attrs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ${attrs}><defs>${defs}</defs>${body}</svg>`;

  /* Turn an SVG string into a cached object URL, so big drawings are rasterised once and reused as <img>. */
  const cache = new Map();
  A.url = function (key, make) {
    if (cache.has(key)) return cache.get(key);
    const u = URL.createObjectURL(new Blob([make()], { type: 'image/svg+xml' }));
    cache.set(key, u); return u;
  };
})(window);
