import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Fingerprint, Home, UserRound, Users, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useBadges } from "@/lib/badges";

const defaultItems = [
  { label: "Home", to: "/", icon: Home, badge: "none" },
  { label: "Attendance", to: "/self-service", icon: Fingerprint, badge: "none" },
  { label: "Leaves", to: "/leaves", icon: CalendarDays, badge: "leaves" },
  { label: "Profile", to: "/profile", icon: UserRound, badge: "documents" },
] as const;

const managerItems = [
  { label: "Home", to: "/", icon: Home, badge: "none" },
  { label: "My Team", to: "/hr", icon: Users, badge: "none" },
  { label: "Tasks", to: "/tasks", icon: Target, badge: "none" },
  { label: "Profile", to: "/profile", icon: UserRound, badge: "documents" },
] as const;

/** Mobile-only bottom navigation for the employee panel. */
export function MobileNav() {
  const { user } = useAuth();
  const { pendingLeaves, unreadDocuments } = useBadges();
  const { pathname, hash } = useRouterState({ select: (r) => r.location });

  if (!user || (user.role !== "employee" && user.role !== "manager")) return null;
  
  const items = user.role === "manager" ? managerItems : defaultItems;

  return (
    <nav
      aria-label="Employee navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          const count =
            item.badge === "leaves" ? pendingLeaves : item.badge === "documents" ? unreadDocuments : 0;
          return (
            <li key={item.label}>
              <Link
                to={item.to}
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
                    "relative grid size-8 place-items-center rounded-xl transition-all duration-300 ease-out",
                    active ? "-translate-y-0.5 bg-primary/10" : "translate-y-0 bg-transparent",
                  )}
                >
                  <item.icon className={cn("transition-all duration-300", active ? "size-[22px]" : "size-5")} />
                  {count > 0 ? (
                    <span className="absolute right-1 top-0 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
                      {count > 9 ? "9+" : count}
                    </span>
                  ) : null}
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