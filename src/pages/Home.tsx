import { stages, type Lesson } from "../content/curriculum";
import { practiceTips } from "../content/turkish";
import {
  completedCount,
  dateKey,
  dueSkills,
  isUnlocked,
  needsReview,
  nextLesson,
  reviewTargets,
  todayMinutes,
  weaknesses,
  type Profile,
} from "../domain/progress";
import { upperTR } from "../domain/keyboard";
import { Icon, number, ProgressRing, type Page } from "../components/shared";

export function Home({
  profile,
  onLesson,
  onNavigate,
  onReview,
}: {
  profile: Profile;
  onLesson: (l: Lesson) => void;
  onNavigate: (p: Page) => void;
  onReview: () => void;
}) {
  const lesson = nextLesson(profile),
    completed = completedCount(profile),
    daily = todayMinutes(profile),
    reviews = dueSkills(profile),
    weak = weaknesses(profile);
  const last = profile.sessions.at(-1),
    returning = last && Date.now() - last.at > 3 * 86_400_000;
  const stage = stages[lesson?.stage ?? 11];
  const recent = profile.sessions.slice(-7),
    accuracy = recent.length
      ? (recent.reduce((s, x) => s + x.metrics.correct, 0) /
          recent.reduce((s, x) => s + x.metrics.attempts, 0)) *
        100
      : 0;
  const reliable = recent.filter((s) => s.metrics.accuracy >= 95),
    speed = reliable.length
      ? reliable.reduce((s, x) => s + x.metrics.netWpm, 0) / reliable.length
      : 0;
  return (
    <>
      <div className="page-heading home-heading">
        <div>
          <p className="eyebrow">
            <span className="little-line" />
            HER GÜN, BİRAZ DAHA AKICI
          </p>
          <h1>
            {returning
              ? "Yeniden merhaba"
              : profile.name
                ? `Merhaba, ${profile.name}`
                : "Kendi ritmini bul"}
            <span className="serif-dot">.</span>
          </h1>
          <p>
            {returning
              ? "Kaldığın yer burada. Önce kısa bir tekrarla ellerini yeniden alıştır."
              : "Düşüncelerin aksın, parmakların yetişsin. Bugün küçük bir adım daha."}
          </p>
        </div>
        <div className="date-label">
          <Icon name="sun" size={18} />
          {new Date().toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            weekday: "long",
          })}
        </div>
      </div>
      <div className="home-top-grid">
        <section className="hero-card">
          <div className="hero-content">
            <div className="hero-top">
              <span className="hero-tag">
                <span />
                {completed === 60
                  ? "YOLCULUĞUN DEVAM EDİYOR"
                  : last
                    ? "KALDIĞIN YERDEN DEVAM ET"
                    : "İYİ BİR BAŞLANGIÇ YAP"}
              </span>
              <span className="hero-chapter">
                {String((lesson?.stage ?? 11) + 1).padStart(2, "0")} / 12
              </span>
            </div>
            <h2>
              {completed === 60 ? (
                <>
                  On parmak.
                  <br />
                  Tam güven.
                </>
              ) : (
                <>
                  {stage.title.split(" ").slice(0, -1).join(" ")}
                  <br />
                  <em>{stage.title.split(" ").at(-1)}.</em>
                </>
              )}
            </h2>
            <p>
              {completed === 60
                ? "Bütün yolu tamamladın. Şimdi bu beceriyi günlük hayatına taşı; kişisel tekrarlarla canlı tut."
                : stage.description}
            </p>
            <div className="hero-action">
              <button
                className="button lime"
                onClick={() =>
                  needsReview(profile)
                    ? onReview()
                    : lesson
                      ? onLesson(lesson)
                      : onNavigate("practice")
                }
              >
                {needsReview(profile)
                  ? "Kısa tekrarla başla"
                  : completed === 60
                    ? "Akışa devam et"
                    : last
                      ? "Derse devam et"
                      : "İlk dersime başla"}
                <Icon name="right" size={18} />
              </button>
              <span>
                <Icon name="clock" size={14} />
                {needsReview(profile)
                  ? "2"
                  : lesson?.stage && lesson.stage >= 9
                    ? Math.ceil((lesson.seconds * 3) / 60)
                    : "3–5"}{" "}
                dk<span className="hero-action-dot">·</span>
                {lesson
                  ? `${(profile.lessons[lesson.id]?.rounds ?? 0) + 1}. tur`
                  : "Sana özel"}
              </span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <span className="art-cross cross-one">+</span>
            <span className="art-cross cross-two">+</span>
            <div className="floating-key key-f">
              F<span />
            </div>
            <div className="floating-key key-j">
              J<span />
            </div>
            <div className="art-dots">••••</div>
            <div className="art-caption">BAŞLANGIÇ NOKTAN</div>
          </div>
        </section>
        <section className="daily-card">
          <div className="card-heading">
            <h3>Bugünün niyeti</h3>
            <Icon name="sun" size={19} />
          </div>
          <div className="daily-center">
            <ProgressRing value={(daily / profile.goal) * 100} size={118}>
              <strong>
                {number(daily, 1)}
                <span> / {profile.goal}</span>
              </strong>
              <small>dakika</small>
            </ProgressRing>
          </div>
          <h4>
            {daily >= profile.goal
              ? "Bugün kendine iyi bir yatırım yaptın."
              : "Küçük bir zaman, kalıcı bir beceri."}
          </h4>
          <p>
            {daily >= profile.goal
              ? "Ellerini dinlendir. Yarın buradan devam ederiz."
              : "Dikkatli bir çalışma için kendine alan aç."}
          </p>
          <div className="week-strip" aria-label="Bu haftaki çalışma günleri">
            {weekDays().map((d) => {
              const done = profile.sessions.some(
                (s) =>
                  dateKey(s.at) === dateKey(+d) && s.metrics.accuracy >= 90,
              );
              return (
                <div
                  key={+d}
                  className={dateKey(+d) === dateKey(Date.now()) ? "today" : ""}
                >
                  <span>
                    {d
                      .toLocaleDateString("tr-TR", { weekday: "short" })
                      .slice(0, 1)}
                  </span>
                  <i className={done ? "complete" : ""}>
                    {done ? <Icon name="check" size={12} /> : <span />}
                  </i>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <div className="quick-stats">
        <div>
          <span className="stat-icon green">
            <Icon name="map" />
          </span>
          <div>
            <span>Öğrenme yolculuğun</span>
            <strong>
              {completed}
              <small> / 60 ders</small>
            </strong>
          </div>
          <div className="mini-progress">
            <span style={{ width: `${(completed / 60) * 100}%` }} />
          </div>
        </div>
        <div>
          <span className="stat-icon sand">
            <Icon name="target" />
          </span>
          <div>
            <span>Son çalışmalarında</span>
            <strong>
              {recent.length ? `%${number(accuracy, 1)}` : "—"}
              <small> doğruluk</small>
            </strong>
          </div>
        </div>
        <div>
          <span className="stat-icon lilac">
            <Icon name="wind" />
          </span>
          <div>
            <span>Doğru yazarken</span>
            <strong>
              {speed ? number(speed) : "—"}
              <small> kelime / dk</small>
            </strong>
          </div>
          <span className="stat-note">Senin tempon</span>
        </div>
      </div>
      <div className="section-title">
        <div>
          <h2>Yolun belli. Adımın sana ait.</h2>
          <p>Temelden akıcılığa, her beceri bir öncekinin üzerine kurulur.</p>
        </div>
        <button className="text-button" onClick={() => onNavigate("course")}>
          Tüm öğrenme yolu <Icon name="right" size={16} />
        </button>
      </div>
      <div className="stage-preview-grid">
        {stages
          .slice(Math.min(stage.id, 9), Math.min(stage.id, 9) + 3)
          .map((s, i) => {
            const count = s.lessons.filter(
              (l) => profile.lessons[l.id]?.rounds === 3,
            ).length;
            const active = s.id === stage.id;
            const locked = !isUnlocked(profile, s.lessons[0]);
            return (
              <button
                className={`stage-preview ${active ? "current-stage" : ""}`}
                key={s.id}
                onClick={() =>
                  locked
                    ? onNavigate("course")
                    : onLesson(
                        s.lessons.find(
                          (l) => (profile.lessons[l.id]?.rounds ?? 0) < 3,
                        ) ?? s.lessons[0],
                      )
                }
              >
                <div className="stage-preview-top">
                  <span className={`stage-icon stage-color-${i}`}>
                    <Icon name={s.icon} size={24} />
                  </span>
                  <span className={`stage-state ${active ? "active" : ""}`}>
                    {active ? (
                      "ŞİMDİ BURADASIN"
                    ) : count === 5 ? (
                      "TAMAMLANDI"
                    ) : locked ? (
                      <>
                        <Icon name="lock" size={12} />
                        SIRADA
                      </>
                    ) : (
                      "KEŞFET"
                    )}
                  </span>
                </div>
                <span className="stage-number">
                  AŞAMA {String(s.id + 1).padStart(2, "0")}
                </span>
                <h3>{s.subtitle}</h3>
                <p>{s.id === 0 ? "Parmaklarının evini bul." : s.title + "."}</p>
                <div className="stage-preview-bottom">
                  <span>{count} / 5 ders</span>
                  <div className="lesson-segments">
                    {s.lessons.map((l) => (
                      <i
                        className={
                          profile.lessons[l.id]?.rounds === 3
                            ? "filled"
                            : l.id === lesson?.id
                              ? "selected"
                              : ""
                        }
                        key={l.id}
                      />
                    ))}
                  </div>
                  <Icon name={locked ? "lock" : "right"} size={16} />
                </div>
              </button>
            );
          })}
      </div>
      <div className="home-bottom-grid">
        <section className="coach-card">
          <div className="coach-header">
            <span className="coach-avatar">
              <Icon name="sparkles" size={22} />
            </span>
            <div>
              <p className="eyebrow">KİŞİSEL ANTRENÖRÜN</p>
              <h3>
                {reviews.length
                  ? "Tanıdık tuşları hatırlama zamanı."
                  : weak.length
                    ? "Bir sonraki adımını birlikte bulalım."
                    : last
                      ? "Doğru hareketlerin yerleşiyor."
                      : "Seni tanıdıkça, sana uyum sağlar."}
              </h3>
            </div>
            <span className="small-badge">SANA ÖZEL</span>
          </div>
          <p>
            {reviews.length
              ? `${reviews.length} tuşun tekrar zamanı geldi. İki dakikalık hatırlama, dün kurduğun hareketleri canlı tutar.`
              : weak.length
                ? `${weak
                    .slice(0, 3)
                    .map((w) => upperTR(w.key))
                    .join(
                      ", ",
                    )} tuşlarına biraz daha dikkat ayıracağız. Derslerin bu hareketleri yeniden karşına çıkaracak.`
                : last
                  ? "Belirgin bir hata örüntüsü görünmüyor. Sonraki turlarda tanıdık tuşları farklı kelimelerde kullanarak bu temeli güçlendireceğiz."
                  : "Doğruluğunu, duraksadığın tuşları ve zor geçişlerini öğrenir. Sonraki çalışmanı ihtiyaç duyduğun yere yönlendirir."}
          </p>
          <div className="coach-bottom">
            {weak.length ? (
              <div className="key-chips">
                {reviewTargets(profile)
                  .slice(0, 4)
                  .map((k) => (
                    <kbd key={k}>{upperTR(k)}</kbd>
                  ))}
              </div>
            ) : (
              <span>
                <Icon name="shield" size={15} />
                Verilerin yalnızca bu cihazda.
              </span>
            )}
            <button
              className="text-button"
              onClick={last ? onReview : () => onNavigate("guide")}
            >
              {last ? "Kişisel tekrar yap" : "Nasıl öğreniyoruz?"}
              <Icon name="right" size={16} />
            </button>
          </div>
        </section>
        <button className="free-card" onClick={() => onNavigate("practice")}>
          <div className="free-icon">
            <Icon name="keyboard" size={25} />
            <span>↗</span>
          </div>
          <h3>Biraz da serbest akış.</h3>
          <p>
            1–5 dakika. Gerçek Türkçe.
            <br />
            Tamamen senin tempon.
          </p>
          <span>
            Serbest antrenman <Icon name="right" size={17} />
          </span>
        </button>
      </div>
      <div className="quiet-tip">
        <Icon name="leaf" size={17} />
        <p>{practiceTips[completed % practiceTips.length]}</p>
      </div>
    </>
  );
}

function weekDays() {
  const today = new Date(),
    monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}
