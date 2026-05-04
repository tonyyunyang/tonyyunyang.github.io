const root = document.querySelector<HTMLElement>("[data-bibmodal]");

function extractCiteKey(bibtex: string): string {
  const m = bibtex.match(/^\s*@\w+\s*\{\s*([^,\s]+)/);
  return m?.[1] ?? "";
}

if (root) {
  const panel = root.querySelector<HTMLElement>(".bibmodal__panel")!;
  const titleEl = root.querySelector<HTMLElement>("[data-bibmodal-title]")!;
  const keyEl = root.querySelector<HTMLElement>("[data-bibmodal-key]")!;
  const keySepEl = root.querySelector<HTMLElement>("[data-bibmodal-key-sep]")!;
  const contentEl = root.querySelector<HTMLPreElement>("[data-bibmodal-content]")!;
  const copyBtn = root.querySelector<HTMLButtonElement>("[data-bibmodal-copy]")!;
  const copyLabel = root.querySelector<HTMLElement>("[data-bibmodal-copy-label]")!;
  const closeButtons = root.querySelectorAll<HTMLButtonElement>("[data-bibmodal-close]");

  let lastFocused: HTMLElement | null = null;
  let copyResetTimer: number | null = null;

  function open(content: string, paperTitle: string | null) {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    contentEl.textContent = content;
    titleEl.textContent = paperTitle ?? "";
    const key = extractCiteKey(content);
    keyEl.textContent = key;
    keySepEl.hidden = key.length === 0;
    root!.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      contentEl.focus({ preventScroll: true });
    });
  }

  function close() {
    root!.hidden = true;
    document.body.style.overflow = "";
    resetCopyState();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  }

  function resetCopyState() {
    copyBtn.classList.remove("is-copied");
    copyBtn.setAttribute("aria-label", "Copy citation to clipboard");
    copyLabel.textContent = "copy";
    if (copyResetTimer !== null) {
      window.clearTimeout(copyResetTimer);
      copyResetTimer = null;
    }
  }

  function focusableInPanel(): HTMLElement[] {
    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], pre[tabindex="0"], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);
  }

  async function handleCopy() {
    const text = contentEl.textContent ?? "";
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // Fallback: select the pre's contents and let the user / browser copy.
      const range = document.createRange();
      range.selectNodeContents(contentEl);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
    }
    if (ok) {
      copyBtn.classList.add("is-copied");
      copyBtn.setAttribute("aria-label", "Citation copied to clipboard");
      copyLabel.textContent = "copied!";
      if (copyResetTimer !== null) window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        resetCopyState();
      }, 1600);
    } else {
      copyLabel.textContent = "copy failed";
      copyBtn.setAttribute("aria-label", "Copy failed, try again");
    }
  }

  document.addEventListener("click", (e) => {
    const trigger = (e.target as HTMLElement | null)?.closest<HTMLElement>(
      "[data-bibtex-trigger]"
    );
    if (!trigger) return;
    e.preventDefault();
    const raw = trigger.dataset.bibtex ?? "";
    let content = raw;
    try {
      content = JSON.parse(raw);
    } catch {
      // raw was not JSON-encoded; use as-is
    }
    const paperTitle = trigger.dataset.paperTitle ?? null;
    open(content, paperTitle);
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", close);
  });

  copyBtn.addEventListener("click", handleCopy);

  document.addEventListener("keydown", (e) => {
    if (root!.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      const focusables = focusableInPanel();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
      const sel = window.getSelection();
      const hasSelection = sel && !sel.isCollapsed && panel.contains(sel.anchorNode);
      if (!hasSelection) {
        e.preventDefault();
        handleCopy();
      }
    }
  });
}
