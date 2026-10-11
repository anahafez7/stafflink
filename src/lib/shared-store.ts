import { useCallback, useEffect, useState } from "react";

const EVENT = "stafflink:store";

/** localStorage-backed state shared live across components and tabs. */
export function useSharedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(key);
        setValue(raw ? (JSON.parse(raw) as T) : initial);
      } catch {
        setValue(initial);
      }
    };
    load();
    const onLocal = (e: Event) => {
      if ((e as CustomEvent<string>).detail === key) load();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) load();
    };
    window.addEventListener(EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        localStorage.setItem(key, JSON.stringify(resolved));
        queueMicrotask(() => window.dispatchEvent(new CustomEvent(EVENT, { detail: key })));
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
