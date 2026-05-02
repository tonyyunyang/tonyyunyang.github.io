import { test, expect } from "@playwright/test";

const OUT = "tests/visual/shots";

// Verify CSS animations are actually running on the live build by taking
// two screenshots 1.5s apart and confirming pixel-level differences exist.
// (No prefers-reduced-motion emulation here — we explicitly want motion.)
test.describe("motion check", () => {
  test.use({ viewport: { width: 1500, height: 940 } });

  test("studio shows motion between frames", async ({ page }) => {
    await page.goto("/world/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2600); // let initial reveal pass

    const a = await page.screenshot({
      path: `${OUT}/MOTION-studio-a.png`,
      fullPage: false,
    });
    await page.waitForTimeout(1500);
    const b = await page.screenshot({
      path: `${OUT}/MOTION-studio-b.png`,
      fullPage: false,
    });

    // Compare lengths as a quick signal — for animated content the PNG bytes
    // will differ. (Pixel-diff would be more rigorous but this catches the
    // "no animation at all" failure mode.)
    expect(a.toString("base64")).not.toEqual(b.toString("base64"));
  });

  test("hero plate I shows motion between frames", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    const a = await page.screenshot({
      path: `${OUT}/MOTION-hero-a.png`,
      fullPage: false,
    });
    await page.waitForTimeout(1500);
    const b = await page.screenshot({
      path: `${OUT}/MOTION-hero-b.png`,
      fullPage: false,
    });

    expect(a.toString("base64")).not.toEqual(b.toString("base64"));
  });
});
