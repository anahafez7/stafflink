import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Landmark, Receipt, Wallet } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { payrollTrend } from "@/data/hrms";

export const Route = createFileRoute("/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll — StaffLink" },
      {
        name: "description",
        content:
          "Salary structures, allowances, deductions, loans, payslips and bank transfers in one payroll run.",
      },
      { property: "og:title", content: "Payroll — StaffLink" },
      {
        property: "og:description",
        content: "Salary structures, deductions, payslips and bank transfers.",
      },
    ],
  }),
  component: PayrollPage,
});

const periods = [
  { period: "June 2026", employees: 1244, gross: "$3,840,120", net: "$3,190,004", status: "In review" },
  { period: "May 2026", employees: 1231, gross: "$3,612,880", net: "$3,010,442", status: "Paid" },
  { period: "April 2026", employees: 1218, gross: "$3,684,310", net: "$3,070,118", status: "Paid" },
  { period: "March 2026", employees: 1202, gross: "$3,510,760", net: "$2,950,331", status: "Paid" },
];

function PayrollPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Payroll"
        title="Payroll periods"
        description="June cycle is calculated and awaiting finance approval."
        actions={<Button variant="secondary">Run payroll</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross payroll" value="$3.84M" delta="+6.4% MoM" icon={Wallet} tone="brand" />
        <StatCard label="Net payable" value="$3.19M" icon={Banknote} tone="success" />
        <StatCard label="Deductions & tax" value="$0.65M" icon={Receipt} tone="warning" />
        <StatCard label="Bank files ready" value="4 / 9" icon={Landmark} tone="info" />
      </div>

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Gross vs net (millions)</h2>
        <div className="mt-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={payrollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="gross" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="net" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold">Recent periods</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((p) => (
                <TableRow key={p.period}>
                  <TableCell className="text-sm font-medium">{p.period}</TableCell>
                  <TableCell className="text-sm tabular-nums">{p.employees}</TableCell>
                  <TableCell className="text-sm tabular-nums">{p.gross}</TableCell>
                  <TableCell className="text-sm tabular-nums">{p.net}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={p.status === "Paid" ? "border-success/40 text-success" : "border-warning/40 text-warning"}
                    >
                      {p.status}
                    </Badge>
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