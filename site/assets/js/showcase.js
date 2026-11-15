// Soha — "Agents in action" showcase: tabs, timeline engine and the in-product agent.
//
// Each scene is a client product ("device"). The Soha agent appears INSIDE it as a
// small cursor with a label, moving to whatever it is working on.
//
// Timing attributes (fractions of one loop):
//   data-in="t" [data-out="t"]   fade/slide in at t, stay, fade out near the end
//   data-show="a b"              visible only between a and b (typing dots, scan lines)
//   data-draw="a b"              SVG stroke draws itself (element needs pathLength="1")
//   data-grow="a b"              grows from the start edge (bars, filled fields)
//   data-sweep="a b [up]"        moves top → bottom of its parent ("up": bottom → top)
//   data-press="t"               button press bump (human approval)
//   data-focus="a b [| a b]"     the agent works on this element between a and b:
//   data-say="text [| text]"       cursor moves here, element gets a ring, label shows text
//   data-anchor="end"            park the cursor at the element's end side (default: start)
// Base CSS is the final frame, so reduced-motion and no-JS visitors see it.
(() => {
  const root = document.querySelector('.showcase');
  if (!root) return;

  const tablist = root.querySelector('[role="tablist"]');
  const tabs = [...root.querySelectorAll('[role="tab"]')]
    .filter((t) => document.getElementById(t.getAttribute('aria-controls')));
  const scenes = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
  const box = root.querySelector('.scenes');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const logoSrc = document.querySelector('.brand-mark')?.getAttribute('src') || 'assets/img/logo-mark.png';
  const D = 10000;              // one loop, ms
  const OUT = 0.93, GONE = 0.97;
  const MOVE = 0.035;           // cursor travel time between targets
  const EASE = 'cubic-bezier(.2,.7,.2,1)';

  let current = -1;
  let anims = [];
  let progress = null;
  let userPicked = false;
  let inView = false;

  const nums = (v) => String(v).trim().split(/\s+/).map(Number);
  const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
  const frames = (pairs) => {          // monotonic offsets, per-segment easing
    let last = 0;
    return pairs.map(([o, p]) => {
      const offset = Math.max(last, clamp(o));
      last = offset;
      return { offset, easing: EASE, ...p };
    });
  };
  const play = (el, kf) => {
    const a = el.animate(kf, { duration: D, iterations: Infinity });
    anims.push(a);
    return a;
  };
  const px = (n) => `${n.toFixed(1)}px`;

  // ---------- the in-product agent (cursor + label + focus rings) ----------
  const rel = (el, box) => {           // layout box inside `box`, ignoring transforms
    let x = 0, y = 0;
    for (let n = el; n && n !== box; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight, w: el.offsetWidth, h: el.offsetHeight };
  };

  const agentFor = (scene) => {        // build the DOM once per scene
    if (scene._agent) return scene._agent;
    const area = scene.querySelector('.device-area');
    const segs = [];
    const rings = [];
    scene.querySelectorAll('[data-focus]').forEach((el) => {
      const times = el.dataset.focus.split('|').map(nums);
      const says = (el.dataset.say || '').split('|').map((s) => s.trim());
      const ring = document.createElement('span');
      ring.className = 'soha-ring';
      ring.setAttribute('aria-hidden', 'true');
      ring._target = el;
      rings.push(ring);
      times.forEach(([a, b], k) => segs.push({ el, ring, a, b, say: says[k] ?? says[says.length - 1] }));
    });
    segs.sort((p, q) => p.a - q.a);

    const chip = document.createElement('div');
    chip.className = 'soha-cursor';
    chip.setAttribute('aria-hidden', 'true');
    chip.innerHTML = '<svg class="soha-arrow" viewBox="0 0 16 16"><path d="M1.5 1.5v11.6l3.2-3 2.3 5.2 2.2-1-2.3-5.1h4.5z"/></svg>'
      + `<span class="soha-pill"><img src="${logoSrc}" alt=""><b>سها</b><span class="soha-say"></span></span>`;
    const say = chip.querySelector('.soha-say');
    segs.forEach((s) => {
      s.span = document.createElement('span');
      s.span.textContent = s.say;
      say.appendChild(s.span);
    });
    rings.forEach((r) => area.appendChild(r));
    area.appendChild(chip);
    scene._agent = { area, chip, say, segs, rings, ready: false };
    return scene._agent;
  };

  // Measure targets and place rings; compute where the cursor sits for each step.
  const layoutAgent = (scene) => {
    const ag = agentFor(scene);
    const { area, chip, say, segs, rings } = ag;
    ag.ready = false;
    if (!segs.length || !area.offsetWidth) return ag;

    const rtl = getComputedStyle(area).direction === 'rtl';
    const em = parseFloat(getComputedStyle(chip).fontSize);
    const W = area.offsetWidth, H = area.offsetHeight;

    rings.forEach((r) => {
      const t = rel(r._target, area);
      const pad = em * 0.45;
      Object.assign(r.style, { left: px(t.l - pad), top: px(t.t - pad), width: px(t.w + 2 * pad), height: px(t.h + 2 * pad) });
    });

    say.style.width = 'auto';
    const box = (el) => el.getBoundingClientRect().width;   // fractional widths
    const sayW = say.clientWidth - parseFloat(getComputedStyle(say).paddingInlineStart), chipW = box(chip), chipH = chip.offsetHeight;
    segs.forEach((s) => {
      const t = rel(s.el, area);
      s.w = Math.ceil(box(s.span)) + 1;
      const cw = chipW - sayW + s.w;               // chip width while showing this text
      // cursor tip just inside the target's bottom corner (start side unless data-anchor="end");
      // the label hangs below it
      const inset = Math.min(t.w * 0.3, em * 2.2);
      const atRight = rtl !== (s.el.dataset.anchor === 'end');
      const tipX = atRight ? t.r - inset : t.l + inset;
      const tipY = t.b - Math.min(t.h * 0.3, em * 0.9);
      s.x = clamp(rtl ? tipX - cw : tipX, 0, Math.max(0, W - cw));
      s.y = clamp(tipY, 0, Math.max(0, H - chipH));
    });

    // final frame (reduced motion / before animations start)
    const last = segs[segs.length - 1];
    chip.style.transform = `translate(${px(last.x)}, ${px(last.y)})`;
    chip.style.opacity = '1';
    say.style.width = px(last.w);
    ag.ready = true;
    return ag;
  };

  const animateAgent = (ag) => {
    if (!ag || !ag.ready) return;
    const { chip, say, segs, rings } = ag;
    const first = segs[0], last = segs[segs.length - 1];
    const at = (s, o) => ({ transform: `translate(${px(s.x)}, ${px(s.y)})`, opacity: o });

    const move = [[0, at(first, 0)], [first.a - 0.03, at(first, 0)], [first.a, at(first, 1)]];
    const width = [[0, { width: px(first.w) }], [first.a, { width: px(first.w) }]];
    segs.slice(1).forEach((s, i) => {
      const prev = segs[i];
      move.push([s.a - MOVE, at(prev, 1)], [s.a, at(s, 1)]);
      width.push([s.a - MOVE, { width: px(prev.w) }], [s.a, { width: px(s.w) }]);
    });
    move.push([OUT, at(last, 1)], [OUT + 0.04, at(last, 0)], [1, at(last, 0)]);
    width.push([1, { width: px(last.w) }]);
    play(chip, frames(move));
    play(say, frames(width));

    segs.forEach((s, i) => {                       // label text cross-fades per step
      const next = segs[i + 1];
      const on = i ? s.a - 0.02 : first.a - 0.03;
      const off = next ? next.a - 0.02 : OUT + 0.04;
      play(s.span, frames([[0, { opacity: 0 }], [on, { opacity: 0 }], [on + 0.015, { opacity: 1 }],
        [off, { opacity: 1 }], [off + 0.015, { opacity: 0 }], [1, { opacity: 0 }]]));
    });

    rings.forEach((r) => {                         // ring on while its element is in focus
      const spans = [];
      segs.filter((s) => s.ring === r).forEach((s) => {
        const prev = spans[spans.length - 1];
        if (prev && s.a - prev[1] < 0.03) prev[1] = s.b; else spans.push([s.a, s.b]);
      });
      const kf = [[0, { opacity: 0 }]];
      spans.forEach(([a, b]) => kf.push([a - 0.015, { opacity: 0 }], [a + 0.005, { opacity: 1 }],
        [b - 0.01, { opacity: 1 }], [b + 0.01, { opacity: 0 }]));
      kf.push([1, { opacity: 0 }]);
      play(r, frames(kf));
    });
  };

  // ---------- timeline ----------
  const build = (scene) => {
    const q = (sel, fn) => scene.querySelectorAll(sel).forEach(fn);

    q('[data-in]', (el) => {
      const t = +el.dataset.in;
      const out = el.dataset.out ? +el.dataset.out : OUT;
      const hid = { opacity: 0, transform: 'translateY(.5em)' };
      const vis = { opacity: 1, transform: 'none' };
      const gone = { opacity: 0, transform: 'none' };
      play(el, frames([[0, hid], [t - 0.05, hid], [t, vis], [out, vis], [out + 0.04, gone], [1, gone]]));
    });

    q('[data-show]', (el) => {
      const [a, b] = nums(el.dataset.show);
      play(el, frames([[0, { opacity: 0 }], [a - 0.02, { opacity: 0 }], [a, { opacity: 1 }],
        [b, { opacity: 1 }], [b + 0.02, { opacity: 0 }], [1, { opacity: 0 }]]));
    });

    q('[data-draw]', (el) => {
      const [a, b] = nums(el.dataset.draw);
      play(el, frames([[0, { strokeDashoffset: 1, opacity: 1 }], [a, { strokeDashoffset: 1, opacity: 1 }],
        [b, { strokeDashoffset: 0, opacity: 1 }], [OUT, { strokeDashoffset: 0, opacity: 1 }],
        [GONE, { strokeDashoffset: 0, opacity: 0 }], [1, { strokeDashoffset: 1, opacity: 0 }]]));
    });

    q('[data-grow]', (el) => {
      const [a, b] = nums(el.dataset.grow);
      play(el, frames([[0, { transform: 'scaleX(0)', opacity: 1 }], [a, { transform: 'scaleX(0)', opacity: 1 }],
        [b, { transform: 'scaleX(1)', opacity: 1 }], [OUT, { transform: 'scaleX(1)', opacity: 1 }],
        [GONE, { transform: 'scaleX(1)', opacity: 0 }], [1, { transform: 'scaleX(0)', opacity: 0 }]]));
    });

    q('[data-sweep]', (el) => {
      const [a, b] = nums(el.dataset.sweep);
      const up = /\bup\b/.test(el.dataset.sweep);   // "a b up" moves bottom → top
      const [from, to] = up ? ['100%', '0%'] : ['0%', '100%'];
      play(el, frames([[0, { top: from, opacity: 0 }], [a - 0.01, { top: from, opacity: 0 }],
        [a, { top: from, opacity: 1 }], [b, { top: to, opacity: 1 }],
        [b + 0.02, { top: to, opacity: 0 }], [1, { top: to, opacity: 0 }]]));
    });

    q('[data-press]', (el) => {
      const t = +el.dataset.press;
      const n = { transform: 'scale(1)' };
      play(el, frames([[0, n], [t - 0.015, n], [t, { transform: 'scale(.9)' }], [t + 0.015, n], [1, n]]));
    });

    animateAgent(scene._agent);
  };

  // ---------- playback ----------
  const sync = () => {
    const run = inView && !document.hidden;
    [...anims, progress].forEach((a) => a && (run ? a.play() : a.pause()));
  };

  const stop = () => { anims.forEach((a) => a.cancel()); anims = []; };

  const scrollTabIntoView = (tab) => {
    if (tablist.scrollWidth <= tablist.clientWidth + 1) return;
    const tl = tablist.getBoundingClientRect(), tr = tab.getBoundingClientRect();
    tablist.scrollBy({ left: (tr.left + tr.width / 2) - (tl.left + tl.width / 2), behavior: reduce.matches ? 'auto' : 'smooth' });
  };

  const select = (i, { focus = false, force = false } = {}) => {
    if (i === current && !force) return;
    stop();
    if (progress) progress.cancel();
    progress = null;

    tabs.forEach((t, n) => {
      const on = n === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      scenes[n].hidden = !on;
      scenes[n].toggleAttribute('data-active', on);
    });
    current = i;
    if (focus) tabs[i].focus();
    scrollTabIntoView(tabs[i]);

    const scene = scenes[i];
    layoutAgent(scene);
    if (reduce.matches) return;

    build(scene);
    progress = tabs[i].querySelector('.tab-progress').animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: D, iterations: userPicked ? Infinity : 1 });
    progress.onfinish = () => { if (!userPicked) select((i + 1) % tabs.length); };
    sync();
  };

  // Layout changed (resize, fonts): re-measure and rebuild, keeping the playhead.
  let pending = 0;
  const relayout = () => {
    pending = 0;
    if (current < 0) return;
    const t = progress ? progress.currentTime : null;
    stop();
    const scene = scenes[current];
    layoutAgent(scene);
    if (reduce.matches) return;
    build(scene);
    if (t != null) anims.forEach((a) => { a.currentTime = t; });
    sync();
  };
  const queueRelayout = () => { if (!pending) pending = requestAnimationFrame(relayout); };

  tabs.forEach((t, n) => t.addEventListener('click', () => {
    userPicked = true;
    select(n, { force: n !== current });
  }));

  tablist.addEventListener('keydown', (e) => {
    const rtl = getComputedStyle(tablist).direction === 'rtl';
    const last = tabs.length - 1;
    let i;
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) i = current === last ? 0 : current + 1;
    else if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) i = current === 0 ? last : current - 1;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = last;
    else return;
    e.preventDefault();
    userPicked = true;
    select(i, { focus: true });
  });

  if ('IntersectionObserver' in window) {
    // play only when a meaningful part of the scene is on screen (not on a 1px sliver)
    new IntersectionObserver(([entry]) => { inView = entry.intersectionRatio >= 0.2; sync(); }, { threshold: [0, 0.2, 0.5] }).observe(box);
  } else {
    inView = true;
  }
  document.addEventListener('visibilitychange', sync);
  if ('ResizeObserver' in window) new ResizeObserver(queueRelayout).observe(box);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueRelayout);
  reduce.addEventListener?.('change', () => select(current, { force: true }));

  select(0);
})();
