/**
 * Lightweight frontend analytics buffer.
 * Events are kept in localStorage so Settings can show usage stats without a backend.
 */
export type AnalyticsEvent = {
  id: string;
  name: string;
  at: string;
  props: Record<string, string | number | boolean | null>;
};

const KEY = "stafflink.analytics.events";
const LIMIT = 300;

type Listener = (events: AnalyticsEvent[]) => void;
const listeners = new Set<Listener>();

export function getEvents(): AnalyticsEvent[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as AnalyticsEvent[];
  } catch {
    return [];
  }
}

export function trackEvent(name: string, props: AnalyticsEvent["props"] = {}) {
  if (typeof localStorage === "undefined") return;
  const event: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    at: new Date().toISOString(),
    props,
  };
  const next = [event, ...getEvents()].slice(0, LIMIT);
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l(next));
}

export function subscribeEvents(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function clearEvents() {
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l([]));
}

/** Aggregates the notification funnel: permission state, open-through and deep-link success. */
export function summarize(events: AnalyticsEvent[]) {
  const byName = (n: string) => events.filter((e) => e.name === n);
  const shown = byName("notification_shown");
  const opened = byName("notification_opened");
  const deep = byName("deep_link_target");
  const deepOk = deep.filter((e) => e.props['success'] === true);
  const permission = byName("notification_permission")[0]?.props['state'] ?? null;

  const perChannel = ["attendance", "leaves", "documents"].map((channel) => {
    const s = shown.filter((e) => e.props['channel'] === channel).length;
    const o = opened.filter((e) => e.props['channel'] === channel).length;
    return { channel, shown: s, opened: o, rate: s ? Math.round((o / s) * 100) : 0 };
  });

  return {
    permission: permission as string | null,
    shown: shown.length,
    opened: opened.length,
    openRate: shown.length ? Math.round((opened.length / shown.length) * 100) : 0,
    deepLinks: deep.length,
    deepLinkSuccess: deep.length ? Math.round((deepOk.length / deep.length) * 100) : 0,
    perChannel,
  };
}
