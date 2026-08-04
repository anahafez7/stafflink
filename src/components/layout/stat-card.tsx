import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  tone = "info",
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  tone?: "info" | "success" | "warning" | "danger" | "brand";
}) {
  const toneClass = {
    info: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/12 text-destructive",
    brand: "bg-brand/10 text-brand",
  }[tone];

  return (
    <div className="surface-card p-4 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${toneClass}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums">{value}</p>
      {delta ? (
        <p
          className={`mt-1 flex items-center gap-1 text-xs font-medium ${
            trend === "up" ? "text-success" : "text-destructive"
          }`}
        >
          {trend === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {delta}
        </p>
      ) : null}
    </div>
  );
}