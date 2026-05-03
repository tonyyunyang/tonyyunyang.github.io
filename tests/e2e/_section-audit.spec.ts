import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

// Capture each major homepage section at mobile so we can spot
// section-level issues that the full-page screenshot is too compressed
// to surface.

test.use({ viewport: { width: 390, height: 844 } });

const sections: Array<{ id: string; name: string }> = [
  { id: "currently", name: "intro" },
  { id: "research", name: "research-themes" },
  { id: "papers", name: "papers" },
  { id: "projects", name: "projects" },
  { id: "writing", name: "writing" },
  { id: "news", name: "news" },
  { id: "teaching", name: "teaching" },
  { id: "contact", name: "contact" },
];

for (const s of sections) {
  test(`mobile section ${s.name} @390`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 1100 });
    await page.goto(`/#${s.id}`);
    await page.waitForLoadState("networkidle");
    const target = page.locator(`#${s.id}`);
    await target.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/SEC-${s.name}.png`,
      fullPage: false,
    });
  });
}
