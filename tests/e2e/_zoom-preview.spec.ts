import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("zoom previews", () => {
  test.use({ viewport: { width: 1600, height: 1000 } });

  test("plate I (hero sketch closeup)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
    const sketch = page.locator(".hero__sketch");
    await sketch.screenshot({ path: `${OUT}/Z-01-plate-1.png` });
  });

  test("plate I 2x scale closeup", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const el = document.querySelector(".hero__sketch") as HTMLElement;
      if (el) el.style.width = "640px";
    });
    await page.waitForTimeout(300);
    const sketch = page.locator(".hero__sketch");
    await sketch.screenshot({ path: `${OUT}/Z-01b-plate-1-2x.png` });
  });

  test("studio enlarged for detail", async ({ page }) => {
    await page.setViewportSize({ width: 2800, height: 1700 });
    await page.goto("/world/");
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const c = document.querySelector(".atelier__canvas") as HTMLElement;
      if (c) {
        c.style.maxWidth = "2700px";
        c.style.width = "2700px";
      }
    });
    await page.waitForTimeout(300);
    await page.locator(".atelier__canvas").screenshot({
      path: `${OUT}/Z-08-studio-large.png`,
    });
  });

  test("research themes (compass + intro dek)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".themes").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator(".themes").screenshot({ path: `${OUT}/Z-02-themes.png` });
  });

  test("research section dek", async ({ page }) => {
    await page.goto("/");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/Z-03-research.png`, fullPage: false });
  });

  test("papers list", async ({ page }) => {
    await page.goto("/");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        (img as HTMLImageElement).loading = "eager";
      });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/Z-04-papers-list.png`, fullPage: false });
  });
});
