import { test, expect } from "@playwright/test";

test("production caches all local assets, reopens offline and preserves onboarding", async ({
  page,
  context,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (new URL(r.url()).hostname !== "127.0.0.1") external.push(r.url());
  });
  await page.goto("http://127.0.0.1:4173");
  await expect(
    page.locator('meta[http-equiv="Content-Security-Policy"]'),
  ).toHaveAttribute("content", /connect-src 'self'/);
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await expect
    .poll(() =>
      page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByPlaceholder("Sana nasıl seslenelim?").fill("Deniz");
  await page.getByRole("button", { name: "Yolculuğuma başla" }).click();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Merhaba, Deniz." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Serbest antrenman", exact: true })
    .click();
  await page.getByRole("button", { name: "Akışa başla" }).click();
  await page
    .getByRole("button", { name: "Yazmaya başla", exact: true })
    .click();
  await page.keyboard.press("f");
  await expect(page.locator(".typed-correct,.typed-wrong")).toHaveCount(1);
  expect(external).toEqual([]);
});
