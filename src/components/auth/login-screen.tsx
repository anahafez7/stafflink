import { useState } from "react";
import { LogIn, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoAccounts, roleLabels, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageMenu } from "@/components/layout/language-menu";

export function LoginScreen() {
  const { signIn } = useAuth();
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("admin@stafflink.io");
  const [password, setPassword] = useState("stafflink");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signIn(email, password);
    if (!result.ok) setError(result.error ?? (lang === "ar" ? "فشل تسجيل الدخول." : "Sign in failed."));
  };

  const selfService = demoAccounts.find((a) => a.role === "employee");

  const signInAsEmployee = () => {
    if (!selfService) return;
    setEmail(selfService.email);
    setPassword(selfService.password);
    const result = signIn(selfService.email, selfService.password);
    if (!result.ok) setError(result.error ?? "Sign in failed.");
  };

  return (
    <div className="grid min-h-dvh w-full lg:grid-cols-[1.45fr_1fr] xl:grid-cols-[1.65fr_1fr]">
      <div className="relative hidden h-full w-full overflow-hidden bg-slate-950 lg:flex lg:items-center lg:justify-center">
        {/* Full display crisp hero banner without transparency */}
        <img
          src="/hero-banner.jpg"
          alt="StaffLink HRMS"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-col items-center justify-center bg-background p-6 relative">
        <div className="absolute top-6 end-6">
          <LanguageMenu />
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-3">
            <img
              src="/logo.png"
              alt="StaffLink logo"
              className="h-20 w-auto object-contain ltr:object-left rtl:object-right sm:h-24"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              {lang === "ar" ? "تسجيل الدخول إلى StaffLink" : "Sign in to StaffLink"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "ar" 
                ? "اختر أحد الحسابات التجريبية بالأسفل لاختبار الصلاحيات المختلفة." 
                : "Use a demo account below to explore role-based access."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4 text-start">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">{lang === "ar" ? "البريد الإلكتروني للعمل" : "Work email"}</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                maxLength={120}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">{lang === "ar" ? "كلمة المرور" : "Password"}</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                maxLength={72}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full">
              <LogIn className="size-4 me-2" />
              <span>{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</span>
            </Button>
          </form>

          <div className="surface-card space-y-2 p-4 text-start">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5" /> 
              {lang === "ar" ? "حسابات تجريبية · كلمة المرور «stafflink»" : "Demo accounts · password “stafflink”"}
            </p>
            <div className="grid gap-1.5">
              {demoAccounts.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(a.password);
                    setError("");
                  }}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-start text-xs transition-colors hover:bg-accent cursor-pointer"
                >
                  <span className="font-medium">{a.email}</span>
                  <span className="text-muted-foreground">{t(a.role, roleLabels[a.role])}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}