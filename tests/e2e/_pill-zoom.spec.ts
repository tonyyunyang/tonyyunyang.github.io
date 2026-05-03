import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

// Zoomed-in screenshots of the two pills (hero + business card) at every
// mobile width so we can verify the stacked label / when typography is
// rendering correctly with no truncation or overflow.

const widths = [320, 375, 390, 414];

for (const w of widths) {
  test(`hero pill close-up @${w}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: 700 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const pill = page.locator(".hero__seeking");
    await pill.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await pill.screenshot({ path: `${OUT}/PILL-hero-${w}.png` });
  });

  test(`businessCard pill close-up @${w}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: 1000 });
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    const pill = page.locator(".card__looking").first();
    await pill.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await pill.screenshot({ path: `${OUT}/PILL-card-${w}.png` });
  });
}
