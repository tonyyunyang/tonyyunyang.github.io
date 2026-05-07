import { test } from "@playwright/test";

// Renders the /og/default/ Astro page at 1200x630 and saves it as
// public/og-default.png so it ships with the build. Run manually
// after edits to src/pages/og/default.astro:
//   npx playwright test tests/e2e/_og-render.spec.ts
test.describe("og render", () => {
  test.use({ viewport: { width: 1200, height: 630 } });

  test("og default", async ({ page }) => {
    await page.goto("/og/default/");
    await page.waitForLoadState("networkidle");
    // Tiny extra hold so the EB Garamond + LXGW WenKai webfonts have
    // settled into their final metrics.
    await page.waitForTimeout(800);
    // Hide Astro's dev toolbar (it mounts as a custom element on every
    // dev page) so it doesn't sit at the bottom of our card.
    await page.addStyleTag({
      content: `astro-dev-toolbar, astro-dev-overlay { display: none !important; }`,
    });
    await page.screenshot({
      path: "public/og-default.png",
      fullPage: false,
      omitBackground: false,
    });
  });
});
