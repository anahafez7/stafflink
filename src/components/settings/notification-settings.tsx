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

import { useI18n } from "@/lib/i18n";

/** Per-user push notification preferences, permission status and the manual install action. */
export function NotificationSettings() {
  const { settings, setChannelPref, setQuietHours, permission, requestPermission, notify, digest, setDigest, sendDigestNow, unreadCount } =
    useNotifications();
  const { canInstall, installed, promptInstall } = useInstall();
  const { t, lang } = useI18n();
  const [guideOpen, setGuideOpen] = useState(false);

  const status = statusMeta[permission];
  const StatusIcon = status.icon;

  const install = async () => {
    const outcome = await promptInstall();
    if (outcome === "unavailable") setGuideOpen(true);
  };

  const sendTest = () => {
    if (permission !== "granted") {
      toast.info(lang === "ar" ? "يرجى تفعيل إذن الإشعارات أولاً لإرسال تنبيه تجريبي." : "Enable push permission first to send a test alert.");
      return;
    }
    notify("attendance", "StaffLink test alert", "Notifications are working on this device.");
    toast.success(lang === "ar" ? "تم إرسال إشعار تجريبي بنجاح." : "Test notification sent.");
  };

  const channelTranslations: Record<string, { label: string; hint: string }> = {
    "attendance": { label: "الحضور والانصراف", hint: "تنبيهات فورية عند تسجيل البصمة أو التأخير" },
    "leaves": { label: "الإجازات والطلبات", hint: "تحديثات عند اعتماد أو رفض طلبات الإجازة" },
    "documents": { label: "المستندات والعقود", hint: "تنبيهات قبل انتهاء صلاحية الوثائق بـ 30 يوماً" },
    "announcements": { label: "التعاميم والأخبار", hint: "إعلانات الإدارة والقرارات المؤسسية العامة" },
  };

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <BellRing className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{lang === "ar" ? "الإشعارات وتطبيق الهاتف" : "Notifications & app"}</h2>
          <p className="text-xs text-muted-foreground">{status.hint}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs ${status.tone}`}>
          <StatusIcon className="size-3.5" /> {status.label}
        </span>
        {installed ? (
          <span className="inline-flex items-center gap-1 rounded-lg border border-success/40 px-2 py-1 text-xs text-success">
            <Smartphone className="size-3.5" /> {lang === "ar" ? "مثبت" : "Installed"}
          </span>
        ) : (
          <Button size="sm" variant="outline" onClick={install}>
            <Download className="size-4 me-1.5" /> {canInstall ? (lang === "ar" ? "تثبيت التطبيق" : "Install app") : (lang === "ar" ? "طريقة التثبيت" : "How to install")}
          </Button>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {lang === "ar" ? "الأذونات واستكشاف الأخطاء" : "Permission & troubleshooting"}
          </p>
          {permission !== "unsupported" ? (
            <Button size="sm" variant="secondary" onClick={requestPermission}>
              <RefreshCw className="size-4 me-1.5" /> {permission === "granted" ? (lang === "ar" ? "إعادة الفحص" : "Re-check") : (lang === "ar" ? "طلب الإذن" : "Request permission")}
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={sendTest}>
            {lang === "ar" ? "إرسال اختبار" : "Send test"}
          </Button>
        </div>
        {permission !== "granted" ? (
          <ul className="mt-3 list-disc space-y-1 ltr:pl-5 rtl:pr-5 text-xs text-muted-foreground">
            {troubleshooting.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <ul className="mt-4 divide-y divide-border">
        {channelMeta.map((c) => {
          const trans = (lang === "ar" ? channelTranslations[c.key] : null) ?? { label: c.label, hint: c.hint };
          return (
            <li key={c.key} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{trans.label}</p>
                <p className="truncate text-xs text-muted-foreground">{trans.hint}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                <label className="flex items-center gap-2">
                  <span>Inbox</span>
                  <Switch
                    checked={settings.channels[c.key].inbox}
                    onCheckedChange={(v) => setChannelPref(c.key, "inbox", v)}
                    aria-label={`${trans.label} inbox`}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span>Push</span>
                  <Switch
                    checked={settings.channels[c.key].push}
                    onCheckedChange={(v) => setChannelPref(c.key, "push", v)}
                    aria-label={`${trans.label} push`}
                  />
                </label>
              </div>
            </li>
          );
        })}
        <li className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{lang === "ar" ? "ساعات الهدوء" : "Quiet hours"}</p>
            <p className="truncate text-xs text-muted-foreground">{lang === "ar" ? "كتم الإشعارات تلقائياً بين الساعة 10:00 مساءً و 07:00 صباحاً" : "Mute notifications between 22:00 and 07:00"}</p>
          </div>
          <Switch
            checked={settings.quietHours}
            onCheckedChange={(v) => setQuietHours(v)}
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
            <label className="text-xs text-muted-foreground">
              <span className="mb-1 block">Test date (optional)</span>
              <Input
                type="date"
                value={digest.testDate}
                onChange={(e) => setDigest({ testDate: e.target.value })}
                className="w-40"
                aria-label="Digest test date"
              />
            </label>
            <Button size="sm" variant="secondary" onClick={sendDigestNow}>
              Send digest now
            </Button>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread queued
              {digest.lastSentAt ? ` · last sent ${new Date(digest.lastSentAt).toLocaleString()}` : ""}
            </p>
            {digest.testDate ? (
              <p className="w-full text-xs text-muted-foreground">
                Digest scheduled for {digest.testDate} at {digest.time}. Clear the date to resume the daily schedule.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <IosInstallGuide open={guideOpen} onOpenChange={setGuideOpen} />
    </section>
  );
}
