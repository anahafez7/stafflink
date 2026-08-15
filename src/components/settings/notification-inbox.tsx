import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { BellOff, CheckCheck, Inbox, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { channelMeta, useNotifications, type NotificationChannel } from "@/lib/notifications";
import { getEvents, subscribeEvents, summarize, trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const filters: { key: NotificationChannel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...channelMeta.map((c) => ({ key: c.key, label: c.label.split(" ")[0]! })),
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationInbox() {
  const router = useRouter();
  const { inbox, unreadCount, markRead, markAllRead, clearInbox } = useNotifications();
  const [filter, setFilter] = useState<NotificationChannel | "all">("all");
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
    return subscribeEvents(setEvents);
  }, []);

  const stats = useMemo(() => summarize(events), [events]);
  const items = useMemo(
    () => (filter === "all" ? inbox : inbox.filter((i) => i.channel === filter)),
    [inbox, filter],
  );

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Inbox className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Notification inbox</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="size-4" />
            <span>Mark all read</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={clearInbox} disabled={inbox.length === 0}>
            <Trash2 className="size-4" />
            <span className="sr-only">Clear inbox</span>
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Stat label="Permission" value={stats.permission ?? "unknown"} />
        <Stat label="Open-through rate" value={`${stats.openRate}%`} hint={`${stats.opened}/${stats.shown} opened`} />
        <Stat
          label="Deep-link success"
          value={`${stats.deepLinkSuccess}%`}
          hint={`${stats.deepLinks} targets resolved`}
        />
      </div>

      <ul className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
        {stats.perChannel.map((c) => (
          <li key={c.channel} className="rounded-md border border-border px-2 py-1 capitalize">
            {c.channel}: {c.opened}/{c.shown} opened ({c.rate}%)
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilter(f.key);
              trackEvent("notification_inbox_filter", { filter: f.key });
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-3 divide-y divide-border">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="flex w-full items-start gap-3 py-3 text-left"
              onClick={() => {
                markRead(item.id);
                trackEvent("notification_opened", { channel: item.channel, url: item.url, source: "inbox" });
                router.history.push(item.url);
              }}
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  item.read ? "bg-transparent ring-1 ring-border" : "bg-primary",
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={cn("truncate text-sm", item.read ? "font-normal" : "font-semibold")}>
                    {item.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(item.at)}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.body}</span>
              </span>
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <BellOff className="size-4" />
            No notifications in this view yet.
          </li>
        )}
      </ul>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold capitalize">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
