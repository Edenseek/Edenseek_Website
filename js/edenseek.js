/* ==========================================================================
   Edenseek — behavior + data-driven rendering (progressive enhancement)
   - No framework, no external requests. Loaded with `defer`.
   - Renders structured lists from window.EDEN (see /data/edenseek-data.js).
   - Rendering targets are chosen by STABLE data-* hooks, never CSS classes,
     so presentation can change freely without breaking automation/AI agents.
   ========================================================================== */
(function () {
  "use strict";

  var EDEN = window.EDEN || {};
  var COVER_WIDTHS = [400, 800, 1200];
  var PORTRAIT_WIDTHS = [400, 800];

  /* ---------------------------- tiny helpers ----------------------------- */
  function h(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function byId(id) { return document.getElementById(id); }
  function findSeries(slug) {
    return (EDEN.series || []).concat(EDEN.books || []).filter(function (s) { return s.slug === slug; })[0];
  }
  function findCreator(slug) {
    return (EDEN.creators || []).filter(function (c) { return c.slug === slug; })[0];
  }

  /* --------------------------- media builders ---------------------------- */
  function coverSrcset(base) {
    return COVER_WIDTHS.map(function (w) {
      return "/assets/covers/" + base + "-cover-" + w + "w.webp " + w + "w";
    }).join(", ");
  }
  function coverMedia(cover, opts) {
    opts = opts || {};
    var sizes = opts.sizes || "(min-width:1024px) 300px, (min-width:768px) 30vw, 46vw";
    var loading = opts.eager ? "eager" : "lazy";
    var fp = opts.eager ? ' fetchpriority="high"' : "";
    return (
      '<div class="media" style="aspect-ratio:' + cover.w + "/" + cover.h + ";background:" + esc(cover.lqip || "#17171c") + '">' +
      '<img class="media__img" src="/assets/covers/' + esc(cover.base) + '-cover-800w.webp"' +
      ' srcset="' + coverSrcset(cover.base) + '" sizes="' + esc(sizes) + '"' +
      ' width="' + cover.w + '" height="' + cover.h + '" alt="' + esc(cover.alt || "") + '"' +
      ' loading="' + loading + '" decoding="async"' + fp +
      ' data-lightbox="/assets/covers/' + esc(cover.base) + '-cover-1200w.webp"></div>'
    );
  }
  function portraitImg(photo) {
    if (!photo) {
      return '<div class="media media--round media--placeholder" aria-hidden="true"></div>';
    }
    var srcset = PORTRAIT_WIDTHS.map(function (w) {
      return "/assets/creators/" + photo.base + "-" + w + "w.webp " + w + "w";
    }).join(", ");
    return (
      '<div class="media media--round" style="aspect-ratio:1/1;background:#20202a">' +
      '<img class="media__img" src="/assets/creators/' + esc(photo.base) + '-400w.webp"' +
      ' srcset="' + srcset + '" sizes="(min-width:768px) 160px, 40vw"' +
      ' width="' + photo.w + '" height="' + photo.h + '" alt="' + esc(photo.alt || "") + '"' +
      ' loading="lazy" decoding="async"></div>'
    );
  }

  /* ------------------------------ cards ---------------------------------- */
  function seriesCard(s) {
    var mature = s.rating === "Mature"
      ? '<span class="chip chip--mature">Mature</span>' : "";
    var genres = (s.genres || []).join(" · ");
    return h(
      '<article class="card ' + esc(s.accentClass || "") + '" data-entity="' +
        (s.imprint === "books" ? "book" : "series") + '" data-slug="' + esc(s.slug) + '">' +
        '<a class="card__link" href="' + esc(s.url) + '">' +
          '<div class="card__media">' + coverMedia(s.cover) + "</div>" +
          '<div class="card__body">' +
            '<div class="card__tags">' + mature + '<span class="chip">' + esc(genres) + "</span></div>" +
            '<h3 class="card__title">' + esc(s.title) + "</h3>" +
            '<p class="card__tagline">' + esc(s.tagline || "") + "</p>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  function creatorCard(c) {
    return h(
      '<article class="creator" data-entity="creator" data-slug="' + esc(c.slug) + '" id="creator-' + esc(c.slug) + '">' +
        portraitImg(c.photo) +
        '<h3 class="creator__name">' + esc(c.name) + "</h3>" +
        '<p class="creator__role">' + esc((c.roles || []).join(" · ")) + "</p>" +
        (c.bio ? '<p class="creator__bio">' + esc(c.bio) + "</p>" : "") +
      "</article>"
    );
  }

  function newsItem(n) {
    return h(
      '<article class="news-item" data-entity="news" data-slug="' + esc(n.slug) + '">' +
        '<time class="news-item__date" datetime="' + esc(n.date) + '">' + esc(formatDate(n.date)) + "</time>" +
        '<h3 class="news-item__title"><a href="' + esc(n.url || "#") + '">' + esc(n.title) + "</a></h3>" +
        '<p class="news-item__summary">' + esc(n.summary || "") + "</p>" +
      "</article>"
    );
  }

  function issueRow(issue, accent) {
    var price = issue.price ? '<span class="issue__price">' + esc(issue.price) + "</span>" : "";
    return h(
      '<article class="issue ' + esc(accent || "") + '" data-entity="issue" data-number="' + esc(issue.number) + '">' +
        '<div class="issue__cover">' + coverMedia(issue.cover, { sizes: "(min-width:768px) 200px, 40vw" }) + "</div>" +
        '<div class="issue__body">' +
          '<h3 class="issue__title">' + esc(issue.title) + "</h3>" +
          '<p class="issue__meta"><span class="chip">' + esc(issue.status || "") + "</span>" + price + "</p>" +
          '<p class="issue__synopsis">' + esc(issue.synopsis || "") + "</p>" +
          '<p class="issue__actions"><span class="btn btn--ghost btn--disabled" aria-disabled="true" title="Storefront coming soon">Buy — Coming soon</span></p>' +
        "</div>" +
      "</article>"
    );
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if (parts.length === 3) return months[parseInt(parts[1], 10) - 1] + " " + parseInt(parts[2], 10) + ", " + parts[0];
    return iso;
  }

  /* --------------------------- render dispatch --------------------------- */
  function renderInto(node, items, builder) {
    if (!node) return;
    node.setAttribute("data-rendered", "true");
    node.innerHTML = "";
    items.forEach(function (it) { node.appendChild(builder(it)); });
  }

  function creditsList(series) {
    var wrap = h('<ul class="credits" data-render-done="credits"></ul>');
    (series.credits || []).forEach(function (cr) {
      var c = findCreator(cr.creator);
      var name = c ? c.name : cr.creator;
      var link = c && c.featured ? '<a href="/creators/#creator-' + esc(c.slug) + '">' + esc(name) + "</a>" : esc(name);
      wrap.appendChild(h('<li class="credits__item"><span class="credits__role">' + esc(cr.role) + "</span><span class=\"credits__name\">" + link + "</span></li>"));
    });
    return wrap;
  }

  function runRenderers() {
    // Grids
    document.querySelectorAll('[data-render="comics-grid"]').forEach(function (node) {
      var items = (EDEN.series || []).slice();
      if (node.dataset.limit) items = items.slice(0, +node.dataset.limit);
      renderInto(node, items, seriesCard);
    });
    document.querySelectorAll('[data-render="books-grid"]').forEach(function (node) {
      var items = (EDEN.books || []).slice();
      if (node.dataset.limit) items = items.slice(0, +node.dataset.limit);
      renderInto(node, items, seriesCard);
    });
    document.querySelectorAll('[data-render="creators-grid"]').forEach(function (node) {
      var items = (EDEN.creators || []).filter(function (c) {
        return node.dataset.featured === "true" ? c.featured : true;
      });
      if (node.dataset.limit) items = items.slice(0, +node.dataset.limit);
      renderInto(node, items, creatorCard);
    });
    document.querySelectorAll('[data-render="news-list"]').forEach(function (node) {
      var items = (EDEN.news || []).slice();
      if (node.dataset.limit) items = items.slice(0, +node.dataset.limit);
      renderInto(node, items, newsItem);
    });
    // Series detail: issues + credits
    document.querySelectorAll('[data-render="issues"]').forEach(function (node) {
      var s = findSeries(node.dataset.slug);
      if (!s) return;
      renderInto(node, s.issues || [], function (i) { return issueRow(i, s.accentClass); });
    });
    document.querySelectorAll('[data-render="credits"]').forEach(function (node) {
      var s = findSeries(node.dataset.slug);
      if (!s) return;
      node.setAttribute("data-rendered", "true");
      node.innerHTML = "";
      node.appendChild(creditsList(s));
    });
  }

  /* ------------------------------ header --------------------------------- */
  function initHeader() {
    var header = byId("site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var toggle = byId("menu-toggle");
    var menu = byId("primary-nav");
    if (toggle && menu) {
      var close = function () {
        menu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      };
      var open = function () {
        menu.classList.add("is-open");
        document.body.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
        var first = menu.querySelector("a");
        if (first) first.focus();
      };
      toggle.addEventListener("click", function () {
        toggle.getAttribute("aria-expanded") === "true" ? close() : open();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("is-open")) { close(); toggle.focus(); }
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) close();
      });
    }

    // Accessible dropdowns (click/tap + keyboard), no hover-only dependency
    document.querySelectorAll("[data-dropdown]").forEach(function (dd) {
      var btn = dd.querySelector("[data-dropdown-toggle]");
      if (!btn) return;
      var closeDd = function () { dd.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); };
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var openNow = dd.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", openNow ? "true" : "false");
      });
      document.addEventListener("click", function (e) { if (!dd.contains(e.target)) closeDd(); });
      dd.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDd(); btn.focus(); } });
    });
  }

  /* ------------------------------ lightbox ------------------------------- */
  function initLightbox() {
    var box = null;
    function openBox(src, alt) {
      box = h(
        '<div class="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged artwork">' +
          '<button class="lightbox__close" aria-label="Close">&times;</button>' +
          '<img class="lightbox__img" src="' + esc(src) + '" alt="' + esc(alt || "") + '">' +
        "</div>"
      );
      document.body.appendChild(box);
      document.body.classList.add("nav-open");
      box.querySelector(".lightbox__close").focus();
      box.addEventListener("click", function (e) {
        if (e.target === box || e.target.closest(".lightbox__close")) closeBox();
      });
    }
    function closeBox() {
      if (box) { box.remove(); box = null; document.body.classList.remove("nav-open"); }
    }
    document.addEventListener("click", function (e) {
      var img = e.target.closest("[data-lightbox]");
      if (img) { e.preventDefault(); openBox(img.getAttribute("data-lightbox"), img.getAttribute("alt")); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeBox(); });
  }

  /* ------------------------------ footer year ---------------------------- */
  function initYear() {
    var y = byId("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function init() {
    try { runRenderers(); } catch (err) { /* fail soft: static fallbacks remain */ }
    initHeader();
    initLightbox();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
