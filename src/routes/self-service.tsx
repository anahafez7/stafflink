import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, Download, FileText, Megaphone, Plus, Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { announcements, leaveBalances, myRequests, payslips } from "@/data/modules";

export const Route = createFileRoute("/self-service")({
  head: () => ({
    meta: [
      { title: "Self Service — StaffLink" },
      {
        name: "description",
        content: "Employee self service: leave and loan requests, payslips, announcements, tasks and profile updates.",
      },
      { property: "og:title", content: "Self Service — StaffLink" },
      { property: "og:description", content: "Requests, payslips, announcements and profile updates." },
    ],
  }),
  component: SelfServicePage,
});

const statusStyles: Record<string, string> = {
  Pending: "border-warning/40 text-warning",
  Approved: "border-success/40 text-success",
  Rejected: "border-destructive/40 text-destructive",
};

const quickActions = [
  { label: "Leave request", icon: CalendarDays },
  { label: "Loan / advance", icon: Wallet },
  { label: "Attendance fix", icon: Clock },
  { label: "Download forms", icon: FileText },
];

function SelfServicePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Self Service"
        title="Employee self service"
        description="Everything an employee needs, in three clicks or fewer."
        actions={
          <Button variant="secondary">
            <Plus className="size-4" />
            <span>New request</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((a) => (
          <button
            key={a.label}
            type="button"
            className="surface-card flex items-center gap-3 p-4 text-left transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <a.icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{a.label}</span>
              <span className="block text-xs text-muted-foreground">Submit in seconds</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="surface-card overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold">My requests</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRequests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm font-medium tabular-nums">{r.id}</TableCell>
                    <TableCell className="text-sm">{r.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.period}</TableCell>
                    <TableCell className="text-sm tabular-nums">{r.days || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Leave balances</h2>
          <ul className="mt-4 space-y-4">
            {leaveBalances.map((b) => (
              <li key={b.type}>
                <div className="flex items-center justify-between text-sm">
                  <span>{b.type}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {b.total - b.used} of {b.total} days left
                  </span>
                </div>
                <Progress value={(b.used / b.total) * 100} className="mt-1.5 h-1.5" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Payslips</h2>
          <ul className="mt-3 divide-y divide-border">
            {payslips.map((p) => (
              <li key={p.month} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.month}</p>
                  <p className="text-xs text-muted-foreground">
                    Gross {p.gross} · Net {p.net} · issued {p.issued}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 rounded-lg">
                  <Download className="size-4" />
                  <span>PDF</span>
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Megaphone className="size-4 text-primary" />
            Announcements
          </h2>
          <ul className="mt-3 space-y-3">
            {announcements.map((a) => (
              <li key={a.title} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium">{a.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.when}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
