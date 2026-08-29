import { ChevronDown, LogOut, Moon, Search, Settings, Sun, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { roleLabels, useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageMenu } from "@/components/layout/language-menu";
import { MessagesPopover } from "@/components/layout/messages-popover";
import { NotificationsPopover } from "@/components/layout/notifications-popover";

export function Topbar() {
  const [dark, setDark] = useState(false);
  const { user, signOut } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="shrink-0" aria-label="Toggle navigation" />

      <div
        className={`relative min-w-0 flex-1 ${user?.role === "employee" ? "hidden md:block" : ""}`}
      >
        <Search className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder", "Search employees, requests, documents…")}
          aria-label="Global search"
          className="h-10 rounded-xl ltr:pl-9 rtl:pr-9"
        />
      </div>

      <div className="ms-auto flex shrink-0 items-center gap-2">
        <LanguageMenu />
        <MessagesPopover />
        <NotificationsPopover />
        <Button
          variant="ghost"
          size="icon"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          className="min-h-10 min-w-10 rounded-xl"
          onClick={() => setDark((v) => !v)}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ms-1 flex items-center gap-2 rounded-xl border border-border bg-surface/60 hover:bg-surface px-2.5 py-1.5 transition-all hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer text-start"
            >
              <Avatar className="size-7 ring-1 ring-border">
                <AvatarImage src="/favicon.png" className="bg-white p-0.5 object-contain" />
                <AvatarFallback className="bg-brand text-brand-foreground text-[11px] font-bold">
                  {user?.initials ?? "SL"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden leading-tight md:block">
                <span className="block text-xs font-semibold truncate max-w-[120px]">{user?.name ?? t("guest", "Guest")}</span>
                <span className="block text-[11px] text-muted-foreground truncate max-w-[120px]">
                  {user ? t(user.role, roleLabels[user.role]) : ""}
                </span>
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground ms-0.5 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-border">
            <DropdownMenuLabel className="p-2">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-9 ring-1 ring-border">
                  <AvatarImage src="/favicon.png" className="bg-white p-0.5 object-contain" />
                  <AvatarFallback className="bg-brand text-brand-foreground text-xs font-bold">
                    {user?.initials ?? "SL"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-foreground">{user?.name ?? "Guest User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email ?? "contact@stafflink.io"}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors">
                <UserIcon className="size-4 text-muted-foreground" />
                <span>{lang === "ar" ? "الملف الشخصي" : "My Profile"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors">
                <Settings className="size-4 text-muted-foreground" />
                <span>{lang === "ar" ? "إعدادات النظام" : "System Settings"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={signOut}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors"
            >
              <LogOut className="size-4" />
              <span>{lang === "ar" ? "تسجيل الخروج" : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}