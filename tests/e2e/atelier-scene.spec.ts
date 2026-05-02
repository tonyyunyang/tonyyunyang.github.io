import { test, expect } from "@playwright/test";

test.describe("atelier scene", () => {
  test("renders at /world/ with 4 viewports", async ({ page }) => {
    await page.goto("/world/");
    await expect(page.locator("[data-atelier]")).toBeVisible();
    const viewports = page.locator(".atelier__view");
    await expect(viewports).toHaveCount(4);
  });

  test("deep-link ?at=laptop opens the laptop sidenote", async ({ page }) => {
    await page.goto("/world/?at=laptop");
    await expect(page.locator("[data-atelier-panel]")).toBeVisible();
    await expect(page.locator("[data-atelier-panel-label]")).toContainText(/laptop/i);
  });

  test("T key reveals all captions", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("t");
    await expect(page.locator("[data-atelier]")).toHaveAttribute("data-show-captions", "");
  });

  test("Escape closes the open panel", async ({ page }) => {
    await page.goto("/world/?at=cat");
    await expect(page.locator("[data-atelier-panel]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-atelier-panel]")).toBeHidden();
  });

  test("clicking an object with a note shows the panel", async ({ page }) => {
    await page.goto("/world/");
    await page.locator('[data-obj-id="laptop"]').click();
    await expect(page.locator("[data-atelier-panel]")).toBeVisible();
    await expect(page.locator("[data-atelier-panel-note]")).toContainText(/LLM Router commits/i);
  });

  test("disabled objects (no note) cannot be clicked", async ({ page }) => {
    await page.goto("/world/");
    const moon = page.locator('[data-obj-id="moon"]');
    await expect(moon).toBeDisabled();
  });

  test("/world/ does not show the sketchbook button (you're already in)", async ({ page }) => {
    await page.goto("/world/");
    await expect(page.locator(".sketchbook")).toHaveCount(0);
  });
});
