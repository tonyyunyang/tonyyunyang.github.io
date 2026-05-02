import { test, expect } from "@playwright/test";

test("/writing index renders empty state when only drafts", async ({ page }) => {
  await page.goto("/writing/");
  await expect(page.getByText(/First entry coming soon/i)).toBeVisible();
});

test("/rss.xml returns a valid feed", async ({ page }) => {
  const response = await page.goto("/rss.xml");
  expect(response?.status()).toBe(200);
  const body = await page.content();
  expect(body).toMatch(/Tony Yang.*Writing/i);
});
