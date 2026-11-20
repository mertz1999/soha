/* Shopier proposal · product and scene artwork
   Three fictional demo products (the Hilal handbag, the Damla earrings and the Gül serum) and the scenes
   they are photographed in. Every scene draws the *same* product drawing, so shape, colour, material and
   hardware stay identical across all variations; only the set, light and props change.
   These drawings are the fallback for the photos in assets/photos/. Canvas: 1200 × 1200. */
(function (g) {
  'use strict';
  const A = g.SArt; const { f1, limb } = A;

  /* ---------------------------------------------------------------- gradient helpers */
  const stops = (s) => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
  const lg = (id, s, x2 = 0, y2 = 1, x1 = 0, y1 = 0) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(s)}</linearGradient>`;
  const rg = (id, s, cx = 0.5, cy = 0.5, r = 0.5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(s)}</radialGradient>`;
  const blur = (id, d) => `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${d}"/></filter>`;
  // Fine dark speckle for leather and frosted glass.
  const pgrain = (u) => `<filter id="${u}pgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="11" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .18  0 0 0 0 .1  0 0 0 0 .04  1 0 0 0 -.35"/></filter>`;
  const GOLD = [[0, '#8A6420'], [0.28, '#E3BE62'], [0.45, '#FFF1BC'], [0.6, '#D8AC4C'], [1, '#93701F']];

  /* ---------------------------------------------------------------- the products
     Local coordinates: the point where the product touches the surface is (0, 0); it extends upwards.
     h = drawing height, w = footprint width, real = height relative to the handbag (for scene scale). */
  const PRODUCTS = {
    bag: { h: 330, w: 340, real: 1, zoom: 1 },
    earrings: { h: 150, w: 230, real: 0.19, zoom: 3.3 },
    serum: { h: 345, w: 128, real: 0.58, zoom: 1.55 },
  };

  function bag(u) {
    const body = 'M-166,-192C-170,-118 -152,-44 -100,-12C-74,2 -40,4 0,4C40,4 74,2 100,-12C152,-44 170,-118 166,-192Z';
    const flap = 'M-169,-195H169C167,-150 128,-99 0,-91C-128,-99 -167,-150 -169,-195Z';
    const rim = 'M-166,-192C-150,-209 150,-209 166,-192C150,-199 -150,-199 -166,-192Z';
    const hc = [[-98, -196], [-100, -244], [-84, -290], [-44, -318], [0, -326], [44, -318], [84, -290], [100, -244], [98, -196]];
    const handle = limb(hc, hc.map(() => 21));
    const handleHi = limb(hc.map(([x, y]) => [x * 0.985, y - 4]), hc.map(() => 6));
    const tab = (x) => `<path d="M${x - 15},-206h30v30q0,9 -9,9h-12q-9,0 -9,-9Z" fill="url(#${u}pflap)" stroke="#4A2A12" stroke-width="1.6"/>
      <path d="M${x - 10},-200v22M${x + 10},-200v22" stroke="#E6BC86" stroke-width="1.1" stroke-dasharray="3 3" opacity=".75"/>
      <circle cx="${x}" cy="-206" r="10" fill="none" stroke="url(#${u}pgold)" stroke-width="4.5"/>`;
    return {
      defs: lg(`${u}pbody`, [[0, '#7F4A22'], [0.16, '#B3743D'], [0.38, '#C98B50'], [0.62, '#BB7C43'], [0.86, '#9A5E2E'], [1, '#74431E']], 1, 0)
        + lg(`${u}pflap`, [[0, '#8C552A'], [0.2, '#C88B50'], [0.4, '#D9A065'], [0.66, '#C2844A'], [1, '#86502A']], 1, 0)
        + lg(`${u}pshade`, [[0, '#000', 0], [0.55, '#000', 0], [1, '#2A1405', 0.42]])
        + lg(`${u}pflapsh`, [[0, '#FFF3DC', 0.22], [0.35, '#FFF3DC', 0], [1, '#2A1405', 0.18]])
        + lg(`${u}phand`, [[0, '#D9A065'], [0.5, '#B8783F'], [1, '#8A5328']])
        + lg(`${u}pgold`, GOLD, 1, 1)
        + `<clipPath id="${u}pclip"><path d="${body}"/><path d="${flap}"/></clipPath>`,
      svg: `<path d="${handle}" fill="url(#${u}phand)" stroke="#4A2A12" stroke-width="1.6"/>
        <path d="${handleHi}" fill="#F4CB94" opacity=".35"/>
        <path d="${body}" fill="url(#${u}pbody)"/><path d="${body}" fill="url(#${u}pshade)"/>
        <path d="${body}" fill="none" stroke="#4A2A12" stroke-width="2.4"/>
        <path d="${body}" fill="none" stroke="#E9C08A" stroke-width="1.5" stroke-dasharray="5 4" opacity=".55" transform="translate(0,-100) scale(.95) translate(0,100)"/>
        <path d="${rim}" fill="#5E3416"/><path d="M-160,-195C-140,-203 140,-203 160,-195" stroke="#D9A065" stroke-width="2" fill="none" opacity=".8"/>
        <path d="${flap}" fill="#2A1405" opacity=".35" transform="translate(0,7)" filter="url(#${u}pb4)"/>
        <path d="${flap}" fill="url(#${u}pflap)"/><path d="${flap}" fill="url(#${u}pflapsh)"/>
        <path d="${flap}" fill="none" stroke="#4A2A12" stroke-width="2.4"/>
        <path d="M-156,-190C-152,-150 -116,-108 0,-101C116,-108 152,-150 156,-190" fill="none" stroke="#EDC690" stroke-width="1.6" stroke-dasharray="5 4" opacity=".7"/>
        <g clip-path="url(#${u}pclip)"><rect x="-180" y="-220" width="360" height="230" filter="url(#${u}pgrain)" opacity=".28"/></g>
        ${tab(-98)}${tab(98)}
        <g transform="translate(0,-104)"><rect x="-21" y="-14" width="42" height="28" rx="9" fill="url(#${u}pgold)" stroke="#6E4E14" stroke-width="1.2"/>
          <rect x="-15" y="-9" width="30" height="18" rx="6" fill="none" stroke="#FFF1BC" stroke-width="1" opacity=".7"/>
          <circle r="7.5" fill="url(#${u}pgold)" stroke="#6E4E14" stroke-width="1.2"/><rect x="-2" y="-7" width="4" height="14" rx="2" fill="#7A5716" opacity=".7"/></g>`,
    };
  }

  function earrings(u) {
    const one = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})">
      <circle r="42" fill="none" stroke="#6E5014" stroke-width="16" opacity=".35" transform="translate(2,3)"/>
      <circle r="42" fill="none" stroke="url(#${u}pgold)" stroke-width="15"/>
      <path d="M-30,-30A42,42 0 0 1 22,-36" fill="none" stroke="#FFF6D2" stroke-width="3.2" stroke-linecap="round" opacity=".85"/>
      <path d="M38,18A42,42 0 0 1 10,40" fill="none" stroke="#FFF1BC" stroke-width="2" stroke-linecap="round" opacity=".6"/>
      <circle cy="49" r="6" fill="none" stroke="url(#${u}pgold)" stroke-width="4"/>
      <g transform="translate(0,76)"><ellipse rx="19" ry="23" fill="url(#${u}ppearl)"/><ellipse rx="19" ry="23" fill="url(#${u}piris)"/>
        <ellipse cx="-6" cy="-9" rx="5" ry="7" fill="#FFFFFF" opacity=".85"/><ellipse rx="19" ry="23" fill="none" stroke="#B9AD9C" stroke-width=".8" opacity=".7"/></g></g>`;
    return {
      defs: lg(`${u}pgold`, GOLD, 1, 1)
        + rg(`${u}ppearl`, [[0, '#FFFFFF'], [0.45, '#F6F0E6'], [0.8, '#E3D8C8'], [1, '#C7BAA6']], 0.38, 0.32, 0.7)
        + lg(`${u}piris`, [[0, '#F5D3DA', 0.35], [0.5, '#D9E6F2', 0], [1, '#E8DCC0', 0.4]], 1, 1),
      svg: one(-64, -98, 1) + one(68, -95, 1.02),
    };
  }

  function serum(u) {
    const bodyP = 'M-64,-206C-64,-226 -50,-236 -30,-236H30C50,-236 64,-226 64,-206V-10C64,-4 60,0 54,0H-54C-60,0 -64,-4 -64,-10Z';
    return {
      defs: lg(`${u}pglass`, [[0, '#C98F86'], [0.2, '#EDC8C0'], [0.42, '#F7DFD9'], [0.7, '#E9BDB4'], [1, '#C4877E']], 1, 0)
        + lg(`${u}pliq`, [[0, '#B76F67', 0], [0.4, '#B76F67', 0.18], [1, '#9C5750', 0.3]])
        + lg(`${u}pbulb`, [[0, '#D9D1C5'], [0.4, '#FBF8F3'], [1, '#CFC5B7']], 1, 0)
        + lg(`${u}pgold`, GOLD, 1, 0)
        + `<clipPath id="${u}pclip"><path d="${bodyP}"/></clipPath>`,
      svg: `<path d="M-23,-262C-25,-300 -20,-338 0,-344C20,-338 25,-300 23,-262Z" fill="url(#${u}pbulb)" stroke="#BFB4A5" stroke-width="1"/>
        <path d="M-10,-300C-11,-318 -8,-332 -2,-336" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
        <rect x="-31" y="-266" width="62" height="34" rx="5" fill="url(#${u}pgold)" stroke="#6E4E14" stroke-width="1"/>
        <path d="M-31,-258H31M-31,-250H31M-31,-242H31" stroke="#7A5716" stroke-width="1" opacity=".45"/>
        <path d="${bodyP}" fill="url(#${u}pglass)"/>
        <g clip-path="url(#${u}pclip)"><rect x="-70" y="-200" width="140" height="200" fill="url(#${u}pliq)"/>
          <rect x="-48" y="-228" width="11" height="216" rx="5" fill="#FFFFFF" opacity=".42" filter="url(#${u}pb4)"/>
          <rect x="50" y="-220" width="4" height="200" rx="2" fill="#FFFFFF" opacity=".5"/>
          <rect x="-70" y="-170" width="140" height="94" fill="#F8F2EA"/>
          <path d="M-70,-164H70M-70,-82H70" stroke="#B48A4A" stroke-width="1.4"/>
          <rect x="-70" y="-170" width="140" height="200" filter="url(#${u}pgrain)" opacity=".12"/></g>
        <g transform="translate(0,-126)" fill="none" stroke="#B48A4A" stroke-width="1.5"><circle r="17"/>
          <path d="M0,-8C6,-8 8,-2 4,2C0,6 -6,4 -6,-1C-6,-5 -2,-6 1,-4M-9,7C-4,11 4,11 9,7"/></g>
        <path d="M-26,-98H26" stroke="#B48A4A" stroke-width="1" opacity=".7"/>
        <path d="${bodyP}" fill="none" stroke="#B9867E" stroke-width="1.2" opacity=".7"/>`,
    };
  }
  const DRAW = { bag, earrings, serum };

  /* The product alone on a transparent background (used by the campaign layouts). */
  const BOX = { bag: [-182, -340, 364, 352], earrings: [-128, -152, 256, 160], serum: [-72, -350, 144, 356] };
  A.product = function (kind) {
    const u = `cut${kind}`; const p = DRAW[kind](u); const b = BOX[kind];
    const defs = blur(`${u}pb4`, 4) + A.filters(u) + pgrain(u) + p.defs;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.join(' ')}" width="${b[2] * 2}" height="${b[3] * 2}"><defs>${defs}</defs>${p.svg}</svg>`;
  };
  A.productUrl = (kind) => A.url(`cut:${kind}`, () => A.product(kind));
  A.PRODUCT_BOX = BOX;

  /* ---------------------------------------------------------------- scene building blocks */
  const W = 1200;
  const bokeh = (rnd, n, area, cols, rmin, rmax, op) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = area[0] + rnd() * area[2], y = area[1] + rnd() * area[3], r = rmin + rnd() * (rmax - rmin);
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${cols[i % cols.length]}" opacity="${f1(op[0] + rnd() * (op[1] - op[0]))}"/>`;
    }
    return s;
  };
  const veins = (rnd, n, y0, y1, col, op) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      let x = rnd() * W, y = y0 + rnd() * (y1 - y0); const pts = [[x, y]];
      for (let k = 0; k < 5; k++) { x += 90 + rnd() * 160; y += (rnd() - 0.4) * 60; pts.push([x, y]); }
      s += `<path d="${A.smooth(pts)}" stroke="${col}" stroke-width="${f1(1 + rnd() * 3)}" fill="none" opacity="${f1(op * (0.5 + rnd() * 0.5))}"/>`;
    }
    return s;
  };
  const leafShadow = (x, y, len, ang, op) => {
    let s = `<g transform="translate(${x},${y}) rotate(${ang})" fill="#4E3A26" opacity="${op}">`;
    s += `<path d="M0,0L${len},6L${len},-6Z" />`;
    for (let i = 1; i <= 9; i++) {
      const t = (i / 10) * len; const l = len * 0.42 * Math.sin((i / 10) * Math.PI) + 40;
      s += `<path d="M${f1(t)},0C${f1(t + l * 0.3)},${f1(-l * 0.22)} ${f1(t + l * 0.75)},${f1(-l * 0.6)} ${f1(t + l * 0.95)},${f1(-l * 0.95)}C${f1(t + l * 0.55)},${f1(-l * 0.5)} ${f1(t + l * 0.2)},${f1(-l * 0.1)} ${f1(t + 14)},0Z"/>`;
      s += `<path d="M${f1(t)},0C${f1(t + l * 0.3)},${f1(l * 0.22)} ${f1(t + l * 0.75)},${f1(l * 0.6)} ${f1(t + l * 0.95)},${f1(l * 0.95)}C${f1(t + l * 0.55)},${f1(l * 0.5)} ${f1(t + l * 0.2)},${f1(l * 0.1)} ${f1(t + 14)},0Z"/>`;
    }
    return s + '</g>';
  };
  const lemon = (u, x, y, r, rot) => `<g transform="translate(${x},${y}) rotate(${rot})"><ellipse rx="${r}" ry="${f1(r * 0.78)}" fill="url(#${u}lem)"/>
    <path d="M${r},0q${f1(r * 0.16)},-${f1(r * 0.06)} ${f1(r * 0.2)},0q-${f1(r * 0.04)},${f1(r * 0.08)} -${f1(r * 0.2)},0Z" fill="#D2A421"/>
    <ellipse cx="${f1(-r * 0.3)}" cy="${f1(-r * 0.32)}" rx="${f1(r * 0.3)}" ry="${f1(r * 0.14)}" fill="#FFF6C4" opacity=".55"/>
    ${A.leaf(-r * 0.9, -r * 0.2, r * 1.1, 200, '#4E7A3A', r * 0.45)}</g>`;
  const ornament = (u, x, y, r) => `<g transform="translate(${x},${y})"><circle r="${r}" fill="url(#${u}orn)"/><circle cx="${f1(-r * 0.35)}" cy="${f1(-r * 0.35)}" r="${f1(r * 0.22)}" fill="#FFF6D2" opacity=".8"/>
    <rect x="${f1(-r * 0.22)}" y="${f1(-r * 1.18)}" width="${f1(r * 0.44)}" height="${f1(r * 0.26)}" rx="2" fill="url(#${u}gld)"/></g>`;
  const pine = (x, y, len, ang, rnd) => A.sprig(x, y, len, ang, { rnd, fill: '#2E5B43', fills: ['#2E5B43', '#3F7458', '#24493A'], n: 26, leaf: len * 0.16, round: 0.12, sw: 3, stem: '#3A2A1E', bend: 0.08 });

  /* ---------------------------------------------------------------- the scenes
     Each returns { defs, bg, fg, over, place: { x, y, h }, shadow }. `fg` is drawn in front of the product
     (inside the camera zoom), `over` on top of everything (light, grain, vignette). h is the handbag height. */
  const S = {};

  S.original = (u) => ({
    defs: lg(`${u}w`, [[0, '#DEDDD9'], [1, '#CFCDC8']]) + lg(`${u}t`, [[0, '#C8C3BB'], [1, '#B4AEA4']])
      + rg(`${u}flash`, [[0, '#FFFFFF', 0.38], [1, '#FFFFFF', 0]], 0.46, 0.56, 0.55) + rg(`${u}vig`, [[0.55, '#000', 0], [1, '#000', 0.32]], 0.5, 0.5, 0.75),
    bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/><rect y="770" width="${W}" height="430" fill="url(#${u}t)"/><path d="M0,770H1200" stroke="#A39C92" stroke-width="3"/>
      <g transform="translate(940,330)"><rect width="118" height="118" rx="10" fill="#ECEBE7" stroke="#C3C0BA" stroke-width="3"/><circle cx="41" cy="59" r="7" fill="#9E9A93"/><circle cx="77" cy="59" r="7" fill="#9E9A93"/></g>
      <path d="M999,448C1004,560 1016,650 1062,724C1100,784 1150,806 1200,812" stroke="#3B3B3B" stroke-width="6" fill="none" opacity=".75"/>`,
    fg: '',
    over: `<rect width="${W}" height="${W}" fill="url(#${u}flash)"/><rect width="${W}" height="${W}" fill="#7C90A6" opacity=".09"/><rect width="${W}" height="${W}" fill="url(#${u}vig)"/>`,
    place: { x: 560, y: 905, h: 470, rot: -2 }, shadow: 'flash',
  });

  S['studio-1'] = (u) => ({
    defs: lg(`${u}w`, [[0, '#E6DED2'], [0.5, '#F3EEE6'], [0.72, '#EFE8DD'], [1, '#E0D6C7']]),
    bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/>
      <path d="M-100,-100H520L1200,900V1300H900Z" fill="#FFFFFF" opacity=".28" filter="url(#${u}b40)"/>`,
    fg: '', over: '',
    place: { x: 600, y: 880, h: 520 }, shadow: 'soft',
  });

  S['studio-2'] = (u) => {
    const rnd = A.rng(21); let pores = '';
    for (let i = 0; i < 70; i++) pores += `<ellipse cx="${f1(340 + rnd() * 520)}" cy="${f1(870 + rnd() * 330)}" rx="${f1(3 + rnd() * 9)}" ry="${f1(1 + rnd() * 2)}" fill="#BFA98A" opacity="${f1(0.25 + rnd() * 0.35)}"/>`;
    for (let i = 0; i < 6; i++) pores += `<path d="M330,${f1(880 + i * 52 + rnd() * 20)}H870" stroke="#D2BFA4" stroke-width="${f1(1 + rnd() * 2)}" opacity=".5"/>`;
    return {
      defs: lg(`${u}w`, [[0, '#E2D6C6'], [1, '#D6C8B5']]) + lg(`${u}pl`, [[0, '#D5C4AA'], [0.35, '#F1E6D6'], [0.7, '#E6D7C1'], [1, '#C9B697']], 1, 0)
        + `<clipPath id="${u}plc"><rect x="330" y="836" width="540" height="400"/></clipPath>`,
      bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/>
        <path d="M-100,-100H600L1200,700V1300H700Z" fill="#FFFFFF" opacity=".22" filter="url(#${u}b40)"/>
        <ellipse cx="760" cy="980" rx="380" ry="260" fill="#8A7458" opacity=".22" filter="url(#${u}b40)"/>
        <rect x="330" y="836" width="540" height="400" fill="url(#${u}pl)"/><g clip-path="url(#${u}plc)">${pores}</g>
        <ellipse cx="600" cy="836" rx="270" ry="42" fill="#F3EADD"/><ellipse cx="600" cy="836" rx="270" ry="42" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".6"/>`,
      fg: '', over: '',
      place: { x: 600, y: 842, h: 440 }, shadow: 'soft',
    };
  };

  S['studio-3'] = (u) => ({
    defs: lg(`${u}w`, [[0, '#EBDDC8'], [1, '#DCC9AE']]) + lg(`${u}lg`, [[0, '#DECDB3'], [1, '#CDB898']]) + lg(`${u}bk`, [[0, '#EADCC6'], [1, '#DCCAB0']], 1, 0),
    bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/>
      <path d="M200,-100H1300V600L640,900Z" fill="#FFF3DA" opacity=".35" filter="url(#${u}b40)"/>
      <g filter="url(#${u}b6)">${leafShadow(1260, -60, 760, 132, 0.16)}${leafShadow(1320, 220, 620, 150, 0.12)}</g>
      <rect y="880" width="${W}" height="320" fill="url(#${u}lg)"/><rect y="878" width="${W}" height="4" fill="#F4E9D8"/>
      <rect x="400" y="806" width="400" height="80" fill="url(#${u}bk)"/><rect x="400" y="804" width="400" height="5" fill="#F6ECDD"/>
      <path d="M800,806L900,880H800Z" fill="#6B5640" opacity=".18"/>`,
    fg: '', over: '',
    place: { x: 600, y: 808, h: 440 }, shadow: 'soft',
  });

  S['lifestyle-1'] = (u) => {
    const rnd = A.rng(5);
    return {
      defs: lg(`${u}sky`, [[0, '#BFD8E8'], [1, '#E9F0F1']]) + lg(`${u}sea`, [[0, '#4E8AB2'], [1, '#7DB0CB']]) + lg(`${u}mb`, [[0, '#F3F1EC'], [1, '#E3DFD8']])
        + lg(`${u}cup`, [[0, '#E9E6E0'], [0.4, '#FFFFFF'], [1, '#D9D5CE']], 1, 0) + rg(`${u}sun`, [[0, '#FFF3D6', 0.55], [1, '#FFF3D6', 0]], 0.2, 0.1, 0.7),
      bg: `<g filter="url(#${u}b6)"><rect width="${W}" height="800" fill="url(#${u}sky)"/><rect y="560" width="${W}" height="240" fill="url(#${u}sea)"/>
          <path d="M760,566C820,540 900,530 980,548C1040,560 1100,556 1200,540V572H760Z" fill="#8BA6B0" opacity=".7"/>
          <rect width="420" height="800" fill="#F4F0E8"/><rect x="90" y="120" width="230" height="520" fill="#3E6E9A"/>
          ${Array.from({ length: 13 }, (_, i) => `<rect x="100" y="${134 + i * 38}" width="210" height="18" fill="#356189"/>`).join('')}
          <g fill="#4E6B3A" opacity=".9"><circle cx="1050" cy="250" r="140"/><circle cx="1160" cy="380" r="120"/><circle cx="930" cy="160" r="90"/></g></g>
        <rect y="770" width="${W}" height="430" fill="url(#${u}mb)"/>${veins(rnd, 9, 790, 1200, '#A9A49C', 0.45)}
        <path d="M0,770H1200" stroke="#FFFFFF" stroke-width="3" opacity=".8"/>
        <g transform="translate(250,850)"><ellipse cx="0" cy="40" rx="110" ry="26" fill="#000" opacity=".12" filter="url(#${u}b6)"/>
          <ellipse cx="0" cy="30" rx="100" ry="22" fill="url(#${u}cup)" stroke="#D6D2CB" stroke-width="1.5"/>
          <path d="M-52,-60H52C50,-10 34,22 0,24C-34,22 -50,-10 -52,-60Z" fill="url(#${u}cup)" stroke="#D6D2CB" stroke-width="1.5"/>
          <path d="M50,-44C84,-44 84,-6 46,-6" fill="none" stroke="#E6E2DB" stroke-width="9"/>
          <ellipse cx="0" cy="-60" rx="52" ry="11" fill="#FFFFFF"/><ellipse cx="0" cy="-58" rx="44" ry="8" fill="#5A3721"/></g>`,
      fg: `<g opacity=".95">${A.sprig(1240, 1120, 380, 200, { rnd, fill: '#7E8F6C', fills: ['#7E8F6C', '#93A281', '#6C7D5B'], n: 14, leaf: 52, sw: 2, bend: 0.1 })}</g>`,
      over: `<rect width="${W}" height="${W}" fill="url(#${u}sun)"/>`,
      place: { x: 690, y: 935, h: 500 }, shadow: 'soft',
    };
  };

  S['lifestyle-2'] = (u) => {
    const rnd = A.rng(9); let bloom = '';
    for (let i = 0; i < 46; i++) { const x = rnd() * 420 - 40, y = rnd() * 330 - 40; bloom += A.blossom(x, y, 14 + rnd() * 16, ['#D23C84', '#E35A9A', '#C02F74'][i % 3], '#F5E6B8', rnd() * 70); }
    let lv = ''; for (let i = 0; i < 26; i++) lv += A.leaf(rnd() * 440 - 40, rnd() * 360 - 40, 40 + rnd() * 30, rnd() * 360, ['#4F7A3A', '#3E6A2E'][i % 2]);
    return {
      defs: lg(`${u}sky`, [[0, '#A9CFE4'], [0.8, '#EFE6D6']]) + lg(`${u}sea`, [[0, '#2F6F9B'], [1, '#5E9AC0']]) + lg(`${u}ld`, [[0, '#EDE0CB'], [0.12, '#E2D2B9'], [0.14, '#CDB896'], [1, '#B9A27F']])
        + rg(`${u}sun`, [[0, '#FFF0CC', 0.6], [1, '#FFF0CC', 0]], 0.1, 0.05, 0.75),
      bg: `<g filter="url(#${u}b6)"><rect width="${W}" height="880" fill="url(#${u}sky)"/><rect y="600" width="${W}" height="280" fill="url(#${u}sea)"/>
          <path d="M620,606C700,570 820,560 900,584C960,600 1040,590 1200,566V612H620Z" fill="#7E99A6" opacity=".8"/>
          <path d="M0,690H1200" stroke="#FFFFFF" stroke-width="4" opacity=".25"/></g>
        <rect y="880" width="${W}" height="320" fill="url(#${u}ld)"/><path d="M0,880H1200" stroke="#FFF8EA" stroke-width="3"/>`,
      fg: `<g filter="url(#${u}b2x)">${lv}${bloom}</g>`,
      over: `<rect width="${W}" height="${W}" fill="url(#${u}sun)"/>`,
      place: { x: 650, y: 900, h: 500 }, shadow: 'sun',
    };
  };

  S['lifestyle-3'] = (u) => {
    const rnd = A.rng(13); let grain = '';
    for (let i = 0; i < 14; i++) grain += `<path d="M0,${f1(900 + i * 22 + rnd() * 10)}C300,${f1(895 + i * 22 + rnd() * 20)} 800,${f1(905 + i * 22 + rnd() * 20)} 1200,${f1(900 + i * 22)}" stroke="#4A2C1A" stroke-width="1.5" fill="none" opacity=".3"/>`;
    let stems = ''; for (let i = 0; i < 7; i++) stems += A.pampas(330 + (i - 3) * 8, 640, 230 + rnd() * 80, -90 + (i - 3) * 9, '#CDB48E', rnd, 1.1);
    return {
      defs: lg(`${u}w`, [[0, '#E7DCCE'], [1, '#D9CAB7']]) + lg(`${u}top`, [[0, '#8A5A3A'], [1, '#6B4229']]) + lg(`${u}fr`, [[0, '#5E3A25'], [1, '#4A2C1B']])
        + lg(`${u}vase`, [[0, '#B9A58C'], [0.4, '#E8DCCB'], [1, '#A8937A']], 1, 0),
      bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/>
        <path d="M120,-80H620L980,880H400Z" fill="#FFF6E6" opacity=".42" filter="url(#${u}b40)"/>
        <g filter="url(#${u}b6)"><rect x="760" y="150" width="300" height="380" fill="#CDB89D"/><rect x="784" y="174" width="252" height="332" fill="#E9DDCB"/>
          <circle cx="880" cy="300" r="70" fill="#B7795C"/><rect x="900" y="330" width="100" height="140" fill="#8E9A82"/></g>
        <rect y="858" width="${W}" height="44" fill="url(#${u}top)"/><rect y="900" width="${W}" height="300" fill="url(#${u}fr)"/>${grain}
        <path d="M0,858H1200" stroke="#B07E58" stroke-width="2" opacity=".7"/>
        <g transform="translate(150,0)"><rect x="40" y="806" width="300" height="52" fill="#E8DECC"/><rect x="40" y="806" width="300" height="6" fill="#F6EFE3"/>
          <rect x="56" y="760" width="270" height="46" fill="#8E9A80"/><rect x="30" y="716" width="290" height="44" fill="#C9A27E"/>
          ${stems}<path d="M140,716C130,690 134,660 150,640H210C226,660 230,690 220,716Z" fill="url(#${u}vase)"/></g>`,
      fg: '', over: '',
      place: { x: 730, y: 862, h: 470 }, shadow: 'soft',
    };
  };

  S['luxury-1'] = (u) => ({
    defs: rg(`${u}bg`, [[0, '#262C78'], [0.45, '#0B0F34'], [1, '#04051A']], 0.5, 0.25, 0.8) + lg(`${u}ped`, [[0, '#0B0D22'], [0.3, '#2A2F5C'], [0.42, '#3A4078'], [0.6, '#181B3C'], [1, '#07081A']], 1, 0)
      + rg(`${u}vi`, [[0, '#7A2BFF', 0.38], [1, '#7A2BFF', 0]]) + lg(`${u}fade`, [[0, '#FFFFFF', 0.5], [0.5, '#FFFFFF', 0]]),
    bg: `<rect width="${W}" height="${W}" fill="url(#${u}bg)"/>
      <path d="M520,-40H680L960,850H240Z" fill="#C9CCFF" opacity=".1" filter="url(#${u}b20)"/>
      <ellipse cx="600" cy="600" rx="380" ry="320" fill="url(#${u}vi)"/>
      <rect x="370" y="846" width="460" height="400" fill="url(#${u}ped)"/>
      <ellipse cx="600" cy="846" rx="230" ry="34" fill="#1A1E44"/><ellipse cx="600" cy="846" rx="230" ry="34" fill="none" stroke="#6F78D8" stroke-width="2" opacity=".55"/>`,
    fg: '', over: '',
    place: { x: 600, y: 850, h: 470 }, shadow: 'reflect',
  });

  S['luxury-2'] = (u) => {
    const fold = (d, id, o = 1) => `<path d="${d}" fill="url(#${u}${id})" opacity="${o}"/>`;
    return {
      defs: lg(`${u}bg`, [[0, '#2A0E24'], [1, '#4A1A3D']]) + lg(`${u}s1`, [[0, '#3A1430'], [0.45, '#8C3A6C'], [0.55, '#B05C8C'], [1, '#3A1430']], 1, 0.3)
        + lg(`${u}s2`, [[0, '#4A1A3D'], [0.5, '#A04E80'], [1, '#2E0F27']], 0.8, 1) + lg(`${u}s3`, [[0, '#5A2049'], [0.4, '#C26D9C'], [0.6, '#8C3A6C'], [1, '#3A1430']], 1, 0)
        + rg(`${u}hl`, [[0, '#FFE3F1', 0.35], [1, '#FFE3F1', 0]], 0.25, 0.15, 0.6),
      bg: `<rect width="${W}" height="${W}" fill="url(#${u}bg)"/>
        <g filter="url(#${u}b6)">${fold('M0,0C120,200 60,500 140,760L0,800Z', 's1', 0.8)}${fold('M1200,0C1080,240 1150,520 1040,780L1200,800Z', 's1', 0.7)}
          ${fold('M260,0C330,260 300,520 380,760L250,760C200,520 230,260 160,0Z', 's2', 0.5)}${fold('M900,0C840,260 880,520 820,760L960,760C990,520 960,260 1010,0Z', 's2', 0.45)}</g>
        ${fold('M0,820C200,760 380,860 600,880C820,900 1000,800 1200,840V1200H0Z', 's3')}
        ${fold('M0,960C240,900 420,1010 640,1000C860,990 1020,920 1200,960V1200H0Z', 's1', 0.9)}
        ${fold('M0,1080C260,1040 480,1120 720,1110C920,1100 1060,1060 1200,1080V1200H0Z', 's2', 0.85)}
        <path d="M0,822C200,762 380,862 600,882C820,902 1000,802 1200,842" stroke="#F4BCD8" stroke-width="3" fill="none" opacity=".45"/>`,
      fg: '', over: `<rect width="${W}" height="${W}" fill="url(#${u}hl)"/>`,
      place: { x: 600, y: 886, h: 480 }, shadow: 'soft',
    };
  };

  S['luxury-3'] = (u) => ({
    defs: lg(`${u}w`, [[0, '#C9704F'], [1, '#B05C3D']]) + lg(`${u}sky`, [[0, '#F3D5B8'], [1, '#EBC09B']]) + lg(`${u}bk`, [[0, '#EBD3B0'], [1, '#D9BC94']])
      + lg(`${u}bk2`, [[0, '#D8B98E'], [1, '#C7A57A']]) + rg(`${u}sph`, [[0, '#F2DCBB'], [0.7, '#D7B88E'], [1, '#B8966B']], 0.35, 0.3, 0.75),
    bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/>
      <path d="M380,880V420A220,220 0 0 1 820,420V880Z" fill="url(#${u}sky)"/>
      <path d="M380,880V420A220,220 0 0 1 820,420V880" fill="none" stroke="#9E4E32" stroke-width="10" opacity=".45"/>
      <rect x="120" y="760" width="260" height="440" fill="url(#${u}bk2)"/><rect x="120" y="756" width="260" height="8" fill="#E9D2AE"/>
      <circle cx="1000" cy="800" r="90" fill="url(#${u}sph)"/>
      <rect x="290" y="866" width="660" height="340" fill="url(#${u}bk)"/><rect x="290" y="862" width="660" height="8" fill="#F5E3C6"/>
      <path d="M380,760L520,866H380Z" fill="#5E2A16" opacity=".26"/><path d="M950,866L1200,1060V866Z" fill="#5E2A16" opacity=".22"/>
      <path d="M1000,890L1200,980V840Z" fill="#5E2A16" opacity=".2"/>`,
    fg: '', over: '',
    place: { x: 640, y: 868, h: 470 }, shadow: 'sun',
  });

  S['seasonal-1'] = (u) => {
    const rnd = A.rng(31);
    return {
      defs: rg(`${u}bg`, [[0, '#24493A'], [0.6, '#132A21'], [1, '#0A1812']], 0.5, 0.3, 0.8) + lg(`${u}sf`, [[0, '#3A2A20'], [0.08, '#2A1D16'], [1, '#160E0A']])
        + rg(`${u}orn`, [[0, '#FFF0B8'], [0.35, '#E0B755'], [1, '#7A5A1A']], 0.35, 0.3, 0.75) + lg(`${u}gld`, GOLD, 1, 0) + rg(`${u}warm`, [[0, '#FFC977', 0.2], [1, '#FFC977', 0]], 0.5, 0.4, 0.6),
      bg: `<rect width="${W}" height="${W}" fill="url(#${u}bg)"/>
        <g filter="url(#${u}b10)">${bokeh(rnd, 34, [0, 0, 1200, 760], ['#F6C56B', '#FFE2A0', '#E8A94E'], 14, 46, [0.2, 0.6])}</g>
        <rect x="0" y="0" width="${W}" height="${W}" fill="url(#${u}warm)"/>
        <rect y="890" width="${W}" height="310" fill="url(#${u}sf)"/>
        ${ornament(u, 1010, 870, 44)}`,
      fg: `${pine(-60, 1240, 520, -38, rnd)}${pine(1260, 1250, 500, 216, rnd)}${pine(-40, 1060, 360, -18, rnd)}
        ${ornament(u, 220, 1000, 52)}${ornament(u, 980, 1060, 34)}
        <g fill="#B3182E">${[[300, 1080], [318, 1094], [292, 1100], [940, 1010], [956, 1024]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11"/>`).join('')}</g>`,
      over: '',
      place: { x: 600, y: 896, h: 480 }, shadow: 'soft',
    };
  };

  S['seasonal-2'] = (u) => {
    const rnd = A.rng(41); const R = { base: '#B3122E', mid: '#D8314E', edge: '#7E0B20' };
    let roses = ''; [[180, 960, 58], [300, 1010, 48], [110, 1080, 64], [1010, 980, 54], [1110, 1060, 62], [930, 1080, 46]].forEach(([x, y, r]) => { roses += `<g transform="translate(${x},${y}) scale(1,.72)">${A.rose(0, 0, r, R, rnd() * 360)}</g>`; });
    let petals = ''; for (let i = 0; i < 14; i++) petals += `<ellipse cx="${f1(320 + rnd() * 600)}" cy="${f1(990 + rnd() * 180)}" rx="${f1(10 + rnd() * 8)}" ry="${f1(6 + rnd() * 4)}" fill="#C8213F" opacity=".9" transform="rotate(${f1(rnd() * 180)} ${f1(320 + rnd() * 600)} ${f1(990 + rnd() * 180)})"/>`;
    return {
      defs: lg(`${u}bg`, [[0, '#F6DADC'], [1, '#EEC4C8']]) + lg(`${u}sf`, [[0, '#F3CDD1'], [1, '#E6AEB5']]) + lg(`${u}rib`, [[0, '#E9A2B1'], [0.5, '#FBD9E1'], [1, '#D98597']], 0, 1),
      bg: `<rect width="${W}" height="${W}" fill="url(#${u}bg)"/>
        <g filter="url(#${u}b10)">${bokeh(rnd, 18, [0, 0, 1200, 760], ['#FFFFFF', '#F7B9C4'], 20, 60, [0.25, 0.5])}</g>
        <rect y="870" width="${W}" height="330" fill="url(#${u}sf)"/><path d="M0,870H1200" stroke="#FBE3E6" stroke-width="3"/>`,
      fg: `<path d="M-40,1150C200,1060 380,1180 600,1130C820,1080 960,1170 1240,1100L1240,1140C960,1210 820,1120 600,1170C380,1220 200,1100 -40,1190Z" fill="url(#${u}rib)" opacity=".95"/>${petals}${roses}`,
      over: '',
      place: { x: 600, y: 880, h: 480 }, shadow: 'soft',
    };
  };

  S['seasonal-3'] = (u) => {
    const sl = `<g transform="translate(1000,1050)"><circle r="78" fill="#F4D24A"/><circle r="70" fill="#FBEA9A"/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M0,0L${f1(Math.cos((i * 36 * Math.PI) / 180) * 64)},${f1(Math.sin((i * 36 * Math.PI) / 180) * 64)}" stroke="#F7F1D6" stroke-width="4"/>`).join('')}<circle r="8" fill="#F7F1D6"/></g>`;
    return {
      defs: lg(`${u}w`, [[0, '#2B67A6'], [1, '#245891']]) + lg(`${u}ld`, [[0, '#FBF8F2'], [0.1, '#F1EBE0'], [0.12, '#DCD3C4'], [1, '#CFC5B4']]) + lg(`${u}lem`, [[0, '#F8DA4E'], [0.6, '#F2C230'], [1, '#D3A01E']], 1, 1),
      bg: `<rect width="${W}" height="${W}" fill="url(#${u}w)"/>
        <path d="M-100,-100H700L1300,600V-100Z" fill="#FFFFFF" opacity=".1"/>
        <rect y="870" width="${W}" height="330" fill="url(#${u}ld)"/><path d="M0,870H1200" stroke="#FFFFFF" stroke-width="4"/>`,
      fg: `${lemon(u, 210, 960, 76, -14)}${lemon(u, 330, 1030, 62, 18)}${lemon(u, 140, 1080, 70, 6)}${sl}`,
      over: '',
      place: { x: 640, y: 878, h: 480 }, shadow: 'sun',
    };
  };

  A.SCENES = Object.keys(S);

  /* ---------------------------------------------------------------- compose */
  A.scene = function (kind, id) {
    const u = `sc${kind}${id.replace(/\W/g, '')}`;
    const sc = S[id](u); const P = PRODUCTS[kind]; const pr = DRAW[kind](u);
    const { x, y } = sc.place; const z = P.zoom;
    const s = (sc.place.h * P.real) / P.h; // product scale at true size next to the props
    const fw = P.w * s; const rot = sc.place.rot || 0;
    const defs = A.filters(u) + pgrain(u)
      + blur(`${u}pb4`, 4) + blur(`${u}b2x`, 2) + blur(`${u}b6`, 6) + blur(`${u}b10`, 10) + blur(`${u}b20`, 20) + blur(`${u}b40`, 40)
      + `<filter id="${u}sil" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .08  0 0 0 0 .05  0 0 0 1 0"/><feGaussianBlur stdDeviation="${f1(3 / s)}"/></filter>`
      + rg(`${u}cs`, [[0, '#2A1A0C', 0.55], [1, '#2A1A0C', 0]]) + sc.defs + pr.defs
      + `<g id="${u}prod">${pr.svg}</g>`;
    const T = `translate(${f1(x)},${f1(y)}) rotate(${rot}) scale(${f1(s * 1000) / 1000})`;
    let shadow = `<ellipse cx="${x}" cy="${y + 2}" rx="${f1(fw * 0.62)}" ry="${f1(Math.max(4, fw * 0.06))}" fill="url(#${u}cs)" filter="url(#${u}b6)"/>
      <ellipse cx="${x}" cy="${y + 6}" rx="${f1(fw * 0.85)}" ry="${f1(Math.max(8, fw * 0.12))}" fill="url(#${u}cs)" opacity=".55" filter="url(#${u}b20)"/>`;
    if (sc.shadow === 'flash') shadow = `<use href="#${u}prod" transform="translate(${f1(x + fw * 0.09)},${f1(y - 6)}) rotate(${rot}) scale(${f1(s * 1000) / 1000})" filter="url(#${u}sil)" opacity=".42"/>` + shadow;
    if (sc.shadow === 'sun') shadow = `<use href="#${u}prod" transform="translate(${f1(x)},${f1(y)}) skewX(58) scale(${f1(s * 1000) / 1000},${f1(-s * 280) / 1000})" filter="url(#${u}sil)" opacity=".3"/>` + shadow;
    if (sc.shadow === 'reflect') shadow += `<mask id="${u}m"><rect x="0" y="${y}" width="1200" height="${f1(P.h * s * 0.6)}" fill="url(#${u}fade)"/></mask>
      <g mask="url(#${u}m)"><use href="#${u}prod" transform="translate(${f1(x)},${f1(y + 4)}) scale(${f1(s * 1000) / 1000},${f1(-s * 1000) / 1000})" opacity=".55"/></g>`;
    const cam = z === 1 ? '' : `transform="translate(${x},${y - (P.h * s) / 2}) scale(${z}) translate(${-x},${-(y - (P.h * s) / 2)})"`;
    const body = `<g ${cam}>${sc.bg}${shadow}<use href="#${u}prod" transform="${T}"/>${sc.fg}</g>${sc.over}
      <rect width="1200" height="1200" filter="url(#${u}grain)" opacity=".35"/>`;
    return A.svg(1200, 1200, defs, body, 'aria-hidden="true"');
  };
  A.sceneUrl = (kind, id) => A.url(`sc:${kind}:${id}`, () => A.scene(kind, id));
  A.PRODUCTS = PRODUCTS;
})(window);
