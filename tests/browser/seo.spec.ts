import { test, expect } from "@playwright/test";

test("production SEO metadata, headers contract, and JSON-LD parse", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Onparmak — Türkçe Q On Parmak Eğitimi/);
  await expect(page.locator('html[lang="tr"]')).toHaveCount(1);
  await expect(
    page.locator('link[rel="canonical"][href="https://onparmak.mhbd.dev/"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('meta[name="description"][content*="60 ders"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('meta[name="robots"][content="index, follow"]'),
  ).toHaveCount(1);
  await expect(
    page.locator(
      'meta[property="og:url"][content="https://onparmak.mhbd.dev/"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator('meta[property="og:locale"][content="tr_TR"]'),
  ).toHaveCount(1);
  await expect(
    page.locator(
      'meta[property="og:image"][content="https://onparmak.mhbd.dev/og-image.png"]',
    ),
  ).toHaveCount(1);
  await expect(
    page.locator('meta[name="twitter:card"][content="summary_large_image"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]'),
  ).toHaveCount(1);
  const structured = await page
    .locator('script[type="application/ld+json"]')
    .innerText();
  const data = JSON.parse(structured);
  expect(data["@type"]).toBe("WebApplication");
  expect(data.url).toBe("https://onparmak.mhbd.dev/");
  expect(data.inLanguage).toBe("tr-TR");
  expect(JSON.stringify(data)).not.toMatch(
    /aggregateRating|review|price|offers/i,
  );
  const noscript = await page.locator("noscript").innerText();
  expect(noscript).toMatch(/60 ders/);

  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const response = await page.request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("https://onparmak.mhbd.dev/");
  }
  const image = await page.request.get("/og-image.png");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});
