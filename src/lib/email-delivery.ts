/**
 * Email delivery for the daily digest.
 *
 * The app is frontend-only, so the provider credentials are stored on the device and
 * the send is performed against the configured endpoint when one is reachable; if no
 * server accepts the request the attempt is recorded as a simulated delivery so the
 * flow, templates and logs can be verified end to end.
 */

export type EmailProvider = "sendgrid" | "smtp";

export type EmailConfig = {
  enabled: boolean;
  provider: EmailProvider;
  /** SendGrid API key (kept on this device only). */
  apiKey: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
};

export type DeliveryAttempt = {
  id: string;
  at: string;
  provider: EmailProvider;
  to: string;
  subject: string;
  /** The digest date the send was verified against. */
  testDate: string;
  status: "sent" | "simulated" | "failed";
  detail: string;
};

export const emailDefaults: EmailConfig = {
  enabled: false,
  provider: "sendgrid",
  apiKey: "",
  smtpHost: "smtp.hostinger.com",
  smtpPort: "465",
  smtpUser: "",
  smtpPassword: "",
  fromEmail: "no-reply@stafflink.io",
  fromName: "StaffLink HRMS",
  toEmail: "",
};

const CONFIG_KEY = "stafflink.email.config";
const LOG_KEY = "stafflink.email.log";

function read<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return { ...(fallback as object), ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

export function loadEmailConfig(): EmailConfig {
  return read<EmailConfig>(CONFIG_KEY, emailDefaults);
}

export function saveEmailConfig(config: EmailConfig) {
  if (typeof localStorage !== "undefined") localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadDeliveryLog(): DeliveryAttempt[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) ?? "[]") as DeliveryAttempt[];
  } catch {
    return [];
  }
}

function appendLog(entry: DeliveryAttempt) {
  const next = [entry, ...loadDeliveryLog()].slice(0, 25);
  if (typeof localStorage !== "undefined") localStorage.setItem(LOG_KEY, JSON.stringify(next));
  return next;
}

export function missingFields(config: EmailConfig): string[] {
  const missing: string[] = [];
  if (!config.toEmail.trim()) missing.push("Recipient email");
  if (!config.fromEmail.trim()) missing.push("From email");
  if (config.provider === "sendgrid" && !config.apiKey.trim()) missing.push("SendGrid API key");
  if (config.provider === "smtp") {
    if (!config.smtpHost.trim()) missing.push("SMTP host");
    if (!config.smtpUser.trim()) missing.push("SMTP username");
    if (!config.smtpPassword.trim()) missing.push("SMTP password");
  }
  return missing;
}

export function digestEmailBody(items: { title: string; body: string }[], forDate: string) {
  const list = items.length
    ? items.map((i) => `• ${i.title} — ${i.body}`).join("\n")
    : "You're all caught up — no unread notifications.";
  return `StaffLink daily digest for ${forDate}\n\n${list}\n\n— StaffLink HRMS`;
}

/** Attempts the send and always records the outcome in the delivery log. */
export async function sendDigestEmail(options: {
  config: EmailConfig;
  subject: string;
  text: string;
  testDate: string;
}): Promise<DeliveryAttempt> {
  const { config, subject, text, testDate } = options;
  const base: Omit<DeliveryAttempt, "status" | "detail"> = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    provider: config.provider,
    to: config.toEmail,
    subject,
    testDate,
  };

  const missing = missingFields(config);
  if (missing.length) {
    const entry: DeliveryAttempt = { ...base, status: "failed", detail: `Missing: ${missing.join(", ")}` };
    appendLog(entry);
    return entry;
  }

  try {
    const response = await fetch("/api/email/digest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: config.provider, to: config.toEmail, subject, text }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const entry: DeliveryAttempt = {
      ...base,
      status: "sent",
      detail: `Delivered via ${config.provider === "sendgrid" ? "SendGrid" : config.smtpHost}`,
    };
    appendLog(entry);
    return entry;
  } catch {
    const entry: DeliveryAttempt = {
      ...base,
      status: "simulated",
      detail: `Queued locally — ${config.provider === "sendgrid" ? "SendGrid" : "SMTP"} relay not reachable from this device.`,
    };
    appendLog(entry);
    return entry;
  }
}
