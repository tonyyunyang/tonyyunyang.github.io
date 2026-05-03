import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter 15 mobile audit", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hero above fold @390 (iphone 12)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `${OUT}/I15-hero-fold-390.png`,
      fullPage: false,
    });
  });

  test("intro + photo area @390", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 1100 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      document.getElementById("currently")?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/I15-intro-photo.png`,
      fullPage: false,
    });
  });

  test("research themes grid @390", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 1100 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      document
        .querySelector(".themes")
        ?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/I15-themes-grid.png`,
      fullPage: false,
    });
  });

  test("papers grid @390", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 1100 });
    await page.goto("/#research");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const r = document.getElementById("research");
      if (r) {
        const offset = r.offsetTop + 200;
        window.scrollTo({ top: offset });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/I15-papers.png`,
      fullPage: false,
    });
  });

  test("studio mobile w narrow viewport @360", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/world/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I15-world-360.png`,
      fullPage: true,
    });
  });

  test("studio mobile @414", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto("/world/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I15-world-414.png`,
      fullPage: true,
    });
  });
});
