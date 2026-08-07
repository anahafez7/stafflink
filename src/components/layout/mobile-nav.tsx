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
                {...(item.hash ? { hash: item.hash } : {})}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[11px] font-medium",
                  "transition-all duration-300 ease-out active:scale-95",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-5 top-0 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out",
                    active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-xl transition-all duration-300 ease-out",
                    active ? "-translate-y-0.5 bg-primary/10" : "translate-y-0 bg-transparent",
                  )}
                >
                  <item.icon className={cn("transition-all duration-300", active ? "size-[22px]" : "size-5")} />
                </span>
                <span className="transition-colors duration-300">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}