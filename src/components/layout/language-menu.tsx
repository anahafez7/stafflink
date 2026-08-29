import { useI18n, type Language } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const languages = [
  { code: "en" as Language, name: "English (US)", nativeName: "English", short: "EN", flag: "🇺🇸" },
  { code: "ar" as Language, name: "العربية (Arabic)", nativeName: "العربية", short: "عربي", flag: "🇸🇦" },
] as const;

export function LanguageMenu({ className }: { className?: string }) {
  const { lang, setLanguage } = useI18n();

  const handleSelectLanguage = (code: Language) => {
    if (lang === code) return;
    setLanguage(code);
    toast.success(
      code === "ar" 
        ? "تم تحويل لغة الواجهة إلى العربية" 
        : "Language switched to English"
    );
  };

  return (
    <div className={cn("inline-flex items-center rounded-xl bg-muted/70 p-1 border border-border/60 text-xs font-semibold select-none shadow-xs", className)}>
      <button
        type="button"
        onClick={() => handleSelectLanguage("en")}
        aria-label="Switch to English"
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
          lang === "en"
            ? "bg-surface text-brand shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <span className="text-sm leading-none">🇺🇸</span>
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelectLanguage("ar")}
        aria-label="التحويل إلى العربية"
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-sans",
          lang === "ar"
            ? "bg-surface text-brand shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <span className="text-sm leading-none">🇸🇦</span>
        <span>عربي</span>
      </button>
    </div>
  );
}

