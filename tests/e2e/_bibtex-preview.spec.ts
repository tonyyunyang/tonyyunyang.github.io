import { test } from "@playwright/test";

const OUT = "tests/visual/shots";

test.describe("bibtex preview", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("research section idle", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/BX-01-research-idle.png`, fullPage: false });
  });

  test("research section all cards full", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const firstCard = page.locator("article.paper").first();
    await firstCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/BX-02-research-stack.png`, fullPage: false });
  });

  test("paper card close-up", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const firstCard = page.locator("article.paper").first();
    await firstCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await firstCard.screenshot({ path: `${OUT}/BX-02b-card-closeup.png` });
  });

  test("bibtex modal open", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator(".paper__bibtex").first().click();
    await page.waitForSelector(".bibmodal__panel", { state: "visible" });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/BX-03-modal-open.png`, fullPage: false });
  });

  test("bibtex modal copied state", async ({ page }) => {
    await page.goto("/");
    await page.context().grantPermissions(["clipboard-write", "clipboard-read"]);
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.locator(".paper__bibtex").first().click();
    await page.waitForSelector(".bibmodal__panel", { state: "visible" });
    await page.locator("[data-bibmodal-copy]").click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/BX-04-modal-copied.png`, fullPage: false });
  });

  test("bibtex modal mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator(".paper__bibtex").first().click();
    await page.waitForSelector(".bibmodal__panel", { state: "visible" });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/BX-M1-modal-mobile.png`, fullPage: false });
  });

  test("research card mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#research").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/BX-M2-card-mobile.png`, fullPage: false });
  });
});
