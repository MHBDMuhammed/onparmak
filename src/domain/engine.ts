import { normalizeText, shiftFor } from "./keyboard";

export type Status = "ready" | "running" | "paused" | "finished";
export interface Stroke {
  expected: string;
  actual: string;
  correct: boolean;
  position: number;
  time: number;
  latency: number | null;
  previous: string;
  removed: boolean;
  wrongShift: boolean;
}
export interface Metrics {
  elapsed: number;
  attempts: number;
  correct: number;
  errors: number;
  corrected: number;
  uncorrected: number;
  accuracy: number;
  rawWpm: number;
  netWpm: number;
  consistency: number;
  progress: number;
  pauses: number;
  wrongShift: number;
  earlyWpm: number;
  lateWpm: number;
}
export class TypingEngine {
  text: string;
  readonly duration: number;
  status: Status = "ready";
  strokes: Stroke[] = [];
  typed: number[] = [];
  pauses = 0;
  assisted = false;
  private accumulated = 0;
  private startedAt = 0;
  private lastStrokeAt: number | null = null;
  constructor(text: string, duration = 0) {
    this.text = normalizeText(text);
    this.duration = duration;
  }
  get position() {
    return this.typed.length;
  }
  get expected() {
    return this.text[this.position] ?? "";
  }
  elapsed(now: number) {
    return Math.min(
      this.duration || Infinity,
      this.accumulated +
        (this.status === "running" ? Math.max(0, now - this.startedAt) : 0),
    );
  }
  append(text: string) {
    this.text += normalizeText(text);
  }
  input(
    char: string,
    now: number,
    shifts: { left: boolean; right: boolean } = { left: false, right: false },
  ) {
    if (this.status === "paused" || this.status === "finished") return;
    if (
      this.status === "running" &&
      this.duration &&
      this.elapsed(now) >= this.duration
    ) {
      this.finish(now);
      return;
    }
    char = normalizeText(char);
    if ([...char].length !== 1 || !this.expected) return;
    if (this.status === "ready") {
      this.status = "running";
      this.startedAt = now;
    }
    const requiredShift = shiftFor(this.expected);
    const wrongShift = Boolean(
      requiredShift &&
      !(requiredShift === "Sol Shift" ? shifts.left : shifts.right),
    );
    const elapsed = this.elapsed(now);
    this.strokes.push({
      expected: this.expected,
      actual: char,
      correct: char === this.expected,
      position: this.position,
      time: elapsed,
      latency:
        this.lastStrokeAt === null
          ? null
          : Math.max(0, now - this.lastStrokeAt),
      previous: this.position > 0 ? this.text[this.position - 1] : "",
      removed: false,
      wrongShift,
    });
    this.typed.push(this.strokes.length - 1);
    this.lastStrokeAt = now;
    if (
      !this.duration &&
      this.position === this.text.length &&
      char === this.text[this.position - 1]
    )
      this.finish(now);
  }
  backspace(now: number) {
    if (this.status !== "running") return;
    if (this.duration && this.elapsed(now) >= this.duration) {
      this.finish(now);
      return;
    }
    const index = this.typed.pop();
    if (index !== undefined) this.strokes[index].removed = true;
    // Time spent correcting stays in the next transition latency and in elapsed time.
  }
  pause(now: number) {
    if (this.status !== "running") return;
    if (this.duration && this.elapsed(now) >= this.duration) {
      this.finish(now);
      return;
    }
    this.accumulated = this.elapsed(now);
    this.status = "paused";
    this.pauses++;
    this.lastStrokeAt = null;
  }
  resume(now: number) {
    if (this.status === "paused") {
      this.status = "running";
      this.startedAt = now;
      this.lastStrokeAt = null;
    }
  }
  tick(now: number) {
    if (
      this.status === "running" &&
      this.duration &&
      this.elapsed(now) >= this.duration
    )
      this.finish(now);
  }
  finish(now: number) {
    if (this.status === "finished") return;
    this.accumulated = this.elapsed(now);
    this.status = "finished";
  }
  metrics(now: number): Metrics {
    const elapsed = this.elapsed(now);
    const attempts = this.strokes.length;
    const correct = this.strokes.filter((s) => s.correct).length;
    const corrected = this.strokes.filter(
      (s) => !s.correct && s.removed,
    ).length;
    const uncorrected = this.typed.filter(
      (i) => !this.strokes[i].correct,
    ).length;
    const retained = this.typed.length - uncorrected;
    const intervals = this.strokes
      .filter((s) => s.correct && !s.removed && s.latency !== null)
      .map((s) => s.latency!);
    const mean = intervals.reduce((a, b) => a + b, 0) / (intervals.length || 1);
    const variance =
      intervals.reduce((a, b) => a + (b - mean) ** 2, 0) /
      (intervals.length || 1);
    const consistency =
      intervals.length < 8 || !mean
        ? 0
        : Math.round(100 / (1 + Math.sqrt(variance) / mean));
    const minutes = elapsed / 60000;
    const half = elapsed / 2;
    const kept = this.typed
      .map((i) => this.strokes[i])
      .filter((s) => s.correct);
    return {
      elapsed,
      attempts,
      correct,
      errors: attempts - correct,
      corrected,
      uncorrected,
      accuracy: attempts ? (correct / attempts) * 100 : 100,
      rawWpm: minutes > 0 ? attempts / 5 / minutes : 0,
      netWpm: minutes > 0 ? retained / 5 / minutes : 0,
      consistency,
      progress: this.duration
        ? elapsed / this.duration
        : this.position / this.text.length,
      pauses: this.pauses,
      wrongShift: this.strokes.filter((s) => s.wrongShift).length,
      earlyWpm:
        half > 0
          ? kept.filter((s) => s.time < half).length / 5 / (half / 60000)
          : 0,
      lateWpm:
        half > 0
          ? kept.filter((s) => s.time >= half).length / 5 / (half / 60000)
          : 0,
    };
  }
}
