import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BulkBar({
  count,
  noun,
  onClear,
  children,
}: {
  count: number;
  noun: string;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-primary/5 px-4 py-2.5">
      <span className="text-sm font-medium">
        {count} {noun}
        {count === 1 ? "" : "s"} selected
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
      <Button variant="ghost" size="sm" className="ml-auto rounded-lg" onClick={onClear}>
        <X className="size-4" />
        <span>Clear</span>
      </Button>
    </div>
  );
}