import { useEffect, useState } from "react";
import { lessons, stages, type Lesson } from "./content/curriculum";
import {
  achievements,
  completedCount,
  isUnlocked,
  loadProfile,
  needsReview,
  nextLesson,
  parseProfile,
  recordSession,
  reviewTargets,
  saveProfile,
  streak,
  type Profile,
  type Session,
} from "./domain/progress";
import { makeTraining, type Training } from "./domain/practice";
import { upperTR } from "./domain/keyboard";
import type { TypingEngine } from "./domain/engine";
import { Brand, Icon, Modal, type Page } from "./components/shared";
import { Workspace } from "./components/Workspace";
import { Onboarding } from "./components/Onboarding";
import { LessonIntro } from "./components/LessonIntro";
import { Home } from "./pages/Home";
import { Course } from "./pages/Course";
import { Practice } from "./pages/Practice";
import { Progress } from "./pages/Progress";
import { Guide } from "./pages/Guide";
import { Settings } from "./pages/Settings";
import "./styles.css";

const navigation: { id: Page; title: string; icon: string }[] = [
  { id: "home", title: "Çalışma alanım", icon: "home" },
  { id: "course", title: "Öğrenme yolu", icon: "map" },
  { id: "practice", title: "Serbest antrenman", icon: "keyboard" },
  { id: "progress", title: "Gelişimim", icon: "chart" },
];

export default function App() {
  const [initial] = useState(loadProfile);
  const [profile, setProfile] = useState(initial.profile),
    [storageError, setStorageError] = useState(initial.error);
  const [blockedStorage, setBlockedStorage] = useState(Boolean(initial.error));
  const [page, setPage] = useState<Page>("home"),
    [training, setTraining] = useState<Training | null>(null),
    [trainingKey, setTrainingKey] = useState(0);
  const [intro, setIntro] = useState<Lesson | null>(null),
    [reviewGate, setReviewGate] = useState<Lesson | null>(null),
    [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const isDark =
    profile.theme === "dark" || (profile.theme === "system" && systemDark);
  useEffect(() => {
    if (blockedStorage) return;
    try {
      saveProfile(profile);
    } catch {
      setStorageError(
        "Tarayıcı kaydı yapılamadı. Bu oturum açıkken ilerlemen korunur; Ayarlar bölümünden yedek indir.",
      );
    }
  }, [profile, blockedStorage]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#151d19" : "#f7f8f4");
  }, [isDark]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === "onparmak.progress.v1" && e.newValue) {
        try {
          setProfile(parseProfile(e.newValue));
        } catch {
          setStorageError(
            "Diğer sekmedeki kayıt okunamadı. Bu sekmedeki veriler korunuyor.",
          );
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const changePage = (p: Page) => {
    setPage(p);
    setMobileMenu(false);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  };
  function start(options: Parameters<typeof makeTraining>[1]) {
    setTraining(makeTraining(profile, options));
    setTrainingKey((k) => k + 1);
    setIntro(null);
    setReviewGate(null);
    window.scrollTo(0, 0);
  }
  function requestLesson(lesson: Lesson) {
    if (!isUnlocked(profile, lesson)) return;
    if (
      needsReview(profile) &&
      (profile.lessons[lesson.id]?.rounds ?? 0) === 0
    ) {
      setReviewGate(lesson);
      return;
    }
    setIntro(lesson);
  }
  function save(session: Session, engine: TypingEngine) {
    const previous = profile;
    const next = recordSession(previous, session, engine.strokes);
    setProfile(next);
    const earned = achievements.filter(
      (a) => !previous.earned[a.id] && next.earned[a.id],
    );
    if (earned.length)
      setToast(`Yeni kazanım: ${earned.map((a) => a.title).join(", ")}`);
  }
  function afterSession() {
    if (training?.mode === "lesson" || training?.mode === "review") {
      const lesson = nextLesson(profile);
      if (lesson) {
        setTraining(null);
        requestLesson(lesson);
      } else {
        setTraining(null);
        changePage("course");
        setToast("60 ders tamamlandı. Yetkinliğini düzenli tekrarlarla koru.");
      }
    } else if (training)
      start({
        mode: training.mode,
        minutes: training.duration / 60000,
        difficulty: training.difficulty,
      });
  }
  function retry() {
    if (training)
      start({
        mode: training.mode,
        lesson: training.lesson,
        minutes: training.duration / 60000,
        difficulty: training.difficulty,
      });
  }
  function recover(p: Profile) {
    setProfile(p);
    setBlockedStorage(false);
    setStorageError("");
  }
  const completed = completedCount(profile),
    next = nextLesson(profile);
  return (
    <>
      {training ? (
        <Workspace
          key={trainingKey}
          profile={profile}
          training={training}
          storageError={storageError}
          onSave={save}
          onExit={() => {
            setTraining(null);
            window.scrollTo(0, 0);
          }}
          onNext={afterSession}
          onRetry={retry}
        />
      ) : (
        <div className="app-shell">
          <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
            <button className="brand-button" onClick={() => changePage("home")}>
              <Brand />
            </button>
            <button
              className="icon-button mobile-close"
              onClick={() => setMobileMenu(false)}
              aria-label="Menüyü kapat"
            >
              <Icon name="close" />
            </button>
            <div className="sidebar-label">KENDİ RİTMİNDE ÖĞREN</div>
            <nav aria-label="Ana menü">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? "active" : ""}`}
                  onClick={() => changePage(item.id)}
                  aria-current={page === item.id ? "page" : undefined}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.title}</span>
                  {page === item.id && <span className="nav-indicator" />}
                </button>
              ))}
            </nav>
            <div className="sidebar-journey">
              <div className="sidebar-journey-icon">
                <Icon name="sprout" size={23} />
              </div>
              <strong>Bir beceri. Ömür boyu.</strong>
              <p>
                Her doğru dokunuşla
                <br />
                biraz daha özgür.
              </p>
              <div className="thin-progress">
                <span style={{ width: `${(completed / 60) * 100}%` }} />
              </div>
              <span>{completed} / 60 ders tamamlandı</span>
            </div>
            <div className="sidebar-bottom">
              <button
                className={`nav-item ${page === "guide" ? "active" : ""}`}
                onClick={() => changePage("guide")}
              >
                <Icon name="help" size={19} />
                Yazma rehberi
              </button>
              <button
                className={`nav-item ${page === "settings" ? "active" : ""}`}
                onClick={() => changePage("settings")}
              >
                <Icon name="settings" size={19} />
                Ayarlar
              </button>
              <div className="sidebar-profile">
                <span className="avatar">
                  {profile.name ? upperTR(profile.name[0]) : "S"}
                </span>
                <div>
                  <strong>{profile.name || "Senin yolculuğun"}</strong>
                  <span>
                    {completed === 60
                      ? "Yetkin yazar"
                      : `Aşama ${(next?.stage ?? 0) + 1} · ${stages[next?.stage ?? 0].subtitle}`}
                  </span>
                </div>
                <button
                  className="icon-button theme-toggle"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      theme: isDark ? "light" : "dark",
                    })
                  }
                  aria-label="Renk temasını değiştir"
                >
                  <Icon name={isDark ? "sun" : "moon"} size={16} />
                </button>
              </div>
            </div>
          </aside>
          {mobileMenu && (
            <div
              className="mobile-scrim"
              onClick={() => setMobileMenu(false)}
            />
          )}
          <div className="main-shell">
            <header className="topbar">
              <div className="breadcrumb">
                <button
                  className="icon-button mobile-menu-button"
                  onClick={() => setMobileMenu(true)}
                  aria-label="Menüyü aç"
                >
                  <Icon name="menu" />
                </button>
                <span>Senin öğrenme yolculuğun</span>
                <Icon name="chevron" size={14} />
                <strong>
                  {navigation.find((n) => n.id === page)?.title ??
                    (page === "settings" ? "Ayarlar" : "Yazma rehberi")}
                </strong>
              </div>
              <div className="topbar-right">
                <span className="streak-pill">
                  <Icon name="flame" size={16} />
                  {streak(profile)} gün
                  <span className="streak-label"> seri</span>
                </span>
                <span className="local-pill">
                  <i />
                  Yerel ve sana özel
                </span>
              </div>
            </header>
            <main id="main-content" className={`page page-${page}`}>
              {storageError && (
                <div className="notice error" role="alert">
                  <Icon name="alert" />
                  <span>{storageError}</span>
                  <button
                    className="text-button"
                    onClick={() => changePage("settings")}
                  >
                    Ayarlar
                  </button>
                </div>
              )}
              {page === "home" && (
                <Home
                  profile={profile}
                  onLesson={requestLesson}
                  onNavigate={changePage}
                  onReview={() => start({ mode: "review", minutes: 2 })}
                />
              )}
              {page === "course" && (
                <Course
                  profile={profile}
                  onLesson={requestLesson}
                  onReview={() => start({ mode: "review", minutes: 2 })}
                />
              )}
              {page === "practice" && (
                <Practice
                  profile={profile}
                  onStart={(minutes, difficulty) =>
                    start({ mode: "practice", minutes, difficulty })
                  }
                  onReview={() => start({ mode: "review", minutes: 2 })}
                />
              )}
              {page === "progress" && (
                <Progress
                  profile={profile}
                  onStart={() =>
                    next
                      ? requestLesson(next)
                      : start({ mode: "practice", minutes: 3 })
                  }
                  onReview={() => start({ mode: "review", minutes: 2 })}
                />
              )}
              {page === "guide" && <Guide />}
              {page === "settings" && (
                <Settings
                  profile={profile}
                  onChange={setProfile}
                  onRecover={recover}
                  onToast={setToast}
                />
              )}
            </main>
            <footer className="app-footer">
              <span>
                <Icon name="leaf" size={14} /> Hız geçici bir sayı. İyi bir
                alışkanlık kalıcıdır.
              </span>
              <span>Türkçe için, özenle.</span>
            </footer>
          </div>
        </div>
      )}
      {!profile.onboarded && !training && (
        <Onboarding
          profile={profile}
          onComplete={(p) => {
            setProfile(p);
            if (!blockedStorage) setStorageError("");
            setIntro(lessons[0]);
          }}
        />
      )}
      {intro && !training && (
        <LessonIntro
          lesson={intro}
          profile={profile}
          onClose={() => setIntro(null)}
          onStart={() => start({ mode: "lesson", lesson: intro })}
        />
      )}
      {reviewGate && (
        <Modal
          title="Önce tanıdık hareketleri uyandıralım."
          onClose={() => setReviewGate(null)}
        >
          <p>
            Tekrar zamanı gelen veya son çalışmada zorlandığın beceriler var.
            Yeni tuşlardan önce iki dakikalık kişisel tekrar yapacağız.
          </p>
          <div className="key-chips">
            {reviewTargets(profile).map((k) => (
              <kbd key={k}>{upperTR(k)}</kbd>
            ))}
          </div>
          <button
            className="button primary"
            onClick={() => start({ mode: "review", minutes: 2 })}
          >
            Tekrarla güçlen <Icon name="right" size={17} />
          </button>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={18} />
          {toast}
        </div>
      )}
      {!training && (
        <a className="skip-link" href="#main-content">
          İçeriğe atla
        </a>
      )}
    </>
  );
}
