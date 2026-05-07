import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter21 §00/§01 header parity", () => {
  test("desktop both heads", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("currently");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I21-01-currently-head.png`,
      fullPage: false,
    });

    await page.evaluate(() => {
      const el = document.getElementById("research");
      if (el) window.scrollTo(0, el.offsetTop - 60);
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/I21-02-research-head.png`,
      fullPage: false,
    });
  });
});
