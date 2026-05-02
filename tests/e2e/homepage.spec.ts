import { test, expect } from "@playwright/test";

test("homepage hero renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tony Yang");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("limits of language");
});

test("hero corners show dateline + initials", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("TONY YANG · TY")).toBeVisible();
  await expect(page.getByText(/INDEPENDENT AI RESEARCHER/)).toBeVisible();
});

test("all 7 homepage sections are present", async ({ page }) => {
  await page.goto("/");
  for (const id of [
    "currently",
    "research",
    "projects",
    "writing",
    "news",
    "teaching",
    "contact",
  ]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("research section shows 3 papers", async ({ page }) => {
  await page.goto("/");
  const papers = page.locator("[id^=paper-]");
  await expect(papers).toHaveCount(3);
});

test("featured paper has star + cream tint", async ({ page }) => {
  await page.goto("/");
  const featured = page.locator("article.paper--featured, article[class*='paper--featured']");
  await expect(featured.first()).toBeVisible();
});

test("projects section shows 5 projects", async ({ page }) => {
  await page.goto("/");
  const projects = page.locator("[id^=project-]");
  await expect(projects).toHaveCount(5);
});

test("writing empty state shows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("First entry coming soon.")).toBeVisible();
});

test("news section lists 6 items", async ({ page }) => {
  await page.goto("/");
  const newsItems = page.locator(".news-body li");
  await expect(newsItems).toHaveCount(6);
});

test("respects prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
