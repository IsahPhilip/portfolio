import { test, expect } from "@playwright/test";

test("Works links to three complete case studies", async ({ page }) => {
  await page.goto("works/");
  await expect(page.locator("h1")).toContainText("Systems with");
  const cards = page.locator(".project-card");
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await expect(card.locator(".demo-label")).toHaveText("Demo case study");
    await expect(card.locator(".system-type")).not.toBeEmpty();
  }
  const paths = await cards
    .locator("h2 a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")!));
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator(".prose h2")).toHaveCount(6);
    await expect(page.locator(".case-demo-note")).toContainText(
      "not a client engagement",
    );
    await expect(page.locator(".toc a")).toHaveCount(6);
    await expect(page.locator(".prose")).toContainText(
      /No production results|no measured production|no production metrics/i,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("case study deep links, active contents, and mobile disclosure", async ({
  page,
}) => {
  await page.goto("works/lead-routing/#system-design");
  const heading = page.getByRole("heading", {
    name: "System design",
    exact: true,
  });
  await expect(heading).toBeVisible();
  await expect(page.locator('.toc a[href="#system-design"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  const details = page.locator(".toc details");
  const compact = (page.viewportSize()?.width || 0) < 1000;
  if (compact) {
    await expect(details).not.toHaveAttribute("open", "");
    await page.locator(".toc summary").click();
    await expect(details).toHaveAttribute("open", "");
  } else {
    expect(
      await page
        .locator(".toc")
        .evaluate((el) => getComputedStyle(el).position),
    ).toBe("sticky");
  }
  await page.locator('.toc a[href="#testing"]').click();
  await expect(page).toHaveURL(/#testing$/);
  await expect(page.locator('.toc a[href="#testing"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  if (compact) await expect(details).not.toHaveAttribute("open", "");
  await page.reload();
  await expect(page.locator('.toc a[href="#testing"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await page
    .locator("#results")
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await expect(page.locator('.toc a[href="#results"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("About has services, tools, contact, and no invented résumé", async ({
  page,
}) => {
  await page.goto("about/");
  await expect(page.locator("h1")).toContainText("between the tools");
  await expect(page.locator(".service-card")).toHaveCount(3);
  await expect(page.locator(".tools-grid > span")).toHaveCount(12);
  await expect(page.getByRole("link", { name: /résumé|resume/i })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("link", { name: "Let’s talk about your workflow" }),
  ).toHaveAttribute("href", /^mailto:Isahphilip50@gmail.com/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
