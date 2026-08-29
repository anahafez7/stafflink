import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { moduleHome, pathToModule, roleLabels, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

/**
 * Protected-route wrapper. Protected content is NEVER rendered unless the
 * session is ready and the role explicitly permits the current module —
 * including on direct deep links and page refreshes.
 */
export function AccessGuard({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user, ready, can } = useAuth();
  const { t, lang } = useI18n();
  const module = pathToModule(pathname);
  const navigate = useNavigate();
  const allowed = Boolean(user) && can(module);
  // Landing on "/" should never look like a permission error — send the user
  // straight to the first module their role can open.
  const redirectHome = ready && Boolean(user) && !allowed && pathname === "/";

  useEffect(() => {
    if (redirectHome && user) navigate({ to: moduleHome(user.role), replace: true });
  }, [redirectHome, user, navigate]);

  if (!ready || redirectHome) return <div className="min-h-[50vh]" />;
  if (allowed) return <>{children}</>;

  const userRoleLabel = user ? t(user.role, roleLabels[user.role]) : "";

  return (
    <div className="surface-card mx-auto mt-10 max-w-md p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <Lock className="size-5" />
      </span>
      <h1 className="mt-4 text-lg font-semibold">
        {lang === "ar" ? "الوحدة محظورة الصلاحية" : "Module restricted"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {user
          ? (lang === "ar" 
              ? `دورك الوظيفي (${userRoleLabel}) ليس لديه صلاحية للوصول إلى هذه الوحدة. تواصل مع مدير النظام لطلب الصلاحيات.` 
              : `Your role (${userRoleLabel}) doesn’t have access to this module. Contact a system administrator to request permissions.`)
          : (lang === "ar" ? "يجب عليك تسجيل الدخول أولاً لعرض هذه الوحدة." : "You need to sign in to view this module.")}
      </p>
      {user ? (
        <Button asChild className="mt-6">
          <Link to={moduleHome(user.role)}>
            {lang === "ar" ? "الانتقال إلى مساحة العمل" : "Go to my workspace"}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}