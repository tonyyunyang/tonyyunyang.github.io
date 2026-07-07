/* ============================================================
   Paper detail page.

   Sheets travel left-to-right under vertical scroll (landing
   mechanic, no zoom-out): Title → Authors → Venue →
   Introduction → Video → BibTeX. Each sheet's text reveals as
   it first arrives (scramble / diffusion, ~1s). The dock is a
   port of the 2022.rauno.me magnifying dock: width interpolated
   from cursor distance through [40, 44, 56.56, 80] with a
   spring, buttons bottom-anchored, bouncy click.
   ============================================================ */

(function () {
  "use strict";

  var FRAME_W = 1200;
  var STRIDE = 1240;
  var clamp = function (v, lo, hi) { return Math.min(Math.max(v, lo), hi); };
  var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- data ---------- */
  var slug = new URLSearchParams(location.search).get("p");
  var pub = (window.PUBLICATIONS || []).find(function (p) { return p.slug === slug; });
  if (!pub) {
    location.replace("ai.html");
    return;
  }
  document.title = pub.title + " — Tony Yang";

  /* ---------- spring engine ---------- */
  var active = new Set();
  var rafId = null;
  var lastT = 0;

  function Spring(value, opts) {
    opts = opts || {};
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.stiffness = opts.stiffness || 100;
    this.damping = opts.damping || 10;
    this.mass = opts.mass || 1;
    this.rest = opts.rest || 0.005;
  }
  Spring.prototype.set = function (t) {
    if (reducedMotion) { this.value = t; this.target = t; requestRender(); return; }
    this.target = t;
    active.add(this);
    wake();
  };
  Spring.prototype.jump = function (v) {
    this.value = v; this.target = v; this.velocity = 0;
    active.delete(this);
    requestRender();
  };
  Spring.prototype.step = function (dt) {
    var steps = Math.max(1, Math.ceil(dt / 0.004));
    var h = dt / steps;
    for (var i = 0; i < steps; i++) {
      var a = (this.stiffness * (this.target - this.value) - this.damping * this.velocity) / this.mass;
      this.velocity += a * h;
      this.value += this.velocity * h;
    }
    if (Math.abs(this.velocity) < this.rest && Math.abs(this.target - this.value) < this.rest) {
      this.value = this.target; this.velocity = 0;
      return true;
    }
    return false;
  };

  function wake() {
    if (rafId === null) { lastT = performance.now(); rafId = requestAnimationFrame(tick); }
  }
  function requestRender() { wake(); }
  function tick(now) {
    var dt = Math.min((now - lastT) / 1000, 0.064);
    lastT = now;
    active.forEach(function (s) { if (s.step(dt)) active.delete(s); });
    render();
    rafId = active.size > 0 || dockCursorX !== null ? requestAnimationFrame(tick) : null;
    if (rafId) lastT = now;
  }

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  var sheetsEl = document.getElementById("sheets");
  var root = document.getElementById("root");
  var ghost = document.getElementById("ghost");

  function frame(inner, label, i) {
    var f = document.createElement("div");
    f.className = "sheet-frame";
    f.tabIndex = 0;
    if (i === 0) f.dataset.first = "true";
    else f.style.left = STRIDE * i + "px";
    if (label) {
      var l = document.createElement("div");
      l.className = "sheet-label";
      l.textContent = label;
      f.appendChild(l);
    }
    f.appendChild(inner);
    return f;
  }

  /* ---------- sheet 0: title ---------- */
  var titleSheet = el("div", "sheet sheet-title");
  var eyebrow = el("div", "eyebrow",
    "<span class='index-chip' style='background:" + pub.accent.bg + ";color:" + pub.accent.fg + "'>" +
    pub.index + "</span><span>" + pub.venue + " · " + pub.year + "</span>");
  /* born empty — the scramble types the title in, so it never flashes;
     a non-breaking space keeps the line box height before reveal */
  var h1 = el("h1", null, "&nbsp;");
  if (pub.title.length > 70) h1.dataset.long = "true";
  titleSheet.appendChild(eyebrow);
  titleSheet.appendChild(h1);

  /* ---------- sheet 1: authors ---------- */
  var authorsSheet = el("div", "sheet sheet-authors");
  var authorsFlow = el("div", "authors-flow");
  authorsFlow.setAttribute("data-reveal-pending", "");
  authorsFlow.dataset.count =
    pub.authors.length <= 6 ? "few" : pub.authors.length <= 10 ? "some" : "many";
  pub.authors.forEach(function (name, i) {
    var s = el("span", "author-name");
    if (name === window.SITE_AUTHOR) s.classList.add("author-me");
    s.textContent = name;
    authorsFlow.appendChild(s);
    if (i < pub.authors.length - 1) authorsFlow.appendChild(document.createTextNode(",  "));
  });
  authorsSheet.appendChild(authorsFlow);

  /* ---------- sheet 2: venue ---------- */
  var venueSheet = el("div", "sheet sheet-venue");
  var venueBig = el("div", "venue-big", "&nbsp;");
  if (pub.venue.length > 10) venueBig.dataset.long = "true";
  var venueYear = el("div", "venue-year", "&nbsp;");
  var venueFull = el("div", "venue-full", pub.venueLong);
  venueFull.setAttribute("data-reveal-pending", "");
  venueSheet.appendChild(venueBig);
  venueSheet.appendChild(venueYear);
  venueSheet.appendChild(venueFull);

  /* ---------- sheet 3: introduction ---------- */
  var introSheet = el("div", "sheet sheet-abstract");
  var introText = el("p", "abstract-text",
    pub.abstract || "Introduction coming soon — add it in publications.js.");
  introText.setAttribute("data-reveal-pending", "");
  introSheet.appendChild(introText);

  /* ---------- sheet 4: video ---------- */
  var mediaSheet = el("div", "sheet sheet-media");
  var ph = el("div", "media-placeholder");
  ph.style.background = pub.accent.bg;
  ph.style.color = pub.accent.fg;
  ph.appendChild(el("span", "big-index", pub.index));
  ph.appendChild(el("span", "hint", "Video placeholder — drop media/" + pub.slug + ".mp4 to replace."));
  mediaSheet.appendChild(ph);
  var video = document.createElement("video");
  video.muted = true; video.loop = true; video.autoplay = true; video.playsInline = true;
  video.src = "media/" + pub.slug + ".mp4";
  video.style.display = "none";
  video.addEventListener("canplay", function () {
    video.style.display = "block";
    ph.style.display = "none";
  });
  mediaSheet.appendChild(video);

  /* ---------- sheet 5: bibtex ---------- */
  var bibSheet = el("div", "sheet sheet-bibtex");
  var bibHead = el("div", "sheet-heading");
  bibHead.style.justifyContent = "flex-end";
  var copyBtn = el("button", "copy-btn", "Copy");
  copyBtn.setAttribute("aria-label", "Copy BibTeX citation");
  bibHead.appendChild(copyBtn);
  bibSheet.appendChild(bibHead);
  var pre = document.createElement("pre");
  pre.textContent = pub.bibtex;
  bibSheet.appendChild(pre);

  var frames = [
    frame(titleSheet, null, 0),
    frame(authorsSheet, "Authors", 1),
    frame(venueSheet, "Venue", 2),
    frame(introSheet, "Introduction", 3),
    frame(mediaSheet, "Video", 4),
    frame(bibSheet, "BibTeX", 5),
  ];
  frames.forEach(function (f) { sheetsEl.appendChild(f); });
  var N = frames.length;
  var TOTAL_W = FRAME_W * N + 40 * (N - 1);

  /* ---------- per-sheet reveals (run once, on first arrival) ---------- */
  var revealed = [];
  function revealSheet(i) {
    if (revealed[i]) return;
    revealed[i] = true;
    if (i === 0) {
      window.scrambleReveal(h1, { text: pub.title });
    } else if (i === 1) {
      window.diffusionReveal(authorsFlow);
    } else if (i === 2) {
      window.scrambleReveal(venueBig, { text: pub.venue });
      window.scrambleReveal(venueYear, { text: pub.year, iterations: 6 });
      window.blurReveal(venueFull);
    } else if (i === 3) {
      window.blurReveal(introText);
    }
    /* video + bibtex keep the plain sheet fade */
  }

  /* ---------- layout + scroll ---------- */
  var fitScale = 1;
  var maxScroll = 0;
  var scroll = 0;
  var axis = null;
  var cancelledIntro = false;

  function layout() {
    fitScale = clamp(Math.min(window.innerWidth / 1300, window.innerHeight / 1020), 0.2, 1);
    maxScroll = (TOTAL_W - FRAME_W) * fitScale;
    ghost.style.width = "calc(100vw + " + maxScroll + "px)";
    ghost.style.height = "calc(100vh + " + maxScroll + "px)";
    var inv = 1 / fitScale;
    frames.forEach(function (f) {
      var l = f.querySelector(".sheet-label");
      if (l) {
        l.style.transform = "scale(" + inv + ")";
        l.style.top = -28 * inv + "px";
      }
    });
    requestRender();
  }

  var stickyTitle = el("div", "sticky-title", pub.title);
  stickyTitle.dataset.visible = "false";
  document.body.appendChild(stickyTitle);

  var lastX = 0, lastY = 0;
  window.addEventListener("scroll", function () {
    var x = window.scrollX, y = window.scrollY;
    if (axis === null) {
      if (x !== lastX) { axis = "x"; document.body.style.overflowY = "hidden"; }
      else if (y !== lastY) { axis = "y"; document.body.style.overflowX = "hidden"; }
    }
    lastX = x; lastY = y;
    if (axis === "x") scroll = x;
    else if (axis === "y") scroll = y;
    else return;
    if (!cancelledIntro) {
      cancelledIntro = true;
      root.dataset.cancelAnimation = "true";
    }
    // reveal the sheet we're arriving at (a bit before it centers)
    var idx = clamp(Math.round(scroll / (STRIDE * fitScale) + 0.25), 0, N - 1);
    revealSheet(idx);
    // persistent title once the title sheet is left behind
    stickyTitle.dataset.visible = scroll > STRIDE * fitScale * 0.45 ? "true" : "false";
    requestRender();
  }, { passive: true });

  var wheeling = false;
  var wheelTimer = null;
  window.addEventListener("wheel", function () {
    wheeling = true;
    focusScroll.jump(focusScroll.value);
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { wheeling = false; }, 150);
  }, { passive: true });

  var focusScroll = new Spring(0, { stiffness: 600, damping: 80, rest: 0.2 });
  frames.forEach(function (f, i) {
    f.addEventListener("focusin", function () {
      focusScroll.jump(document.documentElement.scrollTop);
      focusScroll.set(STRIDE * fitScale * i);
    });
    f.addEventListener("mousedown", function (e) {
      if (e.target.closest("button, a, pre") === null) e.preventDefault();
    });
  });

  /* ---------- entrance ---------- */
  var introScale = new Spring(reducedMotion ? 1 : 0, { stiffness: 320, damping: 60, mass: 0.2, rest: 1e-4 });
  var dockY = new Spring(reducedMotion ? 0 : 120, { stiffness: 400, damping: 40, mass: 0.4, rest: 0.01 });

  /* ---------- dock (2022.rauno.me port) ---------- */
  var dock = document.getElementById("dock");
  var dockCursorX = null;
  var dockButtons = []; // { el, w: Spring, top: Spring }

  var DIST = [-240, -192, -120, 0, 120, 192, 240];
  var SIZE = [40, 44, 56.56, 80, 56.56, 44, 40];
  function magnify(d) {
    if (d <= DIST[0] || d >= DIST[DIST.length - 1]) return 40;
    for (var i = 0; i < DIST.length - 1; i++) {
      if (d >= DIST[i] && d <= DIST[i + 1]) {
        var t = (d - DIST[i]) / (DIST[i + 1] - DIST[i]);
        return SIZE[i] + t * (SIZE[i + 1] - SIZE[i]);
      }
    }
    return 40;
  }

  dock.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    dockCursorX = e.clientX;
    wake();
  });
  dock.addEventListener("pointerleave", function () {
    dockCursorX = null;
    dockButtons.forEach(function (b) { b.w.set(40); });
  });

  var ICONS = {
    home: "<svg viewBox='0 0 24 24'><path d='M3 10.5 12 3l9 7.5'/><path d='M5.5 8.8V21h13V8.8'/></svg>",
    gallery: "<svg viewBox='0 0 24 24'><rect x='3.5' y='3.5' width='7.4' height='7.4' rx='1.5'/><rect x='13.1' y='3.5' width='7.4' height='7.4' rx='1.5'/><rect x='3.5' y='13.1' width='7.4' height='7.4' rx='1.5'/><rect x='13.1' y='13.1' width='7.4' height='7.4' rx='1.5'/></svg>",
    pdf: "<svg viewBox='0 0 24 24'><path d='M6 2.8h8.2L19.2 8v13.2H6z'/><path d='M14 3v5.2h5.2'/><path d='M9 13h6M9 16.5h6'/></svg>",
    page: "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='M3.5 12h17M12 3.2c-4.8 4.9-4.8 12.7 0 17.6M12 3.2c4.8 4.9 4.8 12.7 0 17.6'/></svg>",
    code: "<svg viewBox='0 0 24 24'><path d='m8.5 7.5-5 4.5 5 4.5M15.5 7.5l5 4.5-5 4.5'/></svg>",
    scholar: "<svg viewBox='0 0 24 24'><path d='M2.5 9.5 12 4.5l9.5 5-9.5 5z'/><path d='M6.5 11.7v4.6c0 1.4 2.5 2.9 5.5 2.9s5.5-1.5 5.5-2.9v-4.6'/><path d='M21.5 9.5v5'/></svg>",
    bibtex: "<svg viewBox='0 0 24 24'><path d='M9.5 5.5H5a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 5 18.5h4.5M14.5 5.5H19A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5h-4.5'/><path d='M12 3.5v17'/></svg>",
    check: "<svg viewBox='0 0 24 24'><path d='m5 12.5 4.5 4.5L19 7.5'/></svg>",
    sun: "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='4.2'/><path d='M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7'/></svg>",
    moon: "<svg viewBox='0 0 24 24'><path d='M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 1 0 10.7 10.7z'/></svg>",
  };

  function dockButton(opts) {
    var b = document.createElement(opts.href ? "a" : "button");
    b.className = "dock-btn";
    b.innerHTML = ICONS[opts.icon];
    b.setAttribute("data-tip", opts.tip);
    b.setAttribute("aria-label", opts.tip);
    if (opts.href) {
      b.href = opts.href;
      if (/^https?:/.test(opts.href)) { b.target = "_blank"; b.rel = "noopener noreferrer"; }
    }
    var entry = {
      el: b,
      w: new Spring(40, { stiffness: 500, damping: 40, mass: 1, rest: 0.05 }),
      top: new Spring(0, { stiffness: 250, damping: 19, rest: 0.05 }),
    };
    b.addEventListener("click", function () {
      entry.top.set(-40);
      setTimeout(function () { entry.top.set(0); }, 300);
      if (opts.onClick) opts.onClick();
    });
    dockButtons.push(entry);
    dock.appendChild(b);
    return b;
  }

  function dockSep() {
    dock.appendChild(el("div", "dock-sep"));
  }

  dockButton({ icon: "home", tip: "Home", href: "index.html" });
  dockButton({ icon: "gallery", tip: "All publications", href: "ai.html" });
  dockSep();
  var anyLink = false;
  if (pub.links.pdf) { dockButton({ icon: "pdf", tip: "Full PDF", href: pub.links.pdf }); anyLink = true; }
  if (pub.links.page) { dockButton({ icon: "page", tip: "Paper page", href: pub.links.page }); anyLink = true; }
  if (pub.links.code) { dockButton({ icon: "code", tip: "Code", href: pub.links.code }); anyLink = true; }
  if (pub.links.scholar) { dockButton({ icon: "scholar", tip: "Google Scholar", href: pub.links.scholar }); anyLink = true; }
  if (anyLink) dockSep();

  var copyLive = document.getElementById("copyLive");
  var copyDockBtn = dockButton({
    icon: "bibtex", tip: "Copy BibTeX",
    onClick: function () { doCopy(copyDockBtn); },
  });
  var isDark = document.documentElement.classList.contains("dark");
  var themeBtn = dockButton({
    icon: isDark ? "sun" : "moon",
    tip: isDark ? "Light mode" : "Dark mode",
    onClick: function () {
      var dark = document.documentElement.classList.toggle("dark");
      document.documentElement.classList.toggle("light", !dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
      themeBtn.innerHTML = ICONS[dark ? "sun" : "moon"];
      themeBtn.setAttribute("data-tip", dark ? "Light mode" : "Dark mode");
      themeBtn.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
    },
  });

  var copyTimer = null;
  function doCopy(btn) {
    navigator.clipboard && navigator.clipboard.writeText(pub.bibtex);
    copyLive.textContent = "Copied BibTeX to clipboard";
    copyBtn.textContent = "Copied";
    if (btn) {
      btn.innerHTML = ICONS.check;
      btn.setAttribute("data-tip", "Copied");
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      copyLive.textContent = "";
      copyBtn.textContent = "Copy";
      if (btn) {
        btn.innerHTML = ICONS.bibtex;
        btn.setAttribute("data-tip", "Copy BibTeX");
      }
    }, 1200);
  }
  copyBtn.addEventListener("click", function () { doCopy(copyDockBtn); });

  /* ---------- render ---------- */
  function render() {
    sheetsEl.style.transform = "translateX(" + -scroll + "px) scale(" + fitScale + ")";
    frames[0].style.transform = "scale(" + introScale.value + ")";
    dock.style.transform = "translateX(-50%) translateY(" + dockY.value + "px)";

    if (dockCursorX !== null) {
      dockButtons.forEach(function (b) {
        var r = b.el.getBoundingClientRect();
        b.w.set(magnify(dockCursorX - (r.left + r.width / 2)));
      });
    }
    dockButtons.forEach(function (b) {
      var s = b.w.value;
      b.el.style.width = s + "px";
      b.el.style.height = s + "px";
      b.el.style.top = b.top.value + "px";
    });

    if (focusScroll.value !== focusScroll.target || active.has(focusScroll)) {
      document.documentElement.scrollTop = focusScroll.value;
    }
  }

  /* ---------- init ---------- */
  window.history.scrollRestoration = "manual";
  document.documentElement.scrollTo(0, 0);
  layout();
  window.addEventListener("resize", layout);
  sheetsEl.style.opacity = "1";
  introScale.set(1);
  setTimeout(function () { revealSheet(0); }, reducedMotion ? 0 : 260);
  setTimeout(function () { dockY.set(0); }, reducedMotion ? 0 : 400);
  requestRender();
})();
