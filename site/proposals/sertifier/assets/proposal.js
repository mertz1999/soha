/* SOHA × Sertifier — page logic: slides, the generator demo, showcase,
   refinements, preview and exports. Uses CertKit (certkit.js). */
(() => {
  'use strict';
  const K = window.CertKit;
  if (!K) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQ = window.matchMedia('(max-width: 899px)');
  if (!reduce) document.documentElement.classList.add('motion');
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ------------------------------------------------------------ state */
  const DEFAULT_TITLES = {
    course: 'Advanced Product Design',
    achievement: 'Product Strategy',
    recognition: 'Design Systems Initiative',
    event: 'Design Systems Summit 2026',
  };
  const TITLE_LABEL = { course: 'Course or program', achievement: 'Achievement', recognition: 'Contribution', event: 'Event name' };
  const DESIGN_ORDER = ['heritage', 'editorial', 'future'];
  const LAYOUT_SETS = [[0, 0, 0], [1, 2, 1], [2, 1, 2], [0, 1, 2], [1, 0, 1], [2, 2, 0]];
  const SOHA_SITE = new URL('../../', document.baseURI).href;
  // Sertifier's public brand values, typed in by SOHA so the founder can try
  // their own domain. Shown as demo mode: nothing is read from sertifier.com.
  const KNOWN = {
    'sertifier.com': { name: 'Sertifier', pairing: 'neutral', colors: { primary: '#092C25', accent: '#00A356', paper: '#F8F8F7', ink: '#111111' } },
  };

  const defaultsData = () => ({
    recipient: 'Deniz Yılmaz', title: DEFAULT_TITLES.course, organization: 'Meridian Academy', date: '2026-11-16',
    signer: 'Elif Aksoy', role: 'Program Director', signer2: 'James Whitfield', role2: 'Head of Learning',
    showSignature: true, showVerification: true,
  });
  const state = {
    brand: K.brandFromPreset('meridian'),
    brandKey: 'meridian',
    note: { kind: 'preset', badge: 'Demo preset', text: 'Predefined demo brand. No website was read.' },
    purpose: 'course', style: 'elegant', lang: 'en',
    data: defaultsData(),
    generated: false, seed: 0, selected: 0,
    designs: [],
  };
  const makeDesigns = (seed) => {
    const st = K.STYLES[state.style]; const set = LAYOUT_SETS[seed % LAYOUT_SETS.length];
    return DESIGN_ORDER.map((design, i) => ({ design, layout: set[i], ornament: st.ornament, elegance: st.elegance, brandColors: true }));
  };
  state.designs = makeDesigns(0);
  const specOf = (d, s = state) => ({ ...d, purpose: s.purpose, lang: s.lang, brand: s.brand, data: s.data });
  const draw = (el, spec) => { const r = K.render(spec); el.innerHTML = r.svg; return r; };

  // Fixed sample used by the opening and the idea section.
  const SAMPLE = { brand: K.brandFromPreset('meridian'), purpose: 'course', lang: 'en', data: defaultsData() };
  const sampleSpec = (design, layout = 0) => ({ design, layout, ornament: 2, elegance: 2, brandColors: true, ...SAMPLE });

  /* ------------------------------------------------------------ toast */
  const toastEl = $('#toast'); let toastT;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600); };

  /* ------------------------------------------------------------ 1 · hero */
  const heroLayers = $$('#hero-stack .layer');
  const heroChips = $$('.hero-chips button');
  const drawHero = () => heroLayers.forEach((el) => draw(el, sampleSpec(el.dataset.design)));
  let heroI = 0; let heroTimer = null; let heroHold = 0;
  const showHero = (i) => {
    heroI = (i + 3) % 3;
    heroLayers.forEach((el, n) => el.classList.toggle('is-on', n === heroI));
    heroChips.forEach((b, n) => b.setAttribute('aria-pressed', String(n === heroI)));
  };
  heroChips.forEach((b) => b.addEventListener('click', () => { showHero(+b.dataset.i); heroHold = Date.now() + 9000; }));
  const startHero = () => { if (reduce || heroTimer) return; heroTimer = setInterval(() => { if (Date.now() > heroHold) showHero(heroI + 1); }, 3800); };
  const stopHero = () => { clearInterval(heroTimer); heroTimer = null; };

  /* ------------------------------------------------------------ 2 · idea */
  const pipeline = $('#pipeline');
  const drawIdea = () => {
    $$('.mini', pipeline).forEach((el) => draw(el, { ...sampleSpec(el.dataset.design), ornament: 1 }));
    const r = draw($('#edit-cert'), sampleSpec('heritage'));
    const box = r.report.boxes['recipient.name'];
    if (box) {
      const sel = $('#edit-sel'); const pad = 10;
      const pct = (v, total) => `${(v / total) * 100}%`;
      Object.assign(sel.style, { left: pct(box.x - pad, K.W), top: pct(box.y - pad, K.H), width: pct(box.w + pad * 2, K.W), height: pct(box.h + pad * 1.4, K.H) });
      const tb = $('.editable .toolbar'); Object.assign(tb.style, { left: pct(box.x + box.w * 0.5 - 50, K.W), top: `calc(${pct(box.y - pad, K.H)} - 34px)` });
      const cur = $('.editable .cursor'); Object.assign(cur.style, { left: pct(box.x + box.w - 30, K.W), top: pct(box.y + box.h - 10, K.H) });
    }
  };
  const playIdea = () => { pipeline.classList.remove('is-playing'); void pipeline.offsetWidth; pipeline.classList.add('is-playing'); };
  $('#replay').addEventListener('click', playIdea);

  /* ------------------------------------------------------------ 3 · studio: brand */
  const form = $('#studio');
  const els = {
    url: $('#url'), analyze: $('#analyze'), card: $('#brand-card'), logo: $('#bc-logo'), name: $('#bc-name'), host: $('#bc-url'),
    source: $('#bc-source'), note: $('#bc-note'), primary: $('#c-primary'), accent: $('#c-accent'), primaryHex: $('#c-primary-hex'),
    accentHex: $('#c-accent-hex'), pairing: $('#pairing'), logoFile: $('#logo-file'), logoClear: $('#logo-clear'),
    recipient: $('#f-recipient'), title: $('#f-title'), titleLabel: $('#title-label'), org: $('#f-org'), date: $('#f-date'),
    signer: $('#f-signer'), role: $('#f-role'), sign: $('#f-sign'), verify: $('#f-verify'),
    generate: $('#generate'), generateLabel: $('#generate-label'),
  };
  const SERTIFIER_HOST = 'sertifier.com'; const SERTIFIER_URL = 'https://sertifier.com/';
  const trySBtn = $('#try-sertifier'); const trySGo = $('.to-go', trySBtn);
  $('#to-mark').innerHTML = K.markSvg({ name: KNOWN[SERTIFIER_HOST].name, mark: { type: 'monogram' }, fonts: { sans: 'Inter Variable' } }, KNOWN[SERTIFIER_HOST].colors.primary);
  // preset marks in the radio cards
  $$('.pr-mark[data-mark]').forEach((el) => { const b = K.brandFromPreset(el.dataset.mark); el.innerHTML = K.markSvg(b, b.colors.primary); });

  const hostOf = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch (e) { return u; } };
  const paintBrandCard = () => {
    const b = state.brand;
    els.logo.innerHTML = b.mark && b.mark.type === 'image' ? `<img src="${b.mark.src}" alt="">` : K.markSvg(b, b.colors.primary);
    els.name.textContent = b.name;
    els.host.textContent = hostOf(b.url || '');
    els.source.textContent = state.note.badge;
    els.source.dataset.kind = state.note.kind;
    els.note.textContent = state.note.text;
    els.primary.value = b.colors.primary.toLowerCase(); els.primaryHex.textContent = b.colors.primary.toUpperCase();
    els.accent.value = b.colors.accent.toLowerCase(); els.accentHex.textContent = b.colors.accent.toUpperCase();
    els.pairing.value = b.pairing || 'classic';
    els.logoClear.hidden = !(b.mark && b.mark.type === 'image' && b.mark.uploaded);
    const isSertifier = hostOf(b.url || '') === SERTIFIER_HOST;
    trySBtn.setAttribute('aria-pressed', String(isSertifier)); trySGo.textContent = isSertifier ? '✓' : '→';
  };
  const setPresetRadio = (key) => $$('input[name="preset"]').forEach((r) => { r.checked = r.value === key; });

  const applyBrand = async (brand, note, key) => {
    state.brand = brand; state.brandKey = key || 'custom'; state.note = note;
    state.data.organization = brand.name; els.org.value = brand.name;
    if (brand.url) els.url.value = brand.url;
    setPresetRadio(key || '');
    paintBrandCard();
    await K.loadFonts(brand);
    refresh({ swap: true });
  };
  const usePreset = (key) => {
    if (key === 'soha') { readLive(SOHA_SITE, 'soha'); return; }
    applyBrand(K.brandFromPreset(key), { kind: 'preset', badge: 'Demo preset', text: 'Predefined demo brand. No website was read.' }, key);
  };
  $$('input[name="preset"]').forEach((r) => r.addEventListener('change', () => { if (r.checked) usePreset(r.value); }));

  // --- live brand reading (only when the site allows the browser to read it)
  const fetchText = async (url, ms = 6000) => {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
    try { const res = await fetch(url, { signal: ctl.signal, credentials: 'omit', mode: 'cors' }); if (!res.ok) throw new Error(`HTTP ${res.status}`); return { text: await res.text(), url: res.url || url }; } finally { clearTimeout(t); }
  };
  const toDataUrl = async (url) => {
    try { const res = await fetch(url, { credentials: 'omit', mode: 'cors' }); if (!res.ok) return url; const blob = await res.blob(); if (blob.size > 1.5e6) return url; return await new Promise((ok) => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.onerror = () => ok(url); fr.readAsDataURL(blob); }); } catch (e) { return url; }
  };
  const GENERIC = /^(inherit|initial|unset|system-ui|-apple-system|blinkmacsystemfont|segoe ui|roboto|helvetica( neue)?|arial|sans-serif|serif|monospace|ui-monospace|ui-sans-serif|ui-serif|menlo|tahoma|georgia|var\(.*)$/i;
  async function extractBrand(pageUrl) {
    const { text: html, url: finalUrl } = await fetchText(pageUrl);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const abs = (u) => { try { return new URL(u, finalUrl).href; } catch (e) { return null; } };
    const meta = (sel) => (doc.querySelector(sel) || {}).content || '';
    const title = (doc.querySelector('title') || {}).textContent || '';
    const name = (meta('meta[property="og:site_name"]') || meta('meta[name="application-name"]') || title.split(/\s+[|—–-]\s+/)[0] || hostOf(finalUrl)).trim();
    const theme = meta('meta[name="theme-color"]');
    const logoEl = doc.querySelector('img[class*="logo" i], img[class*="brand" i], img[alt*="logo" i], img[src*="logo" i]');
    const iconEl = doc.querySelector('link[rel="apple-touch-icon"], link[rel~="icon"]');
    const logoUrl = logoEl ? abs(logoEl.getAttribute('src')) : (iconEl ? abs(iconEl.getAttribute('href')) : null);
    let css = $$('style', doc).map((s) => s.textContent).join('\n');
    const sheetLinks = $$('link[rel~="stylesheet"]', doc).map((l) => abs(l.getAttribute('href'))).filter(Boolean);
    const sameHost = sheetLinks.filter((h) => new URL(h).host === new URL(finalUrl).host).slice(0, 4);
    for (const h of sameHost) { try { css += '\n' + (await fetchText(h, 5000)).text.slice(0, 400000); } catch (e) { /* skip */ } }
    // colours
    const counts = new Map();
    const add = (hex, w = 1) => { let h = hex.toUpperCase(); if (h.length === 4) h = '#' + h.slice(1).split('').map((c) => c + c).join(''); counts.set(h, (counts.get(h) || 0) + w); };
    (css.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []).forEach((h) => add(h));
    if (/^#[0-9a-f]{3,6}$/i.test(theme)) add(theme, 8);
    const list = [...counts.entries()].map(([hex, n]) => { const [h, s, l] = K.color.toHsl(hex); return { hex, n, h, s, l, lum: K.color.lum(hex) }; });
    const chroma = list.filter((c) => c.s > 0.25 && c.l > 0.12 && c.l < 0.8).sort((a, b) => b.n - a.n);
    const themeC = chroma.find((c) => c.hex === (theme || '').toUpperCase());
    const primary = themeC || chroma.find((c) => c.l < 0.45) || chroma[0];
    const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
    const accent = primary && chroma.filter((c) => c !== primary && hueGap(c.h, primary.h) > 35).sort((a, b) => b.n * b.s - a.n * a.s)[0];
    const paper = list.filter((c) => c.lum > 0.82 && c.hex !== '#FFFFFF').sort((a, b) => b.n - a.n)[0];
    const ink = list.filter((c) => c.lum < 0.06).sort((a, b) => b.n - a.n)[0];
    // fonts (declared families and linked font CSS)
    const fams = new Map();
    (css.match(/font-family\s*:\s*[^;}{]+/gi) || []).concat(css.match(/--font[\w-]*\s*:\s*[^;}{]+/gi) || []).forEach((decl) => {
      decl.split(':').slice(1).join(':').split(',').forEach((f) => { const n = f.replace(/!important/, '').replace(/["']/g, '').trim(); if (n && !GENERIC.test(n)) fams.set(n, (fams.get(n) || 0) + 1); });
    });
    sheetLinks.forEach((h) => { const m = h.match(/fontsource(?:-variable)?\/([a-z0-9-]+)/i) || h.match(/family=([^:&]+)/i); if (m) { const n = decodeURIComponent(m[1]).replace(/[-+]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()); fams.set(n, (fams.get(n) || 0) + 2); } });
    const fonts = [...fams.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n).slice(0, 3);
    const fl = fonts.join(' ').toLowerCase();
    const pairing = /space grotesk/.test(fl) ? 'technical' : /dm sans|fraunces/.test(fl) ? 'warm' : /cormorant|garamond|playfair|serif/.test(fl) ? 'classic' : 'neutral';
    if (!primary) throw new Error('No brand colour found');
    const brandName = name.length > 40 ? name.slice(0, 40) : name;
    const logo = logoUrl ? await toDataUrl(logoUrl) : null;
    const pr = K.PAIRINGS[pairing];
    return {
      brand: {
        id: 'live', name: brandName, url: finalUrl, pairing, fonts: { serif: pr.serif, sans: pr.sans },
        mark: logo ? { type: 'image', src: logo } : { type: 'monogram' },
        colors: { primary: primary.hex, accent: accent ? accent.hex : K.color.mix(primary.hex, '#FFFFFF', 0.45), paper: paper ? paper.hex : '#FFFFFF', ink: ink ? ink.hex : '#111111' },
        source: 'live',
      },
      info: { host: hostOf(finalUrl), colours: counts.size, fonts, logo: !!logoUrl, pairing: pr.label },
    };
  }
  async function readLive(url, key) {
    els.card.setAttribute('aria-busy', 'true'); els.analyze.setAttribute('aria-busy', 'true');
    els.source.textContent = 'Reading…'; els.source.dataset.kind = 'live'; els.note.textContent = `Reading ${hostOf(url)}…`;
    try {
      const { brand, info } = await extractBrand(url);
      const fontsTxt = info.fonts.length ? `fonts ${info.fonts.join(', ')} (closest pairing: ${info.pairing})` : `no web fonts found (pairing: ${info.pairing})`;
      await applyBrand(brand, { kind: 'live', badge: 'Read live', text: `Read live from ${info.host}: name, ${info.logo ? 'logo, ' : ''}${info.colours} colour values, ${fontsTxt}. A simplified extraction for this demo.` }, key);
    } catch (e) {
      if (key) { setPresetRadio(state.brandKey); paintBrandCard(); toast('Could not read the SOHA site from here.'); }
      else demoMode(url);
    } finally { els.card.removeAttribute('aria-busy'); els.analyze.removeAttribute('aria-busy'); }
  }
  function demoMode(url) {
    const host = hostOf(url); const known = KNOWN[host];
    const nameFromHost = host.split('.')[0].split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') || 'Your Company';
    const pairing = known ? known.pairing : Object.keys(K.PAIRINGS)[K.util.hash(host) % 4];
    const pr = K.PAIRINGS[pairing];
    const brand = {
      id: 'demo', name: known ? known.name : nameFromHost, url: url, pairing, fonts: { serif: pr.serif, sans: pr.sans },
      mark: { type: 'monogram' }, colors: known ? { ...known.colors } : K.paletteFromName(host), source: 'demo',
    };
    const text = known
      ? `Demo mode. This page can’t read ${host}, so SOHA entered its public colours and type for this demo. Nothing was fetched.`
      : `Demo mode. This page can’t read ${host} (the site doesn’t allow it), so the starting colours come from the domain name. Adjust them below.`;
    return applyBrand(brand, { kind: 'demo', badge: 'Demo mode', text }, null);
  }
  const normaliseUrl = (v) => { let s = v.trim(); if (!s) return null; if (!/^https?:\/\//i.test(s)) s = `https://${s}`; try { const u = new URL(s); return /\./.test(u.host) || u.host.startsWith('localhost') ? u.href : null; } catch (e) { return null; } };
  const analyze = () => {
    const url = normaliseUrl(els.url.value);
    if (!url) { els.url.focus(); toast('Enter a website, e.g. yourcompany.com'); return; }
    const host = hostOf(url);
    const preset = Object.values(K.PRESETS).find((p) => hostOf(p.url) === host);
    if (preset) { usePreset(preset.id); return; }
    if (KNOWN[host]) { demoMode(url); return; }
    readLive(url, null);
  };
  els.analyze.addEventListener('click', analyze);

  // --- one tap: Sertifier's own brand (demo values entered by SOHA, nothing fetched)
  const trySertifier = async ({ scroll = false } = {}) => {
    if (scroll) $('#s4').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    await demoMode(SERTIFIER_URL);
    if (!state.generated) els.generate.click();
  };
  trySBtn.addEventListener('click', () => trySertifier());
  $$('[data-try-sertifier]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); trySertifier({ scroll: true }); }));
  els.url.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); analyze(); } });

  // --- manual brand edits
  const markManual = () => { if (state.note.kind !== 'manual') state.note = { kind: 'manual', badge: 'Edited', text: `${state.note.text.replace(/\s*Edited manually\.$/, '')} Edited manually.` }; els.source.textContent = state.note.badge; els.source.dataset.kind = 'manual'; els.note.textContent = state.note.text; };
  const onColor = (key, input, hex) => input.addEventListener('input', () => { state.brand.colors[key] = input.value.toUpperCase(); hex.textContent = input.value.toUpperCase(); markManual(); if (key === 'primary') els.logo.innerHTML = state.brand.mark.type === 'image' ? els.logo.innerHTML : K.markSvg(state.brand, state.brand.colors.primary); refresh({ quick: true }); });
  onColor('primary', els.primary, els.primaryHex);
  onColor('accent', els.accent, els.accentHex);
  els.pairing.addEventListener('change', async () => { const pr = K.PAIRINGS[els.pairing.value]; state.brand.pairing = els.pairing.value; state.brand.fonts = { serif: pr.serif, sans: pr.sans }; markManual(); await K.loadFonts(state.brand); refresh({ swap: true }); });
  els.logoFile.addEventListener('change', () => {
    const f = els.logoFile.files && els.logoFile.files[0]; if (!f) return;
    if (f.size > 1.5e6) { toast('Please use a logo under 1.5 MB.'); return; }
    const fr = new FileReader();
    fr.onload = () => { state.brand.prevMark = state.brand.prevMark || state.brand.mark; state.brand.mark = { type: 'image', src: fr.result, uploaded: true }; markManual(); paintBrandCard(); refresh({ swap: true }); toast('Logo added. It stays in your browser.'); };
    fr.readAsDataURL(f); els.logoFile.value = '';
  });
  els.logoClear.addEventListener('click', () => { state.brand.mark = state.brand.prevMark || { type: 'monogram' }; delete state.brand.prevMark; paintBrandCard(); refresh({ swap: true }); });

  /* ------------------------------------------------------------ 3 · studio: details */
  const radios = (name, fn) => $$(`input[name="${name}"]`).forEach((r) => r.addEventListener('change', () => { if (r.checked) fn(r.value); }));
  radios('purpose', (v) => {
    const old = state.purpose; state.purpose = v;
    if (els.title.value.trim() === DEFAULT_TITLES[old]) { els.title.value = DEFAULT_TITLES[v]; state.data.title = DEFAULT_TITLES[v]; }
    els.titleLabel.textContent = TITLE_LABEL[v];
    refresh({ swap: true });
  });
  radios('style', (v) => {
    state.style = v; const st = K.STYLES[v];
    state.designs.forEach((d) => { d.ornament = st.ornament; d.elegance = st.elegance; });
    refresh({ swap: true });
  });
  radios('lang', (v) => { state.lang = v; refresh({ swap: true }); });
  const bindText = (el, key) => el.addEventListener('input', () => { state.data[key] = el.value; refresh({ quick: true }); });
  bindText(els.recipient, 'recipient'); bindText(els.title, 'title'); bindText(els.org, 'organization'); bindText(els.signer, 'signer'); bindText(els.role, 'role');
  els.date.addEventListener('change', () => { if (els.date.value) { state.data.date = els.date.value; refresh({ quick: true }); } });
  els.sign.addEventListener('change', () => { state.data.showSignature = els.sign.checked; refresh({ swap: true }); });
  els.verify.addEventListener('change', () => { state.data.showVerification = els.verify.checked; refresh({ swap: true }); });
  form.addEventListener('submit', (e) => e.preventDefault());

  /* ------------------------------------------------------------ 3 · results */
  const resEmpty = $('#res-empty'); const resLive = $('#res-live'); const resMain = $('#res-main'); const resSide = $('#res-side');
  const resName = $('#res-name'); const resBadge = $('#res-badge'); const resChecks = $('#res-checks'); const resStatus = $('#res-status');
  const overlay = $('#gen-overlay');
  const checksHtml = (rep) => {
    const items = [];
    if (rep.fit.ok) {
      const resized = rep.fit.shrunk.length || rep.fit.wrapped.length;
      items.push(['ok', resized ? `Text fits (auto-sized${rep.fit.wrapped.includes('recipient.name') ? ', name on 2 lines' : ''})` : 'All text fits']);
    } else items.push(['warn', `Shortened: ${rep.fit.truncated.join(', ')}`]);
    items.push([rep.contrast.ok ? 'ok' : 'warn', rep.contrast.ok ? `Contrast AA · min ${rep.contrast.min}:1` : `Low contrast: ${rep.contrast.failing.join(', ')}`]);
    items.push([rep.safe.ok ? 'ok' : 'warn', rep.safe.ok ? 'Inside safe margins' : `Outside margins: ${rep.safe.outside.join(', ')}`]);
    items.push(['ok', `${rep.fields.length} dynamic fields`]);
    return items.map(([k, t]) => `<li class="${k === 'warn' ? 'warn' : ''}">${t}</li>`).join('');
  };
  const sideOrder = () => [0, 1, 2].filter((i) => i !== state.selected);
  function renderResults(opt = {}) {
    if (!state.generated) return;
    resEmpty.hidden = true; resLive.hidden = false;
    const d = state.designs[state.selected];
    const r = draw(resMain, specOf(d));
    resMain.setAttribute('aria-label', `Open a larger preview of ${K.DESIGNS[d.design].name}`);
    resName.textContent = K.DESIGNS[d.design].name;
    const match = K.STYLES[state.style].match === d.design;
    resBadge.hidden = !match; resBadge.textContent = `Best match for ${state.style[0].toUpperCase()}${state.style.slice(1)}`;
    resChecks.innerHTML = checksHtml(r.report);
    resSide.innerHTML = sideOrder().map((i) => `<div class="res-side-item"><button type="button" class="res-thumb" data-i="${i}" aria-label="Show ${K.DESIGNS[state.designs[i].design].name}"></button><span class="res-thumb-cap">${K.DESIGNS[state.designs[i].design].name}</span></div>`).join('');
    $$('.res-thumb', resSide).forEach((b) => draw(b, specOf(state.designs[+b.dataset.i])));
    if (opt.reveal) {
      [resMain, ...$$('.res-side-item', resSide)].forEach((el, i) => { el.classList.remove('reveal-in'); void el.offsetWidth; el.style.animationDelay = `${i * 0.12}s`; el.classList.add('reveal-in'); });
    } else if (opt.swap && !reduce) {
      [resMain, ...$$('.res-thumb', resSide)].forEach((el) => { el.classList.remove('swap-in'); void el.offsetWidth; el.classList.add('swap-in'); });
    }
    return r;
  }
  resSide.addEventListener('click', (e) => { const b = e.target.closest('.res-thumb'); if (!b) return; select(+b.dataset.i, { from: 'results' }); });
  resMain.addEventListener('click', () => openPreview(state.selected));
  $('#res-enlarge').addEventListener('click', () => openPreview(state.selected));

  let generating = false;
  els.generate.addEventListener('click', async () => {
    if (generating) return; generating = true;
    if (state.generated) state.seed += 1;
    state.designs = makeDesigns(state.seed);
    state.selected = DESIGN_ORDER.indexOf(K.STYLES[state.style].match);
    els.generate.setAttribute('aria-busy', 'true');
    await K.loadFonts(state.brand);
    if (!reduce) {
      overlay.hidden = false; const steps = $$('li', overlay); const bar = $('.gen-bar i', overlay);
      steps.forEach((li) => li.classList.remove('is-active', 'is-done')); bar.style.width = '0';
      for (let i = 0; i < steps.length; i += 1) { steps[i].classList.add('is-active'); bar.style.width = `${((i + 1) / steps.length) * 100}%`; await wait(520); steps[i].classList.replace('is-active', 'is-done'); }
      await wait(160);
    }
    state.generated = true;
    const r = renderResults({ reveal: true });
    overlay.hidden = true;
    els.generateLabel.textContent = 'Generate again';
    els.generate.removeAttribute('aria-busy');
    resStatus.textContent = `Three designs generated for ${state.brand.name}. Showing ${K.DESIGNS[state.designs[state.selected].design].name}. ${r && r.report.fit.ok ? 'All text fits.' : ''}`;
    renderGallery(); renderFan(); updateRefine();
    if (mobileQ.matches) resLive.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    generating = false;
  });

  $$('[data-generate]').forEach((b) => b.addEventListener('click', () => els.generate.click()));

  /* ------------------------------------------------------------ 4 · showcase */
  const gallery = $('#gallery'); const gCards = $$('.g-card', gallery); const gDots = $$('#g-dots i');
  const posOf = (i) => (i - state.selected + 3) % 3;
  function renderGallery(onlyIndex) {
    gCards.forEach((card) => {
      const i = +card.dataset.i; const d = state.designs[i];
      if (onlyIndex == null || onlyIndex === i) draw($('.g-svg', card), specOf(d));
      $('.g-cap', card).textContent = K.DESIGNS[d.design].name;
      card.setAttribute('aria-label', `${K.DESIGNS[d.design].name}. ${posOf(i) === 0 ? 'Selected. Press to enlarge.' : 'Press to select.'}`);
    });
    placeGallery();
  }
  function placeGallery() {
    gCards.forEach((card) => { card.dataset.pos = String(posOf(+card.dataset.i)); });
    gDots.forEach((dot, n) => dot.classList.toggle('is-on', n === state.selected));
  }
  gallery.addEventListener('click', (e) => {
    const card = e.target.closest('.g-card'); if (!card) return;
    const i = +card.dataset.i;
    if (mobileQ.matches || i === state.selected) openPreview(i); else select(i, { from: 'gallery' });
  });
  // phones: the snapped card becomes the selection
  let snapObs = null;
  const watchSnap = () => {
    if (snapObs) { snapObs.disconnect(); snapObs = null; }
    if (!mobileQ.matches || !('IntersectionObserver' in window)) return;
    snapObs = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting && en.intersectionRatio > 0.6) { const i = +en.target.dataset.i; if (i !== state.selected) select(i, { from: 'snap' }); } }), { root: gallery, threshold: [0.6] });
    gCards.forEach((c) => snapObs.observe(c));
  };
  mobileQ.addEventListener ? mobileQ.addEventListener('change', watchSnap) : mobileQ.addListener(watchSnap);

  const refineName = $('#refine-name'); const refineParams = $('#refine-params'); const refineLog = $('#refine-log');
  const refineBtn = (k) => $(`[data-refine="${k}"]`);
  const LEVEL = ['low', 'medium', 'high'];
  function updateRefine() {
    const d = state.designs[state.selected];
    refineName.textContent = K.DESIGNS[d.design].name;
    refineParams.textContent = `Layout ${d.layout + 1} · Ornament ${LEVEL[d.ornament]} · Elegance ${LEVEL[d.elegance]} · ${d.brandColors ? 'Brand colours' : 'Neutral colours'}`;
    refineBtn('minimal').disabled = d.ornament === 0;
    refineBtn('elegant').disabled = d.elegance === 2;
    refineBtn('brand').setAttribute('aria-pressed', String(d.brandColors));
  }
  function select(i, opt = {}) {
    if (i === state.selected) return;
    state.selected = i;
    renderResults({ swap: opt.from !== 'snap' });
    placeGallery(); updateRefine();
    gCards.forEach((card) => { const n = +card.dataset.i; card.setAttribute('aria-label', `${K.DESIGNS[state.designs[n].design].name}. ${n === i ? 'Selected. Press to enlarge.' : 'Press to select.'}`); });
    if (opt.from === 'results' && mobileQ.matches) gCards[i].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
  }
  $$('[data-refine]').forEach((b) => b.addEventListener('click', () => {
    const d = state.designs[state.selected]; const k = b.dataset.refine; const before = { ...d };
    if (k === 'minimal') d.ornament = Math.max(0, d.ornament - 1);
    if (k === 'elegant') d.elegance = Math.min(2, d.elegance + 1);
    if (k === 'layout') d.layout = (d.layout + 1) % 3;
    if (k === 'brand') d.brandColors = !d.brandColors;
    if (k === 'reset') { const st = K.STYLES[state.style]; Object.assign(d, { ornament: st.ornament, elegance: st.elegance, brandColors: true, layout: LAYOUT_SETS[state.seed % LAYOUT_SETS.length][state.selected] }); }
    const log = [];
    if (before.ornament !== d.ornament) log.push(`ornament ${LEVEL[before.ornament]} → ${LEVEL[d.ornament]}`);
    if (before.elegance !== d.elegance) log.push(`elegance ${LEVEL[before.elegance]} → ${LEVEL[d.elegance]}`);
    if (before.layout !== d.layout) log.push(`layout ${before.layout + 1} → ${d.layout + 1}`);
    if (before.brandColors !== d.brandColors) log.push(d.brandColors ? 'brand colours on' : 'neutral palette');
    refineLog.textContent = log.length ? `${K.DESIGNS[d.design].short}: ${log.join(' · ')}` : 'No change';
    renderGallery(state.selected);
    const svgBox = $('.g-svg', gCards[state.selected]);
    if (!reduce) { svgBox.classList.remove('swap-in'); void svgBox.offsetWidth; svgBox.classList.add('swap-in'); }
    renderResults({ swap: true }); renderFan(); updateRefine();
  }));

  /* ------------------------------------------------------------ 6 · closing */
  const fanCards = $$('#fan .fan-card');
  function renderFan() { fanCards.forEach((el) => draw(el, specOf(state.designs[+el.dataset.i]))); }

  /* ------------------------------------------------------------ preview dialog */
  const dlg = $('#preview'); const pvCert = $('#pv-cert'); const pvTitle = $('#pv-title'); let pvI = 0;
  const portraitPhone = () => window.innerWidth < 600 && window.innerHeight > window.innerWidth;
  function paintPreview() { const d = state.designs[pvI]; draw(pvCert, specOf(d)); pvTitle.textContent = K.DESIGNS[d.design].name; }
  function openPreview(i) {
    pvI = i; paintPreview();
    dlg.classList.toggle('is-rotated', portraitPhone());
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $('#pv-close').addEventListener('click', () => dlg.close());
  $('#pv-prev').addEventListener('click', () => { pvI = (pvI + 2) % 3; paintPreview(); });
  $('#pv-next').addEventListener('click', () => { pvI = (pvI + 1) % 3; paintPreview(); });
  $('#pv-rotate').addEventListener('click', () => dlg.classList.toggle('is-rotated'));
  $('#pv-svg').addEventListener('click', () => downloadSvg(pvI));
  $('#pv-print').addEventListener('click', () => printDesign(pvI));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { pvI = (pvI + 1) % 3; paintPreview(); } if (e.key === 'ArrowLeft') { pvI = (pvI + 2) % 3; paintPreview(); } });

  /* ------------------------------------------------------------ exports */
  const download = (name, text, type) => { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); };
  const slug = (s) => K.util.clean(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'certificate';
  async function downloadSvg(i = state.selected) {
    const spec = specOf(state.designs[i]);
    if (spec.brand.mark && spec.brand.mark.type === 'image' && !/^data:/.test(spec.brand.mark.src)) spec.brand = { ...spec.brand, mark: { ...spec.brand.mark, src: await toDataUrl(spec.brand.mark.src) } };
    const { svg } = K.render(spec, { standalone: true });
    download(`${slug(state.brand.name)}-${spec.design}-certificate.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`, 'image/svg+xml');
    toast('SVG downloaded. Fonts load from a public CDN when opened.');
  }
  function designJson(i = state.selected) {
    const d = state.designs[i]; const spec = specOf(d); const r = K.render(spec); const pu = K.COPY[state.lang].p[state.purpose];
    const placeholders = { 'recipient.name': '{{recipient.name}}', 'credential.title': '{{credential.title}}', 'issuer.name': '{{issuer.name}}', 'issue.date': '{{issue.date}}', 'credential.id': '{{credential.id}}' };
    return {
      schema: 'soha.certificate-design/0.1',
      generator: { kind: 'deterministic-demo', engine: 'CertKit', note: 'Produced in the browser by SOHA’s demo layout engine. No AI model was called.' },
      brand: {
        name: state.brand.name, url: state.brand.url || null, source: state.note.kind,
        colors: { ...state.brand.colors }, typography: { serif: state.brand.fonts.serif, sans: state.brand.fonts.sans, pairing: state.brand.pairing },
        logo: state.brand.mark.type === 'image' ? { type: 'image', embedded: /^data:/.test(state.brand.mark.src) } : { type: state.brand.mark.type },
      },
      page: { format: 'A4', orientation: 'landscape', width: K.W, height: K.H, unit: 'px (96 dpi)' },
      design: { system: d.design, name: K.DESIGNS[d.design].name, layout: d.layout, ornament: d.ornament, elegance: d.elegance, brandColors: d.brandColors },
      content: { purpose: state.purpose, language: state.lang, title: pu.full, line: pu.line, fields: r.report.fields.map((f) => ({ key: f, placeholder: placeholders[f] || `{{${f}}}` })) },
      sampleData: { recipient: r.model.recipient, title: r.model.title, organization: r.model.org, date: r.model.date, credentialId: `${r.model.id} (demo placeholder)` },
      validation: { fit: r.report.fit, contrast: r.report.contrast, safeArea: r.report.safe },
    };
  }
  $('#x-svg').addEventListener('click', () => downloadSvg());
  $('#x-json').addEventListener('click', () => { const j = designJson(); download(`${slug(state.brand.name)}-${j.design.system}-design.json`, JSON.stringify(j, null, 2), 'application/json'); toast('Design JSON exported.'); });
  const b64 = { enc: (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''), dec: (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))) };
  $('#x-link').addEventListener('click', async () => {
    const b = state.brand;
    const cfg = { v: 1, k: state.brandKey, b: { n: b.name, u: b.url, c: b.colors, p: b.pairing, m: b.mark.type === 'image' ? (state.brandKey === 'soha' ? 'soha' : 'monogram') : b.mark.type }, s: state.note.kind, pu: state.purpose, st: state.style, l: state.lang, d: state.data, g: state.designs, sel: state.selected, seed: state.seed };
    const url = `${location.origin}${location.pathname}#cfg=${b64.enc(cfg)}`;
    try { await navigator.clipboard.writeText(url); toast(b.mark.uploaded ? 'Link copied (uploaded logos are not included).' : 'Demo link copied.'); } catch (e) { window.prompt('Copy this demo link:', url); }
  });
  function printDesign(i = state.selected) {
    const root = $('#print-root'); const { svg } = K.render(specOf(state.designs[i]));
    root.innerHTML = svg; document.body.classList.add('printing');
    const done = () => { document.body.classList.remove('printing'); root.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(() => window.print(), 50);
  }
  $('#x-print').addEventListener('click', () => printDesign());

  /* ------------------------------------------------------------ refresh */
  const refreshNow = (opt = {}) => {
    if (state.generated) renderResults({ swap: opt.swap });
    renderGallerySoon(); updateRefine();
  };
  const renderGallerySoon = debounce(() => { renderGallery(); renderFan(); }, 220);
  const refreshQuick = debounce(() => refreshNow({}), 60);
  function refresh(opt = {}) { if (opt.quick) refreshQuick(); else refreshNow(opt); }

  /* ------------------------------------------------------------ slides */
  const slides = $$('.slide'); const dots = $$('.dots a'); const now = $('#slide-now'); const bar = $('#progress-bar');
  let current = 0;
  const setCurrent = (i) => {
    current = i;
    dots.forEach((d, n) => (n === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    if (now) now.textContent = String(i + 1).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${i / (slides.length - 1)})`;
    document.body.dataset.ui = slides[i].dataset.theme || 'light';
    if (slides[i].id === 's1') startHero(); else stopHero();
  };
  if ('IntersectionObserver' in window) {
    const mid = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) setCurrent(slides.indexOf(e.target)); }), { rootMargin: '-50% 0px -50% 0px' });
    const seen = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-seen'); if (e.target.id === 's2') playIdea(); seen.unobserve(e.target); } }), { threshold: 0.25 });
    slides.forEach((s) => { mid.observe(s); seen.observe(s); });
  } else { slides.forEach((s) => s.classList.add('is-seen')); playIdea(); }
  const go = (i) => slides[Math.max(0, Math.min(slides.length - 1, i))].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || dlg.open) return;
    if (e.target.closest && e.target.closest('input, textarea, select, button, summary, [contenteditable="true"], .gallery')) return;
    if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
  });

  /* ------------------------------------------------------------ restore a shared demo link */
  function restore() {
    const m = location.hash.match(/#cfg=([\w-]+)/); if (!m) return false;
    try {
      const c = b64.dec(m[1]); if (c.v !== 1) return false;
      let brand;
      if (K.PRESETS[c.k]) brand = K.brandFromPreset(c.k);
      else {
        const pr = K.PAIRINGS[c.b.p] || K.PAIRINGS.neutral;
        brand = { id: 'shared', name: K.util.clean(c.b.n).slice(0, 60) || 'Shared brand', url: c.b.u, pairing: c.b.p, fonts: { serif: pr.serif, sans: pr.sans }, colors: c.b.c, mark: c.b.m === 'soha' ? { type: 'image', src: new URL('../../assets/img/logo-mark.png', document.baseURI).href } : { type: ['meridian', 'northwind', 'verde'].includes(c.b.m) ? c.b.m : 'monogram' } };
      }
      const hex = /^#[0-9A-F]{6}$/i;
      ['primary', 'accent', 'paper', 'ink'].forEach((k) => { if (c.b.c && hex.test(c.b.c[k])) brand.colors[k] = c.b.c[k]; });
      state.brand = brand; state.brandKey = K.PRESETS[c.k] ? c.k : (c.k === 'soha' ? 'soha' : 'custom');
      state.note = { kind: 'manual', badge: 'Shared link', text: 'Restored from a shared demo link. Values come from the link, not from a website.' };
      if (K.STYLES[c.st]) state.style = c.st; if (K.COPY[c.l]) state.lang = c.l; if (DEFAULT_TITLES[c.pu]) state.purpose = c.pu;
      const dd = defaultsData(); Object.keys(dd).forEach((k) => { if (c.d && typeof c.d[k] === typeof dd[k]) dd[k] = typeof dd[k] === 'string' ? String(c.d[k]).slice(0, 90) : c.d[k]; }); state.data = dd;
      if (Array.isArray(c.g) && c.g.length === 3) state.designs = c.g.map((g, i) => ({ design: DESIGN_ORDER[i], layout: (g.layout | 0) % 3, ornament: Math.min(2, Math.max(0, g.ornament | 0)), elegance: Math.min(2, Math.max(0, g.elegance | 0)), brandColors: g.brandColors !== false }));
      state.selected = Math.min(2, Math.max(0, c.sel | 0)); state.seed = c.seed | 0; state.generated = true;
      // reflect in the form
      els.url.value = brand.url || ''; setPresetRadio(state.brandKey);
      $$('input[name="purpose"]').forEach((r) => { r.checked = r.value === state.purpose; });
      $$('input[name="style"]').forEach((r) => { r.checked = r.value === state.style; });
      $$('input[name="lang"]').forEach((r) => { r.checked = r.value === state.lang; });
      els.recipient.value = dd.recipient; els.title.value = dd.title; els.org.value = dd.organization; els.date.value = dd.date;
      els.signer.value = dd.signer; els.role.value = dd.role; els.sign.checked = dd.showSignature; els.verify.checked = dd.showVerification;
      els.titleLabel.textContent = TITLE_LABEL[state.purpose]; els.generateLabel.textContent = 'Generate again';
      return true;
    } catch (e) { return false; }
  }

  /* ------------------------------------------------------------ start */
  const restored = restore();
  paintBrandCard();
  const paintAll = () => {
    drawHero(); drawIdea(); renderGallery(); renderFan(); updateRefine();
    if (state.generated) renderResults();
  };
  paintAll();
  setCurrent(0);
  watchSnap();
  Promise.all([K.loadFonts(SAMPLE.brand), K.loadFonts(state.brand)]).then(() => { paintAll(); if (restored) setTimeout(() => $('#s4').scrollIntoView({ behavior: 'auto' }), 60); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintAll);
})();
