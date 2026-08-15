import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { fetchBadgeCounts, type BadgeCounts } from "@/lib/badges.data";

type BadgeState = BadgeCounts & {
  syncing: boolean;
  lastSyncedAt: number | null;
  setPendingLeaves: (n: number) => void;
  setUnreadDocuments: (n: number) => void;
  markDocumentsRead: () => void;
  refresh: () => Promise<void>;
};

const BadgeContext = createContext<BadgeState | null>(null);

/** Badge counters synced from the backend with optimistic local updates. */
export function BadgeProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<BadgeCounts>({ pendingLeaves: 0, unreadDocuments: 0 });
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  /** Optimistic values win over a slower in-flight server response. */
  const optimisticAt = useRef(0);

  const refresh = useCallback(async () => {
    setSyncing(true);
    const startedAt = Date.now();
    try {
      const next = await fetchBadgeCounts();
      if (optimisticAt.current <= startedAt) {
        setCounts(next);
        setLastSyncedAt(Date.now());
      }
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const optimistic = useCallback((patch: Partial<BadgeCounts>) => {
    optimisticAt.current = Date.now();
    setCounts((prev) => ({ ...prev, ...patch }));
  }, []);

  const setPendingLeaves = useCallback((n: number) => optimistic({ pendingLeaves: n }), [optimistic]);
  const setUnreadDocuments = useCallback((n: number) => optimistic({ unreadDocuments: n }), [optimistic]);
  const markDocumentsRead = useCallback(() => optimistic({ unreadDocuments: 0 }), [optimistic]);

  const value = useMemo<BadgeState>(
    () => ({
      ...counts,
      syncing,
      lastSyncedAt,
      setPendingLeaves,
      setUnreadDocuments,
      markDocumentsRead,
      refresh,
    }),
    [counts, syncing, lastSyncedAt, setPendingLeaves, setUnreadDocuments, markDocumentsRead, refresh],
  );

  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
}

export function useBadges(): BadgeState {
  const ctx = useContext(BadgeContext);
  if (!ctx) {
    return {
      pendingLeaves: 0,
      unreadDocuments: 0,
      syncing: false,
      lastSyncedAt: null,
      setPendingLeaves: () => {},
      setUnreadDocuments: () => {},
      markDocumentsRead: () => {},
      refresh: async () => {},
    };
  }
  return ctx;
}
