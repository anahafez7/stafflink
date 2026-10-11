import { Download, FileSpreadsheet, Plus, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { employeePayroll } from "@/data/employee-detail";
import type { Employee } from "@/data/hrms";
import { downloadCsv, printTableAsPdf } from "@/lib/export";
import { useNotifications } from "@/lib/notifications";
import { useSharedState } from "@/lib/shared-store";

type Slip = { period: string; generatedAt: string; sentAt?: string };

const seed: Slip[] = ["August 2026", "July 2026", "June 2026", "May 2026"].map((period, i) => ({
  period,
  generatedAt: `${28 - i}-${String(8 - i).padStart(2, "0")}-2026`,
}));

const stamp = () => new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

export function PayslipHistory({
  employee,
  period,
  onSelect,
}: {
  employee: Employee;
  period: string;
  onSelect: (period: string) => void;
}) {
  const [slips, setSlips] = useSharedState<Slip[]>(`stafflink.payslips.${employee.id}`, seed);
  const { notify } = useNotifications();

  const pdf = (p: string) => {
    const pay = employeePayroll(employee, p);
    printTableAsPdf(`Pay slip · ${pay.period}`, `${employee.name} · ${employee.id} · ${employee.role}`, ["Item", "Type", "Amount (EGP)"], [
      ...pay.earnings.map((l) => [l.label, "Earning", l.amount.toLocaleString()]),
      ...pay.deductions.map((l) => [l.label, "Deduction", `−${l.amount.toLocaleString()}`]),
      ["Net pay", "Total", pay.net.toLocaleString()],
    ]);
  };
  const csv = (p: string) => {
    const pay = employeePayroll(employee, p);
    downloadCsv(`payslip-${employee.id}-${p.replace(/\s+/g, "-").toLowerCase()}.csv`, [
      ["Employee", employee.name],
      ["Period", p],
      ["Item", "Type", "Amount"],
      ...pay.earnings.map((l) => [l.label, "Earning", l.amount]),
      ...pay.deductions.map((l) => [l.label, "Deduction", -l.amount]),
      ["Net pay", "Total", pay.net],
    ]);
  };
  const generate = () => {
    if (slips.some((s) => s.period === period)) {
      toast.info(`A pay slip for ${period} already exists.`);
      return;
    }
    setSlips((prev) => [{ period, generatedAt: stamp() }, ...prev]);
    toast.success(`Pay slip generated for ${period}`);
  };
  const resend = () => {
    const latest = slips[0];
    if (!latest) return;
    setSlips((prev) => prev.map((s, i) => (i === 0 ? { ...s, sentAt: stamp() } : s)));
    notify("documents", "Pay slip sent", `${latest.period} pay slip re-sent to ${employee.email}.`, latest.period);
    toast.success(`${latest.period} pay slip re-sent to ${employee.email}`);
  };

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">Pay slips history</h3>
          <p className="text-xs text-muted-foreground">Select a period to view its breakdown above.</p>
        </div>
        <Button size="sm" variant="outline" onClick={generate}>
          <Plus className="size-4" />
          <span>Generate {period}</span>
        </Button>
        <Button size="sm" onClick={resend} disabled={slips.length === 0}>
          <Send className="size-4" />
          <span>Resend latest</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Generated</TableHead>
              <TableHead className="text-right">Net pay</TableHead>
              <TableHead>Last sent</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slips.map((s) => (
              <TableRow
                key={s.period}
                className={`cursor-pointer ${s.period === period ? "bg-primary/5" : ""}`}
                onClick={() => onSelect(s.period)}
              >
                <TableCell className="font-medium">{s.period}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{s.generatedAt}</TableCell>
                <TableCell className="text-right tabular-nums">
                  EGP {employeePayroll(employee, s.period).net.toLocaleString()}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{s.sentAt ?? "—"}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" aria-label={`PDF ${s.period}`} onClick={() => pdf(s.period)}>
                    <Download className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`CSV ${s.period}`} onClick={() => csv(s.period)}>
                    <FileSpreadsheet className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
