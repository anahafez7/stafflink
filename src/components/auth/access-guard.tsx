import { Link, useRouterState } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { moduleHome, pathToModule, roleLabels, useAuth } from "@/lib/auth";

/**
 * Protected-route wrapper. Protected content is NEVER rendered unless the
 * session is ready and the role explicitly permits the current module —
 * including on direct deep links and page refreshes.
 */
export function AccessGuard({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user, ready, can } = useAuth();
  const module = pathToModule(pathname);

  if (!ready) return <div className="min-h-[50vh]" />;
  if (user && can(module)) return <>{children}</>;

  return (
    <div className="surface-card mx-auto mt-10 max-w-md p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <Lock className="size-5" />
      </span>
      <h1 className="mt-4 text-lg font-semibold">Module restricted</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {user
          ? `Your role (${roleLabels[user.role]}) doesn’t have access to this module. Contact a system administrator to request permissions.`
          : "You need to sign in to view this module."}
      </p>
      {user ? (
        <Button asChild className="mt-6">
          <Link to={moduleHome(user.role)}>Go to my workspace</Link>
        </Button>
      ) : null}
    </div>
  );
}