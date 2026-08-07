import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Fingerprint, Home, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const items = [
  { label: "Home", to: "/self-service", hash: "", icon: Home },
  { label: "Attendance", to: "/self-service", hash: "attendance", icon: Fingerprint },
  { label: "Leaves", to: "/self-service", hash: "leaves", icon: CalendarDays },
  { label: "Profile", to: "/self-service", hash: "profile", icon: UserRound },
] as const;

/** Mobile-only bottom navigation for the employee panel. */
export function MobileNav() {
  const { user } = useAuth();
  const { pathname, hash } = useRouterState({ select: (r) => r.location });

  if (!user || user.role !== "employee") return null;

  return (
    <nav
      aria-label="Employee navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = pathname.startsWith("/self-service") && (hash ?? "") === item.hash;
          return (
            <li key={item.label}>
              <Link
                to={item.to}
                hash={item.hash || undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}