import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  Wallet,
  FileWarning,
  Cake,
  Plus,
  UploadCloud,
  CheckCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  activities,
  attendanceWeek,
  departmentSplit,
  leaveTrend,
  pipeline,
  requests,
} from "@/data/hrms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — StaffLink HRMS" },
      {
        name: "description",
        content:
          "Live workforce dashboard: headcount, attendance, leave trends, payroll status and hiring pipeline.",
      },
      { property: "og:title", content: "Dashboard — StaffLink HRMS" },
      {
        property: "og:description",
        content: "Live workforce dashboard for headcount, attendance, payroll and hiring.",
      },
    ],
  }),
  component: Dashboard,
});

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--foreground)",
  fontSize: 12,
};

function Dashboard() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Dashboard"
        title="Good evening, Hafez"
        description="1,244 employees across 6 branches. Payroll for June closes in 3 days."
        actions={
          <>
            <Button variant="secondary">
              <Plus className="size-4" />
              <span>Add employee</span>
            </Button>
            <Button variant="outline" className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground">
              <UploadCloud className="size-4" />
              <span>Import</span>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total employees" value="1,244" delta="+38 this month" icon={Users} tone="brand" />
        <StatCard label="Present today" value="1,155" delta="92.8% attendance" icon={UserCheck} tone="success" />
        <StatCard label="Absent" value="42" delta="-6 vs yesterday" trend="down" icon={UserX} tone="danger" />
        <StatCard label="Late arrivals" value="47" delta="+9 vs yesterday" icon={Clock} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface-card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Weekly attendance</h2>
              <p className="text-xs text-muted-foreground">Present, late and absent by day</p>
            </div>
            <Badge variant="secondary">Last 7 days</Badge>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceWeek} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)", opacity: 0.4 }} />
                <Bar dataKey="present" stackId="a" fill="var(--chart-1)" isAnimationActive={false} />
                <Bar dataKey="late" stackId="a" fill="var(--chart-4)" isAnimationActive={false} />
                <Bar dataKey="absent" stackId="a" fill="var(--chart-5)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Headcount by department</h2>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentSplit} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} isAnimationActive={false}>
                  {departmentSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {departmentSplit.map((d, i) => (
              <li key={d.name} className="flex items-center gap-2 text-xs">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{d.name}</span>
                <span className="tabular-nums font-medium">{d.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leaves today" value="63" icon={CalendarDays} tone="info" />
        <StatCard label="Pending requests" value="18" icon={CheckCheck} tone="warning" />
        <StatCard label="Expiring contracts" value="7" delta="within 30 days" trend="down" icon={FileWarning} tone="danger" />
        <StatCard label="Birthdays this week" value="12" icon={Cake} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Leave trends</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leaveTrend}>
                <defs>
                  <linearGradient id="annual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="annual" stroke="var(--chart-1)" fill="url(#annual)" strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="sick" stroke="var(--chart-4)" fill="transparent" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Payroll status · June</h2>
          <div className="mt-4 space-y-4">
            {[
              { label: "Salaries calculated", value: 100, tone: "text-success" },
              { label: "Approvals collected", value: 76, tone: "text-primary" },
              { label: "Bank files generated", value: 42, tone: "text-warning" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-semibold tabular-nums ${row.tone}`}>{row.value}%</span>
                </div>
                <Progress value={row.value} className="mt-2 h-2" />
              </div>
            ))}
            <div className="rounded-xl bg-secondary p-3">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="size-4 text-primary" /> Gross payroll
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">$3.84M</p>
            </div>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Recruitment pipeline</h2>
          <ul className="mt-4 space-y-3">
            {pipeline.map((stage) => (
              <li key={stage.stage}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stage.stage}</span>
                  <span className="font-semibold tabular-nums">{stage.count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(stage.count / (pipeline[0]?.count ?? 1)) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Pending approvals</h2>
          <ul className="mt-3 divide-y divide-border">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.employee}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.type} · {r.period}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    r.status === "Approved"
                      ? "border-success/40 text-success"
                      : r.status === "Rejected"
                        ? "border-destructive/40 text-destructive"
                        : "border-warning/40 text-warning"
                  }
                >
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <ol className="mt-4 space-y-4 border-l border-border pl-4">
            {activities.map((a) => (
              <li key={a.who + a.what} className="relative">
                <span
                  className={`absolute -left-[21px] top-1.5 size-2.5 rounded-full ring-4 ring-surface ${
                    a.tone === "success"
                      ? "bg-success"
                      : a.tone === "warning"
                        ? "bg-warning"
                        : a.tone === "danger"
                          ? "bg-destructive"
                          : "bg-primary"
                  }`}
                />
                <p className="text-sm">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.when}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
