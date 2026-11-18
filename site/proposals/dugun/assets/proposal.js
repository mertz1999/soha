/* Düğün.com proposal · interactions
   Try-on, venue styles, music suggestions, budget estimate, invitation studio, the journey summary and
   slide navigation. Demo mode throughout: no network calls, no uploads, no live model.
   The page language comes from <html lang> (English default page, Turkish at /tr/). */
(function () {
  'use strict';
  const A = window.DArt, I = window.DInvite, D = window.DData;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('motion');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const L = D.L;

  /* ------------------------------------------------------------ strings set by script */
  const STR = L({
    venue: { original: 'Orijinal', classic: 'Klasik Lüks', minimal: 'Modern Minimal', boho: 'Bohem Bahçe' },
    model: { a: 'Model A', b: 'Model B' },
    catAlt: (o) => `${o.name}: ${o.type}, katalog görseli (örnek görsel)`,
    beforeAlt: (m) => `${m}, günlük kıyafetle (örnek görsel)`,
    afterAlt: (m, o) => `${m}, ${o} ile örnek sonuç (önceden üretilmiş görsel)`,
    noOutfit: (m) => `${m} · kıyafet seçilmedi`,
    switched: (k, m) => `${k === 'damatlik' ? 'Damatlık' : 'Gelinlik'} için ${m} seçildi`,
    zoomResult: (o, m) => `Örnek sonuç · ${o}, ${m} (önceden üretilmiş görsel, canlı üretim değildir)`,
    zoomModel: (m) => `${m} · kurgusal demo model (örnek görsel)`,
    reset: 'Seçim sıfırlandı', uploadOk: 'Fotoğraf yalnızca bu cihazda gösteriliyor; işlenmedi', uploadGone: 'Fotoğraf kaldırıldı',
    storeBadge: 'Demo mağaza',
    storeList: ['Gerçek sistemde bu buton, kıyafetin bulunduğu Düğün.com mağaza sayfasını açar.', 'Çift, denediği görselle birlikte prova randevusu veya fiyat teklifi isteyebilir.', 'Mağaza, deneme yapılan modelleri ve ilgi verisini görür.'],
    storeNote: (n) => `${n}. Gerçek bir mağaza, fiyat veya müsaitlik bilgisi gösterilmez.`,
    storeLink: (c) => `Düğün.com'da ${c} firmalarına göz atın`, cat: { gelinlik: 'Gelinlikçi', damatlik: 'Damatlık' },
    venueAlt: (v) => `${v} konseptiyle aynı mekân (önceden üretilmiş örnek görsel)`, originalAlt: 'Orijinal mekân: boş tarihi salon (örnek görsel)',
    chosen: (v) => `Seçildi: ${v}`, choose: 'Bu konsepti seç', added: (v) => `${v} planınıza eklendi`, removed: 'Konsept seçimi kaldırıldı',
    fullCap: (v) => `Örnek görsel · ${v} (önceden üretildi; mimari aynı, dekor değişir)`,
    tags: { classic: ['Beyaz güller', 'Altın detay', 'Yuvarlak masa', 'Mum ışığı'], minimal: ['Nötr tonlar', 'Uzun masa', 'Pampas', 'Gün ışığı'], boho: ['Kır çiçekleri', 'Ahşap masa', 'Zincir ışık', 'Kilim'] },
    vendorsBadge: 'Konsept eşleştirme', vendorsTitle: (v) => `${v} için firmalar`,
    vendorsText: "Gerçek sistemde bu etiketler, Düğün.com'daki firma profilleri ve galerileriyle eşleştirilir. Çift, konsepti gerçekleştirebilecek firmalardan teklif ister.",
    vendorCats: ['Organizasyon', 'Çiçekçi', 'Işık, Ses ve Düzenleme'],
    vendorsNote: "Demo: firma eşleştirmesi, fiyat teklifi veya müsaitlik gösterilmez. Bağlantılar Düğün.com'un mevcut kategori sayfalarına gider.",
    venueUpload: 'Fotoğraf yüklenmedi; bu demo örnek mekânla çalışır',
    tipOk: (d) => `Tahmin, bütçenizin içinde. Yaklaşık ${d} pay kalıyor; bunu fotoğraf veya dekora ayırabilirsiniz.`,
    tipOver: (o) => `Tahmin, bütçenizi ${o} aşıyor.`, tipCut: (n) => `Misafir sayısını ${n} kişi azaltmak farkı kapatır.`,
    tipAlt: (or, v, t) => `${or ? 'Ya da ' : ''}${v} seçeneği tahmini ${t} yapar.`,
    estimated: 'TAHMİNİ TOPLAM', guestsEst: (n) => `${n} misafir · tahmini`,
    ivAria: (d, l) => `${d}, ${l} düzeni: büyük önizleme ve düzenleme`, ivOpen: 'Büyüt · Düzenle',
    ivReady: (f, dp) => `3 tasarım hazır · ${f.bride} & ${f.groom}, ${dp.d} ${dp.month} ${dp.y}`,
    ivOf: (i) => `Tasarım ${i} / 3`, bride: 'Gelin', groom: 'Damat', venueDefault: 'Mekân', slug: 'davetiye',
    svgWait: 'SVG hazırlanıyor…', svgOk: 'SVG indirildi', pngWait: 'PNG hazırlanıyor…', pngOk: 'PNG indirildi', pngFail: 'PNG oluşturulamadı; SVG indirmeyi deneyin',
    example: (o) => `Örnek: ${o}`, demoVenue: 'Defne Köşkü, İstanbul',
    handBadge: 'Firma aktarımı', handTitle: 'Davetiyeyi bir firmaya gönderin',
    handList: ["Çift, tasarımı Düğün.com'daki davetiye firmalarına baskı veya dijital davetiye siparişi olarak gönderir.", 'Firma, düzenlenebilir dosyayı hazır alır; çift teklifleri karşılaştırır.', 'Davetiye firmaları devre dışı kalmaz: bu akışın son adımıdır.'],
    handLink: "Düğün.com'da davetiye firmalarına göz atın", handNote: 'Demo: hiçbir sipariş veya dosya gönderilmez.',
  }, {
    venue: { original: 'Original', classic: 'Classic Luxury', minimal: 'Modern Minimal', boho: 'Bohemian Garden' },
    model: { a: 'Model A', b: 'Model B' },
    catAlt: (o) => `${o.name}: ${o.type}, catalogue image (example image)`,
    beforeAlt: (m) => `${m} in everyday clothes (example image)`,
    afterAlt: (m, o) => `${m} wearing ${o}, example result (generated in advance)`,
    noOutfit: (m) => `${m} · no outfit selected`,
    switched: (k, m) => `${m} selected for the ${k === 'damatlik' ? 'suit' : 'gown'}`,
    zoomResult: (o, m) => `Example result · ${o}, ${m} (generated in advance, not live)`,
    zoomModel: (m) => `${m} · fictional demo model (example image)`,
    reset: 'Selection reset', uploadOk: 'Your photo is shown on this device only; it was not processed', uploadGone: 'Photo removed',
    storeBadge: 'Demo boutique',
    storeList: ['In the real product this button opens the Düğün.com boutique page that carries the outfit.', 'The couple can request a fitting or a quote, with the try-on image attached.', 'The boutique sees which items were tried on and how much interest they get.'],
    storeNote: (n) => `${n}. No real boutique, prices or availability are shown.`,
    storeLink: (c) => `Browse ${c} on Düğün.com`, cat: { gelinlik: 'bridal shops', damatlik: 'groomswear shops' },
    venueAlt: (v) => `The same venue in the ${v} concept (example image, generated in advance)`, originalAlt: 'Original venue: an empty historic hall (example image)',
    chosen: (v) => `Chosen: ${v}`, choose: 'Choose this concept', added: (v) => `${v} added to your plan`, removed: 'Concept removed',
    fullCap: (v) => `Example image · ${v} (generated in advance; same architecture, new decor)`,
    tags: { classic: ['White roses', 'Gold details', 'Round tables', 'Candlelight'], minimal: ['Neutral tones', 'Long tables', 'Pampas', 'Daylight'], boho: ['Wildflowers', 'Wooden tables', 'String lights', 'Kilim rug'] },
    vendorsBadge: 'Concept matching', vendorsTitle: (v) => `Vendors for ${v}`,
    vendorsText: 'In the real product these tags are matched to vendor profiles and galleries on Düğün.com. The couple then asks the vendors who can create the concept for a quote.',
    vendorCats: ['Wedding planners', 'Florists', 'Lighting, sound & staging'],
    vendorsNote: "Demo: no vendor matching, quotes or availability are shown. The links go to Düğün.com's existing category pages.",
    venueUpload: 'Photo not uploaded; this demo works with the sample venue',
    tipOk: (d) => `The estimate is within your budget, with about ${d} to spare for photography or decor.`,
    tipOver: (o) => `The estimate is ${o} over your budget.`, tipCut: (n) => `Inviting ${n} fewer guests closes the gap.`,
    tipAlt: (or, v, t) => `${or ? 'Or a' : 'A'} ${v.toLowerCase()} brings it to about ${t}.`,
    estimated: 'ESTIMATED TOTAL', guestsEst: (n) => `${n} guests · estimate`,
    ivAria: (d, l) => `${d}, ${l} layout: open large preview and edit`, ivOpen: 'Enlarge · Edit',
    ivReady: (f, dp) => `3 designs ready · ${f.bride} & ${f.groom}, ${dp.d} ${dp.month} ${dp.y}`,
    ivOf: (i) => `Design ${i} / 3`, bride: 'Bride', groom: 'Groom', venueDefault: 'Venue', slug: 'invitation',
    svgWait: 'Preparing SVG…', svgOk: 'SVG downloaded', pngWait: 'Preparing PNG…', pngOk: 'PNG downloaded', pngFail: "Couldn't create the PNG; try the SVG download",
    example: (o) => `Example: ${o}`, demoVenue: 'Defne Köşkü, İstanbul',
    handBadge: 'Vendor handoff', handTitle: 'Send the design to a vendor',
    handList: ["The couple sends the design to Düğün.com's invitation vendors as a print or digital order.", 'The vendor receives a ready, editable file; the couple compares quotes.', 'Invitation companies are not bypassed: they are the last step of the flow.'],
    handLink: 'Browse invitation vendors on Düğün.com', handNote: 'Demo: no order or file is sent.',
  });
  const VENUE_NAME = STR.venue; const MODEL_NAME = STR.model;

  /* ------------------------------------------------------------ images
     Photos generated in advance (assets/photos/) are used where they exist. The code-drawn illustrations
     stay as the fallback: any photo that fails to load switches to its illustration. */
  const PHOTO = new URL('photos/', document.currentScript.src).href;
  // The empty hall that matches the three concept photos. Set to a file name once it exists in photos/.
  const VENUE_EMPTY_PHOTO = null;
  const VENUE_PHOTOS = { classic: 'venue-classic.webp', minimal: 'venue-minimal.webp', boho: 'venue-boho.webp' };
  if (VENUE_EMPTY_PHOTO) VENUE_PHOTOS.original = VENUE_EMPTY_PHOTO;
  const personImg = (model, outfit, place) => {
    if (place === 'boutique') return { src: `${PHOTO}cat-${outfit}.webp`, fb: `p:${model}:${outfit}:boutique` };
    const file = outfit === 'before' ? `model-${model}-before.webp` : `tryon-${model}-${outfit}.webp`;
    return { src: PHOTO + file, fb: `p:${model}:${outfit}:studio` };
  };
  const venueImg = (style) => ({ src: VENUE_PHOTOS[style] ? PHOTO + VENUE_PHOTOS[style] : A.venueUrl(style), fb: `v:${style}` });
  const setImg = (img, pic) => { img.dataset.fb = pic.fb; delete img.dataset.fell; img.src = pic.src; };
  const imgAttrs = (pic) => `src="${pic.src}" data-fb="${pic.fb}"`;
  // fallbacks are drawn only when a photo actually fails, so the illustrations cost nothing otherwise
  const drawFallback = (fb) => { const [k, a, b, c] = fb.split(':'); return k === 'v' ? A.venueUrl(a) : A.personUrl(a, b, c); };
  document.addEventListener('error', (e) => { const t = e.target; if (t.tagName === 'IMG' && t.dataset.fb && !t.dataset.fell) { t.dataset.fell = '1'; t.src = drawFallback(t.dataset.fb); } }, true);
  const artPic = (spec) => { const [k, a, b, c] = spec.split(':'); return k === 'venue' ? venueImg(a) : personImg(a, b, c || 'studio'); };
  $$('[data-art]').forEach((img) => { img.decoding = 'async'; setImg(img, artPic(img.dataset.art)); });

  /* ------------------------------------------------------------ shared bits */
  const toastEl = $('#toast'); let toastT;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2800); };
  const swap = (el) => { if (reduce || !el) return; el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); };
  const fill = (r) => r.style.setProperty('--fill', `${((r.value - r.min) / (r.max - r.min)) * 100}%`);
  const radio = (group, el) => $$('[role="radio"]', group).forEach((b) => b.setAttribute('aria-checked', String(b === el)));
  const OUT = Object.fromEntries(D.OUTFITS.map((o) => [o.id, o]));

  /* Dialogs: close buttons, backdrop clicks. */
  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });
  const lb = $('#lb');
  const openLightbox = (src, cap) => { $('#lb-img').src = src; $('#lb-img').alt = cap; $('#lb-cap').textContent = cap; lb.showModal(); };
  const drawer = $('#drawer');
  const openDrawer = (html) => { $('#dr-body').innerHTML = html; drawer.showModal(); };

  /* Before/after comparison: --pos is where the split sits; the "after" layer shows to its right. */
  function setPos(cmp, v, animate) {
    cmp.classList.toggle('dragging', !animate);
    cmp.style.setProperty('--pos', `${v}%`); cmp.classList.toggle('at-start', v <= 0.5);
    const r = $('.cmp-range', cmp); if (r) r.value = v;
  }
  function bindCompare(cmp) {
    const r = $('.cmp-range', cmp);
    r.addEventListener('input', () => setPos(cmp, +r.value, false));
    r.addEventListener('change', () => cmp.classList.remove('dragging'));
  }

  /* ------------------------------------------------------------ 3 · try-on */
  const st = { model: 'a', outfit: null, kind: 'gelinlik', upload: null };
  const toCmp = $('#to-cmp'); bindCompare(toCmp);
  const fav = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16.5s-6-3.6-6-8.1A3.3 3.3 0 0 1 10 5.8a3.3 3.3 0 0 1 6 2.6c0 4.5-6 8.1-6 8.1Z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  function renderItems() {
    $$('.to-cat .seg [role="tab"]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.kind === st.kind)));
    $('#to-items').innerHTML = D.OUTFITS.filter((o) => o.kind === st.kind).map((o) => `
      <button type="button" class="to-item" role="radio" aria-checked="${st.outfit === o.id}" data-outfit="${o.id}">
        <span class="ph"><img ${imgAttrs(personImg(o.vendor, o.id, 'boutique'))} alt=""${esc(STR.catAlt(o))}"><span class="fav">${fav}</span></span>
        <span class="meta"><b>${D.BOUTIQUE.name}</b><span>${esc(o.name)} · ${esc(o.type)}</span><i>${esc(o.tag)}</i></span>
      </button>`).join('');
  }
  function renderResult(sweep) {
    const before = personImg(st.model, 'before'); const after = st.outfit ? personImg(st.model, st.outfit) : before;
    setImg($('#to-before'), before); setImg($('#to-after'), after);
    $('#to-before').alt = STR.beforeAlt(MODEL_NAME[st.model]);
    $('#to-after').alt = st.outfit ? STR.afterAlt(MODEL_NAME[st.model], OUT[st.outfit].name) : '';
    toCmp.classList.toggle('is-empty', !st.outfit);
    $('#to-pick').innerHTML = st.outfit ? `<b>${esc(OUT[st.outfit].name)}</b> · ${esc(OUT[st.outfit].type)} · ${MODEL_NAME[st.model]}` : STR.noOutfit(MODEL_NAME[st.model]);
    if (!st.outfit) { setPos(toCmp, 50, false); return; }
    if (sweep && !reduce) { setPos(toCmp, 100, false); requestAnimationFrame(() => requestAnimationFrame(() => setPos(toCmp, 50, true))); }
    else setPos(toCmp, 50, false);
    updateJourney();
  }
  function selectModel(m, keepKind) {
    st.model = m; radio($('.to-models'), $(`.to-model[data-model="${m}"]`));
    if (st.outfit && OUT[st.outfit].model !== m) st.outfit = null;
    if (!keepKind) st.kind = m === 'a' ? 'gelinlik' : 'damatlik';
    renderItems(); renderResult(false); updateJourney();
  }
  $$('.to-model').forEach((b) => b.addEventListener('click', () => selectModel(b.dataset.model)));
  $$('.to-cat .seg [role="tab"]').forEach((t) => t.addEventListener('click', () => { st.kind = t.dataset.kind; renderItems(); }));
  $('#to-items').addEventListener('click', (e) => {
    const b = e.target.closest('.to-item'); if (!b) return;
    const o = OUT[b.dataset.outfit];
    if (o.model !== st.model) { st.model = o.model; radio($('.to-models'), $(`.to-model[data-model="${o.model}"]`)); toast(STR.switched(o.kind, MODEL_NAME[o.model])); }
    st.outfit = o.id; renderItems(); renderResult(true);
    const nb = $(`.to-item[data-outfit="${o.id}"]`); if (nb) nb.focus({ preventScroll: true });
    // on narrow screens the result sits below the catalogue: bring it into view
    if (window.innerWidth < 1000) $('#to-r-h').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
  $('#to-zoom').addEventListener('click', () => {
    const src = (st.outfit ? personImg(st.model, st.outfit) : personImg(st.model, 'before')).src;
    openLightbox(src, st.outfit ? STR.zoomResult(OUT[st.outfit].name, MODEL_NAME[st.model]) : STR.zoomModel(MODEL_NAME[st.model]));
  });
  function clearUpload() { if (st.upload) URL.revokeObjectURL(st.upload); st.upload = null; $('#to-mine').hidden = true; $('#to-upload').hidden = false; $('#to-file').value = ''; }
  $('#to-reset').addEventListener('click', () => { clearUpload(); st.outfit = null; selectModel('a'); toast(STR.reset); });
  $('#to-file').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0]; if (!f || !/^image\//.test(f.type)) return;
    clearUpload(); st.upload = URL.createObjectURL(f);
    $('#to-mine-img').src = st.upload; $('#to-mine').hidden = false; $('#to-upload').hidden = true;
    toast(STR.uploadOk);
  });
  $('#to-mine-x').addEventListener('click', () => { clearUpload(); toast(STR.uploadGone); });
  $('#to-store').addEventListener('click', () => {
    const o = OUT[st.outfit || (st.kind === 'damatlik' ? 'kenan' : 'aurora')];
    const slug = o.kind === 'damatlik' ? 'damatlik' : 'gelinlik';
    openDrawer(`<div class="dr">
      <div class="dr-hero"><img ${imgAttrs(personImg(o.vendor, o.id, 'boutique'))} alt=""><span class="demo-badge">${STR.storeBadge}</span></div>
      <h3 id="dr-title">${D.BOUTIQUE.name}</h3>
      <p class="loc"><svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="8" r="2" fill="currentColor"/></svg>${D.BOUTIQUE.city}</p>
      <p><b>${esc(o.name)}</b> · ${esc(o.type)}</p>
      <ul>${STR.storeList.map((t) => `<li>${t}</li>`).join('')}</ul>
      <p class="note">${STR.storeNote(D.BOUTIQUE.note)}</p>
      <div class="dr-match"><a href="https://dugun.com/${slug}/istanbul" target="_blank" rel="noopener">${STR.storeLink(STR.cat[slug])} <span>dugun.com ↗</span></a></div>
    </div>`);
  });

  /* ------------------------------------------------------------ 4 · venue */
  const vn = { style: 'classic', chosen: null };
  const vnCmp = $('#vn-cmp'); bindCompare(vnCmp);
  const vnBase = (style) => (VENUE_PHOTOS.original ? 'original' : style === 'minimal' ? 'classic' : 'minimal');
  function setVenue(style, user) {
    vn.style = style; radio($('#vn-styles'), $(`.vn-style[data-style="${style}"]`));
    const base = vnBase(style); const b = $('#vn-before');
    setImg(b, venueImg(base)); b.alt = base === 'original' ? STR.originalAlt : STR.venueAlt(VENUE_NAME[base]);
    $('#vn-cmp .cmp-lab--a').textContent = VENUE_NAME[base];
    const img = $('#vn-after'); setImg(img, venueImg(style)); img.alt = STR.venueAlt(VENUE_NAME[style]);
    $('#vn-lab').textContent = VENUE_NAME[style];
    if (user) swap(img);
    const on = vn.chosen === style; const btn = $('#vn-choose');
    btn.setAttribute('aria-pressed', String(on)); $('span', btn).textContent = on ? STR.chosen(VENUE_NAME[style]) : STR.choose;
  }
  $$('.vn-style').forEach((b) => b.addEventListener('click', () => setVenue(b.dataset.style, true)));
  setPos(vnCmp, 0, false);
  $('#vn-compare').addEventListener('click', (e) => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(on)); setPos(vnCmp, on ? 50 : 0, true);
  });
  $('#vn-full').addEventListener('click', () => openLightbox(venueImg(vn.style).src, STR.fullCap(VENUE_NAME[vn.style])));
  $('#vn-choose').addEventListener('click', () => {
    vn.chosen = vn.chosen === vn.style ? null : vn.style; setVenue(vn.style);
    toast(vn.chosen ? STR.added(VENUE_NAME[vn.style]) : STR.removed); updateJourney();
  });
  $('#vn-vendors').addEventListener('click', () => {
    const links = [['dugun-organizasyon', STR.vendorCats[0]], ['cicekciler', STR.vendorCats[1]], ['isik-ses-ve-duzenleme', STR.vendorCats[2]]];
    openDrawer(`<div class="dr">
      <div class="dr-hero"><img ${imgAttrs(venueImg(vn.style))} alt=""><span class="demo-badge">${STR.vendorsBadge}</span></div>
      <h3 id="dr-title">${STR.vendorsTitle(VENUE_NAME[vn.style])}</h3>
      <div class="dr-tags">${STR.tags[vn.style].map((t) => `<i>${t}</i>`).join('')}</div>
      <p>${STR.vendorsText}</p>
      <div class="dr-match">${links.map(([p, n]) => `<a href="https://dugun.com/${p}/istanbul" target="_blank" rel="noopener">${n} <span>dugun.com ↗</span></a>`).join('')}</div>
      <p class="note">${STR.vendorsNote}</p>
    </div>`);
  });
  $('#vn-file').addEventListener('change', (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; $('#vn-upload-note').hidden = false; e.target.value = ''; toast(STR.venueUpload); });

  /* ------------------------------------------------------------ 5 · music */
  const mu = { moment: 'giris', styles: ['trpop', 'klasik'], mood: 'romantik', trad: 'karma' };
  const hue = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; };
  function renderSongs(anim) {
    const recs = D.recommend(mu);
    $('#mu-list').innerHTML = recs.map((r, i) => {
      const h = hue(r.title); const c1 = `hsl(${(330 + h % 40) % 360} 62% 58%)`; const c2 = `hsl(${(h % 60) + 300} 35% 30%)`;
      return `<li class="mu-song"><span class="mu-cover" style="--c1:${c1};--c2:${c2}" aria-hidden="true">${i + 1}</span><div><h4>${esc(r.title)} <span>· ${esc(r.artist)}</span></h4><p>${esc(r.reason)}</p><div class="mu-tags">${r.tags.map((t) => `<i>${esc(t)}</i>`).join('')}</div></div></li>`;
    }).join('');
    if (anim) swap($('#mu-list'));
    updateJourney();
  }
  $$('#mu-moments [role="tab"]').forEach((t) => t.addEventListener('click', () => { mu.moment = t.dataset.moment; $$('#mu-moments [role="tab"]').forEach((x) => x.setAttribute('aria-selected', String(x === t))); renderSongs(true); }));
  $$('#mu-styles .chip').forEach((c) => c.addEventListener('click', () => {
    const on = c.getAttribute('aria-pressed') !== 'true'; c.setAttribute('aria-pressed', String(on));
    mu.styles = $$('#mu-styles .chip[aria-pressed="true"]').map((x) => x.dataset.v); renderSongs(true);
  }));
  [['#mu-mood', 'mood'], ['#mu-trad', 'trad']].forEach(([sel, key]) => $$(`${sel} .chip`).forEach((c) => c.addEventListener('click', () => { radio($(sel), c); mu[key] = c.dataset.v; renderSongs(true); })));
  $('#mu-moments').addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; const tabs = $$('#mu-moments [role="tab"]'); const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click(); e.preventDefault();
  });

  /* ------------------------------------------------------------ 5 · budget */
  const bu = { city: 'istanbul', guests: 250, style: 'klasik', venue: 'salon', budget: 700000 };
  $('#bu-city').innerHTML = D.CITIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  $('#bu-style').innerHTML = D.STYLES.map((s) => `<button type="button" role="radio" aria-checked="${s.id === bu.style}" data-v="${s.id}">${s.name}</button>`).join('');
  $('#bu-venue').innerHTML = D.VENUES.map((v) => `<button type="button" class="chip" role="radio" aria-checked="${v.id === bu.venue}" data-v="${v.id}">${v.name}</button>`).join('');
  function donut(rows, total, size, stroke, center) {
    const r = (size - stroke) / 2, C = 2 * Math.PI * r; let off = 0; let s = '';
    rows.forEach((row) => { const len = (row.value / total) * C; const gap = Math.min(3, len * 0.3); s += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${row.color}" stroke-width="${stroke}" stroke-dasharray="${Math.max(0, len - gap).toFixed(2)} ${(C - Math.max(0, len - gap)).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" style="transition:stroke-dasharray .5s,stroke-dashoffset .5s"/>`; off += len; });
    return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><g transform="rotate(-90 ${size / 2} ${size / 2})">${s}</g>${center || ''}</svg>`;
  }
  let lastEst = null;
  function renderBudget() {
    const e = D.estimate(bu); lastEst = e;
    $('#bu-guests-v').textContent = bu.guests; $('#bu-budget-v').textContent = D.tl(bu.budget);
    fill($('#bu-guests')); fill($('#bu-budget'));
    $('#bu-donut').innerHTML = donut(e.rows, e.total, 220, 22);
    $('#bu-total').textContent = D.tl(e.total); $('#bu-range').textContent = `${D.tl(e.low)} – ${D.tl(e.high)}`;
    $('#bu-rows').innerHTML = e.rows.map((r) => `<li><i style="background:${r.color}"></i><span>${r.name}</span><b>${D.tl(r.value)}</b><span class="bar"><span style="width:${((r.value / e.total) * 100).toFixed(1)}%;background:${r.color}"></span></span></li>`).join('');
    const tip = $('#bu-tip'); const diff = bu.budget - e.total;
    if (diff >= 0) { tip.className = 'bu-tip ok'; tip.textContent = STR.tipOk(D.tl(diff)); }
    else {
      tip.className = 'bu-tip'; const over = -diff;
      const cut = Math.min(bu.guests - 50, Math.ceil(over / e.perGuest / 10) * 10);
      const canCut = cut > 0 && cut < bu.guests - 50;
      const alts = D.VENUES.filter((v) => v.id !== bu.venue).map((v) => ({ v, t: D.estimate({ ...bu, venue: v.id }).total })).filter((x) => x.t <= bu.budget).sort((a, b) => b.t - a.t);
      const parts = [STR.tipOver(D.tl(over))];
      if (canCut) parts.push(STR.tipCut(cut));
      if (alts.length) parts.push(STR.tipAlt(canCut, alts[0].v.name, D.tl(alts[0].t)));
      tip.textContent = parts.join(' ');
    }
    $$('[data-hero-budget]').forEach((el) => { el.textContent = D.tl(e.total); });
    $$('[data-mini-donut]').forEach((el) => { el.innerHTML = donut(e.rows, e.total, 200, 20, `<text x="100" y="96" text-anchor="middle" font-family="Cormorant Garamond Variable, serif" font-size="27" font-weight="650" fill="#1F1719">${D.tl(e.total)}</text><text x="100" y="118" text-anchor="middle" font-size="10.5" letter-spacing="1.5" fill="#857B7C" font-weight="700">${STR.estimated}</text>`); });
    updateJourney();
  }
  $('#bu-city').value = bu.city;
  $('#bu-city').addEventListener('change', (e) => { bu.city = e.target.value; renderBudget(); });
  $('#bu-guests').addEventListener('input', (e) => { bu.guests = +e.target.value; renderBudget(); });
  $('#bu-budget').addEventListener('input', (e) => { bu.budget = +e.target.value; renderBudget(); });
  $$('#bu-style button').forEach((b) => b.addEventListener('click', () => { radio($('#bu-style'), b); bu.style = b.dataset.v; renderBudget(); }));
  $$('#bu-venue .chip').forEach((b) => b.addEventListener('click', () => { radio($('#bu-venue'), b); bu.venue = b.dataset.v; renderBudget(); }));
  $$('[data-go="budget"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); $('#budget').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }));

  /* ------------------------------------------------------------ 6 · invitations */
  const IV = I.DESIGNS;
  const PALETTE_FOR = { auto: { timeless: 0, modern: 0, botanical: 0 }, gold: { timeless: 0, modern: 1, botanical: 1 }, rose: { timeless: 1, modern: 0, botanical: 0 }, green: { timeless: 0, modern: 2, botanical: 0 }, night: { timeless: 2, modern: 2, botanical: 2 } };
  const iv = { style: 'mix', color: 'auto', specs: [], chosen: 0, view: null };
  const form = () => ({ bride: $('#iv-bride').value.trim() || STR.bride, groom: $('#iv-groom').value.trim() || STR.groom, date: $('#iv-date').value || '2027-06-12', time: $('#iv-time').value, venue: $('#iv-venue').value.trim() || STR.venueDefault });
  function makeSpecs() {
    const pal = PALETTE_FOR[iv.color];
    const list = iv.style === 'mix' ? ['timeless', 'modern', 'botanical'].map((d) => ({ design: d, layout: 0 })) : [0, 1, 2].map((l) => ({ design: iv.style, layout: l }));
    return list.map((s) => ({ ...s, palette: pal[s.design], type: 0, format: 'print' }));
  }
  function renderGallery(anim) {
    const f = form();
    $('#iv-gallery').innerHTML = iv.specs.map((s, i) => `
      <button type="button" class="iv-card${anim ? ' is-new' : ''}" role="listitem" data-i="${i}" aria-label="${esc(STR.ivAria(IV[s.design].name, IV[s.design].layouts[s.layout]))}">
        <span class="iv-open" aria-hidden="true">${STR.ivOpen}</span>
        <span class="iv-paper">${I.render({ ...s, ...f })}</span>
        <span class="iv-cap"><b>${IV[s.design].name}</b><span>${IV[s.design].layouts[s.layout]} · ${IV[s.design].palettes[s.palette].name}</span></span>
      </button>`).join('');
    updateJourney();
  }
  function generate(anim) {
    iv.specs = makeSpecs(); iv.chosen = 0; renderGallery(anim);
    const f = form(); $('#iv-status').textContent = STR.ivReady(f, I.dateParts(f.date, f.time));
  }
  $('#iv-form').addEventListener('submit', (e) => { e.preventDefault(); generate(true); });
  $$('#iv-style .chip').forEach((c) => c.addEventListener('click', () => { radio($('#iv-style'), c); iv.style = c.dataset.v; generate(true); }));
  $$('#iv-color button').forEach((c) => c.addEventListener('click', () => { radio($('#iv-color'), c); iv.color = c.dataset.v; generate(true); }));
  let ivT;
  ['#iv-bride', '#iv-groom', '#iv-date', '#iv-time', '#iv-venue'].forEach((sel) => $(sel).addEventListener('input', () => { clearTimeout(ivT); ivT = setTimeout(() => { renderGallery(false); if (iv.view) renderViewer(); }, 220); }));
  const view = $('#iv-view');
  function renderViewer() {
    const s = iv.view; const d = IV[s.design];
    $('#ivv-k').textContent = STR.ivOf(iv.chosen + 1);
    $('#ivv-title').textContent = d.name;
    $('#ivv-layout').innerHTML = d.layouts.map((n, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === s.layout}" data-v="${i}">${n}</button>`).join('');
    $('#ivv-palette').innerHTML = d.palettes.map((p, i) => `<button type="button" role="radio" aria-checked="${i === s.palette}" data-v="${i}" aria-label="${p.name}"><i style="background:linear-gradient(135deg,${p.sw[0]} 50%,${p.sw[1]} 50%)"></i></button>`).join('');
    $('#ivv-type').innerHTML = d.types.map((t, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === s.type}" data-v="${i}">${t.name}</button>`).join('');
    $$('#ivv-format button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.v === s.format)));
    const card = $('#ivv-card'); card.classList.toggle('is-story', s.format === 'story');
    card.innerHTML = I.render({ ...s, ...form() });
  }
  function openViewer(i) { iv.chosen = i; iv.view = { ...iv.specs[i] }; renderViewer(); view.showModal(); updateJourney(); }
  $('#iv-gallery').addEventListener('click', (e) => { const c = e.target.closest('.iv-card'); if (c) openViewer(+c.dataset.i); });
  const refine = (key, v) => { iv.view[key] = v; if (key !== 'format') { iv.specs[iv.chosen][key] = v; renderGallery(false); } renderViewer(); };
  $('#ivv-layout').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) refine('layout', +b.dataset.v); });
  $('#ivv-palette').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) refine('palette', +b.dataset.v); });
  $('#ivv-type').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) refine('type', +b.dataset.v); });
  $('#ivv-format').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) refine('format', b.dataset.v); });
  view.addEventListener('close', () => { iv.view = null; });
  $('#ivv-vendor').addEventListener('click', () => {
    openDrawer(`<div class="dr">
      <div class="dr-hero dr-hero--inv">${I.render({ ...iv.view, format: 'print', ...form() })}<span class="demo-badge">${STR.handBadge}</span></div>
      <h3 id="dr-title">${STR.handTitle}</h3>
      <ul>${STR.handList.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="dr-match"><a href="https://dugun.com/dugun-davetiyesi/istanbul" target="_blank" rel="noopener">${STR.handLink} <span>dugun.com ↗</span></a></div>
      <p class="note">${STR.handNote}</p>
    </div>`);
  });
  const slug = () => { const f = form(); return `${STR.slug}-${f.bride}-${f.groom}`.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); };
  $('#ivv-svg').addEventListener('click', async () => { toast(STR.svgWait); const svg = await I.embedFonts(I.render({ ...iv.view, ...form() })); download(new Blob([svg], { type: 'image/svg+xml' }), `${slug()}-${iv.view.format}.svg`); toast(STR.svgOk); });
  $('#ivv-png').addEventListener('click', async () => { toast(STR.pngWait); try { const png = await I.toPng(I.render({ ...iv.view, ...form() })); download(png, `${slug()}-${iv.view.format}.png`); toast(STR.pngOk); } catch (err) { toast(STR.pngFail); } });

  /* ------------------------------------------------------------ 7 · journey (reflects every choice above) */
  function updateJourney() {
    const set = (k, html) => { const el = $(`[data-jr="${k}"]`); if (el) el.innerHTML = html; };
    const val = (k, t) => { const el = $(`[data-jr-v="${k}"]`); if (el) el.textContent = t; };
    const o = st.outfit ? OUT[st.outfit] : OUT.aurora; const m = st.outfit ? st.model : 'a';
    set('look', `<img ${imgAttrs(personImg(m, o.id))} alt="" style="object-position:50% 12%">`);
    val('look', st.outfit ? `${o.name} · ${MODEL_NAME[m]}` : STR.example(o.name));
    const vs = vn.chosen || vn.style; set('venue', `<img ${imgAttrs(venueImg(vs))} alt="">`); val('venue', VENUE_NAME[vs]);
    const song = D.recommend(mu)[0]; const est = lastEst || D.estimate(bu);
    set('mb', `<div class="jr-mb"><div class="row"><span class="ic"><svg viewBox="0 0 20 20"><path d="M7 15V5l9-2v10" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="5" cy="15" r="2.2" fill="currentColor"/><circle cx="14" cy="13" r="2.2" fill="currentColor"/></svg></span><div><b>${esc(song ? song.title : '')}</b><span>${D.MOMENT[mu.moment].label}</span></div></div><div class="row"><span class="ic ic--b"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 3v7l5 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span><div><b>${D.tl(est.total)}</b><span>${STR.guestsEst(bu.guests)}</span></div></div></div>`);
    val('mb', `${D.MOMENT[mu.moment].label} · ${D.tl(est.total)}`);
    const sp = iv.specs[iv.chosen]; if (sp) { set('inv', I.render({ ...sp, ...form() })); val('inv', IV[sp.design].name); }
  }

  /* ------------------------------------------------------------ slides and navigation */
  const stops = $$('[data-stop]'); const dots = $$('.dots a');
  const now = $('#slide-now'); const bar = $('#progress-bar');
  let current = 0;
  const UI = { night: 'night', pink: 'pink' };
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
  } else stops.forEach((s) => s.classList.add('is-seen'));
  const go = (i) => stops[Math.max(0, Math.min(stops.length - 1, i))].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // The section nearest the top of the viewport right now (robust during smooth scrolls).
  const nearest = () => { let best = current, bd = Infinity; stops.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().top); if (d < bd) { bd = d; best = i; } }); return best; };
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || $$('dialog[open]').length) return;
    if (e.target.closest && e.target.closest('input, textarea, select, button, [role="radiogroup"], [role="tablist"], [contenteditable="true"]')) return;
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
  const heroInvite = () => { const el = $('[data-invite-hero]'); if (el) el.innerHTML = I.render({ design: 'timeless', layout: 1, palette: 0, type: 0, format: 'print', bride: 'Elif', groom: 'Mert', date: '2027-06-12', time: '19.00', venue: STR.demoVenue }); };
  renderItems(); renderResult(false); setVenue('classic'); renderSongs(false); renderBudget(); generate(false); heroInvite();
  setCurrent(0);
  I.ready().then(() => { heroInvite(); renderGallery(false); if (iv.view) renderViewer(); });
})();
