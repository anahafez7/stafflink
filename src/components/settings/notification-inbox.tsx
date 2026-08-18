import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Archive,
  ArchiveRestore,
  BellOff,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  MailOpen,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { channelMeta, useNotifications, type NotificationChannel } from "@/lib/notifications";
import { getEvents, subscribeEvents, summarize, trackEvent, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const filters: { key: NotificationChannel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...channelMeta.map((c) => ({ key: c.key, label: c.label.split(" ")[0]! })),
];

const PAGE_SIZE = 6;

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
  const { inbox, archived, unreadCount, markRead, markUnread, setArchived, markAllRead, clearInbox } =
    useNotifications();
  const [filter, setFilter] = useState<NotificationChannel | "all">("all");
  const [view, setView] = useState<"inbox" | "archived">("inbox");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
    return subscribeEvents(setEvents);
  }, []);

  const stats = useMemo(() => summarize(events), [events]);

  const source = view === "inbox" ? inbox : archived;
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((i) => {
      if (filter !== "all" && i.channel !== filter) return false;
      if (!q) return true;
      return (
        i.title.toLowerCase().includes(q) ||
        i.body.toLowerCase().includes(q) ||
        i.channel.includes(q) ||
        i.url.toLowerCase().includes(q)
      );
    });
  }, [source, filter, query]);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = items.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => setPage(0), [filter, query, view]);

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
          <Button size="sm" variant="ghost" onClick={clearInbox} disabled={inbox.length + archived.length === 0}>
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

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notifications by keyword or target…"
          className="pl-9"
          aria-label="Search notifications"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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
        <button
          type="button"
          onClick={() => setView((v) => (v === "inbox" ? "archived" : "inbox"))}
          className="ml-auto rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {view === "inbox" ? `Archived (${archived.length})` : "Back to inbox"}
        </button>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {visible.map((item) => (
          <li key={item.id} className="flex items-start gap-2 py-3">
            <button
              type="button"
              className="flex min-w-0 flex-1 items-start gap-3 text-left"
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
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => (item.read ? markUnread(item.id) : markRead(item.id))}
                aria-label={item.read ? "Mark as unread" : "Mark as read"}
                title={item.read ? "Mark as unread" : "Mark as read"}
              >
                {item.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => setArchived(item.id, !item.archived)}
                aria-label={item.archived ? "Restore notification" : "Archive notification"}
                title={item.archived ? "Restore" : "Archive"}
              >
                {item.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
              </Button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <BellOff className="size-4" />
            {query ? "No notifications match that search." : "No notifications in this view yet."}
          </li>
        )}
      </ul>

      {items.length > PAGE_SIZE && (
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {current * PAGE_SIZE + 1}–{Math.min(items.length, (current + 1) * PAGE_SIZE)} of {items.length}
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={current === 0} onClick={() => setPage(current - 1)}>
              <ChevronLeft className="size-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span>
              Page {current + 1} / {pageCount}
            </span>
            <Button size="sm" variant="outline" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>
              <ChevronRight className="size-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
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