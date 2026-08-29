import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Plus, User, UserCog, CalendarDays } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { NotificationInbox } from "@/components/settings/notification-inbox";
import { ShortcutsCard } from "@/components/pwa/shortcuts-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { settingsGroups, settingsToggles } from "@/data/modules";
import { SmtpDialog } from "@/components/settings/smtp-dialog";
import { GenericDialog } from "@/components/settings/generic-dialog";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — StaffLink" },
      {
        name: "description",
        content: "Company setup, branches, job grades, leave types, payroll rules, integrations and audit logs.",
      },
      { property: "og:title", content: "Settings — StaffLink" },
      { property: "og:description", content: "Company setup, rules, integrations and audit logs." },
    ],
  }),
  component: SettingsPage,
});

import { useI18n } from "@/lib/i18n";

function SettingsPage() {
  const { t, lang } = useI18n();
  const [smtpOpen, setSmtpOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <PageHeader
        section={t("settings", "Settings")}
        title={lang === "ar" ? "إعدادات النظام العامة" : "System configuration"}
        description={
          lang === "ar"
            ? "القواعد المؤسسية والسياسات المطبقة عبر جميع الفروع ووحدات النظام."
            : "Tenant-wide rules applied across all branches and modules."
        }
        actions={
          <Button variant="secondary">
            <Plus className="size-4" />
            <span>{lang === "ar" ? "إضافة إعداد" : "Add configuration"}</span>
          </Button>
        }
      />

      <NotificationSettings />
      <NotificationInbox />
      <ShortcutsCard />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <section className="surface-card p-5 ltr:border-l-4 ltr:border-l-brand rtl:border-r-4 rtl:border-r-brand">
          <h2 className="text-sm font-semibold">{lang === "ar" ? "الخدمة الذاتية والملف الشخصي" : "Personal & Self Service"}</h2>
          <ul className="mt-3 divide-y divide-border">
            <li>
              <Link to="/profile" className="flex w-full items-center justify-between gap-3 py-2.5 text-left rtl:text-right transition-colors hover:text-brand">
                <div className="flex items-center gap-2.5">
                  <User className="size-4 text-brand shrink-0" />
                  <span className="min-w-0 truncate text-sm font-medium">{t("myProfile", "My Profile")}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  {lang === "ar" ? "البيانات الشخصية" : "Personal Details"}
                  <ChevronRight className="size-3.5 rtl:rotate-180" />
                </span>
              </Link>
            </li>
            <li>
              <Link to="/self-service" className="flex w-full items-center justify-between gap-3 py-2.5 text-left rtl:text-right transition-colors hover:text-brand">
                <div className="flex items-center gap-2.5">
                  <UserCog className="size-4 text-brand shrink-0" />
                  <span className="min-w-0 truncate text-sm font-medium">{t("selfService", "Self Service Portal")}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  {lang === "ar" ? "البصمات والطلبات" : "Check-in & Requests"}
                  <ChevronRight className="size-3.5 rtl:rotate-180" />
                </span>
              </Link>
            </li>
            <li>
              <Link to="/leaves" className="flex w-full items-center justify-between gap-3 py-2.5 text-left rtl:text-right transition-colors hover:text-brand">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="size-4 text-brand shrink-0" />
                  <span className="min-w-0 truncate text-sm font-medium">{t("leaves", "My Leaves")}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  {lang === "ar" ? "الأرصدة والسجل" : "Balances & History"}
                  <ChevronRight className="size-3.5 rtl:rotate-180" />
                </span>
              </Link>
            </li>
          </ul>
        </section>

        {settingsGroups.map((group) => {
          const groupTitleAr: Record<string, string> = {
            "Organization": "المؤسسة والهيكل",
            "Rules": "القواعد والسياسات",
            "Platform": "النظام والربط التقني",
          };

          const itemLabelsAr: Record<string, { label: string; value: string }> = {
            "Company Info": { label: "بيانات الشركة", value: "StaffLink FZ-LLC" },
            "Contact": { label: "البريد والتواصل", value: "contact@stafflink.io" },
            "Roles Settings": { label: "إعدادات الأدوار", value: "5 أدوار" },
            "Branches": { label: "الفروع والمواقع", value: "6 فروع نشطة" },
            "Departments": { label: "الأقسام والإدارات", value: "5 أقسام" },
            "Positions": { label: "المسميات الوظيفية", value: "48 مسمى" },
            "Job grades": { label: "الدرجات الوظيفية", value: "12 درجة" },
            "Leave types": { label: "أنواع الإجازات", value: "9 أنواع معتمدة" },
            "Attendance rules": { label: "قواعد الحضور والانصراف", value: "سماحية 10 دقائق" },
            "Payroll rules": { label: "قواعد مسير الرواتب", value: "شهرياً · يوم 28" },
            "Currency": { label: "العملة الأساسية", value: "ج.م (الأساس)" },
            "Languages": { label: "اللغات المدعومة", value: "العربية · الإنجليزية" },
            "SMTP Settings": { label: "إعدادات خادم البريد (SMTP)", value: "متصل" },
            "SMS Settings": { label: "بوابة الرسائل (SMS)", value: "متصل" },
            "WhatsApp": { label: "بوابة واتساب للرسائل", value: "غير متصل" },
            "API access": { label: "مفاتيح واجهة البرمجة (API)", value: "3 مفاتيح نشطة" },
            "Backups": { label: "النسخ الاحتياطي التلقائي", value: "يومياً · 02:00 ص" },
          };

          return (
            <section key={group.title} className="surface-card p-5 text-start">
              <h2 className="text-sm font-semibold">{lang === "ar" ? (groupTitleAr[group.title] || group.title) : group.title}</h2>
              <ul className="mt-3 divide-y divide-border">
                {group.items.map((item) => {
                  const localized = (lang === "ar" && itemLabelsAr[item.label]) ? itemLabelsAr[item.label] : item;
                  const label = localized?.label || item.label;
                  const value = localized?.value || item.value;
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-3 py-2.5 text-start transition-colors hover:text-primary"
                        onClick={() => {
                          if (item.label === "SMTP Settings") {
                            setSmtpOpen(true);
                          } else {
                            setActiveDialog(item.label);
                          }
                        }}
                      >
                        <span className="min-w-0 truncate text-sm">{label}</span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          {value}
                          <ChevronRight className="size-3.5 rtl:rotate-180" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="surface-card p-5 text-start">
        <h2 className="text-sm font-semibold">{lang === "ar" ? "السياسات الأمنية والتشغيلية" : "Policies"}</h2>
        <ul className="mt-3 divide-y divide-border">
          {settingsToggles.map((t) => {
            const toggleAr: Record<string, { label: string; hint: string }> = {
              "Two-factor authentication": { label: "المصادقة الثنائية (2FA)", hint: "إلزامية تسجيل الدخول بخطوتين لحسابات المسؤولين" },
              "Geofenced check-in": { label: "التحقق الجغرافي من الحضور", hint: "حظر تسجيل الحضور من خارج النطاق الجغرافي للمقر" },
              "Auto payroll lock": { label: "القفل التلقائي لمسير الرواتب", hint: "إغلاق فترة المسير قبل 24 ساعة من موعد الصرف" },
              "Document OCR": { label: "التعرف الضوئي على المستندات (OCR)", hint: "استخراج النصوص والبيانات تلقائياً من الملفات المرفوعة" },
              "Weekly digest": { label: "التقرير الأسبوعي للمدراء", hint: "إرسال ملخص أداء الحضور والمهام عبر البريد كل يوم إثنين" },
            };

            const localized = (lang === "ar" && toggleAr[t.label]) ? toggleAr[t.label] : t;
            const label = localized?.label || t.label;
            const hint = localized?.hint || t.hint;

            return (
              <li key={t.label} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">{hint}</p>
                </div>
                <Switch defaultChecked={t.on} aria-label={label} />
              </li>
            );
          })}
        </ul>
      </section>

      <SmtpDialog open={smtpOpen} onOpenChange={setSmtpOpen} />

      <GenericDialog 
        open={!!activeDialog} 
        onOpenChange={(o) => !o && setActiveDialog(null)}
        title={activeDialog || "Settings"}
        description={`Manage ${activeDialog?.toLowerCase() || "setting"} parameters for your organization.`}
        fields={[
          { label: `${activeDialog || "Setting"} Name` },
          { label: "Configuration Value" },
          { label: "Notes / Description" }
        ]}
      />
    </div>
  );
}
