import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Builds the in-app URL a notification should open. */
export function notificationLink(
  channel: "attendance" | "leaves" | "documents",
  id?: string,
  role?: string,
): string {
  const managerish = role === "manager" || role === "hr_manager" || role === "admin";
  if (channel === "attendance") {
    return `/self-service?focus=attendance${id ? `&date=${encodeURIComponent(id)}` : ""}`;
  }
  if (channel === "leaves") {
    const base = managerish ? "/leaves" : "/self-service?focus=leaves";
    const sep = base.includes("?") ? "&" : "?";
    return id ? `${base}${sep}request=${encodeURIComponent(id)}` : base;
  }
  return `/documents${id ? `?doc=${encodeURIComponent(id)}` : ""}`;
}

/**
 * Reads a deep-link search param, scrolls the matching element into view and
 * returns the id so the row can render a highlighted state.
 */
export function useDeepLinkTarget(param: string): string | null {
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(search).get(param);
    setTarget(value);
    if (!value) return;
    const id = window.setTimeout(() => {
      const el = document.querySelector(`[data-deep-link="${CSS.escape(value)}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => window.clearTimeout(id);
  }, [search, param]);

  return target;
}

/** Scrolls to a page section named by the `focus` search param (e.g. #attendance). */
export function useDeepLinkSection() {
  const search = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    const value = new URLSearchParams(search).get("focus");
    if (!value) return;
    const id = window.setTimeout(() => {
      document.getElementById(value)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(id);
  }, [search]);
}

export const deepLinkHighlight =
  "ring-2 ring-brand/60 ring-offset-2 ring-offset-background transition-shadow";
