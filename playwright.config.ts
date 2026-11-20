import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4321/portfolio/",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
  },
  projects: [390, 768, 1440].map((width) => ({
    name: `${width}px`,
    use: { viewport: { width, height: 1000 } },
  })),
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run preview -- --port 4321",
        url: "http://127.0.0.1:4321/portfolio/",
        reuseExistingServer: true,
        timeout: 60000,
      },
});
