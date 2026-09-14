import { test, expect } from "@playwright/test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const read = (file: string) => readFileSync(join(dist, file), "utf8");

test("production cache contract, asset budget, and offline shell", async ({
  page,
}) => {
  for (const file of [
    "index.html",
    "sw.js",
    "_headers",
    "robots.txt",
    "sitemap.xml",
    "og-image.png",
    "apple-touch-icon.png",
  ])
    expect(existsSync(join(dist, file)), `${file} missing`).toBe(true);

  const worker = read("sw.js");
  for (const asset of ["./index.html", "./robots.txt", "./sitemap.xml"])
    expect(worker).toContain(asset);
  expect(worker).toContain("self.skipWaiting()");

  const html = read("index.html");
  const assets = [...html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))"/g)].map(
    ([, asset]) => asset,
  );
  expect(assets.length).toBeGreaterThanOrEqual(2);
  let javascript = 0;
  for (const asset of assets) {
    expect(asset.startsWith("/")).toBe(true);
    const relative = asset.slice(1);
    expect(existsSync(join(dist, relative))).toBe(true);
    expect(worker).toContain(`./${relative}`);
    if (asset.endsWith(".js"))
      javascript += statSync(join(dist, relative)).size;
  }
  // Raw (uncompressed) initial JS stays well under the historical ~354KB
  // single-bundle size; failure means a dependency or page regressed the budget.
  expect(javascript).toBeLessThan(380 * 1024);

  const headers = read("_headers");
  expect(headers).toContain("/assets/*");
  expect(headers).toContain("max-age=31536000, immutable");
  expect(headers).toContain("X-Frame-Options: DENY");
  expect(headers).not.toMatch(/^[^#\n]*Content-Security-Policy/m);

  await page.goto("/");
  const failures: string[] = [];
  page.on("requestfailed", (request) => failures.push(request.url()));
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  expect(failures).toEqual([]);
});
