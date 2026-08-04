import { createFileRoute } from "@tanstack/react-router";
import { Clock, Fingerprint, MapPin, UserCheck, UserX } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  { name: "Yara Mansour", time: "08:42", method: "Face ID", site: "Cairo HQ", state: "On time" },
  { name: "Omar Khalil", time: "09:07", method: "Fingerprint", site: "Cairo HQ", state: "Late" },
  { name: "Karim Fathy", time: "07:55", method: "GPS", site: "Alexandria Yard", state: "On time" },
  { name: "Hassan Rageh", time: "09:31", method: "QR", site: "Riyadh DC", state: "Late" },
  { name: "Ziad Nour", time: "08:12", method: "Web", site: "Remote", state: "On time" },
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
          <h2 className="text-sm font-semibold">Live punch feed</h2>
          <ul className="mt-3 divide-y divide-border">
            {live.map((p) => (
              <li key={p.name} className="flex items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-xs font-semibold">
                  {p.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {p.site} · {p.method}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={p.state === "Late" ? "border-warning/40 text-warning" : "border-success/40 text-success"}
                >
                  {p.state}
                </Badge>
              </li>
            ))}
          </ul>
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