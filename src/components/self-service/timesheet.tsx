import { useMemo, useState } from "react";
import { FileSpreadsheet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadCsv } from "@/lib/export";
import { buildTimesheet, formatMinutes, usePunches } from "@/lib/workflows";

const tone = (s: string) =>
  s === "Late"
    ? "border-warning/40 text-warning"
    : s === "Absent"
      ? "border-destructive/40 text-destructive"
      : s === "Checked in"
        ? "border-primary/40 text-primary"
        : s === "On time" || s === "Overtime"
          ? "border-success/40 text-success"
          : "text-muted-foreground";

export function Timesheet({ email }: { email?: string | undefined }) {
  const [punches] = usePunches(email);
  const [range, setRange] = useState("7");
  const rows = useMemo(() => buildTimesheet(punches, Number(range)), [punches, range]);
  const total = rows.reduce((s, r) => s + r.minutes, 0);
  const worked = rows.filter((r) => r.minutes > 0).length;

  const exportCsv = () =>
    downloadCsv(`timesheet-last-${range}-days.csv`, [
      ["Date", "Check in", "Check out", "Hours", "Minutes", "Status", "Method", "Location"],
      ...rows.map((r) => [r.date, r.in, r.out, r.hours, r.minutes, r.state, r.method ?? "", r.location ?? ""]),
      ["Total", "", "", formatMinutes(total), total, "", "", ""],
    ]);

  return (
    <section id="timesheet" className="surface-card scroll-mt-20 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Timesheet</h2>
          <p className="text-xs text-muted-foreground">
            {worked} days worked · {formatMinutes(total)} total · avg {formatMinutes(worked ? Math.round(total / worked) : 0)}/day
          </p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="h-9 w-[9rem]" aria-label="Range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="31">Last 31 days</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={exportCsv}>
          <FileSpreadsheet className="size-4" />
          <span>Export CSV</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>In</TableHead>
              <TableHead>Out</TableHead>
              <TableHead className="text-right">Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.date}>
                <TableCell className="tabular-nums">
                  {r.date}
                  {r.live ? <span className="ms-2 text-[10px] text-primary">today's punch</span> : null}
                </TableCell>
                <TableCell className="tabular-nums">{r.in}</TableCell>
                <TableCell className="tabular-nums">{r.out}</TableCell>
                <TableCell className="text-right tabular-nums">{r.hours}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={tone(r.state)}>{r.state}</Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{r.method ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
