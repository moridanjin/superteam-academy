import { test, expect } from "@playwright/test";

test.describe("Protected route redirects", () => {
  test("settings redirects to sign-in", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/auth\/sign-in/, { timeout: 10_000 });
  });

  test("certificates redirects to sign-in", async ({ page }) => {
    await page.goto("/certificates");
    await expect(page).toHaveURL(/\/auth\/sign-in/, { timeout: 10_000 });
  });

  test("sign-in page renders after redirect", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/auth\/sign-in/, { timeout: 10_000 });
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: "Welcome back" })
    ).toBeVisible();
  });
});
