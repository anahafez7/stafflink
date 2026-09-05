import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Mail, Send, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { useNotifications } from "@/lib/notifications";
import {
  digestEmailBody,
  emailDefaults,
  loadDeliveryLog,
  loadEmailConfig,
  missingFields,
  saveEmailConfig,
  sendDigestEmail,
  type DeliveryAttempt,
  type EmailConfig,
} from "@/lib/email-delivery";

const statusMeta: Record<DeliveryAttempt["status"], { icon: typeof CheckCircle2; tone: string; label: string }> = {
  sent: { icon: CheckCircle2, tone: "text-success", label: "Delivered" },
  simulated: { icon: Clock, tone: "text-warning", label: "Simulated" },
  failed: { icon: XCircle, tone: "text-destructive", label: "Failed" },
};

/** Email provider setup for the daily digest plus a test-delivery verification tool. */
export function EmailDigestSettings() {
  const { lang } = useI18n();
  const { digest, inbox } = useNotifications();
  const [config, setConfig] = useState<EmailConfig>(emailDefaults);
  const [log, setLog] = useState<DeliveryAttempt[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setConfig(loadEmailConfig());
    setLog(loadDeliveryLog());
  }, []);

  const update = (patch: Partial<EmailConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveEmailConfig(next);
      return next;
    });
  };

  const missing = useMemo(() => missingFields(config), [config]);
  const testDate = digest.testDate || new Date().toISOString().slice(0, 10);

  const verify = async () => {
    if (missing.length) {
      toast.error(`${lang === "ar" ? "أكمل الحقول" : "Complete"}: ${missing.join(", ")}`);
      return;
    }
    setSending(true);
    const unread = inbox.filter((i) => !i.read);
    const attempt = await sendDigestEmail({
      config,
      subject: `StaffLink daily digest · ${testDate}`,
      text: digestEmailBody(unread, testDate),
      testDate,
    });
    setLog(loadDeliveryLog());
    setSending(false);
    if (attempt.status === "sent") toast.success(`Test digest sent to ${config.toEmail}.`);
    else if (attempt.status === "simulated") toast.info("Test digest recorded — no mail relay reachable from the browser.");
    else toast.error(attempt.detail);
  };

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <Mail className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{lang === "ar" ? "إرسال الملخص اليومي بالبريد" : "Daily digest email"}</h2>
          <p className="text-xs text-muted-foreground">
            {lang === "ar"
              ? "أرسل ملخص الإشعارات غير المقروءة عبر SendGrid أو خادم SMTP."
              : "Deliver the unread notification summary through SendGrid or an SMTP server."}
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(v) => update({ enabled: v })}
          aria-label="Enable digest email"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{lang === "ar" ? "المزود" : "Provider"}</Label>
          <Select value={config.provider} onValueChange={(v) => update({ provider: v as EmailConfig["provider"] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sendgrid">SendGrid</SelectItem>
              <SelectItem value="smtp">SMTP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{lang === "ar" ? "إرسال إلى" : "Send digest to"}</Label>
          <Input
            type="email"
            value={config.toEmail}
            onChange={(e) => update({ toEmail: e.target.value })}
            placeholder="me@company.com"
          />
        </div>

        {config.provider === "sendgrid" ? (
          <div className="space-y-2 md:col-span-2">
            <Label>SendGrid API key</Label>
            <Input
              type="password"
              value={config.apiKey}
              onChange={(e) => update({ apiKey: e.target.value })}
              placeholder="SG.xxxxxxxx"
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "خادم SMTP" : "SMTP host"}</Label>
              <Input value={config.smtpHost} onChange={(e) => update({ smtpHost: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "المنفذ" : "Port"}</Label>
              <Input value={config.smtpPort} onChange={(e) => update({ smtpPort: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "اسم المستخدم" : "Username"}</Label>
              <Input value={config.smtpUser} onChange={(e) => update({ smtpUser: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "كلمة المرور" : "Password"}</Label>
              <Input
                type="password"
                value={config.smtpPassword}
                onChange={(e) => update({ smtpPassword: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>{lang === "ar" ? "بريد المرسل" : "From email"}</Label>
          <Input value={config.fromEmail} onChange={(e) => update({ fromEmail: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>{lang === "ar" ? "اسم المرسل" : "From name"}</Label>
          <Input value={config.fromName} onChange={(e) => update({ fromName: e.target.value })} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
        <p className="min-w-0 flex-1 text-xs text-muted-foreground">
          {lang === "ar" ? "تاريخ الاختبار" : "Verifying with test date"}:{" "}
          <span className="font-medium text-foreground">{testDate}</span>
          {digest.testDate ? "" : ` (${lang === "ar" ? "اليوم" : "today"})`} ·{" "}
          {lang === "ar" ? "وقت الإرسال" : "delivery time"} {digest.time}
        </p>
        <Button size="sm" onClick={verify} disabled={sending}>
          <Send className="size-4 me-1.5" />
          {sending ? (lang === "ar" ? "جارٍ الإرسال…" : "Sending…") : lang === "ar" ? "اختبار الإرسال" : "Verify delivery"}
        </Button>
      </div>

      {missing.length ? (
        <p className="mt-2 text-xs text-warning">
          {lang === "ar" ? "حقول ناقصة" : "Missing"}: {missing.join(", ")}
        </p>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {lang === "ar" ? "سجل الإرسال" : "Delivery log"}
        </p>
        {log.length ? (
          <ul className="mt-2 divide-y divide-border">
            {log.map((entry) => {
              const meta = statusMeta[entry.status];
              const Icon = meta.icon;
              return (
                <li key={entry.id} className="flex items-start gap-3 py-2.5">
                  <Icon className={`mt-0.5 size-4 shrink-0 ${meta.tone}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.subject}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {meta.label} · {entry.to} · {entry.provider === "sendgrid" ? "SendGrid" : "SMTP"} ·{" "}
                      {new Date(entry.at).toLocaleString()}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{entry.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            {lang === "ar" ? "لا توجد محاولات إرسال بعد." : "No delivery attempts yet."}
          </p>
        )}
      </div>
    </section>
  );
}
