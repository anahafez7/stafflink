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

const workspace = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, module: "dashboard" },
  { title: "HR", url: "/hr", icon: Users, module: "hr" },
  { title: "Attendance", url: "/attendance", icon: Fingerprint, module: "attendance" },
  { title: "Tasks", url: "/tasks", icon: Target, module: "tasks" },
  { title: "Payroll", url: "/payroll", icon: Wallet, module: "payroll" },
  { title: "Recruitment", url: "/recruitment", icon: UserSearch, module: "recruitment" },
  { title: "Performance", url: "/performance", icon: Target, module: "performance" },
  { title: "Documents", url: "/documents", icon: FolderOpen, module: "documents" },
  { title: "Attendance", url: "/self-service", icon: UserCog, module: "self-service" },
  { title: "Leaves", url: "/leaves", icon: CalendarDays, module: "self-service" },
  { title: "My Profile", url: "/profile", icon: User, module: "self-service" },
  { title: "Onboarding", url: "/onboarding", icon: UserPlus, module: "onboarding" },
  { title: "Expenses", url: "/expenses", icon: Receipt, module: "expenses" },
  { title: "Assets", url: "/assets", icon: Laptop, module: "assets" },
  { title: "Disciplinary", url: "/disciplinary", icon: AlertOctagon, module: "disciplinary" },
  { title: "Training", url: "/training", icon: GraduationCap, module: "training" },
  { title: "Engagement", url: "/engagement", icon: HeartHandshake, module: "engagement" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, module: "analytics" },
] as const;

const administration = [
  { title: "Settings", url: "/settings", icon: Settings, module: "settings" },
  { title: "Configuration", url: "/configuration", icon: Settings2, module: "settings" },
  { title: "Users & Permissions", url: "/users", icon: ShieldCheck, module: "users" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { can, user } = useAuth();
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <img src="/logo.png" alt="StaffLink" className="w-full h-auto object-contain object-left bg-white px-2 py-1 rounded-md" />
            <span className="mt-1 block truncate text-[11px] text-sidebar-foreground/60">
              Enterprise HRMS
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {[
          { label: "Workspace", items: workspace.filter((i) => can(i.module as ModuleKey)) },
          { label: "Administration", items: administration.filter((i) => can(i.module as ModuleKey)) },
        ]
          .filter((group) => group.items.length > 0)
          .map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title === "HR" && user?.role === "manager" ? "My Team" : item.title}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title === "HR" && user?.role === "manager" ? "My Team" : item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3 text-center">
          <p className="text-xs text-sidebar-foreground/70 mb-1">Developer</p>
          <a href="https://odooteams.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-sidebar-foreground hover:underline">
            Mr. Hafez Rahim
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}