import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth";
import { notificationLink } from "@/lib/deep-link";
import { trackEvent } from "@/lib/analytics";

export type NotificationChannel = "attendance" | "leaves" | "documents";

export type NotificationSettings = Record<NotificationChannel, boolean> & { quietHours: boolean };

export type InboxItem = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  url: string;
  at: string;
  read: boolean;
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
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearInbox: () => void;
};

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
  const [settings, setSettings] = useState<NotificationSettings>(defaults);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
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
    setInbox(raw ? (JSON.parse(raw) as InboxItem[]) : []);
  }, [inboxKey]);

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
    (id: string) => setInbox((prev) => persistInbox(prev.map((i) => (i.id === id ? { ...i, read: true } : i)))),
    [persistInbox],
  );

  const markAllRead = useCallback(() => {
    setInbox((prev) => {
      const unread = prev.filter((i) => !i.read).length;
      trackEvent("notification_inbox_mark_all_read", { count: unread });
      return persistInbox(prev.map((i) => ({ ...i, read: true })));
    });
  }, [persistInbox]);

  const clearInbox = useCallback(() => setInbox(() => persistInbox([])), [persistInbox]);

  const notify = useCallback(
    (channel: NotificationChannel, title: string, body: string, itemId?: string) => {
      if (!settings[channel]) return;
      if (settings.quietHours && isQuiet()) return;
      const url = notificationLink(channel, itemId, user?.role);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setInbox((prev) =>
        persistInbox([{ id, channel, title, body, url, at: new Date().toISOString(), read: false }, ...prev]),
      );
      trackEvent("notification_shown", { channel, itemId: itemId ?? null, url });

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
    [settings, router, user?.role, persistInbox, markRead],
  );

  const unreadCount = useMemo(() => inbox.filter((i) => !i.read).length, [inbox]);

  const value = useMemo<Ctx>(
    () => ({
      settings,
      setSetting,
      permission,
      requestPermission,
      notify,
      inbox,
      unreadCount,
      markRead,
      markAllRead,
      clearInbox,
    }),
    [settings, setSetting, permission, requestPermission, notify, inbox, unreadCount, markRead, markAllRead, clearInbox],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
