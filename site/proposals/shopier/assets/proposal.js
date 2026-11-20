/* Shopier proposal · interactions
   Hero sequence, AI Product Studio, AI Campaign Studio, AI Virtual Try-On, the connected flow and slide
   navigation. Demo mode throughout: prepared examples, no network calls, no live model. Uploaded files
   stay in the browser and are never processed or sent anywhere.
   The page language comes from <html lang> (English default page, Turkish at /tr/). */
(function () {
  'use strict';
  const A = window.SArt, C = window.SCampaign;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('motion');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const { L, LANG } = C;

  /* ------------------------------------------------------------ demo content (fictional) */
  const PRODUCTS = {
    bag: { name: L('Hilal Çanta', 'Hilal Bag'), brand: 'Saye Atelier' },
    earrings: { name: L('Damla Küpe', 'Damla Earrings'), brand: 'Ilgın Jewelry' },
    serum: { name: 'Gül Serum', brand: 'Nemra Skin' },
  };
  const STYLES = [
    { id: 'studio', name: L('Stüdyo', 'Studio'), vars: [L('Fildişi set', 'Ivory set'), L('Traverten kaide', 'Travertine plinth')] },
    { id: 'lifestyle', name: L('Yaşam', 'Lifestyle'), vars: [L('Mermer kafe', 'Marble café'), L('Ege terası', 'Aegean terrace')] },
    { id: 'luxury', name: L('Lüks Kampanya', 'Luxury Campaign'), vars: [L('Gece sahnesi', 'Night stage'), L('İpek drape', 'Silk drape')] },
    { id: 'seasonal', name: L('Sezonluk', 'Seasonal'), vars: [L('Yılbaşı', 'New Year'), L('Sevgililer Günü', 'Valentine’s Day')] },
  ];
  const STYLE = Object.fromEntries(STYLES.map((s) => [s.id, s]));
  const COPY = {
    bag: { brand: 'Saye Atelier', title: L('Yeni Sezon Koleksiyonu', 'New Season Collection'), message: L('El yapımı deri, zamansız form.', 'Handmade leather, timeless form.'), discount: 20, cta: L('Keşfet', 'Shop now'), palette: 'night', scene: 'lifestyle-1' },
    earrings: { brand: 'Ilgın Jewelry', title: L('Işıltının Yeni Hali', 'A New Kind of Shine'), message: L('Altın kaplama, tatlı su incisi.', 'Gold plated, freshwater pearl.'), discount: 0, cta: L('İncele', 'Discover'), palette: 'sand', scene: 'luxury-1' },
    serum: { brand: 'Nemra Skin', title: L('Gül Serum Burada', 'Meet Gül Serum'), message: L('Her gün nem ve doğal ışıltı.', 'Daily moisture, natural glow.'), discount: 15, cta: L('Hemen Al', 'Buy now'), palette: 'terra', scene: 'studio-2' },
  };
  const GARMENTS = [
    { id: 'blazer', name: L('Kruvaze Keten Blazer', 'Double-Breasted Linen Blazer'), price: 3490 },
    { id: 'dress', name: L('Keten Gömlek Elbise', 'Linen Shirt Dress'), price: 2790 },
    { id: 'jacket', name: L('Kısa Süet Ceket', 'Cropped Suede Jacket'), price: 4990 },
  ];
  const GAR = Object.fromEntries(GARMENTS.map((g) => [g.id, g]));
  const MODELS = [{ id: 'ada', name: 'Ada' }, { id: 'nil', name: 'Nil' }, { id: 'mira', name: 'Mira' }];
  const price = (n) => (LANG === 'tr' ? `${n.toLocaleString('tr-TR')} TL` : `₺${n.toLocaleString('en-US')}`);

  const STR = {
    light: { soft: L('yumuşak ışık', 'soft light'), natural: L('doğal ışık', 'natural light'), dramatic: L('dramatik ışık', 'dramatic light') },
    mood: { warm: L('sıcak ton', 'warm tone'), neutral: L('nötr ton', 'neutral tone'), cool: L('serin ton', 'cool tone') },
    locked: L('ürün kilitli', 'product locked'),
    resultAlt: (p, s, v) => L(`${p}, ${s} stili, ${v} (hazır örnek görsel)`, `${p}, ${s} style, ${v} (prepared example image)`),
    origAlt: (p) => L(`${p}, sade bir telefon fotoğrafı (örnek görsel)`, `${p} in a plain phone photo (example image)`),
    fullCap: (p, s, v) => L(`Hazır örnek · ${p} · ${s} · ${v}. Canlı üretim değildir; ürün her görselde aynıdır.`, `Prepared example · ${p} · ${s} · ${v}. Not live output; the product is identical in every image.`),
    uploadOk: L('Fotoğrafınız yalnızca bu cihazda gösteriliyor; işlenmedi', 'Your photo is shown on this device only; it was not processed'),
    uploadGone: L('Fotoğraf kaldırıldı', 'Photo removed'),
    reset: L('Demo sıfırlandı', 'Demo reset'),
    camPhoto: (v) => L(`Görsel: Ürün Stüdyosu'ndan · ${v}`, `Photo: from the Product Studio · ${v}`),
    png: L('PNG hazır', 'PNG ready'), svg: L('SVG hazır', 'SVG ready'), exporting: L('Hazırlanıyor…', 'Preparing…'),
    exportFail: L('Dışa aktarma bu tarayıcıda yapılamadı', 'Export did not work in this browser'),
    logoOk: L('Logo yalnızca bu cihazda kullanılıyor', 'The logo is used on this device only'), logoBig: L('Logo 2 MB’den küçük olmalı', 'The logo must be under 2 MB'),
    edit: (f) => L(`${f} alanını düzenleyin`, `Edit the ${f} field`),
    fields: { brand: L('Marka', 'brand'), title: L('Kampanya adı', 'campaign name'), message: L('Mesaj', 'message'), cta: L('Buton', 'button'), discount: L('İndirim', 'discount') },
    garAlt: (g) => L(`${g}, katalog görseli (örnek görsel)`, `${g}, catalogue image (example image)`),
    beforeAlt: (m) => L(`${m}, günlük kıyafetle (kurgusal demo model)`, `${m} in everyday clothes (fictional demo model)`),
    afterAlt: (m, g) => L(`${m}, ${g} ile (hazır örnek görsel)`, `${m} wearing the ${g} (prepared example image)`),
    toCap: (m, g) => L(`Hazır örnek · ${m} · ${g}. Canlı deneme değildir.`, `Prepared example · ${m} · ${g}. Not a live try-on.`),
    toHead: (m, g) => `${m} · ${g}`,
    tryOk: L('Fotoğrafınız işlenmedi ve cihazınızdan çıkmadı', 'Your photo was not processed and has not left your device'),
    model: L('Model', 'Model'),
    copyReset: (p) => L(`${p} için örnek metin yüklendi`, `Sample copy loaded for ${p}`),
  };

  /* ------------------------------------------------------------ images
     Photos generated in advance live in assets/photos/ and are listed in PHOTOS once they exist.
     Product scenes are not separate photos. Each product is cut out of its one phone photo (<product>-cutout,
     made on a Mac with tools/proposals/cutout.swift) and placed here, in the browser, on a shared empty
     background (bg-<style>-<n>) with a shadow and a light grade to match the scene. So the product in every
     scene is the original photo's own pixels, as in the production pipeline.
     Anything not listed uses its code-drawn illustration, and a photo that fails to load falls back too. */
  const PHOTO_DIR = new URL('photos/', document.currentScript.src).href;
  const PHOTOS = new Set([
    'bag-original', 'earrings-original', 'serum-original', 'bag-cutout', 'earrings-cutout', 'serum-cutout',
    'bg-studio-1', 'bg-studio-2', 'bg-lifestyle-1', 'bg-lifestyle-2', 'bg-luxury-1', 'bg-luxury-2', 'bg-seasonal-1', 'bg-seasonal-2',
  ]);
  const fallback = (spec) => {
    const [k, a, b] = spec.split(':');
    if (k === 'p') return A.sceneUrl(a, b);
    if (k === 't') return A.personUrl(a, b, 'studio');
    if (k === 'g') return A.garmentUrl(a);
    return A.productUrl(a);
  };
  const fileOf = (spec) => {
    const [k, a, b] = spec.split(':');
    if (k === 'p') return `${a}-${b}`;
    if (k === 't') return b === 'before' ? `model-${a}-before` : `tryon-${a}-${b}`;
    if (k === 'g') return `garment-${a}`;
    return `${a}-cutout`;
  };
  const isScene = (spec) => spec.startsWith('p:') && !spec.endsWith(':original'); // includes the :wide versions
  const pic = (spec) => { if (isScene(spec)) return scenePic(spec); const f = fileOf(spec); return PHOTOS.has(f) ? `${PHOTO_DIR}${f}.webp` : fallback(spec); };
  // While a scene is still being composited, the image keeps what it showed before; it updates when ready.
  const setPic = (img, spec) => {
    img.dataset.fb = spec; delete img.dataset.fell; const c = focusY(spec);
    if (c == null) img.style.removeProperty('--fy'); else img.style.setProperty('--fy', c);
    const u = pic(spec); if (u !== BLANK || !img.getAttribute('src') || img.src === BLANK) img.src = u;
  };
  document.addEventListener('error', (e) => { const t = e.target; if (t.tagName === 'IMG' && t.dataset.fb && !t.dataset.fell) { t.dataset.fell = '1'; t.src = fallback(t.dataset.fb); } }, true);

  /* Where the product stands in each background (x and base as fractions of the square, scale on top of FIT)
     and how the scene lights it. The light comes from the left in every background. Tuned per photo. */
  const BG0 = { x: 0.5, base: 0.78, scale: 1, cast: 'soft', contact: 0.5, lit: 0.06, shade: 0.16, tint: '', ta: 0, dark: 0, reflect: 0, rim: '' };
  const BG = {
    'studio-1': { base: 0.84 },
    'studio-2': { base: 0.82, cast: 'side' },
    'lifestyle-1': { base: 0.85, cast: 'sun', tint: '#F6E3C6', ta: 0.07, lit: 0.1 },
    'lifestyle-2': { base: 0.81, cast: 'sun', lit: 0.12, tint: '#FFE2B5', ta: 0.09 },
    'luxury-1': { base: 0.775, cast: 'none', contact: 0.7, dark: 0.2, reflect: 0.24, rim: 'rgba(178,150,255,.6)' },
    'luxury-2': { base: 0.85, tint: '#E9C3D6', ta: 0.08, dark: 0.12 },
    'seasonal-1': { base: 0.86, tint: '#FFC890', ta: 0.1, dark: 0.1 },
    'seasonal-2': { base: 0.8, tint: '#FFCAD2', ta: 0.08 },
  };
  const FIT = { bag: 0.5, earrings: 0.48, serum: 0.46 }; // product height as a share of the frame
  // Cast shadows: skew to the right, depth (positive falls behind the product, negative towards the camera), opacity, blur.
  const CAST = { soft: [0.35, 0.14, 0.2, 26], side: [0.6, 0.17, 0.24, 16], sun: [0.55, -0.13, 0.3, 7] };
  const IMGS = new Map();
  const load = (f) => {
    if (!IMGS.has(f)) IMGS.set(f, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = `${PHOTO_DIR}${f}.webp`; }));
    return IMGS.get(f);
  };
  const layer = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  // Left and right edge of the product's bottom rows (its footprint), as fractions of the cut-out width.
  const footOf = (img) => {
    const w = 160, h = Math.max(8, Math.round((w * img.naturalHeight) / img.naturalWidth));
    const t = layer(w, h).getContext('2d', { willReadFrequently: true }); t.drawImage(img, 0, 0, w, h);
    const rows = Math.max(2, Math.round(h * 0.04)); const d = t.getImageData(0, h - rows, w, rows).data; let l = w, r = -1;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 128) { const x = ((i - 3) / 4) % w; l = Math.min(l, x); r = Math.max(r, x); }
    return r < l ? [0.25, 0.75] : [l / w, (r + 1) / w];
  };
  // Square by default. Two variants:
  // - 'wide' is a 16:9 version for the 16:9 format: a band of the background around the surface, with the
  //   product at a natural size in it, rather than a crop that would fill the frame with it.
  // - 'ad' is for the editorial campaign layouts, whose headline sits over the bottom of the image: the scene
  //   moves up so the product ends above the text, and the strip left at the bottom mirrors the surface.
  async function composite(kind, scene, variant) {
    const wide = variant === 'wide', ad = variant === 'ad';
    const [bg, cut] = await Promise.all([load(`bg-${scene}`), load(`${kind}-cutout`)]);
    const m = { ...BG0, ...BG[scene] }; const N = 1200, H = wide ? Math.round((N * 9) / 16) : N;
    const cv = layer(N, H); const x = cv.getContext('2d');
    const r = Math.max(N / bg.naturalWidth, N / bg.naturalHeight), bw = bg.naturalWidth * r, bh = bg.naturalHeight * r;
    const top = wide ? Math.min(0, Math.max(H - bh, H * 0.82 - m.base * bh)) : ad ? Math.min((H - bh) / 2, H * 0.64 - m.base * bh) : (H - bh) / 2;
    x.drawImage(bg, (N - bw) / 2, top, bw, bh);
    if (top + bh < H) { x.save(); x.translate(0, 2 * (top + bh)); x.scale(1, -1); x.drawImage(bg, (N - bw) / 2, top, bw, bh); x.restore(); }
    const ph = (wide ? H * 0.6 : N * FIT[kind] * (ad ? 0.8 : 1)) * m.scale, pw = (ph * cut.naturalWidth) / cut.naturalHeight;
    const cx = N * m.x, by = top + m.base * bh, px = cx - pw / 2, py = by - ph;
    // The product, graded to the scene: lit from the left, a little shade on the right, the scene's colour cast.
    const pc = layer(pw, ph); const p = pc.getContext('2d');
    p.drawImage(cut, 0, 0, pc.width, pc.height); p.globalCompositeOperation = 'source-atop';
    const g = p.createLinearGradient(0, 0, pc.width, 0);
    g.addColorStop(0, `rgba(255,255,255,${m.lit})`); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(0,0,0,${m.shade})`);
    p.fillStyle = g; p.fillRect(0, 0, pc.width, pc.height);
    if (m.ta) { p.globalAlpha = m.ta; p.fillStyle = m.tint; p.fillRect(0, 0, pc.width, pc.height); p.globalAlpha = 1; }
    if (m.dark) { p.fillStyle = `rgba(0,0,0,${m.dark})`; p.fillRect(0, 0, pc.width, pc.height); }
    // Rim light: a thin strip along the product's own left and top edges, in the scene's light colour.
    if (m.rim) {
      const ec = layer(pw, ph); const e = ec.getContext('2d'); const d = Math.max(2, pw * 0.012);
      e.drawImage(cut, 0, 0, ec.width, ec.height); e.globalCompositeOperation = 'destination-out'; e.drawImage(cut, d, d * 0.7, ec.width, ec.height);
      e.globalCompositeOperation = 'source-in'; e.fillStyle = m.rim; e.fillRect(0, 0, ec.width, ec.height);
      p.globalCompositeOperation = 'screen'; p.drawImage(ec, 0, 0); p.globalCompositeOperation = 'source-over';
    }
    // Shadows use the canvas shadow blur: the shape is drawn off the canvas and only its shadow lands in frame.
    const OFF = N * 4; // (H is the height, N the width)
    const ghost = (t, color, blur, dx = 0, dy = 0) => {
      x.save(); x.shadowColor = color; x.shadowBlur = blur; x.shadowOffsetX = OFF + dx; x.shadowOffsetY = dy;
      x.setTransform(t[0], t[1], t[2], t[3], t[4] - OFF, t[5]); x.drawImage(pc, -pw / 2, -ph, pw, ph); x.restore();
    };
    if (CAST[m.cast]) { const [sk, dp, op, bl] = CAST[m.cast]; ghost([1, 0, -sk, dp, cx, by], `rgba(28,18,10,${op})`, bl); }
    const [fl, fr] = footOf(cut); const fx = px + pw * ((fl + fr) / 2), rx = Math.max(pw * 0.18, pw * (fr - fl) * 0.62);
    [[rx, rx * 0.09, m.contact], [rx * 1.5, rx * 0.2, m.contact * 0.45]].forEach(([a, b, o]) => {
      x.save(); x.translate(fx, by); x.scale(1, b / a); const rg = x.createRadialGradient(0, 0, 0, 0, 0, a);
      rg.addColorStop(0, `rgba(22,14,8,${o})`); rg.addColorStop(1, 'rgba(22,14,8,0)'); x.fillStyle = rg; x.fillRect(-a, -a, 2 * a, 2 * a); x.restore();
    });
    if (m.reflect) {
      const rc = layer(pw, ph * 0.45); const rr = rc.getContext('2d');
      rr.translate(0, pc.height); rr.scale(1, -1); rr.drawImage(pc, 0, 0); rr.setTransform(1, 0, 0, 1, 0, 0);
      const fade = rr.createLinearGradient(0, 0, 0, rc.height); fade.addColorStop(0, `rgba(0,0,0,${m.reflect})`); fade.addColorStop(1, 'rgba(0,0,0,0)');
      rr.globalCompositeOperation = 'destination-in'; rr.fillStyle = fade; rr.fillRect(0, 0, rc.width, rc.height);
      x.drawImage(rc, px, by + 2, pw, ph * 0.45);
    }
    x.drawImage(pc, px, py, pw, ph);
    return toUrl(cv);
  }
  const toUrl = async (cv) => {
    const blob = await new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('blob'))), 'image/jpeg', 0.9));
    return URL.createObjectURL(blob);
  };
  // The phone photo in a 16:9 frame: the whole photo, centred on a blurred, darkened copy of itself.
  async function framedOriginal(kind) {
    const ph = await load(`${kind}-original`); const W = 1200, H = 675;
    const cv = layer(W, H); const x = cv.getContext('2d');
    const sm = layer(48, 27); sm.getContext('2d').drawImage(ph, 0, (ph.naturalHeight - (ph.naturalWidth * 9) / 16) / 2, ph.naturalWidth, (ph.naturalWidth * 9) / 16, 0, 0, 48, 27);
    x.imageSmoothingQuality = 'high'; x.drawImage(sm, 0, 0, W, H); x.fillStyle = 'rgba(20,16,12,.18)'; x.fillRect(0, 0, W, H);
    const w = (H * ph.naturalWidth) / ph.naturalHeight; x.drawImage(ph, (W - w) / 2, 0, w, H);
    return toUrl(cv);
  }
  // Where the product's centre sits in a composited scene (fraction of the height), so wide crops keep it in
  // view (the --fy property, used in shopier.css). Null for illustrations, which use the CSS defaults.
  function focusY(spec) {
    if (!isScene(spec)) return null; const [, k, s, f] = spec.split(':');
    if (f || !hasPhotos(k, s)) return null;
    const m = { ...BG0, ...BG[s] }; return +(m.base - (FIT[k] * m.scale) / 2).toFixed(3);
  }
  // A scene image: the composite once it is ready (a blank frame for the few milliseconds before), or the
  // illustration when the photos for it are not there.
  const BLANK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN49ewBAAVuArGJTF5AAAAAAElFTkSuQmCC'; // a plain warm-grey pixel
  const SCENES = new Map(); const CUT_RATIO = {};
  let artQueued = false;
  const queueArt = () => { if (artQueued) return; artQueued = true; setTimeout(() => { artQueued = false; csRender(false); staticAds(); }, 0); };
  const hasPhotos = (k, s) => (s === 'original' ? PHOTOS.has(`${k}-original`) : PHOTOS.has(`${k}-cutout`) && PHOTOS.has(`bg-${s}`));
  function scenePic(spec) {
    const [, k, s, f] = spec.split(':');
    if (!hasPhotos(k, s)) return fallback(spec);
    let e = SCENES.get(spec);
    if (!e) {
      e = {}; SCENES.set(spec, e);
      e.p = (s === 'original' ? framedOriginal(k) : composite(k, s, f)).then((u) => { e.url = u; }, () => { e.failed = true; }).then(() => {
        $$('img[data-fb]').forEach((img) => { if (img.dataset.fb === spec && !img.dataset.fell) img.src = pic(spec); });
        const main = spec.split(':').slice(0, 3).join(':');
        if (main === 'p:bag:luxury-1' || Object.entries(lastScene).some(([pk, ps]) => main === `p:${pk}:${ps}`)) queueArt();
      });
    }
    return e.url || (e.failed ? fallback(spec) : BLANK);
  }
  // The campaign layouts size the product shadow from the cut-out's proportions.
  Object.keys(PRODUCTS).forEach((k) => { if (PHOTOS.has(`${k}-cutout`)) load(`${k}-cutout`).then((i) => { CUT_RATIO[k] = i.naturalWidth / i.naturalHeight; queueArt(); }, () => {}); });
  // After the page has loaded, build the remaining scenes one by one, so switching is instant later.
  window.addEventListener('load', () => setTimeout(async () => {
    for (const k of Object.keys(PRODUCTS)) for (const st of STYLES) for (let i = 1; i <= st.vars.length; i++) {
      const spec = `p:${k}:${st.id}-${i}`; if (SCENES.has(spec)) continue;
      scenePic(spec); const e = SCENES.get(spec); if (e && e.p) await e.p;
    }
  }, 1200));
  $$('[data-pic]').forEach((img) => { img.decoding = 'async'; setPic(img, img.dataset.pic); });
  const imgTag = (spec, alt = '', extra = '') => { const c = focusY(spec); return `<img src="${pic(spec)}" data-fb="${spec}" alt="${esc(alt)}" decoding="async"${c == null ? '' : ` style="--fy:${c}"`}${extra}>`; };

  /* ------------------------------------------------------------ shared bits */
  const toastEl = $('#toast'); let toastT;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2800); };
  const swap = (el) => { if (reduce || !el) return; el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); };
  const radio = (group, el) => $$('[role="radio"]', group).forEach((b) => { const on = b === el; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
  // Arrow keys move between options in a radio group (the roving tab stop).
  function radioKeys(group, onPick) {
    group.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }; if (!(e.key in keys)) return;
      const items = $$('[role="radio"]', group); const i = items.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); const n = items[(i + keys[e.key] + items.length) % items.length]; n.focus(); onPick(n);
    });
  }
  const readLocal = (file, max) => new Promise((res, rej) => {
    if (!file || !file.type.startsWith('image/')) return rej(new Error('type'));
    if (max && file.size > max) return rej(new Error('size'));
    const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
  });

  /* Dialogs: close buttons and backdrop clicks. */
  $$('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); }));
  const lb = $('#lb');
  const openLightbox = (src, cap) => { const img = $('#lb-img'); img.src = src; img.alt = cap; $('#lb-cap').textContent = cap; lb.showModal(); };

  /* Before/after comparison: --pos is where the split sits; the "after" layer shows to its right. */
  function setPos(cmp, v, animate) {
    cmp.classList.toggle('dragging', !animate);
    cmp.style.setProperty('--pos', `${v}%`); cmp.classList.toggle('at-start', v <= 0.5); cmp.classList.toggle('at-end', v >= 99.5);
    const r = $('.cmp-range', cmp); if (r) r.value = v;
  }
  function bindCompare(cmp) {
    const r = $('.cmp-range', cmp);
    r.addEventListener('input', () => setPos(cmp, +r.value, false));
    r.addEventListener('change', () => cmp.classList.remove('dragging'));
  }
  const sweep = (cmp) => { if (reduce) { setPos(cmp, 50, true); return; } setPos(cmp, 100, false); void cmp.offsetWidth; setTimeout(() => setPos(cmp, 50, true), 30); };

  /* ------------------------------------------------------------ campaign art used outside the studio */
  const lastScene = { bag: COPY.bag.scene, earrings: COPY.earrings.scene, serum: COPY.serum.scene };
  const campSpec = (o) => {
    const k = o.kind || 'bag'; const c = COPY[k];
    return { direction: 'editorial', format: 'portrait', kind: k, brand: c.brand, title: c.title, message: c.message, discount: c.discount, cta: c.cta, palette: c.palette, logo: null, color: null, img: { cut: pic(`cut:${k}`), scene: pic(`p:${k}:${lastScene[k]}`), sceneAd: pic(`p:${k}:${lastScene[k]}:ad`), ratio: CUT_RATIO[k] }, ...o };
  };
  function staticAds() {
    const hero = $('[data-hero-ad]'); if (hero) hero.innerHTML = C.render(campSpec({ format: 'portrait', discount: 0, img: { cut: pic('cut:bag'), scene: pic('p:bag:luxury-1'), sceneAd: pic('p:bag:luxury-1:ad'), ratio: CUT_RATIO.bag } }));
    const trio = $('[data-trio-ad]'); if (trio) trio.innerHTML = C.render(campSpec({ direction: 'bold', format: 'story', palette: 'violet' }));
    const flow = $('[data-flow-ad]'); if (flow) flow.innerHTML = C.render(campSpec({ direction: 'bold', format: 'post', palette: 'violet' }));
  }

  /* ------------------------------------------------------------ 1 · hero sequence */
  const hero = { i: 0, t: null, hover: false, visible: true };
  const looks = $$('#stage .look'); const stepBtns = $$('#stage-steps button'); const heroStage = $('#hero-stage');
  const DWELL = 3200;
  function showLook(i) {
    const prev = hero.i; hero.i = i;
    looks.forEach((l, n) => { l.classList.toggle('is-on', n === i); l.classList.toggle('was-on', n === prev && n !== i); });
    $('#stage').dataset.look = i;
    stepBtns.forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    // restart the progress bar on the active step
    const bar = stepBtns[i] && $('i', stepBtns[i]); if (bar) { bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = ''; }
  }
  function heroTick() {
    clearTimeout(hero.t);
    const auto = !reduce && !hero.hover && hero.visible;
    heroStage.classList.toggle('is-auto', auto);
    if (auto) hero.t = setTimeout(() => { showLook((hero.i + 1) % looks.length); heroTick(); }, DWELL);
  }
  heroStage.style.setProperty('--dwell', `${DWELL}ms`);
  stepBtns.forEach((b) => b.addEventListener('click', () => { showLook(+b.dataset.goLook); heroTick(); }));
  heroStage.addEventListener('pointerenter', () => { hero.hover = true; heroTick(); });
  heroStage.addEventListener('pointerleave', () => { hero.hover = false; heroTick(); });
  heroStage.addEventListener('focusin', () => { hero.hover = true; heroTick(); });
  heroStage.addEventListener('focusout', () => { hero.hover = false; heroTick(); });

  /* ------------------------------------------------------------ 3 · product studio */
  const ps = { kind: 'bag', style: 'studio', v: 0, light: 'natural', mood: 'neutral', ratio: '1/1', upload: null };
  const psCmp = $('#ps-cmp'); bindCompare(psCmp);
  const sceneId = () => `${ps.style}-${ps.v + 1}`;
  function psProducts() {
    const g = $('#ps-products');
    g.innerHTML = Object.entries(PRODUCTS).map(([k, p]) => `<button type="button" role="radio" aria-checked="${k === ps.kind}" tabindex="${k === ps.kind ? 0 : -1}" data-v="${k}">${imgTag(`p:${k}:original`)}<span>${esc(p.name)}</span></button>`).join('');
  }
  function psStyles() {
    $('#ps-styles').innerHTML = STYLES.map((s) => `<button type="button" role="radio" aria-checked="${s.id === ps.style}" tabindex="${s.id === ps.style ? 0 : -1}" data-v="${s.id}">${imgTag(`p:${ps.kind}:${s.id}-1`)}<span>${esc(s.name)}</span></button>`).join('');
  }
  function psBgs() {
    $('#ps-bgs').innerHTML = STYLE[ps.style].vars.map((v, i) => `<button type="button" role="radio" aria-checked="${i === ps.v}" tabindex="${i === ps.v ? 0 : -1}" data-v="${i}">${esc(v)}</button>`).join('');
  }
  function psVars() {
    const s = STYLE[ps.style];
    $('#ps-vars').innerHTML = s.vars.map((v, i) => `<button type="button" role="radio" aria-checked="${i === ps.v}" tabindex="${i === ps.v ? 0 : -1}" data-v="${i}" aria-label="${esc(`${s.name}: ${v}`)}">${imgTag(`p:${ps.kind}:${s.id}-${i + 1}`)}<span>${esc(v)}</span></button>`).join('');
  }
  function psResult(doSweep) {
    const p = PRODUCTS[ps.kind]; const s = STYLE[ps.style]; const v = s.vars[ps.v];
    setPic($('#ps-orig'), `p:${ps.kind}:original`); $('#ps-orig').alt = STR.origAlt(p.name);
    const wide = ps.ratio === '16/9' ? ':wide' : '';
    setPic($('#ps-before'), `p:${ps.kind}:original${wide}`); $('#ps-before').alt = STR.origAlt(p.name);
    const after = $('#ps-after'); setPic(after, `p:${ps.kind}:${sceneId()}${wide}`); after.alt = STR.resultAlt(p.name, s.name, v);
    after.dataset.light = ps.light; after.dataset.mood = ps.mood;
    $('#ps-lab').textContent = s.name; $('#ps-crumb').textContent = p.name;
    psCmp.style.setProperty('--ratio', ps.ratio.replace('/', ' / ')); psCmp.dataset.ratio = ps.ratio;
    $('#ps-brief').textContent = `${p.name} · ${s.name} · ${v} · ${STR.light[ps.light]} · ${STR.mood[ps.mood]} · ${ps.ratio.replace('/', ':')} · ${STR.locked}`;
    if (ps.touched) lastScene[ps.kind] = sceneId();
    if (doSweep) sweep(psCmp); else swap(after);
  }
  function psAll(doSweep) { psProducts(); psStyles(); psBgs(); psVars(); psResult(doSweep); }
  const pickProduct = (b) => { if (!b || b.dataset.v === ps.kind) return; ps.touched = true; ps.kind = b.dataset.v; psAll(true); csSyncScene(); };
  const pickStyle = (b) => { if (!b || b.dataset.v === ps.style) return; ps.touched = true; ps.style = b.dataset.v; ps.v = 0; radio($('#ps-styles'), b); psBgs(); psVars(); psResult(true); csSyncScene(); };
  const pickVar = (b) => { if (!b) return; ps.touched = true; ps.v = +b.dataset.v; psBgs(); psVars(); psResult(false); csSyncScene(); };
  $('#ps-products').addEventListener('click', (e) => pickProduct(e.target.closest('[role="radio"]')));
  $('#ps-styles').addEventListener('click', (e) => pickStyle(e.target.closest('[role="radio"]')));
  $('#ps-bgs').addEventListener('click', (e) => pickVar(e.target.closest('[role="radio"]')));
  $('#ps-vars').addEventListener('click', (e) => pickVar(e.target.closest('[role="radio"]')));
  radioKeys($('#ps-products'), pickProduct); radioKeys($('#ps-styles'), pickStyle);
  radioKeys($('#ps-bgs'), (b) => { pickVar(b); $(`#ps-bgs [data-v="${ps.v}"]`).focus(); });
  radioKeys($('#ps-vars'), (b) => { pickVar(b); $(`#ps-vars [data-v="${ps.v}"]`).focus(); });
  [['#ps-light', 'light'], ['#ps-mood', 'mood'], ['#ps-ratio', 'ratio']].forEach(([sel, key]) => {
    const g = $(sel); $$('[role="radio"]', g).forEach((b) => { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; });
    const pick = (b) => { if (!b) return; ps[key] = b.dataset.v; radio(g, b); psResult(false); };
    g.addEventListener('click', (e) => pick(e.target.closest('[role="radio"]'))); radioKeys(g, pick);
  });
  $('#ps-full').addEventListener('click', () => { const s = STYLE[ps.style]; openLightbox($('#ps-after').src, STR.fullCap(PRODUCTS[ps.kind].name, s.name, s.vars[ps.v])); });
  function psClearUpload(silent) { ps.upload = null; $('#ps-mine').hidden = true; $('#ps-mine-img').removeAttribute('src'); $('#ps-clear').hidden = true; $('#ps-notice').hidden = true; $('#ps-file').value = ''; if (!silent) toast(STR.uploadGone); }
  $('#ps-file').addEventListener('change', async (e) => {
    try { ps.upload = await readLocal(e.target.files[0]); } catch (err) { return; }
    $('#ps-mine-img').src = ps.upload; $('#ps-mine').hidden = false; $('#ps-clear').hidden = false; $('#ps-notice').hidden = false; toast(STR.uploadOk);
  });
  $('#ps-clear').addEventListener('click', () => psClearUpload(false));
  $('#ps-reset').addEventListener('click', () => {
    Object.assign(ps, { kind: 'bag', style: 'studio', v: 0, light: 'natural', mood: 'neutral', ratio: '1/1', touched: false });
    Object.keys(lastScene).forEach((k) => { lastScene[k] = COPY[k].scene; });
    [['#ps-light', 'natural'], ['#ps-mood', 'neutral'], ['#ps-ratio', '1/1']].forEach(([sel, v]) => radio($(sel), $(`${sel} [data-v="${v}"]`)));
    psClearUpload(true); psAll(true); csSyncScene(); toast(STR.reset);
  });

  /* ------------------------------------------------------------ 4 · campaign studio */
  const cs = { kind: 'bag', direction: 'editorial', format: 'post', palette: COPY.bag.palette, color: null, logo: null, discountOn: true, ...COPY.bag };
  const FIELD_INPUT = { brand: '#cs-brand', title: '#cs-title', message: '#cs-message', cta: '#cs-cta', discount: '#cs-disc' };
  const spec = (format) => ({
    direction: cs.direction, format, kind: cs.kind, brand: cs.brand, title: cs.title, message: cs.message,
    discount: cs.discountOn ? cs.discount : 0, cta: cs.cta, logo: cs.logo, palette: cs.palette, color: cs.color,
    img: { cut: pic(`cut:${cs.kind}`), scene: pic(`p:${cs.kind}:${lastScene[cs.kind]}`), sceneAd: pic(`p:${cs.kind}:${lastScene[cs.kind]}:ad`), ratio: CUT_RATIO[cs.kind] },
  });
  function csProducts() {
    $('#cs-products').innerHTML = Object.entries(PRODUCTS).map(([k, p]) => `<button type="button" role="radio" aria-checked="${k === cs.kind}" tabindex="${k === cs.kind ? 0 : -1}" data-v="${k}">${imgTag(`p:${k}:studio-1`)}<span>${esc(p.name)}</span></button>`).join('');
  }
  function csPalettes() {
    $('#cs-pal').innerHTML = C.PALETTES.map((p) => `<button type="button" role="radio" aria-checked="${!cs.color && p.id === cs.palette}" tabindex="${p.id === cs.palette ? 0 : -1}" data-v="${p.id}" aria-label="${esc(p.name)}" title="${esc(p.name)}" style="--sw:${p.strong};--sw2:${p.accent}"></button>`).join('');
  }
  function csFields() {
    $('#cs-brand').value = cs.brand; $('#cs-title').value = cs.title; $('#cs-message').value = cs.message; $('#cs-cta').value = cs.cta;
    $('#cs-disc').value = cs.discount || 20; $('#cs-disc-on').checked = cs.discountOn; $('#cs-disc').disabled = !cs.discountOn;
    $('#cs-color').value = cs.color || C.PALETTES.find((p) => p.id === cs.palette).strong;
  }
  let csQueued = false, csAnim = false;
  // Coalesce several changes in one task into a single render.
  function csRender(anim) {
    csAnim = csAnim || anim; if (csQueued) return; csQueued = true;
    Promise.resolve().then(() => {
      csQueued = false; anim = csAnim; csAnim = false;
      const art = $('#cs-art'); art.innerHTML = C.render(spec(cs.format)); $('#cs-canvas').dataset.format = cs.format;
      if (anim) swap(art);
      $('#cs-set').innerHTML = Object.entries(C.FORMATS).map(([f, F]) => `<button type="button" data-f="${f}" aria-pressed="${f === cs.format}" aria-label="${esc(`${F.name} ${F.ratio}`)}"><span class="thumb">${C.render(spec(f))}</span>${esc(F.name)} · ${F.ratio}</button>`).join('');
    });
  }
  function csSyncScene() { const v = lastScene[cs.kind].split('-'); const s = STYLE[v[0]]; $('#cs-photo-note') && ($('#cs-photo-note').textContent = STR.camPhoto(`${s.name} · ${s.vars[+v[1] - 1]}`)); csRender(false); staticAds(); }
  function csLoadProduct(k) {
    cs.kind = k; Object.assign(cs, COPY[k]); cs.discountOn = !!COPY[k].discount; cs.discount = COPY[k].discount || 20; cs.color = null;
    csProducts(); csPalettes(); csFields(); csSyncScene();
  }
  const csPickProduct = (b) => { if (!b || b.dataset.v === cs.kind) return; csLoadProduct(b.dataset.v); toast(STR.copyReset(PRODUCTS[cs.kind].name)); };
  $('#cs-products').addEventListener('click', (e) => csPickProduct(e.target.closest('[role="radio"]')));
  radioKeys($('#cs-products'), csPickProduct);
  const csPickPal = (b) => { if (!b) return; cs.palette = b.dataset.v; cs.color = null; radio($('#cs-pal'), b); $('#cs-color').value = C.PALETTES.find((p) => p.id === cs.palette).strong; csRender(true); };
  $('#cs-pal').addEventListener('click', (e) => csPickPal(e.target.closest('[role="radio"]'))); radioKeys($('#cs-pal'), csPickPal);
  $('#cs-color').addEventListener('input', (e) => { cs.color = e.target.value; $$('#cs-pal [role="radio"]').forEach((b) => b.setAttribute('aria-checked', 'false')); csRender(false); });
  $$('#cs-form [data-k]').forEach((inp) => inp.addEventListener('input', () => {
    const k = inp.dataset.k; cs[k] = k === 'discount' ? Math.max(5, Math.min(90, Math.round(+inp.value || 0))) : inp.value; csRender(false);
  }));
  $('#cs-disc-on').addEventListener('change', (e) => { cs.discountOn = e.target.checked; $('#cs-disc').disabled = !cs.discountOn; csRender(true); });
  const dirs = $('#cs-dirs'); $$('[role="radio"]', dirs).forEach((b) => { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; });
  const csPickDir = (b) => { if (!b) return; cs.direction = b.dataset.v; radio(dirs, b); csRender(true); };
  dirs.addEventListener('click', (e) => csPickDir(e.target.closest('[role="radio"]'))); radioKeys(dirs, csPickDir);
  const fmts = $('#cs-fmts'); $$('[role="radio"]', fmts).forEach((b) => { b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1; });
  const csPickFmt = (b) => { if (!b) return; cs.format = b.dataset.v; radio(fmts, b); csRender(true); };
  fmts.addEventListener('click', (e) => csPickFmt(e.target.closest('[role="radio"]'))); radioKeys(fmts, csPickFmt);
  $('#cs-set').addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) csPickFmt($(`#cs-fmts [data-v="${b.dataset.f}"]`)); });
  // Click a word in the preview to edit it.
  $('#cs-art').addEventListener('click', (e) => {
    const f = e.target.closest('[data-field]'); if (!f) return; const sel = FIELD_INPUT[f.dataset.field]; if (!sel) return;
    const inp = $(sel); if (f.dataset.field === 'discount' && !cs.discountOn) return;
    inp.focus({ preventScroll: window.innerWidth >= 1000 }); inp.select && inp.select(); inp.classList.remove('flash'); void inp.offsetWidth; inp.classList.add('flash');
  });
  $('#cs-logo').addEventListener('change', async (e) => {
    try { cs.logo = await readLocal(e.target.files[0], 2 * 1024 * 1024); } catch (err) { if (err.message === 'size') toast(STR.logoBig); e.target.value = ''; return; }
    $('#cs-logo-x').hidden = false; toast(STR.logoOk); csRender(true);
  });
  $('#cs-logo-x').addEventListener('click', () => { cs.logo = null; $('#cs-logo').value = ''; $('#cs-logo-x').hidden = true; csRender(true); });
  const download = (blob, name) => { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); };
  const fileName = (ext) => `shopier-${cs.kind}-${cs.direction}-${cs.format}.${ext}`;
  async function exportArt(kind, btn) {
    const label = btn.innerHTML; btn.disabled = true; btn.lastChild.textContent = STR.exporting;
    try {
      const svg = C.render(spec(cs.format));
      if (kind === 'png') download(await C.toPng(svg, 1), fileName('png'));
      else download(new Blob([await C.standalone(svg)], { type: 'image/svg+xml' }), fileName('svg'));
      toast(kind === 'png' ? STR.png : STR.svg);
    } catch (err) { toast(STR.exportFail); }
    btn.innerHTML = label; btn.disabled = false;
  }
  $('#cs-png').addEventListener('click', (e) => exportArt('png', e.currentTarget));
  $('#cs-svg').addEventListener('click', (e) => exportArt('svg', e.currentTarget));
  // A small line under the product picker says which studio image the editorial layout uses.
  $('#cs-products').insertAdjacentHTML('afterend', '<p class="ctrl-note" id="cs-photo-note" aria-live="polite"></p>');

  /* ------------------------------------------------------------ 5 · virtual try-on */
  const to = { g: 'blazer', m: 'ada', upload: null };
  const toCmp = $('#to-cmp'); bindCompare(toCmp);
  const mName = (id) => MODELS.find((m) => m.id === id).name;
  function toCat() {
    $('#to-cat').innerHTML = GARMENTS.map((g) => `<button type="button" role="radio" aria-checked="${g.id === to.g}" tabindex="${g.id === to.g ? 0 : -1}" data-v="${g.id}"><span class="cat-img">${imgTag(`g:${g.id}`, STR.garAlt(g.name))}</span><span class="cat-t">${esc(g.name)}</span><span class="cat-p">${price(g.price)}</span></button>`).join('');
  }
  function toModels() {
    $('#to-models').innerHTML = MODELS.map((m) => `<button type="button" role="radio" aria-checked="${m.id === to.m}" tabindex="${m.id === to.m ? 0 : -1}" data-v="${m.id}"><span class="av">${imgTag(`t:${m.id}:before`)}</span>${esc(m.name)}</button>`).join('');
  }
  function toLooks() {
    $('#to-looks').innerHTML = GARMENTS.map((g) => `<button type="button" role="radio" aria-checked="${g.id === to.g}" tabindex="${g.id === to.g ? 0 : -1}" data-v="${g.id}" aria-label="${esc(`${mName(to.m)} · ${g.name}`)}">${imgTag(`t:${to.m}:${g.id}`)}</button>`).join('');
  }
  function toResult(doSweep) {
    const m = mName(to.m); const g = GAR[to.g].name;
    const b = $('#to-before'), a = $('#to-after');
    setPic(b, `t:${to.m}:before`); b.alt = STR.beforeAlt(m);
    setPic(a, `t:${to.m}:${to.g}`); a.alt = STR.afterAlt(m, g);
    $('#to-h').textContent = STR.toHead(m, g);
    if (doSweep) sweep(toCmp); else swap(a);
  }
  const toPickG = (b) => { if (!b || b.dataset.v === to.g) return; to.g = b.dataset.v; toCat(); toLooks(); toResult(true); };
  const toPickM = (b) => { if (!b || b.dataset.v === to.m) return; to.m = b.dataset.v; toModels(); toLooks(); toResult(true); };
  $('#to-cat').addEventListener('click', (e) => toPickG(e.target.closest('[role="radio"]')));
  $('#to-looks').addEventListener('click', (e) => toPickG(e.target.closest('[role="radio"]')));
  $('#to-models').addEventListener('click', (e) => toPickM(e.target.closest('[role="radio"]')));
  radioKeys($('#to-cat'), (b) => { toPickG(b); $(`#to-cat [data-v="${to.g}"]`).focus(); });
  radioKeys($('#to-looks'), (b) => { toPickG(b); $(`#to-looks [data-v="${to.g}"]`).focus(); });
  radioKeys($('#to-models'), (b) => { toPickM(b); $(`#to-models [data-v="${to.m}"]`).focus(); });
  $('#to-full').addEventListener('click', () => openLightbox($('#to-after').src, STR.toCap(mName(to.m), GAR[to.g].name)));
  function toClear(silent) { to.upload = null; $('#to-mine').hidden = true; $('#to-mine-img').removeAttribute('src'); $('#to-upload').hidden = false; $('#to-file').value = ''; if (!silent) toast(STR.uploadGone); }
  $('#to-file').addEventListener('change', async (e) => {
    try { to.upload = await readLocal(e.target.files[0]); } catch (err) { return; }
    $('#to-mine-img').src = to.upload; $('#to-mine').hidden = false; $('#to-upload').hidden = true; toast(STR.tryOk);
  });
  $('#to-clear').addEventListener('click', () => toClear(false));
  $('#to-reset').addEventListener('click', () => { to.g = 'blazer'; to.m = 'ada'; toClear(true); toCat(); toModels(); toLooks(); toResult(true); toast(STR.reset); });

  /* ------------------------------------------------------------ slide navigation */
  const stops = $$('[data-stop]'); const dots = $$('.dots a');
  const now = $('#slide-now'); const bar = $('#progress-bar'); let current = 0;
  const UI = { navy: 'navy', violet: 'violet' };
  const setCurrent = (i) => {
    current = i; const sl = stops[i];
    dots.forEach((d, n) => (n === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    if (now) now.textContent = String(i + 1).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${i / (stops.length - 1)})`;
    document.body.dataset.ui = UI[sl.dataset.theme] || 'light';
  };
  if ('IntersectionObserver' in window) {
    const mid = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) setCurrent(stops.indexOf(e.target)); }), { rootMargin: '-45% 0px -55% 0px' });
    const seen = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-seen'); seen.unobserve(e.target); } }), { threshold: 0.18 });
    stops.forEach((s) => { mid.observe(s); seen.observe(s); });
    new IntersectionObserver((en) => en.forEach((e) => { hero.visible = e.isIntersecting; heroTick(); }), { threshold: 0.3 }).observe($('#s1'));
  } else stops.forEach((s) => s.classList.add('is-seen'));
  const go = (i) => stops[Math.max(0, Math.min(stops.length - 1, i))].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // The section nearest the top of the viewport right now (robust during smooth scrolls).
  const nearest = () => { let best = current, bd = Infinity; stops.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().top); if (d < bd) { bd = d; best = i; } }); return best; };
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || $$('dialog[open]').length) return;
    if (e.target.closest && e.target.closest('input, textarea, select, button, [role="radiogroup"], [contenteditable="true"]')) return;
    if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); go(nearest() + 1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(nearest() - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(stops.length - 1); }
  });
  // The language switch opens the same section in the other language.
  $$('[data-lang-link]').forEach((a) => a.addEventListener('click', () => {
    const id = stops[nearest()].id;
    a.href = `${a.getAttribute('href').split('#')[0]}${id && id !== 's1' ? `#${id}` : ''}`;
  }));

  /* ------------------------------------------------------------ start */
  psAll(false); csProducts(); csPalettes(); csFields(); csSyncScene(); toCat(); toModels(); toLooks(); toResult(false);
  showLook(0); heroTick(); setCurrent(0);
  C.ready().then(() => { staticAds(); csRender(false); });
})();
