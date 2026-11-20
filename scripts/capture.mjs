import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.argv[2] || "http://127.0.0.1:4321/portfolio/";
const milestone = process.argv[3] || "local";
await fs.mkdir("artifacts/qa", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.CI ? undefined : "chrome",
  headless: true,
});
const results = [];
for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  for (const [name, path] of [
    ["home", ""],
    ["works", "works/"],
    ["about", "about/"],
    ["case-study", "works/lead-routing/"],
    ["404", "missing-page/"],
  ]) {
    const response = await page.goto(new URL(path, base).href, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.locator("img").evaluateAll(async (imgs) => {
      await Promise.all(
        imgs
          .filter((i) => i.getClientRects().length > 0)
          .map(async (i) => {
            i.loading = "eager";
            await i.decode();
          }),
      );
    });
    const height = await page.locator("body").evaluate((el) => el.scrollHeight);
    for (let y = 0; y < height; y += 800)
      await page.evaluate((y) => scrollTo(0, y), y);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/qa/${milestone}-${name}-${width}.png`,
      fullPage: true,
    });
    results.push({
      name,
      width,
      status: response.status(),
      title: await page.title(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      brokenImages: await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter(
              (i) =>
                i.getClientRects().length > 0 &&
                (!i.complete || i.naturalWidth === 0),
            )
            .map((i) => i.src),
        ),
    });
  }
  await page.close();
}
await fs.writeFile(
  `artifacts/qa/${milestone}-report.json`,
  JSON.stringify(results, null, 2),
);
await browser.close();
console.log(JSON.stringify(results));
if (
  results.some(
    (r) =>
      r.overflow ||
      r.brokenImages.length ||
      r.status !== (r.name === "404" ? 404 : 200),
  )
)
  process.exit(1);
