import { test, expect } from "@playwright/test";

test.describe("Leaderboard page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leaderboard");
  });

  test("shows page header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Leaderboard" })
    ).toBeVisible();
  });

  test("shows time filter buttons", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "All Time" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Monthly" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Weekly" })
    ).toBeVisible();
  });

  test("shows search input", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Search learners...")
    ).toBeVisible();
  });

  test("shows podium with top learners", async ({ page }) => {
    await expect(page.getByText("1st")).toBeVisible();
    await expect(page.getByText("2nd")).toBeVisible();
    await expect(page.getByText("3rd")).toBeVisible();
  });

  test("shows leaderboard rankings", async ({ page }) => {
    await expect(page.getByText("#1", { exact: true })).toBeVisible();
    await expect(page.getByText("Alex Chen").first()).toBeVisible();
  });
});
