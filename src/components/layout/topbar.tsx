import { Bell, Globe, MessageSquare, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="shrink-0" aria-label="Toggle navigation" />

      <div className="relative min-w-0 flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search employees, requests, documents…"
          aria-label="Global search"
          className="h-10 rounded-xl pl-9"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Language" className="hidden sm:inline-flex min-h-11 min-w-11">
          <Globe className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Messages" className="hidden sm:inline-flex min-h-11 min-w-11">
          <MessageSquare className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative min-h-11 min-w-11">
          <Bell className="size-4" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          className="min-h-11 min-w-11"
          onClick={() => setDark((v) => !v)}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <div className="ml-1 flex items-center gap-2 rounded-xl border border-border px-2 py-1.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-brand text-brand-foreground text-[11px]">HR</AvatarFallback>
          </Avatar>
          <span className="hidden leading-tight md:block">
            <span className="block text-xs font-semibold">Hafez Rahim</span>
            <span className="block text-[11px] text-muted-foreground">HR Director</span>
          </span>
        </div>
      </div>
    </header>
  );
}