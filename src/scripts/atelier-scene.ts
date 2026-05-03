const root = document.querySelector<HTMLElement>("[data-atelier]");
if (root) {
  const panel = root.querySelector<HTMLElement>("[data-atelier-panel]")!;
  const panelLabel = root.querySelector<HTMLElement>("[data-atelier-panel-label]")!;
  const panelNote = root.querySelector<HTMLElement>("[data-atelier-panel-note]")!;
  const panelClose = root.querySelector<HTMLElement>("[data-atelier-panel-close]")!;
  const closeBtn = root.querySelector<HTMLElement>("[data-atelier-close]")!;
  // Includes both the absolute-positioned canvas hotspots AND the mobile
  // tap-list tiles below the canvas. Anything carrying [data-obj-id] gets
  // the same open-panel behavior so the two surfaces stay in sync.
  const hotspots = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-obj-id]")
  );

  function showNote(label: string, note: string) {
    panelLabel.textContent = label;
    panelNote.textContent = note;
    panel.hidden = false;
  }

  function hideNote() {
    panel.hidden = true;
  }

  // Initial deep-link via ?at=<id>
  const params = new URLSearchParams(location.search);
  const at = params.get("at");
  if (at) {
    const target = hotspots.find((o) => o.dataset.objId === at);
    if (target) {
      const note = target.dataset.objNote ?? "";
      const label = target.dataset.objLabel ?? "";
      if (note) showNote(label, note);
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  // Initial label reveal: show all hotspot labels briefly so visitors know
  // what is clickable, then fade out unless the user pressed T or arrived via deep-link.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!at && !reduceMotion) {
    root.dataset.showCaptions = "";
    root.dataset.initialReveal = "";
    window.setTimeout(() => {
      delete root.dataset.initialReveal;
      if (!("userToggled" in root.dataset)) {
        delete root.dataset.showCaptions;
      }
    }, 2400);
  }

  hotspots.forEach((obj) => {
    obj.addEventListener("click", () => {
      const id = obj.dataset.objId ?? "";
      const note = obj.dataset.objNote ?? "";
      const label = obj.dataset.objLabel ?? "";
      if (!note) return;
      const url = new URL(location.href);
      url.searchParams.set("at", id);
      history.replaceState({}, "", url);
      showNote(label, note);
    });
  });

  panelClose.addEventListener("click", () => {
    hideNote();
    const url = new URL(location.href);
    url.searchParams.delete("at");
    history.replaceState({}, "", url);
  });

  closeBtn.addEventListener("click", () => {
    if (history.length > 1) history.back();
    else location.href = "/";
  });

  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t") {
      e.preventDefault();
      root.dataset.userToggled = "";
      if (root.dataset.showCaptions !== undefined) {
        delete root.dataset.showCaptions;
      } else {
        root.dataset.showCaptions = "";
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (!panel.hidden) hideNote();
      else closeBtn.click();
    }
  });
}
