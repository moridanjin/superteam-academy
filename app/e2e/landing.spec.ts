import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows hero headline", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Master Solana Development" })
    ).toBeVisible();
  });

  test("shows CTA buttons", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Start Learning" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Courses" }).first()
    ).toBeVisible();
  });

  test("navbar has Courses and Leaderboard links", async ({ page }) => {
    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: "Courses" })).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Leaderboard" })
    ).toBeVisible();
  });

  test("footer renders with brand text", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(
      footer.getByRole("link", { name: /Superteam Academy/ })
    ).toBeVisible();
  });

  test("Explore Courses CTA navigates to /courses", async ({ page }) => {
    await page
      .getByRole("link", { name: "Explore Courses" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/courses/);
  });
});
