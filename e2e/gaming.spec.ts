import { expect, test } from "@playwright/test";

test.describe("gaming mode", () => {
  test("play a full run: start, move, exit", async ({ page }) => {
    await page.goto("/en");

    await page.getByRole("button", { name: "Play the game" }).click();

    const nameInput = page.getByPlaceholder("Your name");
    await expect(nameInput).toBeVisible();
    await expect(page.locator(".gaming-palette-swatch")).toHaveCount(6);

    await nameInput.fill("E2E Runner");
    await page.getByRole("button", { name: "Start", exact: true }).click();

    const exitButton = page.getByRole("button", { name: "Exit game" });
    await expect(exitButton).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");

    await exitButton.click();

    await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Leave" })).toBeVisible();

    await page.getByRole("button", { name: "Leave" }).click();
    await expect(page.getByRole("button", { name: "Play the game" })).toBeVisible();
  });
});
