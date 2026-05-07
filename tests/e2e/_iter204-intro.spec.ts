import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter20.4 intro long-photo", () => {
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
      path: `${OUT}/I204-01-desktop-full.png`,
    });
  });

  test("desktop intro viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I204-02-viewport.png`,
      fullPage: false,
    });
  });

  test("photo close-up", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.locator(".intro__figure").screenshot({
      path: `${OUT}/I204-03-photo.png`,
    });
  });

  test("contact row close-up", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.querySelector(".intro__contact-row");
      if (el) (el as HTMLElement).scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(600);
    await page.locator(".intro__contact-row").screenshot({
      path: `${OUT}/I204-04-contact.png`,
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
      path: `${OUT}/I204-M1-mobile.png`,
    });
  });
});
