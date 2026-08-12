import { createFileRoute } from "@tanstack/react-router";
import { Clock, Fingerprint, MapPin, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceWeek } from "@/data/hrms";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — StaffLink" },
      {
        name: "description",
        content:
          "Live attendance, shifts, geofencing, overtime rules and correction approvals across every branch.",
      },
      { property: "og:title", content: "Attendance — StaffLink" },
      {
        property: "og:description",
        content: "Live attendance, shifts, geofencing and overtime approvals.",
      },
    ],
  }),
  component: AttendancePage,
});

const live = [
  { name: "Yara Mansour", checkIn: "08:42", checkOut: "17:05", hours: "8h 23m", method: "Face ID", site: "Cairo HQ", state: "On time" },
  { name: "Omar Khalil", checkIn: "09:07", checkOut: "17:30", hours: "8h 23m", method: "Fingerprint", site: "Cairo HQ", state: "Late" },
  { name: "Karim Fathy", checkIn: "07:55", checkOut: "16:00", hours: "8h 05m", method: "GPS", site: "Alexandria Yard", state: "On time" },
  { name: "Hassan Rageh", checkIn: "09:31", checkOut: "18:15", hours: "8h 44m", method: "QR", site: "Riyadh DC", state: "Late" },
  { name: "Ziad Nour", checkIn: "08:12", checkOut: "16:30", hours: "8h 18m", method: "Web", site: "Remote", state: "On time" },
];

function AttendancePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Attendance"
        title="Live attendance"
        description="Devices, geofences and shift rules synced across 6 worksites."
        actions={<Button variant="secondary">Attendance correction</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Checked in" value="1,155" icon={UserCheck} tone="success" />
        <StatCard label="Late" value="47" icon={Clock} tone="warning" />
        <StatCard label="Absent" value="42" icon={UserX} tone="danger" />
        <StatCard label="Devices online" value="18 / 19" icon={Fingerprint} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Live punch feed</h2>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 px-3 text-xs">Today</Button>
              <div className="flex items-center rounded-md border border-border bg-background p-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm text-muted-foreground"><ChevronLeft className="size-3.5" /></Button>
                <span className="text-xs font-medium px-2 min-w-[90px] whitespace-nowrap text-center">08-07-2026</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm text-muted-foreground"><ChevronRight className="size-3.5" /></Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto mt-4 rounded-xl border border-border">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Employee</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Check in</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Check out</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Hours</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Location</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Method</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {live.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="font-medium">{p.checkIn}</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{p.checkOut}</TableCell>
                    <TableCell className="font-medium">{p.hours}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3" /> {p.site}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={p.state === "Late" ? "border-warning/40 text-warning" : "border-success/40 text-success"}
                      >
                        {p.state}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Weekly presence</h2>
          <ul className="mt-4 space-y-3">
            {attendanceWeek.map((d) => (
              <li key={d.day}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.day}</span>
                  <span className="font-medium tabular-nums">{d.present}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(d.present / 1244) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}