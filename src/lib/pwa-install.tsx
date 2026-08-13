import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const SEEN_KEY = "stafflink.install-prompt-seen";

function detectIosSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return iOS && webkit;
}

type InstallContextValue = {
  /** Browser offered an install prompt and the app isn't installed yet. */
  canInstall: boolean;
  /** Auto banner should be shown (only once per device). */
  showBanner: boolean;
  /** Browser has no install prompt (e.g. iOS Safari) — show manual instructions. */
  needsManualInstructions: boolean;
  installed: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  dismissBanner: () => void;
};

const InstallContext = createContext<InstallContextValue | null>(null);

export function InstallProvider({ children }: { children: ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [seen, setSeen] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setSeen(localStorage.getItem(SEEN_KEY) === "1");
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    setIos(detectIosSafari() && !("standalone" in navigator && (navigator as { standalone?: boolean }).standalone));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const markSeen = useCallback(() => {
    localStorage.setItem(SEEN_KEY, "1");
    setSeen(true);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    markSeen();
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome;
  }, [deferred, markSeen]);

  const value = useMemo<InstallContextValue>(
    () => ({
      canInstall: !!deferred && !installed,
      showBanner: (!!deferred || ios) && !installed && !seen,
      needsManualInstructions: !deferred,
      installed,
      promptInstall,
      dismissBanner: markSeen,
    }),
    [deferred, ios, installed, seen, promptInstall, markSeen],
  );

  return <InstallContext.Provider value={value}>{children}</InstallContext.Provider>;
}

export function useInstall() {
  const ctx = useContext(InstallContext);
  if (!ctx) {
    return {
      canInstall: false,
      showBanner: false,
      needsManualInstructions: true,
      installed: false,
      promptInstall: async () => "unavailable" as const,
      dismissBanner: () => {},
    };
  }
  return ctx;
}