/* Düğün.com proposal · fashion illustrations for the try-on demo
   Four fictional, illustrated demo models and six outfits, all drawn in code on one 600×800 canvas.
   Every model shares one pose, so an outfit always lands on the same body: that is what makes the
   before/after comparison line up. These are illustrations, not AI output and not real people. */
(function (g) {
  'use strict';
  const A = g.DArt; const { f1, smooth, limb, mirror, leaf, blossom, rose } = A;

  /* ---------------------------------------------------------------- bodies (one pose each) */
  const BODY = {
    F: {
      head: 'M300,50C319,50 332,64 332,86C332,104 324,118 313,126C308,129 304,131 300,131C296,131 292,129 287,126C276,118 268,104 268,86C268,64 281,50 300,50Z',
      neck: 'M289,112C290,132 289,150 285,166L315,166C311,150 310,132 311,112Z',
      chest: 'M286,156C276,166 252,170 236,176C224,181 218,192 219,206C222,222 230,232 238,240C237,256 237,266 239,276C242,292 248,306 254,318L262,336H338L346,318C352,306 358,292 361,276C363,266 363,256 362,240C370,232 378,222 381,206C382,192 376,181 364,176C348,170 324,166 314,156Z',
      arm: { c: [[233, 186], [224, 232], [217, 282], [213, 330], [214, 376], [219, 420], [223, 450], [226, 470], [228, 488], [229, 500]], w: [36, 31, 27, 23, 21, 18, 15, 16, 13, 4] },
      ears: '',
    },
    M: {
      head: 'M300,48C321,48 334,62 334,86C334,106 328,120 318,128C312,132 306,134 300,134C294,134 288,132 282,128C272,120 266,106 266,86C266,62 279,48 300,48Z',
      neck: 'M286,116C287,138 286,152 282,170L318,170C314,152 313,138 314,116Z',
      chest: 'M284,160C270,170 240,176 222,182C210,187 204,196 204,210C208,226 216,236 226,244C228,280 236,320 246,350H354C364,320 372,280 374,244C384,236 392,226 396,210C396,196 390,187 378,182C360,176 330,170 316,160Z',
      arm: { c: [[214, 198], [206, 250], [201, 300], [199, 342], [201, 388], [206, 432], [209, 456], [212, 476], [214, 494], [215, 507]], w: [44, 38, 33, 28, 25, 21, 18, 20, 16, 5] },
      ears: '<ellipse cx="267" cy="93" rx="5" ry="10"/><ellipse cx="333" cy="93" rx="5" ry="10"/>',
    },
  };

  /* ---------------------------------------------------------------- the four demo models */
  const MODELS = {
    a: { body: 'F', skin: ['#EECDB4', '#DCB094', '#C99A7E'], lips: ['#C06A73', '#D48890'], blush: '#E8A09B', hair: 'bun', hc: ['#3A2820', '#5C4235'] },
    b: { body: 'M', skin: ['#D2A383', '#BB8B69', '#A27352'], lips: ['#A66A5A', '#B47A6A'], hair: 'side', hc: ['#251C18', '#4A3A31'] },
    vf: { body: 'F', skin: ['#BF8768', '#A57052', '#8E5B42'], lips: ['#A4545C', '#B86A70'], blush: '#C77A6E', hair: 'waves', hc: ['#1E1613', '#43322A'] },
    vm: { body: 'M', skin: ['#F1D4BF', '#DEB79B', '#CDA184'], lips: ['#B07868', '#C08A7A'], hair: 'wavy', hc: ['#6A4932', '#8D6A4F'], beard: true },
  };

  /* ---------------------------------------------------------------- backdrops */
  function backdrop(u, kind) {
    if (kind === 'none') return '';
    if (kind === 'boutique') {
      return `<rect width="600" height="800" fill="url(#${u}bwall)"/>
        <g fill="none" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="2"><rect x="40" y="60" width="150" height="300" rx="2"/><rect x="410" y="60" width="150" height="300" rx="2"/><rect x="40" y="400" width="150" height="270" rx="2"/><rect x="410" y="400" width="150" height="270" rx="2"/></g>
        <g fill="none" stroke="#C9A9A1" stroke-opacity=".28" stroke-width="1"><rect x="46" y="66" width="138" height="288"/><rect x="416" y="66" width="138" height="288"/><rect x="46" y="406" width="138" height="258"/><rect x="416" y="406" width="138" height="258"/></g>
        <rect y="700" width="600" height="100" fill="url(#${u}bfloor)"/><rect y="698" width="600" height="4" fill="#FFFFFF" opacity=".6"/>
        <path d="M0,0H230L560,800H330Z" fill="#FFFFFF" opacity=".16" filter="url(#${u}blur14)"/>`;
    }
    const rnd = A.rng(11);
    let olive = '';
    for (let i = 0; i < 6; i++) olive += A.sprig(512 + (i - 2.5) * 6, 610, 150 + rnd() * 90, -96 + (i - 2.5) * 13 + rnd() * 6, { rnd, fill: '#97A388', fills: ['#97A388', '#A9B39B', '#869478'], n: 12, leaf: 22, sw: 1, bend: 0.12 + rnd() * 0.12 });
    return `<rect width="600" height="800" fill="url(#${u}wall)"/>
      <path d="M128,722V250A172,172 0 0 1 472,250V722Z" fill="url(#${u}arch)"/>
      <path d="M128,722V250A172,172 0 0 1 472,250V722" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="2"/>
      <path d="M140,722V252A160,160 0 0 1 460,252V722" fill="none" stroke="#D8C9B8" stroke-opacity=".5" stroke-width="1"/>
      <rect y="718" width="600" height="82" fill="url(#${u}floor)"/><rect y="716" width="600" height="3" fill="#FFFFFF" opacity=".7"/>
      <path d="M0,0H210L540,800H300Z" fill="#FFFFFF" opacity=".2" filter="url(#${u}blur14)"/>
      <g opacity=".85">${olive}</g>
      <path d="M492,612C488,650 490,690 498,722H530C538,690 540,650 536,612Z" fill="url(#${u}vase)"/><ellipse cx="514" cy="612" rx="22" ry="5" fill="#E9DED0"/>`;
  }

  function backdropDefs(u) {
    return `
      <linearGradient id="${u}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5EFE8"/><stop offset="1" stop-color="#ECE3D9"/></linearGradient>
      <linearGradient id="${u}arch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8F4"/><stop offset=".7" stop-color="#F4EDE5"/><stop offset="1" stop-color="#EDE4DA"/></linearGradient>
      <linearGradient id="${u}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6DACC"/><stop offset="1" stop-color="#D9CBBA"/></linearGradient>
      <linearGradient id="${u}vase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D9CDBE"/><stop offset=".4" stop-color="#F3ECE2"/><stop offset="1" stop-color="#CFC1AF"/></linearGradient>
      <linearGradient id="${u}bwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4E6E1"/><stop offset="1" stop-color="#EBD9D2"/></linearGradient>
      <linearGradient id="${u}bfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5D2CA"/><stop offset="1" stop-color="#D8C2B8"/></linearGradient>
      <radialGradient id="${u}shadow"><stop offset="0" stop-color="#6E5A47" stop-opacity=".38"/><stop offset="1" stop-color="#6E5A47" stop-opacity="0"/></radialGradient>`;
  }

  /* ---------------------------------------------------------------- shared patterns */
  const lace = (u, col = '#D8CDBD', op = 0.9) => `
    <pattern id="${u}lace" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
      <g fill="none" stroke="${col}" stroke-width=".7" opacity="${op}">
        <circle cx="9" cy="9" r="1.6"/><path d="M9,4.2q1.6,2.4 0,4.8q-1.6,-2.4 0,-4.8ZM9,9q1.6,2.4 0,4.8q-1.6,-2.4 0,-4.8ZM4.2,9q2.4,-1.6 4.8,0q-2.4,1.6 -4.8,0ZM9,9q2.4,-1.6 4.8,0q-2.4,1.6 -4.8,0Z"/>
        <path d="M0,0q4,3 0,6M18,0q-4,3 0,6M0,18q4,-3 0,-6M18,18q-4,-3 0,-6" stroke-width=".5"/>
        <circle cx="0" cy="9" r=".8"/><circle cx="18" cy="9" r=".8"/><circle cx="9" cy="0" r=".8"/><circle cx="9" cy="18" r=".8"/>
      </g>
    </pattern>`;

  /* Folds and sparkle for a skirt that runs from the waist (y0, half-width w0) to the hem (y1, half-width w1). */
  function folds(n, y0, w0, y1, w1, light, dark, seed, cx = 300) {
    const rnd = A.rng(seed); let s = '';
    for (let i = 0; i <= n; i++) {
      const t = i / n; const xa = cx - w0 + 2 * w0 * t; const xb = cx - w1 + 2 * w1 * t + (rnd() - 0.5) * 14;
      const xm = (xa + xb) / 2 + (rnd() - 0.5) * 16;
      s += `<path d="M${f1(xa)},${y0}Q${f1(xm)},${f1((y0 + y1) / 2)} ${f1(xb)},${y1}" stroke="${i % 2 ? dark : light}" stroke-width="${f1(1 + rnd() * 2.4)}" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }
  function sparkle(n, y0, w0, y1, w1, seed, col = '#FFFFFF', cx = 300) {
    const rnd = A.rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const t = Math.pow(rnd(), 0.8); const y = y0 + (y1 - y0) * t; const w = w0 + (w1 - w0) * t;
      const x = cx + (rnd() * 2 - 1) * w * 0.9;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.5 + rnd() * 1.1)}" fill="${col}" opacity="${f1(0.4 + rnd() * 0.5)}"/>`;
    }
    return s;
  }

  /* ---------------------------------------------------------------- outfits
     Each returns { defs, back, body, sleeves, front } for the given body ('F' | 'M'). */
  const OUT = {};

  /* Everyday clothes for the "before" picture. */
  OUT.before = (u, b) => {
    if (b === 'F') {
      const top = 'M286,158C276,166 252,170 238,176C226,181 220,190 218,204L211,250C222,256 232,258 241,258L242,268C244,292 251,314 257,338L343,338C349,314 356,292 358,268L359,258C368,258 378,256 389,250L382,204C380,190 374,181 362,176C348,170 324,166 314,158C310,166 305,170 300,170C295,170 290,166 286,158Z';
      const pants = 'M259,330H341C350,358 360,388 363,420C368,520 372,640 374,764C352,768 326,769 304,767L300,476L296,767C274,769 248,768 226,764C228,640 232,520 237,420C240,388 250,358 259,330Z';
      let ribs = ''; for (let x = 246; x <= 354; x += 5) ribs += `<path d="M${x},176V340" stroke="#CDBFAA" stroke-width=".7" opacity=".5"/>`;
      return {
        defs: `<clipPath id="${u}topc"><path d="${top}"/></clipPath>
          <linearGradient id="${u}top" x1="0" x2="1"><stop offset="0" stop-color="#D9CCB8"/><stop offset=".3" stop-color="#EDE4D6"/><stop offset=".65" stop-color="#E9DFCF"/><stop offset="1" stop-color="#D3C5B0"/></linearGradient>
          <linearGradient id="${u}pants" x1="0" x2="1"><stop offset="0" stop-color="#9C7B58"/><stop offset=".3" stop-color="#BC9A75"/><stop offset=".5" stop-color="#A7855F"/><stop offset=".7" stop-color="#BE9C77"/><stop offset="1" stop-color="#977654"/></linearGradient>`,
        back: '',
        body: `<path d="M240,766Q252,786 284,782Q290,774 286,764Z" fill="#D9B79D"/><path d="M360,766Q348,786 316,782Q310,774 314,764Z" fill="#D9B79D"/>
          <path d="${pants}" fill="url(#${u}pants)"/>
          <path d="M300,476V767M262,360C258,500 252,640 248,764M338,360C342,500 348,640 352,764" stroke="#7E6145" stroke-width="1.2" fill="none" opacity=".45"/>
          <path d="M259,331H341L343,343H257Z" fill="#8E6E4E" opacity=".55"/>
          <path d="${top}" fill="url(#${u}top)"/><g clip-path="url(#${u}topc)">${ribs}</g>
          <path d="M286,158C290,168 295,172 300,172C305,172 310,168 314,158" fill="none" stroke="#CDBFAA" stroke-width="3"/>
          <path d="M212,246C222,253 232,256 241,256M388,246C378,253 368,256 359,256" fill="none" stroke="#CDBFAA" stroke-width="2.5"/>`,
        sleeves: '', front: '',
      };
    }
    const shirt = 'M284,160C270,170 244,176 226,182C214,187 208,196 206,208L197,330C208,336 222,338 233,336L237,302C239,322 243,342 247,354H353C357,342 361,322 363,302L367,336C378,338 392,336 403,330L394,208C392,196 386,187 374,182C356,176 330,170 316,160L300,198Z';
    const pants = 'M248,350H352C358,392 363,432 363,472C362,570 360,670 357,766C340,770 322,770 306,768L300,522L294,768C278,770 260,770 243,766C240,670 238,570 237,472C237,432 242,392 248,350Z';
    return {
      defs: `<linearGradient id="${u}shirt" x1="0" x2="1"><stop offset="0" stop-color="#DCDDDF"/><stop offset=".3" stop-color="#F7F7F5"/><stop offset=".7" stop-color="#F3F3F1"/><stop offset="1" stop-color="#D6D7DA"/></linearGradient>
        <linearGradient id="${u}chino" x1="0" x2="1"><stop offset="0" stop-color="#2B3548"/><stop offset=".3" stop-color="#3D4A62"/><stop offset=".5" stop-color="#34405A"/><stop offset=".7" stop-color="#3F4C65"/><stop offset="1" stop-color="#28324A"/></linearGradient>`,
      back: '',
      body: `<path d="M240,764Q240,786 270,786Q296,786 296,772L294,764Z" fill="#6B4A35"/><path d="M360,764Q360,786 330,786Q304,786 304,772L306,764Z" fill="#6B4A35"/>
        <path d="${pants}" fill="url(#${u}chino)"/><path d="M300,522V768M262,380C258,520 254,650 252,766M338,380C342,520 346,650 348,766" stroke="#1E2636" stroke-width="1.2" fill="none" opacity=".5"/>
        <path d="${shirt}" fill="url(#${u}shirt)"/>
        <path d="M300,198V352" stroke="#CFCFD2" stroke-width="1.4"/><g fill="#D8D8DA">${[226, 262, 298, 334].map((y) => `<circle cx="304" cy="${y}" r="2"/>`).join('')}</g>
        <path d="M284,160L276,186L296,200ZM316,160L324,186L304,200Z" fill="#FFFFFF" stroke="#D2D2D5" stroke-width="1"/>
        <path d="M248,346H352L353,358H247Z" fill="#5E4232"/><rect x="292" y="345" width="16" height="14" rx="2" fill="none" stroke="#B9A27C" stroke-width="2"/>
        <path d="M198,326C210,334 222,336 233,334M402,326C390,334 378,336 367,334" stroke="#D2D2D5" stroke-width="5" fill="none"/>`,
      sleeves: '', front: '',
    };
  };

  /* Gelinlik 1 · A-line tulle with a lace V bodice and a long veil. */
  OUT.aurora = (u) => {
    const skirt = [[261, 336], [250, 372], [232, 430], [206, 500], [178, 570], [150, 640], [122, 705], [94, 768], [140, 782], [192, 790], [246, 794], [300, 796], [354, 794], [408, 790], [460, 782], [506, 768], [478, 705], [450, 640], [422, 570], [394, 500], [368, 430], [350, 372], [339, 336]];
    const layer2 = skirt.map(([x, y], i) => [300 + (x - 300) * 0.96, y + (i > 7 && i < 16 ? -10 + (i % 2) * 8 : 0)]);
    const bodice = 'M258,226C250,232 242,236 238,240C236,250 237,258 238,266C240,280 243,288 247,294C252,308 257,320 262,336L338,336C343,320 348,308 353,294C357,288 360,280 362,266C363,258 364,250 362,240C358,236 350,232 342,226C330,244 314,266 300,292C286,266 270,244 258,226Z';
    let scallop = ''; for (let i = 0; i <= 10; i++) { const t = i / 10; scallop += `<circle cx="${f1(258 + 42 * t)}" cy="${f1(226 + 66 * t)}" r="2.2"/><circle cx="${f1(342 - 42 * t)}" cy="${f1(226 + 66 * t)}" r="2.2"/>`; }
    return {
      defs: lace(u) + `<clipPath id="${u}bod"><path d="${bodice}"/></clipPath><clipPath id="${u}sk"><path d="${smooth(skirt, true)}"/></clipPath>
        <linearGradient id="${u}tulle" x1="0" x2="1"><stop offset="0" stop-color="#E6DED2"/><stop offset=".22" stop-color="#F8F5F0"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset=".78" stop-color="#F7F3EE"/><stop offset="1" stop-color="#E2D9CC"/></linearGradient>
        <linearGradient id="${u}veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".1"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".42"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".55"/></linearGradient>
        <linearGradient id="${u}lacefade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <mask id="${u}skm"><rect x="60" y="330" width="480" height="470" fill="url(#${u}lacefade)"/></mask>`,
      back: `<path d="M314,108C346,150 370,262 398,420C426,566 468,694 548,792L300,800L52,792C132,694 174,566 202,420C230,262 254,150 286,108Z" fill="url(#${u}veil)"/>
        <path d="M548,792C468,694 426,566 398,420M52,792C132,694 174,566 202,420" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="1 4" stroke-linecap="round" opacity=".9"/>`,
      body: `<path d="${smooth(skirt, true)}" fill="url(#${u}tulle)"/>
        <g clip-path="url(#${u}sk)">${folds(18, 338, 40, 800, 215, 'rgba(255,255,255,.9)', 'rgba(150,130,108,.14)', 5)}
          <rect x="60" y="330" width="480" height="470" fill="url(#${u}lace)" mask="url(#${u}skm)" opacity=".8"/>
          <ellipse cx="300" cy="800" rx="230" ry="60" fill="#CDBFAE" opacity=".25" filter="url(#${u}blur14)"/></g>
        <path d="${smooth(layer2, true)}" fill="#FFFFFF" opacity=".38"/>
        <g>${sparkle(90, 350, 45, 785, 200, 9)}</g>
        <path d="${bodice}" fill="#FBF8F3"/><g clip-path="url(#${u}bod)"><rect x="230" y="220" width="140" height="120" fill="url(#${u}lace)"/>
          <path d="M238,240C246,280 252,310 262,336" stroke="#D9CEC0" stroke-width="10" fill="none" opacity=".45" filter="url(#${u}blur2)"/><path d="M362,240C354,280 348,310 338,336" stroke="#D9CEC0" stroke-width="10" fill="none" opacity=".45" filter="url(#${u}blur2)"/></g>
        <g fill="#FFFFFF" stroke="#E2D8CA" stroke-width=".6">${scallop}</g>
        <path d="M257,227L254,174M343,227L346,174" stroke="#F6F1E9" stroke-width="3" stroke-linecap="round"/>
        <path d="M261,329H339V341H261Z" fill="#E8D7B9"/><path d="M261,332H339" stroke="#FFF8EA" stroke-width="1.2"/>`,
      sleeves: '', front: '',
    };
  };

  /* Gelinlik 2 · satin mermaid with an off-shoulder neckline and a train. */
  OUT.selin = (u, b, m) => {
    const right = [[362, 214], [362, 240], [363, 266], [354, 296], [339, 332], [350, 372], [359, 410], [357, 470], [350, 530], [344, 575], [352, 612], [374, 652], [410, 700], [458, 746], [526, 780], [580, 798]];
    const hem = [[580, 798], [470, 803], [360, 803], [250, 801], [170, 797], [118, 790]];
    const left = [[118, 790], [160, 755], [196, 705], [226, 655], [248, 612], [256, 575], [250, 530], [243, 470], [241, 410], [250, 372], [261, 332], [246, 296], [237, 266], [238, 240], [238, 214]];
    const body = `M238,214Q252,206 268,214Q286,224 300,240Q314,224 332,214Q348,206 362,214${A.through(right)}${A.through(hem)}${A.through(left)}Z`;
    const arm = BODY.F.arm; const band = limb(arm.c.slice(0, 3), [44, 38, 33]);
    const bandR = limb(mirror(arm.c.slice(0, 3)), [44, 38, 33]);
    return {
      defs: `<clipPath id="${u}mer"><path d="${body}"/></clipPath><clipPath id="${u}bandc"><rect x="150" y="190" width="300" height="40"/></clipPath>
        <linearGradient id="${u}satin" x1="0" x2="1"><stop offset="0" stop-color="#D7C8B1"/><stop offset=".16" stop-color="#EEE4D4"/><stop offset=".3" stop-color="#FFFDF8"/><stop offset=".44" stop-color="#EFE5D6"/><stop offset=".6" stop-color="#F6EFE4"/><stop offset=".7" stop-color="#FFFCF5"/><stop offset=".86" stop-color="#E9DDCA"/><stop offset="1" stop-color="#D0C1A9"/></linearGradient>`,
      back: '',
      body: `<path d="${body}" fill="url(#${u}satin)"/>
        <g clip-path="url(#${u}mer)" fill="none" stroke-linecap="round">
          <path d="M252,602C236,660 196,720 150,790M276,610C270,680 250,740 226,800M330,610C346,680 384,740 440,800M352,600C388,650 446,720 540,792" stroke="#FFFFFF" stroke-width="5" opacity=".7" filter="url(#${u}blur2)"/>
          <path d="M262,604C252,668 222,734 186,800M300,606C300,680 296,744 300,804M340,604C364,670 410,738 488,800" stroke="#B9A88E" stroke-width="3" opacity=".35" filter="url(#${u}blur2)"/>
          <path d="M244,372C276,392 316,404 356,402M244,402C280,420 322,428 358,424M248,438C282,452 320,456 356,452" stroke="#C8B89E" stroke-width="2" opacity=".5"/>
          <path d="M282,250C284,330 290,450 296,560" stroke="#FFFFFF" stroke-width="7" opacity=".6" filter="url(#${u}blur6)"/>
        </g>
        <path d="M238,214Q252,206 268,214Q286,224 300,240Q314,224 332,214Q348,206 362,214" fill="none" stroke="#FFFDF8" stroke-width="2"/>`,
      sleeves: `<g clip-path="url(#${u}bandc)"><path d="${band}" fill="url(#${u}satin)"/><path d="${bandR}" fill="url(#${u}satin)"/></g>
        <path d="M206,224Q222,218 242,226M394,224Q378,218 358,226" stroke="#CDBDA4" stroke-width="1.5" fill="none" opacity=".7"/>`,
      front: `<circle cx="270" cy="114" r="3.2" fill="#FBF6EC" stroke="#D9CBB4" stroke-width=".8"/><circle cx="330" cy="114" r="3.2" fill="#FBF6EC" stroke="#D9CBB4" stroke-width=".8"/>`,
    };
  };

  /* Gelinlik 3 · bohemian lace with sheer bell sleeves, a flowing skirt and a flower vine. */
  OUT.lina = (u) => {
    const skirt = [[262, 336], [252, 380], [236, 440], [214, 510], [190, 580], [166, 650], [140, 712], [108, 772], [150, 786], [205, 792], [262, 790], [318, 796], [372, 792], [426, 786], [478, 772], [452, 712], [428, 650], [404, 580], [384, 510], [366, 440], [350, 380], [338, 336]];
    const flow = [[272, 340], [252, 420], [214, 520], [168, 630], [110, 740], [64, 792], [150, 800], [250, 802], [320, 800], [306, 700], [312, 560], [322, 440], [332, 340]];
    const bodice = 'M252,176C246,180 240,184 236,190C236,210 238,230 240,240C238,252 238,262 240,270C242,290 248,306 252,316C256,324 259,330 262,336L338,336C341,330 344,324 348,316C352,306 358,290 360,270C362,262 362,252 360,240C362,230 364,210 364,190C360,184 354,180 348,176C330,220 314,270 300,318C286,270 270,220 252,176Z';
    const arm = BODY.F.arm;
    const sc = [[233, 184], [224, 232], [217, 282], [212, 330], [211, 376], [212, 420], [213, 452], [214, 468]];
    const sw = [40, 36, 32, 30, 34, 44, 58, 64];
    const sl = limb(sc, sw), sr = limb(mirror(sc), sw);
    let cuff = ''; for (let i = 0; i < 7; i++) { cuff += `<circle cx="${f1(184 + i * 9.5)}" cy="${f1(468 + Math.sin(i) * 1.5)}" r="5"/><circle cx="${f1(416 - i * 9.5)}" cy="${f1(468 + Math.sin(i) * 1.5)}" r="5"/>`; }
    let belt = ''; for (let i = 0; i < 9; i++) { const x = 264 + i * 9; belt += blossom(x, 336 + (i % 2) * 2, 4.5, i % 3 === 1 ? '#E9C6C0' : '#FBF6EE', '#D9B98A', i * 20); if (i % 2) belt += leaf(x + 3, 339, 7, 70, '#9AA88E'); }
    let vine = ''; const vr = A.rng(21);
    [[270, 82, -70], [276, 72, -50], [324, 72, -130], [330, 82, -110]].forEach(([x, y, a]) => { vine += leaf(x, y, 9, a, '#93A487'); });
    [[272, 77], [281, 67], [319, 67], [328, 77], [300, 58]].forEach(([x, y], i) => { vine += blossom(x, y, 4 + vr() * 1.5, i % 2 ? '#F2D6D0' : '#FFFDF7', '#D8B77E', i * 30); });
    return {
      defs: lace(u, '#D6CBBB') + `<clipPath id="${u}lb"><path d="${bodice}"/></clipPath><clipPath id="${u}ls"><path d="${smooth(skirt, true)}"/></clipPath>
        <clipPath id="${u}lsl"><path d="${sl}"/><path d="${sr}"/></clipPath>
        <linearGradient id="${u}chif" x1="0" x2="1"><stop offset="0" stop-color="#E5DCCD"/><stop offset=".25" stop-color="#F8F3EA"/><stop offset=".55" stop-color="#FFFDF8"/><stop offset=".8" stop-color="#F5EFE4"/><stop offset="1" stop-color="#E0D5C4"/></linearGradient>
        <linearGradient id="${u}lfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <mask id="${u}lm"><rect x="60" y="330" width="480" height="470" fill="url(#${u}lfade)"/></mask>`,
      back: '',
      body: `<path d="${smooth(skirt, true)}" fill="url(#${u}chif)"/>
        <g clip-path="url(#${u}ls)">${folds(12, 338, 38, 800, 190, 'rgba(255,255,255,.85)', 'rgba(140,122,100,.13)', 31)}<rect x="60" y="330" width="480" height="470" fill="url(#${u}lace)" mask="url(#${u}lm)"/></g>
        <path d="${smooth(flow, true)}" fill="#FFFFFF" opacity=".45"/><path d="${A.smooth(flow.slice(0, 6))}" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity=".8"/>
        <path d="${bodice}" fill="#F8F3EA"/><g clip-path="url(#${u}lb)"><rect x="230" y="170" width="140" height="170" fill="url(#${u}lace)"/></g>
        <path d="M252,176C270,220 286,270 300,318C314,270 330,220 348,176" fill="none" stroke="#E4D9C8" stroke-width="2"/>`,
      sleeves: `<path d="${sl}" fill="#FFFFFF" opacity=".42"/><path d="${sr}" fill="#FFFFFF" opacity=".42"/>
        <g clip-path="url(#${u}lsl)"><rect x="150" y="170" width="300" height="320" fill="url(#${u}lace)" opacity=".75"/></g>
        <path d="${sl}" fill="none" stroke="#E7DDCF" stroke-width="1"/><path d="${sr}" fill="none" stroke="#E7DDCF" stroke-width="1"/>
        <g fill="#FFFFFF" opacity=".75">${cuff}</g>`,
      front: `<g>${belt}</g><g>${vine}</g>`,
      noBun: false,
    };
  };

  /* A two-piece suit, shared by the tuxedo and the linen suit. */
  function suit(u, o) {
    const jacket = 'M286,164C270,172 246,178 226,184C214,188 208,196 208,210L214,300C216,360 222,420 232,486C262,494 284,496 300,496C316,496 338,494 368,486C378,420 384,360 386,300L392,210C392,196 386,188 374,184C354,178 330,172 314,164L300,186Z';
    const pants = 'M238,480H362C365,570 363,670 359,766C342,770 324,770 307,768L300,560L293,768C276,770 258,770 241,766C237,670 235,570 238,480Z';
    const arm = BODY.M.arm; const sc = arm.c.slice(0, 7); const sw = [45, 40, 36, 33, 31, 29, 27];
    const lapL = o.peak
      ? 'M287,166L300,374L291,374C283,330 271,282 259,238L250,206L266,214L277,190Z'
      : 'M287,166L300,374L291,374C283,330 270,278 257,230L260,214L275,218L279,196Z';
    const lapR = lapL.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m0, x, y) => `${f1(600 - +x)},${y}`);
    const buttons = o.buttons.map((y) => `<circle cx="300" cy="${y}" r="4.2" fill="${o.btn}"/><circle cx="299" cy="${y - 1}" r="1.4" fill="#FFFFFF" opacity=".25"/>`).join('');
    const tex = o.linen ? `<pattern id="${u}lin" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0,3H6M3,0V6" stroke="#FFFFFF" stroke-width=".5" opacity=".18"/><path d="M0,0L6,6" stroke="#8A7558" stroke-width=".4" opacity=".14"/></pattern>` : '';
    return {
      defs: tex + `<clipPath id="${u}jk"><path d="${jacket}"/></clipPath><clipPath id="${u}sv"><path d="${limb(sc, sw)}"/><path d="${limb(mirror(sc), sw)}"/></clipPath>
        <linearGradient id="${u}cloth" x1="0" x2="1"><stop offset="0" stop-color="${o.c[2]}"/><stop offset=".28" stop-color="${o.c[0]}"/><stop offset=".5" stop-color="${o.c[1]}"/><stop offset=".72" stop-color="${o.c[0]}"/><stop offset="1" stop-color="${o.c[2]}"/></linearGradient>
        <linearGradient id="${u}lap" x1="0" x2="1"><stop offset="0" stop-color="${o.lap[0]}"/><stop offset=".55" stop-color="${o.lap[1]}"/><stop offset="1" stop-color="${o.lap[0]}"/></linearGradient>`,
      back: '',
      body: `<path d="M240,764Q240,788 270,788Q297,788 297,772L294,764Z" fill="${o.shoe}"/><path d="M360,764Q360,788 330,788Q303,788 303,772L306,764Z" fill="${o.shoe}"/>
        <path d="M250,778Q262,782 280,780M320,780Q338,782 350,778" stroke="#FFFFFF" stroke-width="1.2" opacity=".35" fill="none"/>
        <path d="${pants}" fill="url(#${u}cloth)"/>${o.linen ? `<path d="${pants}" fill="url(#${u}lin)"/>` : ''}
        <path d="M300,560V768" stroke="${o.seam}" stroke-width="1.2" opacity=".6"/>
        ${o.stripe ? `<path d="M240,484C238,580 238,680 242,764M360,484C362,580 362,680 358,764" stroke="${o.lap[1]}" stroke-width="3" opacity=".8"/>` : `<path d="M262,500C260,600 258,690 256,766M338,500C340,600 342,690 344,766" stroke="${o.seam}" stroke-width="1" opacity=".45"/>`}
        <path d="${jacket}" fill="url(#${u}cloth)"/>${o.linen ? `<path d="${jacket}" fill="url(#${u}lin)"/>` : ''}
        <g clip-path="url(#${u}jk)"><path d="M300,380L290,496H310Z" fill="${o.under}"/><path d="M300,380C296,420 290,460 286,496M300,380C304,420 310,460 314,496" stroke="${o.seam}" stroke-width="1.4" fill="none"/>
          <path d="M244,422L282,424M318,424L356,422" stroke="${o.seam}" stroke-width="2" opacity=".8"/>
          <path d="M212,300C240,310 270,312 296,306" stroke="#000" stroke-opacity=".08" stroke-width="16" fill="none" filter="url(#${u}blur6)"/></g>
        <path d="M288,166L312,166L300,376Z" fill="#FBFBF9"/><path d="M300,196V370" stroke="#E2E2E2" stroke-width="1"/>
        ${o.tie}`,
      sleeves: `<path d="${limb(sc, sw)}" fill="url(#${u}cloth)"/><path d="${limb(mirror(sc), sw)}" fill="url(#${u}cloth)"/>
        ${o.linen ? `<g clip-path="url(#${u}sv)"><rect x="150" y="180" width="300" height="300" fill="url(#${u}lin)"/><path d="M196,336Q206,344 214,338M404,336Q394,344 386,338M198,352Q208,358 216,352" stroke="#8B775A" stroke-width="1" fill="none" opacity=".5"/></g>` : ''}
        <path d="M190,446L222,450L222,458L191,454ZM410,446L378,450L378,458L409,454Z" fill="#FBFBF9"/>`,
      front: `<path d="${lapL}" fill="url(#${u}lap)"/><path d="${lapR}" fill="url(#${u}lap)"/>
        <path d="M287,166L300,374M313,166L300,374" stroke="${o.seam}" stroke-width="1" opacity=".5"/>${buttons}${o.extra || ''}`,
    };
  }
  /* Damatlık 1 · black tuxedo with satin peak lapels and a bow tie. */
  OUT.kenan = (u) => suit(u, {
    peak: true, c: ['#2A2A30', '#3A3A42', '#18181C'], lap: ['#24242A', '#4A4A54'], seam: '#0D0D10', under: '#121216', btn: '#0E0E10', shoe: '#0F0F12', stripe: true, buttons: [378],
    tie: '<path d="M300,180L282,170L282,190ZM300,180L318,170L318,190Z" fill="#141418"/><rect x="295" y="174" width="10" height="12" rx="3" fill="#25252B"/>' + '<g fill="#1A1A1E">' + [222, 252, 282].map((y) => `<circle cx="300" cy="${y}" r="2.2"/>`).join('') + '</g>',
    extra: `<path d="M328,262L346,256L350,266L332,270Z" fill="#FFFFFF"/><path d="M332,258L338,250L342,258Z" fill="#FFFFFF"/>${rose(330, 228, 7, { base: '#FFFFFF', mid: '#F1EEE8', edge: '#D3CDC2' })}${leaf(334, 234, 12, 70, '#7E8C70')}`,
  });
  /* Damatlık 2 · sand linen suit with a sage knit tie. */
  OUT.deniz = (u) => suit(u, {
    peak: false, c: ['#CDB99B', '#DCCBB0', '#B29D7E'], lap: ['#C4AF8F', '#D9C8AC'], seam: '#9C8665', under: '#F1F0EC', btn: '#7A6448', shoe: '#8C5E3C', stripe: false, buttons: [380, 428], linen: true,
    tie: '<path d="M294,172H306L304,184L310,330L300,346L290,330L296,184Z" fill="#8C9B7C"/><path d="M294,172H306L304,184H296Z" fill="#7C8B6D"/><path d="M296,200H304M295,230H305M294,260H306M294,290H306M293,320H307" stroke="#7A896B" stroke-width="1" opacity=".6"/>',
    extra: `<path d="M330,262L346,258L349,266L333,269Z" fill="#F7F3EA"/>${A.sprig(330, 236, 26, -60, { fill: '#8FA08A', n: 6, leaf: 8, round: 0.75, sw: 0.8 })}${A.blossom(330, 234, 5, '#FFFFFF', '#E3C88E')}`,
  });

  /* ---------------------------------------------------------------- heads and hair */
  function hairBack(m) {
    const [c] = m.hc;
    switch (m.hair) {
      case 'bun': return `<ellipse cx="324" cy="128" rx="15" ry="12" fill="${c}"/><path d="M266,96C262,64 279,42 300,41C321,42 338,64 334,96C333,108 329,118 324,124L276,124C271,118 267,108 266,96Z" fill="${c}"/>`;
      case 'waves': return `<path d="M262,96C256,60 278,38 300,38C324,38 344,60 338,98C342,140 352,190 362,236C366,258 352,270 336,266L264,266C248,270 234,258 238,236C248,190 258,140 262,96Z" fill="${c}"/>`;
      default: return '';
    }
  }
  function hairFront(m, u) {
    const [c, hl] = m.hc;
    switch (m.hair) {
      case 'bun': return `<path d="M267,95C265,68 279,47 300,46C321,47 335,68 333,95C331,84 326,73 318,66C311,60 305,57 300,56.5C295,57 289,60 282,66C274,73 269,84 267,95Z" fill="${c}"/>
        <path d="M300,57C290,60 280,70 272,88M300,57C310,60 320,70 328,88M297,50C286,52 276,60 270,72M303,50C314,52 324,60 330,72" stroke="${hl}" stroke-width="1.2" fill="none" opacity=".7"/>`;
      case 'waves': return `<path d="M266,98C262,66 280,44 304,44C326,46 338,66 334,98C330,80 322,66 308,60C294,58 278,66 272,82C270,88 268,92 266,98Z" fill="${c}"/>
        <path d="M268,96C262,130 256,170 252,206C250,226 256,244 266,252C262,228 264,206 270,180C276,150 282,120 288,92C282,90 274,92 268,96Z" fill="${c}"/>
        <path d="M270,110C266,140 262,176 260,210M276,104C272,140 268,180 268,214M308,60C292,60 280,70 274,84" stroke="${hl}" stroke-width="1.3" fill="none" opacity=".7"/>`;
      case 'side': return `<path d="M265,90C261,60 280,39 304,39C329,40 341,60 336,90C334,78 331,70 325,66C317,61 306,60 296,61C285,62 275,68 270,78C267,83 266,86 265,90Z" fill="${c}"/>
        <path d="M266,86L266,100L270,100L270,84ZM334,86L334,100L330,100L330,84Z" fill="${c}"/>
        <path d="M290,44C302,48 314,52 326,62M284,48C296,52 308,56 318,64" stroke="${hl}" stroke-width="1.3" fill="none" opacity=".6"/>`;
      case 'wavy': {
        let curls = ''; [[276, 52], [290, 42], [306, 40], [322, 46], [334, 60], [268, 66]].forEach(([x, y], i) => { curls += `<path d="M${x - 8},${y + 4}q8,-12 16,0" stroke="${hl}" stroke-width="1.6" fill="none" opacity=".7"/>`; });
        const beard = m.beard ? `<path d="M268,102C270,124 284,140 300,142C316,140 330,124 332,102C328,116 318,127 300,128C282,127 272,116 268,102Z" fill="${c}" opacity=".9"/><path d="M288,117C294,114 306,114 312,117C306,119 294,119 288,117Z" fill="${c}"/>` : '';
        return `<path d="M262,92C256,58 278,32 304,32C332,33 348,58 338,92C336,78 331,68 322,63C312,58 300,58 290,60C278,63 268,72 264,82Z" fill="${c}"/>${curls}${beard}`;
      }
      default: return '';
    }
  }
  function face(m, u) {
    const F = m.body === 'F';
    const [, , deep] = m.skin;
    if (F) {
      return `<circle cx="283" cy="105" r="9" fill="${m.blush}" opacity=".28" filter="url(#${u}blur2)"/><circle cx="317" cy="105" r="9" fill="${m.blush}" opacity=".28" filter="url(#${u}blur2)"/>
        <path d="M279,80Q287,75 295,79M321,80Q313,75 305,79" stroke="#4E362C" stroke-width="1.7" fill="none" stroke-linecap="round"/>
        <path d="M281,90Q288,95 295,90M319,90Q312,95 305,90" stroke="#2E211C" stroke-width="1.9" fill="none" stroke-linecap="round"/>
        <path d="M281,90L277,88.5M283,91.5L280,91M319,90L323,88.5M317,91.5L320,91" stroke="#2E211C" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M301,92C302,100 304,105 300,108C298,109 296,108 295,107" stroke="${deep}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path d="M290,116C294,113 297,113 300,114.5C303,113 306,113 310,116C305,117.6 295,117.6 290,116Z" fill="${m.lips[0]}"/>
        <path d="M291,116.6C295,121.8 305,121.8 309,116.6C304,118.2 296,118.2 291,116.6Z" fill="${m.lips[1]}"/>`;
    }
    return `<path d="M278,80Q287,75 295,79M322,80Q313,75 305,79" stroke="#2A1F1A" stroke-width="2.7" fill="none" stroke-linecap="round"/>
      <path d="M282,90Q288,86.5 294,90Q288,92.5 282,90ZM318,90Q312,86.5 306,90Q312,92.5 318,90Z" fill="#2A1F1A"/>
      <path d="M301,92C302,101 305,107 300,110C297,111 295,110 294,109" stroke="${deep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      ${m.beard ? '' : `<path d="M290,120Q300,123 310,120" stroke="${m.lips[0]}" stroke-width="2" fill="none" stroke-linecap="round"/>`}
      ${m.beard ? `<path d="M291,121Q300,124 309,121" stroke="${m.lips[1]}" stroke-width="2" fill="none" stroke-linecap="round"/>` : ''}`;
  }

  /* ---------------------------------------------------------------- the full picture */
  A.person = function (modelId, outfitId, opts = {}) {
    const m = MODELS[modelId]; const B = BODY[m.body];
    const u = `p${modelId}${outfitId}${opts.backdrop || 'studio'}`;
    const out = (OUT[outfitId] || OUT.before)(u, m.body, m);
    const [base, shade, deep] = m.skin;
    const armL = limb(B.arm.c, B.arm.w), armR = limb(mirror(B.arm.c), B.arm.w);
    const defs = A.filters(u) + backdropDefs(u) + out.defs + `
      <linearGradient id="${u}skin" x1="0" x2="1"><stop offset="0" stop-color="${shade}"/><stop offset=".45" stop-color="${base}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
      <radialGradient id="${u}face" cx=".45" cy=".42" r=".65"><stop offset="0" stop-color="${base}"/><stop offset=".75" stop-color="${base}"/><stop offset="1" stop-color="${shade}"/></radialGradient>`;
    const body = [
      backdrop(u, opts.backdrop || 'studio'),
      `<ellipse cx="300" cy="790" rx="200" ry="20" fill="url(#${u}shadow)"/>`,
      out.back,
      hairBack(m),
      `<path d="${B.neck}" fill="url(#${u}skin)"/><ellipse cx="300" cy="${m.body === 'F' ? 132 : 136}" rx="16" ry="8" fill="${deep}" opacity=".45" filter="url(#${u}blur2)"/>`,
      `<path d="${B.chest}" fill="url(#${u}skin)"/>`,
      m.body === 'F' ? '<path d="M268,178Q284,184 295,181M332,178Q316,184 305,181" stroke="#B98B70" stroke-width="1" fill="none" opacity=".45"/>' : '',
      out.body,
      `<path d="${armL}" fill="url(#${u}skin)"/><path d="${armR}" fill="url(#${u}skin)"/>`,
      out.sleeves,
      `<g fill="${shade}">${B.ears}</g><path d="${B.head}" fill="url(#${u}face)"/>`,
      face(m, u),
      hairFront(m, u),
      out.front,
      opts.grain === false ? '' : `<rect width="600" height="800" filter="url(#${u}grain)" opacity=".8"/>`,
    ].join('');
    return A.svg(600, 800, defs, body, `role="img"${opts.label ? ` aria-label="${opts.label}"` : ' aria-hidden="true"'}`);
  };
  A.personUrl = (modelId, outfitId, backdrop = 'studio') => A.url(`p:${modelId}:${outfitId}:${backdrop}`, () => A.person(modelId, outfitId, { backdrop }));
  A.MODELS = MODELS;
})(window);
