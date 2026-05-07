import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter20 preview", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("hero with running head", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/I20-01-hero.png`, fullPage: false });
  });

  test("intro section with lettrine", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/I20-02-intro-lettrine.png`, fullPage: false });
  });

  test("research section with new folio", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/I20-03-research-folio.png`, fullPage: false });
  });

  test("projects section with new hovers (rest state)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/I20-04-projects-rest.png`, fullPage: false });
  });

  test("contact section with new running head", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/I20-05-contact.png`, fullPage: false });
  });

  test("colophon page", async ({ page }) => {
    await page.goto("/colophon/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/I20-06-colophon-top.png`, fullPage: false });
    await page.screenshot({ path: `${OUT}/I20-06-colophon-full.png`, fullPage: true });
  });

  test("404 page", async ({ page }) => {
    await page.goto("/non-existent-page");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/I20-07-404.png`, fullPage: false });
  });

  test("command palette open", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/I20-08-cmdk.png`, fullPage: false });
  });

  test("homepage full scroll", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/I20-09-homepage-full.png`, fullPage: true });
  });

  test("hero mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/I20-M1-hero.png`, fullPage: false });
  });

  test("intro mobile with lettrine", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/I20-M2-intro-mobile.png`, fullPage: false });
  });
});
