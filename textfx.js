/* ============================================================
   Text reveal effects.

   scrambleReveal is a vanilla port of the exact algorithm on
   rauno.me/projects: a reveal sweep moves left to right with a
   window of `iterations` random glyphs (case-matched pools)
   racing ahead of the locked-in text, stepped at `fps`.
   `step` advances multiple characters per frame so long strings
   still finish in about a second.

   diffusionReveal resolves characters out of blurred noise at
   randomized delays — a quick "denoising" pass.
   ============================================================ */

(function () {
  "use strict";

  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function glyphFor(type) {
    var pool = "";
    if (type === "lowerCase") pool = "abcdefghijklmnopqrstuvwxyz0123456789";
    else if (type === "upperCase") pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    else if (type === "symbol") pool = ",.?/\\(^)![]{}*&^%$#'\"";
    else return "";
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function classify(ch) {
    if (/\s/.test(ch)) return "space";
    if (/[a-z]/.test(ch)) return "lowerCase";
    if (/[A-Z]/.test(ch)) return "upperCase";
    return "symbol";
  }

  window.scrambleReveal = function (el, opts) {
    opts = opts || {};
    var iterations = opts.iterations || 10;
    var fps = opts.fps || 30;
    /* pass opts.text and keep the element empty until reveal time —
       the text types in from nothing, so there is no flash */
    var text = opts.text || el.textContent;
    var chars = text.split("");
    var types = chars.map(classify);
    var visible = [];
    chars.forEach(function (c, i) { if (types[i] !== "space") visible.push(i); });
    // advance several chars per frame so total time stays ~1s
    var step = opts.step || Math.max(1, Math.ceil(visible.length / 24));

    if (REDUCED) { el.textContent = text; return; }

    el.textContent = "";
    var timer = null;
    (function frame(a) {
      var out = chars.slice();
      var n = visible.length;
      if (a > n) {
        el.textContent = text;
        if (opts.onComplete) opts.onComplete(el);
        return;
      }
      for (var p = Math.max(a, 0); p < n; p++) {
        if (p < a + iterations) out[visible[p]] = glyphFor(types[visible[p]]);
        else out[visible[p]] = "";
      }
      el.textContent = out.join("");
      timer = setTimeout(function () { frame(a + step); }, 1000 / fps);
    })(-iterations);

    return function cancel() { clearTimeout(timer); el.textContent = text; };
  };

  /* Wraps every character (walking text nodes, so markup like <b>
     survives) and resolves them from blur+offset noise. */
  window.diffusionReveal = function (el, opts) {
    opts = opts || {};
    var maxDelay = opts.maxDelay || 450;
    var duration = opts.duration || 380;
    if (REDUCED) { el.removeAttribute("data-reveal-pending"); return; }

    var spans = [];
    (function walk(node) {
      Array.from(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var fragment = document.createDocumentFragment();
          child.textContent.split("").forEach(function (ch) {
            var s = document.createElement("span");
            s.textContent = ch;
            s.style.display = "inline-block";
            if (/\s/.test(ch)) s.style.whiteSpace = "pre";
            fragment.appendChild(s);
            spans.push(s);
          });
          node.replaceChild(fragment, child);
        } else if (child.nodeType === 1) walk(child);
      });
    })(el);

    spans.forEach(function (s) {
      var delay = Math.random() * maxDelay;
      var dx = (Math.random() - 0.5) * 14;
      var dy = (Math.random() - 0.5) * 10;
      s.style.opacity = "0";
      s.style.filter = "blur(" + (6 + Math.random() * 8) + "px)";
      s.style.transform = "translate(" + dx + "px," + dy + "px)";
      s.style.transition =
        "opacity " + duration + "ms ease " + delay + "ms," +
        "filter " + duration + "ms ease " + delay + "ms," +
        "transform " + duration + "ms cubic-bezier(.2,.8,.2,1) " + delay + "ms";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          s.style.opacity = "1";
          s.style.filter = "blur(0)";
          s.style.transform = "translate(0,0)";
        });
      });
    });
    /* chars are now individually hidden — safe to show the container */
    el.removeAttribute("data-reveal-pending");
  };

  /* Quick blur-in for whole blocks (paragraphs). */
  window.blurReveal = function (el, opts) {
    opts = opts || {};
    if (REDUCED) { el.removeAttribute("data-reveal-pending"); return; }
    el.style.opacity = "0";
    el.style.filter = "blur(14px)";
    el.removeAttribute("data-reveal-pending");
    el.style.transition =
      "opacity " + (opts.duration || 550) + "ms ease, filter " +
      (opts.duration || 550) + "ms ease";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = "1";
        el.style.filter = "blur(0)";
      });
    });
  };
})();
