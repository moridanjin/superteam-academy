import { test, expect } from "@playwright/test";

test.describe("Course detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/courses/solana-fundamentals");
  });

  test("shows course title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Solana Fundamentals" })
    ).toBeVisible();
  });

  test("shows What You'll Learn section", async ({ page }) => {
    await expect(page.getByText("What You'll Learn")).toBeVisible();
  });

  test("renders module list", async ({ page }) => {
    await expect(page.getByText("Introduction to Solana")).toBeVisible();
    await expect(page.getByText("Programs & PDAs")).toBeVisible();
  });

  test("shows enroll CTA", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Enroll/i })
    ).toBeVisible();
  });

  test("Back to Courses link navigates back", async ({ page }) => {
    await page.getByRole("link", { name: "Back to Courses" }).click();
    await expect(page).toHaveURL(/\/courses$/);
  });
});
