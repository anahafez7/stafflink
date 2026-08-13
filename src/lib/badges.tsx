import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { documentsList, leaveHistory } from "@/data/modules";

type BadgeState = {
  pendingLeaves: number;
  unreadDocuments: number;
  setPendingLeaves: (n: number) => void;
  setUnreadDocuments: (n: number) => void;
  markDocumentsRead: () => void;
};

const initialLeaves = leaveHistory.filter((r) => r.status === "Pending").length;
const initialDocs = documentsList.filter((d) => d.status !== "Valid").length;

const BadgeContext = createContext<BadgeState | null>(null);

/** Live counters shared between modules and the mobile bottom navigation. */
export function BadgeProvider({ children }: { children: ReactNode }) {
  const [pendingLeaves, setPendingLeaves] = useState(initialLeaves);
  const [unreadDocuments, setUnreadDocuments] = useState(initialDocs);

  const markDocumentsRead = useCallback(() => setUnreadDocuments(0), []);

  const value = useMemo<BadgeState>(
    () => ({ pendingLeaves, unreadDocuments, setPendingLeaves, setUnreadDocuments, markDocumentsRead }),
    [pendingLeaves, unreadDocuments, markDocumentsRead],
  );

  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
}

export function useBadges(): BadgeState {
  const ctx = useContext(BadgeContext);
  if (!ctx) {
    return {
      pendingLeaves: initialLeaves,
      unreadDocuments: initialDocs,
      setPendingLeaves: () => {},
      setUnreadDocuments: () => {},
      markDocumentsRead: () => {},
    };
  }
  return ctx;
}
