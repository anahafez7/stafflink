import { Share, PlusSquare, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Detects iOS/iPadOS Safari, where beforeinstallprompt is unavailable. */
export function isIosSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return iOS && webkit;
}

const steps = [
  { icon: Share, title: "Tap the Share button", hint: "In the Safari toolbar at the bottom of the screen." },
  { icon: PlusSquare, title: "Choose “Add to Home Screen”", hint: "Scroll the share sheet if you don't see it." },
  { icon: Check, title: "Tap Add", hint: "StaffLink appears on your home screen with its own icon." },
];

/** Step-by-step Add to Home Screen guide for browsers without an install prompt. */
export function IosInstallGuide({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="" className="size-10 rounded-xl object-contain" />
            <div>
              <DialogTitle>Install StaffLink</DialogTitle>
              <DialogDescription>
                {isIosSafari()
                  ? "Safari installs apps from the Share menu."
                  : "This browser has no install button — use its menu instead."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ol className="mt-2 space-y-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-3 rounded-xl border border-border p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <s.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {i + 1}. {s.title}
                </p>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
