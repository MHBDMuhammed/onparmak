import type { Metrics, Stroke } from "./engine";
import { lessons, type Lesson } from "../content/curriculum";
import { lowerTR } from "./keyboard";

export const STORAGE_KEY = "onparmak.progress.v1";
export const DAY = 86_400_000;
export interface Skill {
  attempts: number;
  errors: number;
  recent: number;
  latency: number;
  samples: number;
  sessions: number;
  last: number;
  due: number;
  interval: number;
}
export interface LessonProgress {
  rounds: number;
  completedAt?: number;
  bestAccuracy: number;
}
export interface Session {
  id: string;
  at: number;
  mode: "lesson" | "practice" | "review";
  lessonId?: string;
  round: number;
  metrics: Metrics;
  passed: boolean;
  comfortable: boolean;
  blind: boolean;
  fingers: boolean;
  targets: string[];
  assisted: boolean;
}
export interface Profile {
  version: 1;
  onboarded: boolean;
  name: string;
  goal: number;
  theme: "light" | "dark" | "system";
  guide: "auto" | "full" | "off";
  sound: boolean;
  lessons: Record<string, LessonProgress>;
  skills: Record<string, Skill>;
  transitions: Record<string, Skill>;
  confusions: Record<string, number>;
  sessions: Session[];
  earned: Record<string, number>;
  createdAt: number;
}
export const freshProfile = (): Profile => ({
  version: 1,
  onboarded: false,
  name: "",
  goal: 10,
  theme: "system",
  guide: "auto",
  sound: false,
  lessons: {},
  skills: {},
  transitions: {},
  confusions: {},
  sessions: [],
  earned: {},
  createdAt: Date.now(),
});
const plain = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
function validSkill(v: unknown): v is Skill {
  return (
    plain(v) &&
    [
      "attempts",
      "errors",
      "recent",
      "latency",
      "samples",
      "sessions",
      "last",
      "due",
      "interval",
    ].every((k) => finite(v[k])) &&
    Number(v.recent) <= 1 &&
    Number(v.errors) <= Number(v.attempts) &&
    Number(v.interval) <= 30
  );
}
export function parseProfile(raw: string): Profile {
  const data: unknown = JSON.parse(raw);
  if (
    !plain(data) ||
    data.version !== 1 ||
    !plain(data.lessons) ||
    !plain(data.skills) ||
    !plain(data.transitions) ||
    !plain(data.confusions) ||
    !Array.isArray(data.sessions)
  )
    throw new Error("Bu dosya geçerli bir Onparmak yedeği değil.");
  if (
    Object.keys(data.skills).length > 300 ||
    Object.keys(data.transitions).length > 10000 ||
    data.sessions.length > 500 ||
    !Object.values(data.skills).every(validSkill) ||
    !Object.values(data.transitions).every(validSkill)
  )
    throw new Error("Beceri kayıtları okunamadı.");
  const metricsKeys = [
    "elapsed",
    "attempts",
    "correct",
    "errors",
    "corrected",
    "uncorrected",
    "accuracy",
    "rawWpm",
    "netWpm",
    "consistency",
    "progress",
    "pauses",
    "wrongShift",
    "earlyWpm",
    "lateWpm",
  ];
  if (
    !Object.values(data.lessons).every(
      (v) =>
        plain(v) &&
        finite(v.rounds) &&
        v.rounds <= 3 &&
        Number.isInteger(v.rounds) &&
        finite(v.bestAccuracy) &&
        (v.completedAt === undefined || finite(v.completedAt)),
    ) ||
    !Object.values(data.confusions).every(finite)
  )
    throw new Error("İlerleme kayıtları okunamadı.");
  if (
    !data.sessions.every(
      (s) =>
        plain(s) &&
        typeof s.id === "string" &&
        finite(s.at) &&
        ["lesson", "review", "practice"].includes(String(s.mode)) &&
        finite(s.round) &&
        typeof s.passed === "boolean" &&
        typeof s.comfortable === "boolean" &&
        typeof s.blind === "boolean" &&
        typeof s.fingers === "boolean" &&
        Array.isArray(s.targets) &&
        s.targets.every((t) => typeof t === "string") &&
        plain(s.metrics) &&
        metricsKeys.every((k) =>
          finite((s.metrics as Record<string, unknown>)[k]),
        ),
    )
  )
    throw new Error("Oturum kayıtları okunamadı.");
  if (
    data.earned !== undefined &&
    (!plain(data.earned) || !Object.values(data.earned).every(finite))
  )
    throw new Error("Kazanım kayıtları okunamadı.");
  return {
    ...freshProfile(),
    ...data,
    name: typeof data.name === "string" ? data.name.slice(0, 30) : "",
    goal: [5, 10, 15, 20].includes(Number(data.goal)) ? Number(data.goal) : 10,
    theme: ["light", "dark", "system"].includes(String(data.theme))
      ? (data.theme as Profile["theme"])
      : "system",
    guide: ["auto", "full", "off"].includes(String(data.guide))
      ? (data.guide as Profile["guide"])
      : "auto",
    sound: data.sound === true,
    onboarded: data.onboarded === true,
  } as Profile;
}
export function loadProfile(): { profile: Profile; error: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { profile: raw ? parseProfile(raw) : freshProfile(), error: "" };
  } catch {
    return {
      profile: freshProfile(),
      error:
        "Yerel kayıt okunamadı. Eski kaydın üzerine yazılmadı. Ayarlardan yedeğini içe aktarabilir veya kaydı sıfırlayabilirsin.",
    };
  }
}
export function saveProfile(profile: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
export function completedCount(profile: Profile) {
  return lessons.filter((l) => profile.lessons[l.id]?.rounds === 3).length;
}
export function nextLesson(profile: Profile) {
  return lessons.find((l) => (profile.lessons[l.id]?.rounds ?? 0) < 3);
}
export function isUnlocked(profile: Profile, lesson: Lesson) {
  return (
    lesson.number === 1 ||
    profile.lessons[lessons[lesson.number - 2].id]?.rounds === 3
  );
}
export function dateKey(at: number) {
  const d = new Date(at);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function todayMinutes(profile: Profile, now = Date.now()) {
  return profile.sessions
    .filter((s) => dateKey(s.at) === dateKey(now))
    .reduce((a, s) => a + s.metrics.elapsed / 60000, 0);
}
export function streak(profile: Profile, now = Date.now()) {
  const days = new Set(
    profile.sessions
      .filter((s) => s.metrics.accuracy >= 90 && s.metrics.elapsed >= 20000)
      .map((s) => dateKey(s.at)),
  );
  const d = new Date(now);
  if (!days.has(dateKey(+d))) d.setDate(d.getDate() - 1);
  let count = 0;
  while (days.has(dateKey(+d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
export function skillScore(s?: Skill) {
  return !s
    ? 0
    : Math.round(
        Math.min(1, s.attempts / 30) *
          Math.min(1, s.sessions / 3) *
          s.recent *
          100,
      );
}
export function weaknesses(profile: Profile, now = Date.now()) {
  const observed = Object.entries(profile.skills).filter(
    ([key, s]) => key !== " " && s.attempts >= 3,
  );
  const latencies = observed
    .filter(([, s]) => s.samples >= 3)
    .map(([, s]) => s.latency)
    .sort((a, b) => a - b);
  const slowThreshold = Math.max(
    450,
    (latencies[Math.floor(latencies.length / 2)] ?? 0) * 1.6,
  );
  return observed
    .filter(
      ([, s]) =>
        s.recent < 0.96 || (s.samples >= 3 && s.latency > slowThreshold),
    )
    .map(([key, s]) => ({
      key,
      skill: s,
      score:
        (1 - s.recent) * 5 +
        Math.min(s.latency / 1500, 1) +
        (s.due < now ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score);
}
export function dueSkills(profile: Profile, now = Date.now()) {
  return Object.entries(profile.skills)
    .filter(([k, s]) => k !== " " && s.attempts >= 8 && s.due <= now)
    .map(([k]) => k);
}
export function reviewTargets(profile: Profile) {
  return [
    ...new Set([
      ...weaknesses(profile)
        .filter((w) => w.skill.recent < 0.96)
        .slice(0, 3)
        .map((w) => w.key),
      ...dueSkills(profile),
      ...weaknesses(profile)
        .slice(0, 3)
        .map((w) => w.key),
      ...Object.entries(profile.skills)
        .filter(([key]) => key !== " ")
        .sort((a, b) => skillScore(a[1]) - skillScore(b[1]))
        .slice(0, 3)
        .map(([key]) => key),
    ]),
  ].slice(0, 6);
}
export function needsReview(profile: Profile) {
  const last = profile.sessions.at(-1);
  if (last?.mode === "review" && last.passed && Date.now() - last.at < DAY)
    return false;
  return (
    dueSkills(profile).length >= 3 ||
    Boolean(last && last.metrics.accuracy < 90 && last.metrics.attempts >= 25)
  );
}
export function speedTarget(profile: Profile) {
  const recent = profile.sessions
    .filter((s) => s.metrics.elapsed >= 20000)
    .slice(-5);
  if (!recent.length || recent.at(-1)!.metrics.accuracy < 97) return 0;
  const reliable = recent.filter((s) => s.metrics.accuracy >= 97);
  return Math.round(
    (reliable.reduce((a, s) => a + s.metrics.netWpm, 0) / reliable.length) *
      1.05,
  );
}
function updateSkill(
  old: Skill | undefined,
  strokes: Stroke[],
  now: number,
): Skill {
  const accuracy = strokes.filter((s) => s.correct).length / strokes.length;
  const latency = strokes
    .filter((s) => s.latency !== null)
    .map((s) => s.latency!);
  const attempts = (old?.attempts ?? 0) + strokes.length;
  const interval =
    strokes.length < 3
      ? (old?.interval ?? 1)
      : accuracy >= 0.97
        ? Math.min(30, (old?.interval ?? 0.5) * 2)
        : 1;
  return {
    attempts,
    errors: (old?.errors ?? 0) + strokes.filter((s) => !s.correct).length,
    recent: old ? old.recent * 0.55 + accuracy * 0.45 : accuracy,
    latency: latency.length
      ? (old?.samples ? old.latency * 0.5 : 0) +
        (latency.reduce((a, b) => a + b, 0) / latency.length) *
          (old?.samples ? 0.5 : 1)
      : (old?.latency ?? 0),
    samples: (old?.samples ?? 0) + latency.length,
    sessions: (old?.sessions ?? 0) + 1,
    last: now,
    due: strokes.length >= 3 ? now + interval * DAY : (old?.due ?? now + DAY),
    interval,
  };
}
export interface Reflection {
  comfortable: boolean;
  blind: boolean;
  fingers: boolean;
}
export function passReasons(
  metrics: Metrics,
  lesson: Lesson | undefined,
  round: number,
  reflection: Reflection,
  assisted: boolean,
): string[] {
  const reasons: string[] = [];
  const required = lesson?.accuracy ?? 95;
  if (metrics.attempts < 20 || metrics.elapsed < 5000)
    reasons.push(
      "Yeterli ölçüm için en az 20 vuruş ve 5 saniye çalışma gerekli.",
    );
  if (metrics.accuracy < required)
    reasons.push(
      `Doğruluğu en az %${required} seviyesine getir. Hızını biraz düşür.`,
    );
  if (metrics.uncorrected > Math.max(1, Math.floor(metrics.attempts * 0.01)))
    reasons.push("Metinde kalan hataları geri silerek düzeltmeyi çalış.");
  if (!reflection.comfortable)
    reasons.push("Önce dinlen; rahat bir duruşla yeniden dene.");
  if (!reflection.fingers)
    reasons.push("Önerilen parmaklarla bir tur daha çalış.");
  if (round === 2 && !reflection.blind)
    reasons.push("Hatırlama turunu fiziksel klavyeye bakmadan yeniden dene.");
  if (lesson && round === 2 && lesson.minWpm && metrics.netWpm < lesson.minWpm)
    reasons.push(
      `Kontrol hedefi ${lesson.minWpm} kelime/dk. Önce rahat akışını güçlendir.`,
    );
  if (lesson && round === 2 && metrics.consistency < lesson.consistency)
    reasons.push(
      `Ritim dengesini en az %${lesson.consistency} seviyesine getir.`,
    );
  if (lesson && lesson.stage >= 6 && metrics.wrongShift > 0)
    reasons.push("Büyük harflerde karşı elin Shift tuşunu kullan.");
  if (
    lesson &&
    round === 2 &&
    lesson.kind === "endurance" &&
    metrics.pauses > 0
  )
    reasons.push("Dinlendikten sonra bu dayanıklılık turunu kesintisiz dene.");
  if (lesson?.number === 60 && metrics.pauses > 0)
    reasons.push("Son değerlendirmeyi dinlenmişken tek akışta tamamla.");
  if (
    lesson?.stage === 11 &&
    round === 2 &&
    metrics.lateWpm < metrics.earlyWpm * 0.7
  )
    reasons.push(
      "Son yarıda tempon belirgin düştü. Dinlenip daha sürdürülebilir bir hızla yeniden dene.",
    );
  if (assisted)
    reasons.push(
      "Bu turda yardım kullanıldı. İlerlemek için fiziksel tuşlarla bağımsız bir tur tamamla.",
    );
  return reasons;
}
export function recordSession(
  profile: Profile,
  session: Session,
  strokes: Stroke[],
): Profile {
  if (profile.sessions.some((s) => s.id === session.id)) return profile;
  const next: Profile = {
    ...profile,
    lessons: { ...profile.lessons },
    skills: { ...profile.skills },
    transitions: { ...profile.transitions },
    confusions: { ...profile.confusions },
    sessions: [...profile.sessions, session].slice(-500),
    earned: { ...profile.earned },
  };
  const groups = new Map<string, Stroke[]>();
  const pairs = new Map<string, Stroke[]>();
  for (const s of strokes) {
    const key = lowerTR(s.expected);
    groups.set(key, [...(groups.get(key) ?? []), s]);
    if (s.previous) {
      const pair = lowerTR(s.previous + s.expected);
      pairs.set(pair, [...(pairs.get(pair) ?? []), s]);
    }
    if (!s.correct) {
      const pair = `${s.expected}→${s.actual}`;
      next.confusions[pair] = (next.confusions[pair] ?? 0) + 1;
    }
  }
  for (const [k, v] of groups)
    next.skills[k] = updateSkill(next.skills[k], v, session.at);
  for (const [k, v] of pairs)
    next.transitions[k] = updateSkill(next.transitions[k], v, session.at);
  if (session.mode === "lesson" && session.lessonId && session.passed) {
    const lesson = lessons.find((l) => l.id === session.lessonId);
    const old = next.lessons[session.lessonId] ?? {
      rounds: 0,
      bestAccuracy: 0,
    };
    if (lesson && isUnlocked(profile, lesson) && session.round === old.rounds) {
      next.lessons[session.lessonId] = {
        rounds: Math.min(3, old.rounds + 1),
        bestAccuracy: Math.max(old.bestAccuracy, session.metrics.accuracy),
        completedAt: old.rounds === 2 ? session.at : undefined,
      };
    }
  }
  for (const achievement of achievements)
    if (!next.earned[achievement.id] && achievement.check(next))
      next.earned[achievement.id] = session.at;
  return next;
}
export const achievements = [
  {
    id: "first",
    title: "İlk iz",
    description: "İlk dersini tamamla.",
    check: (p: Profile) => completedCount(p) >= 1,
  },
  {
    id: "precise",
    title: "İsabetli",
    description: "En az 100 vuruşta %98 doğruluk.",
    check: (p: Profile) =>
      p.sessions.some(
        (s) => s.metrics.attempts >= 100 && s.metrics.accuracy >= 98,
      ),
  },
  {
    id: "rhythm",
    title: "Akışta",
    description: "Bir dakikada %75 ritim, %97 doğruluk.",
    check: (p: Profile) =>
      p.sessions.some(
        (s) =>
          s.metrics.elapsed >= 60000 &&
          s.metrics.consistency >= 75 &&
          s.metrics.accuracy >= 97,
      ),
  },
  {
    id: "week",
    title: "Kök saldı",
    description: "Yedi gün kaliteli pratik yap.",
    check: (p: Profile) => streak(p) >= 7,
  },
  {
    id: "turkish",
    title: "Türkçenin sesi",
    description: "Türkçe karakterler aşamasını bitir.",
    check: (p: Profile) => p.lessons.s5l5?.rounds === 3,
  },
  {
    id: "repair",
    title: "Bir adım daha",
    description: "Bir tekrar turunda %97 doğruluk.",
    check: (p: Profile) =>
      p.sessions.some(
        (s) => s.mode === "review" && s.passed && s.metrics.accuracy >= 97,
      ),
  },
  {
    id: "endurance",
    title: "Uzun soluklu",
    description: "Beş dakikada %97 doğruluğu koru.",
    check: (p: Profile) =>
      p.sessions.some(
        (s) =>
          s.metrics.elapsed >= 300000 &&
          s.metrics.accuracy >= 97 &&
          s.comfortable,
      ),
  },
  {
    id: "graduate",
    title: "On parmak, tam güven",
    description: "60 dersi ve son değerlendirmeyi tamamla.",
    check: (p: Profile) => completedCount(p) === 60,
  },
];
