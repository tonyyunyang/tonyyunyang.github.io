const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.drawn = "true";
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.25 }
);

document.querySelectorAll<HTMLElement>(".workbench").forEach((el) => {
  observer.observe(el);

  el.querySelectorAll<SVGGElement>(".topic").forEach((topic) => {
    const id = topic.dataset.topicId;
    if (!id) return;

    topic.addEventListener("mouseenter", () => activate(el, id));
    topic.addEventListener("mouseleave", () => deactivate(el));
    topic.addEventListener("focus", () => activate(el, id));
    topic.addEventListener("blur", () => deactivate(el));
  });
});

function activate(workbench: HTMLElement, topicId: string) {
  workbench.setAttribute("data-dim", "");
  workbench.querySelectorAll<HTMLElement>(".edge").forEach((edge) => {
    edge.dataset.active = edge.dataset.from === topicId ? "true" : "";
  });
  workbench.querySelectorAll<HTMLElement>(".topic").forEach((topic) => {
    topic.dataset.active = topic.dataset.topicId === topicId ? "true" : "";
  });
  const connectedOutputs = new Set(
    Array.from(workbench.querySelectorAll<HTMLElement>(".edge"))
      .filter((e) => e.dataset.from === topicId)
      .map((e) => e.dataset.to ?? "")
  );
  workbench.querySelectorAll<HTMLElement>(".output").forEach((out) => {
    out.dataset.active = connectedOutputs.has(out.dataset.outputId ?? "")
      ? "true"
      : "";
  });
}

function deactivate(workbench: HTMLElement) {
  workbench.removeAttribute("data-dim");
  workbench.querySelectorAll<HTMLElement>("[data-active]").forEach((el) => {
    delete el.dataset.active;
  });
}
