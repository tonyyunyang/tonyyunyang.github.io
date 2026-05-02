interface SiteConfig {
  contact: { email: string; scholar: string; github: string; cv: string };
  currently: string;
}

interface PagefindResult {
  results: Array<{ id: string }>;
}

interface PagefindModule {
  init?: () => Promise<void>;
  search: (query: string) => Promise<PagefindResult>;
}

const root = document.querySelector<HTMLElement>("[data-cmdk]");
if (root) {
  const input = root.querySelector<HTMLInputElement>("[data-cmdk-input]")!;
  const results = root.querySelector<HTMLUListElement>("[data-cmdk-results]")!;
  const hint = root.querySelector<HTMLParagraphElement>("[data-cmdk-hint]")!;
  const closeBtn = root.querySelector<HTMLButtonElement>("[data-cmdk-close]")!;
  const items = Array.from(results.querySelectorAll<HTMLLIElement>("li"));

  let activeIndex = 0;
  let pagefindCache: PagefindModule | null = null;

  setActive(0);

  function open() {
    root!.hidden = false;
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    root!.hidden = true;
    input.value = "";
    filter("");
    hint.textContent = "";
  }

  function setActive(i: number) {
    const visible = items.filter((el) => !el.hidden);
    if (visible.length === 0) return;
    activeIndex = ((i % visible.length) + visible.length) % visible.length;
    items.forEach((el) => el.classList.remove("is-active"));
    visible[activeIndex].classList.add("is-active");
    visible[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function filter(query: string) {
    const q = query.trim().toLowerCase();
    items.forEach((el) => {
      const cmd = (el.dataset.cmd ?? "").toLowerCase();
      const txt = (el.textContent ?? "").toLowerCase();
      el.hidden = q.length > 0 && !cmd.includes(q) && !txt.includes(q);
    });
    activeIndex = 0;
    setActive(0);
  }

  function execute(cmd: string) {
    const site = (window as unknown as { __siteConfig: SiteConfig }).__siteConfig;
    switch (cmd) {
      case "papers":
        location.hash = "#research";
        close();
        return;
      case "projects":
        location.hash = "#projects";
        close();
        return;
      case "writing":
        location.href = "/writing/";
        return;
      case "latest":
        location.hash = "#research";
        close();
        return;
      case "cv":
        window.open(site.contact.cv, "_blank");
        close();
        return;
      case "email":
        location.href = `mailto:${site.contact.email}`;
        close();
        return;
      case "world":
        location.href = "/world/";
        return;
      case "pace":
        toast("Half-marathon PB: 1:43:53");
        return;
      case "now":
        toast(site.currently);
        return;
      case "theme":
        toast("Dark mode is coming in v1.1.");
        return;
      case "help":
      case "?":
        toast("⌘K to open · ↑↓ Enter to pick · Esc to close");
        return;
      default:
        runSearch(cmd);
    }
  }

  async function runSearch(q: string) {
    if (q.length < 2) return;
    try {
      if (!pagefindCache) {
        // Vite tries to resolve string-literal dynamic imports; route through a variable.
        const pagefindUrl = ["/pagefind", "pagefind.js"].join("/");
        const mod = (await import(/* @vite-ignore */ pagefindUrl)) as PagefindModule;
        if (mod.init) await mod.init();
        pagefindCache = mod;
      }
      const search = await pagefindCache.search(q);
      hint.textContent = `${search.results.length} result(s)`;
    } catch {
      hint.textContent = "Search index unavailable in dev. Try a command.";
    }
  }

  function toast(msg: string) {
    hint.textContent = msg;
    setTimeout(() => {
      hint.textContent = "";
    }, 4000);
  }

  window.addEventListener("keydown", (e) => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const meta = isMac ? e.metaKey : e.ctrlKey;
    const isInputFocused =
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement;

    if (meta && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
      return;
    }
    if (!meta && e.key === "/" && !isInputFocused && root!.hidden) {
      e.preventDefault();
      open();
      return;
    }
    if (root!.hidden) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const visible = items.filter((el) => !el.hidden);
      const target = visible[activeIndex];
      if (!target || target.dataset.cmdDisabled !== undefined) return;
      const cmd = target.dataset.cmd;
      if (cmd) execute(cmd);
      else execute(input.value);
    }
  });

  input.addEventListener("input", () => filter(input.value));

  closeBtn.addEventListener("click", () => close());

  results.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLLIElement>("li");
    if (!el || el.dataset.cmdDisabled !== undefined) return;
    const cmd = el.dataset.cmd;
    if (cmd) execute(cmd);
  });
}
