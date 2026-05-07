import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter20.3 intro spec", () => {
  test("desktop intro full", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.locator("#currently").screenshot({
      path: `${OUT}/I203-01-desktop-full.png`,
    });
  });

  test("desktop top region (photo + lede)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.locator(".intro__top").screenshot({
      path: `${OUT}/I203-02-top-region.png`,
    });
  });

  test("desktop contact grid", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.querySelector(".intro__contact-grid");
      if (el) (el as HTMLElement).scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(600);
    await page.locator(".intro__contact-grid").screenshot({
      path: `${OUT}/I203-03-contact-grid.png`,
    });
  });

  test("mobile 390 intro full", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.locator("#currently").screenshot({
      path: `${OUT}/I203-M1-mobile.png`,
    });
  });

  test("desktop intro viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 80);
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I203-04-viewport.png`,
      fullPage: false,
    });
  });
});
