import { test, expect } from "@playwright/test";

test.describe("Course catalog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/courses");
  });

  test("shows page header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Course Catalog" })
    ).toBeVisible();
  });

  test("renders course cards", async ({ page }) => {
    const main = page.getByRole("main");
    await expect(
      main.locator('[data-slot="card"]').first()
    ).toBeVisible();
  });

  test("search filters courses", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search courses...").first();
    await searchInput.fill("DeFi");
    await page.waitForTimeout(400);
    await expect(page.getByText("DeFi on Solana")).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Solana Fundamentals" })
    ).not.toBeVisible();
  });

  test("clearing search restores all courses", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search courses...").first();
    await searchInput.fill("DeFi");
    await page.waitForTimeout(400);
    await searchInput.clear();
    await page.waitForTimeout(400);
    const cards = page.getByRole("main").locator('[data-slot="card"]');
    await expect(cards).toHaveCount(6);
  });

  test("difficulty filter buttons exist", async ({ page }) => {
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Beginner" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Intermediate" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Advanced" })
    ).toBeVisible();
  });

  test("Beginner filter shows only beginner courses", async ({ page }) => {
    await page.getByRole("button", { name: "Beginner" }).click();
    const cards = page.getByRole("main").locator('[data-slot="card"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator("h3")).toContainText(
      "Solana Fundamentals"
    );
  });

  test("course card links to course detail", async ({ page }) => {
    await page
      .getByRole("main")
      .locator('[data-slot="card"]')
      .first()
      .click();
    await expect(page).toHaveURL(/\/courses\//);
  });
});
