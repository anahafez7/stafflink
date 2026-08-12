import { Download, X } from "lucide-react";


import { Button } from "@/components/ui/button";
import { useInstall } from "@/lib/pwa-install";

/** Shows an "Install StaffLink" prompt using the app logo. */
export function InstallPrompt() {
  const { showBanner, promptInstall, dismissBanner } = useInstall();

  if (!showBanner) return null;

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
        <Button size="sm" className="shrink-0" onClick={() => void promptInstall()}>
          <Download className="size-4" /> Install
        </Button>
        <Button variant="ghost" size="icon" aria-label="Dismiss install prompt" onClick={dismissBanner}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}