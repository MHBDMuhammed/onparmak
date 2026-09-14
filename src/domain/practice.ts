import { words, passages } from "../content/turkish";
import { lessons, type Lesson } from "../content/curriculum";
import { keyFor, lowerTR, upperTR } from "./keyboard";
import { reviewTargets, type Profile } from "./progress";

export type Difficulty = "personal" | "words" | "text" | "mixed";
export interface Training {
  mode: "lesson" | "practice" | "review";
  lesson?: Lesson;
  round: number;
  duration: number;
  text: string;
  targets: string[];
  difficulty: Difficulty;
}
export const shuffle = <T>(items: T[], random = Math.random) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export function learnedKeys(profile: Profile) {
  return [
    ...new Set(
      " fj" +
        Object.keys(profile.skills).join("") +
        lessons
          .filter((l) => profile.lessons[l.id]?.rounds === 3)
          .map((l) => l.keys)
          .join(""),
    ),
  ].join("");
}
export function generateWords(
  keys: string | undefined,
  targets: string[],
  count: number,
  random = Math.random,
) {
  const allowed = keys ? new Set(lowerTR(keys)) : null;
  const pool = [...new Set(words.map(lowerTR))].filter(
    (w) => !allowed || [...w].every((c) => allowed.has(c)),
  );
  const targeted = pool.filter((w) =>
    targets.some((t) => lowerTR(w).includes(lowerTR(t))),
  );
  const output: string[] = [];
  let generalDeck = shuffle(pool, random),
    targetDeck = shuffle(targeted, random);
  for (let i = 0; i < count; i++) {
    const focus = targets.length > 0 && i % 3 !== 2 && targeted.length > 0;
    if (focus && !targetDeck.length) targetDeck = shuffle(targeted, random);
    if (!generalDeck.length) generalDeck = shuffle(pool, random);
    let word = focus ? targetDeck.pop() : generalDeck.pop();
    if (!word) {
      const chars = [...(keys ?? "fj")].filter((c) => c !== " ");
      word = Array.from(
        { length: 3 },
        () => chars[Math.floor(random() * chars.length)] ?? "f",
      ).join("");
    }
    if (output.at(-1) === word && pool.length > 1)
      word = pool.find((w) => w !== word)!;
    output.push(word);
  }
  return output.join(" ");
}
// Mix weak transitions, confused pairs and the least accurate finger region into real words.
export function adaptiveTargets(profile: Profile, keys?: string): string[] {
  const allowed = (target: string) =>
    !keys || [...target].every((c) => keys.includes(c));
  const pairs = Object.entries(profile.transitions)
    .filter(
      ([k, s]) =>
        !k.includes(" ") && s.attempts >= 3 && s.recent < 0.96 && allowed(k),
    )
    .sort((a, b) => a[1].recent - b[1].recent)
    .slice(0, 2)
    .map(([k]) => k);
  const confusions = Object.entries(profile.confusions)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .flatMap(([pair]) => pair.split("→").map(lowerTR))
    .filter(allowed);
  const regions = new Map<
    string,
    { attempts: number; errors: number; keys: string[] }
  >();
  for (const [key, skill] of Object.entries(profile.skills)) {
    const finger = keyFor(key)?.finger;
    if (!finger || finger === "thumb" || !allowed(key)) continue;
    const region = regions.get(finger) ?? { attempts: 0, errors: 0, keys: [] };
    region.attempts += skill.attempts;
    region.errors += skill.attempts * (1 - skill.recent);
    region.keys.push(key);
    regions.set(finger, region);
  }
  const region = [...regions.values()]
    .filter((r) => r.attempts >= 15 && r.errors / r.attempts > 0.05)
    .sort((a, b) => b.errors / b.attempts - a.errors / a.attempts)[0];
  return [
    ...new Set([
      ...pairs,
      ...confusions,
      ...reviewTargets(profile).filter(allowed),
      ...(region?.keys ?? []).slice(0, 2),
    ]),
  ].slice(0, 10);
}
const excerpts: Record<string, string[]> = {
  s7l1: [
    "Ada Eda Seda Aslı Defne Gaye Feride Eren Ceren Veli Barış Zeynep",
    "Ankara Edirne Samsun Antalya Eskişehir Gaziantep Denizli Bursa",
  ],
  s7l2: [
    "Hale Jale Kemal Levent Şule İpek Yasemin Ufuk Oya Pelin Ümit Ömer Çınar",
    "Hatay Kayseri Yalova Ordu Uşak Muğla Niğde Çorum",
  ],
  s7l3: [
    "İpek Irmak İrem Işıl İstanbul Isparta İzmir Ilgaz Iğdır İzmit",
    "İyi bir ışık Ilgaz ile İpek için önemli Işıl yeni bir iş için İzmir yolunda",
  ],
  s7l4: [
    "Ankara İzmir Bursa İstanbul Isparta Çorum Şırnak Muğla Üsküdar",
    "Deniz bugün İzmir yolunda İpek ve Irmak yarın Ankara yolunda",
  ],
  s7l5: [
    "İpek bugün Isparta yolunda Işıl ise İstanbul içinde geziyor",
    "Ömer ve Çınar güzel bir günde Üsküdar sahilinde yürüdü",
  ],
  s8l1: [
    "Bugün hava güzel. Biraz yürüdüm, kitap okudum.",
    "İpek elma, armut ve üzüm aldı. Eve erken döndü.",
  ],
  s8l2: [
    "Plan açık: önce oku, sonra yaz. Acele etme; rahatça ilerle.",
    "Çantada üç şey var: kitap, kalem ve defter. Gün bitti; eve döndük.",
  ],
  s8l3: [
    "Bugün nasılsın? Ben çok iyiyim! Birlikte yürüyelim mi?",
    "Bu ne güzel bir haber! Yarın gelir misin? Elbette!",
  ],
  s8l4: [
    'İpek, "Yarın gelirim" dedi. Ankara\'ya giden tren (doğu hattı) hazır.',
    "Not - önce oku. Yeni kitap (ikinci baskı) İzmir'de çıktı.",
  ],
  s9l1: [
    "11 22 33 44 55 12 23 34 45 51 142 253 341 415 524",
    "Bir kitap 25 lira. 3 kalem ve 14 defter hazır. Saat 11:35.",
  ],
  s9l2: [
    "66 77 88 99 00 67 78 89 90 06 678 790 806 987 609",
    "Bugün 60 sayfa okudum. Yol 87 kilometre. Saat 09:08.",
  ],
  s9l3: [
    "Tarih: 12.09.2026. Başlangıç: 09:30. Bitiş: 17:45.",
    "Randevu 23/10/2026 günü saat 14:15 olarak kaydedildi.",
  ],
  s9l4: [
    "Tutar: 125,50 lira. İndirim: %15. İşlem: 12+8=20.",
    "Dosya adı: not_1. Ölçü: 4*5=20. Aralık: 3<5>2. A&B.",
  ],
  s9l5: [
    "Toplantı 18.09.2026 tarihinde, 10:30-11:45 arasında. Katılımcı sayısı: 28.",
    "Sipariş: 3 defter, 12 kalem. Toplam 450,75 lira. İndirim %10.",
  ],
};
export function textForLesson(
  lesson: Lesson,
  profile: Profile,
  round: number,
): string {
  const focus = [...lesson.focus].filter(
    (c) => c !== " " && lesson.keys.includes(c),
  );
  const weak = adaptiveTargets(profile, lesson.keys);
  const targets = [...new Set([...focus, ...weak])];
  if (excerpts[lesson.id]) return shuffle(excerpts[lesson.id]).join(" ");
  if (lesson.stage >= 9 && lesson.kind !== "words") {
    const source =
      lesson.id === "s11l3"
        ? [passages[10], passages[5]]
        : lesson.id === "s11l4"
          ? [passages[11], passages[12], passages[16]]
          : passages;
    return shuffle(source).join(" ");
  }
  if (lesson.stage === 7)
    return (
      shuffle(
        passages.filter((p) => [...p].every((c) => lesson.keys.includes(c))),
      )[0] || excerpts.s8l1.join(" ")
    );
  if (lesson.stage === 0 && lesson.number < 4) {
    const chars = [...lesson.keys].filter((c) => c !== " ");
    const newChars = [...lesson.focus];
    const groups = round === 0 ? newChars.map((c) => c.repeat(3)) : [];
    for (let i = 0; i < 20 + round * 4; i++) {
      const a = chars[Math.floor(Math.random() * chars.length)],
        b = newChars[i % newChars.length];
      groups.push(i % 3 === 0 ? a + b + a : b + a);
    }
    return groups.join(" ");
  }
  const last = profile.sessions.at(-1);
  const ease = Boolean(
    last &&
    (last.metrics.accuracy < 95 ||
      !last.comfortable ||
      (last.metrics.elapsed > 120000 &&
        last.metrics.lateWpm < last.metrics.earlyWpm * 0.7)),
  );
  let text = generateWords(lesson.keys, targets, (ease ? 18 : 24) + round * 8);
  // New rare keys must get actual motor exposure even when the natural word pool is small.
  const must = [
    ...(lesson.newKeys ||
      (lesson.kind === "keys" ? lesson.focus.replaceAll(" ", "") : "")),
  ].filter((c) => [...text].filter((t) => t === c).length < 6);
  if (must.length)
    text = must.map((c) => `${c}${c} ${c}${c} ${c}${c}`).join(" ") + " " + text;
  return text;
}
export function makeTraining(
  profile: Profile,
  options: {
    mode: Training["mode"];
    lesson?: Lesson;
    minutes?: number;
    difficulty?: Difficulty;
  },
): Training {
  const lesson = options.lesson;
  const round = lesson
    ? Math.min(2, profile.lessons[lesson.id]?.rounds ?? 0)
    : 2;
  const targets =
    options.mode === "review"
      ? reviewTargets(profile)
      : lesson
        ? [
            ...new Set(
              [...lesson.focus].filter(
                (c) => c !== " " && lesson.keys.includes(c),
              ),
            ),
          ]
        : reviewTargets(profile).slice(0, 3);
  const difficulty = options.difficulty ?? "personal";
  const timed =
    lesson &&
    lesson.stage >= 9 &&
    ["rhythm", "speed", "endurance", "checkpoint", "transfer"].includes(
      lesson.kind,
    );
  const duration = lesson
    ? timed
      ? lesson.seconds * 1000
      : 0
    : (options.minutes ?? 2) * 60000;
  const training: Training = {
    mode: options.mode,
    lesson,
    round,
    duration,
    targets,
    difficulty,
    text: "",
  };
  training.text = lesson
    ? textForLesson(lesson, profile, round)
    : practiceChunk(profile, training);
  return training;
}
export function practiceChunk(profile: Profile, training: Training) {
  if (training.lesson)
    return textForLesson(training.lesson, profile, training.round);
  if (training.difficulty === "text")
    return shuffle(
      passages.filter((_, i) => i !== 11 && i !== 12 && i !== 16),
    ).join(" ");
  if (training.difficulty === "mixed") return shuffle(passages).join(" ");
  const keys =
    training.difficulty === "personal" &&
    Object.keys(profile.skills).length < 25
      ? learnedKeys(profile)
      : undefined;
  const targets = [
    ...new Set([...training.targets, ...adaptiveTargets(profile, keys)]),
  ];
  let text = generateWords(keys, targets, 120);
  if (training.mode === "review") {
    const pairs = Object.entries(profile.confusions)
      .filter(
        ([pair, count]) =>
          count >= 2 &&
          pair
            .split("→")
            .every((c) => c !== " " && (!keys || keys.includes(lowerTR(c)))),
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([pair]) => pair.split("→").map(lowerTR));
    const contrasts = pairs
      .map(([a, b]) => `${a}${b} ${b}${a} ${a}${a} ${b}${b}`)
      .join(" ");
    if (contrasts) text = contrasts + " " + text;
  }
  return text;
}
export function displayKeys(focus: string) {
  return focus.length < 12
    ? [...focus].filter((c) => c !== " ").map(upperTR)
    : [];
}
