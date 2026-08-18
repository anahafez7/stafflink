import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth";
import { notificationLink } from "@/lib/deep-link";
import { trackEvent } from "@/lib/analytics";

export type NotificationChannel = "attendance" | "leaves" | "documents";

export type NotificationSettings = Record<NotificationChannel, boolean> & { quietHours: boolean };

export type DigestSettings = { enabled: boolean; time: string; lastSentAt: string | null };

export type InboxItem = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  url: string;
  at: string;
  read: boolean;
  archived?: boolean;
};

export const channelMeta: { key: NotificationChannel; label: string; hint: string }[] = [
  { key: "attendance", label: "Attendance punches", hint: "Check-in and check-out confirmations" },
  { key: "leaves", label: "Leave approvals", hint: "Requests approved, rejected or awaiting you" },
  { key: "documents", label: "Document expiry alerts", hint: "Contracts and IDs nearing expiry" },
];

const defaults: NotificationSettings = {
  attendance: true,
  leaves: true,
  documents: true,
  quietHours: false,
};

type Ctx = {
  settings: NotificationSettings;
  setSetting: (key: keyof NotificationSettings, value: boolean) => void;
  permission: NotificationPermission | "unsupported";
  requestPermission: () => Promise<void>;
  notify: (channel: NotificationChannel, title: string, body: string, itemId?: string) => void;
  inbox: InboxItem[];
  archived: InboxItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  setArchived: (id: string, archived: boolean) => void;
  markAllRead: () => void;
  clearInbox: () => void;
  digest: DigestSettings;
  setDigest: (next: Partial<DigestSettings>) => void;
  sendDigestNow: () => void;
};

const digestDefaults: DigestSettings = { enabled: false, time: "08:00", lastSentAt: null };

const NotificationContext = createContext<Ctx | null>(null);

function isQuiet() {
  const h = new Date().getHours();
  return h >= 22 || h < 7;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const storageKey = `stafflink.notifications.${user?.email ?? "guest"}`;
  const inboxKey = `stafflink.inbox.${user?.email ?? "guest"}`;
  const digestKey = `stafflink.digest.${user?.email ?? "guest"}`;
  const [settings, setSettings] = useState<NotificationSettings>(defaults);
  const [allItems, setAllItems] = useState<InboxItem[]>([]);
  const [digest, setDigestState] = useState<DigestSettings>(digestDefaults);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    const state = typeof Notification === "undefined" ? "unsupported" : Notification.permission;
    setPermission(state);
    trackEvent("notification_permission", { state, source: "load" });
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setSettings(raw ? { ...defaults, ...(JSON.parse(raw) as Partial<NotificationSettings>) } : defaults);
  }, [storageKey]);

  useEffect(() => {
    const raw = localStorage.getItem(inboxKey);
    setAllItems(raw ? (JSON.parse(raw) as InboxItem[]) : []);
  }, [inboxKey]);

  useEffect(() => {
    const raw = localStorage.getItem(digestKey);
    setDigestState(raw ? { ...digestDefaults, ...(JSON.parse(raw) as Partial<DigestSettings>) } : digestDefaults);
  }, [digestKey]);

  const persistInbox = useCallback(
    (next: InboxItem[]) => {
      localStorage.setItem(inboxKey, JSON.stringify(next.slice(0, 100)));
      return next;
    },
    [inboxKey],
  );

  const setSetting = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
      trackEvent("notification_setting_changed", { key, value });
    },
    [storageKey],
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    trackEvent("notification_permission", { state: result, source: "request" });
  }, []);

  const markRead = useCallback(
    (id: string) => setAllItems((prev) => persistInbox(prev.map((i) => (i.id === id ? { ...i, read: true } : i)))),
    [persistInbox],
  );

  const markUnread = useCallback(
    (id: string) => setAllItems((prev) => persistInbox(prev.map((i) => (i.id === id ? { ...i, read: false } : i)))),
    [persistInbox],
  );

  const setArchived = useCallback(
    (id: string, archived: boolean) => {
      trackEvent("notification_archived", { id, archived });
      setAllItems((prev) => persistInbox(prev.map((i) => (i.id === id ? { ...i, archived } : i))));
    },
    [persistInbox],
  );

  const markAllRead = useCallback(() => {
    setAllItems((prev) => {
      const unread = prev.filter((i) => !i.read && !i.archived).length;
      trackEvent("notification_inbox_mark_all_read", { count: unread });
      return persistInbox(prev.map((i) => (i.archived ? i : { ...i, read: true })));
    });
  }, [persistInbox]);

  const clearInbox = useCallback(() => setAllItems(() => persistInbox([])), [persistInbox]);

  const setDigest = useCallback(
    (next: Partial<DigestSettings>) => {
      setDigestState((prev) => {
        const merged = { ...prev, ...next };
        localStorage.setItem(digestKey, JSON.stringify(merged));
        return merged;
      });
      trackEvent("notification_digest_changed", next as Record<string, unknown>);
    },
    [digestKey],
  );

  const notify = useCallback(
    (channel: NotificationChannel, title: string, body: string, itemId?: string) => {
      if (!settings[channel]) return;
      if (settings.quietHours && isQuiet()) return;
      const url = notificationLink(channel, itemId, user?.role);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setAllItems((prev) =>
        persistInbox([{ id, channel, title, body, url, at: new Date().toISOString(), read: false }, ...prev]),
      );
      trackEvent("notification_shown", { channel, itemId: itemId ?? null, url });

      if (digest.enabled) return;
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      const n = new Notification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: channel,
        data: { url },
      });
      n.onclick = () => {
        window.focus();
        n.close();
        trackEvent("notification_opened", { channel, itemId: itemId ?? null, url, source: "system" });
        markRead(id);
        router.history.push(url);
      };
    },
    [settings, router, user?.role, persistInbox, markRead, digest.enabled],
  );

  const inbox = useMemo(() => allItems.filter((i) => !i.archived), [allItems]);
  const archived = useMemo(() => allItems.filter((i) => i.archived), [allItems]);
  const unreadCount = useMemo(() => inbox.filter((i) => !i.read).length, [inbox]);

  const sendDigestNow = useCallback(() => {
    const unread = allItems.filter((i) => !i.read && !i.archived);
    trackEvent("notification_digest_sent", { count: unread.length });
    setDigest({ lastSentAt: new Date().toISOString() });
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const n = new Notification("StaffLink daily digest", {
      body: unread.length
        ? `${unread.length} unread notification${unread.length === 1 ? "" : "s"} waiting.`
        : "You're all caught up.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "digest",
    });
    n.onclick = () => {
      window.focus();
      n.close();
      router.history.push("/settings");
    };
  }, [allItems, setDigest, router]);

  // Fire the digest once per day when the chosen time has passed.
  useEffect(() => {
    if (!digest.enabled) return;
    const check = () => {
      const now = new Date();
      const [h, m] = digest.time.split(":").map(Number);
      const due = new Date(now);
      due.setHours(h ?? 8, m ?? 0, 0, 0);
      if (now < due) return;
      const last = digest.lastSentAt ? new Date(digest.lastSentAt) : null;
      if (last && last >= due) return;
      sendDigestNow();
    };
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, [digest.enabled, digest.time, digest.lastSentAt, sendDigestNow]);

  const value = useMemo<Ctx>(
    () => ({
      settings,
      setSetting,
      permission,
      requestPermission,
      notify,
      inbox,
      archived,
      unreadCount,
      markRead,
      markUnread,
      setArchived,
      markAllRead,
      clearInbox,
      digest,
      setDigest,
      sendDigestNow,
    }),
    [
      settings,
      setSetting,
      permission,
      requestPermission,
      notify,
      inbox,
      archived,
      unreadCount,
      markRead,
      markUnread,
      setArchived,
      markAllRead,
      clearInbox,
      digest,
      setDigest,
      sendDigestNow,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
