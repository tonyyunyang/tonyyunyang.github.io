import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("quick atelier preview", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("atelier desktop", async ({ page }) => {
    await page.goto("/world/");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/NEW-atelier-desktop.png`, fullPage: false });
  });

  test("atelier desktop 1280", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/world/");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/NEW-atelier-desktop-1280.png`, fullPage: false });
  });

  test("atelier with caption T", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("t");
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/NEW-atelier-T-on.png`, fullPage: false });
  });

  test("atelier sidenote open", async ({ page }) => {
    await page.goto("/world/?at=laptop");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/NEW-atelier-sidenote.png`, fullPage: false });
  });

  test("atelier mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/world/");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/NEW-atelier-mobile.png`, fullPage: false });
  });
});
