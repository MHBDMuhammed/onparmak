import { useState } from "react";
import type { Profile } from "../domain/progress";
import type { Difficulty } from "../domain/practice";
import { Icon, PageHeading } from "../components/shared";

export function Practice({
  profile,
  onStart,
  onReview,
}: {
  profile: Profile;
  onStart: (minutes: number, difficulty: Difficulty) => void;
  onReview: () => void;
}) {
  const [minutes, setMinutes] = useState(2),
    [difficulty, setDifficulty] = useState<Difficulty>("personal");
  const options: {
    id: Difficulty;
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      id: "personal",
      title: "Bana özel",
      description: "Öğrendiğin tuşlar ve zorlandığın geçişler.",
      icon: "sparkles",
    },
    {
      id: "words",
      title: "Kelime akışı",
      description: "Tüm harflerle geniş Türkçe kelime havuzu.",
      icon: "leaf",
    },
    {
      id: "text",
      title: "Doğal metin",
      description: "Cümleler, paragraflar ve noktalama.",
      icon: "book",
    },
    {
      id: "mixed",
      title: "Gerçek hayat",
      description: "Yazışmalar, saatler, sayılar ve belgeler.",
      icon: "layers",
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="KENDİ ALANIN, KENDİ TEMPON"
        title="Kelimelere biraz alan aç."
        description="Bir süre seç, rahatça yerleş ve yaz. Her çalışma kişisel öğrenme modelini de besler."
      />
      <div className="practice-layout">
        <section className="practice-builder card">
          <div className="section-step">
            <span>01</span>
            <div>
              <h2>Ne kadar zamanın var?</h2>
              <p>Kısa ve düzenli çalışmak yeterli.</p>
            </div>
          </div>
          <div
            className="duration-options"
            role="group"
            aria-label="Antrenman süresi"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                className={minutes === n ? "selected" : ""}
                key={n}
                onClick={() => setMinutes(n)}
                aria-pressed={minutes === n}
              >
                <strong>{n}</strong>
                <span>dakika</span>
                {minutes === n && <Icon name="check" size={12} />}
              </button>
            ))}
          </div>
          <div className="section-step">
            <span>02</span>
            <div>
              <h2>Nasıl bir akış istersin?</h2>
              <p>Öğrenme yolun dışında keşfetmek serbest.</p>
            </div>
          </div>
          <div className="practice-types" role="group" aria-label="İçerik türü">
            {options.map((option) => (
              <button
                key={option.id}
                className={difficulty === option.id ? "selected" : ""}
                onClick={() => setDifficulty(option.id)}
                aria-pressed={difficulty === option.id}
              >
                <span className="practice-type-icon">
                  <Icon name={option.icon} />
                </span>
                <div>
                  <strong>{option.title}</strong>
                  <p>{option.description}</p>
                </div>
                <span className="radio-dot" />
              </button>
            ))}
          </div>
          <div className="practice-start">
            <span>
              <Icon name="shield" size={16} />
              İlk vuruşla başlar. Odağın kaybolursa durur.
            </span>
            <button
              className="button primary large"
              onClick={() => onStart(minutes, difficulty)}
            >
              Akışa başla <Icon name="right" size={18} />
            </button>
          </div>
        </section>
        <aside className="practice-aside">
          <div className="practice-art">
            <span className="flow-word word-one">düşünce</span>
            <span className="flow-word word-two">
              akış
              <span className="flow-caret" />
            </span>
            <span className="flow-word word-three">özgürlük</span>
            <span className="flow-word word-four">ritim</span>
            <span className="practice-art-label">
              DÜŞÜNCENDEN PARMAK UÇLARINA
            </span>
          </div>
          <div className="card practice-note">
            <Icon name="leaf" size={24} />
            <p className="practice-note-title">Bir yarışta değilsin.</p>
            <p>
              Önce %95 doğruluğu koru. Ellerinin rahatlığına ve metnin akışına
              odaklan. Hız, temelin güçlendikçe gelir.
            </p>
            <p className="fine-print">
              Serbest çalışma ders kilitlerini açmaz; tuş, geçiş ve tekrar
              planını günceller.
            </p>
          </div>
          {profile.sessions.length > 0 && (
            <button className="review-link" onClick={onReview}>
              <Icon name="repeat" />
              <span>
                Zayıf noktalarını çalış
                <strong>2 dakikalık kişisel tekrar</strong>
              </span>
              <Icon name="right" size={17} />
            </button>
          )}
        </aside>
      </div>
    </>
  );
}
