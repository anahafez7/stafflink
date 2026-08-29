import { CalendarDays, Fingerprint, Share2, UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const shortcuts = [
  { 
    label: "Attendance", 
    labelAr: "سجل الحضور", 
    to: "/self-service", 
    icon: Fingerprint, 
    hint: "Punch in/out and history", 
    hintAr: "تسجيل البصمة والسجل اليومي" 
  },
  { 
    label: "Leaves", 
    labelAr: "الإجازات", 
    to: "/leaves", 
    icon: CalendarDays, 
    hint: "Requests and approvals", 
    hintAr: "تقديم الطلبات والموافقات" 
  },
  { 
    label: "Profile", 
    labelAr: "الملف الشخصي", 
    to: "/profile", 
    icon: UserRound, 
    hint: "Documents and security", 
    hintAr: "المستندات والأمان" 
  },
] as const;

/** Lets users pin individual StaffLink screens to their home screen. */
export function ShortcutsCard() {
  const { lang } = useI18n();

  const share = async (label: string, path: string) => {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `StaffLink · ${label}`, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard?.writeText(url);
    toast.info(lang === "ar" ? `تم نسخ رابط ${label} — افتحه ثم اختر "إضافة إلى الشاشة الرئيسية".` : `${label} link copied — open it, then use “Add to Home screen”.`);
  };

  return (
    <section className="surface-card p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <Share2 className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{lang === "ar" ? "اختصارات الشاشة الرئيسية" : "Home screen shortcuts"}</h2>
          <p className="text-xs text-muted-foreground">
            {lang === "ar" 
              ? "يمكنك تثبيت أي قسم للوصول السريع إليه كأيقونة تطبيق مستقلة على هاتفك." 
              : "Installed apps show these automatically. You can also pin any screen on its own."}
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {shortcuts.map((s) => {
          const displayLabel = lang === "ar" ? s.labelAr : s.label;
          const displayHint = lang === "ar" ? s.hintAr : s.hint;

          return (
            <li key={s.label} className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-2">
                <s.icon className="size-4 text-brand" />
                <p className="text-sm font-medium">{displayLabel}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{displayHint}</p>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" variant="secondary" className="flex-1">
                  <Link to={s.to}>{lang === "ar" ? "فتح" : "Open"}</Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => void share(displayLabel, s.to)}>
                  {lang === "ar" ? "تثبيت" : "Pin"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
