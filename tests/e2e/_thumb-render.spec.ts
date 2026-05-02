import { test, expect } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("project thumbnails render", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("projects all visible", async ({ page }) => {
    await page.goto("/");
    // Force lazy images by scrolling everywhere then back
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 200));
      const images = Array.from(document.querySelectorAll("img"));
      images.forEach((img) => {
        (img as HTMLImageElement).loading = "eager";
      });
    });
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/PROJ-thumbs.png`, fullPage: false });
  });
});
