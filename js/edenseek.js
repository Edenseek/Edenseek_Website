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
    // opts.ratio pins a uniform tile aspect (e.g. "2/3") so cards in a grid share
    // the same cover height and their titles align; the image fills via object-fit
    // cover. Omit it (detail pages) to preserve each cover's true proportions.
    var ratio = opts.ratio || (cover.w + "/" + cover.h);
    return (
      '<div class="media" style="aspect-ratio:' + ratio + ";background:" + esc(cover.lqip || "#17171c") + '">' +
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
  // Visible maturity label, derived from canonical tier metadata (never hand-authored).
  function tierBadge(tier) {
    if (tier === "M") return '<span class="chip chip--mature">Mature</span>';
    if (tier === "T") return '<span class="chip chip--teen">Teen</span>';
    if (tier === "E") return '<span class="chip chip--allages">All-Ages</span>';
    return "";
  }

  // Genre/status chips as individual pills (consistent, one row, wraps if needed).
  function genreChips(list) {
    return (list || []).map(function (g) { return '<span class="chip">' + esc(g) + "</span>"; }).join("");
  }

  function seriesCard(s) {
    var tierChip = tierBadge(s.tier);
    var chips = genreChips(s.genres);
    return h(
      '<article class="card ' + esc(s.accentClass || "") + '" data-entity="' +
        (s.imprint === "books" ? "book" : "series") + '" data-slug="' + esc(s.slug) + '">' +
        '<a class="card__link" href="' + esc(s.url) + '">' +
          '<div class="card__media">' + coverMedia(s.cover, { ratio: s.imprint === "books" ? "4/3" : "2/3" }) + "</div>" +
          '<div class="card__body">' +
            // Row 1: maturity badge (always present, one line so titles align).
            '<div class="card__tags">' + tierChip + "</div>" +
            // Row 2: genre/status tags, uniform spacing beneath the badge.
            (chips ? '<div class="card__tags card__tags--genre">' + chips + "</div>" : "") +
            '<h3 class="card__title">' + esc(s.title) + "</h3>" +
            '<p class="card__tagline">' + esc(s.tagline || "") + "</p>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  // Homepage/featured book card: one card per issue (e.g. each Egypt the Cat title).
  // Shares the .card component + the same two-row tag layout as seriesCard.
  function bookIssueCard(issue, book) {
    var tierChip = tierBadge(book.tier);
    var chips = genreChips((book.genres || []).slice(0, 1)); // one consistent genre pill
    return h(
      '<article class="card ' + esc(book.accentClass || "") + '" data-entity="book-issue" data-slug="' +
        esc(book.slug) + '" data-number="' + esc(issue.number) + '">' +
        '<a class="card__link" href="' + esc(book.url) + '">' +
          '<div class="card__media">' + coverMedia(issue.cover, { ratio: "4/3" }) + "</div>" +
          '<div class="card__body">' +
            '<div class="card__tags">' + tierChip + "</div>" +
            (chips ? '<div class="card__tags card__tags--genre">' + chips + "</div>" : "") +
            '<h3 class="card__title">' + esc(issue.title) + "</h3>" +
            '<p class="card__tagline">Book ' + esc(issue.number) + "</p>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  // Split into given name(s) + family name so every creator renders on a
  // consistent two-line layout (e.g. "Michael Bryan" / "Quiambao").
  function splitName(name) {
    var parts = String(name == null ? "" : name).trim().split(/\s+/);
    if (parts.length < 2) return { given: "", family: parts[0] || "" };
    return { given: parts.slice(0, -1).join(" "), family: parts[parts.length - 1] };
  }

  function creatorCard(c) {
    var nm = splitName(c.name);
    var nameHtml =
      (nm.given ? '<span class="creator__given">' + esc(nm.given) + "</span>" : "") +
      '<span class="creator__family">' + esc(nm.family) + "</span>";
    return h(
      '<article class="creator" data-entity="creator" data-slug="' + esc(c.slug) + '" id="creator-' + esc(c.slug) + '">' +
        portraitImg(c.photo) +
        '<h3 class="creator__name">' + nameHtml + "</h3>" +
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

  /* ------------------------------ commerce ------------------------------- */
  // Look up a store product (see /data/products.js). Returns null if the store
  // config isn't loaded on this page or the slug isn't listed.
  function findProduct(slug) {
    var store = window.EDEN_STORE || {};
    var list = store.products || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  // Purchase button, driven entirely by the product config — never hardcoded.
  // Static-site rule: "Buy Now" (live Stripe Payment Link) only when the product
  // is available AND a payment link exists; otherwise "Coming Soon".
  // stripeProductId/stripePriceId are intentionally ignored here — they are
  // reserved for the future Edenseek platform's server-driven checkout.
  function purchaseButton(product) {
    if (product && product.available && product.stripePaymentLink) {
      // Stripe Checkout opens in the SAME tab (normal navigation). No target=_blank,
      // so there is no window.opener to secure; the link is the HTTPS Stripe URL.
      return (
        '<p class="issue__actions">' +
          '<a class="btn btn--primary" href="' + esc(product.stripePaymentLink) + '">Buy Now' +
          '<span class="visually-hidden"> — ' + esc(product.title) + ' (secure checkout)</span>' +
          "</a>" +
        "</p>"
      );
    }
    return (
      '<p class="issue__actions">' +
        '<span class="btn btn--ghost btn--disabled" aria-disabled="true" title="Coming soon">Coming Soon</span>' +
      "</p>"
    );
  }

  function issueRow(issue, accent, seriesSlug) {
    // The rendered issue is matched to a store product by "<series>-<number>".
    var product = findProduct((seriesSlug || "") + "-" + issue.number);
    // Price shown on the card reads from the store config when present.
    var priceText = (product && product.priceLabel) ? product.priceLabel : issue.price;
    var price = priceText ? '<span class="issue__price">' + esc(priceText) + "</span>" : "";
    return h(
      '<article class="issue ' + esc(accent || "") + '" data-entity="issue" data-number="' + esc(issue.number) + '">' +
        '<div class="issue__cover">' + coverMedia(issue.cover, { sizes: "(min-width:768px) 200px, 40vw" }) + "</div>" +
        '<div class="issue__body">' +
          '<h3 class="issue__title">' + esc(issue.title) + "</h3>" +
          '<p class="issue__meta"><span class="chip">' + esc(issue.status || "") + "</span>" + price + "</p>" +
          '<p class="issue__synopsis">' + esc(issue.synopsis || "") + "</p>" +
          purchaseButton(product) +
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
      // data-expand="issues": show each book's individual titles as cards
      // (e.g. all five Egypt the Cat books) instead of one series card.
      if (node.dataset.expand === "issues") {
        var cards = [];
        (EDEN.books || []).forEach(function (b) {
          (b.issues || []).forEach(function (iss) { cards.push({ issue: iss, book: b }); });
        });
        if (node.dataset.limit) cards = cards.slice(0, +node.dataset.limit);
        renderInto(node, cards, function (x) { return bookIssueCard(x.issue, x.book); });
        return;
      }
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
      renderInto(node, s.issues || [], function (i) { return issueRow(i, s.accentClass, s.slug); });
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

  /* ----------------- Bridge Rule: maturity age gate (A2) --------------------
     Enforces Appendix A2 in the navigation/link layer as a single choke point.
     "Mature destinations" are derived from canonical tier metadata (window.EDEN),
     never hardcoded — so the Website Agent changes gating by changing data only.
     Gating logic is intentionally kept out of the canonical content. */
  var AGE_KEY = "eden_age_ok";
  function ageOK() {
    try { return localStorage.getItem(AGE_KEY) === "1"; }
    catch (e) { return window.__edenAgeOK === true; }
  }
  function setAgeOK() {
    try { localStorage.setItem(AGE_KEY, "1"); }
    catch (e) { window.__edenAgeOK = true; }
  }
  function matureMatchers() {
    var items = (EDEN.series || []).concat(EDEN.books || []);
    var urls = {}, hubs = {};
    items.forEach(function (x) {
      if (x.tier === "M" && x.url) {
        urls[x.url] = 1;
        hubs[x.url.replace(/[^/]+\/$/, "")] = 1; // derive imprint hub, e.g. /comics/
      }
    });
    return { urls: urls, hubs: Object.keys(hubs) };
  }
  function normPath(href) {
    var p = href.split("#")[0].split("?")[0];
    if (p && p.charAt(p.length - 1) !== "/" && p.lastIndexOf(".") < p.lastIndexOf("/")) p += "/";
    return p;
  }
  function isMatureDest(href) {
    if (!href || href.charAt(0) !== "/") return false; // internal absolute paths only
    var p = normPath(href), m = matureMatchers();
    if (m.urls[p]) return true;
    return m.hubs.some(function (hub) { return hub && (p === hub || p.indexOf(hub) === 0); });
  }
  function openGate(onEnter, onCancel) {
    var box = h(
      '<div class="agegate" role="dialog" aria-modal="true" aria-labelledby="agegate-title">' +
        '<div class="agegate__panel">' +
          '<p class="kicker">Mature content</p>' +
          '<h2 class="agegate__title" id="agegate-title">This section is for adult readers.</h2>' +
          '<p class="agegate__text">These comics are rated <strong>Mature</strong>. Please confirm you are 18 or older to continue.</p>' +
          '<div class="agegate__actions">' +
            '<button class="btn btn--primary" type="button" data-gate-enter>I am 18 or older</button>' +
            '<button class="btn btn--ghost" type="button" data-gate-cancel>Take me back</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
    document.body.appendChild(box);
    document.body.classList.add("nav-open");
    var enterBtn = box.querySelector("[data-gate-enter]");
    if (enterBtn) enterBtn.focus();
    function done(cb) {
      box.remove();
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKey);
      if (cb) cb();
    }
    function onKey(e) {
      if (e.key === "Escape") { done(onCancel); return; }
      if (e.key === "Tab") {
        var f = box.querySelectorAll("button"), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    box.addEventListener("click", function (e) {
      if (e.target.closest("[data-gate-enter]")) { setAgeOK(); done(onEnter); }
      else if (e.target.closest("[data-gate-cancel]")) { done(onCancel); }
    });
    document.addEventListener("keydown", onKey);
  }
  function initAgeGate() {
    if (!(EDEN.series || EDEN.books)) return;
    // (1) Page-load guard: mature destination reached directly/via search.
    if (isMatureDest(location.pathname) && !ageOK()) {
      openGate(null, function () { location.href = "/"; });
    }
    // (2) Link interception: upward navigation into mature content is gated.
    document.addEventListener("click", function (e) {
      if (ageOK()) return;
      var a = e.target.closest("a[href]");
      if (!a || a.hasAttribute("data-dropdown-toggle")) return; // toggles aren't navigation
      if (e.target.closest("[data-lightbox]")) return;          // enlarging a labeled cover is a preview
      if (isMatureDest(a.getAttribute("href"))) {
        e.preventDefault();
        var href = a.getAttribute("href");
        openGate(function () { location.href = href; }, null);
      }
    });
  }

  function init() {
    try { runRenderers(); } catch (err) { /* fail soft: static fallbacks remain */ }
    initHeader();
    initLightbox();
    initYear();
    try { initAgeGate(); } catch (err) { /* fail open: never block the site on a gate error */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
