import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth";
import { notificationLink } from "@/lib/deep-link";

export type NotificationChannel = "attendance" | "leaves" | "documents";

export type NotificationSettings = Record<NotificationChannel, boolean> & { quietHours: boolean };

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
  const [settings, setSettings] = useState<NotificationSettings>(defaults);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setSettings(raw ? { ...defaults, ...(JSON.parse(raw) as Partial<NotificationSettings>) } : defaults);
  }, [storageKey]);

  const setSetting = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey],
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const notify = useCallback(
    (channel: NotificationChannel, title: string, body: string, itemId?: string) => {
      if (!settings[channel]) return;
      if (settings.quietHours && isQuiet()) return;
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      const url = notificationLink(channel, itemId, user?.role);
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
        void router.navigate({ href: url });
      };
    },
    [settings, router, user?.role],
  );

  const value = useMemo<Ctx>(
    () => ({ settings, setSetting, permission, requestPermission, notify }),
    [settings, setSetting, permission, requestPermission, notify],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}