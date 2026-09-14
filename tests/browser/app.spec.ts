import { test, expect, type Page } from "@playwright/test";
import { freshProfile } from "../../src/domain/progress";
import { keyFor } from "../../src/domain/keyboard";

const errors: string[] = [];
async function onboard(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByPlaceholder("Sana nasıl seslenelim?").fill("İpek");
  await page.getByRole("button", { name: "Yolculuğuma başla" }).click();
}
async function seed(page: Page) {
  await page.addInitScript(
    (profile) =>
      localStorage.setItem("onparmak.progress.v1", JSON.stringify(profile)),
    { ...freshProfile(), onboarded: true, name: "İpek", theme: "light" },
  );
  await page.goto("/");
}
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(() => {
  expect(errors).toEqual([]);
});

test("onboarding, physical typing, corrections, three rounds, next lesson and persistence", async ({
  page,
}) => {
  await onboard(page);
  for (let round = 0; round < 3; round++) {
    await page.getByRole("button", { name: "Hazırım, başlayalım" }).click();
    await page
      .getByRole("button", { name: "Yazmaya başla", exact: true })
      .click();
    const text = await page.locator(".typing-text").innerText();
    if (round === 0) {
      await page.keyboard.press("x");
      await page.keyboard.press("Backspace");
    }
    await page.keyboard.type(text, { delay: 90 });
    await expect(page.getByText("Ellerin nasıl hissetti?")).toBeVisible();
    if (round === 0) {
      await expect(
        page.locator(".result-detail").getByText("1", { exact: true }),
      ).toHaveCount(2);
    }
    await page.getByLabel("Yanıtlarımı gözden geçirdim.").check();
    await page.getByRole("button", { name: "Çalışmamı kaydet" }).click();
    await page.getByRole("button", { name: "Sıradaki adım" }).click();
  }
  await expect(page.getByRole("dialog")).toContainText("Ortayı bul");
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Merhaba, İpek." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("onparmak.progress.v1")!).lessons.s1l1
          .rounds,
    ),
  ).toBe(3);
  await page.getByRole("button", { name: "Öğrenme yolu", exact: true }).click();
  await expect(page.locator(".lesson-current")).toContainText("Ortayı bul");
});

test("free practice duration, focus pause, exact timer end and results save", async ({
  page,
}) => {
  await seed(page);
  await page.clock.install();
  await page
    .getByRole("button", { name: "Serbest antrenman", exact: true })
    .click();
  await page.getByRole("button", { name: "1 dakika", exact: true }).click();
  await page
    .getByRole("button", { name: "Kelime akışı", exact: false })
    .click();
  await page.getByRole("button", { name: "Akışa başla" }).click();
  await page
    .getByRole("button", { name: "Yazmaya başla", exact: true })
    .click();
  const text = await page.locator(".typing-text").innerText();
  for (const char of text.slice(0, 40)) {
    await page
      .getByRole("textbox")
      .dispatchEvent("keydown", { key: char, code: keyFor(char)?.code });
    await page.clock.runFor(200);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByText("Ritmin seni bekliyor.")).toBeVisible();
  const before = await page.locator(".workspace-timer").innerText();
  await page.clock.runFor(120000);
  expect(await page.locator(".workspace-timer").innerText()).toBe(before);
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.clock.runFor(60000);
  await expect(page.getByText("Ellerin nasıl hissetti?")).toBeVisible();
  await expect(page.locator(".result-stats")).toContainText("1:00");
  await page.getByLabel("Yanıtlarımı gözden geçirdim.").check();
  await page.getByRole("button", { name: "Çalışmamı kaydet" }).click();
  await page.getByRole("button", { name: "Çalışma alanıma dön" }).click();
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem("onparmak.progress.v1")!).sessions,
  );
  expect(saved).toHaveLength(1);
  expect(saved[0].metrics.elapsed).toBe(60000);
  expect(saved[0].metrics.pauses).toBe(1);
});

test("all pages, themes, mobile widths, screenshots and no horizontal overflow", async ({
  page,
}) => {
  await seed(page);
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  for (const label of [
    "Öğrenme yolu",
    "Serbest antrenman",
    "Gelişimim",
    "Yazma rehberi",
    "Ayarlar",
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Koyu", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Çalışma alanım", exact: true })
    .click();
  await page.screenshot({
    path: "test-results/home-dark.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "İlk dersime başla", exact: true })
    .click();
  await page.getByRole("button", { name: "Hazırım, başlayalım" }).click();
  await page
    .getByRole("button", { name: "Yazmaya başla", exact: true })
    .click();
  await page.screenshot({
    path: "test-results/workspace-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Çalışmayı kapat" }).click();
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const label of [
      "Çalışma alanım",
      "Öğrenme yolu",
      "Serbest antrenman",
      "Gelişimim",
      "Yazma rehberi",
      "Ayarlar",
    ]) {
      if (width < 761)
        await page.getByRole("button", { name: "Menüyü aç" }).click();
      await page.getByRole("button", { name: label, exact: true }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        label + " " + width,
      ).toBe(true);
      if (width === 390 && label === "Çalışma alanım")
        await page.screenshot({
          path: "test-results/home-mobile.png",
          fullPage: true,
          animations: "disabled",
        });
    }
  }
});

test("settings backup validation and deliberate reset", async ({ page }) => {
  await seed(page);
  await page.getByRole("button", { name: "Ayarlar", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Yedek indir", exact: true }).click();
  expect((await download).suggestedFilename()).toContain("onparmak-yedek");
  await page.getByLabel("Yedek dosyası seç").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByRole("alert")).toContainText(
    "geçerli bir Onparmak yedeği değil",
  );
  await page.getByRole("button", { name: "İlerlemeyi sıfırla" }).click();
  await expect(
    page.getByRole("button", { name: "Tüm ilerlemeyi sil" }),
  ).toBeDisabled();
  await page.getByLabel("Onaylamak için SIFIRLA yaz").fill("SIFIRLA");
  await page.getByRole("button", { name: "Tüm ilerlemeyi sil" }).click();
  await expect(
    page.getByRole("dialog", { name: "Onparmak başlangıç rehberi" }),
  ).toBeVisible();
});
