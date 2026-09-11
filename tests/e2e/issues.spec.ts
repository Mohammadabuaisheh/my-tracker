import { test, expect } from "@playwright/test";

test.describe("My Tracker Core Workflows", () => {
  test("creates an issue and renders it on the board", async ({ page }) => {
    const issueTitle = `Test Task ${Date.now()}`;

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Active Issues" })).toBeVisible();

    // Trigger creation dialog via "+ New Issue" button
    await page.getByRole("button", { name: "New Issue" }).click();

    // Fill form
    const titleInput = page.getByPlaceholder("Issue title...");
    await expect(titleInput).toBeVisible();
    await titleInput.fill(issueTitle);

    // Submit form
    await page.getByRole("button", { name: "Create Issue" }).click();

    // Verify card appears on board
    await expect(page.getByText(issueTitle)).toBeVisible({ timeout: 10000 });
  });

  test("toggles between Board and List views with URL synchronization", async ({ page }) => {
    await page.goto("/");

    // Click List View button
    await page.getByRole("button", { name: "List view" }).click();
    await expect(page).toHaveURL(/view=list/);
    await expect(page.getByRole("table")).toBeVisible();

    // Click Board View button (nuqs clears default parameter from the URL)
    await page.getByRole("button", { name: "Board view" }).click();
    await expect(page).not.toHaveURL(/view=list/);
    await expect(page.getByRole("heading", { name: "TO DO", exact: false })).toBeVisible();
  });

  test("filters issues using priority toggle buttons", async ({ page }) => {
    await page.goto("/");

    const urgentButton = page.getByRole("button", { name: "urgent" });
    await urgentButton.click();

    // Verify nuqs URL update
    await expect(page).toHaveURL(/priority=urgent/);
    await expect(urgentButton).toHaveAttribute("aria-pressed", "true");

    // Clear filter
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page).not.toHaveURL(/priority=urgent/);
  });

  test("navigates to projects dashboard", async ({ page }) => {
    await page.goto("/");

    // Click Projects link in sidebar
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("button", { name: "New Project" })).toBeVisible();
  });
});