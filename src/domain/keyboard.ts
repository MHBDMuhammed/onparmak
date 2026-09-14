export type Finger =
  "lp" | "lr" | "lm" | "li" | "ri" | "rm" | "rr" | "rp" | "thumb";
export const fingerNames: Record<Finger, string> = {
  lp: "Sol serçe",
  lr: "Sol yüzük",
  lm: "Sol orta",
  li: "Sol işaret",
  ri: "Sağ işaret",
  rm: "Sağ orta",
  rr: "Sağ yüzük",
  rp: "Sağ serçe",
  thumb: "Başparmak",
};
export interface Key {
  base: string;
  shift?: string;
  finger: Finger;
  code: string;
  width?: number;
}
const row = (
  bases: string[],
  shifts: string[],
  fingers: Finger[],
  codes: string[],
): Key[] =>
  bases.map((base, i) => ({
    base,
    shift: shifts[i],
    finger: fingers[i],
    code: codes[i],
  }));
export const keyboardRows: Key[][] = [
  row(
    ['"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "-"],
    ["é", "!", "'", "^", "+", "%", "&", "/", "(", ")", "=", "?", "_"],
    [
      "lp",
      "lp",
      "lr",
      "lm",
      "li",
      "li",
      "ri",
      "ri",
      "rm",
      "rr",
      "rp",
      "rp",
      "rp",
    ],
    [
      "Backquote",
      "Digit1",
      "Digit2",
      "Digit3",
      "Digit4",
      "Digit5",
      "Digit6",
      "Digit7",
      "Digit8",
      "Digit9",
      "Digit0",
      "Minus",
      "Equal",
    ],
  ),
  row(
    ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
    [],
    ["lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp", "rp", "rp"],
    [
      "KeyQ",
      "KeyW",
      "KeyE",
      "KeyR",
      "KeyT",
      "KeyY",
      "KeyU",
      "KeyI",
      "KeyO",
      "KeyP",
      "BracketLeft",
      "BracketRight",
    ],
  ),
  row(
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i", ","],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ", ";"],
    ["lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp", "rp", "rp"],
    [
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyF",
      "KeyG",
      "KeyH",
      "KeyJ",
      "KeyK",
      "KeyL",
      "Semicolon",
      "Quote",
      "Backslash",
    ],
  ),
  row(
    ["<", "z", "x", "c", "v", "b", "n", "m", "ö", "ç", "."],
    [">", "Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", ":"],
    ["lp", "lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp"],
    [
      "IntlBackslash",
      "KeyZ",
      "KeyX",
      "KeyC",
      "KeyV",
      "KeyB",
      "KeyN",
      "KeyM",
      "Comma",
      "Period",
      "Slash",
    ],
  ),
];
export const lowerTR = (value: string) => value.toLocaleLowerCase("tr-TR");
export const upperTR = (value: string) => value.toLocaleUpperCase("tr-TR");
export const normalizeText = (value: string) => value.normalize("NFC");
export function keyFor(char: string): Key | undefined {
  if (char === " ") return { base: " ", finger: "thumb", code: "Space" };
  return keyboardRows
    .flat()
    .find((k) => k.base === char || (k.shift ?? upperTR(k.base)) === char);
}
export function shiftFor(char: string): "Sol Shift" | "Sağ Shift" | null {
  const key = keyFor(char);
  if (!key || key.base === char) return null;
  return key.finger.startsWith("l") ? "Sağ Shift" : "Sol Shift";
}
export const HOME_KEYS = "asdfjklş";
export const LETTERS = "abcçdefgğhıijklmnoöprsştuüvyzqxw";
