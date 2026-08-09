import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Info, LogIn, LogOut, MapPin, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PunchRecord } from "@/data/modules";

const holidays: Record<string, string> = {
  "2026-07-02": "June 30 Revolution",
  "2026-07-23": "Revolution Day",
  "2026-06-30": "June 30 Revolution",
};

type Status = "Present" | "Late" | "Absent" | "Leave" | "Holiday" | "Off";

const statusTone: Record<Status, string> = {
  Present: "border-transparent bg-success/12 text-success",
  Late: "border-transparent bg-warning/15 text-warning",
  Absent: "border-transparent bg-destructive/10 text-destructive",
  Leave: "border-transparent bg-primary/10 text-primary",
  Holiday: "border-transparent bg-brand/10 text-brand",
  Off: "border-transparent bg-secondary text-muted-foreground",
};

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function statusOf(date: string, rec?: PunchRecord): Status {
  if (holidays[date]) return "Holiday";
  if (!rec) return "Absent";
  if (rec.state === "Weekend") return "Off";
  if (rec.state === "Leave") return "Leave";
  if (rec.state === "Late") return "Late";
  if (rec.in === "—") return "Absent";
  return "Present";
}

export function AttendanceCalendar({ records }: { records: PunchRecord[] }) {
  const months = useMemo(
    () => Array.from(new Set(records.map((r) => r.date.slice(0, 7)))).sort(),
    [records],
  );
  const [index, setIndex] = useState(Math.max(0, months.length - 1));
  const month = months[index] ?? "";
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked([]);
  }, [month]);

  const byDate = useMemo(() => new Map(records.map((r) => [r.date, r])), [records]);

  const parts = month.split("-").map(Number);
  const year = parts[0] ?? 2026;
  const mon = parts[1] ?? 1;
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const label = new Date(Date.UTC(year, mon - 1, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const rows = useMemo(
    () =>
      Array.from({ length: daysInMonth }).map((_, i) => {
        const date = `${month}-${String(i + 1).padStart(2, "0")}`;
        const rec = byDate.get(date);
        const weekday = weekdayNames[new Date(`${date}T00:00:00Z`).getUTCDay()]!;
        return { date, rec, weekday, status: statusOf(date, rec), holiday: holidays[date] };
      }),
    [byDate, daysInMonth, month],
  );

  const summary = useMemo(() => {
    const count = (s: Status) => rows.filter((r) => r.status === s).length;
    return {
      present: count("Present"),
      late: count("Late"),
      absent: count("Absent"),
      leave: count("Leave"),
      working: rows.filter((r) => r.status !== "Off" && r.status !== "Holiday").length,
    };
  }, [rows]);

  const allChecked = checked.length > 0 && checked.length === rows.length;
  const detail = selected ? byDate.get(selected) : null;
  const detailLabel = selected
    ? new Date(`${selected}T00:00:00Z`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <section className="surface-card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Previous month"
            disabled={index === 0}
            onClick={() => {
              setIndex((i) => Math.max(0, i - 1));
              setSelected(null);
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="min-w-[8.5rem] text-base font-semibold">{label}</h2>
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
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
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-success tabular-nums">{summary.present}</span> present
          </span>
          <span>
            <span className="font-semibold text-warning tabular-nums">{summary.late}</span> late
          </span>
          <span>
            <span className="font-semibold text-destructive tabular-nums">{summary.absent}</span> absent
          </span>
          <span>
            <span className="font-semibold text-primary tabular-nums">{summary.leave}</span> leave
          </span>
          <span>
            / <span className="font-semibold text-foreground tabular-nums">{summary.working}</span> working days
          </span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allChecked}
                  aria-label="Select all days"
                  onCheckedChange={(v) => setChecked(v ? rows.map((r) => r.date) : [])}
                />
              </th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Day</th>
              <th className="px-4 py-3 text-left font-medium">Check in</th>
              <th className="px-4 py-3 text-left font-medium">Check out</th>
              <th className="px-4 py-3 text-left font-medium">Hours</th>
              <th className="px-4 py-3 text-right font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.date} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={checked.includes(r.date)}
                    aria-label={`Select ${r.date}`}
                    onCheckedChange={(v) =>
                      setChecked((prev) => (v ? [...prev, r.date] : prev.filter((d) => d !== r.date)))
                    }
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">{r.date}</td>
                <td className="px-4 py-3">
                  {r.weekday}
                  {r.holiday ? <span className="ml-1.5 text-xs text-brand">· {r.holiday}</span> : null}
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.rec?.in ?? "—"}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.rec?.out ?? "—"}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.rec?.hours ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Badge className={`rounded-full text-[10px] uppercase ${statusTone[r.status]}`}>
                      {r.status}
                    </Badge>
                    <button
                      type="button"
                      aria-label={`Punch details for ${r.date}`}
                      onClick={() => setSelected(r.date)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Info className="size-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl sm:max-w-sm">
          <DialogHeader className="text-left">
            <DialogTitle className="text-base">{detailLabel}</DialogTitle>
            <DialogDescription>Punch details for this day</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Badge
              className={`rounded-full text-[10px] uppercase ${
                statusTone[selected ? statusOf(selected, detail ?? undefined) : "Off"]
              }`}
            >
              {selected ? statusOf(selected, detail ?? undefined) : ""}
            </Badge>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LogIn className="size-3.5" /> Check in
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{detail?.in ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LogOut className="size-3.5" /> Check out
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{detail?.out ?? "—"}</p>
              </div>
            </div>
            <ul className="divide-y divide-border rounded-xl border border-border">
              <li className="flex items-center gap-2 p-3 text-sm">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Worked</span>
                <span className="ml-auto font-medium tabular-nums">{detail?.hours ?? "—"}</span>
              </li>
              <li className="flex items-start gap-2 p-3 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Location</span>
                <span className="ml-auto min-w-0 text-right font-medium">
                  {detail?.location ?? "Not recorded"}
                  {detail?.coords && detail.coords !== "—" ? (
                    <span className="block text-xs font-normal tabular-nums text-muted-foreground">
                      {detail.coords}
                    </span>
                  ) : null}
                </span>
              </li>
              <li className="flex items-center gap-2 p-3 text-sm">
                <Smartphone className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Method</span>
                <span className="ml-auto font-medium">{detail?.method ?? "—"}</span>
              </li>
            </ul>
            <Button className="h-11 w-full rounded-xl" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
