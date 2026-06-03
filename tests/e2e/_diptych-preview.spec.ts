import { test } from "@playwright/test";

// Helper spec (underscore-prefixed): renders the converged-positioning work
// for visual inspection. PNGs land in tests/visual/shots/ (gitignored).
const OUT = "tests/visual/shots";

test.describe("converged positioning preview", () => {
  test("hero desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/CP-01-hero.png`, fullPage: false });
  });

  test("letter section desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.locator(".intro").screenshot({ path: `${OUT}/CP-02-letter.png` });
  });

  test("diptych section desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1300 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".diptych").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.locator(".diptych").screenshot({ path: `${OUT}/CP-03-diptych.png` });
  });

  test("full page desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/CP-04-full.png`, fullPage: true });
  });

  test("diptych mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".diptych").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.locator(".diptych").screenshot({ path: `${OUT}/CP-05-diptych-mobile.png` });
  });
});

test.describe("converged positioning preview (hi-dpi)", () => {
  test.use({ viewport: { width: 1440, height: 1300 }, deviceScaleFactor: 2 });

  test("diptych 2x", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".diptych").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.locator(".diptych").screenshot({ path: `${OUT}/CP-06-diptych-2x.png` });
  });
});
