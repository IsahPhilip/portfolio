import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "",
  "works/",
  "about/",
  "works/lead-routing/",
  "works/client-onboarding/",
  "works/connected-reporting/",
];

test("accessible page structure and contrast", async ({ page }) => {
  for (const route of [
    "",
    "works/",
    "about/",
    "works/lead-routing/",
    "missing-page/",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
      route,
    ).toEqual([]);
  }
});

test("SEO metadata, images, and all internal routes resolve", async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  for (const route of pages) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(titles.has(title)).toBe(false);
    titles.add(title);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      (await page.locator('meta[name="description"]').getAttribute("content"))!
        .length,
    ).toBeGreaterThan(50);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBe(`https://isahphilip.github.io/portfolio/${route}`);
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      const image = await page.locator(selector).getAttribute("content");
      expect(image).toBe(
        "https://isahphilip.github.io/portfolio/social-cover.png",
      );
    }
    const schema = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    expect(schema["@graph"][1].name).toBe("Isah Philip");
    if (process.env.CI && process.env.PLAYWRIGHT_BASE_URL) {
      await expect(page.locator('meta[name="build-revision"]')).toHaveAttribute(
        "content",
        process.env.GITHUB_SHA!,
      );
    }
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) => [
        ...new Set(
          links
            .map((a) => a.getAttribute("href")!)
            .filter((href) => href.startsWith("/portfolio/")),
        ),
      ]);
    for (const href of hrefs)
      expect((await request.get(href)).status(), href).toBe(200);
    const images = page.locator("img");
    for (const img of await images.all()) {
      const src = await img.getAttribute("src");
      expect((await request.get(src!)).status(), src!).toBe(200);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const sitemap = await request.get("sitemap-0.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).not.toContain("404");
  for (const route of pages)
    expect(xml).toContain(`https://isahphilip.github.io/portfolio/${route}`);
  expect(await (await request.get("robots.txt")).text()).toContain(
    "https://isahphilip.github.io/portfolio/sitemap-index.xml",
  );
  expect((await request.get("social-cover.png")).status()).toBe(200);
  await page.goto("missing-page/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
});

test("mobile menu remains usable with keyboard and a larger text scale", async ({
  page,
}) => {
  await page.goto("");
  await page.addStyleTag({ content: "html {font-size: 20px}" });
  const menu = page.getByRole("button", { name: "Menu" });
  if (await menu.isVisible()) {
    await menu.focus();
    await menu.press("Enter");
    const home = page.locator("#primary-nav a").first();
    await page.keyboard.press("Tab");
    await expect(home).toBeFocused();
    expect(await home.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
      "solid",
    );
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
  }
  await page
    .locator("#primary-nav")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about\/$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("case-study contents work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(new URL("works/lead-routing/", baseURL!).href);
  await expect(page.locator(".toc details")).toHaveAttribute("open", "");
  await page.locator('.toc a[href="#testing"]').click();
  await expect(page).toHaveURL(/#testing$/);
  await expect(
    page.getByRole("heading", { name: "Testing", exact: true }),
  ).toBeVisible();
  await context.close();
});
