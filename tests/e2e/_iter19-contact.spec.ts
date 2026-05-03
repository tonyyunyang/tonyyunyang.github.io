import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

// Contact / BusinessCard close-ups at every mobile width including 430
// (iPhone 17 Pro Max), and a full-card capture so we can verify the
// languages caption sits clearly above the inner border line.

const widths = [320, 375, 390, 414, 430];

for (const w of widths) {
  test(`contact full card @${w}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    const card = page.locator(".card").first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await card.screenshot({ path: `${OUT}/I19-card-${w}.png` });
  });
}
