import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter20.1 zooms", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("intro section full", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    const intro = page.locator("#currently");
    await intro.screenshot({ path: `${OUT}/I201-01-intro-full.png` });
  });

  test("LLM Router project card", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#project-llm-router").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.locator("#project-llm-router").screenshot({
      path: `${OUT}/I201-02-llm-router-card.png`,
    });
  });

  test("LLM Router thumbnail close-up", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#project-llm-router").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.locator("#project-llm-router .project__thumb").screenshot({
      path: `${OUT}/I201-03-llm-router-thumb.png`,
    });
  });

  test("BusinessCard name + role close-up", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".card").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.locator(".card__top").screenshot({
      path: `${OUT}/I201-04-card-name-role.png`,
    });
  });

  test("BusinessCard full", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".card").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.locator(".card").screenshot({
      path: `${OUT}/I201-05-card-full.png`,
    });
  });

  test("intro mobile 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(600);
    const intro = page.locator("#currently");
    await intro.screenshot({ path: `${OUT}/I201-M1-intro-mobile.png` });
  });

  test("BusinessCard mobile 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator(".card").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.locator(".card").screenshot({
      path: `${OUT}/I201-M2-card-mobile.png`,
    });
  });
});
