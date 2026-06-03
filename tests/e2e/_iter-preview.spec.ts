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

    for (const [name, sel] of [
      ["hero", "section.hero"],
      ["research", 'section[aria-label="Research"]'],
      ["projects", 'section[aria-label="Projects"]'],
      ["writing", 'section[aria-label="Writing"]'],
      ["contact", 'section[aria-label="Contact"]'],
    ] as const) {
      const el = page.locator(sel).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await el.screenshot({ path: `${OUT}/IT-${name}.png` });
    }
  });

  test("world page", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/world/");
    await settle(page);
    await page.screenshot({ path: `${OUT}/IT-world-full.png`, fullPage: true });
  });

  test("writing page", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/writing/");
    await settle(page);
    await page.screenshot({ path: `${OUT}/IT-writing-full.png`, fullPage: true });
  });

  test("world panel open", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/world/");
    await settle(page);
    // Open an object panel so the note typography is visible.
    const hotspot = page.locator(".atelier__hotspot").first();
    await hotspot.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/IT-world-panel.png`, fullPage: false });
  });

  test("tablet breakpoints", async ({ page }) => {
    for (const w of [768, 834, 1024]) {
      await page.setViewportSize({ width: w, height: 1000 });
      await page.goto("/");
      await settle(page);
      await page.locator("section.intro").scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.locator("section.intro").screenshot({ path: `${OUT}/IT-t${w}-letter.png` });
      await page.locator("section.diptych").scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.locator("section.diptych").screenshot({ path: `${OUT}/IT-t${w}-diptych.png` });
    }
  });

  test("narrow phone 360", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");
    await settle(page);
    await page.locator("section.hero").screenshot({ path: `${OUT}/IT-p360-hero.png` });
    await page.locator("section.intro").screenshot({ path: `${OUT}/IT-p360-letter.png` });
  });

  test("iphone pro max 430", async ({ page }) => {
    // Tony's actual phone (iPhone 17 Pro Max @ 430 CSS px) — historically the
    // width that surfaces real bugs others miss. Capture every key surface.
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto("/");
    await settle(page);
    await page.locator("section.hero").screenshot({ path: `${OUT}/IT-p430-hero.png` });
    await page.locator("section.intro").screenshot({ path: `${OUT}/IT-p430-letter.png` });
    await page.locator("section.diptych").screenshot({ path: `${OUT}/IT-p430-diptych.png` });
    await page.locator('section[aria-label="Contact"]').first().screenshot({ path: `${OUT}/IT-p430-contact.png` });
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
