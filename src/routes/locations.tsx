import { createFileRoute } from "@tanstack/react-router";
import { Building2, Globe2, MapPin, Plus, Radar } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { worksites } from "@/data/modules";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — StaffLink" },
      {
        name: "description",
        content: "Countries, cities, branches, worksites, GPS coordinates and geofence areas for attendance.",
      },
      { property: "og:title", content: "Locations — StaffLink" },
      { property: "og:description", content: "Branches, worksites, GPS coordinates and geofences." },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Locations"
        title="Locations & geofencing"
        description="6 branches · 14 worksites · 11 active geofence areas."
        actions={
          <Button variant="secondary">
            <Plus className="size-4" />
            <span>Add worksite</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Countries" value="3" delta="EG · AE · SA" icon={Globe2} tone="brand" />
        <StatCard label="Branches" value="6" delta="+1 this year" icon={Building2} tone="info" />
        <StatCard label="Worksites" value="14" delta="2 in setup" icon={MapPin} tone="success" />
        <StatCard label="Active geofences" value="11" delta="98% punch accuracy" icon={Radar} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Coverage map</h2>
          <div className="mt-4 space-y-3">
            {worksites.map((w) => (
              <div key={w.name} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <MapPin className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{w.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {w.city} · {w.coords}
                  </p>
                </div>
                <Badge variant="outline" className={w.geofence ? "border-success/40 text-success" : "border-border text-muted-foreground"}>
                  {w.geofence ? "Geofenced" : "Open"}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold">Worksites & radius rules</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Worksite</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>GPS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worksites.map((w) => (
                  <TableRow key={w.name}>
                    <TableCell className="text-sm font-medium">{w.name}</TableCell>
                    <TableCell className="text-sm">{w.city}</TableCell>
                    <TableCell className="text-sm tabular-nums">{w.employees}</TableCell>
                    <TableCell className="text-sm tabular-nums">{w.radius}</TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">{w.coords}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
