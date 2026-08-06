import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PunchRecord } from "@/data/modules";

const stateTone: Record<string, string> = {
  "On time": "border-success/40 text-success",
  Late: "border-warning/40 text-warning",
  Overtime: "border-brand/40 text-brand",
  Leave: "border-primary/40 text-primary",
  Weekend: "border-border text-muted-foreground",
};

const dayDot: Record<string, string> = {
  "On time": "bg-success",
  Late: "bg-warning",
  Overtime: "bg-brand",
  Leave: "bg-primary",
  Weekend: "bg-muted-foreground/30",
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceCalendar({ records }: { records: PunchRecord[] }) {
  const months = useMemo(() => {
    const set = Array.from(new Set(records.map((r) => r.date.slice(0, 7))));
    return set.sort();
  }, [records]);
  const [index, setIndex] = useState(Math.max(0, months.length - 1));
  const month = months[index] ?? "";
  const [selected, setSelected] = useState<string | null>(null);

  const byDate = useMemo(() => new Map(records.map((r) => [r.date, r])), [records]);
  const monthRecords = useMemo(() => records.filter((r) => r.date.startsWith(month)), [records, month]);

  const parts = month.split("-").map(Number);
  const year = parts[0] ?? 2026;
  const mon = parts[1] ?? 1;
  const first = new Date(Date.UTC(year, mon - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const leading = first.getUTCDay();
  const label = first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  const summary = useMemo(() => {
    const count = (s: string) => monthRecords.filter((r) => r.state === s).length;
    return { present: monthRecords.filter((r) => r.in !== "—").length, late: count("Late"), leave: count("Leave") };
  }, [monthRecords]);

  const detail = selected ? byDate.get(selected) : null;

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Attendance calendar</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.present} days present · {summary.late} late · {summary.leave} on leave
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="size-8 rounded-lg"
            aria-label="Previous month"
            disabled={index === 0}
            onClick={() => {
              setIndex((i) => Math.max(0, i - 1));
              setSelected(null);
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[8.5rem] text-center text-sm font-medium">{label}</span>
          <Button
            size="icon"
            variant="outline"
            className="size-8 rounded-lg"
            aria-label="Next month"
            disabled={index >= months.length - 1}
            onClick={() => {
              setIndex((i) => Math.min(months.length - 1, i + 1));
              setSelected(null);
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
        {weekdays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: leading }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = `${month}-${String(day).padStart(2, "0")}`;
          const rec = byDate.get(key);
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(isSelected ? null : key)}
              aria-label={`${key}${rec ? ` · ${rec.state}` : ""}`}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-xs transition-colors ${
                isSelected ? "border-primary bg-primary/10 font-semibold" : "border-border hover:bg-secondary"
              }`}
            >
              <span className="tabular-nums">{day}</span>
              <span className={`size-1.5 rounded-full ${rec ? dayDot[rec.state] : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-border p-3">
        {detail ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium tabular-nums">{detail.date}</span>
            <span className="tabular-nums text-muted-foreground">
              {detail.in} – {detail.out}
            </span>
            <span className="tabular-nums text-muted-foreground">{detail.hours}</span>
            <Badge variant="outline" className={`ml-auto ${stateTone[detail.state] ?? ""}`}>
              {detail.state}
            </Badge>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Pick a day to see the check-in and check-out times.</p>
        )}
      </div>
    </section>
  );
}