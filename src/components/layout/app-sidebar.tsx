import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Fingerprint,
  Wallet,
  UserSearch,
  Target,
  FolderOpen,
  UserCog,
  BarChart3,
  Settings,
  ShieldCheck,
  MapPin,
  Settings2,
  User,
  CalendarDays,
  UserPlus,
  Receipt,
  Laptop,
  AlertOctagon,
  GraduationCap,
  HeartHandshake
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, type ModuleKey } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const workspace = [
  { key: "dashboard", defaultTitle: "Dashboard", url: "/", icon: LayoutDashboard, module: "dashboard" },
  { key: "hr", defaultTitle: "HR", url: "/hr", icon: Users, module: "hr" },
  { key: "attendance", defaultTitle: "Attendance", url: "/attendance", icon: Fingerprint, module: "attendance" },
  { key: "tasks", defaultTitle: "Tasks", url: "/tasks", icon: Target, module: "tasks" },
  { key: "payroll", defaultTitle: "Payroll", url: "/payroll", icon: Wallet, module: "payroll" },
  { key: "recruitment", defaultTitle: "Recruitment", url: "/recruitment", icon: UserSearch, module: "recruitment" },
  { key: "performance", defaultTitle: "Performance", url: "/performance", icon: Target, module: "performance" },
  { key: "documents", defaultTitle: "Documents", url: "/documents", icon: FolderOpen, module: "documents" },
  { key: "selfService", defaultTitle: "Self Service", url: "/self-service", icon: UserCog, module: "self-service" },
  { key: "leaves", defaultTitle: "Leaves", url: "/leaves", icon: CalendarDays, module: "self-service" },
  { key: "myProfile", defaultTitle: "My Profile", url: "/profile", icon: User, module: "self-service" },
  { key: "onboarding", defaultTitle: "Onboarding", url: "/onboarding", icon: UserPlus, module: "onboarding" },
  { key: "expenses", defaultTitle: "Expenses", url: "/expenses", icon: Receipt, module: "expenses" },
  { key: "assets", defaultTitle: "Assets", url: "/assets", icon: Laptop, module: "assets" },
  { key: "disciplinary", defaultTitle: "Disciplinary", url: "/disciplinary", icon: AlertOctagon, module: "disciplinary" },
  { key: "training", defaultTitle: "Training", url: "/training", icon: GraduationCap, module: "training" },
  { key: "engagement", defaultTitle: "Engagement", url: "/engagement", icon: HeartHandshake, module: "engagement" },
  { key: "analytics", defaultTitle: "Analytics", url: "/analytics", icon: BarChart3, module: "analytics" },
] as const;

const administration = [
  { key: "settings", defaultTitle: "Settings", url: "/settings", icon: Settings, module: "settings" },
  { key: "configuration", defaultTitle: "Configuration", url: "/configuration", icon: Settings2, module: "settings" },
  { key: "usersAndPermissions", defaultTitle: "Users & Permissions", url: "/users", icon: ShieldCheck, module: "users" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { can, user } = useAuth();
  const { t, dir } = useI18n();
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const getItemLabel = (item: { key: string; defaultTitle: string }) => {
    if (item.key === "hr" && user?.role === "manager") {
      return t("myTeam", "My Team");
    }
    return t(item.key, item.defaultTitle);
  };

  return (
    <Sidebar side={dir === "rtl" ? "right" : "left"} collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="p-3.5 pb-2">
        <Link to="/" className="flex flex-col items-center w-full group/logo transition-all">
          <div className="w-full bg-white rounded-xl p-2.5 shadow-sm border border-border/30 flex items-center justify-center group-data-[collapsible=icon]:p-1.5 transition-all">
            <img
              src="/logo.png"
              alt="StaffLink"
              className="w-full h-auto max-h-[68px] object-contain group-data-[collapsible=icon]:max-h-8"
            />
          </div>
          <span className="mt-2 block truncate text-[12px] font-semibold text-sidebar-foreground/80 tracking-wide group-data-[collapsible=icon]:hidden">
            Enterprise HRMS
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {[
          { 
            label: t("workspace", "Workspace"), 
            items: workspace.filter((i) => {
              if (user?.role === "admin" && ["/self-service", "/leaves", "/profile"].includes(i.url)) {
                return false;
              }
              return can(i.module as ModuleKey);
            }) 
          },
          { 
            label: t("administration", "Administration"), 
            items: administration.filter((i) => can(i.module as ModuleKey)) 
          },
        ]
          .filter((group) => group.items.length > 0)
          .map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const label = getItemLabel(item);
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={label}>
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate">{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3 text-center">
          <p className="text-xs text-sidebar-foreground/70 mb-1">{t("developer", "Developer")}</p>
          <a href="https://odooteams.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-sidebar-foreground hover:underline">
            Mr. Hafez Rahim
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}