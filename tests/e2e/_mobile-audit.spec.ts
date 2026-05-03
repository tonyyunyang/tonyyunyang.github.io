import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

// Mobile audit spec: full-page captures at multiple mobile widths so we can
// see edge cases and confirm fixes. All screenshots emulate reduced-motion
// so animated SVGs don't cause flicker between captures.

const widths = [
  { name: "320", w: 320 },
  { name: "375", w: 375 },
  { name: "390", w: 390 },
  { name: "414", w: 414 },
];

test.use({ viewport: { width: 390, height: 844 } });

for (const { name, w } of widths) {
  test(`mobile homepage full @${name}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${OUT}/MOB-${name}-01-full.png`,
      fullPage: true,
    });
  });

  test(`mobile homepage hero @${name}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: w, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `${OUT}/MOB-${name}-02-hero.png`,
      fullPage: false,
    });
  });
}

test("mobile studio (/world/) full @390", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/world/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await page.screenshot({
    path: `${OUT}/MOB-390-90-world-full.png`,
    fullPage: true,
  });
});

test("mobile writing index @390", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/writing/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: `${OUT}/MOB-390-91-writing.png`,
    fullPage: true,
  });
});

test("mobile contact section @390", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#contact");
  await page.waitForLoadState("networkidle");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `${OUT}/MOB-390-92-contact.png`,
    fullPage: false,
  });
});
