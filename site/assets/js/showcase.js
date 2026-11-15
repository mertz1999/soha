// Soha — "Agents in action" showcase: tabs, timeline engine and wires.
//
// Each scene is described in HTML with timing attributes (fractions of one loop):
//   data-in="t" [data-out="t"]   fade/slide in at t, stay, fade out near the end
//   data-show="a b"              visible only between a and b (typing dots, scan lines)
//   data-draw="a b"              SVG stroke draws itself (element needs pathLength="1")
//   data-grow="a b"              grows from the start edge (bars, filled fields)
//   data-sweep="a b [up]"        moves top → bottom of its parent ("up": bottom → top)
//   data-done="t"                agent step gets its check mark at t
//   data-press="t"               button press bump (human approval)
//   data-wire="in|out" data-pulse="a b"   wire to the agent; pulse travels in/out
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
  const SVG = 'http://www.w3.org/2000/svg';
  const D = 10000;              // one loop, ms
  const OUT = 0.93, GONE = 0.97;
  const EASE = 'cubic-bezier(.2,.7,.2,1)';

  let current = -1;
  let anims = [];
  let progress = null;
  let userPicked = false;
  let inView = false;

  const nums = (v) => String(v).trim().split(/\s+/).map(Number);
  const clamp = (x) => Math.min(1, Math.max(0, x));
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

    q('[data-done]', (li) => {
      const t = +li.dataset.done;
      play(li, frames([[0, { opacity: 0.5 }], [t - 0.02, { opacity: 0.5 }], [t, { opacity: 1 }],
        [OUT, { opacity: 1 }], [GONE, { opacity: 0.5 }], [1, { opacity: 0.5 }]]));
      const check = li.querySelector('.check');
      if (check) {
        const off = { opacity: 0, transform: 'scale(.4)' };
        const on = { opacity: 1, transform: 'scale(1)' };
        play(check, frames([[0, off], [t - 0.02, off], [t, on], [OUT, on], [GONE, { opacity: 0, transform: 'scale(1)' }], [1, off]]));
      }
    });

    q('[data-press]', (el) => {
      const t = +el.dataset.press;
      const n = { transform: 'scale(1)' };
      play(el, frames([[0, n], [t - 0.015, n], [t, { transform: 'scale(.9)' }], [t + 0.015, n], [1, n]]));
    });

    q('[data-pulse]', (el) => {
      const pulse = el._sohaPulse;
      if (!pulse) return;
      const [a, b] = nums(el.dataset.pulse);
      play(pulse, frames([[0, { strokeDashoffset: 0.12, opacity: 0 }], [a - 0.001, { strokeDashoffset: 0.12, opacity: 0 }],
        [a, { strokeDashoffset: 0.12, opacity: 1 }], [b, { strokeDashoffset: -1, opacity: 1 }],
        [b + 0.001, { strokeDashoffset: -1, opacity: 0 }], [1, { strokeDashoffset: -1, opacity: 0 }]]));
    });
  };

  // ---------- wires ----------
  const rel = (el, stage) => {          // position in the stage, ignoring transforms
    let x = 0, y = 0;
    for (let n = el; n && n !== stage; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
  };
  const mk = (tag, cls, parent) => {
    const n = document.createElementNS(SVG, tag);
    n.setAttribute('class', cls);
    parent.appendChild(n);
    return n;
  };
  const f = (n) => n.toFixed(1);

  const drawWires = (scene) => {
    const stage = scene.querySelector('.stage');
    const svg = scene.querySelector('.wires');
    const card = scene.querySelector('.agent-card');
    const core = scene.querySelector('.agent-core');
    const device = scene.querySelector('.device');
    if (!stage || !svg || !card || !device || !stage.offsetWidth) return;

    svg.setAttribute('viewBox', `0 0 ${stage.offsetWidth} ${stage.offsetHeight}`);
    const c = rel(card, stage), k = rel(core, stage), d = rel(device, stage);
    const stacked = c.b <= d.t + 1;    // phones: card above device
    const deviceRight = d.cx > c.cx;

    let hub;
    if (stacked) hub = { x: k.cx, y: c.b };
    else hub = { x: deviceRight ? c.r : c.l, y: k.cy };

    if (!svg._sohaHub) svg._sohaHub = mk('circle', 'wire-hub', svg);
    svg._sohaHub.setAttribute('cx', f(hub.x));
    svg._sohaHub.setAttribute('cy', f(hub.y));
    svg._sohaHub.setAttribute('r', '4.5');

    scene.querySelectorAll('[data-wire]').forEach((el) => {
      const t = rel(el, stage);
      let end, geo;
      if (stacked) {
        end = { x: Math.min(d.r - 12, Math.max(d.l + 12, t.cx)), y: d.t };
        const dy = (end.y - hub.y) * 0.55;
        geo = (p, q) => `M${f(p.x)} ${f(p.y)}C${f(p.x)} ${f(p.y + (q.y > p.y ? dy : -dy))} ${f(q.x)} ${f(q.y + (q.y > p.y ? -dy : dy))} ${f(q.x)} ${f(q.y)}`;
      } else {
        end = { x: deviceRight ? d.l : d.r, y: Math.min(d.b - 12, Math.max(d.t + 12, t.cy)) };
        const dx = (end.x - hub.x) * 0.5;
        geo = (p, q) => `M${f(p.x)} ${f(p.y)}C${f(p.x + (q.x > p.x ? Math.abs(dx) : -Math.abs(dx)))} ${f(p.y)} ${f(q.x + (q.x > p.x ? -Math.abs(dx) : Math.abs(dx)))} ${f(q.y)} ${f(q.x)} ${f(q.y)}`;
      }
      if (!el._sohaWire) {
        el._sohaWire = mk('path', 'wire', svg);
        el._sohaPulse = mk('path', 'wire-pulse', svg);
        el._sohaPulse.setAttribute('pathLength', '1');
        el._sohaNode = mk('circle', 'wire-node', svg);
        el._sohaNode.setAttribute('r', '3.5');
        svg.appendChild(svg._sohaHub);        // keep the hub on top
      }
      const inward = el.dataset.wire === 'in';
      el._sohaWire.setAttribute('d', geo(hub, end));
      el._sohaPulse.setAttribute('d', inward ? geo(end, hub) : geo(hub, end));
      el._sohaNode.setAttribute('cx', f(end.x));
      el._sohaNode.setAttribute('cy', f(end.y));
    });
  };

  // ---------- playback ----------
  const sync = () => {
    const run = inView && !document.hidden;
    [...anims, progress].forEach((a) => a && (run ? a.play() : a.pause()));
  };

  const scrollTabIntoView = (tab) => {
    if (tablist.scrollWidth <= tablist.clientWidth + 1) return;
    const tl = tablist.getBoundingClientRect(), tr = tab.getBoundingClientRect();
    tablist.scrollBy({ left: (tr.left + tr.width / 2) - (tl.left + tl.width / 2), behavior: reduce.matches ? 'auto' : 'smooth' });
  };

  const select = (i, { focus = false, force = false } = {}) => {
    if (i === current && !force) return;
    anims.forEach((a) => a.cancel());
    anims = [];
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
    drawWires(scene);
    if (reduce.matches) return;

    build(scene);
    progress = tabs[i].querySelector('.tab-progress').animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: D, iterations: userPicked ? Infinity : 1 });
    progress.onfinish = () => { if (!userPicked) select((i + 1) % tabs.length); };
    sync();
  };

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
  if ('ResizeObserver' in window) new ResizeObserver(() => current >= 0 && drawWires(scenes[current])).observe(box);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => current >= 0 && drawWires(scenes[current]));
  reduce.addEventListener?.('change', () => select(current, { force: true }));

  select(0);
})();
