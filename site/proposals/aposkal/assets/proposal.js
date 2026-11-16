// SOHA × Aposkal proposal — slides, sample chart, demos and TR/EN switch.
// The page works without this file (Turkish, final states). All figures are
// fictional sample data; nothing here calls Aposkal.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  if (!reduce) root.classList.add('motion');

  /* ---------------- i18n ---------------- */
  const EN = {
    title: '3 new AI opportunities for Aposkal — SOHA',
    brandHome: 'SOHA — back to start', langGroup: 'Language', slidesNav: 'Slides',
    nav1: 'Intro', nav2: 'Monthly analysis', nav3: 'MCP + Skills', nav4: 'Closing copilot', nav5: 'Summary', nav6: "Let's talk",
    h1: '<em>3&nbsp;new AI opportunities</em> for Aposkal',
    lede1: 'Three intelligent capabilities that could be integrated into your existing product.',
    cta1: 'Explore the ideas',
    note1: 'An independent product proposal prepared by SOHA for the Aposkal team.',
    k2: 'Financial intelligence', h2: 'AI Monthly Financial Analytics',
    lede2: 'Next to the existing monthly income chart, a short analysis report prepared automatically every month.',
    t2a: 'Compares income and expenses with previous months', t2b: 'Flags unusual increases and decreases', t2c: 'Not a chat: a ready monthly report',
    segLabel: 'Experience', segToday: 'Today', segAi: 'Proposed', sample: 'Sample data',
    phoneLabel: 'Sample interface: Aposkal mobile home screen with the proposed monthly analysis',
    phSub: 'Home', chartTitle: 'Monthly Income Chart', chartRange: '12 months', chartMonth: 'October',
    chartValue: '₺413,000', chartDelta: '+18%',
    recentTitle: 'Recent activity', in: 'Money in', out: 'Money out', rentRow: 'Office rent',
    aiTitle: 'October analysis', aiWhen: 'Automatic report · Nov 1, 08:00',
    ins1: 'Income rose 18% vs last month.', ins1s: 'Sep ₺350,000 → Oct ₺413,000',
    ins2: 'Expenses fell 6%.', ins2s: 'The clearest drop was in logistics costs.',
    ins3: 'Overdue receivables have grown for 3 months.', ins3s: 'Following up on collections is recommended.',
    aiMore: 'Full report →', avg: 'Avg',
    tabHome: 'Home', tabSales: 'Sales', tabReports: 'Reports', tabMore: 'More',
    k3: 'AI connectivity', h3: 'Aposkal, Connected to AI Assistants',
    lede3: 'Bring your data to the AI assistant you already use.',
    capsLabel: 'Example capabilities', cap1: 'View invoices', cap2: 'Analyze account balances', cap3: 'Prepare financial reports', read: 'Read',
    guard1: 'Actions that change data require user approval.', guard2: 'API keys stay on the server, never with the assistant.',
    archLabel: 'Proposed architecture: AI clients connect through the Aposkal MCP Server and AI Skills to the existing Aposkal API',
    cl1: 'MCP app', cl3: 'Other clients', cl3s: 'MCP-compatible',
    proposed: 'Proposed', srv1: 'Authorized API tools', srv2: 'Accounting usage guide', srvLock: 'Permission-controlled access',
    apiSub: 'Existing, documented API', g1: 'Documents', g2: 'Customers / Suppliers', g3: 'Reports',
    archNote: 'Setup differs by client.',
    k4: 'Accounting automation', h4: 'AI Accounting Closing Copilot',
    lede4: 'Finds and prioritizes month-end gaps. The accountant always makes the call.',
    with: 'Works alongside the trial balance and rule engine',
    deskLabel: 'Sample interface: month-end check in the accountant workspace', deskApp: 'Accountant workspace',
    side1: 'Clients', side2: 'Trial balance', side3: 'Rule engine', side4: 'Month-end',
    deskTitle: 'Month-end check', deskSub: 'October 2026 · Ege Tasarım Ltd.', deskAgent: 'Sorted by the assistant',
    stepsLabel: 'Status', stFound: 'Detected', stReviewed: 'Reviewed', stApproved: 'Approved',
    prioHigh: 'High', prioMid: 'Medium', prioLow: 'Low',
    task1: 'Unmatched bank transactions', task1s: '7 items · 4 may match open invoices',
    task2: 'Missing documents', task2s: '3 expenses · request list for the client ready',
    task3: 'Journal entries to review', task3s: '5 entries · unusual amount or account code',
    approve: 'Approve', deskFoot: "No significant financial change is made without the accountant's approval.",
    k5: 'Three ideas, one product', h5: 'Aposkal’s next step, with AI.',
    cat1: 'Financial Intelligence', sum1: 'Monthly financial analysis', sum1s: 'A ready report for the business owner every month',
    cat2: 'AI Connectivity', sum2s: 'Aposkal data inside AI assistants',
    cat3: 'Accounting Automation', sum3: 'AI closing copilot', sum3s: 'A prioritized worklist for the accountant',
    sumNote: 'Three complementary ideas; each can start on its own.',
    brandsLabel: 'SOHA and Aposkal', h6: "Let's build it together.",
    lede6: "Let's explore one of these ideas for Aposkal together.",
    cta6: '15-minute call', sohaLink: 'About SOHA →',
    disclaimer: 'This presentation was prepared independently by SOHA and does not imply an official partnership with Aposkal. Figures on screen are fictional sample data.',
    mailHref: 'mailto:reza.tz780210@gmail.com?subject=Aposkal%20%C3%97%20SOHA%20%E2%80%94%2015-minute%20call&body=Hello%20SOHA%20team%2C%0A%0AWe%27d%20like%20to%20discuss%20the%20ideas%20you%20prepared%20for%20Aposkal%20in%20a%2015-minute%20call.%0A',
  };
  const TR = { title: document.title, avg: 'Ort.' };           // the rest is read from the page
  const MONTHS = {
    tr: ['Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki'],
    en: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  };
  $$('[data-i18n]').forEach((el) => { TR[el.dataset.i18n] ??= el.textContent; });
  $$('[data-i18n-html]').forEach((el) => { TR[el.dataset.i18nHtml] ??= el.innerHTML; });
  $$('[data-i18n-attr]').forEach((el) => el.dataset.i18nAttr.split(';').forEach((pair) => {
    const [attr, key] = pair.split(':'); TR[key] ??= el.getAttribute(attr);
  }));
  let lang = 'tr';
  const t = (key) => (lang === 'en' ? EN[key] : TR[key]) ?? TR[key] ?? key;

  const applyLang = (next, { remember = true } = {}) => {
    lang = next === 'en' ? 'en' : 'tr';
    root.lang = lang;
    document.title = t('title');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-attr]').forEach((el) => el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':'); el.setAttribute(attr, t(key));
    }));
    $$('.lang [data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    drawChart();
    if (remember) {
      try { localStorage.setItem('soha-aposkal-lang', lang); } catch (e) { /* private mode */ }
      const url = new URL(location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    }
  };
  $$('.lang [data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* ---------------- sample chart (fictional, ₺ thousands, Nov → Oct) ---------------- */
  const VALUES = [248, 262, 231, 255, 270, 282, 276, 291, 305, 298, 350, 413];
  const svg = $('.bars');
  const axis = $('.bars-x');
  const SVG = 'http://www.w3.org/2000/svg';
  function drawChart() {
    if (!svg) return;
    const W = 300, H = 120, top = 10, max = Math.max(...VALUES);
    const slot = W / VALUES.length, bw = slot * .58;
    const y = (v) => H - (v / max) * (H - top);
    const seen = $('#s2').classList.contains('is-seen');
    svg.replaceChildren();
    VALUES.forEach((v, i) => {
      const r = document.createElementNS(SVG, 'rect');
      r.setAttribute('class', 'bar' + (i === VALUES.length - 1 ? ' is-last' : ''));
      r.setAttribute('x', (i * slot + (slot - bw) / 2).toFixed(1));
      r.setAttribute('y', y(v).toFixed(1));
      r.setAttribute('width', bw.toFixed(1));
      r.setAttribute('height', (H - y(v)).toFixed(1));
      r.setAttribute('rx', '3');
      r.style.transitionDelay = seen ? '0s' : `${(i * 0.04).toFixed(2)}s`;
      svg.appendChild(r);
    });
    const prev = VALUES.slice(0, -1), avg = prev.reduce((a, b) => a + b, 0) / prev.length;
    const g = document.createElementNS(SVG, 'g');
    g.setAttribute('class', 'anno');
    const line = document.createElementNS(SVG, 'line');
    line.setAttribute('x1', '0'); line.setAttribute('x2', String(W));
    line.setAttribute('y1', y(avg).toFixed(1)); line.setAttribute('y2', y(avg).toFixed(1));
    const label = document.createElementNS(SVG, 'text');
    label.setAttribute('x', '2'); label.setAttribute('y', (y(avg) - 4).toFixed(1));
    label.textContent = t('avg');
    g.append(line, label);
    svg.appendChild(g);
    if (axis) axis.replaceChildren(...MONTHS[lang].map((m) => Object.assign(document.createElement('span'), { textContent: m })));
  }

  /* ---------------- Idea 1: today vs proposed ---------------- */
  const phone = $('.phone');
  let phoneTouched = false;
  const setView = (view) => {
    if (!phone) return;
    phone.dataset.view = view;
    $$('.seg [data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  };
  $$('.seg [data-view]').forEach((b) => b.addEventListener('click', () => { phoneTouched = true; setView(b.dataset.view); }));
  if (!reduce) setView('today');           // start from today's screen, then show the proposal

  /* ---------------- Idea 2: capability → API group ---------------- */
  const arch = $('.stage--arch');
  const caps = $$('.caps [data-cap]');
  let capTimer = 0, capTouched = false, capIndex = -1;
  const setCap = (cap) => {
    if (!arch) return;
    if (cap) arch.dataset.cap = cap; else delete arch.dataset.cap;
    caps.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cap === cap)));
  };
  caps.forEach((b) => {
    b.addEventListener('click', () => { capTouched = true; stopCaps(); setCap(arch.dataset.cap === b.dataset.cap ? null : b.dataset.cap); });
    b.addEventListener('mouseenter', () => { if (!capTouched) { stopCaps(); setCap(b.dataset.cap); } });
    b.addEventListener('focus', () => { if (!capTouched) { stopCaps(); setCap(b.dataset.cap); } });
  });
  const startCaps = () => {
    if (reduce || capTouched || capTimer) return;
    capTimer = setInterval(() => { capIndex = (capIndex + 1) % caps.length; setCap(caps[capIndex].dataset.cap); }, 2600);
  };
  const stopCaps = () => { clearInterval(capTimer); capTimer = 0; };

  /* ---------------- Idea 3: the assistant organises, the accountant approves ---------------- */
  const list = $('.tasks');
  const tasks = $$('.task');
  const counts = { found: 0, reviewed: 0, approved: 0 };
  const total = tasks.reduce((n, el) => n + Number(el.dataset.count), 0);
  const setState = (task, state) => {
    task.dataset.state = state;
    const chip = $('.state', task);
    const key = { found: 'stFound', reviewed: 'stReviewed', approved: 'stApproved' }[state];
    chip.dataset.i18n = key;
    chip.textContent = t(key);
  };
  const renderCounts = () => {
    counts.found = total;
    counts.reviewed = tasks.filter((x) => x.dataset.state !== 'found').reduce((n, x) => n + Number(x.dataset.count), 0);
    counts.approved = tasks.filter((x) => x.dataset.state === 'approved').reduce((n, x) => n + Number(x.dataset.count), 0);
    $$('[data-n]').forEach((b) => { b.textContent = counts[b.dataset.n]; });
  };
  tasks.forEach((task) => {
    setState(task, reduce ? 'reviewed' : 'found');
    $('.approve', task).addEventListener('click', () => { setState(task, 'approved'); renderCounts(); });
  });
  if (!reduce && list) {                     // shuffle so the sorting can be seen
    const order = [tasks[2], tasks[0], tasks[1]];
    order.forEach((el) => list.appendChild(el));
  }
  renderCounts();
  tasks[0]?.classList.add('is-top');

  let deskPlayed = reduce;
  const playDesk = () => {
    if (deskPlayed || !list) return;
    deskPlayed = true;
    setTimeout(() => {
      const first = new Map(tasks.map((el) => [el, el.getBoundingClientRect().top]));
      [...tasks].sort((a, b) => a.dataset.prio - b.dataset.prio).forEach((el) => list.appendChild(el));
      tasks.forEach((el) => {
        const dy = first.get(el) - el.getBoundingClientRect().top;
        if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
      });
      [...tasks].sort((a, b) => a.dataset.prio - b.dataset.prio).forEach((el, i) => {
        setTimeout(() => { setState(el, 'reviewed'); renderCounts(); }, 800 + i * 450);
      });
    }, 700);
  };

  /* ---------------- slides: current slide, nav, progress ---------------- */
  const slides = $$('.slide');
  const dots = $$('.dots a');
  const now = $('#slide-now');
  const bar = $('#progress-bar');
  let current = 0;
  const setCurrent = (i) => {
    current = i;
    dots.forEach((d, n) => (n === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    if (now) now.textContent = String(i + 1).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${slides.length > 1 ? i / (slides.length - 1) : 1})`;
    document.body.dataset.ui = slides[i].dataset.theme || 'dark';
    if (slides[i].id === 's3') startCaps(); else stopCaps();
  };
  const markSeen = (slide) => { slide.classList.add('is-seen'); };
  // Demos start when their own mockup is on screen (on phones it sits below the text).
  const playPhone = () => { if (!phoneTouched) setTimeout(() => { if (!phoneTouched) setView('ai'); }, 1100); };

  if ('IntersectionObserver' in window) {
    // current = the slide crossing the middle of the viewport
    const mid = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) setCurrent(slides.indexOf(e.target));
    }), { rootMargin: '-50% 0px -50% 0px' });
    const seen = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) markSeen(e.target);
    }), { threshold: 0.2 });
    slides.forEach((s) => { mid.observe(s); seen.observe(s); });
    const demos = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      demos.unobserve(e.target);
      if (e.target === phone) playPhone(); else playDesk();
    }), { threshold: 0.45 });
    if (!reduce) [phone, $('.desk')].forEach((el) => el && demos.observe(el));
  } else {
    slides.forEach(markSeen);
    if (!reduce) { setView('ai'); playDesk(); }
  }
  if (reduce) slides.forEach(markSeen);

  const go = (i) => {
    const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    const next = ['ArrowDown', 'ArrowRight', 'PageDown'];
    const prev = ['ArrowUp', 'ArrowLeft', 'PageUp'];
    if (next.includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (prev.includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
  });

  /* ---------------- start ---------------- */
  let initial = 'tr';
  try {
    const param = new URL(location.href).searchParams.get('lang');
    initial = param || localStorage.getItem('soha-aposkal-lang') || 'tr';
  } catch (e) { /* defaults to Turkish */ }
  applyLang(initial, { remember: false });
  setCurrent(0);
})();
