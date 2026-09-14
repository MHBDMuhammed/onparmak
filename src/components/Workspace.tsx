import { useEffect, useRef, useState } from "react";
import { TypingEngine, type Metrics } from "../domain/engine";
import { practiceChunk, type Training } from "../domain/practice";
import {
  passReasons,
  speedTarget,
  skillScore,
  type Profile,
  type Reflection,
  type Session,
} from "../domain/progress";
import { keyFor, lowerTR } from "../domain/keyboard";
import { KeyboardGuide } from "./KeyboardGuide";
import { Brand, durationLabel, Icon, Modal, number } from "./shared";

interface Props {
  profile: Profile;
  training: Training;
  storageError?: string;
  onExit: () => void;
  onSave: (session: Session, engine: TypingEngine) => void;
  onNext: () => void;
  onRetry: () => void;
}
const roundNames = ["Tanı", "Pekiştir", "Hatırla"];
export function Workspace({
  profile,
  training,
  storageError,
  onExit,
  onSave,
  onNext,
  onRetry,
}: Props) {
  const [engine] = useState(
    () => new TypingEngine(training.text, training.duration),
  );
  const [, render] = useState(0);
  const [caps, setCaps] = useState(false);
  const [layout, setLayout] = useState(false);
  const [help, setHelp] = useState<boolean | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [result, setResult] = useState<Metrics | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLDivElement>(null),
    textView = useRef<HTMLDivElement>(null),
    caret = useRef<HTMLSpanElement>(null);
  const shifts = useRef({ left: false, right: false });
  const audio = useRef<AudioContext | null>(null);
  const now = () => performance.now();
  const refresh = () => render((n) => n + 1);
  const metrics = result ?? engine.metrics(now());
  const finalRound = training.mode === "lesson" && training.round === 2;
  const recentErrors = engine.strokes
    .slice(-10)
    .filter((s) => !s.correct).length;
  const guide =
    help ??
    (!finalRound &&
      profile.guide !== "off" &&
      (profile.guide === "full" ||
        training.round === 0 ||
        skillScore(profile.skills[lowerTR(engine.expected)]) < 45 ||
        recentErrors >= 2 ||
        training.mode === "review"));
  const targetSpeed =
    training.lesson?.kind === "speed" && metrics.accuracy >= 97
      ? speedTarget(profile)
      : 0;
  function sync() {
    if (engine.status === "finished") setResult(engine.metrics(now()));
    refresh();
  }
  function pause() {
    engine.pause(now());
    shifts.current = { left: false, right: false };
    sync();
  }
  function focus() {
    setShowIntro(false);
    engine.resume(now());
    input.current?.focus();
    sync();
  }
  function leave() {
    if (engine.strokes.length && !result) {
      pause();
      setLeaving(true);
    } else onExit();
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (engine.status === "running") {
        if (engine.tick(now())) setResult(engine.metrics(now()));
        render((n) => n + 1);
      }
    }, 150);
    const blur = () => {
      engine.pause(now());
      shifts.current = { left: false, right: false };
      render((n) => n + 1);
    };
    const visibility = () => {
      if (document.hidden) blur();
    };
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInterval(timer);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      void audio.current?.close();
    };
  }, [engine]);
  useEffect(() => {
    if (!result) return;
    input.current?.blur();
  }, [result]);
  useEffect(() => {
    const view = textView.current,
      active = caret.current;
    if (view && active)
      view.scrollTop = Math.max(0, active.offsetTop - view.offsetTop - 52);
  }, [engine.position]);
  useEffect(() => {
    const prevent = (e: BeforeUnloadEvent) => {
      if (engine.strokes.length && engine.status !== "finished") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [engine]);
  function feedback() {
    if (!profile.sound) return;
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume();
      const oscillator = audio.current.createOscillator(),
        gain = audio.current.createGain();
      oscillator.frequency.value = 190;
      gain.gain.setValueAtTime(0.035, audio.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.current.currentTime + 0.05,
      );
      oscillator.connect(gain);
      gain.connect(audio.current.destination);
      oscillator.start();
      oscillator.stop(audio.current.currentTime + 0.05);
    } catch {
      /* Sound is optional; typing continues if the browser denies audio. */
    }
  }
  function keydown(e: React.KeyboardEvent<HTMLDivElement>) {
    setCaps(e.getModifierState("CapsLock"));
    if (e.code === "ShiftLeft") shifts.current.left = true;
    if (e.code === "ShiftRight") shifts.current.right = true;
    if (e.key === "Escape") {
      e.preventDefault();
      pause();
      return;
    }
    if (e.key === "Tab") return;
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if (e.key.toLowerCase() === "v") e.preventDefault();
      return;
    }
    if (e.nativeEvent.isComposing || e.key === "Dead") return;
    if (e.key === "Backspace") {
      e.preventDefault();
      engine.backspace(now());
      sync();
      return;
    }
    if (e.repeat) {
      e.preventDefault();
      return;
    }
    if ([...e.key].length !== 1) return;
    e.preventDefault();
    if (showIntro || result) return;
    const expected = engine.expected;
    const physical = keyFor(e.key);
    if (
      physical &&
      e.code &&
      physical.code !== e.code &&
      !e.code.startsWith("Numpad")
    )
      setLayout(true);
    if (e.code.startsWith("Numpad") && training.mode === "lesson") {
      engine.assisted = true;
      setLayout(true);
    }
    if (engine.duration && engine.text.length - engine.position < 300)
      engine.append(" " + practiceChunk(profile, training));
    engine.input(e.key, now(), shifts.current);
    if (expected !== e.key) feedback();
    sync();
  }
  const visibleStart = Math.max(
    0,
    engine.text.lastIndexOf(" ", Math.max(0, engine.position - 250)) + 1,
  );
  const visibleEnd = Math.min(engine.text.length, engine.position + 850);
  return (
    <div className="workspace">
      <header className="workspace-header">
        <button
          className="brand-button"
          onClick={leave}
          aria-label="Çalışmadan çık"
        >
          <Brand />
        </button>
        <div className="workspace-label">
          {training.mode === "lesson"
            ? `DERS ${String(training.lesson!.number).padStart(2, "0")} / 60`
            : training.mode === "review"
              ? "KİŞİSEL TEKRAR"
              : "SERBEST ANTRENMAN"}
          <span>
            {training.lesson?.title ??
              (training.mode === "review"
                ? "Zayıf noktalar, güçlü adımlar"
                : "Kendi ritminde yaz")}
          </span>
        </div>
        <button
          className="icon-button"
          onClick={leave}
          aria-label="Çalışmayı kapat"
        >
          <Icon name="close" />
        </button>
      </header>
      {storageError && (
        <div className="workspace-storage-error" role="alert">
          {storageError}
        </div>
      )}
      {result ? (
        <Results
          profile={profile}
          training={training}
          engine={engine}
          metrics={result}
          onSave={onSave}
          onNext={onNext}
          onExit={onExit}
          onRetry={onRetry}
        />
      ) : (
        <main className="workspace-main">
          <div className="round-track">
            {training.mode === "lesson" ? (
              roundNames.map((name, i) => (
                <span
                  className={
                    i === training.round
                      ? "current"
                      : i < training.round
                        ? "done"
                        : ""
                  }
                  key={name}
                >
                  <i>
                    {i < training.round ? (
                      <Icon name="check" size={12} />
                    ) : (
                      i + 1
                    )}
                  </i>
                  {name}
                </span>
              ))
            ) : (
              <span className="current">
                <i>
                  <Icon name="focus" size={12} />
                </i>
                {training.mode === "review"
                  ? "Sana özel tekrar"
                  : `${training.duration / 60000} dakika · ${training.difficulty === "personal" ? "Becerine uygun" : training.difficulty === "words" ? "Kelime akışı" : training.difficulty === "text" ? "Doğal metin" : "Günlük belgeler"}`}
              </span>
            )}
          </div>
          <div className="workspace-title">
            <div>
              <p className="eyebrow">
                {finalRound
                  ? "ŞİMDİ HATIRLAMA ZAMANI"
                  : "ACELE ETME. YERİNİ BUL."}
              </p>
              <h1>{training.lesson?.title ?? "Bırak, kelimeler aksın."}</h1>
            </div>
            <div className="workspace-timer">
              <Icon name="clock" size={18} />
              {training.duration
                ? durationLabel(
                    Math.max(0, training.duration - metrics.elapsed),
                  )
                : durationLabel(metrics.elapsed)}
            </div>
          </div>
          <p className="lesson-instruction">
            {training.lesson?.instruction ??
              (training.mode === "review"
                ? `Bu tur ${training.targets.join(", ")} tuşlarını ve zorlandığın geçişleri tekrar karşına getiriyor. Hız yerine rahatlığı ve doğruluğu seç.`
                : "İlk tuşla süre başlar. Kelimeler sen yazdıkça devam eder; hatalarını geri silerek düzeltebilirsin.")}
          </p>
          <div className="typing-card">
            <div className="typing-topline">
              <span>
                <span
                  className={`status-dot ${engine.status === "running" ? "live" : ""}`}
                />
                {engine.status === "running"
                  ? "Kendi ritmindesin"
                  : engine.status === "paused"
                    ? "Kısa bir nefes"
                    : "Hazır olduğunda başla"}
              </span>
              <span>
                Hedef{" "}
                <strong>%{training.lesson?.accuracy ?? 95} doğruluk</strong>
                {targetSpeed > 0 && <> · {targetSpeed} kelime/dk</>}
              </span>
            </div>
            <div
              className="typing-surface"
              tabIndex={0}
              role="textbox"
              aria-label="Yazma alanı. Görünen metni klavyenizle yazın. Escape duraklatır."
              aria-multiline="true"
              aria-describedby="typing-hint"
              ref={input}
              onKeyDown={keydown}
              onKeyUp={(e) => {
                if (e.code === "ShiftLeft") shifts.current.left = false;
                if (e.code === "ShiftRight") shifts.current.right = false;
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                pause();
              }}
              onPaste={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => e.preventDefault()}
              onCompositionEnd={() => {
                engine.assisted = true;
              }}
            >
              <div
                className={`text-viewport ${showIntro || engine.status === "paused" ? "text-muted" : ""}`}
                ref={textView}
                aria-hidden="true"
              >
                <div className="typing-text">
                  {[...engine.text.slice(visibleStart, visibleEnd)].map(
                    (char, i) => {
                      const pos = visibleStart + i;
                      const stroke =
                        engine.typed[pos] !== undefined
                          ? engine.strokes[engine.typed[pos]]
                          : undefined;
                      return (
                        <span
                          key={pos}
                          ref={pos === engine.position ? caret : undefined}
                          className={`${stroke ? (stroke.correct ? "typed-correct" : "typed-wrong") : ""} ${pos === engine.position ? "caret-char" : ""} ${char === " " && stroke && !stroke.correct ? "wrong-space" : ""}`}
                        >
                          {char}
                        </span>
                      );
                    },
                  )}
                </div>
              </div>
              <span className="sr-only">
                Yazılacak metin:{" "}
                {engine.text.slice(engine.position, engine.position + 160)}
              </span>
            </div>
            {(showIntro || engine.status === "paused") && (
              <div className="typing-overlay">
                <span className="overlay-icon">
                  <Icon
                    name={engine.status === "paused" ? "coffee" : "keyboard"}
                    size={26}
                  />
                </span>
                <h3>
                  {engine.status === "paused"
                    ? "Ritmin seni bekliyor."
                    : finalRound
                      ? "Gözlerin metinde."
                      : "Parmaklarını ana sıraya yerleştir."}
                </h3>
                <p>
                  {engine.status === "paused"
                    ? "Süre durdu. Omuzlarını gevşet, hazır olunca devam et."
                    : finalRound
                      ? "Bu turda tuş rehberi kapalı. Bildiklerine güven."
                      : "F ve J çıkıntılarını hisset. Süre ilk vuruşunla başlayacak."}
                </p>
                <button className="button primary" onClick={focus} autoFocus>
                  <Icon name="play" size={16} />
                  {engine.status === "paused" ? "Devam et" : "Yazmaya başla"}
                </button>
              </div>
            )}
            <div className="typing-bottomline" id="typing-hint">
              <span>
                {caps ? (
                  <>
                    <Icon name="alert" size={15} />
                    Caps Lock açık. Büyük harf için karşı Shift kullan.
                  </>
                ) : layout ? (
                  <>
                    <Icon name="alert" size={15} />
                    Türkçe Q düzenini ve üst sayı sırasını kullan.
                  </>
                ) : !engine.duration &&
                  engine.position === engine.text.length ? (
                  <>
                    <Icon name="alert" size={15} />
                    Son karakteri geri silerek düzelt; sonra tur tamamlanacak.
                  </>
                ) : recentErrors >= 2 ? (
                  <>
                    <Icon name="leaf" size={15} />
                    Biraz yavaşla. Yanlışları geri silip sakin bir tempoya dön.
                  </>
                ) : (
                  <>
                    <Icon name="shield" size={15} />
                    Önce doğru dokunuş. Hız kendiliğinden gelecek.
                  </>
                )}
              </span>
              <span>
                <kbd>esc</kbd> duraklat
              </span>
            </div>
            <div
              className="session-progress"
              role="progressbar"
              aria-label="Tur ilerlemesi"
              aria-valuenow={Math.round(metrics.progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${metrics.progress * 100}%` }} />
            </div>
          </div>
          <div className="workspace-metrics">
            <div>
              <strong>
                {metrics.attempts ? number(metrics.accuracy, 1) : "—"}
                <small>%</small>
              </strong>
              <span>doğruluk</span>
            </div>
            <div>
              <strong>
                {metrics.elapsed >= 3000 ? number(metrics.netWpm) : "—"}
                <small>k/dk</small>
              </strong>
              <span>net hız</span>
            </div>
            <div>
              <strong>
                {metrics.attempts >= 9 ? metrics.consistency : "—"}
                <small>%</small>
              </strong>
              <span>ritim dengesi</span>
            </div>
            <button
              className="text-button"
              onClick={() => {
                pause();
                setHelp(!guide);
                if (!guide && finalRound) engine.assisted = true;
              }}
            >
              <Icon name={guide ? "eye" : "hidden"} size={16} />
              {guide ? "Rehberi gizle" : "Rehberi göster"}
            </button>
            {engine.status === "running" && (
              <button
                className="icon-button"
                onClick={pause}
                aria-label="Duraklat"
              >
                <Icon name="pause" size={17} />
              </button>
            )}
          </div>
          {(guide ||
            (!finalRound && help === null && profile.guide !== "off")) && (
            <KeyboardGuide target={engine.expected} visible={guide} />
          )}
          {finalRound && !guide && (
            <div className="recall-reminder">
              <Icon name="sprout" size={28} />
              <p>
                Artık konumları sen hatırlıyorsun.
                <span>
                  Yardıma ihtiyaç duyarsan rehberi açabilirsin. Sonra bağımsız
                  bir tur daha yaparız.
                </span>
              </p>
            </div>
          )}
          {!showIntro && engine.status === "ready" && !focused && (
            <button className="button secondary center-button" onClick={focus}>
              Yazma alanına dön
            </button>
          )}
          <div className="workspace-footer">
            <span>Gözlerin ekranda · Bileklerin rahat · Omuzların serbest</span>
            <span>
              İlerlemen bu cihazda saklanır <Icon name="shield" size={13} />
            </span>
          </div>
        </main>
      )}
      {leaving && (
        <Modal
          title="Bu tura ara mı veriyoruz?"
          onClose={() => setLeaving(false)}
        >
          <p>
            Tamamlanmayan turun ölçümleri kaydedilmez. Önceki ilerlemen korunur.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => {
                setLeaving(false);
                focus();
              }}
            >
              Çalışmaya dön
            </button>
            <button className="button primary" onClick={onExit}>
              Turdan çık
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Results({
  profile,
  training,
  engine,
  metrics,
  onSave,
  onNext,
  onExit,
  onRetry,
}: Omit<Props, "onSave"> & {
  engine: TypingEngine;
  metrics: Metrics;
  onSave: Props["onSave"];
}) {
  const [reflection, setReflection] = useState<Reflection>({
    comfortable: true,
    blind: true,
    fingers: true,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [saved, setSaved] = useState(false);
  const reasons = passReasons(
    metrics,
    training.lesson,
    training.round,
    reflection,
    engine.assisted,
  );
  const passed = reasons.length === 0;
  const errors = Object.entries(
    engine.strokes
      .filter((s) => !s.correct)
      .reduce<Record<string, number>>((a, s) => {
        a[s.expected] = (a[s.expected] ?? 0) + 1;
        return a;
      }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const [previousBest] = useState(() =>
    Math.max(
      0,
      ...profile.sessions
        .filter(
          (s) =>
            s.metrics.accuracy >= 97 &&
            s.metrics.elapsed >= metrics.elapsed * 0.8,
        )
        .map((s) => s.metrics.netWpm),
    ),
  );
  const record =
    metrics.accuracy >= 97 &&
    metrics.elapsed >= 60000 &&
    metrics.netWpm > previousBest;
  function save() {
    const session: Session = {
      id: crypto.randomUUID(),
      at: Date.now(),
      mode: training.mode,
      lessonId: training.lesson?.id,
      round: training.round,
      metrics,
      passed,
      ...reflection,
      targets: training.targets,
      assisted: engine.assisted,
    };
    onSave(session, engine);
    setSaved(true);
  }
  return (
    <main className="results">
      <div className="result-seal">
        <Icon name={passed ? "sprout" : "leaf"} size={34} />
      </div>
      <p className="eyebrow">
        {saved ? "ÇALIŞMAN TAMAMLANDI" : "BİR TUR DAHA, BİR ADIM İLERİ"}
      </p>
      <h1>
        {passed
          ? training.lesson?.number === 60 && training.round === 2
            ? "On parmak. Tam güven."
            : training.round === 2
              ? "Ellerin öğreniyor."
              : "Güzel bir temel attın."
          : "Her deneme bir şey öğretir."}
      </h1>
      <p className="result-subtitle">
        {passed
          ? "Küçük, doğru tekrarlar kalıcı bir beceriye dönüşür."
          : "Bu turda nerede duraksadığını gördük. Bir sonraki çalışmayı buna göre hazırlayacağız."}
      </p>
      <div className="result-stats">
        <div>
          <Icon name="target" />
          <strong>%{number(metrics.accuracy, 1)}</strong>
          <span>Doğruluk</span>
        </div>
        <div>
          <Icon name="wind" />
          <strong>
            {number(metrics.netWpm)}
            <small> k/dk</small>
          </strong>
          <span>Net hız</span>
        </div>
        <div>
          <Icon name="wave" />
          <strong>%{metrics.consistency}</strong>
          <span>Ritim dengesi</span>
        </div>
        <div>
          <Icon name="clock" />
          <strong>{durationLabel(metrics.elapsed)}</strong>
          <span>Aktif çalışma</span>
        </div>
      </div>
      {record && (
        <div className="record-banner">
          <Icon name="trophy" /> Doğruluğunu koruyarak yeni bir kişisel hız
          rekoru kırdın.
        </div>
      )}
      <div className="result-grid">
        <section className="card">
          <p className="eyebrow">VURUŞLARININ HİKAYESİ</p>
          <dl className="result-detail">
            <div>
              <dt>Toplam vuruş</dt>
              <dd>{metrics.attempts}</dd>
            </div>
            <div>
              <dt>İlk anda doğru</dt>
              <dd>{metrics.correct}</dd>
            </div>
            <div>
              <dt>Hatalı vuruş</dt>
              <dd>{metrics.errors}</dd>
            </div>
            <div>
              <dt>Geri silinen hata</dt>
              <dd>{metrics.corrected}</dd>
            </div>
            <div>
              <dt>Metinde kalan hata</dt>
              <dd>{metrics.uncorrected}</dd>
            </div>
            <div>
              <dt>Ham hız</dt>
              <dd>{number(metrics.rawWpm)} k/dk</dd>
            </div>
          </dl>
          <p className="fine-print">
            Geri silmek geçmişteki hatayı silmez. Net hız, metinde kalan doğru
            karakterler / 5 / aktif dakikadır. Ritim, vuruş aralıklarının
            değişkenliğini ölçer.
          </p>
        </section>
        <section className="card reflection">
          <p className="eyebrow">SAYILARIN GÖREMEDİĞİ ŞEYLER</p>
          <h3>Ellerin nasıl hissetti?</h3>
          <p>
            Parmaklarını veya gözlerini izleyemeyiz. Doğru yönlendirme için
            kendi gözlemin önemli.
          </p>
          {(
            [
              {
                key: "comfortable",
                label: "Rahat yazdım, ağrı veya aşırı gerginlik yoktu.",
              },
              { key: "fingers", label: "Önerilen parmakları kullandım." },
              { key: "blind", label: "Fiziksel klavyeye bakmadan yazdım." },
            ] as const
          ).map((item) => (
            <label key={item.key} className="checkbox-line">
              <input
                type="checkbox"
                disabled={saved}
                checked={reflection[item.key]}
                onChange={(e) =>
                  setReflection({ ...reflection, [item.key]: e.target.checked })
                }
              />
              {item.label}
            </label>
          ))}
          {!saved && (
            <label className="checkbox-line confirm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              Yanıtlarımı gözden geçirdim.
            </label>
          )}
        </section>
      </div>
      <section className={`coach-result ${passed ? "positive" : ""}`}>
        <Icon name="sparkles" size={23} />
        <div>
          <h3>
            {passed
              ? training.mode === "lesson"
                ? training.round === 2
                  ? "Bu beceri tamamlandı."
                  : "Bir sonraki tura hazırsın."
                : "Kaliteli bir çalışma tamamladın."
              : "Sıradaki küçük adımın"}
          </h3>
          {reasons.length > 0 ? (
            <ul>
              {reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : (
            <p>
              {errors.length
                ? `${errors.map(([key]) => (key === " " ? "boşluk" : key.toLocaleUpperCase("tr-TR"))).join(", ")} geçişlerini tekrar planına aldık.`
                : "Doğru hareketlerini aralıklı tekrarlarla koruyacağız."}{" "}
              {metrics.lateWpm < metrics.earlyWpm * 0.7 &&
              metrics.elapsed >= 120000
                ? "Son bölümde tempon düştü. Bir sonraki turdan önce kısa bir mola ver."
                : ""}
            </p>
          )}
        </div>
      </section>
      {errors.length > 0 && (
        <div className="error-chips">
          {errors.map(([key, count]) => (
            <span key={key}>
              <kbd>{key === " " ? "␣" : key}</kbd>
              {count} hata
            </span>
          ))}
        </div>
      )}
      <div className="result-actions">
        {!saved ? (
          <button
            className="button primary large"
            disabled={!confirmed}
            onClick={save}
          >
            Çalışmamı kaydet <Icon name="check" size={18} />
          </button>
        ) : (
          <>
            <button className="button secondary" onClick={onExit}>
              Çalışma alanıma dön
            </button>
            <button
              className="button primary"
              onClick={passed ? onNext : onRetry}
            >
              {passed
                ? training.mode === "lesson"
                  ? "Sıradaki adım"
                  : training.mode === "review"
                    ? "Öğrenme yoluna dön"
                    : "Yeniden çalış"
                : "Önerilen tekrarı yap"}
              <Icon name="right" size={18} />
            </button>
          </>
        )}
      </div>
      <p className="fine-print centered">
        {saved
          ? "İlerlemen bu tarayıcıda tutulur. Ayarlardan yedek alabilirsin."
          : "Turun kaydedilmesi için kısa öz değerlendirmeyi tamamla."}
      </p>
    </main>
  );
}
