import { StrictMode, Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Onparmak uygulama hatası:", error);
    console.error(info.componentStack);
  }
  render() {
    if (this.state.error)
      return (
        <main className="fatal-error">
          <h1>Kısa bir duraklama.</h1>
          <p>
            Bu ekranı yüklerken bir sorun oluştu. Yerel ilerlemen korunuyor.
          </p>
          <button onClick={() => window.location.reload()}>
            Sayfayı yeniden aç
          </button>
        </main>
      );
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
        updateViaCache: "none",
      })
      .catch(() => {
        /* The app also works without offline caching. */
      });
  });
}
