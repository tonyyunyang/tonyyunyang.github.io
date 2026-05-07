import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("iter22 name-zh font parity", () => {
  test("hero name close-up", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await page.locator(".hero__name").screenshot({
      path: `${OUT}/I22-01-hero-name.png`,
    });
  });

  test("card name close-up", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const el = document.getElementById("contact");
      if (el) (el as HTMLElement).scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(800);
    await page.locator(".card__name").screenshot({
      path: `${OUT}/I22-02-card-name.png`,
    });
  });
});
