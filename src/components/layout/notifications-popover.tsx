import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck, Trash2, CalendarDays, FileText, Wallet, Target, Sparkles, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, type InboxItem } from "@/lib/notifications";
import { toast } from "sonner";

const sampleNotifications: InboxItem[] = [
  {
    id: "notif-1",
    channel: "leaves",
    title: "Annual Leave Request Approved",
    body: "Omar Saleh approved your request for 18–22 Aug 2026.",
    url: "/leaves",
    at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    read: false,
  },
  {
    id: "notif-2",
    channel: "documents",
    title: "Document Expiry Notice",
    body: "Passport scan for Hassan Rageh is expiring in 15 days.",
    url: "/documents",
    at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
  },
  {
    id: "notif-3",
    channel: "attendance",
    title: "July Payroll Finalized",
    body: "July payslips are available for download and review.",
    url: "/payroll",
    at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
];

export function NotificationsPopover() {
  const { inbox, unreadCount, markRead, markAllRead, clearInbox } = useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Display user notifications or fall back to high-quality HR mock notifications
  const items = inbox.length > 0 ? inbox : sampleNotifications;
  const currentUnread = inbox.length > 0 ? unreadCount : items.filter((i) => !i.read).length;

  const displayItems = filter === "unread" ? items.filter((i) => !i.read) : items;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "leaves":
        return <CalendarDays className="size-4 text-emerald-600" />;
      case "documents":
        return <FileText className="size-4 text-amber-600" />;
      case "attendance":
        return <Wallet className="size-4 text-blue-600" />;
      default:
        return <Sparkles className="size-4 text-brand" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative min-h-10 min-w-10 rounded-xl hover:bg-muted/80 transition-colors"
        >
          <Bell className="size-[18px] text-muted-foreground hover:text-foreground transition-colors" />
          {currentUnread > 0 && (
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 rounded-2xl p-0 shadow-2xl border-border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card p-3.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {currentUnread > 0 && (
              <Badge variant="destructive" className="text-[10px] font-semibold px-1.5 py-0 h-4">
                {currentUnread} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => {
                markAllRead();
                toast.success("All notifications marked as read");
              }}
              title="Mark all as read"
            >
              <CheckCheck className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={() => {
                clearInbox();
                toast.info("Notification inbox cleared");
              }}
              title="Clear all"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 bg-secondary/30">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === "unread"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({currentUnread})
          </button>
        </div>

        {/* Items List */}
        <div className="max-h-[340px] overflow-y-auto divide-y divide-border/60">
          {displayItems.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <Bell className="size-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs font-medium text-foreground">No notifications</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                You are all caught up with your updates!
              </p>
            </div>
          ) : (
            displayItems.map((item) => (
              <Link
                key={item.id}
                to={item.url || "/"}
                onClick={() => markRead(item.id)}
                className={`flex items-start gap-3 p-3 text-left transition-colors hover:bg-muted/40 ${
                  !item.read ? "bg-brand/5 font-medium" : ""
                }`}
              >
                <div className="size-8 rounded-xl bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  {getChannelIcon(item.channel)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatTime(item.at)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.body}
                  </p>
                </div>
                {!item.read && (
                  <span className="size-2 rounded-full bg-brand shrink-0 mt-1.5" />
                )}
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
