import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  RefreshCw, FileSpreadsheet, FileText, Lock, 
  Wallet, TrendingUp, BadgeDollarSign, Award, AlertTriangle, Activity,
  Search, Filter, Columns, ArrowUp, ArrowUpDown, File, ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll — StaffLink" }
    ],
  }),
  component: PayrollPage,
});

const payrollData = [
  {
    name: "Abanob Vector Samy Boss",
    id: "221077",
    dept: "Administration",
    initials: "AV",
    color: "bg-[#ea580c]",
    basic: "0",
    gross: "0",
    insurance: "0",
    emergency: "0",
    daily: "0",
    p: "0", l: "0", a: "0",
    allowance: "+0",
    bonus: "+0",
    penalty: "-0",
    advances: "-0",
    net: "-220",
    kpi: "0%",
  },
  {
    name: "Abd Elaziz Khaled Abd Elaziz Ali",
    id: "120606",
    dept: "Administration",
    initials: "AE",
    color: "bg-[#ea580c]",
    basic: "0",
    gross: "0",
    insurance: "0",
    emergency: "0",
    daily: "0",
    p: "0", l: "0", a: "0",
    allowance: "+0",
    bonus: "+0",
    penalty: "-0",
    advances: "-0",
    net: "-220",
    kpi: "0%",
  }
];

function PayrollPage() {
  const [columns, setColumns] = useState({
    basic: true,
    gross: true,
    insurance: false,
    emergency: false,
    daily: true,
    attendance: true,
    allowance: true,
    bonus: true,
    penalty: true,
    advances: true,
    net: true,
    kpi: true,
    payslip: true,
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real attendance-, leave- and KPI-driven payroll for August 2026. Live preview · 22 working days.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full bg-surface">
            <RefreshCw className="mr-2 size-4" /> Refresh
          </Button>
          <Button variant="outline" className="rounded-full bg-surface">
            <FileSpreadsheet className="mr-2 size-4" /> Export Excel
          </Button>
          <Button variant="outline" className="rounded-full bg-surface">
            <FileText className="mr-2 size-4" /> Export CSV
          </Button>
          <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90">
            <Lock className="mr-2 size-4" /> Approve & lock
          </Button>
        </div>
      </div>

      <div className="surface-card p-4 rounded-xl border border-border flex items-center gap-3">
        <span className="text-sm text-muted-foreground mr-2">Period</span>
        <div className="flex items-center gap-2 border border-border rounded-full px-4 py-1.5 bg-background">
          <span className="text-sm font-medium">August</span>
          <ChevronDown className="size-4 text-muted-foreground ml-2" />
        </div>
        <div className="flex items-center gap-2 border border-border rounded-full px-4 py-1.5 bg-background">
          <span className="text-sm font-medium">2026</span>
          <ChevronDown className="size-4 text-muted-foreground ml-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl p-4 bg-[#f35b1d] text-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <Wallet className="size-4" /> Net Pay
          </div>
          <div className="text-2xl font-bold mt-2">EGP -12,630</div>
        </div>
        
        <div className="rounded-2xl p-4 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <TrendingUp className="size-4" /> Base
          </div>
          <div className="text-2xl font-bold mt-2">EGP 52,500</div>
        </div>

        <div className="rounded-2xl p-4 bg-info/10 border border-info/20 text-info shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-info/90 text-sm font-medium">
            <BadgeDollarSign className="size-4" /> Allowance
          </div>
          <div className="text-2xl font-bold mt-2">EGP 250</div>
        </div>

        <div className="rounded-2xl p-4 bg-success/10 border border-success/20 text-success shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-success/90 text-sm font-medium">
            <Award className="size-4" /> Bonus
          </div>
          <div className="text-2xl font-bold mt-2">EGP 0</div>
        </div>

        <div className="rounded-2xl p-4 bg-destructive/10 border border-destructive/20 text-destructive shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-destructive/90 text-sm font-medium">
            <AlertTriangle className="size-4" /> Penalty
          </div>
          <div className="text-2xl font-bold mt-2">EGP 0</div>
        </div>

        <div className="rounded-2xl p-4 bg-warning/20 border border-warning/30 text-foreground shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Activity className="size-4" /> KPI avg
          </div>
          <div className="text-2xl font-bold mt-2">0%</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full bg-surface border-border/50">
            <Filter className="mr-2 size-4" /> All <ChevronDown className="ml-2 size-3" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full bg-surface border-border/50">
                <Columns className="mr-2 size-4" /> Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-3 rounded-2xl">
              <div className="space-y-4">
                {[
                  { label: "Basic Salary", key: "basic" },
                  { label: "Gross Salary", key: "gross" },
                  { label: "Insurance Ceiling", key: "insurance" },
                  { label: "Emergency/Martyrs Fund", key: "emergency" },
                  { label: "Daily Rate", key: "daily" },
                  { label: "Attendance", key: "attendance" },
                  { label: "Allowance", key: "allowance" },
                  { label: "Bonus", key: "bonus" },
                  { label: "Penalty", key: "penalty" },
                  { label: "Advances", key: "advances" },
                  { label: "Net Pay", key: "net" },
                  { label: "KPI", key: "kpi" },
                  { label: "Payslip", key: "payslip" },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox 
                      checked={columns[item.key as keyof typeof columns]} 
                      onCheckedChange={(checked) => setColumns(prev => ({ ...prev, [item.key]: checked }))}
                      className="rounded-full data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" 
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-foreground/80">{item.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider">
                  <div className="flex items-center gap-1">Name <ArrowUp className="size-3" /></div>
                </TableHead>
                {columns.basic && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Basic<br/>Salary <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.gross && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Gross<br/>Salary <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.insurance && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Insurance<br/>Ceiling <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.emergency && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Emerg./<br/>Martyrs <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.daily && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Daily<br/>Rate <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.attendance && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex flex-col items-center leading-tight"><span>P /</span><span>L /</span><span>A</span></div>
                  </TableHead>
                )}
                {columns.allowance && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Allowance <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.bonus && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Bonus <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.penalty && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Penalty <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.advances && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Advances <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.net && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">Net<br/>Pay <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.kpi && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">KPI <ArrowUpDown className="size-3" /></div>
                  </TableHead>
                )}
                {columns.payslip && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">PAYSLIP</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/5">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${row.color}`}>
                        {row.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{row.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{row.id} · {row.dept}</p>
                      </div>
                    </div>
                  </TableCell>
                  {columns.basic && <TableCell className="text-center font-medium text-sm">{row.basic}</TableCell>}
                  {columns.gross && <TableCell className="text-center font-medium text-sm">{row.gross}</TableCell>}
                  {columns.insurance && <TableCell className="text-center font-medium text-sm">{row.insurance}</TableCell>}
                  {columns.emergency && <TableCell className="text-center font-medium text-sm">{row.emergency}</TableCell>}
                  {columns.daily && <TableCell className="text-center font-medium text-sm">{row.daily}</TableCell>}
                  {columns.attendance && (
                    <TableCell className="text-center text-xs font-mono flex flex-col justify-center items-center h-full">
                      <span className="text-success">{row.p}</span><span className="text-muted-foreground my-[-2px]">/</span><span className="text-destructive">{row.a}</span>
                    </TableCell>
                  )}
                  {columns.allowance && <TableCell className="text-center font-medium text-sm text-info">{row.allowance}</TableCell>}
                  {columns.bonus && <TableCell className="text-center font-medium text-sm text-success">{row.bonus}</TableCell>}
                  {columns.penalty && <TableCell className="text-center font-medium text-sm text-destructive">{row.penalty}</TableCell>}
                  {columns.advances && <TableCell className="text-center font-medium text-sm text-destructive">{row.advances}</TableCell>}
                  {columns.net && <TableCell className="text-center font-bold text-sm">{row.net}</TableCell>}
                  {columns.kpi && (
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0 rounded-full">{row.kpi}</Badge>
                    </TableCell>
                  )}
                  {columns.payslip && (
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" className="rounded-full text-xs h-8 bg-surface">
                        <File className="mr-1.5 size-3" /> PDF
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}