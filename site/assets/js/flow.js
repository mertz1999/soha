// Soha — "how we work" diagram (the #process section).
// A spark travels the client journey: each step lights up as it arrives, the
// decision gate between two steps ticks ("your approval"), and after support the
// spark rides a loop back to step 1 — the next opportunity.
// The page works without this file: base CSS shows the finished journey.
(() => {
  const flow = document.querySelector('.flow');
  if (!flow || !flow.animate) return;

  const steps = [...flow.querySelectorAll('.flow-step')];
  if (steps.length < 2) return;
  const nodes = steps.map((s) => s.querySelector('.flow-node'));
  const cards = steps.map((s) => s.querySelector('.flow-card'));
  const gates = steps.map((s) => s.querySelector('.flow-gate')).filter(Boolean);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const D = 15000;                          // one loop, ms
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  const T = [0.05, 0.2, 0.35, 0.5, 0.65];   // spark arrives at each step
  const TRAVEL = 0.075;                     // time between two steps
  const LOOP_A = 0.72, LOOP_B = 0.84;       // ride the loop back to step 1
  const END = 0.93;                         // fade out, then start again

  const C = {                               // literal colours (WAAPI-friendly)
    nodeOff: '#E5DACA', nodeOn: '#1D2B64', numOff: '#8A8FA3', numOn: '#FBF8F3',
    gateOff: '#D8CCB7', gateOn: '#078E68',
  };

  // ---------- decorative layers ----------
  const SVG = 'http://www.w3.org/2000/svg';
  const mk = (tag, cls, parent, ns) => {
    const el = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    el.setAttribute('class', cls);
    el.setAttribute('aria-hidden', 'true');
    parent.appendChild(el);
    return el;
  };
  const rail = mk('span', 'flow-rail', flow);
  const fill = mk('span', 'flow-fill', rail);
  const loop = mk('svg', 'flow-loop', flow, SVG);
  loop.innerHTML = '<defs><marker id="flow-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
    + '<path class="flow-loop-head" d="M1 1 9 5 1 9z"/></marker></defs>';
  const loopPath = mk('path', 'flow-loop-path', loop, SVG);
  loopPath.setAttribute('marker-end', 'url(#flow-head)');
  const comet = mk('path', 'flow-loop-comet', loop, SVG);
  comet.setAttribute('pathLength', '1');
  const loopLabel = mk('span', 'flow-loop-label', flow);
  loopLabel.textContent = flow.dataset.loopLabel || '↺ فرصت بعدی';
  const spark = mk('span', 'flow-spark', flow);
  const pings = steps.map((s) => mk('span', 'flow-ping', s));

  // ---------- geometry ----------
  let geo = null;
  const px = (n) => `${n.toFixed(1)}px`;

  const layout = () => {
    const fr = flow.getBoundingClientRect();
    if (!fr.width) return false;
    const c = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left - fr.left + r.width / 2, y: r.top - fr.top + r.height / 2, r: r.height / 2 };
    });
    const a = c[0], b = c[c.length - 1];
    const horizontal = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);

    if (horizontal) {
      Object.assign(rail.style, { left: px(Math.min(a.x, b.x)), top: px(a.y - 1), width: px(Math.abs(b.x - a.x)), height: '2px' });
      fill.style.transformOrigin = a.x < b.x ? 'left center' : 'right center';
      // loop: from the last step, over the top, back down into step 1
      const top = Math.min(a.y, b.y) - a.r;
      const lift = Math.min(118, top + 20);
      const p0 = { x: b.x, y: b.y - b.r - 4 }, p3 = { x: a.x, y: a.y - a.r - 8 };
      const cy = top - lift;
      const d = `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C${p0.x.toFixed(1)} ${cy.toFixed(1)} ${p3.x.toFixed(1)} ${cy.toFixed(1)} ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;
      loop.setAttribute('viewBox', `0 0 ${fr.width.toFixed(1)} ${fr.height.toFixed(1)}`);
      loopPath.setAttribute('d', d);
      comet.setAttribute('d', d);
      const midY = 0.125 * p0.y + 0.75 * cy + 0.125 * p3.y;   // cubic at t = .5
      loopLabel.style.transform = `translate(${px((a.x + b.x) / 2)}, ${px(midY)}) translate(-50%, -50%)`;
    } else {
      Object.assign(rail.style, { left: px(a.x - 1), top: px(a.y), width: '2px', height: px(b.y - a.y) });
      fill.style.transformOrigin = 'center top';
    }
    loop.style.display = loopLabel.style.display = horizontal ? '' : 'none';
    const total = horizontal ? Math.abs(b.x - a.x) : b.y - a.y;
    const frac = c.map((p) => (horizontal ? Math.abs(p.x - a.x) : p.y - a.y) / total);
    geo = { c, horizontal, frac };
    return true;
  };

  // ---------- timeline ----------
  let anims = [];
  let started = false;
  let inView = false;

  const frames = (pairs) => {
    let last = 0;
    return pairs.map(([o, p]) => {
      const offset = Math.max(last, Math.min(1, Math.max(0, o)));
      last = offset;
      return { offset, easing: EASE, ...p };
    });
  };
  const play = (el, kf) => anims.push(el.animate(frames(kf), { duration: D, iterations: Infinity }));
  const stop = () => { anims.forEach((a) => a.cancel()); anims = []; };

  const build = () => {
    stop();
    if (reduce.matches || !layout()) return;
    const { c, horizontal, frac } = geo;
    const last = c.length - 1;
    const at = (i, o) => ({ transform: `translate(${px(c[i].x)}, ${px(c[i].y)}) translate(-50%, -50%)`, opacity: o });

    // spark: hop from step to step, then fade into the loop
    const sk = [[0, at(0, 0)], [T[0] - 0.02, at(0, 0)], [T[0], at(0, 1)]];
    for (let i = 1; i <= last; i++) sk.push([T[i] - TRAVEL, at(i - 1, 1)], [T[i], at(i, 1)]);
    sk.push([LOOP_A, at(last, 1)], [LOOP_A + 0.02, at(last, 0)], [1, at(last, 0)]);
    play(spark, sk);

    // progress fill follows the spark
    const sc = (f) => ({ transform: horizontal ? `scaleX(${f})` : `scaleY(${f})` });
    const fk = [[0, { ...sc(0), opacity: 1 }], [T[0], { ...sc(0), opacity: 1 }]];
    for (let i = 1; i <= last; i++) fk.push([T[i] - TRAVEL, sc(frac[i - 1])], [T[i], sc(frac[i])]);
    fk.push([END, { ...sc(1), opacity: 1 }], [END + 0.04, { ...sc(1), opacity: 0 }], [1, { ...sc(0), opacity: 0 }]);
    play(fill, fk);

    // steps light up on arrival; the current card lifts while the spark is there
    nodes.forEach((n, i) => {
      const off = { backgroundColor: C.nodeOff, color: C.numOff };
      const on = { backgroundColor: C.nodeOn, color: C.numOn };
      play(n, [[0, off], [T[i] - 0.004, off], [T[i] + 0.012, on], [END, on], [END + 0.04, off], [1, off]]);

      const ping = (t) => [[t - 0.002, { opacity: 0.9, transform: 'scale(.7)' }], [t + 0.06, { opacity: 0, transform: 'scale(1.9)' }]];
      const pk = [[0, { opacity: 0, transform: 'scale(.7)' }], ...ping(T[i])];
      if (i === 0 && horizontal) pk.push(...ping(LOOP_B));      // the loop lands back on step 1
      pk.push([1, { opacity: 0, transform: 'scale(.7)' }]);
      play(pings[i], pk);

      const until = i < last ? T[i + 1] - TRAVEL : LOOP_A;
      const rest = { transform: 'none', borderColor: 'rgba(29, 43, 100, .12)', boxShadow: '0 0 0 rgba(17, 26, 66, 0)' };
      const lift = { transform: 'translateY(-6px)', borderColor: 'rgba(7, 142, 104, .55)', boxShadow: '0 22px 40px -26px rgba(17, 26, 66, .45)' };
      play(cards[i], [[0, rest], [T[i] - 0.01, rest], [T[i] + 0.02, lift], [until, lift], [until + 0.025, rest], [1, rest]]);
    });

    // decision gates tick as the spark passes them
    gates.forEach((g, i) => {
      const t = T[i + 1] - TRAVEL / 2;
      const d = g.querySelector('.flow-diamond');
      const label = g.querySelector('.flow-gate-label');
      const off = { backgroundColor: C.gateOff, color: C.gateOff, transform: 'rotate(45deg) scale(1)' };
      const on = { backgroundColor: C.gateOn, color: '#fff', transform: 'rotate(45deg) scale(1)' };
      play(d, [[0, off], [t - 0.006, off], [t + 0.008, { ...on, transform: 'rotate(45deg) scale(1.45)' }],
        [t + 0.03, on], [END, on], [END + 0.04, off], [1, off]]);
      play(label, [[0, { opacity: 0.45 }], [t - 0.006, { opacity: 0.45 }], [t + 0.01, { opacity: 1 }],
        [END, { opacity: 1 }], [END + 0.04, { opacity: 0.45 }], [1, { opacity: 0.45 }]]);
    });

    // the loop back to step 1 (desktop only)
    if (horizontal) {
      play(comet, [[0, { strokeDashoffset: 0.06, opacity: 0 }], [LOOP_A, { strokeDashoffset: 0.06, opacity: 0 }],
        [LOOP_A + 0.01, { strokeDashoffset: 0.06, opacity: 1 }], [LOOP_B, { strokeDashoffset: -1, opacity: 1 }],
        [LOOP_B + 0.005, { strokeDashoffset: -1, opacity: 0 }], [1, { strokeDashoffset: -1, opacity: 0 }]]);
      const n = { transform: loopLabel.style.transform };
      const big = { transform: `${loopLabel.style.transform} scale(1.1)` };
      play(loopLabel, [[0, n], [(LOOP_A + LOOP_B) / 2 - 0.01, n], [(LOOP_A + LOOP_B) / 2 + 0.01, big], [(LOOP_A + LOOP_B) / 2 + 0.04, n], [1, n]]);
    }
    sync();
  };

  const sync = () => {
    const run = inView && !document.hidden;
    anims.forEach((a) => (run ? a.play() : a.pause()));
  };

  // Re-measure on layout changes, keeping the playhead.
  let pending = 0;
  const relayout = () => {
    pending = 0;
    const t = anims[0] ? anims[0].currentTime : 0;
    build();
    anims.forEach((a) => { a.currentTime = t; });
    sync();
  };
  const queue = () => { if (!pending) pending = requestAnimationFrame(relayout); };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      inView = e.intersectionRatio >= 0.25;
      if (inView && !started) { started = true; build(); }   // start from step 1 when first seen
      sync();
    }, { threshold: [0, 0.25, 0.5] }).observe(flow);
  } else {
    inView = true; started = true; build();
  }
  document.addEventListener('visibilitychange', sync);
  const remeasure = () => (started ? queue() : layout());   // keep the rail right even before it plays
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(flow);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  document.fonts?.addEventListener?.('loadingdone', remeasure);
  reduce.addEventListener?.('change', () => { if (started) build(); if (reduce.matches) layout(); });

  layout();   // rail + loop are visible in the final frame even before playing
})();
