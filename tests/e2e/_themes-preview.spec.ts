import { test, type Page } from "@playwright/test";

const OUT = "tests/visual/shots";

// Hide dev-server-only chrome (Astro dev toolbar + the always-mounted
// SketchbookButton) so visual-review screenshots match production.
async function hideDevArtifacts(page: Page) {
  await page.addStyleTag({
    content: `
      astro-dev-toolbar,
      astro-dev-overlay,
      .sketchbook { display: none !important; }
    `,
  });
}

test.describe("themes preview", () => {
  test("themes grid desktop @1440", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    const themes = page.locator(".themes");
    await themes.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await themes.screenshot({ path: `${OUT}/TH-01-grid-desktop.png` });
  });

  test("themes grid tablet @920", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 920, height: 1100 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    const themes = page.locator(".themes");
    await themes.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await themes.screenshot({ path: `${OUT}/TH-02-grid-tablet.png` });
  });

  test("themes grid mobile @390", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 1400 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    const themes = page.locator(".themes");
    await themes.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await themes.screenshot({ path: `${OUT}/TH-03-grid-mobile.png` });
  });

  test("on-device card close-up @1440", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    // Card index 4 (0-based) is the new "On-device models" card
    const card = page.locator(".themes__card").nth(4);
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await card.screenshot({ path: `${OUT}/TH-04-on-device-card.png` });
  });

  // All 6 theme icons rendered side-by-side at their actual grid size, on
  // the page's paper background. Lets a reviewer eyeball icon coherence
  // (stroke weight, density) without scanning the full grid.
  test("icon strip @1440", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    await page.locator(".themes").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const glyphs = Array.from(
        document.querySelectorAll<HTMLElement>(".themes__card-glyph")
      );
      const strip = document.createElement("div");
      strip.id = "__icon-strip";
      Object.assign(strip.style, {
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "9999",
        display: "flex",
        gap: "32px",
        padding: "32px 40px",
        background: "var(--color-paper)",
        borderBottom: "1px solid var(--color-hairline)",
        color: "var(--color-ink)",
      } as Partial<CSSStyleDeclaration>);
      const labels = [
        "world-model",
        "tokens",
        "eye",
        "heartbeat",
        "chip",
        "market-trend (NEW)",
        "interface (NEW)",
        "open-door",
      ];
      glyphs.forEach((g, i) => {
        const wrap = document.createElement("div");
        Object.assign(wrap.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        } as Partial<CSSStyleDeclaration>);
        const cloned = g.cloneNode(true) as HTMLElement;
        cloned.style.height = "32px";
        const cap = document.createElement("span");
        cap.textContent = labels[i] ?? "";
        Object.assign(cap.style, {
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-ink-soft)",
        } as Partial<CSSStyleDeclaration>);
        wrap.appendChild(cloned);
        wrap.appendChild(cap);
        strip.appendChild(wrap);
      });
      document.body.appendChild(strip);
    });
    await page.waitForTimeout(200);
    const strip = page.locator("#__icon-strip");
    await strip.screenshot({ path: `${OUT}/TH-05-icon-strip.png` });
  });

  test("business card desktop @1200", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    const card = page.locator(".card").first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await card.screenshot({ path: `${OUT}/TH-06-business-card.png` });
  });

  test("business card mobile @390", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    await hideDevArtifacts(page);
    const card = page.locator(".card").first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await card.screenshot({ path: `${OUT}/TH-07-business-card-mobile.png` });
  });
});
