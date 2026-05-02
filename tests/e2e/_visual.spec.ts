import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const OUT = "tests/visual/shots";

test.beforeAll(() => {
  mkdirSync(OUT, { recursive: true });
});

test.describe("visual inspection — desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("01 hero (above fold)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${OUT}/01-hero-desktop.png` });
  });

  test("02 intro + workbench", async ({ page }) => {
    await page.goto("/");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // wait for workbench draw-in
    await page.screenshot({ path: `${OUT}/02-intro-workbench-desktop.png` });
  });

  test("03 research section (papers)", async ({ page }) => {
    await page.goto("/#research");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/03-research-desktop.png` });
  });

  test("04 projects section", async ({ page }) => {
    await page.goto("/#projects");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/04-projects-desktop.png` });
  });

  test("05 writing empty state + news", async ({ page }) => {
    await page.goto("/#writing");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/05-writing-news-desktop.png` });
  });

  test("06 teaching + contact + footer", async ({ page }) => {
    await page.goto("/#contact");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/06-teaching-contact-desktop.png` });
  });

  test("07 command palette open", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/07-cmdk-desktop.png` });
  });

  test("08 atelier scene viewport 1 (desk)", async ({ page }) => {
    await page.goto("/world/");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/08-world-1-desk-desktop.png` });
  });

  test("09 atelier scene with sidenote panel", async ({ page }) => {
    await page.goto("/world/?at=laptop");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/09-world-sidenote-desktop.png` });
  });

  test("10a atelier scene viewport 2 (kitchen)", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/10a-world-2-kitchen-desktop.png` });
  });

  test("10b atelier scene viewport 3 (bookshelf)", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/10b-world-3-bookshelf-desktop.png` });
  });

  test("10c atelier scene viewport 4 (night)", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/10c-world-4-night-desktop.png` });
  });

  test("10d atelier with all captions on (T pressed)", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("t");
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/10d-world-1-t-on-desktop.png` });
  });

  test("11 writing index page", async ({ page }) => {
    await page.goto("/writing/");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/11-writing-index-desktop.png` });
  });

  test("12 404 page", async ({ page }) => {
    await page.goto("/this-does-not-exist", { waitUntil: "load" }).catch(() => {});
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/12-404-desktop.png` });
  });
});

test.describe("visual inspection — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("M1 hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/M1-hero-mobile.png` });
  });

  test("M2 intro + workbench", async ({ page }) => {
    await page.goto("/");
    await page.locator("#currently").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/M2-intro-workbench-mobile.png` });
  });

  test("M3 research", async ({ page }) => {
    await page.goto("/#research");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/M3-research-mobile.png` });
  });

  test("M4 atelier", async ({ page }) => {
    await page.goto("/world/");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/M4-world-mobile.png` });
  });
});
