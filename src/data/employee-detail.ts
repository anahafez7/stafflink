import { employees, type Employee } from "./hrms";
import { worksites } from "./modules";

export type CustodyItem = {
  id: string;
  item: string;
  serial: string;
  category: string;
  assigned: string;
  condition: "New" | "Good" | "Fair";
  status: "In custody" | "Returned";
};

export type AdvancePayment = {
  id: string;
  amount: number;
  requested: string;
  installments: string;
  remaining: number;
  status: "Active" | "Settled" | "Pending";
};

export type EmployeeLeave = {
  id: string;
  type: string;
  period: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  balanceBefore: number;
  balanceAfter: number;
};

export type EmployeeDoc = {
  name: string;
  category: string;
  version: string;
  size: string;
  expires: string;
  status: "Valid" | "Expiring" | "Expired";
};

const hash = (s: string) => s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);

export function getEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function employeeLeaves(id: string): EmployeeLeave[] {
  const h = hash(id);
  const base = [
    { type: "Annual", period: "18 – 22 Aug 2026", days: 5, status: "Pending" as const, reason: "Family trip, handover arranged." },
    { type: "Sick", period: "09 Jul 2026", days: 1, status: "Approved" as const, reason: "Fever, medical certificate attached." },
    { type: "Casual", period: "14 Jun 2026", days: 1, status: "Approved" as const, reason: "Government paperwork appointment." },
    { type: "Annual", period: "01 – 04 May 2026", days: 4, status: "Rejected" as const, reason: "Clashed with the payroll lock." },
  ];
  let balance = 21 - (h % 5);
  return base.map((b, i) => {
    const before = balance;
    const after = b.status === "Rejected" ? before : before - b.days;
    balance = after;
    return { id: `LV-${h + i * 13}`, ...b, balanceBefore: before, balanceAfter: after };
  });
}

export function employeeBalances(id: string) {
  const h = hash(id);
  return [
    { type: "Annual", used: 4 + (h % 6), total: 21 },
    { type: "Sick", used: h % 4, total: 12 },
    { type: "Casual", used: 1 + (h % 3), total: 7 },
  ];
}

export function employeeCustody(id: string): CustodyItem[] {
  const h = hash(id);
  return [
    { id: `CS-${h}`, item: "Dell Latitude 5540", serial: `DL-${1000 + (h % 900)}`, category: "Laptop", assigned: "11-02-2025", condition: "Good", status: "In custody" },
    { id: `CS-${h + 1}`, item: "iPhone 14", serial: `IP-${2000 + (h % 700)}`, category: "Mobile", assigned: "03-06-2025", condition: "Good", status: "In custody" },
    { id: `CS-${h + 2}`, item: "Access badge", serial: `BG-${3000 + (h % 500)}`, category: "Access", assigned: "19-09-2024", condition: "New", status: "In custody" },
    { id: `CS-${h + 3}`, item: "Company SIM", serial: `SIM-${4000 + (h % 400)}`, category: "Telecom", assigned: "08-01-2024", condition: "Fair", status: "Returned" },
  ];
}

export function employeeAdvances(id: string): AdvancePayment[] {
  const h = hash(id);
  return [
    { id: `ADV-${h}`, amount: 10000, requested: "02-06-2026", installments: "4 × EGP 2,500", remaining: 5000, status: "Active" },
    { id: `ADV-${h + 5}`, amount: 6000, requested: "14-01-2026", installments: "3 × EGP 2,000", remaining: 0, status: "Settled" },
    { id: `ADV-${h + 9}`, amount: 4000, requested: "01-08-2026", installments: "2 × EGP 2,000", remaining: 4000, status: "Pending" },
  ];
}

export function employeeSite(employee: Employee) {
  return worksites.find((w) => w.name.toLowerCase().startsWith(employee.branch.split(" ")[0]!.toLowerCase())) ?? worksites[0]!;
}

export function employeeDocs(employee: Employee): EmployeeDoc[] {
  return [
    { name: "Employment contract.pdf", category: "Contract", version: "v3", size: "482 KB", expires: employee.contractEnd || "14-03-2027", status: "Valid" },
    { name: "National ID scan.jpg", category: "Identity", version: "v2", size: "1.2 MB", expires: employee.idExpiryDate || "25-09-2026", status: "Expiring" },
    { name: "Medical insurance card.pdf", category: "Benefit", version: "v1", size: "310 KB", expires: "01-01-2027", status: "Valid" },
    { name: "Bank account letter.pdf", category: "Finance", version: "v1", size: "96 KB", expires: "—", status: "Valid" },
  ];
}

export function employeeAttendanceSummary(id: string) {
  const h = hash(id);
  return {
    present: 18 + (h % 3),
    late: h % 4,
    absent: h % 2,
    leave: 1 + (h % 3),
    workingDays: 22,
  };
}

export type PayrollLine = { label: string; amount: number; kind: "earning" | "deduction" };

export type EmployeePayroll = {
  period: string;
  gross: number;
  earnings: PayrollLine[];
  deductions: PayrollLine[];
  totalEarnings: number;
  totalDeductions: number;
  net: number;
};

const money = (n: number) => Math.round(n);

/** Deterministic pay slip breakdown derived from the employee record. */
export function employeePayroll(employee: Employee, period = "August 2026"): EmployeePayroll {
  const h = hash(employee.id);
  const gross = money(Number(employee.salaryGross?.replace(/[^\d.]/g, "")) || 14000 + (h % 9) * 1000);
  const allowance = money(Number(employee.allowance?.replace(/[^\d.]/g, "")) || gross * 0.1);
  const overtime = money((h % 5) * 250);
  const earnings: PayrollLine[] = [
    { label: "Basic salary", amount: gross, kind: "earning" },
    { label: "Allowances", amount: allowance, kind: "earning" },
    { label: "Overtime", amount: overtime, kind: "earning" },
  ];
  const base = gross + allowance + overtime;
  const social = employee.isInsured === false ? 0 : money(gross * 0.11);
  const tax = money((base - social) * 0.1);
  const advance = employeeAdvances(employee.id)
    .filter((a) => a.status === "Active")
    .reduce((sum, a) => sum + money(a.remaining / 4), 0);
  const absence = money(employeeAttendanceSummary(employee.id).absent * (gross / 22));
  const deductions: PayrollLine[] = [
    { label: "Social insurance", amount: social, kind: "deduction" },
    { label: "Income tax", amount: tax, kind: "deduction" },
    { label: "Advance installment", amount: advance, kind: "deduction" },
    { label: "Unpaid absence", amount: absence, kind: "deduction" },
  ];
  const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  return {
    period,
    gross,
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    net: totalEarnings - totalDeductions,
  };
}
