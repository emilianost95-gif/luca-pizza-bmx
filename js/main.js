/* ==========================================================================
   MAIN — render desde datos + interacciones
   ========================================================================== */
(function () {
  "use strict";
  const D = window.LUCA, UI = window.UI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mqMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const mqDesktop = matchMedia("(min-width: 960px)");
  const motionOK = () => !mqMotion.matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ------------------------------------------------ 1. Datos → DOM */
  const c = D.contact;
  const igUrl = `https://instagram.com/${c.instagram}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapsQuery)}`;

  $$("[data-brand]").forEach(el => { el.src = D.brand[el.dataset.brand]; });
  $$("[data-est]").forEach(el => el.textContent = D.brand.est);
  $$("[data-coords]").forEach(el => el.textContent = c.coords);
  $$("[data-address]").forEach(el => el.textContent = c.address);
  $$("[data-city]").forEach(el => el.textContent = c.city);
  $$("[data-ig-handle]").forEach(el => el.textContent = "@" + c.instagram);
  $$("[data-ig]").forEach(el => el.href = igUrl);
  $$("[data-wa]").forEach(el => el.href = UI.waLink());
  $$("[data-wa-display]").forEach(el => el.textContent = c.whatsappDisplay);
  $$("[data-maps]").forEach(el => el.href = mapsUrl);
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const mount = (name, html) => { const el = $(`[data-mount="${name}"]`); if (el) el.innerHTML = html; return el; };
  mount("featured", UI.Featured(D.featured));
  mount("menu", UI.MenuBoard(D.menu));
  mount("spot-features", UI.SpotFeatures(D.spot.features));
  mount("spot-rules", UI.esc(D.spot.rules));
  mount("exp-stage", UI.ExpStage(D.experience));
  mount("experience", UI.ExpSteps(D.experience));
  mount("gallery", UI.Gallery(D.gallery));
  mount("events", UI.upcoming(D.events).map(UI.Event).join(""));
  mount("testimonials", D.testimonials.map(UI.Quote).join(""));
  mount("hours", UI.Hours(D.hours, new Date().getDay()));

  // Tickers (contenido duplicado para loop infinito)
  $$("[data-ticker]").forEach(t => {
    const txt = UI.esc(t.dataset.ticker).replace(/▼/g, "<b>▼</b>");
    t.innerHTML = `<span>${txt} </span><span>${txt} </span>`.repeat(2);
  });

  UI.hydrateMedia();

  /* ------------------------------------------------ 2. Abierto / cerrado */
  const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const DAYN = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  function openState(now = new Date()) {
    const day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    const entry = d => D.hours.find(h => h.d.includes(d) && h.open);
    const span = h => { const o = toMin(h.open); let cl = toMin(h.close); if (cl <= o) cl += 1440; return [o, cl]; };
    const today = entry(day), yest = entry((day + 6) % 7);
    if (today) { const [o, cl] = span(today); if (mins >= o && mins < cl) return { open: true, until: today.close }; }
    if (yest) { const [, cl] = span(yest); if (cl > 1440 && mins < cl - 1440) return { open: true, until: yest.close }; }
    for (let i = 0; i < 7; i++) {
      const d = (day + i) % 7, h = entry(d);
      if (h && (i > 0 || mins < toMin(h.open))) return { open: false, next: `${i === 0 ? "hoy" : i === 1 ? "mañana" : DAYN[d]} ${h.open}` };
    }
    return { open: false };
  }
  const st = openState();
  $$("[data-open-status]").forEach(el => {
    el.hidden = false;
    el.classList.toggle("is-open", st.open);
    el.textContent = st.open ? `Abierto · hasta ${st.until}` : `Cerrado${st.next ? " · abre " + st.next : ""}`;
  });
  $$("[data-open-status-long]").forEach(el => {
    el.textContent = st.open ? `Abierto ahora — hasta las ${st.until}` : (st.next ? `Abrimos ${st.next} h` : "Te esperamos");
  });

  /* ------------------------------------------------ 3. SEO: JSON-LD */
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: D.brand.name,
    slogan: D.brand.tagline,
    servesCuisine: ["Pizza", "Lomos", "Calzones"],
    priceRange: "$$",
    telephone: "+" + c.whatsapp,
    image: D.images.og.src,
    address: { "@type": "PostalAddress", streetAddress: c.address, addressLocality: c.city },
    sameAs: [igUrl],
    hasMenu: "carta.html",
    acceptsReservations: true
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);

  /* ------------------------------------------------ 4. Navbar */
  const nav = $("[data-nav]");
  const burger = $("[data-burger]");
  const mnav = $("[data-mnav]");
  const dock = $("[data-dock]");
  const hero = $(".hero");
  const footer = $(".footer");
  let lastY = scrollY, menuOpen = false;

  function onScrollNav() {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 40);
    const goingDown = y > lastY && y > innerHeight * .9;
    const hide = goingDown && !menuOpen && !document.activeElement?.closest?.("[data-nav]");
    if (hide !== nav.classList.contains("is-hidden")) {
      nav.classList.toggle("is-hidden", hide);
      document.documentElement.style.setProperty("--tabs-top", hide ? "0px" : "");
    }
    lastY = y;
    const pastHero = y > hero.offsetHeight * .7;
    const atFooter = footer.getBoundingClientRect().top < innerHeight - 40;
    dock.classList.toggle("is-visible", pastHero && !atFooter);
  }

  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) { mnav.hidden = false; requestAnimationFrame(() => mnav.classList.add("is-open")); }
    else { mnav.classList.remove("is-open"); setTimeout(() => { if (!menuOpen) mnav.hidden = true; }, 600); }
    document.body.style.overflow = open ? "hidden" : "";
    nav.classList.add("is-solid");
    nav.classList.remove("is-hidden");
    if (open) setTimeout(() => $("a", mnav)?.focus(), 250);
  }
  burger.addEventListener("click", () => setMenu(!menuOpen));
  mnav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menuOpen) { setMenu(false); burger.focus(); }
    if (e.key === "Tab" && menuOpen) {                       // foco atrapado dentro del menú
      const f = [burger, ...$$("a, button", mnav)];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  mqDesktop.addEventListener("change", () => menuOpen && setMenu(false));

  // Link activo según sección visible
  const navLinks = $$(".nav__links a");
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id && !a.dataset.tabLink));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id], footer[id]").forEach(sec => secObs.observe(sec));

  /* ------------------------------------------------ 5. Tabs de la carta */
  const tabs = $$("[data-tab]");
  function selectTab(id, { focus = false, scroll = false } = {}) {
    tabs.forEach(t => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute("aria-controls"));
      if (on && p.hidden) { p.hidden = false; p.classList.remove("is-entering"); void p.offsetWidth; p.classList.add("is-entering"); }
      else if (!on) p.hidden = true;
      if (on) {
        if (focus) t.focus();
        t.scrollIntoView({ block: "nearest", inline: "nearest", behavior: motionOK() ? "smooth" : "auto" });
      }
    });
    if (scroll) {
      const board = $(".menu__board");
      const top = board.getBoundingClientRect().top + scrollY - nav.offsetHeight;
      if (scrollY > top) scrollTo({ top, behavior: motionOK() ? "smooth" : "auto" });
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t.dataset.tab, { scroll: true }));
    t.addEventListener("keydown", e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); selectTab(tabs[(i + k + tabs.length) % tabs.length].dataset.tab, { focus: true }); }
      if (e.key === "Home") { e.preventDefault(); selectTab(tabs[0].dataset.tab, { focus: true }); }
      if (e.key === "End") { e.preventDefault(); selectTab(tabs[tabs.length - 1].dataset.tab, { focus: true }); }
    });
  });
  $$("[data-tab-link]").forEach(a => a.addEventListener("click", () => selectTab(a.dataset.tabLink)));

  /* ------------------------------------------------ 6. Reveals */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revObs.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });

  $$("[data-split]").forEach(sp => {
    const title = sp.closest("h1, h2");
    [...title.querySelectorAll(".line")].forEach((l, i) => l.style.setProperty("--d", `${.1 + i * .09}s`));
  });
  $$(".hero__content [data-reveal]").forEach((el, i) => el.style.setProperty("--d", `${.45 + i * .1}s`));
  $$("[data-reveal], [data-stagger], .final__title").forEach(el => revObs.observe(el));
  requestAnimationFrame(() => $(".hero__title").classList.add("is-in"));

  /* ------------------------------------------------ 7. Parallax sutil */
  const plx = $$("[data-parallax]").map(el => ({ el, f: parseFloat(el.dataset.parallax) || .1 }));
  let plxOn = false;
  const plxVisible = new Set();
  const plxObs = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? plxVisible.add(e.target) : plxVisible.delete(e.target)));
  plx.forEach(p => plxObs.observe(p.el));
  function updateParallax() {
    if (!plxOn) return;
    const vh = innerHeight;
    plx.forEach(({ el, f }) => {
      if (!plxVisible.has(el)) return;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) * -f;
      el.style.setProperty("--py", `${offset.toFixed(1)}px`);
    });
  }
  const setPlx = () => { plxOn = motionOK() && matchMedia("(min-width: 760px)").matches; if (!plxOn) plx.forEach(p => p.el.style.removeProperty("--py")); };

  /* ------------------------------------------------ 8. The Spot: scroll horizontal */
  const spot = $("[data-hscroll]");
  const track = $("[data-hs-track]", spot);
  const line = $("[data-hs-line]", spot);
  const panels = $$(".spot__panel", track);
  const countEl = $("[data-hs-count]", spot);
  $("[data-hs-total]", spot).textContent = UI.pad(panels.length);
  let hsDist = 0, pinned = false;
  const lineLen = line.getTotalLength();
  line.style.strokeDasharray = lineLen;
  line.style.strokeDashoffset = lineLen;

  function setupHS() {
    pinned = mqDesktop.matches && motionOK();
    spot.classList.toggle("is-pinned", pinned);
    track.style.transform = "";
    spot.style.height = "";
    if (!pinned) return;
    hsDist = Math.max(0, track.scrollWidth - innerWidth);
    spot.style.height = `${innerHeight + hsDist}px`;
    updateHS();
  }
  function updateHS() {
    let p;
    if (pinned) {
      const r = spot.getBoundingClientRect();
      p = clamp(-r.top / (hsDist || 1));
      track.style.transform = `translate3d(${(-p * hsDist).toFixed(1)}px,0,0)`;
      line.style.strokeDashoffset = (lineLen * (1 - p)).toFixed(1);
    } else {
      p = clamp(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth));
    }
    countEl.textContent = UI.pad(Math.min(panels.length, 1 + Math.round(p * (panels.length - 1))));
  }
  track.addEventListener("scroll", () => !pinned && updateHS(), { passive: true });

  /* ------------------------------------------------ 9. Experiencia */
  const steps = $$(".step");
  const frames = $$(".exp__frame");
  const stepObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const i = en.target.dataset.step;
      steps.forEach(s => s.classList.toggle("is-active", s.dataset.step === i));
      frames.forEach(f => f.classList.toggle("is-active", f.dataset.frame === i));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(s => stepObs.observe(s));

  /* ------------------------------------------------ 10. Lightbox */
  const lb = $("[data-lightbox]");
  const lbImg = $("[data-lb-img]", lb);
  const lbCap = $("[data-lb-cap]", lb);
  let lbOpener = null;
  $$("[data-lb]").forEach(b => b.addEventListener("click", () => {
    if (b.querySelector(".is-missing") || !lb.showModal) return;
    lbOpener = b;
    lbImg.src = b.dataset.src;
    lbImg.alt = b.querySelector("img")?.alt || "";
    lbCap.textContent = b.dataset.cap;
    lb.showModal();
    document.body.style.overflow = "hidden";
  }));
  const closeLb = () => lb.open && lb.close();
  $("[data-lb-close]", lb).addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  lb.addEventListener("close", () => { document.body.style.overflow = ""; lbOpener?.focus(); });

  /* ------------------------------------------------ 11. Mapa bajo demanda */
  $("[data-map-load]")?.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.title = `Mapa — ${D.brand.name}`;
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = `https://www.google.com/maps?q=${encodeURIComponent(c.mapsQuery)}&output=embed`;
    $("[data-map]").replaceChildren(f);
  });

  /* ------------------------------------------------ 12. Video del hero (opcional) */
  const hv = D.images.heroVideo;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (hv && hv.src && motionOK() && !saveData && mqDesktop.matches) {
    const v = document.createElement("video");
    Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: "metadata" });
    v.setAttribute("aria-hidden", "true");
    v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
    v.addEventListener("error", () => v.remove(), { once: true });
    v.src = hv.src;
    $("[data-hero-video]").appendChild(v);
  }

  /* ------------------------------------------------ Loop de scroll (1 solo rAF) */
  let ticking = false;
  function frame() {
    ticking = false;
    onScrollNav();
    updateParallax();
    if (pinned) updateHS();
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });

  let rz;
  function onResize() { clearTimeout(rz); rz = setTimeout(() => { setPlx(); setupHS(); frame(); }, 120); }
  addEventListener("resize", onResize);
  mqMotion.addEventListener("change", onResize);
  addEventListener("load", onResize);           // recalcula cuando cargan las imágenes

  setPlx(); setupHS(); frame();
})();
