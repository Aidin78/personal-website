import { expect, test } from "@playwright/test";

test.describe("portfolio smoke", () => {
  test("home loads with brand and main nav", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("about and contact routes render; projects gated", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { name: /Aidin|آیدین/i }).first()).toBeVisible();

    const projectsResponse = await page.goto("/en/projects");
    const projectsNav = page.getByRole("navigation").getByRole("link", { name: "Projects" });
    const projectsVisible = (await projectsNav.count()) > 0;

    if (projectsVisible) {
      expect(projectsResponse?.ok()).toBeTruthy();
      await expect(page.getByRole("heading").first()).toBeVisible();
      await expect(page.locator('a[href*="/projects/"]').first()).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
    }

    await page.goto("/en/contact");
    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    await expect(page.getByRole("link", { name: "GitHub" }).first()).toBeVisible();
  });

  test("locale switch toggles en and fa", async ({ page }) => {
    await page.goto("/en");

    await Promise.all([
      page.waitForURL(/\/fa(\/|$)/),
      page.getByRole("button", { name: "Switch to فارسی" }).click(),
    ]);
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await Promise.all([
      page.waitForURL(/\/en(\/|$)/),
      page.getByRole("button", { name: /تغییر به English|Switch to English/i }).click(),
    ]);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("theme toggle cycles document theme class", async ({ page }) => {
    await page.goto("/en");
    const toggle = page.getByRole("button", { name: /Switch to (light|dark|system)/i });
    await expect(toggle).toBeVisible();

    const beforeLabel = await toggle.getAttribute("aria-label");
    await toggle.click();
    await expect(toggle).not.toHaveAttribute("aria-label", beforeLabel ?? "");
  });
});
