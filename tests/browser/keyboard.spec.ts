import { test, expect } from "@playwright/test";
import { freshProfile, recordSession } from "../../src/domain/progress";
import { TypingEngine } from "../../src/domain/engine";
import { lessons } from "../../src/content/curriculum";
import { keyFor, shiftFor } from "../../src/domain/keyboard";

test("Turkish dotted and dotless I use opposing Shift and preserve exact text", async ({
  page,
}) => {
  const profile = { ...freshProfile(), onboarded: true };
  for (const lesson of lessons.slice(0, 32))
    profile.lessons[lesson.id] = { rounds: 3, bestAccuracy: 100 };
  await page.addInitScript(
    (p) => localStorage.setItem("onparmak.progress.v1", JSON.stringify(p)),
    profile,
  );
  await page.goto("/");
  await page.clock.install();
  await page
    .getByRole("button", { name: "İlk dersime başla", exact: true })
    .click();
  await page.getByRole("button", { name: "Hazırım, başlayalım" }).click();
  await page
    .getByRole("button", { name: "Yazmaya başla", exact: true })
    .click();
  const text = await page.locator(".typing-text").innerText();
  expect(text).toContain("İ");
  expect(text).toContain("I");
  const input = page.getByRole("textbox");
  for (const char of text) {
    const shift = shiftFor(char);
    const code = shift === "Sol Shift" ? "ShiftLeft" : "ShiftRight";
    if (shift) await input.dispatchEvent("keydown", { key: "Shift", code });
    await input.dispatchEvent("keydown", {
      key: char,
      code: keyFor(char)?.code,
      shiftKey: Boolean(shift),
    });
    if (shift && char !== text.at(-1))
      await input.dispatchEvent("keyup", { key: "Shift", code });
    await page.clock.runFor(120);
  }
  await expect(page.getByText("Ellerin nasıl hissetti?")).toBeVisible();
  await page.getByLabel("Yanıtlarımı gözden geçirdim.").check();
  await page.getByRole("button", { name: "Çalışmamı kaydet" }).click();
  const session = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("onparmak.progress.v1")!).sessions.at(-1),
  );
  expect(session.metrics.accuracy).toBe(100);
  expect(session.metrics.wrongShift).toBe(0);
  expect(session.passed).toBe(true);
});

test("dialog focus stays inside, paste and held letters cannot type, held backspace can correct", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page
      .locator(".app-shell")
      .evaluate((element) =>
        element instanceof HTMLElement ? element.inert : false,
      ),
  ).toBe(true);
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Devam et", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByRole("button", { name: "Yolculuğuma başla" }).click();
  await page.getByRole("button", { name: "Hazırım, başlayalım" }).click();
  await page
    .getByRole("button", { name: "Yazmaya başla", exact: true })
    .click();
  const input = page.getByRole("textbox");
  await input.dispatchEvent("paste");
  await input.dispatchEvent("keydown", {
    key: "f",
    code: "KeyF",
    repeat: true,
  });
  await expect(page.locator(".typed-correct,.typed-wrong")).toHaveCount(0);
  await page.keyboard.type("fj");
  await input.dispatchEvent("keydown", {
    key: "Backspace",
    code: "Backspace",
    repeat: true,
  });
  await expect(page.locator(".typed-correct,.typed-wrong")).toHaveCount(1);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.getByText("Ritmin seni bekliyor.")).toBeVisible();
});

test("corrupt local progress is reported and never silently overwritten", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("onparmak.progress.v1", "unreadable-record"),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByRole("button", { name: "Devam et", exact: true }).click();
  await page.getByRole("button", { name: "Yolculuğuma başla" }).click();
  await page.getByRole("button", { name: "Kapat", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Eski kaydın üzerine yazılmadı",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("onparmak.progress.v1")),
  ).toBe("unreadable-record");
});

test("successful personal review returns to the next course lesson", async ({
  page,
}) => {
  const engine = new TypingEngine("f j ".repeat(20));
  let at = 1000;
  for (const char of engine.text) {
    engine.input(char, at);
    at += 200;
  }
  const profile = recordSession(
    { ...freshProfile(), onboarded: true },
    {
      id: "review-preparation",
      at: Date.now(),
      mode: "practice",
      round: 2,
      metrics: engine.metrics(at),
      passed: true,
      comfortable: true,
      fingers: true,
      blind: true,
      targets: [],
      assisted: false,
    },
    engine.strokes,
  );
  await page.addInitScript(
    (p) => localStorage.setItem("onparmak.progress.v1", JSON.stringify(p)),
    profile,
  );
  await page.goto("/");
  await page.clock.install();
  await page
    .getByRole("button", { name: "Kişisel tekrar yap", exact: true })
    .click();
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
  await page.clock.runFor(120000);
  await page.getByLabel("Yanıtlarımı gözden geçirdim.").check();
  await page.getByRole("button", { name: "Çalışmamı kaydet" }).click();
  await page.getByRole("button", { name: "Öğrenme yoluna dön" }).click();
  await expect(page.getByRole("dialog")).toContainText("İlk dokunuş");
});
