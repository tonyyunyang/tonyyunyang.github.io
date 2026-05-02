import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("homepage preview", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("homepage hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/HP-01-hero.png`, fullPage: false });
  });

  test("homepage full", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/HP-02-full.png`, fullPage: true });
  });

  test("workbench area", async ({ page }) => {
    await page.goto("/");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}/HP-03-workbench.png`, fullPage: false });
  });

  test("hero mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/HP-M1-hero.png`, fullPage: false });
  });

  test("workbench mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${OUT}/HP-M3-workbench.png`, fullPage: false });
  });
});
