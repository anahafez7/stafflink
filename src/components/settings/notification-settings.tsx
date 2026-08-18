import { useState } from "react";
import { AlertTriangle, BellRing, CheckCircle2, Download, RefreshCw, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { channelMeta, useNotifications } from "@/lib/notifications";
import { useInstall } from "@/lib/pwa-install";
import { IosInstallGuide } from "@/components/pwa/ios-install-guide";

const statusMeta = {
  granted: {
    label: "Granted",
    tone: "border-success/40 text-success",
    icon: CheckCircle2,
    hint: "This device can receive StaffLink alerts.",
  },
  default: {
    label: "Not requested",
    tone: "border-warning/40 text-warning",
    icon: AlertTriangle,
    hint: "Permission hasn't been asked for yet on this device.",
  },
  denied: {
    label: "Blocked",
    tone: "border-destructive/40 text-destructive",
    icon: AlertTriangle,
    hint: "The browser blocked notifications for this site.",
  },
  unsupported: {
    label: "Unsupported",
    tone: "border-border text-muted-foreground",
    icon: AlertTriangle,
    hint: "This browser doesn't support web notifications.",
  },
} as const;

const troubleshooting = [
  "Tap the lock or settings icon in the browser address bar and set Notifications to Allow.",
  "On iPhone, install StaffLink to the home screen first — Safari only allows alerts for installed apps.",
  "Check that system Do Not Disturb or Focus mode isn't muting the browser.",
  "Turn off Quiet hours below if alerts stop between 22:00 and 07:00.",
];

/** Per-user push notification preferences, permission status and the manual install action. */
export function NotificationSettings() {
  const { settings, setSetting, permission, requestPermission, notify, digest, setDigest, sendDigestNow, unreadCount } =
    useNotifications();
  const { canInstall, installed, promptInstall } = useInstall();
  const [guideOpen, setGuideOpen] = useState(false);

  const status = statusMeta[permission];
  const StatusIcon = status.icon;

  const install = async () => {
    const outcome = await promptInstall();
    if (outcome === "unavailable") setGuideOpen(true);
  };

  const sendTest = () => {
    if (permission !== "granted") {
      toast.info("Enable push permission first to send a test alert.");
      return;
    }
    notify("attendance", "StaffLink test alert", "Notifications are working on this device.");
    toast.success("Test notification sent.");
  };

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <BellRing className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Notifications &amp; app</h2>
          <p className="text-xs text-muted-foreground">{status.hint}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs ${status.tone}`}>
          <StatusIcon className="size-3.5" /> {status.label}
        </span>
        {installed ? (
          <span className="inline-flex items-center gap-1 rounded-lg border border-success/40 px-2 py-1 text-xs text-success">
            <Smartphone className="size-3.5" /> Installed
          </span>
        ) : (
          <Button size="sm" variant="outline" onClick={install}>
            <Download className="size-4" /> {canInstall ? "Install app" : "How to install"}
          </Button>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Permission &amp; troubleshooting
          </p>
          {permission !== "unsupported" ? (
            <Button size="sm" variant="secondary" onClick={requestPermission}>
              <RefreshCw className="size-4" /> {permission === "granted" ? "Re-check" : "Request permission"}
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={sendTest}>
            Send test
          </Button>
        </div>
        {permission !== "granted" ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {troubleshooting.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <ul className="mt-4 divide-y divide-border">
        {channelMeta.map((c) => (
          <li key={c.key} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{c.label}</p>
              <p className="truncate text-xs text-muted-foreground">{c.hint}</p>
            </div>
            <Switch
              checked={settings[c.key]}
              onCheckedChange={(v) => setSetting(c.key, v)}
              aria-label={c.label}
            />
          </li>
        ))}
        <li className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Quiet hours</p>
            <p className="truncate text-xs text-muted-foreground">Mute notifications between 22:00 and 07:00</p>
          </div>
          <Switch
            checked={settings.quietHours}
            onCheckedChange={(v) => setSetting("quietHours", v)}
            aria-label="Quiet hours"
          />
        </li>
      </ul>

      <div className="mt-4 rounded-xl border border-border p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Daily digest</p>
            <p className="text-xs text-muted-foreground">
              Bundle alerts into one summary instead of individual pushes.
            </p>
          </div>
          <Switch
            checked={digest.enabled}
            onCheckedChange={(v) => setDigest({ enabled: v })}
            aria-label="Daily digest"
          />
        </div>
        {digest.enabled ? (
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-xs text-muted-foreground">
              <span className="mb-1 block">Delivery time</span>
              <Input
                type="time"
                value={digest.time}
                onChange={(e) => setDigest({ time: e.target.value })}
                className="w-32"
                aria-label="Digest delivery time"
              />
            </label>
            <Button size="sm" variant="secondary" onClick={sendDigestNow}>
              Send digest now
            </Button>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread queued
              {digest.lastSentAt ? ` · last sent ${new Date(digest.lastSentAt).toLocaleString()}` : ""}
            </p>
          </div>
        ) : null}
      </div>

      <IosInstallGuide open={guideOpen} onOpenChange={setGuideOpen} />
    </section>
  );
}
