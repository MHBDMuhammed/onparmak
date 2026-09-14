import { useState, useRef } from "react";
import {
  completedCount,
  dateKey,
  freshProfile,
  MAX_BACKUP_BYTES,
  parseProfile,
  type Profile,
} from "../domain/progress";
import { Brand, Icon, Modal, PageHeading } from "../components/shared";

export function Settings({
  profile,
  onChange,
  onRecover,
  onToast,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
  onRecover: (p: Profile) => void;
  onToast: (s: string) => void;
}) {
  const [reset, setReset] = useState(false),
    [resetText, setResetText] = useState(""),
    [imported, setImported] = useState<Profile | null>(null),
    [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  function exportData() {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `onparmak-yedek-${dateKey(Date.now())}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast("Yedeğin indirildi. Güvenli bir yerde saklayabilirsin.");
  }
  async function importData(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      if (file.size > MAX_BACKUP_BYTES)
        throw new Error("Yedek dosyası 8 MB sınırını aşıyor.");
      setImported(parseProfile(await file.text()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dosya okunamadı.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="SANA UYAN BİR ALAN"
        title="Küçük ayarlar, rahat bir deneyim."
        description="Tercihlerin ve ilerlemen bu tarayıcıda saklanır. Hesap açman gerekmez."
      />
      <div className="settings-sections">
        <section className="card settings-card">
          <div className="settings-section-title">
            <Icon name="hand" size={23} />
            <div>
              <h2>Senin çalışma düzenin</h2>
              <p>Küçük ve sürdürülebilir bir hedef seç.</p>
            </div>
          </div>
          <div className="setting-row">
            <label htmlFor="profile-name">
              <strong>Sana nasıl seslenelim?</strong>
              <span>İsmin yalnızca bu cihazda kalır.</span>
            </label>
            <input
              id="profile-name"
              type="text"
              maxLength={30}
              placeholder="İsmin"
              value={profile.name}
              onChange={(e) => onChange({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="setting-row">
            <label htmlFor="daily-goal">
              <strong>Günlük çalışma niyeti</strong>
              <span>Hedef bir davet; yetiştirmen gereken bir yarış değil.</span>
            </label>
            <select
              id="daily-goal"
              value={profile.goal}
              onChange={(e) =>
                onChange({ ...profile, goal: Number(e.target.value) })
              }
            >
              {[5, 10, 15, 20].map((n) => (
                <option value={n} key={n}>
                  {n} dakika
                </option>
              ))}
            </select>
          </div>
        </section>
        <section className="card settings-card">
          <div className="settings-section-title">
            <Icon name="sun" size={23} />
            <div>
              <h2>Görünüm ve rehberlik</h2>
              <p>Dikkatini metinde tutan bir çalışma alanı.</p>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>Renk teması</strong>
              <span>Açık, koyu veya cihazının tercihi.</span>
            </div>
            <div className="segmented">
              {(
                [
                  { id: "light", label: "Açık", icon: "sun" },
                  { id: "dark", label: "Koyu", icon: "moon" },
                  { id: "system", label: "Sistem", icon: "settings" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onChange({ ...profile, theme: t.id })}
                  className={profile.theme === t.id ? "active" : ""}
                >
                  <Icon name={t.icon} size={15} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-row">
            <label htmlFor="guide-setting">
              <strong>Tuş ve parmak rehberi</strong>
              <span>
                Hatırlama turlarında rehber kapanır; istersen yardım
                alabilirsin.
              </span>
            </label>
            <select
              id="guide-setting"
              value={profile.guide}
              onChange={(e) =>
                onChange({
                  ...profile,
                  guide: e.target.value as Profile["guide"],
                })
              }
            >
              <option value="auto">Becerime göre uyarla</option>
              <option value="full">Öğrenirken açık tut</option>
              <option value="off">Kapalı başlat</option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <strong>Hafif hata sesi</strong>
              <span>Yanlış vuruşta kısa, yumuşak bir ses.</span>
            </div>
            <button
              className={`switch ${profile.sound ? "on" : ""}`}
              role="switch"
              aria-checked={profile.sound}
              aria-label="Hafif hata sesi"
              onClick={() => onChange({ ...profile, sound: !profile.sound })}
            >
              <span />
            </button>
          </div>
        </section>
        <section className="card settings-card">
          <div className="settings-section-title">
            <Icon name="shield" size={23} />
            <div>
              <h2>İlerlemen seninle kalsın</h2>
              <p>
                Tarayıcı verilerini temizlemek ilerlemeni siler. Arada bir yedek
                al.
              </p>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>Yerel yedek</strong>
              <span>
                Dersler, beceri verileri, son 500 oturum ve tercihlerin.
              </span>
            </div>
            <div className="button-row">
              <button className="button secondary" onClick={exportData}>
                <Icon name="download" size={16} />
                Yedek indir
              </button>
              <button
                className="button secondary"
                onClick={() => fileInput.current?.click()}
              >
                <Icon name="upload" size={16} />
                İçe aktar
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".json,application/json"
                className="sr-only"
                aria-label="Yedek dosyası seç"
                onChange={(e) => void importData(e.target.files?.[0])}
              />
            </div>
          </div>
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          <div className="setting-row danger-row">
            <div>
              <strong>Yeni bir başlangıç</strong>
              <span>
                Bu tarayıcıdaki tüm ders ve performans kayıtlarını sil.
              </span>
            </div>
            <button
              className="button danger"
              onClick={() => {
                setReset(true);
                setResetText("");
              }}
            >
              İlerlemeyi sıfırla
            </button>
          </div>
        </section>
        <div className="settings-version">
          <Brand compact />
          Onparmak 1.0 · Türkçe Q · İnternetsiz çalışır · Verin cihazından
          çıkmaz.
        </div>
      </div>
      {reset && (
        <Modal title="İlerlemeni sıfırla" onClose={() => setReset(false)}>
          <p>
            Bu tarayıcıdaki {completedCount(profile)} tamamlanmış ders ve{" "}
            {profile.sessions.length} oturum kaydı silinecek. İndirdiğin yedekle
            geri yükleyebilirsin.
          </p>
          <button className="text-button" onClick={exportData}>
            <Icon name="download" size={16} />
            Önce yedeğimi indir
          </button>
          <label className="field-label reset-label">
            Onaylamak için SIFIRLA yaz
            <input
              value={resetText}
              onChange={(e) => setResetText(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button
            className="button danger"
            disabled={resetText !== "SIFIRLA"}
            onClick={() => {
              onRecover({ ...freshProfile(), theme: profile.theme });
              setReset(false);
              onToast(
                "Yerel ilerleme silindi. Varsa yedeğinle geri yükleyebilirsin.",
              );
            }}
          >
            Tüm ilerlemeyi sil
          </button>
        </Modal>
      )}
      {imported && (
        <Modal title="Yedeğini geri yükle" onClose={() => setImported(null)}>
          <p>
            Bu yedek {completedCount(imported)} tamamlanmış ders ve{" "}
            {imported.sessions.length} oturum içeriyor. Mevcut yerel kaydın bu
            yedekle değiştirilecek.
          </p>
          <div className="button-row">
            <button className="button secondary" onClick={exportData}>
              Mevcut kaydı yedekle
            </button>
            <button
              className="button primary"
              onClick={() => {
                onRecover(imported);
                setImported(null);
                onToast("Yedeğin yüklendi. Kaldığın yerden devam edebilirsin.");
              }}
            >
              Yedeği yükle
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
