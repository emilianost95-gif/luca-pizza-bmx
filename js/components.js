/* ==========================================================================
   COMPONENTES — funciones puras que devuelven HTML a partir de data.js
   ========================================================================== */
(function () {
  "use strict";
  const D = window.LUCA;

  /* ---------- helpers ---------- */
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const icon = (id, cls = "ico") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;

  const price = n => (typeof n === "number")
    ? `${D.currency.symbol} ${n.toLocaleString(D.currency.locale)}`
    : "";

  const waLink = (item) => {
    const msg = item ? `${D.contact.whatsappGreeting} ${item}` : D.contact.whatsappGreeting;
    return `https://wa.me/${D.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  /* Figura con imagen reemplazable. La <img> la inyecta hydrateMedia(). */
  const Media = (key, { cls = "", attrs = "", inner = "" } = {}) =>
    `<figure class="media ${cls}" data-img="${esc(key)}" ${attrs}>${inner}</figure>`;

  /* Inserta <img> en cada [data-img] (estático o generado) */
  function hydrateMedia(root = document) {
    root.querySelectorAll("[data-img]:not([data-hydrated])").forEach(fig => {
      const def = D.images[fig.dataset.img];
      fig.dataset.hydrated = "";
      if (!def) { fig.classList.add("is-missing"); fig.dataset.file = fig.dataset.img; return; }
      fig.dataset.file = def.src;
      const img = document.createElement("img");
      img.alt = fig.closest("[aria-hidden='true']") ? "" : (def.alt || "");
      img.decoding = "async";
      if (fig.hasAttribute("data-eager")) img.fetchPriority = "high";
      else img.loading = "lazy";
      if (def.pos) img.style.setProperty("--pos", def.pos);
      const done = () => img.classList.add("is-loaded");
      const fail = () => fig.classList.add("is-missing");
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", fail, { once: true });
      img.src = def.src;
      fig.prepend(img);
      if (img.complete && img.naturalWidth) done();
    });
  }

  /* ---------- Destacada ---------- */
  const Featured = (f) => `
    ${Media(f.img, { cls: "featured__img", inner: `<span class="featured__stamp">${icon("i-tri")}${esc(f.kicker)}</span>` })}
    <div class="featured__body">
      <p class="mono" style="color:var(--c-cement)">Nº 00 — Pizza de autor</p>
      <h3 class="featured__name display" data-reveal>${esc(f.name)}</h3>
      <p class="featured__desc">${esc(f.desc)}</p>
      <ul class="chips" aria-label="Ingredientes">${f.ingredients.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      ${f.promo ? `<p class="featured__promo">${icon("i-tri", "ico ico--tri")}<span>${esc(f.promo)}</span></p>` : ""}
      <div class="featured__buy">
        <span class="price-big"><small>ARS</small>${price(f.price)}</span>
        <a class="btn btn--fire" href="${waLink(f.name)}" target="_blank" rel="noopener">${icon("i-wa")}${esc(f.cta || "Pedir")}</a>
      </div>
    </div>`;

  /* ---------- Carta: tabs + paneles ---------- */
  const MenuItem = (it, cat) => {
    const label = `${cat.id === "pizzas" ? "Pizza " : ""}${it.name}`;
    return `
    <li class="item">
      <div class="item__row">
        <h4 class="item__name">${esc(it.name)}${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}</h4>
        <span class="item__dots" aria-hidden="true"></span>
        <span class="item__price">${it.price ? price(it.price) : "Consultar"}</span>
      </div>
      ${it.desc ? `<p class="item__desc">${esc(it.desc)}</p>` : ""}
      <a class="item__add" href="${waLink(label)}" target="_blank" rel="noopener" aria-label="Pedir ${esc(label)} por WhatsApp">${icon("i-plus")}</a>
    </li>`;
  };

  const MenuBoard = (menu) => {
    const tabs = menu.map((c, i) => `
      <button class="tab" role="tab" type="button" id="tab-${c.id}" aria-controls="panel-${c.id}"
        aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${c.id}">
        <span class="n">${pad(i + 1)}</span>${esc(c.title)}
      </button>`).join("");

    const panels = menu.map((c, i) => `
      <div class="panel ${c.img ? "" : "panel--noimg"}" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${i === 0 ? "" : "hidden"} tabindex="0">
        ${c.img ? Media(c.img, { cls: "panel__img", inner: `<figcaption class="display" aria-hidden="true">${pad(i + 1)}</figcaption>` }) : ""}
        <div class="panel__body">
          <header class="panel__head">
            <p class="mono" style="color:var(--c-fire)">${pad(i + 1)} / ${pad(menu.length)}</p>
            <h3 class="panel__title display">${esc(c.title)}</h3>
            ${c.note ? `<p class="panel__note">${esc(c.note)}</p>` : ""}
          </header>
          <ul class="items">${c.items.map(it => MenuItem(it, c)).join("")}</ul>
        </div>
      </div>`).join("");

    return `<div class="tabs" role="tablist" aria-label="Categorías de la carta">${tabs}</div>${panels}`;
  };

  /* ---------- Spot ---------- */
  const SpotFeatures = (list) => list.map(f => `<div><dt class="mono">${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join("");

  /* ---------- Experiencia ---------- */
  const ExpStage = (steps) => steps.map((s, i) =>
    Media(s.img, { cls: `exp__frame ${i === 0 ? "is-active" : ""}`, attrs: `data-frame="${i}"`, inner: `<span class="exp__clock mono">${esc(s.time)} h</span>` })
  ).join("");

  const ExpSteps = (steps) => steps.map((s, i) => `
    <li class="step ${i === 0 ? "is-active" : ""}" data-step="${i}">
      <span class="step__time mono">${pad(i + 1)} — ${esc(s.time)} h</span>
      <h3 class="step__word display">${esc(s.word)}</h3>
      <p class="step__text">${esc(s.text)}</p>
      ${Media(s.img, { cls: "step__img" })}
    </li>`).join("");

  /* ---------- Galería ---------- */
  const Gallery = (items) => items.map((g, i) => {
    const def = D.images[g.img] || {};
    return `
    <button class="tile ${g.size ? "tile--" + g.size : ""}" type="button" data-lb
      data-src="${esc(def.src || "")}" data-cap="${pad(i + 1)} — ${esc(g.caption)}" aria-label="Ampliar: ${esc(g.caption)}">
      ${Media(g.img)}
      <span class="tile__cap mono">${pad(i + 1)} — ${esc(g.caption)}</span>
    </button>`;
  }).join("");

  /* ---------- Eventos ---------- */
  const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const DAYS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

  const Event = (e) => {
    let date;
    if (e.date) {
      const [y, m, d] = e.date.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      date = `<span class="event__day display">${pad(d)}</span><span class="mono">${MONTHS[m - 1]} · ${DAYS[dt.getDay()]}</span>`;
    } else {
      date = `<span class="event__day event__day--label display">${esc(e.label || "")}</span>`;
    }
    return `
    <li class="event" data-reveal>
      <div class="event__date">${date}</div>
      <div class="event__info">
        <span class="mono event__type">${esc(e.type)}</span>
        <h3 class="event__name display">${esc(e.name)}</h3>
        <p class="event__desc">${esc(e.desc)}</p>
      </div>
      <a class="btn btn--ghost btn--sm event__cta" href="${waLink(`Quiero info sobre ${e.name}${e.date ? " (" + e.date.split("-").reverse().join("/") + ")" : ""}`)}" target="_blank" rel="noopener">
        ${esc(e.cta)} ${icon("i-arrow")}
      </a>
    </li>`;
  };

  /* Oculta eventos con fecha pasada */
  const upcoming = (list) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return list.filter(e => !e.date || new Date(e.date + "T23:59:59") >= today);
  };

  /* ---------- Testimonios ---------- */
  const Quote = (q) => `
    <figure class="quote" data-reveal>
      <blockquote><p>${esc(q.quote)}</p></blockquote>
      <figcaption class="mono">— ${esc(q.who)}${q.where ? " · " + esc(q.where) : ""}</figcaption>
    </figure>`;

  /* ---------- Horarios ---------- */
  const Hours = (hours, todayIdx) => hours.map(h => `
    <li class="${h.d.includes(todayIdx) ? "is-today" : ""}">
      <span>${esc(h.days)}</span>
      <span class="${h.open ? "" : "closed"}">${h.open ? `${esc(h.open)} — ${esc(h.close)}` : "Cerrado"}</span>
    </li>`).join("");

  window.UI = {
    esc, pad, price, waLink, icon, Media, hydrateMedia,
    Featured, MenuBoard, SpotFeatures, ExpStage, ExpSteps, Gallery, Event, upcoming, Quote, Hours
  };
})();
