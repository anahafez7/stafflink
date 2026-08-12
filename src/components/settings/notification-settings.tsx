import { BellRing, Download, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { channelMeta, useNotifications } from "@/lib/notifications";
import { useInstall } from "@/lib/pwa-install";

/** Per-user push notification preferences plus the manual app install action. */
export function NotificationSettings() {
  const { settings, setSetting, permission, requestPermission } = useNotifications();
  const { canInstall, installed, promptInstall } = useInstall();

  const install = async () => {
    const outcome = await promptInstall();
    if (outcome === "unavailable") {
      toast.info("Use your browser menu → Add to Home screen to install StaffLink.");
    }
  };

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <BellRing className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Notifications &amp; app</h2>
          <p className="text-xs text-muted-foreground">
            Push alerts are {permission === "granted" ? "enabled on this device" : "off for this device"}.
          </p>
        </div>
        {permission !== "granted" && permission !== "unsupported" ? (
          <Button size="sm" variant="secondary" onClick={requestPermission}>
            Enable push
          </Button>
        ) : null}
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
    </section>
  );
}