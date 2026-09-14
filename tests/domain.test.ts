import { test } from "node:test";
import assert from "node:assert/strict";
import { TypingEngine } from "../src/domain/engine";
import {
  keyFor,
  lowerTR,
  upperTR,
  shiftFor,
  LETTERS,
} from "../src/domain/keyboard";
import { lessons, stages } from "../src/content/curriculum";
import { words } from "../src/content/turkish";
import {
  makeTraining,
  textForLesson,
  generateWords,
  practiceChunk,
} from "../src/domain/practice";
import {
  DAY,
  freshProfile,
  recordSession,
  parseProfile,
  passReasons,
  nextLesson,
  isUnlocked,
  dueSkills,
  needsReview,
  speedTarget,
  skillScore,
  weaknesses,
  reviewTargets,
  type Session,
  type Profile,
} from "../src/domain/progress";

const reflection = { comfortable: true, blind: true, fingers: true };
function typeAll(engine: TypingEngine, start = 1000, interval = 300) {
  let time = start;
  for (const char of engine.text) {
    engine.input(char, time, { left: true, right: true });
    time += interval;
  }
  return time - interval;
}
function session(engine: TypingEngine, extra: Partial<Session> = {}): Session {
  return {
    id: crypto.randomUUID(),
    at: Date.now(),
    mode: "practice",
    round: 2,
    metrics: engine.metrics(100000),
    passed: true,
    ...reflection,
    targets: [],
    assisted: false,
    ...extra,
  };
}

test("backspace retains historical mistakes and counts corrected versus retained errors", () => {
  const e = new TypingEngine("abc");
  e.input("x", 1000);
  e.backspace(1500);
  e.input("a", 2000);
  e.input("y", 2500);
  e.input("c", 3000);
  const m = e.metrics(3000);
  assert.equal(e.status, "finished");
  assert.equal(m.attempts, 4);
  assert.equal(m.correct, 2);
  assert.equal(m.errors, 2);
  assert.equal(m.corrected, 1);
  assert.equal(m.uncorrected, 1);
  assert.equal(m.accuracy, 50);
  assert.equal(m.netWpm, 12);
  assert.equal(m.rawWpm, 24);
  assert.equal(m.elapsed, 2000);
  e.backspace(3500);
  assert.equal(e.position, 3);
});
test("deleting correct text cannot inflate net speed or reset accuracy", () => {
  const e = new TypingEngine("ab");
  e.input("a", 1000);
  e.backspace(1100);
  e.input("a", 1500);
  e.input("b", 2000);
  assert.equal(e.metrics(2000).rawWpm, 36);
  assert.equal(e.metrics(2000).netWpm, 24);
  assert.equal(e.metrics(2000).accuracy, 100);
});
test("timer starts on first stroke and pause excludes hidden time, never includes late strokes", () => {
  const e = new TypingEngine("a".repeat(100), 60000);
  assert.equal(e.elapsed(1_000_000), 0);
  e.input("a", 1000);
  e.input("a", 2000);
  e.pause(5000);
  assert.equal(e.elapsed(100000), 4000);
  e.input("b", 100000);
  assert.equal(e.position, 2);
  e.resume(100000);
  e.input("a", 101000);
  assert.equal(e.strokes.at(-1)?.latency, null);
  e.input("a", 156000);
  assert.equal(e.status, "finished");
  assert.equal(e.position, 3);
  assert.equal(e.metrics(999999).elapsed, 60000);
  assert.equal(e.metrics(999999).pauses, 1);
});
test("deadline also applies to backspace, pause and a background timer tick", () => {
  for (const operation of ["backspace", "pause", "tick"] as const) {
    const e = new TypingEngine("abc", 1000);
    e.input("a", 200);
    e[operation](1500);
    assert.equal(e.status, "finished");
    assert.equal(e.position, 1);
    assert.equal(e.metrics(1500).elapsed, 1000);
  }
});
test("rhythm measures interval variability and Turkish NFC remains exact", () => {
  const steady = new TypingEngine("ğüşıöçiİıI abc");
  typeAll(steady);
  assert.equal(steady.metrics(100000).consistency, 100);
  const varied = new TypingEngine("a".repeat(15));
  let at = 0;
  for (let i = 0; i < 15; i++) {
    varied.input("a", at);
    at += i % 2 ? 100 : 1000;
  }
  assert.ok(varied.metrics(at).consistency < 70);
  const e = new TypingEngine("şİ");
  e.input("s\u0327", 1000);
  e.input("I", 2000);
  assert.equal(e.metrics(2000).accuracy, 50);
  assert.equal(e.strokes[0].actual, "ş");
  assert.equal(e.status, "running");
  e.backspace(2100);
  e.input("İ", 2500);
  assert.equal(e.status, "finished");
  assert.equal(e.metrics(2500).corrected, 1);
  assert.equal(upperTR("iı"), "İI");
  assert.equal(lowerTR("İI"), "iı");
  assert.equal(keyFor("İ")?.base, "i");
  assert.equal(keyFor("I")?.base, "ı");
  assert.equal(shiftFor("İ"), "Sol Shift");
  assert.equal(shiftFor("A"), "Sağ Shift");
  assert.equal(keyFor("?")?.code, "Minus");
});
test("incorrect Shift is tracked separately from character correctness", () => {
  const e = new TypingEngine("AİI");
  e.input("A", 1000, { left: true, right: false });
  e.input("İ", 1500, { left: true, right: false });
  e.input("I", 2000, { left: false, right: false });
  assert.equal(e.metrics(2000).accuracy, 100);
  assert.equal(e.metrics(2000).wrongShift, 2);
});
test("every curriculum lesson has actual, reachable, encoding-correct content within learned keys", () => {
  assert.equal(stages.length, 12);
  assert.equal(lessons.length, 60);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 60);
  assert.ok(words.length > 700);
  const p = freshProfile();
  for (const lesson of lessons) {
    for (let round = 0; round < 3; round++) {
      const text = textForLesson(lesson, p, round);
      assert.ok(text.length >= 40, lesson.id + " too short");
      for (const c of text)
        assert.ok(
          lesson.keys.includes(c),
          `${lesson.id} includes untaught ${JSON.stringify(c)}`,
        );
      assert.equal(text, text.normalize("NFC"));
      if (lesson.newKeys)
        for (const c of lesson.newKeys)
          assert.ok(text.includes(c), lesson.id + " missing target " + c);
    }
    assert.ok(isUnlocked(p, lesson), lesson.id + " not reachable");
    p.lessons[lesson.id] = {
      rounds: 3,
      bestAccuracy: 100,
      completedAt: Date.now(),
    };
  }
  for (const char of LETTERS + "İI0123456789.,;:?!'\"()-")
    assert.ok(lessons.at(-1)!.keys.includes(char));
});
test("all sixty lessons unlock only after three valid rounds", () => {
  let p = freshProfile();
  for (const lesson of lessons) {
    assert.equal(nextLesson(p)?.id, lesson.id);
    const next = lessons[lesson.number];
    if (next) assert.equal(isUnlocked(p, next), false);
    for (let round = 0; round < 3; round++) {
      const training = makeTraining(p, { mode: "lesson", lesson });
      assert.equal(training.round, round);
      const e = new TypingEngine(training.text, training.duration);
      if (training.duration) {
        let at = 1000;
        e.input(e.expected, at, { left: true, right: true });
        while (e.status !== "finished") {
          at += 250;
          if (e.text.length - e.position < 100)
            e.append(" " + practiceChunk(p, training));
          e.input(e.expected, at, { left: true, right: true });
        }
      } else typeAll(e, 1000, 250);
      const metrics = e.metrics(9999999),
        reasons = passReasons(metrics, lesson, round, reflection, false);
      assert.deepEqual(reasons, [], lesson.id + " " + round);
      const record = session(e, {
        mode: "lesson",
        lessonId: lesson.id,
        round,
        metrics,
        passed: !reasons.length,
      });
      p = recordSession(p, record, e.strokes);
      assert.equal(p.lessons[lesson.id].rounds, round + 1);
      assert.equal(
        recordSession(p, record, e.strokes),
        p,
        "duplicate session must be idempotent",
      );
    }
  }
  assert.equal(nextLesson(p), undefined);
  assert.equal(Object.keys(p.lessons).length, 60);
});
test("mistakes, assistance, discomfort and looking at keys prevent recall progression", () => {
  const e = new TypingEngine("f j ".repeat(20));
  typeAll(e);
  const m = e.metrics(100000);
  assert.ok(
    passReasons({ ...m, accuracy: 85 }, lessons[0], 2, reflection, false)
      .length,
  );
  assert.ok(
    passReasons(m, lessons[0], 2, { ...reflection, blind: false }, false)
      .length,
  );
  assert.ok(
    passReasons(m, lessons[0], 2, { ...reflection, comfortable: false }, false)
      .length,
  );
  assert.ok(passReasons(m, lessons[0], 2, reflection, true).length);
  const p = freshProfile(),
    failed = session(e, {
      mode: "lesson",
      lessonId: lessons[0].id,
      round: 0,
      passed: false,
    });
  assert.equal(
    recordSession(p, failed, e.strokes).lessons[lessons[0].id],
    undefined,
  );
});
test("adaptation stores mistakes, latency, transitions, confusion, review intervals and regresses", () => {
  let p = freshProfile();
  const now = Date.now();
  for (let i = 0; i < 3; i++) {
    const e = new TypingEngine("f j ".repeat(15));
    typeAll(e);
    p = recordSession(p, session(e, { at: now + i }), e.strokes);
  }
  assert.equal(skillScore(p.skills.f), 100);
  assert.deepEqual(
    weaknesses(p),
    [],
    "accurate, fluent keys are not weaknesses",
  );
  assert.ok(
    reviewTargets(p).includes("f"),
    "fluent keys remain available for retrieval",
  );
  assert.ok(p.skills.f.interval >= 4);
  assert.ok(p.transitions["f "]);
  assert.ok(dueSkills(p, now + 10 * DAY).includes("f"));
  const e = new TypingEngine("f j ".repeat(15));
  let at = 1000;
  for (const c of e.text) {
    e.input(c === "f" ? "j" : c, at);
    at += 500;
  }
  p = recordSession(p, session(e, { passed: false }), e.strokes);
  assert.ok(p.skills.f.recent < 0.6);
  assert.equal(p.skills.f.interval, 1);
  assert.equal(p.confusions["f→j"], 15);
  assert.equal(needsReview(p), true);
  assert.equal(speedTarget(p), 0);
});
test("free practice offers exact one to five minute timers and refill never depends on network", () => {
  const p = freshProfile();
  for (const minutes of [1, 2, 3, 4, 5])
    for (const difficulty of ["personal", "words", "text", "mixed"] as const) {
      const t = makeTraining(p, { mode: "practice", minutes, difficulty });
      assert.equal(t.duration, minutes * 60000);
      assert.ok(t.text.length > 200);
      assert.ok(practiceChunk(p, t).length > 200);
    }
  const text = generateWords(" fjdk slaş", [], 100);
  assert.ok([...text].every((c) => " fjdk slaş".includes(c)));
  assert.ok(new Set(generateWords(undefined, [], 300).split(" ")).size > 250);
});
test("persistent profile roundtrips and rejects malformed or incompatible data", () => {
  let p = freshProfile();
  const e = new TypingEngine("f j ".repeat(20));
  typeAll(e);
  p = recordSession(p, session(e), e.strokes);
  p.name = "İpek";
  assert.deepEqual(parseProfile(JSON.stringify(p)), p);
  for (const invalid of [
    "{",
    "{}",
    JSON.stringify({ ...p, version: 2 }),
    JSON.stringify({ ...p, skills: { f: {} } }),
    JSON.stringify({
      ...p,
      lessons: { s1l1: { rounds: 99, bestAccuracy: 100 } },
    }),
    JSON.stringify({ ...p, sessions: [{ metrics: {} }] }),
  ])
    assert.throws(() => parseProfile(invalid));
});

test("graduation requires sustained typing and earned achievements survive history rollover", () => {
  const e = new TypingEngine("f j ".repeat(40));
  typeAll(e);
  const m = {
    ...e.metrics(100000),
    accuracy: 100,
    netWpm: 40,
    consistency: 100,
    elapsed: 300000,
    earlyWpm: 80,
    lateWpm: 0,
    wrongShift: 0,
  };
  assert.ok(
    passReasons(m, lessons[59], 2, reflection, false).some((reason) =>
      reason.includes("Son yarıda"),
    ),
  );
  let p = freshProfile();
  const now = Date.now();
  for (let days = 6; days >= 0; days--)
    p = recordSession(p, session(e, { at: now - days * DAY }), e.strokes);
  assert.ok(p.earned.week);
  const earned = p.earned.week;
  p = recordSession(
    { ...p, sessions: [] },
    session(e, { at: now + 10 * DAY }),
    e.strokes,
  );
  assert.equal(p.earned.week, earned);
});
