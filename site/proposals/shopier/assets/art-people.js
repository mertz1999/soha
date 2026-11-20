/* Shopier proposal · fashion illustrations for the virtual try-on demo
   Three fictional, illustrated demo models and four original garments, drawn in code on one 600×800 canvas.
   Every model shares one pose, so a garment always lands on the same body: that is what makes the
   before/after comparison line up. These are illustrations, not AI output and not real people.
   The body, face and hair drawings come from the Düğün.com proposal. */
(function (g) {
  'use strict';
  const A = g.SArt; const { f1, limb, mirror } = A;

  /* ---------------------------------------------------------------- bodies (one pose each) */
  const BODY = {
    F: {
      head: 'M300,50C319,50 332,64 332,86C332,104 324,118 313,126C308,129 304,131 300,131C296,131 292,129 287,126C276,118 268,104 268,86C268,64 281,50 300,50Z',
      neck: 'M289,112C290,132 289,150 285,166L315,166C311,150 310,132 311,112Z',
      chest: 'M286,156C276,166 252,170 236,176C224,181 218,192 219,206C222,222 230,232 238,240C237,256 237,266 239,276C242,292 248,306 254,318L262,336H338L346,318C352,306 358,292 361,276C363,266 363,256 362,240C370,232 378,222 381,206C382,192 376,181 364,176C348,170 324,166 314,156Z',
      arm: { c: [[233, 186], [224, 232], [217, 282], [213, 330], [214, 376], [219, 420], [223, 450], [226, 470], [228, 488], [229, 500]], w: [36, 31, 27, 23, 21, 18, 15, 16, 13, 4] },
      ears: '',
    },
  };
  /* ---------------------------------------------------------------- the three demo models (fictional) */
  const MODELS = {
    ada: { body: 'F', skin: ['#EECDB4', '#DCB094', '#C99A7E'], lips: ['#C06A73', '#D48890'], blush: '#E8A09B', hair: 'bun', hc: ['#3A2820', '#5C4235'] },
    nil: { body: 'F', skin: ['#BF8768', '#A57052', '#8E5B42'], lips: ['#A4545C', '#B86A70'], blush: '#C77A6E', hair: 'waves', hc: ['#1E1613', '#43322A'] },
    mira: { body: 'F', skin: ['#E6BC98', '#D3A27E', '#BC8A66'], lips: ['#B5615E', '#C77A74'], blush: '#DD9686', hair: 'bob', hc: ['#7A3B22', '#A35A36'] },
  };

  /* ---------------------------------------------------------------- backdrops: an e-commerce studio and a catalogue sweep */
  function backdrop(u, kind) {
    if (kind === 'none') return '';
    if (kind === 'catalog') {
      return `<rect width="600" height="800" fill="url(#${u}cwall)"/><rect y="690" width="600" height="110" fill="url(#${u}cfloor)"/>
        <path d="M0,0H260L600,640V0Z" fill="#FFFFFF" opacity=".35" filter="url(#${u}blur14)"/>`;
    }
    return `<rect width="600" height="800" fill="url(#${u}wall)"/><rect y="700" width="600" height="100" fill="url(#${u}floor)"/>
      <path d="M0,-20H240L560,820H300Z" fill="#FFFFFF" opacity=".26" filter="url(#${u}blur14)"/>
      <rect x="452" y="0" width="148" height="800" fill="#D9D3CA" opacity=".35" filter="url(#${u}blur14)"/>`;
  }
  function backdropDefs(u) {
    return `
      <linearGradient id="${u}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ECE8E2"/><stop offset=".85" stop-color="#E6E1D9"/><stop offset="1" stop-color="#DFD9CF"/></linearGradient>
      <linearGradient id="${u}floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0DAD0"/><stop offset="1" stop-color="#D3CCC0"/></linearGradient>
      <linearGradient id="${u}cwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F2EE"/><stop offset="1" stop-color="#ECE9E3"/></linearGradient>
      <linearGradient id="${u}cfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAE6DF"/><stop offset="1" stop-color="#E1DCD3"/></linearGradient>
      <radialGradient id="${u}shadow"><stop offset="0" stop-color="#5E5246" stop-opacity=".34"/><stop offset="1" stop-color="#5E5246" stop-opacity="0"/></radialGradient>`;
  }

  /* ---------------------------------------------------------------- clothing
     base(): the everyday outfit in the "before" photo (oatmeal knit, camel trousers, nude heels).
     Each garment returns { defs, body, sleeves, front, inner, keepTop, keepPants, shoes, legs }.
     `inner` fills the gaps of an open garment in the catalogue (ghost mannequin) picture. */
  const lgH = (id, s) => `<linearGradient id="${id}" x1="0" x2="1">${s.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const ARM = { c: [[229, 188], [221, 232], [214, 282], [210, 330], [211, 376], [216, 420], [220, 446]] };
  const sleeve = (w, n = 7, c = ARM.c) => [limb(c.slice(0, n), w), limb(mirror(c.slice(0, n)), w)];

  function base(u) {
    const top = 'M286,158C276,166 252,170 238,176C226,181 220,190 218,204L211,250C222,256 232,258 241,258L242,268C244,292 251,314 257,338L343,338C349,314 356,292 358,268L359,258C368,258 378,256 389,250L382,204C380,190 374,181 362,176C348,170 324,166 314,158C310,166 305,170 300,170C295,170 290,166 286,158Z';
    const pants = 'M259,330H341C350,358 360,388 363,420C368,520 372,640 374,764C352,768 326,769 304,767L300,476L296,767C274,769 248,768 226,764C228,640 232,520 237,420C240,388 250,358 259,330Z';
    let ribs = ''; for (let x = 246; x <= 354; x += 5) ribs += `<path d="M${x},176V340" stroke="#CDBFAA" stroke-width=".7" opacity=".5"/>`;
    return {
      defs: `<clipPath id="${u}topc"><path d="${top}"/></clipPath>`
        + lgH(`${u}top`, [[0, '#D9CCB8'], [0.3, '#EDE4D6'], [0.65, '#E9DFCF'], [1, '#D3C5B0']])
        + lgH(`${u}pants`, [[0, '#9C7B58'], [0.3, '#BC9A75'], [0.5, '#A7855F'], [0.7, '#BE9C77'], [1, '#977654']]),
      heels: '<path d="M240,766Q252,786 284,782Q290,774 286,764Z" fill="#D9B79D"/><path d="M360,766Q348,786 316,782Q310,774 314,764Z" fill="#D9B79D"/>',
      pants: `<path d="${pants}" fill="url(#${u}pants)"/>
        <path d="M300,476V767M262,360C258,500 252,640 248,764M338,360C342,500 348,640 352,764" stroke="#7E6145" stroke-width="1.2" fill="none" opacity=".45"/>
        <path d="M259,331H341L343,343H257Z" fill="#8E6E4E" opacity=".55"/>`,
      top: `<path d="${top}" fill="url(#${u}top)"/><g clip-path="url(#${u}topc)">${ribs}</g>
        <path d="M286,158C290,168 295,172 300,172C305,172 310,168 314,158" fill="none" stroke="#CDBFAA" stroke-width="3"/>
        <path d="M212,246C222,253 232,256 241,256M388,246C378,253 368,256 359,256" fill="none" stroke="#CDBFAA" stroke-width="2.5"/>`,
    };
  }

  const G = {};

  /* Ecru double-breasted blazer, relaxed fit, horn buttons. Worn over the knit and trousers. */
  G.blazer = (u) => {
    const body = 'M284,156C270,166 246,170 230,176C216,181 207,192 207,206L211,300C213,350 219,400 223,442C250,448 276,450 300,450C324,450 350,448 377,442C381,400 387,350 389,300L393,206C393,192 384,181 370,176C354,170 330,166 316,156C310,166 305,170 300,170C295,170 290,166 284,156Z';
    const [sl, sr] = sleeve([54, 49, 45, 41, 38, 36, 35]);
    const lapL = 'M286,160L304,296L286,304C280,262 268,226 252,198L268,188L262,175Z';
    const btn = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="#8C6A4C"/><circle cx="${x}" cy="${y}" r="3.6" fill="none" stroke="#B28E6C" stroke-width="1"/>`;
    return {
      defs: lgH(`${u}bz`, [[0, '#CFC3AE'], [0.28, '#EEE7DA'], [0.5, '#F4EEE4'], [0.75, '#E9E1D3'], [1, '#CBBFA9']]) + lgH(`${u}bzl`, [[0, '#E2D8C7'], [1, '#F6F1E8']]),
      body: `<path d="${body}" fill="url(#${u}bz)"/>
        <path d="M304,296C306,350 312,400 318,449" stroke="#BDB09A" stroke-width="2" fill="none"/>
        <path d="M252,330C254,370 256,410 258,446M348,330C346,370 344,410 342,446M216,300C230,306 240,306 246,302M384,300C370,306 360,306 354,302" stroke="#CFC3AE" stroke-width="1.4" fill="none" opacity=".8"/>
        <path d="M232,396H282M318,396H368" stroke="#BDB09A" stroke-width="2"/><path d="M232,396v10h50v-10M318,396v10h50v-10" fill="#E6DECF" stroke="#C7BBA6" stroke-width="1"/>
        ${btn(282, 318)}${btn(322, 318)}${btn(282, 364)}${btn(322, 364)}`,
      inner: '<path d="M286,158L300,294L314,158C310,166 305,170 300,170C295,170 290,166 286,158Z" fill="#B9AD98"/>',
      front: `<path d="${lapL}" fill="url(#${u}bzl)" stroke="#C2B59F" stroke-width="1.4"/><path d="${lapL}" transform="translate(600,0) scale(-1,1)" fill="url(#${u}bzl)" stroke="#C2B59F" stroke-width="1.4"/>`,
      sleeves: `<path d="${sl}" fill="url(#${u}bz)"/><path d="${sr}" fill="url(#${u}bz)"/>
        <path d="M200,330Q212,338 224,332M400,330Q388,338 376,332M203,440H238M362,440H397" stroke="#C5B9A3" stroke-width="1.5" fill="none"/>`,
      keepTop: true, keepPants: true, shoes: 'heels',
    };
  };

  /* Terracotta linen midi shirt dress with a tie waist and short sleeves. */
  G.dress = (u) => {
    const bodice = 'M286,158C276,166 252,170 238,176C226,181 220,190 218,204L212,252C222,258 232,260 242,260L244,270C246,284 250,296 254,306L346,306C350,296 354,284 356,270L358,260C368,260 378,258 388,252L382,204C380,190 374,181 362,176C348,170 324,166 314,158C310,166 305,170 300,170C295,170 290,166 286,158Z';
    const skirt = 'M254,300H346C362,380 378,520 388,644C350,654 250,654 212,644C222,520 238,380 254,300Z';
    let btn = ''; [196, 228, 260, 290, 340, 400, 460].forEach((y) => { btn += `<circle cx="304" cy="${y}" r="3.2" fill="#F3E2D4" stroke="#9E4C2B" stroke-width=".8"/>`; });
    return {
      defs: lgH(`${u}dr`, [[0, '#9E4C2B'], [0.28, '#C4643C'], [0.5, '#D27852'], [0.72, '#C2623B'], [1, '#97472A']]),
      legs: `<path d="M246,628C248,690 250,730 252,766L276,766C278,730 282,690 288,628Z" fill="url(#${u}skin)"/><path d="M354,628C352,690 350,730 348,766L324,766C322,730 318,690 312,628Z" fill="url(#${u}skin)"/>`,
      body: `<path d="${skirt}" fill="url(#${u}dr)"/><g opacity=".55">${folds(9, 306, 46, 644, 86, '#E0896A', '#8E4226', 17)}</g>
        <path d="M212,644C250,654 350,654 388,644" stroke="#8E4226" stroke-width="1.6" fill="none"/>
        <path d="${bodice}" fill="url(#${u}dr)"/><path d="M300,170V644" stroke="#A9532F" stroke-width="1.3"/>${btn}
        <path d="M252,296H348L350,314H250Z" fill="#B65A35"/><path d="M252,296H348M250,314H350" stroke="#8E4226" stroke-width="1"/>
        <path d="M272,306C262,300 252,304 254,312C256,320 266,318 272,312Z" fill="#C4643C" stroke="#8E4226" stroke-width="1"/>
        <path d="M270,312C266,340 262,362 256,384L266,386C270,364 274,340 276,314ZM276,312C280,338 286,360 292,380L282,384C278,362 274,340 272,314Z" fill="#B65A35" stroke="#8E4226" stroke-width=".8"/>
        <path d="M212,248C222,256 232,258 242,258M388,248C378,256 368,258 358,258" stroke="#8E4226" stroke-width="2" fill="none"/>`,
      inner: '<path d="M288,160C292,168 296,171 300,171C304,171 308,168 312,160L300,196Z" fill="#7E3A20"/>',
      front: '<path d="M286,158L276,184L298,194Z" fill="#CF7048" stroke="#8E4226" stroke-width="1"/><path d="M314,158L324,184L302,194Z" fill="#CF7048" stroke="#8E4226" stroke-width="1"/>',
      sleeves: '',
      keepTop: false, keepPants: false, shoes: 'sandals',
    };
  };

  /* Chocolate suede cropped jacket with a wide collar, worn open over the knit. */
  G.jacket = (u) => {
    const pL = 'M284,156C270,166 248,170 232,176C218,181 212,192 212,206L214,282C216,306 220,326 224,340L288,344L292,250C291,210 289,180 284,156Z';
    const colL = 'M284,156C272,166 254,174 236,182L252,218L282,226L290,196Z';
    const [sl, sr] = sleeve([50, 46, 42, 38, 35, 33, 32]);
    const mir = 'transform="translate(600,0) scale(-1,1)"';
    return {
      defs: lgH(`${u}sd`, [[0, '#432A1D'], [0.3, '#66412E'], [0.5, '#74503A'], [0.72, '#62402D'], [1, '#41291C']]) + lgH(`${u}sdc`, [[0, '#5A3828'], [1, '#7C5641']])
        + `<clipPath id="${u}sdclip"><path d="${pL}"/><path d="${pL}" ${mir}/><path d="${sl}"/><path d="${sr}"/></clipPath>`,
      body: `<path d="${pL}" fill="url(#${u}sd)"/><path d="${pL}" ${mir} fill="url(#${u}sd)"/>
        <path d="M224,338L288,342M376,338L312,342" stroke="#3A2418" stroke-width="3"/>
        <g fill="#C9A66B">${[262, 296, 328].map((y) => `<circle cx="282" cy="${y}" r="4"/>`).join('')}</g>
        <path d="M236,290H270M330,290H364" stroke="#3A2418" stroke-width="1.6"/>`,
      inner: '<path d="M288,158L292,250L288,344H312L308,250L312,158C308,166 304,170 300,170C296,170 292,166 288,158Z" fill="#2E1D14"/>',
      front: `<path d="${colL}" fill="url(#${u}sdc)" stroke="#3A2418" stroke-width="1.2"/><path d="${colL}" ${mir} fill="url(#${u}sdc)" stroke="#3A2418" stroke-width="1.2"/>`,
      sleeves: `<path d="${sl}" fill="url(#${u}sd)"/><path d="${sr}" fill="url(#${u}sd)"/>
        <path d="M200,428H238M362,428H400" stroke="#3A2418" stroke-width="5" opacity=".55"/>
        <g clip-path="url(#${u}sdclip)"><rect width="600" height="460" filter="url(#${u}grain)" opacity=".9"/><rect width="600" height="460" filter="url(#${u}grain)" opacity=".9"/></g>`,
      keepTop: true, keepPants: true, shoes: 'heels',
    };
  };

  const SHOES = {
    heels: (b) => b.heels,
    sandals: () => '<path d="M242,764Q250,784 282,782Q288,776 284,766Z" fill="#C9A27F"/><path d="M358,764Q350,784 318,782Q312,776 316,766Z" fill="#C9A27F"/><path d="M252,758L278,770M348,758L322,770" stroke="#A9825F" stroke-width="4"/>',
  };

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
  function hairBack(m) {
    const [c] = m.hc;
    switch (m.hair) {
      case 'bun': return `<ellipse cx="324" cy="128" rx="15" ry="12" fill="${c}"/><path d="M266,96C262,64 279,42 300,41C321,42 338,64 334,96C333,108 329,118 324,124L276,124C271,118 267,108 266,96Z" fill="${c}"/>`;
      case 'waves': return `<path d="M262,96C256,60 278,38 300,38C324,38 344,60 338,98C342,140 352,190 362,236C366,258 352,270 336,266L264,266C248,270 234,258 238,236C248,190 258,140 262,96Z" fill="${c}"/>`;
      case 'bob': return `<path d="M262,92C258,60 278,39 300,39C322,39 342,60 338,92C340,112 344,134 347,152C334,158 318,154 312,146H288C282,154 266,158 253,152C256,134 260,112 262,92Z" fill="${c}"/>`;
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
      case 'bob': return `<path d="M266,100C262,66 282,45 306,45C328,47 339,66 336,98C330,79 318,65 300,63C290,71 280,85 272,104Z" fill="${c}"/>
        <path d="M268,96C262,120 259,140 261,153C270,156 277,151 279,140C277,124 277,108 281,94ZM334,96C340,120 342,140 340,153C331,156 324,151 322,140C324,124 324,108 320,94Z" fill="${c}"/>
        <path d="M300,63C290,72 282,86 274,104M306,48C292,52 280,62 272,78M320,66C328,78 332,92 334,106" stroke="${hl}" stroke-width="1.3" fill="none" opacity=".7"/>`;
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
  /* ---------------------------------------------------------------- the full picture */
  const shortSleeve = (u, fill, hem) => {
    const c = [[231, 186], [224, 222], [219, 256]], w = [42, 38, 35];
    return `<path d="${limb(c, w)}" fill="${fill}"/><path d="${limb(mirror(c), w)}" fill="${fill}"/>
      <path d="M201,252Q219,262 237,256M399,252Q381,262 363,256" stroke="${hem}" stroke-width="2.4" fill="none"/>`;
  };
  A.person = function (modelId, outfitId, opts = {}) {
    const m = MODELS[modelId]; const B = BODY.F; const kind = opts.backdrop || 'studio';
    const u = `p${modelId}${outfitId}${kind}`;
    const b = base(u); const gm = G[outfitId] ? G[outfitId](u) : null;
    const [skin0, shade, deep] = m.skin;
    const keepTop = !gm || gm.keepTop, keepPants = !gm || gm.keepPants;
    const armL = limb(B.arm.c, B.arm.w), armR = limb(mirror(B.arm.c), B.arm.w);
    const defs = A.filters(u) + backdropDefs(u) + b.defs + (gm ? gm.defs : '') + `
      <linearGradient id="${u}skin" x1="0" x2="1"><stop offset="0" stop-color="${shade}"/><stop offset=".45" stop-color="${skin0}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
      <radialGradient id="${u}face" cx=".45" cy=".42" r=".65"><stop offset="0" stop-color="${skin0}"/><stop offset=".75" stop-color="${skin0}"/><stop offset="1" stop-color="${shade}"/></radialGradient>`;
    let sleeves = gm ? gm.sleeves : '';
    if (!gm) sleeves = shortSleeve(u, `url(#${u}top)`, '#CDBFAA');
    if (outfitId === 'dress') sleeves = shortSleeve(u, `url(#${u}dr)`, '#8E4226');
    const body = [
      backdrop(u, kind),
      `<ellipse cx="300" cy="790" rx="190" ry="18" fill="url(#${u}shadow)"/>`,
      hairBack(m),
      `<path d="${B.neck}" fill="url(#${u}skin)"/><ellipse cx="300" cy="132" rx="16" ry="8" fill="${deep}" opacity=".45" filter="url(#${u}blur2)"/>`,
      `<path d="${B.chest}" fill="url(#${u}skin)"/>`,
      gm && gm.legs ? gm.legs : '',
      SHOES[gm ? gm.shoes : 'heels'](b),
      keepPants ? b.pants : '', keepTop ? b.top : '',
      gm ? gm.body : '',
      `<path d="${armL}" fill="url(#${u}skin)"/><path d="${armR}" fill="url(#${u}skin)"/>`,
      sleeves,
      `<path d="${B.head}" fill="url(#${u}face)"/>`,
      face(m, u), hairFront(m, u),
      gm ? gm.front : '',
      `<rect width="600" height="800" filter="url(#${u}grain)" opacity=".8"/>`,
    ].join('');
    return A.svg(600, 800, defs, body, 'aria-hidden="true"');
  };

  /* A garment on its own, ghost-mannequin style, for the catalogue. */
  const FRAME = { blazer: [303, 1.3], jacket: [250, 1.45], dress: [405, 1.08] };
  A.garment = function (id) {
    const u = `g${id}`; const gm = G[id](u); const b = base(u); const [cy, k] = FRAME[id];
    const defs = A.filters(u) + backdropDefs(u) + b.defs + gm.defs;
    const sl = id === 'dress' ? shortSleeve(u, `url(#${u}dr)`, '#8E4226') : gm.sleeves;
    const body = backdrop(u, 'catalog') + `<ellipse cx="300" cy="760" rx="170" ry="14" fill="url(#${u}shadow)"/>`
      + `<g transform="translate(300,400) scale(${k}) translate(-300,${-cy})">${gm.inner}${gm.body}${sl}${gm.front}</g>`
      + `<rect width="600" height="800" filter="url(#${u}grain)" opacity=".7"/>`;
    return A.svg(600, 800, defs, body, 'aria-hidden="true"');
  };

  A.personUrl = (modelId, outfitId, backdrop = 'studio') => A.url(`p:${modelId}:${outfitId}:${backdrop}`, () => A.person(modelId, outfitId, { backdrop }));
  A.garmentUrl = (id) => A.url(`g:${id}`, () => A.garment(id));
  A.MODELS = MODELS;
  A.GARMENTS = Object.keys(G);
})(window);
