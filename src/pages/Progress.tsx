import { useState } from "react";
import { lessons } from "../content/curriculum";
import {
  achievements,
  dateKey,
  dueSkills,
  skillScore,
  weaknesses,
  type Profile,
} from "../domain/progress";
import { fingerNames, keyFor, upperTR } from "../domain/keyboard";
import { KeyboardGuide } from "../components/KeyboardGuide";
import {
  durationLabel,
  Icon,
  number,
  PageHeading,
  MetricCard,
} from "../components/shared";

export function Progress({
  profile,
  onStart,
  onReview,
}: {
  profile: Profile;
  onStart: () => void;
  onReview: () => void;
}) {
  const [range, setRange] = useState(7),
    [tab, setTab] = useState<"keys" | "fingers" | "pairs">("keys");
  const sessions = profile.sessions.filter(
      (s) => s.at >= Date.now() - range * 86_400_000,
    ),
    all = profile.sessions;
  const attempts = sessions.reduce((n, s) => n + s.metrics.attempts, 0),
    correct = sessions.reduce((n, s) => n + s.metrics.correct, 0);
  const bestSpeed = Math.max(
    0,
    ...sessions
      .filter((s) => s.metrics.accuracy >= 97 && s.metrics.elapsed >= 60000)
      .map((s) => s.metrics.netWpm),
  );
  const weak = weaknesses(profile),
    due = dueSkills(profile),
    heat = Object.fromEntries(
      Object.entries(profile.skills).map(([k, s]) => [k, skillScore(s)]),
    );
  const chartDays = Array.from({ length: range }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - range + 1 + i);
    const daily = sessions.filter((s) => dateKey(s.at) === dateKey(+d));
    return {
      date: d,
      minutes: daily.reduce((a, s) => a + s.metrics.elapsed / 60000, 0),
    };
  });
  const maximum = Math.max(profile.goal, ...chartDays.map((d) => d.minutes));
  const fingerStats = Object.entries(fingerNames).map(([id, label]) => {
    const stats = Object.entries(profile.skills)
      .filter(([k]) => keyFor(k)?.finger === id)
      .map(([, s]) => s);
    const count = stats.reduce((a, s) => a + s.attempts, 0),
      errors = stats.reduce((a, s) => a + s.errors, 0);
    return {
      id,
      label,
      count,
      accuracy: count ? ((count - errors) / count) * 100 : 0,
    };
  });
  const pairs = Object.entries(profile.transitions)
    .filter(([k, s]) => !k.includes(" ") && s.attempts >= 3)
    .sort((a, b) => a[1].recent - b[1].recent)
    .slice(0, 8);
  return (
    <>
      <PageHeading
        eyebrow="SAYILARDAN FAZLASI"
        title="Gelişiminin izini gör."
        description="Doğruluk, rahat bir ritim ve hatırlanan hareketler. Asıl ilerleme burada."
        action={
          <div className="segmented">
            {[7, 30].map((n) => (
              <button
                key={n}
                className={range === n ? "active" : ""}
                onClick={() => setRange(n)}
              >
                Son {n} gün
              </button>
            ))}
          </div>
        }
      />
      {!all.length && (
        <div className="empty-progress">
          <span className="empty-illustration">
            <Icon name="sprout" size={37} />
          </span>
          <div>
            <p className="empty-progress-title">
              İlk izini bırakmaya hazır mısın?
            </p>
            <p>
              İlk çalışmandan sonra hangi tuşların güçlendiğini ve ritminin
              nasıl değiştiğini burada göreceksin.
            </p>
          </div>
          <button className="button primary" onClick={onStart}>
            İlk dersime başla <Icon name="right" size={17} />
          </button>
        </div>
      )}
      <div className="progress-stats">
        <MetricCard
          icon="clock"
          label="Dikkatli çalışma"
          value={number(
            sessions.reduce((a, s) => a + s.metrics.elapsed, 0) / 60000,
            1,
          )}
          suffix="dk"
        />
        <MetricCard
          icon="target"
          label="Vuruş doğruluğu"
          value={attempts ? `%${number((correct / attempts) * 100, 1)}` : "—"}
        />
        <MetricCard
          icon="wind"
          label="En iyi hız · ≥1 dk, %97 doğruluk"
          value={bestSpeed ? number(bestSpeed) : "—"}
          suffix="k/dk"
        />
        <MetricCard
          icon="sprout"
          label="Yerleşen tuş"
          value={String(
            Object.values(profile.skills).filter((s) => skillScore(s) >= 90)
              .length,
          )}
          suffix="tuş"
        />
      </div>
      <div className="progress-mid-grid">
        <section className="card activity-card">
          <div className="card-heading">
            <p className="card-title">Pratiğin ritmi</p>
            <span className="muted">dakika / gün</span>
          </div>
          <div
            className="activity-chart"
            role="img"
            aria-label={`Son ${range} günde toplam ${number(sessions.reduce((a, s) => a + s.metrics.elapsed, 0) / 60000, 1)} dakika çalışma`}
          >
            <div
              className="goal-line"
              style={{ bottom: `${(profile.goal / maximum) * 100}%` }}
            >
              <span>{profile.goal} dk hedef</span>
            </div>
            {chartDays.map((day) => (
              <div className="activity-column" key={+day.date}>
                <div
                  className={`activity-bar ${dateKey(+day.date) === dateKey(Date.now()) ? "current" : ""}`}
                  style={{
                    height: `${Math.max(1, (day.minutes / maximum) * 100)}%`,
                  }}
                  title={`${day.date.toLocaleDateString("tr-TR")}: ${number(day.minutes, 1)} dakika`}
                />
                <span>
                  {range === 7
                    ? day.date.toLocaleDateString("tr-TR", { weekday: "short" })
                    : day.date.getDate() % 5 === 0
                      ? day.date.getDate()
                      : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="card insight-card">
          <span className="coach-avatar">
            <Icon name="sparkles" />
          </span>
          <p className="eyebrow">SIRADAKİ EN İYİ ADIM</p>
          <p className="insight-title">
            {due.length
              ? "Hatırlamaya zaman ayır."
              : weak.length
                ? "Küçük bir noktayı güçlendir."
                : all.length
                  ? "Doğruluğun sağlam. Şimdi pekiştir."
                  : "Önce bir başlangıç noktası."}
          </p>
          <p>
            {due.length
              ? `${due.length} tuş aralıklı tekrar bekliyor.`
              : weak.length
                ? `${weak
                    .slice(0, 3)
                    .map((w) => upperTR(w.key))
                    .join(", ")} tuşlarında biraz daha yavaş ve dikkatli çalış.`
                : all.length
                  ? "Belirgin bir hata örüntüsü yok. Bildiğin hareketleri farklı kelimelerde tekrar kullan."
                  : "İlk dersinle ellerinin hareketlerini tanımaya başlayacağız."}
          </p>
          <button
            className="text-button"
            onClick={all.length ? onReview : onStart}
          >
            {all.length ? "Kişisel tekrar yap" : "İlk derse git"}
            <Icon name="right" size={16} />
          </button>
        </section>
      </div>
      <section className="card skill-map">
        <div className="card-heading">
          <div>
            <p className="card-title">Ellerinin öğrenme haritası</p>
            <p>
              En az 30 vuruş, üç ayrı tur ve yakın dönem doğruluğu birlikte
              değerlendirilir.
            </p>
          </div>
          <div className="segmented">
            {(
              [
                { id: "keys", label: "Tuşlar" },
                { id: "fingers", label: "Parmaklar" },
                { id: "pairs", label: "Geçişler" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "active" : ""}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {tab === "keys" ? (
          <>
            <KeyboardGuide visible={false} heat={heat} compact />
            <div className="heat-legend">
              <span>Henüz çalışılmadı</span>
              <i />
              <i />
              <i />
              <i />
              <span>Yerleşiyor</span>
            </div>
          </>
        ) : tab === "fingers" ? (
          <>
            <div className="finger-stats">
              {fingerStats.map((f) => (
                <div key={f.id}>
                  <span>{f.label}</span>
                  <div className="thin-progress">
                    <span style={{ width: `${f.accuracy}%` }} />
                  </div>
                  <strong>{f.count ? `%${number(f.accuracy, 1)}` : "—"}</strong>
                  <small>{f.count} vuruş</small>
                </div>
              ))}
            </div>
            <p className="fine-print">
              Parmak verisi tuşların önerilen parmak eşleşmesinden çıkarılır.
              Fiziksel olarak hangi parmağını kullandığın ölçülmez.
            </p>
          </>
        ) : (
          <div className="pair-grid">
            {pairs.length ? (
              pairs.map(([pair, s]) => (
                <div key={pair}>
                  <kbd>{pair}</kbd>
                  <span>%{number(s.recent * 100)} doğruluk</span>
                  <small>
                    {number(s.latency)} ms · {s.attempts} vuruş
                  </small>
                </div>
              ))
            ) : (
              <p className="empty-inline">
                Biraz pratikten sonra zorlandığın geçişler burada görünecek.
              </p>
            )}
          </div>
        )}
      </section>
      <div className="section-title">
        <div>
          <h2>Sayı değil, kazanım.</h2>
          <p>Gerçek öğrenmenin küçük kilometre taşları.</p>
        </div>
      </div>
      <div className="achievement-grid">
        {achievements.map((a) => {
          const earned = Boolean(profile.earned[a.id]) || a.check(profile);
          return (
            <div className={`achievement ${earned ? "earned" : ""}`} key={a.id}>
              <span>
                <Icon name={earned ? "trophy" : "lock"} size={23} />
              </span>
              <p className="achievement-title">{a.title}</p>
              <p>{a.description}</p>
              {earned && (
                <small>
                  <Icon name="check" size={12} />
                  Kazanıldı
                </small>
              )}
            </div>
          );
        })}
      </div>
      {all.length > 0 && (
        <section className="card session-history">
          <div className="card-heading">
            <p className="card-title">Son çalışmaların</p>
            <span className="muted">Son 10 oturum</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Çalışma</th>
                  <th>Tarih</th>
                  <th>Süre</th>
                  <th>Doğruluk</th>
                  <th>Net hız</th>
                  <th>Ritim</th>
                </tr>
              </thead>
              <tbody>
                {all
                  .slice(-10)
                  .reverse()
                  .map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong>
                          {s.mode === "lesson"
                            ? (lessons.find((l) => l.id === s.lessonId)
                                ?.title ?? "Ders")
                            : s.mode === "review"
                              ? "Kişisel tekrar"
                              : "Serbest antrenman"}
                        </strong>
                        <span>
                          {s.passed ? "Kaliteli tur" : "Pekiştirme önerildi"}
                        </span>
                      </td>
                      <td>
                        {new Date(s.at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td>{durationLabel(s.metrics.elapsed)}</td>
                      <td>%{number(s.metrics.accuracy, 1)}</td>
                      <td>{number(s.metrics.netWpm)} k/dk</td>
                      <td>%{s.metrics.consistency}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
