import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

/**
 * Cloud-backed state shared live across devices: reads/writes one row in
 * `shared_state` and subscribes to realtime changes for that key.
 */
export function useSharedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const initialRef = useRef(initial);
  initialRef.current = initial;

  useEffect(() => {
    let active = true;
    setValue(initialRef.current);
    supabase
      .from("shared_state")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setValue(data.value as T);
      });
    const channel = supabase
      .channel(`shared-${key}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shared_state", filter: `key=eq.${key}` },
        (payload) => {
          const row = payload.new as { value?: unknown } | null;
          if (active && row && "value" in row) setValue(row.value as T);
        },
      )
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        void supabase.auth.getUser().then(({ data }) =>
          supabase
            .from("shared_state")
            .upsert({ key, value: resolved as unknown as Json, updated_by: data.user?.id ?? null, updated_at: new Date().toISOString() })
            .then(({ error }) => {
              if (error) console.error("Failed to save", key, error.message);
            }),
        );
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
