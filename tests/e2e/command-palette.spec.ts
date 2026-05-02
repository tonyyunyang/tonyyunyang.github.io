import { test, expect } from "@playwright/test";

test.describe("⌘K command palette", () => {
  test("opens with ⌘K, closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await expect(page.locator("[data-cmdk]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-cmdk]")).toBeHidden();
  });

  test("opens with /", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("/");
    await expect(page.locator("[data-cmdk]")).toBeVisible();
  });

  test("filters as you type", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("xyz");
    const visible = page.locator("[data-cmdk-results] li:not([hidden])");
    await expect(visible).toHaveCount(0);

    await page.locator("[data-cmdk-input]").fill("papers");
    const filtered = page.locator("[data-cmdk-results] li:not([hidden])");
    await expect(filtered.first()).toContainText(/papers/i);
  });

  test("Enter on 'papers' jumps to #research", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("papers");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#research$/);
  });

  test("'world' command navigates to /world/", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("world");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/world\/?$/);
  });

  test("disabled theme command does not execute", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("theme");
    await page.keyboard.press("Enter");
    // Palette stays open, no navigation
    await expect(page.locator("[data-cmdk]")).toBeVisible();
  });

  test("sketchbook button is visible and links to /world/", async ({ page }) => {
    await page.goto("/");
    const sketch = page.locator(".sketchbook");
    await expect(sketch).toBeVisible();
    await expect(sketch).toHaveAttribute("href", "/world/");
  });
});
