/* ============================================================
   Replica of raunofreiberg.com landing page — behavior.

   All constants below were extracted from the site's actual
   Next.js bundle (pages/index chunk + _app chunk):

   - frames: 1200x720, stride 1240 (40px gap), 8 frames
   - fit scale  = clamp(min(vw/1300, vh/1020), 0.2, 1)
   - max scroll = (totalWidth - 1200) * min(fitScale, 0.6)
   - container transform = translateX(-scroll) scale(spring)
   - scale spring (500, 50); while scrolling the target decays
     by scroll*1e-4 per scroll event, clamped to [0.6, fit]
   - slide parallax: spring (500, 40), starts past (1240/3)*i,
     clamped to each frame's `max` (DD 527, Craft 330, Projects 1373)
   - minimap tracker: spring (620, 45, mass 0.2), range 0..160
   - focus scroll: spring (600, 80) to 744*index
   - entrance: main scale (320, 60, 0.2), circle (600, 80, 0.2,
     delay .4), text lines (240, 32, 0.1, delay .2 + i*.1)
   - email flip: spring (280, 32), +/-90px
   ============================================================ */

(function () {
  "use strict";

  const FRAME_W = 1200;
  const STRIDE = 1240;
  const N_FRAMES = 8;
  const TOTAL_W = FRAME_W * N_FRAMES + (N_FRAMES - 1) * 40; // 9880
  const MINIMAP_RANGE = 160; // tracker travel in px
  const MINIMAP_TICKS = 20;
  const MINIMAP_TICK_STRIDE = 10; // 1px line + 9px gap

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const SLIDE_STEP = STRIDE / (coarse ? 5 : 3);

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  /* ---------------- spring engine ---------------- */

  const activeSprings = new Set();
  let rafId = null;
  let lastTime = 0;
  let renderRequested = false;

  class Spring {
    constructor(value, { stiffness = 100, damping = 10, mass = 1, restSpeed = 0.005, restDelta = 0.005 } = {}) {
      this.value = value;
      this.target = value;
      this.velocity = 0;
      this.stiffness = stiffness;
      this.damping = damping;
      this.mass = mass;
      this.restSpeed = restSpeed;
      this.restDelta = restDelta;
      this.onUpdate = null;
    }
    set(target) {
      if (target === this.target && !activeSprings.has(this)) return;
      this.target = target;
      activeSprings.add(this);
      wake();
    }
    jump(value) {
      this.value = value;
      this.target = value;
      this.velocity = 0;
      activeSprings.delete(this);
      requestRender();
    }
    stop() {
      this.target = this.value;
      this.velocity = 0;
      activeSprings.delete(this);
    }
    step(dt) {
      // semi-implicit Euler with substepping for stability
      const steps = Math.max(1, Math.ceil(dt / 0.004));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        const accel = (this.stiffness * (this.target - this.value) - this.damping * this.velocity) / this.mass;
        this.velocity += accel * h;
        this.value += this.velocity * h;
      }
      if (Math.abs(this.velocity) < this.restSpeed && Math.abs(this.target - this.value) < this.restDelta) {
        this.value = this.target;
        this.velocity = 0;
        return true; // at rest
      }
      return false;
    }
  }

  function wake() {
    if (rafId === null) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  }

  function requestRender() {
    renderRequested = true;
    wake();
  }

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.064);
    lastTime = now;
    for (const s of activeSprings) {
      const done = s.step(dt);
      if (s.onUpdate) s.onUpdate(s.value);
      if (done) activeSprings.delete(s);
    }
    render();
    renderRequested = false;
    rafId = activeSprings.size > 0 ? requestAnimationFrame(tick) : null;
  }

  /* ---------------- elements ---------------- */

  const root = document.getElementById("root");
  const ghost = document.getElementById("ghost");
  const frames = document.getElementById("frames");
  const mainContainer = document.getElementById("mainContainer");
  const mainCircle = document.getElementById("mainCircle");
  const cross = document.getElementById("cross");
  const revealSpans = Array.from(document.querySelectorAll("[data-reveal]"));
  const labels = Array.from(document.querySelectorAll(".label"));
  const slideFrames = Array.from(document.querySelectorAll("[data-slide-max]")).map((frame) => ({
    threshold: SLIDE_STEP * Number(frame.dataset.frameIndex),
    max: Number(frame.dataset.slideMax),
    contents: frame.querySelector("[data-slide-contents]"),
    spring: new Spring(0, { stiffness: 500, damping: 40 }),
  }));

  /* ---------------- layout state ---------------- */

  let fitScale = 1;   // scale that fits the main frame in the viewport
  let maxScroll = 0;  // ghost extension = scrollable length
  let scroll = 0;     // current scroll offset (locked axis)
  let axis = null;    // 'x' | 'y' — first axis to move wins
  let cancelledIntro = false;

  const scale = new Spring(1, { stiffness: 500, damping: 50 });
  const minimapX = new Spring(0, { stiffness: 620, damping: 45, mass: 0.2 });

  function computeLayout() {
    fitScale = clamp(Math.min(window.innerWidth / 1300, window.innerHeight / 1020), 0.2, 1);
    if (scale.value !== 0.6) scale.jump(fitScale);
    const t = Math.min(fitScale, 0.6);
    maxScroll = (TOTAL_W - FRAME_W) * t;
    ghost.style.width = `calc(100vw + ${maxScroll}px)`;
    ghost.style.height = `calc(100vh + ${maxScroll}px)`;
  }

  /* ---------------- scroll handling ---------------- */

  function onScrollChange(offset) {
    if (wheeling) focusScroll.stop();
    if (p1Revealed && offset > 0) hidePlayerOne();
    if (!cancelledIntro) {
      cancelledIntro = true;
      root.dataset.cancelAnimation = "true";
    }
    // zoom out toward 0.6 as you scroll; zoom back in at offset 0
    let target = fitScale;
    if (offset > 0) target = clamp(scale.value - offset * 1e-4, 0.6, fitScale);
    scale.set(target);

    // minimap tracker
    minimapX.set(maxScroll > 0 ? clamp(offset / maxScroll, 0, 1) * MINIMAP_RANGE : 0);

    // slide parallax (original keeps last target while 0 < offset <= threshold)
    for (const s of slideFrames) {
      if (offset === 0) s.spring.set(0);
      else if (offset > s.threshold) s.spring.set(-1 * clamp(offset - s.threshold, 0, s.max));
    }
    requestRender();
  }

  let lastX = 0;
  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const x = window.scrollX;
      const y = window.scrollY;
      if (axis === null) {
        if (x !== lastX) {
          axis = "x";
          document.body.style.overflowY = "hidden";
        } else if (y !== lastY) {
          axis = "y";
          document.body.style.overflowX = "hidden";
        }
      }
      lastX = x;
      lastY = y;
      if (axis === "x") scroll = x;
      else if (axis === "y") scroll = y;
      else return;
      onScrollChange(scroll);
    },
    { passive: true }
  );

  let wheeling = false;
  let wheelTimer = null;
  window.addEventListener(
    "wheel",
    (e) => {
      wheeling = true;
      focusScroll.stop();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => (wheeling = false), 150);

      // player one: sustained upward intent at the very start goes backwards
      if (!p1Revealed && e.deltaY < 0 && window.scrollY <= 0 && window.scrollX <= 0) {
        p1Accum += -e.deltaY;
        clearTimeout(p1AccumTimer);
        p1AccumTimer = setTimeout(() => (p1Accum = 0), 900);
        if (p1Accum >= 320) revealPlayerOne();
      } else if (p1Revealed && e.deltaY > 2) {
        hidePlayerOne();
      }
    },
    { passive: true }
  );

  /* ---------------- keyboard focus: scroll frame to center ---------------- */

  const focusScroll = new Spring(0, { stiffness: 600, damping: 80, restSpeed: 0.2, restDelta: 0.2 });
  focusScroll.onUpdate = (v) => {
    document.documentElement.scrollTop = v;
  };

  document.querySelectorAll(".frame[data-frame-index]").forEach((frame) => {
    const index = Number(frame.dataset.frameIndex);
    frame.addEventListener("focusin", () => {
      focusScroll.jump(document.documentElement.scrollTop);
      focusScroll.set(744 * index);
    });
    // don't grab focus (or trigger focus scrolling) on mouse clicks
    frame.addEventListener("mousedown", (e) => e.preventDefault());
  });

  /* ---------------- render ---------------- */

  let lastScale = -1;
  function render() {
    // player one: shift the whole row one stride backwards while revealed
    const shift = revealShift.value * STRIDE * scale.value;
    if (!coarse) {
      frames.style.transform = `translateX(${-scroll + shift}px) scale(${scale.value})`;
    } else {
      frames.style.transform = `translateX(${shift}px) scale(${scale.value})`;
    }

    if (scale.value !== lastScale) {
      lastScale = scale.value;
      const inv = 1 / scale.value;
      for (const label of labels) {
        label.style.transform = `scale(${inv})`;
        label.style.top = `${-28 * inv}px`;
      }
    }

    for (const s of slideFrames) {
      s.contents.style.transform = `translateX(${s.spring.value}px)`;
    }

    // minimap: move tracker, hide ticks underneath it
    tracker.style.transform = `translateX(${minimapX.value}px)`;
    for (let i = 0; i < MINIMAP_TICKS; i++) {
      const d = minimapX.value - (i * MINIMAP_TICK_STRIDE - 30) + 2;
      ticks[i].style.opacity = d >= 0 && d < 34 ? "0" : "1";
    }

    // entrance animation values
    mainContainer.style.transform = `scale(${introScale.value})`;
    mainCircle.style.transform = `scale(${circleScale.value})`;
    revealSpans.forEach((span, i) => {
      span.style.transform = `translateY(${lineSprings[i].value}px)`;
    });

    // email flip
    emailLabel.style.transform = `translateY(${-90 * emailFlip.value}px)`;
    copiedLabel.style.transform = `translateY(${90 * (1 - emailFlip.value)}px)`;
  }

  /* ---------------- minimap construction ---------------- */

  const minimapInner = document.getElementById("minimapInner");
  const ticks = [];
  for (let i = 0; i < MINIMAP_TICKS; i++) {
    const line = document.createElement("div");
    line.className = "line";
    minimapInner.appendChild(line);
    ticks.push(line);
  }
  const tracker = document.createElement("div");
  tracker.className = "tracker";
  minimapInner.appendChild(tracker);

  /* ---------------- entrance animation ---------------- */

  const introScale = new Spring(0, { stiffness: 320, damping: 60, mass: 0.2, restSpeed: 1e-4, restDelta: 1e-4 });
  const circleScale = new Spring(0, { stiffness: 600, damping: 80, mass: 0.2, restSpeed: 1e-4, restDelta: 1e-4 });
  const lineSprings = revealSpans.map(
    () => new Spring(100, { stiffness: 240, damping: 32, mass: 0.1, restSpeed: 1e-4, restDelta: 1e-4 })
  );

  /* ---------------- email copy ---------------- */

  const emailFlip = new Spring(0, { stiffness: 280, damping: 32 });
  const emailLabel = document.getElementById("emailLabel");
  const copiedLabel = document.getElementById("copiedLabel");
  const copyLive = document.getElementById("copyLive");
  const copyButton = document.getElementById("copyEmail");
  let copiedTimer = null;

  copyButton.addEventListener("click", () => {
    navigator.clipboard && navigator.clipboard.writeText("tonyyunyang@outlook.com");
    emailFlip.set(1);
    copyLive.textContent = "Copied email to clipboard";
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      emailFlip.set(0);
      copyLive.textContent = "";
    }, 1000);
  });

  // The cross sits fixed at the viewport center, right above the email
  // button when the contact frame is centered — let clicks through to it.
  window.addEventListener("mousedown", (e) => {
    if (document.elementsFromPoint(e.clientX, e.clientY).includes(copyButton)) {
      cross.style.setProperty("pointer-events", "none");
    } else {
      cross.style.removeProperty("pointer-events");
    }
  });

  /* ---------------- debug (wireframe) mode ---------------- */

  cross.addEventListener("click", () => {
    root.dataset.debug = root.dataset.debug === "true" ? "false" : "true";
  });

  /* ---------------- player one: the frame before the beginning ---------------- */

  const playerOne = document.getElementById("playerOne");
  const p1Hint = document.getElementById("p1Hint");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealShift = new Spring(0, { stiffness: 260, damping: 28, restSpeed: 1e-4, restDelta: 1e-4 });
  let p1Revealed = false;
  let p1Accum = 0;
  let p1AccumTimer = null;
  let p1Found = false;
  try {
    p1Found = localStorage.getItem("playerOneFound") === "true";
  } catch (e) {}

  function revealPlayerOne() {
    if (p1Revealed) return;
    p1Revealed = true;
    p1Accum = 0;
    if (!cancelledIntro) {
      cancelledIntro = true;
      root.dataset.cancelAnimation = "true";
    }
    playerOne.dataset.revealed = "true";
    playerOne.removeAttribute("aria-hidden");
    p1Hint.dataset.show = "false"; // the riddle has been answered — retire it while the card is up
    ensureAudio(); // the hint-chip path arrives here inside a click — unlock now
    if (reducedMotion) revealShift.jump(1);
    else revealShift.set(1);
    minimapX.set(-14); // the tracker slides off the map — you went backwards
    try {
      localStorage.setItem("playerOneFound", "true");
    } catch (e) {}
    requestRender();
  }

  function hidePlayerOne() {
    if (!p1Revealed) return;
    p1Revealed = false;
    playerOne.dataset.revealed = "false";
    playerOne.setAttribute("aria-hidden", "true");
    p1Hint.dataset.show = "true";
    if (reducedMotion) revealShift.jump(0);
    else revealShift.set(0);
    minimapX.set(maxScroll > 0 ? clamp(scroll / maxScroll, 0, 1) * MINIMAP_RANGE : 0);
    requestRender();
  }

  p1Hint.addEventListener("click", () => (p1Revealed ? hidePlayerOne() : revealPlayerOne()));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePlayerOne();
  });
  // the hint surfaces sooner for players who already found the key
  setTimeout(() => {
    if (!p1Revealed) p1Hint.dataset.show = "true";
  }, p1Found ? 1600 : 5200);

  /* ---------------- the spectrum: every field has a frequency ----------------
     Eight fields of AI research left-to-right; crossing a zone plays its note.
     C-major pentatonic over two octaves, so any sweep is consonant. */

  const band = document.getElementById("p1Band");
  const specHint = document.getElementById("p1SpecHint");
  const hzLabel = document.getElementById("p1Hz");
  const specLabels = Array.from(document.querySelectorAll(".p1-spec-labels span"));
  const N_BARS = 56;
  const N_ZONES = 8;
  const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  const bars = [];
  for (let i = 0; i < N_BARS; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    // a deterministic wave, so the band always looks like a captured signal
    const h = 16 + 34 * (0.5 + 0.5 * Math.sin(i * 0.55)) * (0.62 + 0.38 * Math.sin(i * 0.21 + 2));
    bar.style.height = `${clamp(h, 12, 56).toFixed(1)}px`;
    band.appendChild(bar);
    bars.push(bar);
  }

  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  // browsers keep audio locked until the first activation gesture anywhere;
  // catch every kind so the very first natural interaction unlocks it —
  // and if the cursor is already on the band, that gesture plays its note
  ["pointerdown", "pointerup", "keydown", "touchend"].forEach((t) =>
    window.addEventListener(
      t,
      () => {
        const ctx = ensureAudio();
        if (!ctx || ctx.state === "running") return;
        ctx
          .resume()
          .then(() => {
            if (specZone >= 0) {
              specHint.dataset.hidden = "true";
              hzLabel.textContent = `${Math.round(NOTES[specZone])} Hz`;
              playNote(NOTES[specZone]);
            }
          })
          .catch(() => {});
      },
      { passive: true }
    )
  );

  function playNote(freq) {
    const ctx = ensureAudio();
    if (!ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator(); // fundamental
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    const shimmer = ctx.createOscillator(); // one soft octave up, music-box style
    shimmer.type = "triangle";
    shimmer.frequency.value = freq * 2;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.16;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(gain);
    osc.start(t);
    shimmer.start(t);
    osc.stop(t + 0.75);
    shimmer.stop(t + 0.75);
  }

  let specZone = -1;
  let specIdleTimer = null;
  function setSpecZone(zone) {
    if (zone === specZone) return;
    specZone = zone;
    playNote(NOTES[zone]);
    specLabels.forEach((s) => (s.dataset.active = String(Number(s.dataset.zone) === zone)));
    hzLabel.textContent = `${Math.round(NOTES[zone])} Hz`;
    if (!audioCtx || audioCtx.state !== "running") {
      // the browser is still holding the sound hostage
      specHint.textContent = "one click wakes the sound.";
      specHint.dataset.hidden = "false";
      hzLabel.textContent = ` · ${hzLabel.textContent}`;
    } else {
      specHint.dataset.hidden = "true";
    }
    window.__p1 = { zone, freq: NOTES[zone] }; // for tests
    clearTimeout(specIdleTimer);
  }

  let barOffsets = null; // bar centers in band-local layout px (offsetLeft is
  // relative to the positioned .frame, so subtract the band's own offset)
  band.addEventListener("pointermove", (e) => {
    const rect = band.getBoundingClientRect();
    if (rect.width === 0) return;
    const frac = clamp((e.clientX - rect.left) / rect.width, 0, 0.999);
    setSpecZone(Math.floor(frac * N_ZONES));
    if (!barOffsets) {
      const bandLeft = band.getBoundingClientRect().left;
      const pxs = rect.width / band.offsetWidth;
      barOffsets = bars.map((bar) => (bar.getBoundingClientRect().left - bandLeft) / pxs + 1);
    }
    // dock-style magnification around the cursor (the card lives in a scaled
    // container, so convert layout offsets into on-screen pixels)
    const pxScale = rect.width / band.offsetWidth;
    for (let i = 0; i < bars.length; i++) {
      const cx = rect.left + barOffsets[i] * pxScale;
      const d = Math.abs(cx - e.clientX);
      const s = 1 + 1.15 * Math.exp(-(d * d) / (2 * 56 * 56 * pxScale * pxScale));
      bars[i].style.transform = `scaleY(${s.toFixed(3)})`;
      // the band turns copper under your hand — the key's metal
      bars[i].style.backgroundColor = d < 34 * pxScale ? "#B87333" : "";
    }
  });

  band.addEventListener("pointerleave", () => {
    specZone = -1;
    for (const bar of bars) {
      bar.style.transform = "";
      bar.style.backgroundColor = "";
    }
    specLabels.forEach((s) => (s.dataset.active = "false"));
    clearTimeout(specIdleTimer);
    specIdleTimer = setTimeout(() => {
      hzLabel.textContent = "";
      specHint.textContent = "run your cursor across it.";
      specHint.dataset.hidden = "false";
    }, 1400);
  });

  /* ---------------- wittgenstein follows the cursor ----------------
     The Nähr photograph, halftoned into a particle field (media/witt.png,
     alpha channel = ink). Each dot springs to its place in the portrait,
     scatters around the cursor, and the whole head leans after it. */

  const wittCanvas = document.getElementById("wittCanvas");
  if (wittCanvas && wittCanvas.getContext) {
    const wittImg = new Image();
    wittImg.onload = () => {
      const GW = wittImg.width;
      const GH = wittImg.height;
      let ink;
      try {
        const oc = document.createElement("canvas");
        oc.width = GW;
        oc.height = GH;
        const octx = oc.getContext("2d", { willReadFrequently: true });
        octx.drawImage(wittImg, 0, 0);
        ink = octx.getImageData(0, 0, GW, GH).data;
      } catch (e) {
        return; // canvas tainted (file://) — the words stand alone
      }
      const CH = 696; // layout px inside the 1200×720 sheet
      const CW = Math.round((CH * GW) / GH);
      const DPR = Math.min(2, window.devicePixelRatio || 1);
      wittCanvas.style.width = `${CW}px`;
      wittCanvas.style.height = `${CH}px`;
      wittCanvas.width = CW * DPR;
      wittCanvas.height = CH * DPR;
      const ctx = wittCanvas.getContext("2d");
      ctx.scale(DPR, DPR);

      // one ink-dot sprite, stamped thousands of times
      const SPR = 32;
      const spr = document.createElement("canvas");
      spr.width = spr.height = SPR;
      const sctx = spr.getContext("2d");
      sctx.fillStyle = "#000";
      sctx.beginPath();
      sctx.arc(SPR / 2, SPR / 2, SPR / 2 - 1, 0, Math.PI * 2);
      sctx.fill();

      let seed = 20260707; // deterministic scatter
      const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

      const step = CW / GW;
      const fadeStart = 0.64 * CH; // dots dissolve before the answer's lines
      const fadeEnd = 0.78 * CH;
      // the question's lines cross the hair — cap those dots whisper-quiet,
      // feathered over 34px so no seam cuts across the head
      const capX = CW - 71; // right edge of "…the world?" in canvas space
      const capY = 200; // baseline of the question's second line
      const parts = [];
      for (let gy = 0; gy < GH; gy++) {
        for (let gx = 0; gx < GW; gx++) {
          const a = ink[(gy * GW + gx) * 4 + 3];
          if (a < 26) continue;
          const t = a / 255;
          const rx = (gx + 0.5) * step;
          const ry = (gy + 0.5) * step;
          let alpha = 0.1 + 0.22 * t;
          if (ry > fadeStart) alpha *= Math.max(0.05, 1 - (ry - fadeStart) / (fadeEnd - fadeStart));
          const inX = rx < capX ? 1 : Math.max(0, 1 - (rx - capX) / 34);
          const inY = ry < capY ? 1 : Math.max(0, 1 - (ry - capY) / 34);
          const inside = Math.min(inX, inY);
          alpha = Math.min(alpha, 0.32 - inside * 0.16);
          if (alpha < 0.02) continue;
          parts.push({
            rx,
            ry,
            x: rx + (rand() - 0.5) * 320,
            y: ry + (rand() - 0.5) * 320,
            vx: 0,
            vy: 0,
            r: 0.9 + 2.1 * t,
            a: alpha,
            depth: 0.92 + rand() * 0.16, // near-coherent lean keeps the print crisp
          });
        }
      }

      window.__witt = parts; // for tests

      const wpx = { x: -1e4, y: -1e4, dirty: true };
      window.addEventListener(
        "pointermove",
        (e) => {
          wpx.x = e.clientX;
          wpx.y = e.clientY;
          wpx.dirty = true;
        },
        { passive: true }
      );

      const par = { x: 0, y: 0 };
      let ramp = 0; // particles assemble into the portrait on first sight
      let still = 0;
      let raf = null;

      const draw = () => {
        ctx.clearRect(0, 0, CW, CH);
        for (const p of parts) {
          ctx.globalAlpha = p.a * ramp;
          ctx.drawImage(spr, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        }
        ctx.globalAlpha = 1;
      };

      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (still > 45 && !wpx.dirty) return; // settled — sleep until the cursor moves
        const rect = wittCanvas.getBoundingClientRect();
        if (rect.width === 0) return;
        const s = rect.width / CW;
        const mx = (wpx.x - rect.left) / s;
        const my = (wpx.y - rect.top) / s;
        const near = mx > -CW && mx < CW * 2 && my > -CH && my < CH * 2;
        const parTX = near ? clamp((mx - CW / 2) / 44, -7, 7) : 0;
        const parTY = near ? clamp((my - CH * 0.42) / 70, -5, 5) : 0;
        par.x += (parTX - par.x) * 0.05;
        par.y += (parTY - par.y) * 0.05;
        if (ramp < 1) ramp = Math.min(1, ramp + 0.016);

        const K = 0.045;
        const DAMP = 0.86;
        const R = 85;
        const F = 2.6;
        let maxV = Math.abs(parTX - par.x) + Math.abs(parTY - par.y) + (1 - ramp);
        for (const p of parts) {
          let ax = (p.rx + par.x * p.depth - p.x) * K;
          let ay = (p.ry + par.y * p.depth - p.y) * K;
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 1e-4) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * (1 - d / R) * F;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
          p.vx = (p.vx + ax) * DAMP;
          p.vy = (p.vy + ay) * DAMP;
          p.x += p.vx;
          p.y += p.vy;
          const sp = Math.abs(p.vx) + Math.abs(p.vy);
          if (sp > maxV) maxV = sp;
        }
        wpx.dirty = false;
        still = maxV < 0.05 ? still + 1 : 0;
        draw();
      };

      if (reducedMotion) {
        for (const p of parts) {
          p.x = p.rx;
          p.y = p.ry;
        }
        ramp = 1;
        draw(); // a still print, no animation
        return;
      }

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const en of entries) {
              if (en.isIntersecting) {
                if (!raf) {
                  still = 0;
                  frame();
                }
              } else if (raf) {
                cancelAnimationFrame(raf);
                raf = null;
              }
            }
          },
          { threshold: 0.05 }
        );
        io.observe(wittCanvas);
      } else {
        frame();
      }
    };
    wittImg.src = "media/witt.png";
  }

  /* ---------------- init ---------------- */

  window.history.scrollRestoration = "manual";
  document.documentElement.scrollTo(0, 0);
  computeLayout();
  window.addEventListener("resize", computeLayout);

  frames.style.opacity = "1";

  introScale.set(1);
  setTimeout(() => circleScale.set(1), 400);
  revealSpans.forEach((_, i) => {
    setTimeout(() => lineSprings[i].set(0), 200 + i * 100);
  });

  requestRender();
})();
