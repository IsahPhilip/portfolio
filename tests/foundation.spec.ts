import { test, expect } from "@playwright/test";

test("homepage, project selector, and contact links", async ({ page }) => {
  await page.goto("");
  await expect(page).toHaveTitle(/AI Automation.*Isah Philip/);
  await expect(page.locator("h1")).toHaveText(
    "Connect your tools.Simplify your workflows.",
  );
  await expect(page.locator('[data-preview="lead-routing"]')).toBeVisible();
  await page.locator('[data-project="client-onboarding"]').click();
  await expect(
    page.locator('[data-preview="client-onboarding"]'),
  ).toBeVisible();
  await expect(page.locator('[data-preview="lead-routing"]')).toBeHidden();
  await expect(
    page.locator('[data-preview="client-onboarding"] a'),
  ).toHaveAttribute("href", "/portfolio/works/client-onboarding/");
  await page.locator('[data-project="client-onboarding"]').press("ArrowRight");
  await expect(
    page.locator('[data-project="connected-reporting"]'),
  ).toBeFocused();
  await expect(
    page.locator('[data-preview="connected-reporting"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-preview="connected-reporting"] img'),
  ).toHaveAttribute("alt", /synthetic/i);
  await expect(
    page.getByRole("link", { name: "Let’s build something" }),
  ).toHaveAttribute("href", /^mailto:Isahphilip50@gmail.com\?subject=/);
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/isah-philip",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("navigation and keyboard access", async ({ page }) => {
  await page.goto("");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const menu = page.getByRole("button", { name: "Menu" });
  if (await menu.isVisible()) {
    await menu.focus();
    await menu.press("Enter");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#primary-nav")).toBeVisible();
    await menu.press("Escape");
    await expect(menu).toBeFocused();
    await expect(page.locator("#primary-nav")).toBeHidden();
    await menu.click();
  }
  await page
    .locator("#primary-nav")
    .getByRole("link", { name: "Works", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portfolio\/works\/$/);
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.locator(".project-card h2 a").first().click();
  await expect(page.locator("h1")).toHaveText(
    "From first enquiry to the right person.",
  );
});

test("content and navigation remain usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator("#primary-nav")).toBeVisible();
  for (const id of ["lead-routing", "client-onboarding", "connected-reporting"])
    await expect(page.locator(`[data-preview="${id}"]`)).toBeVisible();
  await page.locator('[data-preview="lead-routing"] a').click();
  await expect(
    page.getByRole("heading", { name: "Testing", exact: true }),
  ).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeAttached();
  await context.close();
});

test("reduced motion keeps content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("");
  await expect(page.locator("h1")).toBeVisible();
  const signal = page.locator(".signal").first();
  expect(
    await signal.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.locator('[data-project="client-onboarding"]').click();
  await expect(
    page.locator('[data-preview="client-onboarding"]'),
  ).toBeVisible();
  expect(
    await page
      .locator('[data-preview="client-onboarding"]')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("404 provides a working way home", async ({ page }) => {
  const response = await page.goto("missing-page/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "A loose end." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to Home" }).click();
  await expect(page.locator("h1")).toContainText("Connect your tools.");
});
