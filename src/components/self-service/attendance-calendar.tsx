import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Info,
  LogIn,
  LogOut,
  MapPin,
  Smartphone,
} from "lucide-react";

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
import { downloadCsv, printTableAsPdf } from "@/lib/export";

const holidays: Record<string, string> = {
  "2026-06-30": "June 30 Revolution",
  "2026-07-02": "June 30 Revolution",
  "2026-07-23": "Revolution Day",
};

type Status = "Present" | "Late" | "Absent" | "Leave" | "Holiday" | "Off";

const statuses: Status[] = ["Present", "Late", "Absent", "Leave", "Holiday", "Off"];

const pill: Record<Status, string> = {
  Present: "bg-success/12 text-success",
  Late: "bg-warning/15 text-warning",
  Absent: "bg-destructive/10 text-destructive",
  Leave: "bg-primary/10 text-primary",
  Holiday: "bg-brand/10 text-brand",
  Off: "bg-secondary text-muted-foreground",
};

const dot: Record<Status, string> = {
  Present: "bg-success",
  Late: "bg-warning",
  Absent: "bg-destructive",
  Leave: "bg-primary",
  Holiday: "bg-brand",
  Off: "bg-muted-foreground/40",
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

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${pill[status]}`}
    >
      {status}
    </span>
  );
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
  const [hidden, setHidden] = useState<Status[]>([]);

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

  const allRows = useMemo(
    () =>
      Array.from({ length: daysInMonth }).map((_, i) => {
        const date = `${month}-${String(i + 1).padStart(2, "0")}`;
        const rec = byDate.get(date);
        const weekday = weekdayNames[new Date(`${date}T00:00:00Z`).getUTCDay()]!;
        return { date, rec, weekday, status: statusOf(date, rec), holiday: holidays[date] };
      }),
    [byDate, daysInMonth, month],
  );

  const rows = useMemo(() => allRows.filter((r) => !hidden.includes(r.status)), [allRows, hidden]);

  const summary = useMemo(() => {
    const count = (s: Status) => allRows.filter((r) => r.status === s).length;
    return {
      counts: Object.fromEntries(statuses.map((s) => [s, count(s)])) as Record<Status, number>,
      working: allRows.filter((r) => r.status !== "Off" && r.status !== "Holiday").length,
    };
  }, [allRows]);

  const allChecked = rows.length > 0 && checked.length === rows.length;
  const detail = selected ? byDate.get(selected) : null;
  const detailStatus = selected ? statusOf(selected, detail ?? undefined) : "Off";
  const detailLabel = selected
    ? new Date(`${selected}T00:00:00Z`).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  const exportHead = ["Date", "Day", "Check in", "Check out", "Hours", "Status"];
  const exportRows = () =>
    rows.map((r) => [
      r.date,
      r.holiday ? `${r.weekday} · ${r.holiday}` : r.weekday,
      r.rec?.in ?? "—",
      r.rec?.out ?? "—",
      r.rec?.hours ?? "—",
      r.status,
    ]);

  return (
    <section className="surface-card overflow-hidden p-0">
      <div className="space-y-4 border-b border-border p-4 sm:p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="size-9 shrink-0 rounded-full"
              aria-label="Previous month"
              disabled={index === 0}
              onClick={() => {
                setIndex((i) => Math.max(0, i - 1));
                setSelected(null);
              }}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="truncate text-lg font-semibold tracking-tight sm:min-w-[8.5rem]">{label}</h2>
            <Button
              size="icon"
              variant="outline"
              className="size-9 shrink-0 rounded-full"
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
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                downloadCsv(`stafflink-attendance-${month}.csv`, [exportHead, ...exportRows()])
              }
            >
              <Download className="size-4" /> <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                printTableAsPdf(`Attendance — ${label}`, "StaffLink employee attendance", exportHead, exportRows())
              }
            >
              <FileText className="size-4" /> <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-success tabular-nums">{summary.counts.Present}</span> present
          </span>
          <span>
            <span className="font-semibold text-warning tabular-nums">{summary.counts.Late}</span> late
          </span>
          <span>
            <span className="font-semibold text-destructive tabular-nums">{summary.counts.Absent}</span> absent
          </span>
          <span>
            <span className="font-semibold text-primary tabular-nums">{summary.counts.Leave}</span> leave
          </span>
          <span>
            / <span className="font-semibold text-foreground tabular-nums">{summary.working}</span> working days
          </span>
        </p>

        {/* Legend + filters */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => {
            const off = hidden.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={!off}
                onClick={() =>
                  setHidden((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
                  off
                    ? "border-border text-muted-foreground/60 line-through"
                    : "border-border bg-secondary/60 text-foreground"
                }`}
              >
                <span className={`size-2 rounded-full ${dot[s]} ${off ? "opacity-40" : ""}`} />
                {s}
                <span className="tabular-nums text-muted-foreground">{summary.counts[s]}</span>
              </button>
            );
          })}
          {hidden.length > 0 ? (
            <button
              type="button"
              onClick={() => setHidden([])}
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Show all
            </button>
          ) : null}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              <th className="w-10 px-4 py-3.5">
                <Checkbox
                  checked={allChecked}
                  aria-label="Select all days"
                  onCheckedChange={(v) => setChecked(v ? rows.map((r) => r.date) : [])}
                />
              </th>
              <th className="px-4 py-3.5 text-left">Date</th>
              <th className="px-4 py-3.5 text-left">Day</th>
              <th className="px-4 py-3.5 text-left">Check in</th>
              <th className="px-4 py-3.5 text-left">Check out</th>
              <th className="px-4 py-3.5 text-left">Hours</th>
              <th className="px-4 py-3.5 text-right">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.date}
                className="border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/40"
              >
                <td className="px-4 py-3.5">
                  <Checkbox
                    checked={checked.includes(r.date)}
                    aria-label={`Select ${r.date}`}
                    onCheckedChange={(v) =>
                      setChecked((prev) => (v ? [...prev, r.date] : prev.filter((d) => d !== r.date)))
                    }
                  />
                </td>
                <td className="px-4 py-3.5 font-mono text-[13px] tabular-nums text-foreground">{r.date}</td>
                <td className="px-4 py-3.5 text-[15px] text-foreground">
                  {r.weekday}
                  {r.holiday ? <span className="ml-1.5 text-xs font-medium text-brand">· {r.holiday}</span> : null}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{r.rec?.in ?? "—"}</td>
                <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{r.rec?.out ?? "—"}</td>
                <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{r.rec?.hours ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <StatusPill status={r.status} />
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
                <td className="px-4 py-3.5 text-right text-muted-foreground">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <ul className="divide-y divide-border md:hidden">
        {rows.map((r) => (
          <li key={r.date}>
            <button
              type="button"
              onClick={() => setSelected(r.date)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-secondary/60"
            >
              <span className={`h-9 w-1 shrink-0 rounded-full ${dot[r.status]}`} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[13px] tabular-nums">{r.date}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {r.weekday}
                    {r.holiday ? ` · ${r.holiday}` : ""}
                  </span>
                </span>
                <span className="mt-1 block text-xs tabular-nums text-muted-foreground">
                  {r.rec?.in ?? "—"} – {r.rec?.out ?? "—"} · {r.rec?.hours ?? "—"}
                </span>
              </span>
              <StatusPill status={r.status} />
            </button>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">No days match these filters.</li>
        ) : null}
      </ul>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl p-5 sm:max-w-sm">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">{detailLabel}</DialogTitle>
            <DialogDescription className="text-xs">Punch details for this day</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <StatusPill status={detailStatus} />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  <LogIn className="size-3.5" /> Check in
                </p>
                <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">{detail?.in ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  <LogOut className="size-3.5" /> Check out
                </p>
                <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">{detail?.out ?? "—"}</p>
              </div>
            </div>

            <dl className="divide-y divide-border rounded-xl border border-border text-sm">
              <div className="flex items-center gap-3 px-3 py-3">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <dt className="text-muted-foreground">Hours worked</dt>
                <dd className="ml-auto font-medium tabular-nums">{detail?.hours ?? "—"}</dd>
              </div>
              <div className="flex items-start gap-3 px-3 py-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dt className="text-muted-foreground">Location</dt>
                <dd className="ml-auto min-w-0 text-right font-medium">
                  {detail?.location ?? "Not recorded"}
                  {detail?.coords && detail.coords !== "—" ? (
                    <span className="mt-0.5 block text-xs font-normal tabular-nums text-muted-foreground">
                      {detail.coords}
                    </span>
                  ) : null}
                </dd>
              </div>
              <div className="flex items-center gap-3 px-3 py-3">
                <Smartphone className="size-4 shrink-0 text-muted-foreground" />
                <dt className="text-muted-foreground">Method</dt>
                <dd className="ml-auto font-medium">{detail?.method ?? "—"}</dd>
              </div>
            </dl>

            <Button className="h-11 w-full rounded-xl" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
