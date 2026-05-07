import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter20.2 intro audit", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("intro photo close-up", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.locator(".intro__figure").screenshot({
      path: `${OUT}/I202-01-photo-block.png`,
    });
  });

  test("intro full section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.locator("#currently").screenshot({
      path: `${OUT}/I202-02-intro-full.png`,
    });
  });

  test("intro section above-fold", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I202-03-intro-viewport.png`,
      fullPage: false,
    });
  });
});
