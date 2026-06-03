import { test } from "@playwright/test";

// Iteration preview harness. Captures the homepage and the two sections
// under active redesign (the §00 "letter" and the "Two directions" diptych)
// at desktop + mobile, so each improvement round can be eyeballed against
// the last. PNGs land in tests/visual/shots/ (gitignored).
const OUT = "tests/visual/shots";

async function settle(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  // Pause CSS animations so screenshots are deterministic.
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;}",
  });
  await page.waitForTimeout(200);
}

test.describe("iteration preview", () => {
  test("desktop full + sections", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await settle(page);

    await page.screenshot({ path: `${OUT}/IT-desktop-full.png`, fullPage: true });

    const letter = page.locator("section.intro");
    await letter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await letter.screenshot({ path: `${OUT}/IT-letter.png` });

    const diptych = page.locator("section.diptych");
    await diptych.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await diptych.screenshot({ path: `${OUT}/IT-diptych.png` });
  });

  test("mobile full + sections", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await settle(page);

    await page.screenshot({ path: `${OUT}/IT-mobile-full.png`, fullPage: true });

    const letter = page.locator("section.intro");
    await letter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await letter.screenshot({ path: `${OUT}/IT-mobile-letter.png` });

    const diptych = page.locator("section.diptych");
    await diptych.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await diptych.screenshot({ path: `${OUT}/IT-mobile-diptych.png` });
  });
});
