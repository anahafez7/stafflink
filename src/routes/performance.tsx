import { createFileRoute } from "@tanstack/react-router";
import { Award, Target, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { goals, ratingSplit, reviewCycles } from "@/data/modules";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance — StaffLink" },
      {
        name: "description",
        content: "Goals, KPIs, 360 evaluations, review cycles, rewards and improvement plans.",
      },
      { property: "og:title", content: "Performance — StaffLink" },
      { property: "og:description", content: "Goals, KPIs, reviews and improvement plans." },
    ],
  }),
  component: PerformancePage,
});

const cycleStyles: Record<string, string> = {
  Open: "border-success/40 text-success",
  Closed: "border-border text-muted-foreground",
  Draft: "border-warning/40 text-warning",
};

function PerformancePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Performance"
        title="Performance management"
        description="Cycle Q2 2026 is open · 78% of reviews submitted."
        actions={<Button variant="secondary">Start review cycle</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active goals" value="342" delta="+28 this quarter" icon={Target} tone="brand" />
        <StatCard label="Reviews submitted" value="78%" delta="+12% vs Q1" icon={Users} tone="info" />
        <StatCard label="Average score" value="3.9 / 5" delta="+0.2" icon={TrendingUp} tone="success" />
        <StatCard label="Top performers" value="96" delta="Eligible for rewards" icon={Award} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Rating distribution · Q2 2026</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingSplit} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="band" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill="var(--brand)" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Review cycles</h2>
          <ul className="mt-3 space-y-3">
            {reviewCycles.map((c) => (
              <li key={c.name} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {c.due} · {c.participants} participants
                    </p>
                  </div>
                  <Badge variant="outline" className={cycleStyles[c.status]}>
                    {c.status}
                  </Badge>
                </div>
                <Progress value={c.submitted} className="mt-3 h-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">{c.submitted}% submitted</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold">Company goals & KPIs</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>Goal</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="w-48">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.map((g) => (
                <TableRow key={g.title}>
                  <TableCell className="text-sm font-medium">{g.title}</TableCell>
                  <TableCell className="text-sm">{g.owner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{g.department}</TableCell>
                  <TableCell className="text-sm tabular-nums">{g.weight}</TableCell>
                  <TableCell className="text-sm tabular-nums">{g.due}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={g.progress} className="h-1.5" />
                      <span className="w-9 shrink-0 text-xs tabular-nums text-muted-foreground">{g.progress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
