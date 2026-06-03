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

  test("section headers 2x", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator("#research").screenshot({ path: `${OUT}/CP-12-header-research.png` });
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator("#contact").screenshot({ path: `${OUT}/CP-13-header-contact.png` });
  });

  test("letter opening 2x (pill inline)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator(".intro__opening").screenshot({ path: `${OUT}/CP-10-opening-2x.png` });
    await page.locator(".intro__belief").screenshot({ path: `${OUT}/CP-11-belief-2x.png` });
  });
});

test.describe("mobile audit", () => {
  for (const w of [430, 390]) {
    test(`hero ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 920 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${OUT}/CP-M-${w}-hero.png`, fullPage: false });
    });
    test(`letter ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 920 });
      await page.goto("/");
      await page.locator("#currently").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.locator(".intro").screenshot({ path: `${OUT}/CP-M-${w}-letter.png` });
    });
    test(`diptych ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 920 });
      await page.goto("/");
      await page.locator(".diptych").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.locator(".diptych").screenshot({ path: `${OUT}/CP-M-${w}-diptych.png` });
    });
    test(`research header ${w}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 920 });
      await page.goto("/");
      await page.locator("#research").scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.locator("#research").screenshot({ path: `${OUT}/CP-M-${w}-header.png` });
    });
  }
});

test.describe("icon zoom", () => {
  test.use({ viewport: { width: 1440, height: 1300 }, deviceScaleFactor: 4 });

  test("glyphs and pill", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".diptych__panels").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator(".diptych__panel-glyph").nth(0).screenshot({ path: `${OUT}/CP-07-glyph-build.png` });
    await page.locator(".diptych__panel-glyph").nth(1).screenshot({ path: `${OUT}/CP-08-glyph-frontier.png` });
    await page.locator(".intro__opening").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator(".intro__pill").screenshot({ path: `${OUT}/CP-09-pill.png` });
  });
});
