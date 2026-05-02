import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("paper thumb closeups", () => {
  test.use({ viewport: { width: 1600, height: 1000 } });

  test("each paper thumbnail at high res", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        (img as HTMLImageElement).loading = "eager";
      });
    });
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const thumbs = await page.locator(".paper__thumb").all();
    for (let i = 0; i < thumbs.length; i++) {
      await thumbs[i].screenshot({ path: `${OUT}/T-paper-${i + 1}.png` });
    }
  });
});
