import { stages, type Lesson } from "../content/curriculum";
import type { Profile } from "../domain/progress";
import { upperTR } from "../domain/keyboard";
import { Icon, Modal } from "./shared";

export function LessonIntro({
  lesson,
  profile,
  onClose,
  onStart,
}: {
  lesson: Lesson;
  profile: Profile;
  onClose: () => void;
  onStart: () => void;
}) {
  const round = Math.min(2, profile.lessons[lesson.id]?.rounds ?? 0);
  return (
    <Modal title={lesson.title} onClose={onClose}>
      <p className="eyebrow">
        DERS {lesson.number} · {stages[lesson.stage].subtitle} ·{" "}
        {["Tanı", "Pekiştir", "Hatırla"][round]}
      </p>
      <p className="intro-instruction">{lesson.instruction}</p>
      {lesson.focus.length < 14 && (
        <div className="intro-keys key-chips">
          {[...lesson.focus]
            .filter((c) => c !== " ")
            .map((c, i) => (
              <kbd key={i}>{upperTR(c)}</kbd>
            ))}
        </div>
      )}
      <div className="intro-goals">
        <span>
          <Icon name="target" size={18} />%{lesson.accuracy} doğruluk
        </span>
        <span>
          <Icon name="eye" size={18} />
          {round === 2 ? "Rehbersiz hatırlama" : "Doğru parmak yerleşimi"}
        </span>
        {lesson.minWpm > 0 && (
          <span>
            <Icon name="wind" size={18} />
            {lesson.minWpm} kelime/dk
          </span>
        )}
      </div>
      <p className="intro-note">
        {round === 2
          ? "Bu turda klavye yardımı kapanır. Yardım alırsan önce pekiştirir, sonra bir bağımsız tur daha yaparız."
          : "Hata yapmak öğrenmenin parçası. Geri silerek düzelt; hızlanmak için doğruluğunun yerleşmesini bekle."}
      </p>
      <button className="button primary large full-width" onClick={onStart}>
        Hazırım, başlayalım <Icon name="right" size={18} />
      </button>
    </Modal>
  );
}
