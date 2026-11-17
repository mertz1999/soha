/* SOHA × Biletino — page logic: slides, the event studio, the poster studio,
   personalised suggestions and the connected flow. Uses PosterKit
   (posterkit.js) and the fictional demo data in demo-data.js. */
(() => {
  'use strict';
  const K = window.PosterKit; const D = window.BiletinoDemo;
  if (!K || !D) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQ = window.matchMedia('(max-width: 899px)');
  if (!reduce) document.documentElement.classList.add('motion');
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TODAY = new Date();
  K.installDefs();

  // The page language comes from <html lang>: English at /proposals/biletino/,
  // Turkish at /proposals/biletino/tr/.
  const LANG = (document.documentElement.lang || 'en').slice(0, 2) === 'tr' ? 'tr' : 'en';
  K.setLang(LANG); D.setLang(LANG);
  const STR = {
    tr: {
      chip: { city: 'Şehir', date: 'Tarih', time: 'Saat', cat: 'Tür', cap: 'Kapasite' }, missing: (l) => `${l} yok`, people: (n) => `${n} kişi`, readFrom: 'Metinden okunanlar:',
      update: 'Taslağı Güncelle', regen: 'Taslağı Yeniden Oluştur', building: 'Taslak hazırlanıyor…',
      suggested: '7 alan önerildi: başlık, açıklama, kategori, etiketler, program, biletler, SSS',
      removeTag: (t) => `${t} etiketini kaldır`, tagRemoved: 'Etiket kaldırıldı', free: 'Ücretsiz',
      pub: { nav: 'Etkinlik Ara · Blog · Yardım', details: 'Etkinlik Detayları', faq: 'Sıkça Sorulan Sorular', start: 'Başlangıç', loc: 'Konum', program: 'Program', tickets: 'Biletler' },
      styles: [['auto', 'Otomatik', 'Kategoriye göre'], ['electronic', 'Elektronik', 'Dev tipografi'], ['jazz', 'Editoryal', 'Zarif serif'], ['workshop', 'Geometrik', 'Cesur biçimler']],
      fmt: { poster: 'Afiş', cover: 'Etkinlik kapağı', post: 'Gönderi', story: 'Hikâye' },
      variation: (i, n) => `Varyasyon ${i}: ${n}`, again: 'Yeniden Üret', newVars: (st) => `3 yeni varyasyon: ${st} tarzı`,
      addLogo: 'Logo ekle', refImg: 'Referans görsel', logoMax: 'Logo en fazla 3 MB olabilir', logoSet: (n) => `Logo: ${n}`,
      logoNote: '<b>Logo afişe yerleşti.</b> Değiştirmek için yeniden seç. Dosya cihazından çıkmaz.',
      imgMax: 'Görsel en fazla 8 MB olabilir', noColour: 'Görselde belirgin bir renk bulunamadı', refSet: (h) => `Renk: ${h}`,
      refNote: (sw, h) => `<b>Referans görselden renk alındı:</b> ${sw} ${h}. Görsel cihazından çıkmaz.`, palRef: '· referans',
      show: ['A · Elektronik', 'B · Caz & Kültür', 'C · Yaratıcı Atölye'], openFull: (t) => `${t} afişini tam ekran aç`, tryStudio: 'Stüdyoda dene →',
      poster: 'Afiş', viewerVar: (t, i, v) => `${t} · Varyasyon ${i} (${v})`, editable: 'Metinler düzenlenebilir katmanlardır.',
      interests: [['electronic', 'Elektronik müzik'], ['jazz', 'Caz'], ['theatre', 'Tiyatro'], ['workshop', 'Atölyeler'], ['festival', 'Festivaller'], ['comedy', 'Komedi']],
      match: (n) => `%${n} uyum`, pct: (n) => `%${n}`, ints: (n) => (n ? `${n} ilgi alanı` : 'Tüm türler'),
      foot: (c, total, strict) => `Demo verisi · ${c} için ${total} kurgusal etkinlik puanlandı${strict < 3 ? ` · tam uyan: ${strict}` : ''}`,
      flowWhy: (i) => `✦ ${i.charAt(0).toLocaleUpperCase('tr-TR')}${i.slice(1)} ilginize ve hafta sonu tercihinize uygun.`,
      time: (t) => t.replace(':', '.'),
    },
    en: {
      chip: { city: 'City', date: 'Date', time: 'Time', cat: 'Type', cap: 'Capacity' }, missing: (l) => `No ${l.toLowerCase()}`, people: (n) => `${n} people`, readFrom: 'Read from the text:',
      update: 'Update Draft', regen: 'Regenerate Draft', building: 'Preparing the draft…',
      suggested: '7 fields suggested: title, description, category, tags, schedule, tickets, FAQ',
      removeTag: (t) => `Remove tag ${t}`, tagRemoved: 'Tag removed', free: 'Free',
      pub: { nav: 'Search Events · Blog · Help', details: 'Event Details', faq: 'Frequently Asked Questions', start: 'Starts', loc: 'Location', program: 'Schedule', tickets: 'Tickets' },
      styles: [['auto', 'Auto', 'By category'], ['electronic', 'Electronic', 'Huge type'], ['jazz', 'Editorial', 'Elegant serif'], ['workshop', 'Geometric', 'Bold shapes']],
      fmt: { poster: 'Poster', cover: 'Event cover', post: 'Post', story: 'Story' },
      variation: (i, n) => `Variation ${i}: ${n}`, again: 'Generate Again', newVars: (st) => `3 new variations: ${st} style`,
      addLogo: 'Add logo', refImg: 'Reference image', logoMax: 'The logo can be up to 3 MB', logoSet: (n) => `Logo: ${n}`,
      logoNote: '<b>Logo placed on the poster.</b> Choose again to replace it. The file never leaves your device.',
      imgMax: 'The image can be up to 8 MB', noColour: 'No clear colour found in the image', refSet: (h) => `Colour: ${h}`,
      refNote: (sw, h) => `<b>Colour taken from the reference image:</b> ${sw} ${h}. The image never leaves your device.`, palRef: '· reference',
      show: ['A · Electronic', 'B · Jazz & Culture', 'C · Creative Workshop'], openFull: (t) => `Open the ${t} poster full screen`, tryStudio: 'Try it in the studio →',
      poster: 'Poster', viewerVar: (t, i, v) => `${t} · Variation ${i} (${v})`, editable: 'Text stays as editable layers.',
      interests: [['electronic', 'Electronic music'], ['jazz', 'Jazz'], ['theatre', 'Theatre'], ['workshop', 'Workshops'], ['festival', 'Festivals'], ['comedy', 'Comedy']],
      match: (n) => `${n}% match`, pct: (n) => `${n}%`, ints: (n) => (n ? `${n} interest${n > 1 ? 's' : ''}` : 'All types'),
      foot: (c, total, strict) => `Demo data · ${total} fictional events scored for ${c}${strict < 3 ? ` · exact matches: ${strict}` : ''}`,
      flowWhy: (i) => `✦ Matches your interest in ${i} and your weekend preference.`,
      time: (t) => t,
    },
  }[LANG];

  const toastEl = $('#toast'); let toastT;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2800); };

  // Accessible radio groups made of buttons (arrow keys move and select).
  function radioGroup(box, onPick) {
    box.addEventListener('click', (e) => { const b = e.target.closest('[role="radio"]'); if (b && box.contains(b)) onPick(b.dataset.v, b); });
    box.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }; if (!keys[e.key]) return;
      const items = $$('[role="radio"]', box); const cur = items.indexOf(document.activeElement); if (cur < 0) return;
      e.preventDefault(); const n = (cur + keys[e.key] + items.length) % items.length; items[n].focus(); onPick(items[n].dataset.v, items[n]);
    });
  }
  const setRadio = (box, v) => $$('[role="radio"]', box).forEach((b) => { const on = b.dataset.v === String(v); b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });

  /* ------------------------------------------------------------ poster helpers */
  const placeOf = (o) => [o.district, o.city].filter(Boolean).join(', ');
  const TR_NAMES = { title: 'tr-TR', venue: 'tr-TR', org: 'tr-TR' };
  const sampleContent = (s) => ({ title: s.title, kicker: D.CATS[s.cat].kicker, date: s.date, time: s.time, venue: s.venue, city: placeOf(s), org: s.org, locale: { ...TR_NAMES } });
  const samplePoster = (i, format = 'poster', extra = {}) => K.render({ ...D.SAMPLES[i].poster, format, seed: 0, content: sampleContent(D.SAMPLES[i]), ...extra });
  const eventPoster = (e, format = 'poster') => K.render({
    style: D.CATS[e.cat].style, variant: e.v, palette: e.p, seed: K.util.hash(e.id) % 97, format,
    content: { title: e.t, kicker: D.CATS[e.cat].kicker, date: e.date, time: e.time, venue: e.venue, city: `${e.district}, ${D.CITY_NAMES[e.city]}`, org: '', locale: TR_NAMES },
  });
  const dateShort = (iso) => D.dateShort(iso);

  /* ============================================================ 1 · hero + 2 · ideas */
  function paintHero() {
    $$('[data-hero]').forEach((el) => { el.innerHTML = samplePoster(+el.dataset.hero); });
    $('#hs-cover').innerHTML = samplePoster(0, 'cover');
  }
  function paintIdeas() {
    $$('[data-ivp]').forEach((el) => { el.innerHTML = samplePoster(+el.dataset.ivp); });
    $('#iv-cover').innerHTML = samplePoster(0, 'cover');
    const recs = D.recommend({ city: 'istanbul', interests: ['electronic', 'jazz'], when: 'weekend', budget: 'any' }, TODAY).items;
    recs.forEach((e, i) => { const el = $(`#ivs-${i}`); if (el) el.innerHTML = `<span class="t">${eventPoster(e)}</span><span><b>${esc(e.t)}</b><small>${esc(e.label)}</small></span><em>${STR.pct(e.match)}</em>`; });
  }

  /* ============================================================ 3 · event studio */
  const ICON = {
    city: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="6.5" r="1.8" fill="currentColor"/></svg>',
    date: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2 7h12M5 1.5v3M11 1.5v3" stroke="currentColor" stroke-width="1.6"/></svg>',
    time: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 4.5V8l2.4 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    cat: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h6l6 6-6 6-6-6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="5.5" cy="5.5" r="1.2" fill="currentColor"/></svg>',
    cap: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="5.5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M1.8 14c.4-2.6 2.1-4 4.2-4s3.8 1.4 4.2 4M11 3.5a2.2 2.2 0 1 1 0 4.4M12.2 10.2c1.2.5 1.9 1.9 2 3.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  };
  const E = { samples: $('#ed-samples'), text: $('#ed-text'), found: $('#ed-found'), venue: $('#ed-venue'), org: $('#ed-org'), price: $('#ed-price'), form: $('#ed'), go: $('#ed-go'), goLabel: $('#ed-go-label'), ep: $('#ep'), note: $('#ep-note') };
  const F = (k) => $(`[data-f="${k}"]`, E.ep);
  const ed = { i: 0, draft: null, dirty: false };
  E.samples.innerHTML = D.SAMPLES.map((s, i) => `<button type="button" role="radio" data-v="${i}" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(s.tab)}</button>`).join('');
  radioGroup(E.samples, (v) => loadEdSample(+v));

  function paintFound() {
    const f = D.parse(E.text.value, TODAY);
    const chips = [
      ['city', f.city ? (f.district ? `${f.district}, ${f.city}` : f.city) : null],
      ['date', f.date ? dateShort(f.date) : null],
      ['time', f.time ? STR.time(f.time) : null],
      ['cat', f.cat ? D.CATS[f.cat].label : null],
      ['cap', f.capacity ? STR.people(f.capacity) : null],
    ];
    E.found.innerHTML = `<span class="sr-only">${STR.readFrom}</span>${chips.map(([k, v]) => `<span class="chip${v ? '' : ' off'}">${ICON[k]}${v ? esc(v) : esc(STR.missing(STR.chip[k]))}</span>`).join('')}`;
  }
  function markDirty() {
    paintFound();
    if (ed.draft && !ed.dirty) { ed.dirty = true; E.goLabel.textContent = STR.update; }
  }
  E.text.addEventListener('input', debounce(markDirty, 120));
  [E.venue, E.org, E.price].forEach((el) => el.addEventListener('input', markDirty));
  E.price.addEventListener('input', () => { E.price.value = E.price.value.replace(/[^\d]/g, '').slice(0, 5); });

  function loadEdSample(i, build = true) {
    ed.i = i; const s = D.SAMPLES[i];
    setRadio(E.samples, i);
    E.text.value = s.text; E.venue.value = s.venue; E.org.value = s.org; E.price.value = String(s.price);
    paintFound();
    if (build) buildDraft();
  }
  const draftCover = (d) => K.render({ style: d.style, variant: 0, format: 'cover', content: { title: d.shortTitle, kicker: d.kicker, date: d.date, time: d.time, venue: d.venue, city: placeOf(d), org: d.org, locale: TR_NAMES } });
  function fillDraft(d) {
    F('date').textContent = d.dateLine;
    F('title').textContent = d.title;
    F('org').textContent = d.org;
    F('cat').textContent = d.catPage;
    F('loc').textContent = `${d.venue} · ${placeOf(d)}`;
    F('price').textContent = d.priceRange;
    F('cover').innerHTML = draftCover(d);
    F('desc').innerHTML = d.desc.map((p) => `<p>${esc(p)}</p>`).join('');
    F('tags').innerHTML = d.tags.map((t) => `<li>${esc(t)}<button type="button" aria-label="${esc(STR.removeTag(t))}">×</button></li>`).join('');
    F('sched').innerHTML = d.schedule.map(([t, l]) => `<li><b>${esc(t)}</b><span>${esc(l)}</span></li>`).join('');
    F('tix').innerHTML = d.tickets.map((t) => `<li><span><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></span><strong>${t.price === 0 ? STR.free : `${D.fmtTL(t.price)} TRY`}</strong></li>`).join('');
    F('faq').innerHTML = d.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  }
  let building = false;
  async function buildDraft() {
    if (building) return; building = true;
    const s = D.SAMPLES[ed.i];
    const d = D.draft(E.text.value, { venue: E.venue.value.trim(), org: E.org.value.trim(), price: E.price.value.trim() }, s, TODAY);
    ed.draft = d; ed.dirty = false;
    E.go.disabled = true; E.ep.classList.add('is-building'); E.ep.setAttribute('aria-busy', 'true');
    E.note.textContent = STR.building;
    fillDraft(d);
    await wait(850);
    E.ep.classList.remove('is-building'); E.ep.setAttribute('aria-busy', 'false');
    if (!reduce) ['cover', 'date', 'title', 'org', 'cat', 'loc', 'price', 'desc', 'tags'].forEach((k, n) => { const el = F(k); el.classList.remove('pop'); void el.offsetWidth; el.style.animationDelay = `${n * 70}ms`; el.classList.add('pop'); });
    E.note.textContent = STR.suggested;
    E.goLabel.textContent = STR.regen; E.go.disabled = false; building = false;
  }
  E.form.addEventListener('submit', (e) => { e.preventDefault(); buildDraft(); });

  // tabs inside the draft page
  const tabs = $$('.ep-tabs [role="tab"]');
  const showTab = (t, focus = false) => {
    tabs.forEach((b) => { const on = b === t; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; $(`#${b.getAttribute('aria-controls')}`).hidden = !on; });
    if (focus) t.focus();
  };
  tabs.forEach((t) => t.addEventListener('click', () => showTab(t)));
  $('.ep-tabs').addEventListener('keydown', (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault(); const i = tabs.indexOf(document.activeElement); showTab(tabs[(i + k + tabs.length) % tabs.length], true);
  });
  $('#ep-buy').addEventListener('click', () => {
    showTab($('#ept-tickets'));
    const tabsBar = $('.ep-tabs'); if (!mobileQ.matches) E.ep.scrollTo({ top: tabsBar.offsetTop - 12, behavior: reduce ? 'auto' : 'smooth' });
    else tabsBar.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    const tix = F('tix'); tix.classList.remove('flash'); void tix.offsetWidth; tix.classList.add('flash');
  });
  F('tags').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const li = b.parentElement; const next = li.nextElementSibling || li.previousElementSibling;
    li.remove(); toast(STR.tagRemoved); if (next) $('button', next).focus();
  });
  [F('title'), F('desc')].forEach((el) => el.addEventListener('keydown', (e) => { if (e.key === 'Escape') el.blur(); }));
  F('title').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } });

  // publish preview, built from the current (edited) draft
  const pub = $('#pub');
  $('#ep-preview').addEventListener('click', () => {
    const d = ed.draft; if (!d) return;
    const title = F('title').textContent.trim() || d.title;
    const paras = $$('p', F('desc')).map((p) => p.textContent.trim()).filter(Boolean);
    const descHtml = (paras.length ? paras : F('desc').innerText.split(/\n+/)).map((p) => `<p>${esc(p)}</p>`).join('');
    const tags = $$('li', F('tags')).map((li) => li.firstChild.textContent);
    $('#pub-page').innerHTML = `
      <div class="pub-head"><b>biletino</b><span>${STR.pub.nav}</span></div>
      <div class="ep-top">
        <div class="ep-info">
          <p class="ep-date">${esc(d.dateLine)}</p><h3 class="ep-title">${esc(title)}</h3>
          <p class="ep-org">${$('.ep-org svg', E.ep).outerHTML}<span>${esc(d.org)}</span></p>
          <p><span class="ep-pill">${esc(d.catPage)}</span></p><p class="ep-loc">${esc(`${d.venue} · ${placeOf(d)}`)}</p><p class="ep-price">${esc(d.priceRange)}</p>
        </div>
        <div class="ep-cover">${draftCover(d)}</div>
      </div>
      <div class="pub-body">
        <div><h4>${STR.pub.details}</h4><div class="ep-desc">${descHtml}</div>${tags.length ? `<ul class="ep-tags">${tags.map((t) => `<li style="padding-right:11px">${esc(t)}</li>`).join('')}</ul>` : ''}
          <h4 style="margin-top:22px">${STR.pub.faq}</h4><div class="ep-faq">${d.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div>
        <aside class="pub-side"><div><b>${STR.pub.start}</b>${esc(d.dateLine)}, ${esc(STR.time(d.time))}</div><div><b>${STR.pub.loc}</b>${esc(`${d.venue}, ${placeOf(d)}`)}</div><div><b>${STR.pub.program}</b>${d.schedule.map(([t, l]) => `${esc(t)} · ${esc(l)}`).join('<br>')}</div><div><b>${STR.pub.tickets}</b>${d.tickets.map((t) => `${esc(t.name)}: ${t.price === 0 ? STR.free : `${D.fmtTL(t.price)} TRY`}`).join('<br>')}</div></aside>
      </div>`;
    pub.showModal();
  });
  $('#pub-close').addEventListener('click', () => pub.close());
  pub.addEventListener('click', (e) => { if (e.target === pub) pub.close(); });

  /* ============================================================ 4 · poster studio */
  const S = {
    form: $('#st-form'), samples: $('#st-samples'), title: $('#st-title'), date: $('#st-date'), time: $('#st-time'), venue: $('#st-venue'), city: $('#st-city'),
    cat: $('#st-cat'), styles: $('#st-styles'), logo: $('#st-logo'), ref: $('#st-ref'), logoB: $('#st-logo-b'), refB: $('#st-ref-b'), upNote: $('#up-note'),
    gen: $('#st-gen'), genLabel: $('#st-gen-label'), canvas: $('#st-canvas'), poster: $('#st-poster'), vars: $('#st-vars'), fmt: $('#fmt-tabs'), meta: $('#fmt-meta'), palName: $('#pal-name'),
  };
  const STYLE_OPTS = STR.styles;
  const FMT_ORDER = ['poster', 'cover', 'post', 'story'];
  const FMT_ICON = { poster: [10, 12.5], cover: [16, 9], post: [11, 11], story: [7.5, 13] };
  const defaultsFor = (seed) => [0, 1, 2].map((i) => ({ palette: seed === 0 ? 0 : (seed + i) % 3, intensity: 1, alt: seed === 0 ? false : (seed + i) % 2 === 1 }));
  const st = { sample: 0, cat: 'electronic', styleChoice: 'auto', seed: 0, sel: 0, format: 'poster', vars: defaultsFor(0), logo: null, logoName: '', accent: null, content: sampleContent(D.SAMPLES[0]) };
  const styleOf = () => (st.styleChoice === 'auto' ? D.CATS[st.cat].style : st.styleChoice);
  const specFor = (i, format = st.format) => ({ style: styleOf(), variant: i, seed: st.seed, format, palette: st.vars[i].palette, intensity: st.vars[i].intensity, alt: st.vars[i].alt, accent: st.accent, content: { ...st.content, kicker: D.CATS[st.cat].kicker, logo: st.logo } });

  // build controls
  S.samples.innerHTML = D.SAMPLES.map((s, i) => `<button type="button" role="radio" data-v="${i}" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="th" data-st-th="${i}"></span>${esc(s.tab)}</button>`).join('');
  S.cat.innerHTML = Object.entries(D.CATS).map(([k, c]) => `<option value="${k}">${esc(c.label)}</option>`).join('');
  S.styles.innerHTML = STYLE_OPTS.map(([v, n, d], i) => `<label><input type="radio" name="st-style" value="${v}"${i === 0 ? ' checked' : ''}><span><i class="sw-${v}" aria-hidden="true"></i><span>${n}<small>${d}</small></span></span></label>`).join('');
  S.fmt.innerHTML = FMT_ORDER.map((f) => { const F0 = K.FORMATS[f]; const [w, h] = FMT_ICON[f]; return `<button type="button" role="radio" data-v="${f}" aria-checked="${f === 'poster'}" tabindex="${f === 'poster' ? 0 : -1}"><i style="width:${w}px;height:${h}px" aria-hidden="true"></i>${STR.fmt[f]} <small>${F0.ratio}</small></button>`; }).join('');

  function fillForm() {
    const c = st.content;
    S.title.value = c.title; S.date.value = c.date; S.time.value = c.time; S.venue.value = c.venue; S.city.value = c.city; S.cat.value = st.cat;
    S.time.removeAttribute('aria-invalid');
  }
  function loadStudioSample(i) {
    const s = D.SAMPLES[i];
    st.sample = i; st.cat = s.cat; st.content = sampleContent(s); st.seed = 0; st.sel = 0; st.vars = defaultsFor(0);
    st.styleChoice = 'auto'; $$('input[name="st-style"]', S.styles).forEach((r) => { r.checked = r.value === 'auto'; });
    setRadio(S.samples, i); fillForm(); renderStudio({ swap: true }); paintFlow();
  }
  radioGroup(S.samples, (v) => loadStudioSample(+v));

  const ar = (f) => `${K.FORMATS[f].w} / ${K.FORMATS[f].h}`;
  function renderStudio(o = {}) {
    const f = st.format;
    S.poster.style.setProperty('--ar', ar(f)); S.vars.style.setProperty('--ar', ar(f));
    S.poster.classList.toggle('wide', f === 'cover'); S.canvas.classList.toggle('is-wide', f === 'cover');
    S.poster.innerHTML = K.render(specFor(st.sel));
    if (o.swap && !reduce) { S.poster.classList.remove('swap'); void S.poster.offsetWidth; S.poster.classList.add('swap'); }
    const names = K.STYLES[styleOf()].variants;
    S.vars.innerHTML = [0, 1, 2].map((i) => `<button type="button" role="radio" data-v="${i}" aria-checked="${i === st.sel}" tabindex="${i === st.sel ? 0 : -1}" aria-label="${esc(STR.variation(i + 1, names[i]))}">${K.render(specFor(i))}<span class="vn" aria-hidden="true">${i + 1} · ${esc(names[i])}</span></button>`).join('');
    const F0 = K.FORMATS[f];
    S.meta.textContent = `${F0.w} × ${F0.h} px · ${F0.use}`;
    const v = st.vars[st.sel]; const pals = K.PALETTES[styleOf()];
    S.palName.textContent = st.accent ? STR.palRef : `· ${pals[(K.DEFAULT_PAL[styleOf()][st.sel] + v.palette) % pals.length].name}`;
    $('[data-r="less"]').disabled = v.intensity <= 0; $('[data-r="more"]').disabled = v.intensity >= 2;
    $('[data-r="reset"]').disabled = JSON.stringify(v) === JSON.stringify(defaultsFor(st.seed)[st.sel]) && !st.accent;
    paintFlowFormats();
  }
  const renderQuick = debounce(() => renderStudio(), 50);
  radioGroup(S.vars, (v) => { st.sel = +v; renderStudio({ swap: true }); });
  radioGroup(S.fmt, (v) => { st.format = v; setRadio(S.fmt, v); renderStudio({ swap: true }); });

  // live text layers
  const bindText = (el, key, clean = (x) => x) => el.addEventListener('input', () => {
    st.content[key] = clean(el.value);
    if (st.content.locale && key in st.content.locale) st.content.locale = { ...st.content.locale, [key]: null };
    renderQuick(); paintFlowDebounced();
  });
  bindText(S.title, 'title'); bindText(S.venue, 'venue'); bindText(S.city, 'city');
  S.date.addEventListener('change', () => { if (/^\d{4}-\d{2}-\d{2}$/.test(S.date.value)) { st.content.date = S.date.value; renderStudio(); paintFlow(); } });
  S.time.addEventListener('input', () => {
    const m = S.time.value.trim().match(/^([01]?\d|2[0-3])[.:]([0-5]\d)$/);
    S.time.setAttribute('aria-invalid', String(!m && S.time.value.trim() !== ''));
    if (m) { st.content.time = `${m[1].padStart(2, '0')}:${m[2]}`; renderQuick(); paintFlowDebounced(); }
  });
  S.cat.addEventListener('change', () => { st.cat = S.cat.value; renderStudio({ swap: st.styleChoice === 'auto' }); paintFlow(); });
  S.styles.addEventListener('change', (e) => { if (e.target.name === 'st-style') { st.styleChoice = e.target.value; renderStudio({ swap: true }); paintFlow(); } });

  // generate three variations
  let generating = false;
  S.form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (generating) return; generating = true;
    S.gen.disabled = true; S.canvas.classList.add('is-gen');
    await wait(1000);
    st.seed += 1; st.vars = defaultsFor(st.seed); st.sel = 0;
    S.canvas.classList.remove('is-gen'); renderStudio({ swap: true });
    if (!reduce) $$('button', S.vars).forEach((b, n) => b.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: 120 + n * 110, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }));
    S.genLabel.textContent = STR.again; S.gen.disabled = false; generating = false;
    toast(STR.newVars(K.STYLES[styleOf()].name));
    paintFlow();
  });

  // refinements
  $('.refine').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-r]'); if (!b) return;
    const v = st.vars[st.sel]; const r = b.dataset.r;
    if (r === 'palette') { if (st.accent) { st.accent = null; S.ref.value = ''; setUp(S.ref, S.refB, null); } else v.palette = (v.palette + 1) % 3; }
    else if (r === 'less') v.intensity = Math.max(0, v.intensity - 1);
    else if (r === 'more') v.intensity = Math.min(2, v.intensity + 1);
    else if (r === 'layout') v.alt = !v.alt;
    else if (r === 'reset') { st.vars[st.sel] = defaultsFor(st.seed)[st.sel]; }
    renderStudio({ swap: true }); paintFlow();
  });

  // optional uploads: logo is placed on the poster, the reference image gives an accent colour
  const upNote0 = S.upNote.innerHTML;
  function setUp(input, btn, label) {
    const box = input.closest('.up'); box.classList.toggle('is-set', !!label);
    btn.textContent = label || (input === S.logo ? STR.addLogo : STR.refImg);
    if (!label && !st.logo && !st.accent) S.upNote.innerHTML = upNote0;
  }
  const readFile = (file) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file); });
  S.logo.addEventListener('change', async () => {
    const file = S.logo.files[0]; if (!file) return;
    if (file.size > 3e6) { toast(STR.logoMax); S.logo.value = ''; return; }
    st.logo = await readFile(file); st.logoName = file.name;
    setUp(S.logo, S.logoB, STR.logoSet(file.name)); S.upNote.innerHTML = STR.logoNote;
    renderStudio({ swap: true });
  });
  function dominant(img) {
    const c = document.createElement('canvas'); const N = 48; c.width = c.height = N; const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, N, N); const d = x.getImageData(0, 0, N, N).data; const B = new Map();
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i]; const g = d[i + 1]; const b = d[i + 2]; if (d[i + 3] < 128) continue;
      const mx = Math.max(r, g, b); const mn = Math.min(r, g, b); const s = mx ? (mx - mn) / mx : 0; const v = mx / 255;
      if (s < 0.28 || v < 0.25) continue;
      let h = 0; const dd = mx - mn;
      if (mx === r) h = ((g - b) / dd) % 6; else if (mx === g) h = (b - r) / dd + 2; else h = (r - g) / dd + 4;
      const k = Math.round(((h * 60 + 360) % 360) / 24); const w = s * v * v;
      const o = B.get(k) || { w: 0, r: 0, g: 0, b: 0 }; o.w += w; o.r += r * w; o.g += g * w; o.b += b * w; B.set(k, o);
    }
    let best = null; B.forEach((o) => { if (!best || o.w > best.w) best = o; });
    if (!best) return null;
    return `#${[best.r, best.g, best.b].map((v) => Math.round(v / best.w).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  }
  S.ref.addEventListener('change', async () => {
    const file = S.ref.files[0]; if (!file) return;
    if (file.size > 8e6) { toast(STR.imgMax); S.ref.value = ''; return; }
    const url = await readFile(file); const img = new Image();
    img.onload = () => {
      const hex = dominant(img);
      if (!hex) { toast(STR.noColour); S.ref.value = ''; return; }
      st.accent = hex; setUp(S.ref, S.refB, STR.refSet(hex));
      S.upNote.innerHTML = STR.refNote(`<span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:${hex};vertical-align:-1px"></span>`, hex);
      renderStudio({ swap: true });
    };
    img.src = url;
  });

  // showcase row (the three original posters)
  const SHOW_LABEL = STR.show;
  $('#show-row').innerHTML = D.SAMPLES.map((s, i) => `<figure class="show-card"><button type="button" class="show-poster" data-show="${i}" aria-label="${esc(STR.openFull(s.title))}">${samplePoster(i)}</button><figcaption><span class="sc-k">${SHOW_LABEL[i]}</span><span class="sc-t">${esc(s.title)}</span><button type="button" class="sc-try" data-load="${i}">${STR.tryStudio}</button></figcaption></figure>`).join('');
  $('#show-row').addEventListener('click', (e) => {
    const p = e.target.closest('[data-show]'); if (p) { openViewer({ mode: 'show', i: +p.dataset.show, format: 'poster' }, p); return; }
    const t = e.target.closest('[data-load]'); if (t) { loadStudioSample(+t.dataset.load); $('#studio').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
  });

  // full-screen viewer
  const vw = $('#viewer'); const vwFmt = $('#vw-fmt'); let vctx = { mode: 'studio', i: 0, format: 'poster' }; let vwOpener = null;
  vwFmt.innerHTML = S.fmt.innerHTML;
  function paintViewer() {
    const f = vctx.format; setRadio(vwFmt, f);
    const box = $('#vw-poster'); box.classList.toggle('wide', f === 'cover');
    if (vctx.mode === 'show') {
      const s = D.SAMPLES[vctx.i]; box.innerHTML = samplePoster(vctx.i, f);
      $('#viewer-title').textContent = `${SHOW_LABEL[vctx.i]} · ${s.title}`;
    } else {
      box.innerHTML = K.render(specFor(vctx.i, f));
      $('#viewer-title').textContent = STR.viewerVar(st.content.title || STR.poster, vctx.i + 1, K.STYLES[styleOf()].variants[vctx.i]);
    }
    const F0 = K.FORMATS[f]; $('#vw-meta').textContent = `${F0.label} · ${F0.w} × ${F0.h} px · ${F0.use}. ${STR.editable}`;
  }
  function openViewer(ctx, opener) { vctx = { ...ctx }; vwOpener = opener || null; paintViewer(); vw.showModal(); }
  const stepViewer = (k) => {
    vctx.i = (vctx.i + k + 3) % 3;
    if (vctx.mode === 'studio') { st.sel = vctx.i; renderStudio(); }
    paintViewer();
  };
  radioGroup(vwFmt, (v) => { vctx.format = v; if (vctx.mode === 'studio') { st.format = v; setRadio(S.fmt, v); renderStudio(); } paintViewer(); });
  $('#vw-prev').addEventListener('click', () => stepViewer(-1));
  $('#vw-next').addEventListener('click', () => stepViewer(1));
  $('#vw-close').addEventListener('click', () => vw.close());
  vw.addEventListener('click', (e) => { if (e.target === vw) vw.close(); });
  vw.addEventListener('keydown', (e) => { if (e.target.closest('[role="radiogroup"]')) return; if (e.key === 'ArrowRight') stepViewer(1); if (e.key === 'ArrowLeft') stepViewer(-1); });
  vw.addEventListener('close', () => { if (vwOpener && document.contains(vwOpener)) vwOpener.focus(); });
  S.poster.addEventListener('click', () => openViewer({ mode: 'studio', i: st.sel, format: st.format }, S.poster));
  $('#st-full').addEventListener('click', (e) => openViewer({ mode: 'studio', i: st.sel, format: st.format }, e.currentTarget));

  /* ============================================================ 5 · suggestions */
  const sg = { city: 'istanbul', interests: ['electronic'], when: 'weekend', budget: 'any' };
  const INTERESTS = STR.interests;
  const segHtml = (name, opts, cur) => opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}"${v === cur ? ' checked' : ''}><span>${esc(l)}</span></label>`).join('');
  $('[data-pref="city"]').innerHTML = segHtml('sg-city', Object.entries(D.CITY_NAMES), sg.city);
  $('[data-pref="interests"]').innerHTML = INTERESTS.map(([v, l]) => `<label><input type="checkbox" name="sg-int" value="${v}"${sg.interests.includes(v) ? ' checked' : ''}><span>${esc(l)}</span></label>`).join('');
  $('[data-pref="when"]').innerHTML = segHtml('sg-when', Object.entries(D.WHEN).map(([k, o]) => [k, o.label]), sg.when);
  $('[data-pref="budget"]').innerHTML = segHtml('sg-budget', Object.entries(D.BUDGET).map(([k, o]) => [k, o.label]), sg.budget);
  $('#prefs').addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'sg-city') sg.city = t.value; else if (t.name === 'sg-when') sg.when = t.value; else if (t.name === 'sg-budget') sg.budget = t.value;
    else if (t.name === 'sg-int') sg.interests = $$('input[name="sg-int"]:checked').map((x) => x.value);
    renderSuggest(true);
  });
  const list = $('#ph-list');
  function cardHtml(e) {
    return `<div class="ph-thumb">${eventPoster(e)}</div><div class="ph-info"><div class="ph-row1"><span class="ph-cat">${esc(D.CATS[e.cat].label)}</span><span class="ph-match">${esc(STR.match(e.match))}</span></div><div class="ph-row2"><p class="ph-title">${esc(e.t)}</p><span class="ph-price">${esc(D.fmtLira(e.price))}</span></div><p class="ph-meta">${esc(e.label)} · ${esc(STR.time(e.time))}<br>${esc(e.venue)}, ${esc(e.district)}</p></div><p class="ph-why"><i aria-hidden="true">✦</i><span>${esc(e.reason)}</span></p>`;
  }
  function renderSuggest(animate = false) {
    const r = D.recommend(sg, TODAY);
    const first = new Map($$('.ph-item', list).map((li) => [li.dataset.id, li.getBoundingClientRect().top]));
    const keep = new Map($$('.ph-item', list).map((li) => [li.dataset.id, li]));
    const nodes = r.items.map((e) => {
      let li = keep.get(e.id);
      if (!li) { li = document.createElement('li'); li.className = 'ph-item'; li.dataset.id = e.id; li.innerHTML = cardHtml(e); li.dataset.fresh = '1'; }
      else { li.innerHTML = cardHtml(e); delete li.dataset.fresh; }
      li.classList.toggle('relaxed', e.relaxed);
      return li;
    });
    list.replaceChildren(...nodes);
    if (animate && !reduce) {
      nodes.forEach((li, n) => {
        if (li.dataset.fresh) li.animate([{ opacity: 0, transform: 'translateY(18px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 60 + n * 60, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
        else { const dy = first.get(li.dataset.id) - li.getBoundingClientRect().top; if (dy) li.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.7,.2,1)' }); }
      });
    }
    const ints = STR.ints(sg.interests.length);
    $('#ph-sum').textContent = `${D.CITY_NAMES[sg.city]} · ${D.WHEN[sg.when].label} · ${D.BUDGET[sg.budget].label} · ${ints}`;
    $('#ph-foot').textContent = STR.foot(D.CITY_NAMES[sg.city], r.total, r.strictCount);
  }
  $('#sg-count').textContent = String(D.EVENTS.length);

  /* ============================================================ 6 · flow + 7 · closing */
  function paintFlowFormats() {
    const i = st.sel;
    $('#fs-f1').innerHTML = K.render(specFor(i, 'cover')); $('#fs-f2').innerHTML = K.render(specFor(i, 'post')); $('#fs-f3').innerHTML = K.render(specFor(i, 'story'));
  }
  function paintFlow() {
    const c = st.content; const cat = st.cat;
    $('#fs-pcover').innerHTML = K.render(specFor(st.sel, 'cover'));
    $('#fs-ptitle').textContent = c.title;
    $('#fs-cthumb').innerHTML = K.render(specFor(st.sel, 'poster'));
    $('#fs-ctitle').textContent = c.title;
    $('#fs-why').textContent = STR.flowWhy(D.CATS[cat].interest);
    paintFlowFormats();
    if (!typingDone) $('#fs-typing').textContent = reduce ? D.SAMPLES[st.sample].text : '';
    else $('#fs-typing').textContent = D.SAMPLES[st.sample].text;
  }
  const paintFlowDebounced = debounce(paintFlow, 200);
  let typingDone = false;
  async function typeFlow() {
    if (typingDone) return; typingDone = true;
    const el = $('#fs-typing'); const txt = D.SAMPLES[st.sample].text;
    if (reduce) { el.textContent = txt; return; }
    for (let n = 0; n <= txt.length; n += 2) { el.textContent = txt.slice(0, n); await new Promise((r) => setTimeout(r, 18)); }
    el.textContent = txt;
  }
  function paintFan() { $('#fan').innerHTML = [1, 0, 2].map((i) => `<div>${samplePoster(i)}</div>`).join(''); }

  /* ============================================================ slides and navigation */
  const stops = $$('[data-stop]'); const slides = $$('.slide'); const dots = $$('.dots a');
  const now = $('#slide-now'); const bar = $('#progress-bar');
  const secOf = (el) => slides.indexOf(el.closest('.slide'));
  let current = 0;
  const setCurrent = (i) => {
    current = i; const stop = stops[i]; const sec = secOf(stop);
    dots.forEach((d, n) => (n === sec ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    if (now) now.textContent = String(sec + 1).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${i / (stops.length - 1)})`;
    document.body.dataset.ui = stop.dataset.theme || slides[sec].dataset.theme || 'light';
  };
  const onSeen = (el) => { el.classList.add('is-seen'); if (el.id === 's6') typeFlow(); };
  if ('IntersectionObserver' in window) {
    const mid = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) setCurrent(stops.indexOf(e.target)); }), { rootMargin: '-50% 0px -50% 0px' });
    const seen = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { onSeen(e.target); seen.unobserve(e.target); } }), { threshold: 0.2 });
    stops.forEach((s) => mid.observe(s)); [...new Set([...stops, ...slides])].forEach((s) => seen.observe(s));
  } else { [...stops, ...slides].forEach(onSeen); }
  const go = (i) => stops[Math.max(0, Math.min(stops.length - 1, i))].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // The stop nearest the top of the viewport right now (robust during smooth scrolls).
  const nearest = () => { let best = current; let bd = Infinity; stops.forEach((s, i) => { const d = Math.abs(s.getBoundingClientRect().top); if (d < bd) { bd = d; best = i; } }); return best; };
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || vw.open || pub.open) return;
    if (e.target.closest && e.target.closest('input, textarea, select, button, summary, [contenteditable="true"], [role="radiogroup"], [role="tablist"]')) return;
    if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); go(nearest() + 1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(nearest() - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(stops.length - 1); }
  });

  // The language switch opens the same section in the other language.
  $$('[data-lang-link]').forEach((a) => a.addEventListener('click', () => {
    const stop = stops[nearest()]; const id = stop.id || (stop.closest('.slide') || {}).id;
    a.href = `${a.getAttribute('href').split('#')[0]}${id && id !== 's1' ? `#${id}` : ''}`;
  }));

  /* ============================================================ start */
  function paintAll() {
    paintHero(); paintIdeas(); renderStudio(); paintFlow(); paintFan(); renderSuggest(false);
    $$('[data-st-th]').forEach((el) => { el.innerHTML = samplePoster(+el.dataset.stTh); const sv = $('svg', el); if (sv) sv.setAttribute('preserveAspectRatio', 'xMidYMid slice'); });
    $$('[data-show]').forEach((el) => { el.innerHTML = samplePoster(+el.dataset.show); });
    if (ed.draft) { F('cover').innerHTML = draftCover(ed.draft); }
  }
  fillForm();
  loadEdSample(0, false);
  ed.draft = D.draft(E.text.value, { venue: E.venue.value, org: E.org.value, price: E.price.value }, D.SAMPLES[0], TODAY);
  fillDraft(ed.draft);
  E.note.textContent = STR.suggested;
  E.goLabel.textContent = STR.regen;
  paintAll();
  setCurrent(0);
  K.ready().then(paintAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => K.ready().then(paintAll));
})();
