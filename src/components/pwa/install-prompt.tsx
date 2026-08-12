import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "stafflink.install-dismissed";

/** Shows an "Install StaffLink" prompt using the app logo. */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => setVisible(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-24 z-[60] md:inset-x-auto md:right-5 md:bottom-5 md:w-96">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-lg">
        <img src="/icon-192.png" alt="" className="size-11 shrink-0 rounded-xl object-contain" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Install StaffLink</p>
          <p className="truncate text-xs text-muted-foreground">
            Add it to your home screen for quick access.
          </p>
        </div>
        <Button size="sm" className="shrink-0" onClick={install}>
          <Download className="size-4" /> Install
        </Button>
        <Button variant="ghost" size="icon" aria-label="Dismiss install prompt" onClick={dismiss}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}