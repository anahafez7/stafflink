import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { analyticsMetrics, branchPerformance, headcountTrend } from "@/data/modules";
import { departmentSplit } from "@/data/hrms";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — StaffLink" },
      {
        name: "description",
        content: "Executive workforce analytics: headcount, turnover, attrition, absenteeism, hiring time and cost.",
      },
      { property: "og:title", content: "Analytics — StaffLink" },
      { property: "og:description", content: "Headcount, turnover, attrition and hiring analytics." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const maxDept = Math.max(...departmentSplit.map((d) => d.value));

  return (
    <div className="space-y-5">
      <PageHeader
        section="Analytics"
        title="Workforce analytics"
        description="Executive insight across every StaffLink module."
        actions={
          <Button variant="secondary">
            <Download className="size-4" />
            <span>Export report</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {analyticsMetrics.map((m) => (
          <div key={m.metric} className="surface-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{m.metric}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">{m.value}</p>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                m.trend === "up" ? "text-success" : "text-destructive"
              }`}
            >
              {m.trend === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {m.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Headcount growth</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountTrend} margin={{ left: -18, right: 8 }}>
                <defs>
                  <linearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={["dataMin - 40", "dataMax + 20"]} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area dataKey="headcount" stroke="var(--brand)" fill="url(#hc)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Hires vs exits</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headcountTrend} margin={{ left: -22, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="hires" fill="var(--success)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="exits" fill="var(--destructive)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Headcount by department</h2>
          <ul className="mt-4 space-y-3">
            {departmentSplit.map((d) => (
              <li key={d.name}>
                <div className="flex items-center justify-between text-sm">
                  <span>{d.name}</span>
                  <span className="tabular-nums text-muted-foreground">{d.value}</span>
                </div>
                <Progress value={(d.value / maxDept) * 100} className="mt-1.5 h-1.5" />
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold">Branch scorecard</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Headcount</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Turnover</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchPerformance.map((b) => (
                  <TableRow key={b.branch}>
                    <TableCell className="text-sm font-medium">{b.branch}</TableCell>
                    <TableCell className="text-sm tabular-nums">{b.headcount}</TableCell>
                    <TableCell className="text-sm tabular-nums">{b.attendance}%</TableCell>
                    <TableCell className="text-sm tabular-nums">{b.turnover}</TableCell>
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
