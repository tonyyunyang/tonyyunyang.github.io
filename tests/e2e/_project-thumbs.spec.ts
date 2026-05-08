import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("project thumb closeups", () => {
  test.use({ viewport: { width: 1600, height: 1000 } });

  test("each project thumbnail at high res", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        (img as HTMLImageElement).loading = "eager";
      });
    });
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const thumbs = await page.locator(".project__thumb").all();
    for (let i = 0; i < thumbs.length; i++) {
      await thumbs[i].screenshot({ path: `${OUT}/T-project-${i + 1}.png` });
    }
  });

  test("polymarket card whole-row close-up @1600", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const card = page.locator("#project-polymarket-decoder");
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await card.screenshot({ path: `${OUT}/T-polymarket-card.png` });
  });
});
