/* =========================================================
   CREMA — generative hero animation
   Thousands of particles drift through a flow field like
   steamed milk folding into espresso. Moving the pointer
   "stirs" the cup: particles swirl around it.
   Colors come from CSS variables, so day/night re-tints it.
   ========================================================= */
(function () {
  const canvas = document.querySelector("[data-crema]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0, h = 0, dpr = 1, particles = [], palette = [], bg = "#000";
  let t = 0, raf = 0, visible = true;
  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

  // --- small, fast value-noise for the flow field ---
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  const fade = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, k) => a + (b - a) * k;
  const hash = (x, y) => perm[(perm[x & 255] + y) & 511] / 255;
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = fade(xf), v = fade(yf);
    return lerp(lerp(hash(xi, yi), hash(xi + 1, yi), u), lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u), v);
  }

  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    bg = cs.getPropertyValue("--bg").trim() || "#1b1410";
    palette = ["--particle-a", "--particle-b", "--particle-c"].map((v) => cs.getPropertyValue(v).trim() || "214,170,62");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(1400, (w * h) / (w < 700 ? 900 : 650)));
    particles = Array.from({ length: count }, spawn);
    readTheme();
  }

  function spawn() {
    return {
      x: Math.random() * w, y: Math.random() * h,
      vx: 0, vy: 0,
      life: Math.random() * 300 + 100,
      c: Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 1 : 2,
      s: Math.random() * 1.2 + 0.4
    };
  }

  function step() {
    t += 0.0022;
    // translucent wash = soft motion trails
    ctx.globalAlpha = 0.085;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    const scale = 0.0021;
    const stirR = Math.max(140, Math.min(w, h) * 0.28);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const a = noise(p.x * scale + t, p.y * scale - t * 0.6) * Math.PI * 4;
      p.vx += Math.cos(a) * 0.09;
      p.vy += Math.sin(a) * 0.09;

      // stirring: tangential force around the pointer, plus a little drag along
      if (pointer.active) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < stirR * stirR) {
          const d = Math.sqrt(d2) + 0.001;
          const f = (1 - d / stirR) * 1.4;
          p.vx += (-dy / d) * f + pointer.vx * 0.02 * f;
          p.vy += (dx / d) * f + pointer.vy * 0.02 * f;
        }
      }

      p.vx *= 0.92; p.vy *= 0.92;
      const px = p.x, py = p.y;
      p.x += p.vx; p.y += p.vy;
      p.life--;

      if (p.life < 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        Object.assign(p, spawn());
        continue;
      }
      const speed = Math.min(1, Math.hypot(p.vx, p.vy) / 3);
      ctx.strokeStyle = `rgba(${palette[p.c]}, ${0.32 + speed * 0.6})`;
      ctx.lineWidth = p.s;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    pointer.vx *= 0.85; pointer.vy *= 0.85;
  }

  function loop() {
    if (!visible) return;
    step();
    raf = requestAnimationFrame(loop);
  }

  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (pointer.active) { pointer.vx = x - pointer.x; pointer.vy = y - pointer.y; }
    pointer.x = x; pointer.y = y;
    pointer.active = y > -50 && y < r.height + 50;
  }

  resize();
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); if (!reduce) loop(); else for (let i = 0; i < 160; i++) step(); });
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", () => (pointer.active = false));
  document.addEventListener("themechange", readTheme);

  // pause when the hero is off screen to save battery
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !reduce) { cancelAnimationFrame(raf); loop(); }
  }).observe(canvas);

  if (reduce) {
    for (let i = 0; i < 160; i++) step();   // render a still frame
  } else {
    loop();
  }
})();
