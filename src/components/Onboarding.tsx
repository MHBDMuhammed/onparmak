import { useRef, useState } from "react";
import type { Profile } from "../domain/progress";
import { Brand, Icon, useDialogFocus } from "./shared";

export function Onboarding({
  profile,
  onComplete,
}: {
  profile: Profile;
  onComplete: (p: Profile) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useDialogFocus(root);
  const [step, setStep] = useState(0),
    [name, setName] = useState(profile.name),
    [goal, setGoal] = useState(profile.goal);
  const content = [
    {
      eyebrow: "HOŞ GELDİN",
      title: "Düşüncelerinle klavye arasındaki mesafeyi kapat.",
      description:
        "Türkçe Q klavyede, sıfırdan on parmağa. Küçük tekrarlar, doğru alışkanlıklar ve tamamen sana ait bir öğrenme yolu.",
    },
    {
      eyebrow: "İYİ BİR TEMEL",
      title: "Hızdan önce, doğru bir dokunuş.",
      description:
        "F ve J üzerindeki çıkıntıları hisset. Sol elin A S D F, sağ elin J K L Ş üzerinde olsun. Gözlerin ekranda, omuzların serbest.",
    },
    {
      eyebrow: "KENDİ RİTMİNDE",
      title: "Her gün kendine küçük bir alan aç.",
      description:
        "Bir ders üç turdan oluşur: tanı, pekiştir, hatırla. Doğruluğun yerleştiğinde yeni beceriler açılır. Acele etmene gerek yok.",
    },
  ][step];
  return (
    <div ref={root} className="onboarding-backdrop">
      <section
        className="onboarding"
        role="dialog"
        aria-modal="true"
        aria-label="Onparmak başlangıç rehberi"
      >
        <div className="onboarding-art">
          <Brand />
          <div className="onboarding-key-art">
            <div className="onboard-key key-one">
              f<span />
            </div>
            <div className="onboard-key key-two">
              j<span />
            </div>
            <span className="onboard-orbit" />
          </div>
          <div className="onboarding-art-caption">
            <span>
              DAHA AZ DÜŞÜN.
              <br />
              <em>DAHA DOĞAL YAZ.</em>
            </span>
            <p>Bir beceri. Ömür boyu.</p>
          </div>
        </div>
        <div className="onboarding-content">
          <div className="onboarding-steps">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i <= step ? "active" : ""} />
            ))}
            <small>{step + 1} / 3</small>
          </div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          {step === 0 && (
            <div className="onboarding-points">
              <span>
                <Icon name="map" size={18} />
                60 ders, temelden gerçek hayata
              </span>
              <span>
                <Icon name="sparkles" size={18} />
                Sana uyum sağlayan pratik
              </span>
              <span>
                <Icon name="shield" size={18} />
                Hesapsız, reklamsız, tamamen yerel
              </span>
            </div>
          )}
          {step === 1 && (
            <>
              <div className="home-row-demo">
                {["A", "S", "D", "F", "J", "K", "L", "Ş"].map((k) => (
                  <kbd key={k} className={k === "F" || k === "J" ? "bump" : ""}>
                    {k}
                  </kbd>
                ))}
              </div>
              <div className="onboarding-info">
                <Icon name="keyboard" size={21} />
                <p>
                  Öğrenmek için fiziksel bir Türkçe Q klavye kullan. Küçük
                  ekranlarda ilerlemeni inceleyebilir, uygun bir klavyeyle
                  çalışabilirsin.
                </p>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="onboarding-fields">
              <label className="field-label">
                İsmin <span>(isteğe bağlı)</span>
                <input
                  value={name}
                  maxLength={30}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sana nasıl seslenelim?"
                />
              </label>
              <label className="field-label">
                Günlük çalışma niyetin
                <select
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                >
                  {[5, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>
                      {n} dakika{n === 10 ? " · dengeli bir başlangıç" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <div className="onboarding-actions">
            {step > 0 && (
              <button className="text-button" onClick={() => setStep(step - 1)}>
                Geri
              </button>
            )}
            <button
              className="button primary large"
              autoFocus
              onClick={() =>
                step < 2
                  ? setStep(step + 1)
                  : onComplete({
                      ...profile,
                      name: name.trim(),
                      goal,
                      onboarded: true,
                    })
              }
            >
              {step === 2 ? "Yolculuğuma başla" : "Devam et"}
              <Icon name="right" size={18} />
            </button>
          </div>
          <span className="onboarding-small">
            Mükemmel başlaman gerekmiyor. Başlaman yeterli.
          </span>
        </div>
      </section>
    </div>
  );
}
