import { useCallback, useMemo, useState } from "react";

export function useSelection<T extends string>(visibleIds: T[]) {
  const [selected, setSelected] = useState<T[]>([]);

  const visible = useMemo(() => new Set(visibleIds), [visibleIds]);
  const selectedVisible = useMemo(() => selected.filter((id) => visible.has(id)), [selected, visible]);

  const toggle = useCallback((id: T) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => (visibleIds.every((id) => prev.includes(id)) && visibleIds.length > 0 ? [] : visibleIds));
  }, [visibleIds]);

  const clear = useCallback(() => setSelected([]), []);

  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  return {
    selected: selectedVisible,
    isSelected: (id: T) => selected.includes(id),
    toggle,
    toggleAll,
    clear,
    allSelected,
    count: selectedVisible.length,
  };
}