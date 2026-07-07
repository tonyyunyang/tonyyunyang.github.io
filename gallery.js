/* Gallery page: builds the minimap and the publication/blog grids. */
(function () {
  "use strict";

  /* ---- minimap: static ruler, active tracker at the gallery slot ---- */
  var ROUTES = [
    { href: "index.html", x: 0, label: "Home" },
    { href: "ai.html", x: 80, label: "AI Research" },
    { href: "projects.html", x: 140, label: "Projects" },
  ];
  var ACTIVE_X = 80; // this page's slot (the /craft position on the original)
  var mm = document.getElementById("minimap");
  for (var i = 0; i < 20; i++) {
    var line = document.createElement("div");
    line.className = "line";
    // hide ticks underneath any tracker: 0 <= x + 32 - 10i < 34
    var hidden = ROUTES.some(function (r) {
      var d = r.x + 32 - 10 * i;
      return d >= 0 && d < 34;
    });
    if (hidden) line.dataset.hidden = "true";
    mm.appendChild(line);
  }
  ROUTES.forEach(function (r) {
    var a = document.createElement("a");
    a.className = "tracker";
    a.href = r.href;
    a.setAttribute("aria-label", r.label);
    a.style.transform = "translateX(" + r.x + "px)";
    mm.appendChild(a);
  });
  var active = document.createElement("div");
  active.className = "tracker";
  active.dataset.active = "true";
  active.style.transform = "translateX(" + ACTIVE_X + "px)";
  active.style.pointerEvents = "none";
  mm.appendChild(active);

  /* ---- publication cards ---- */
  function mediaBlock(pub) {
    var media = document.createElement("div");
    media.className = "card-media";
    var ph = document.createElement("div");
    ph.className = "card-placeholder";
    ph.style.background = pub.accent.bg;
    ph.innerHTML = "<span style='color:" + pub.accent.fg + "'>" + pub.index + "</span>";
    media.appendChild(ph);
    var video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.src = "media/" + pub.slug + ".mp4";
    video.style.display = "none";
    video.addEventListener("canplay", function () {
      video.style.display = "block";
    });
    media.appendChild(video);
    return media;
  }

  function pubCard(pub) {
    var a = document.createElement("a");
    a.className = "card";
    a.dataset.interactive = "true";
    a.href = "paper.html?p=" + encodeURIComponent(pub.slug);
    a.setAttribute("aria-label", pub.title);

    a.appendChild(mediaBlock(pub));

    var cap = document.createElement("div");
    cap.className = "card-caption";
    cap.innerHTML =
      "<div class='title'>" + pub.title + "</div>" +
      "<div class='meta'>" + pub.venue + " · " + pub.year + "</div>";
    a.appendChild(cap);

    var btn = document.createElement("div");
    btn.setAttribute("data-fake-button", "");
    btn.textContent = "View Paper";
    a.appendChild(btn);
    return a;
  }

  function fillColumns(gridEl, cards, nCols) {
    var cols = [];
    for (var c = 0; c < nCols; c++) {
      var col = document.createElement("div");
      col.className = "column";
      gridEl.appendChild(col);
      cols.push(col);
    }
    cards.forEach(function (card, i) {
      cols[i % nCols].appendChild(card);
    });
  }

  var pubCards = window.PUBLICATIONS.map(pubCard);
  fillColumns(document.getElementById("pubGrid"), pubCards, 3);

  /* ---- blog: real posts if any, else a space-holder ---- */
  var blogCards = (window.BLOG_POSTS || []).map(function (post) {
    var a = document.createElement("a");
    a.className = "card";
    a.dataset.interactive = "true";
    a.href = post.href;
    var media = document.createElement("div");
    media.className = "card-media";
    media.style.background = "var(--colors-gray3)";
    a.appendChild(media);
    var cap = document.createElement("div");
    cap.className = "card-caption";
    cap.innerHTML =
      "<div class='title'>" + post.title + "</div>" +
      "<div class='meta'>" + (post.date || "") + "</div>";
    a.appendChild(cap);
    return a;
  });

  /* decode the heading + section labels (born empty via data-text: no flash) */
  if (window.scrambleReveal) {
    document.querySelectorAll("[data-text]").forEach(function (l) {
      window.scrambleReveal(l, { text: l.getAttribute("data-text"), iterations: 8 });
    });
  }

  if (blogCards.length === 0) {
    var holder = document.createElement("div");
    holder.className = "card card-empty";
    var media = document.createElement("div");
    media.className = "card-media";
    var ph = document.createElement("div");
    ph.className = "card-placeholder";
    ph.innerHTML =
      "<p>Nothing here yet. Blog posts will join the gallery — add them in publications.js.</p>";
    media.appendChild(ph);
    holder.appendChild(media);
    blogCards = [holder];
  }
  fillColumns(document.getElementById("blogGrid"), blogCards, 3);

  /* staggered card entrance, echoing the landing choreography */
  document.querySelectorAll(".card").forEach(function (card, i) {
    card.dataset.animate = "true";
    card.style.animationDelay = 0.15 + i * 0.06 + "s";
  });
})();
