import { useState } from "react";
import { stages, type Lesson } from "../content/curriculum";
import {
  completedCount,
  isUnlocked,
  nextLesson,
  type Profile,
} from "../domain/progress";
import { Icon, ProgressRing, PageHeading } from "../components/shared";

export function Course({
  profile,
  onLesson,
  onReview,
}: {
  profile: Profile;
  onLesson: (l: Lesson) => void;
  onReview: () => void;
}) {
  const current = nextLesson(profile),
    count = completedCount(profile);
  const [open, setOpen] = useState(current?.stage ?? 11);
  return (
    <>
      <PageHeading
        eyebrow="60 DERS · BİR ÖMÜR BOYU BECERİ"
        title="Her adımın bir nedeni var."
        description="Doğru hareketi öğren, pekiştir ve yardım olmadan hatırla. Sonra bir sonraki beceriye geç."
      />
      <div className="course-summary">
        <ProgressRing value={(count / 60) * 100} size={66}>
          <strong>
            {Math.round((count / 60) * 100)}
            <small>%</small>
          </strong>
        </ProgressRing>
        <div>
          <h3>
            {count === 60
              ? "Öğrenme yolunu tamamladın."
              : `${count} ders tamamlandı, sağlam bir temel kuruluyor.`}
          </h3>
          <p>
            {count === 60
              ? "Mezuniyet bir bitiş değil. Kişisel tekrarlarla yetkinliğini koru, günlük hayatında kullan."
              : "Yeni dersler, önceki dersin üç turunu tamamladığında açılır."}
          </p>
        </div>
        {count === 60 && (
          <button className="button primary" onClick={onReview}>
            Becerilerimi koru <Icon name="repeat" size={16} />
          </button>
        )}
      </div>
      <div className="course-stages">
        {stages.map((stage) => {
          const done = stage.lessons.filter(
            (l) => profile.lessons[l.id]?.rounds === 3,
          ).length;
          const locked = !isUnlocked(profile, stage.lessons[0]);
          return (
            <section
              key={stage.id}
              className={`course-stage ${open === stage.id ? "expanded" : ""} ${locked ? "locked-stage" : ""}`}
            >
              <button
                className="stage-heading"
                onClick={() => setOpen(open === stage.id ? -1 : stage.id)}
                aria-expanded={open === stage.id}
              >
                <span
                  className={`course-stage-icon ${done === 5 ? "complete" : ""}`}
                >
                  <Icon name={done === 5 ? "check" : stage.icon} size={23} />
                </span>
                <div>
                  <span className="eyebrow">
                    AŞAMA {String(stage.id + 1).padStart(2, "0")}
                    <i>·</i>
                    {stage.subtitle}
                  </span>
                  <h2>{stage.title}</h2>
                </div>
                <span className="stage-completion">{done}/5 ders</span>
                {locked ? (
                  <Icon name="lock" size={17} />
                ) : (
                  <Icon name="down" size={17} />
                )}
              </button>
              {open === stage.id && (
                <div className="stage-body">
                  <p>{stage.description}</p>
                  <div className="lesson-list">
                    {stage.lessons.map((lesson) => {
                      const p = profile.lessons[lesson.id],
                        available = isUnlocked(profile, lesson),
                        done = p?.rounds === 3;
                      return (
                        <button
                          key={lesson.id}
                          className={`lesson-row ${done ? "lesson-done" : ""} ${current?.id === lesson.id ? "lesson-current" : ""}`}
                          onClick={() => onLesson(lesson)}
                          disabled={!available}
                        >
                          <span className="lesson-order">
                            {done ? (
                              <Icon name="check" size={17} />
                            ) : available ? (
                              String(lesson.number).padStart(2, "0")
                            ) : (
                              <Icon name="lock" size={14} />
                            )}
                          </span>
                          <div className="lesson-name">
                            <strong>{lesson.title}</strong>
                            <span>
                              {lesson.kind === "checkpoint"
                                ? "Beceri kontrolü"
                                : lesson.kind === "endurance"
                                  ? "Dayanıklılık"
                                  : lesson.kind === "rhythm"
                                    ? "Ritim çalışması"
                                    : lesson.kind === "speed"
                                      ? "Kontrollü hız"
                                      : lesson.kind === "keys"
                                        ? "Yeni hareket"
                                        : "Gerçek dilde uygulama"}{" "}
                              · %{lesson.accuracy} doğruluk
                            </span>
                          </div>
                          <span className="lesson-focus">
                            {lesson.focus.length < 13 ? lesson.focus : ""}
                          </span>
                          <span className="lesson-round-count">
                            {done ? "Tamamlandı" : `${p?.rounds ?? 0}/3 tur`}
                          </span>
                          <Icon name={available ? "right" : "lock"} size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
      <div className="course-end">
        <Icon name="graduate" size={27} />
        <div>
          <h3>Hedef: klavyeyi değil, düşünceni takip etmek.</h3>
          <p>
            Son değerlendirme: 5 dakika · %98 doğruluk · 35 kelime/dk · %60
            ritim · rehbersiz yazım
          </p>
        </div>
      </div>
    </>
  );
}
