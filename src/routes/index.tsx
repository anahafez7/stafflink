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
  RefreshCcw,
  Zap,
  ArrowRight,
  Bell,
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

      {/* Added bottom sections */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Notifications Center */}
        <section className="surface-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="size-5 text-brand" />
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-surface bg-destructive" />
                </div>
                <h2 className="text-base font-semibold">Notifications Center</h2>
                <Badge variant="secondary" className="bg-secondary text-muted-foreground font-normal rounded-md px-1.5 py-0.5 text-[10px]">
                  <Zap className="mr-1 size-3" /> Live
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                0 pending leaves • 0 late • 263 absent today
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-full text-xs font-normal">
              <RefreshCcw className="mr-2 size-3" /> Refresh
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="bg-brand text-brand-foreground hover:bg-brand/90 px-3 py-1.5 text-xs rounded-full">
              All <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">1</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-xs rounded-full font-normal text-muted-foreground hover:text-foreground">Pending leaves <span className="ml-1.5 text-muted-foreground">0</span></Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-xs rounded-full font-normal text-muted-foreground hover:text-foreground">Late <span className="ml-1.5 text-muted-foreground">0</span></Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-xs rounded-full font-normal text-muted-foreground hover:text-foreground">Absent <span className="ml-1.5 text-foreground font-medium">263</span></Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-xs rounded-full font-normal text-muted-foreground hover:text-foreground">Check-ins <span className="ml-1.5 text-muted-foreground">0</span></Badge>
            <Badge variant="secondary" className="px-3 py-1.5 text-xs rounded-full font-normal text-muted-foreground hover:text-foreground">Check-outs <span className="ml-1.5 text-muted-foreground">0</span></Badge>
          </div>

          <div className="mt-6 cursor-pointer rounded-2xl border border-border p-4 flex items-center justify-between hover:bg-accent transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <UserX className="size-6" />
              </div>
              <div>
                <h3 className="text-[15px] font-medium text-foreground">263 employees not checked in</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">As of 00:01</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">just now</span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Right side columns */}
        <div className="space-y-4 lg:col-span-2">
          {/* Live Activity */}
          <section className="surface-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Live Activity</h2>
              <Button variant="link" className="h-auto p-0 text-sm text-brand font-medium">View all</Button>
            </div>
            
            <div className="my-8 text-center">
              <p className="text-sm text-muted-foreground">No check-ins yet today.</p>
            </div>

            <div className="rounded-2xl bg-secondary/40 p-5 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-medium">Today's distribution</span>
                <span className="text-sm text-muted-foreground">263 total</span>
              </div>
              <div className="h-3.5 w-full rounded-full overflow-hidden flex">
                <div className="h-full bg-success" style={{ width: '0%' }} />
                <div className="h-full bg-warning" style={{ width: '0%' }} />
                <div className="h-full bg-blue-500" style={{ width: '0.4%' }} />
                <div className="h-full bg-destructive" style={{ width: '99.6%' }} />
              </div>
              <div className="mt-4 flex items-center gap-5 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-success"></span> 0 Present</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-warning"></span> 0 Late</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-500"></span> 1 On Leave</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-destructive"></span> 263 Absent</div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pending Leaves */}
            <section className="surface-card p-5 flex flex-col">
              <h2 className="text-base font-semibold">Pending Leaves</h2>
              <div className="flex-1 flex items-center justify-center py-10">
                <p className="text-sm text-muted-foreground">No pending requests.</p>
              </div>
            </section>

            {/* Upcoming Holidays */}
            <section className="surface-card p-5">
              <h2 className="text-base font-semibold">Upcoming Holidays</h2>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-4">
                  <div>
                    <p className="text-[15px] font-medium">Prophet Muhammad's Birthday</p>
                    <p className="mt-1 text-xs text-muted-foreground">Public</p>
                  </div>
                  <p className="text-[15px] font-medium tracking-tight">26-08-2026</p>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-4">
                  <div>
                    <p className="text-[15px] font-medium">Armed Forces Day</p>
                    <p className="mt-1 text-xs text-muted-foreground">Public</p>
                  </div>
                  <p className="text-[15px] font-medium tracking-tight">06-10-2026</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
