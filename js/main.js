/* =========================================================
   KARAJILLO & CO. — MAIN
   ========================================================= */
(function () {
  const S = window.SITE, M = window.MENU, G = window.GALLERY, F = window.FINDER;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Links & text from data ---------- */
  $$("[data-link]").forEach((a) => { const k = a.dataset.link; if (S.links[k]) a.href = S.links[k]; });
  $$("[data-tel]").forEach((a) => (a.href = "tel:+1" + S.phone.replace(/\D/g, "")));
  $$('[data-text="instagramHandle"]').forEach((el) => (el.textContent = S.links.instagramHandle));
  $$('[data-text="hoursLabel"]').forEach((el) => (el.textContent = S.hours.label));
  const map = $("[data-map]");
  if (map) map.src = S.links.mapsEmbed;
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Reno local time & open status ---------- */
  function renoNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: S.hours.tz, hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (t) => +parts.find((p) => p.type === t).value;
    return { h: get("hour") % 24, m: get("minute") };
  }
  const fmt = (h) => (h % 12 || 12) + (h < 12 || h === 24 ? "am" : "pm");
  function updateStatus() {
    const { h, m } = renoNow();
    const open = h >= S.hours.open && h < S.hours.close;
    let msg;
    if (open) {
      const minsLeft = (S.hours.close - h) * 60 - m;
      msg = minsLeft <= 60 ? `Open, closing at ${fmt(S.hours.close)}` : `Open now, until ${fmt(S.hours.close)}`;
    } else {
      msg = `Closed, opens at ${fmt(S.hours.open)}`;
    }
    $$("[data-status]").forEach((el) => el.classList.toggle("is-open", open));
    $$("[data-status-text]").forEach((el) => (el.textContent = msg));
  }
  updateStatus();
  setInterval(updateStatus, 60_000);

  /* ---------- Day / night theme ---------- */
  function storedTheme() { try { return localStorage.getItem("kj-theme"); } catch { return null; } }
  function saveTheme(v) { try { localStorage.setItem("kj-theme", v); } catch {} }
  function clockTheme() { const { h } = renoNow(); return h >= S.hours.open && h < S.nightStartsAt ? "day" : "night"; }

  function applyTheme(theme, { save = false, origin } = {}) {
    const change = () => {
      root.dataset.theme = theme;
      const btn = $("[data-mode-toggle]");
      btn.setAttribute("aria-pressed", String(theme === "night"));
      $("[data-mode-label]").textContent = theme === "night" ? "Switch to café" : "Switch to cantina";
      btn.setAttribute("aria-label", theme === "night" ? "Switch to café (day) mode" : "Switch to cantina (night) mode");
      $('meta[name="theme-color"]').content = theme === "night" ? "#1b1410" : "#dfe5e0";
      selectTab(theme === "night" ? "cantina" : "cafe", false);
      document.dispatchEvent(new Event("themechange"));
    };
    if (save) saveTheme(theme);
    if (origin && document.startViewTransition && !reduce) {
      root.style.setProperty("--vt-x", origin.x + "px");
      root.style.setProperty("--vt-y", origin.y + "px");
      document.startViewTransition(change);
    } else change();
  }

  $("[data-mode-toggle]").addEventListener("click", (e) => {
    const next = root.dataset.theme === "night" ? "day" : "night";
    const r = e.currentTarget.getBoundingClientRect();
    applyTheme(next, { save: true, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  });

  /* ---------- Menu ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function renderMenu(key) {
    const data = M[key];
    const panel = $(`[data-panel="${key}"]`);
    panel.innerHTML =
      `<p class="menu__intro">${esc(data.intro)}</p><div class="menu__groups">` +
      data.groups.map((g) => `
        <div class="menu__group${g.featured ? " menu__group--featured" : ""}">
          <h3>${esc(g.name)}</h3>
          <ul class="menu__list">
            ${g.items.map((it) => `
              <li class="menu__item${it.signature ? " menu__item--signature" : ""}">
                <span class="menu__item-name">${esc(it.name)}</span>
                ${it.price ? `<span class="menu__item-price">${esc(it.price)}</span>` : "<span></span>"}
                ${it.detail ? `<span class="menu__item-detail">${esc(it.detail)}</span>` : ""}
              </li>`).join("")}
          </ul>
        </div>`).join("") + "</div>";
  }
  renderMenu("cafe");
  renderMenu("cantina");

  const tabs = $$('[role="tab"]');
  const ink = $(".tabs__ink");
  function moveInk(tab) {
    ink.style.width = tab.offsetWidth + "px";
    ink.style.transform = `translateX(${tab.offsetLeft}px)`;
  }
  function selectTab(key, syncTheme = true) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) moveInk(t);
    });
    $$(".menu__panel").forEach((p) => {
      const on = p.dataset.panel === key;
      if (on && p.hidden) { p.classList.remove("is-entering"); void p.offsetWidth; p.classList.add("is-entering"); }
      p.hidden = !on;
    });
    if (syncTheme) {
      const theme = key === "cantina" ? "night" : "day";
      if (root.dataset.theme !== theme) {
        const r = $(`[data-tab="${key}"]`).getBoundingClientRect();
        applyTheme(theme, { save: true, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
      }
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t.dataset.tab));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); selectTab(next.dataset.tab);
    });
  });
  addEventListener("resize", () => { const on = tabs.find((t) => t.getAttribute("aria-selected") === "true"); if (on) moveInk(on); });
  $$("[data-goto-tab]").forEach((a) => a.addEventListener("click", () => selectTab(a.dataset.gotoTab)));

  // initial theme (after menu exists)
  applyTheme(storedTheme() || clockTheme());

  /* ---------- Drink finder ---------- */
  const pick = { when: null, mood: null };
  ["when", "mood"].forEach((k) => {
    const wrap = $(`[data-finder="${k}"]`);
    wrap.innerHTML = F[k].map((o) => `<button type="button" class="chip" aria-pressed="false" data-val="${o.id}">${esc(o.label)}</button>`).join("");
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", wrap).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      pick[k] = b.dataset.val;
      runFinder();
    });
  });
  const flat = (key) => M[key].groups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.name, menu: key })));
  function runFinder() {
    const out = $("[data-finder-result]");
    if (!pick.when || !pick.mood) return;
    const key = pick.when === "night" ? "cantina" : "cafe";
    let pool = flat(key).filter((it) => (it.tags || []).includes(pick.mood));
    let note = "";
    if (!pool.length) {
      pool = [...flat("cafe"), ...flat("cantina")].filter((it) => (it.tags || []).includes(pick.mood));
      note = key === "cantina" ? "Nothing on the cocktail list fits that, but this one does." : "That one lives on the night menu.";
    }
    const it = pool[Math.floor(Math.random() * pool.length)];
    out.innerHTML = `<strong>${esc(it.name)}</strong>${it.detail ? esc(it.detail) + ". " : ""}${esc(note || "From " + it.group + ".")} <a href="#menu" class="text-link" data-jump="${it.menu}">Show it on the menu</a>`;
    $("[data-jump]", out).addEventListener("click", () => selectTab(it.menu));
  }

  /* ---------- Gallery ---------- */
  const grid = $("[data-gallery]");
  grid.innerHTML = G.map((g, i) => `
    <li class="grid__item grid__item--${g.shape || "tall"}" data-tag="${g.tag || ""}">
      <button class="grid__btn" type="button" data-index="${i}" aria-label="Open photo: ${esc(g.alt)}">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async" />
      </button>
    </li>`).join("");

  $("[data-gallery-filters]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]"); if (!b) return;
    $$("[data-filter]").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    let n = 0;
    $$(".grid__item", grid).forEach((li) => {
      const show = b.dataset.filter === "all" || li.dataset.tag === b.dataset.filter;
      li.hidden = !show;
      li.classList.remove("is-new");
      if (show) { li.style.setProperty("--i", n++); void li.offsetWidth; li.classList.add("is-new"); }
    });
  });

  // Instagram mini-grid in the social card
  const ig = $("[data-ig-grid]");
  if (ig) ig.innerHTML = G.filter((g) => g.tag === "drinks").concat(G).slice(0, 6)
    .map((g) => `<img src="${esc(g.src)}" alt="" loading="lazy" />`).join("");

  /* ---------- Lightbox ---------- */
  const lb = $("[data-lightbox]"), lbImg = $("[data-lb-img]"), lbCap = $("[data-lb-caption]");
  let current = 0, lastFocus = null;
  const visibleIdx = () => $$(".grid__item", grid).filter((li) => !li.hidden).map((li) => +$(".grid__btn", li).dataset.index);
  function show(i) {
    current = i;
    lbImg.src = G[i].src; lbImg.alt = G[i].alt; lbCap.textContent = G[i].alt;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
  }
  function shift(d) { const v = visibleIdx(); const p = v.indexOf(current); show(v[(p + d + v.length) % v.length]); }
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".grid__btn"); if (!b) return;
    lastFocus = b; show(+b.dataset.index); lb.showModal();
  });
  $("[data-lb-close]").addEventListener("click", () => lb.close());
  $("[data-lb-prev]").addEventListener("click", () => shift(-1));
  $("[data-lb-next]").addEventListener("click", () => shift(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("close", () => lastFocus && lastFocus.focus());
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") shift(1); if (e.key === "ArrowLeft") shift(-1); });
  let sx = 0;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) shift(dx < 0 ? 1 : -1); });

  /* ---------- Social cards: tilt + spotlight ---------- */
  if (!reduce && matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", (x - 0.5) * 8 + "deg");
        card.style.setProperty("--rx", (0.5 - y) * 8 + "deg");
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
      });
      card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });
  }

  /* ---------- Mobile nav ---------- */
  const burger = $("[data-burger]"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) { burger.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); } });

  // highlight the section you're in
  const links = $$(".nav a");
  const navObserver = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + en.target.id)));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["menu", "gallery", "story", "visit"].forEach((id) => { const el = document.getElementById(id); if (el) navObserver.observe(el); });

  if (matchMedia("(hover: none)").matches) { const hint = $(".hero__hint"); if (hint) hint.textContent = "Drag across the top to stir the crema"; }
  if (reduce) { const hint = $(".hero__hint"); if (hint) hint.hidden = true; }

  /* ---------- Hero headline: the one orchestrated load moment ---------- */
  $$(".split").forEach((el) => {
    let i = 0;
    el.innerHTML = el.textContent.split("").map((c) => `<span class="ch" style="--i:${i++}">${c === " " ? " " : esc(c)}</span>`).join("");
  });
  // second line starts after first
  const lines = $$(".hero__line .split");
  if (lines[1]) $$(".ch", lines[1]).forEach((c, k) => c.style.setProperty("--i", k + 14));
  root.classList.add("is-loading");
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-loading")));
})();
