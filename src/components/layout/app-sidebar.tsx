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

const workspace = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "HR", url: "/hr", icon: Users },
  { title: "Attendance", url: "/attendance", icon: Fingerprint },
  { title: "Payroll", url: "/payroll", icon: Wallet },
  { title: "Recruitment", url: "/recruitment", icon: UserSearch },
  { title: "Performance", url: "/performance", icon: Target },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Self Service", url: "/self-service", icon: UserCog },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
] as const;

const administration = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Users & Permissions", url: "/users", icon: ShieldCheck },
  { title: "Locations", url: "/locations", icon: MapPin },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            SL
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold text-sidebar-foreground">
              StaffLink
            </span>
            <span className="block truncate text-[11px] text-sidebar-foreground/60">
              Enterprise HRMS
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {[
          { label: "Workspace", items: workspace },
          { label: "Administration", items: administration },
        ].map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
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
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <p className="text-xs font-medium text-sidebar-foreground">Payroll · June</p>
          <p className="mt-1 text-[11px] text-sidebar-foreground/60">
            Closing in 3 days · 1,244 employees
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}