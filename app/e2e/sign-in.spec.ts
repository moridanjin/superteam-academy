import { test, expect } from "@playwright/test";

test.describe("Sign-in page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/sign-in");
  });

  test("shows welcome heading", async ({ page }) => {
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Welcome back" })
    ).toBeVisible();
  });

  test("shows Google and GitHub sign-in buttons", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /Google/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /GitHub/i })
    ).toBeVisible();
  });

  test("has link back to homepage", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Superteam Academy" })
    ).toBeVisible();
  });
});
