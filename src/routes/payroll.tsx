import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  RefreshCw, FileSpreadsheet, FileText, Lock, 
  Wallet, TrendingUp, BadgeDollarSign, Award, AlertTriangle, Activity,
  Search, Filter, Columns, ArrowUp, ArrowUpDown, File, ChevronDown, CheckCircle2, Download, Printer, X
} from "lucide-react";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/export";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";

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
    name: "Abanob Vector Samy",
    nameAr: "أبانوب فيكتور سامي",
    id: "221077",
    dept: "Administration",
    deptAr: "الإدارة العامة",
    bankAccount: "EG38000200010000000221077",
    bankName: "البنك الأهلي المصري (NBE)",
    initials: "AV",
    color: "bg-[#ea580c]",
    basic: 18000,
    gross: 22500,
    insurance: 2400,
    emergency: 225,
    daily: 818,
    p: 21, l: 1, a: 0,
    allowance: 3500,
    bonus: 1000,
    penalty: 0,
    advances: 0,
    net: 21875,
    kpi: "94%",
  },
  {
    name: "Abd Elaziz Khaled Ali",
    nameAr: "عبد العزيز خالد علي",
    id: "120606",
    dept: "Engineering",
    deptAr: "الهندسة البرمجية",
    bankAccount: "EG38000200010000000120606",
    bankName: "بنك مصر (Banque Misr)",
    initials: "AE",
    color: "bg-[#2563eb]",
    basic: 24000,
    gross: 30000,
    insurance: 2800,
    emergency: 300,
    daily: 1090,
    p: 22, l: 0, a: 0,
    allowance: 4500,
    bonus: 1500,
    penalty: 0,
    advances: 2000,
    net: 28400,
    kpi: "98%",
  },
  {
    name: "Sarah Connor",
    nameAr: "سارة كونور",
    id: "340912",
    dept: "Sales",
    deptAr: "المبيعات والتسويق",
    bankAccount: "EG38000200010000000340912",
    bankName: "البنك التجاري الدولي (CIB)",
    initials: "SC",
    color: "bg-[#10b981]",
    basic: 16000,
    gross: 20000,
    insurance: 2200,
    emergency: 200,
    daily: 727,
    p: 20, l: 2, a: 0,
    allowance: 2500,
    bonus: 2200,
    penalty: 0,
    advances: 0,
    net: 20300,
    kpi: "105%",
  },
  {
    name: "Ahmed Khaled Mansour",
    nameAr: "أحمد خالد منصور",
    id: "450183",
    dept: "Design",
    deptAr: "التصميم وتجربة المستخدم",
    bankAccount: "EG38000200010000000450183",
    bankName: "بنك QNB الأهلي",
    initials: "AK",
    color: "bg-[#8b5cf6]",
    basic: 19000,
    gross: 24000,
    insurance: 2500,
    emergency: 240,
    daily: 863,
    p: 19, l: 1, a: 2,
    allowance: 3000,
    bonus: 500,
    penalty: 1726,
    advances: 1000,
    net: 20534,
    kpi: "88%",
  },
  {
    name: "Hafez Rahim",
    nameAr: "حافظ رحيم",
    id: "100201",
    dept: "Leadership",
    deptAr: "الإدارة التنفيذية",
    bankAccount: "EG38000200010000000100201",
    bankName: "البنك التجاري الدولي (CIB)",
    initials: "HR",
    color: "bg-[#06b6d4]",
    basic: 35000,
    gross: 45000,
    insurance: 3500,
    emergency: 450,
    daily: 1590,
    p: 22, l: 0, a: 0,
    allowance: 7000,
    bonus: 3000,
    penalty: 0,
    advances: 0,
    net: 44050,
    kpi: "100%",
  }
];

const months = [
  { en: "January", ar: "يناير" },
  { en: "February", ar: "فبراير" },
  { en: "March", ar: "مارس" },
  { en: "April", ar: "أبريل" },
  { en: "May", ar: "مايو" },
  { en: "June", ar: "يونيو" },
  { en: "July", ar: "يوليو" },
  { en: "August", ar: "أغسطس" },
  { en: "September", ar: "سبتمبر" },
  { en: "October", ar: "أكتوبر" },
  { en: "November", ar: "نوفمبر" },
  { en: "December", ar: "ديسمبر" },
];

function PayrollPage() {
  const { t, lang } = useI18n();
  const [selectedMonth, setSelectedMonth] = useState("August");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

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

  const currencySymbol = lang === "ar" ? "ج.م" : "EGP";

  const filteredData = payrollData.filter((emp) => {
    const matchesDept = selectedDept === "ALL" || emp.dept === selectedDept;
    const name = (lang === "ar" ? emp.nameAr : emp.name).toLowerCase();
    const dept = (lang === "ar" ? emp.deptAr : emp.dept).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || dept.includes(q) || emp.id.includes(q);
    return matchesDept && matchesSearch;
  });

  // Calculate totals
  const totalNet = filteredData.reduce((acc, curr) => acc + curr.net, 0);
  const totalBasic = filteredData.reduce((acc, curr) => acc + curr.basic, 0);
  const totalAllowance = filteredData.reduce((acc, curr) => acc + curr.allowance, 0);
  const totalBonus = filteredData.reduce((acc, curr) => acc + curr.bonus, 0);
  const totalPenalty = filteredData.reduce((acc, curr) => acc + curr.penalty, 0);

  const handleApproveLock = () => {
    const monthName = lang === "ar" ? months.find(m => m.en === selectedMonth)?.ar : selectedMonth;
    toast.success(
      lang === "ar" 
        ? `تم اعتماد وقفل مسير رواتب شهر ${monthName} ${selectedYear} بنجاح` 
        : `Payroll for ${selectedMonth} ${selectedYear} approved and locked successfully`
    );
  };

  const handleExport = (type: "Excel" | "CSV") => {
    const headers = lang === "ar"
      ? ["الرقم الوظيفي", "الموظف", "القسم", "الراتب الأساسي", "البدلات", "المكافآت", "التأمينات", "الجزاءات", "السلف", "صافي الراتب", "الحساب البنكي"]
      : ["Employee ID", "Employee", "Department", "Basic Salary", "Allowances", "Bonus", "Insurance", "Penalties", "Advances", "Net Salary", "Bank Account"];

    const exportRows = filteredData.map((e) => [
      e.id,
      lang === "ar" ? e.nameAr : e.name,
      lang === "ar" ? e.deptAr : e.dept,
      e.basic,
      e.allowance,
      e.bonus,
      e.insurance,
      e.penalty,
      e.advances,
      e.net,
      e.bankAccount,
    ]);

    downloadCsv(`StaffLink_Payroll_${selectedMonth}_${selectedYear}.csv`, [headers, ...exportRows]);
    toast.success(
      lang === "ar" 
        ? `تم تصدير مسير الرواتب بصيغة ${type} (${filteredData.length} موظف) بنجاح` 
        : `Payroll exported as ${type} (${filteredData.length} records) successfully`
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "ar" ? "مسير الرواتب والمستحقات" : t("payrollTitle", "Payroll Management")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar" 
              ? `مسير الرواتب المعتمد على الحضور والإجازات ومؤشرات الأداء لشهر ${months.find(m => m.en === selectedMonth)?.ar || selectedMonth} ${selectedYear}. معاينة مباشرة · 22 يوم عمل.` 
              : `Real attendance-, leave- and KPI-driven payroll for ${selectedMonth} ${selectedYear}. Live preview · 22 working days.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => toast.info(lang === "ar" ? "تم تحديث البيانات" : "Data refreshed")} className="rounded-full bg-surface">
            <RefreshCw className="me-2 size-4" /> {lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
          <Button variant="outline" onClick={() => handleExport("Excel")} className="rounded-full bg-surface">
            <FileSpreadsheet className="me-2 size-4" /> {lang === "ar" ? "تصدير إكسيل" : "Export Excel"}
          </Button>
          <Button variant="outline" onClick={() => handleExport("CSV")} className="rounded-full bg-surface">
            <FileText className="me-2 size-4" /> {lang === "ar" ? "تصدير CSV" : "Export CSV"}
          </Button>
          <Button onClick={handleApproveLock} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Lock className="me-2 size-4" /> {lang === "ar" ? "اعتماد وقفل المسير" : t("lockPayroll", "Approve & lock")}
          </Button>
        </div>
      </div>

      <div className="surface-card p-4 rounded-2xl border border-border flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground me-2">
          {lang === "ar" ? "الفترة المالية المستهدفة:" : "Payroll Period:"}
        </span>
        <div className="relative">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex h-9 items-center justify-between rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            {months.map((m) => (
              <option key={m.en} value={m.en}>
                {lang === "ar" ? m.ar : m.en}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="flex h-9 items-center justify-between rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer tabular-nums"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="ms-auto flex items-center gap-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="me-1 size-3.5" />
            {lang === "ar" ? "حالة المسير: جاهز للاعتماد" : "Status: Ready for Approval"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl p-4 bg-brand text-brand-foreground shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <Wallet className="size-4" /> {lang === "ar" ? "صافي الرواتب" : t("netPay", "Net Pay")}
          </div>
          <div className="text-2xl font-bold mt-2 tabular-nums">
            {totalNet.toLocaleString()} {currencySymbol}
          </div>
        </div>
        
        <div className="rounded-2xl p-4 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <TrendingUp className="size-4" /> {lang === "ar" ? "الرواتب الأساسية" : "Base Salary"}
          </div>
          <div className="text-2xl font-bold mt-2 tabular-nums">
            {totalBasic.toLocaleString()} {currencySymbol}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-info/10 border border-info/20 text-info shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-info/90 text-sm font-medium">
            <BadgeDollarSign className="size-4" /> {lang === "ar" ? "إجمالي البدلات" : t("allowances", "Allowances")}
          </div>
          <div className="text-2xl font-bold mt-2 tabular-nums">
            {totalAllowance.toLocaleString()} {currencySymbol}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-success/10 border border-success/20 text-success shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-success/90 text-sm font-medium">
            <Award className="size-4" /> {lang === "ar" ? "المكافآت والحوافز" : "Bonuses"}
          </div>
          <div className="text-2xl font-bold mt-2 tabular-nums">
            {totalBonus.toLocaleString()} {currencySymbol}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-destructive/10 border border-destructive/20 text-destructive shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-destructive/90 text-sm font-medium">
            <AlertTriangle className="size-4" /> {lang === "ar" ? "الخصومات والجزاءات" : "Penalties"}
          </div>
          <div className="text-2xl font-bold mt-2 tabular-nums">
            {totalPenalty.toLocaleString()} {currencySymbol}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-warning/15 border border-warning/30 text-foreground shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Activity className="size-4" /> {lang === "ar" ? "متوسط الأداء (KPI)" : "KPI avg"}
          </div>
          <div className="text-2xl font-bold mt-2 tabular-nums">97%</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "بحث بالاسم، القسم، أو المعرّف..." : "Search by name, department, or ID..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="flex h-10 items-center justify-between rounded-full border border-border/50 bg-surface px-4 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="ALL">{lang === "ar" ? "جميع الأقسام" : "All Departments"}</option>
              <option value="Administration">{lang === "ar" ? "الإدارة العامة" : "Administration"}</option>
              <option value="Engineering">{lang === "ar" ? "الهندسة البرمجية" : "Engineering"}</option>
              <option value="Sales">{lang === "ar" ? "المبيعات والتسويق" : "Sales"}</option>
              <option value="Design">{lang === "ar" ? "التصميم وتجربة المستخدم" : "Design"}</option>
              <option value="Leadership">{lang === "ar" ? "الإدارة التنفيذية" : "Leadership"}</option>
            </select>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-full bg-surface border-border/50">
                <Columns className="me-2 size-4" /> {lang === "ar" ? "تخصيص الأعمدة" : "Columns"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align={lang === "ar" ? "start" : "end"} className="w-64 p-4 rounded-2xl">
              <div className="space-y-3 text-start">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {lang === "ar" ? "عرض / إخفاء الأعمدة" : "Toggle Columns"}
                </p>
                {[
                  { label: lang === "ar" ? "الراتب الأساسي" : "Basic Salary", key: "basic" },
                  { label: lang === "ar" ? "إجمالي الراتب الشامل" : "Gross Salary", key: "gross" },
                  { label: lang === "ar" ? "الحد التأميني" : "Insurance Ceiling", key: "insurance" },
                  { label: lang === "ar" ? "صندوق الشهداء / الطوارئ" : "Emergency/Martyrs Fund", key: "emergency" },
                  { label: lang === "ar" ? "أجر اليوم" : "Daily Rate", key: "daily" },
                  { label: lang === "ar" ? "سجل الحضور" : "Attendance", key: "attendance" },
                  { label: lang === "ar" ? "البدلات" : "Allowance", key: "allowance" },
                  { label: lang === "ar" ? "المكافآت" : "Bonus", key: "bonus" },
                  { label: lang === "ar" ? "الجزاءات والخصومات" : "Penalty", key: "penalty" },
                  { label: lang === "ar" ? "السلف" : "Advances", key: "advances" },
                  { label: lang === "ar" ? "صافي الراتب" : "Net Pay", key: "net" },
                  { label: lang === "ar" ? "مؤشر الأداء (KPI)" : "KPI", key: "kpi" },
                  { label: lang === "ar" ? "قسيمة الراتب" : "Payslip", key: "payslip" },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox 
                      checked={columns[item.key as keyof typeof columns]} 
                      onCheckedChange={(checked) => setColumns(prev => ({ ...prev, [item.key]: !!checked }))}
                      className="rounded-md data-[state=checked]:bg-brand data-[state=checked]:border-brand" 
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
                <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-start">
                  <div className="flex items-center gap-1">
                    {lang === "ar" ? "الموظف" : "Name"} <ArrowUp className="size-3" />
                  </div>
                </TableHead>
                {columns.basic && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "الأساسي" : "Basic"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.gross && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "الشامل" : "Gross"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.insurance && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "التأميني" : "Insurance"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.emergency && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "الشهداء" : "Emerg."} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.daily && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "أجر اليوم" : "Daily"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.attendance && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex flex-col items-center leading-tight">
                      <span>{lang === "ar" ? "حضور / إجازة / غياب" : "P / L / A"}</span>
                    </div>
                  </TableHead>
                )}
                {columns.allowance && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "البدلات" : "Allowance"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.bonus && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "المكافآت" : "Bonus"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.penalty && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "الجزاءات" : "Penalty"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.advances && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "السلف" : "Advances"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.net && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      {lang === "ar" ? "الصافي" : "Net Pay"} <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.kpi && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    <div className="flex items-center justify-center gap-1">
                      KPI <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                )}
                {columns.payslip && (
                  <TableHead className="py-4 font-semibold text-xs uppercase text-muted-foreground tracking-wider text-center">
                    {lang === "ar" ? "القسيمة" : "PAYSLIP"}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/5">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${row.color}`}>
                        {row.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {lang === "ar" ? row.nameAr : row.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {row.id} · {lang === "ar" ? row.deptAr : row.dept}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {columns.basic && (
                    <TableCell className="text-center font-medium text-sm tabular-nums">
                      {row.basic.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.gross && (
                    <TableCell className="text-center font-medium text-sm tabular-nums">
                      {row.gross.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.insurance && (
                    <TableCell className="text-center font-medium text-sm tabular-nums text-muted-foreground">
                      {row.insurance.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.emergency && (
                    <TableCell className="text-center font-medium text-sm tabular-nums text-muted-foreground">
                      {row.emergency.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.daily && (
                    <TableCell className="text-center font-medium text-sm tabular-nums">
                      {row.daily.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.attendance && (
                    <TableCell className="text-center text-xs font-mono">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-success font-semibold" title={lang === "ar" ? "أيام الحضور" : "Present"}>{row.p}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-info font-semibold" title={lang === "ar" ? "أيام الإجازة" : "Leave"}>{row.l}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-destructive font-semibold" title={lang === "ar" ? "أيام الغياب" : "Absent"}>{row.a}</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.allowance && (
                    <TableCell className="text-center font-medium text-sm text-info tabular-nums">
                      +{row.allowance.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.bonus && (
                    <TableCell className="text-center font-medium text-sm text-success tabular-nums">
                      +{row.bonus.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.penalty && (
                    <TableCell className="text-center font-medium text-sm text-destructive tabular-nums">
                      {row.penalty > 0 ? `-${row.penalty.toLocaleString()}` : "0"}
                    </TableCell>
                  )}
                  {columns.advances && (
                    <TableCell className="text-center font-medium text-sm text-destructive tabular-nums">
                      {row.advances > 0 ? `-${row.advances.toLocaleString()}` : "0"}
                    </TableCell>
                  )}
                  {columns.net && (
                    <TableCell className="text-center font-bold text-sm text-brand tabular-nums">
                      {row.net.toLocaleString()} {currencySymbol}
                    </TableCell>
                  )}
                  {columns.kpi && (
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={`border-0 rounded-full tabular-nums ${
                        parseInt(row.kpi) >= 95 ? "bg-success/10 text-success" :
                        parseInt(row.kpi) >= 90 ? "bg-brand/10 text-brand" : "bg-warning/10 text-warning"
                      }`}>
                        {row.kpi}
                      </Badge>
                    </TableCell>
                  )}
                  {columns.payslip && (
                    <TableCell className="text-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedPayslip(row)}
                        className="rounded-full text-xs h-8 bg-surface hover:bg-brand hover:text-brand-foreground transition-all"
                      >
                        <File className="me-1.5 size-3" /> {lang === "ar" ? "عرض القسيمة" : "Payslip"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detailed Payslip Modal */}
      <Sheet open={!!selectedPayslip} onOpenChange={(open) => !open && setSelectedPayslip(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader className="text-start border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">
                {lang === "ar" ? "قسيمة الراتب والمستحقات الشهرية" : "Monthly Payslip Breakdown"}
              </SheetTitle>
            </div>
            <SheetDescription>
              {lang === "ar" 
                ? `تفاصيل المستحقات والاستقطاعات لشهر ${months.find(m => m.en === selectedMonth)?.ar || selectedMonth} ${selectedYear}` 
                : `Earnings & Deductions for ${selectedMonth} ${selectedYear}`}
            </SheetDescription>
          </SheetHeader>

          {selectedPayslip && (
            <div className="py-6 space-y-6 text-start">
              {/* Employee Summary Card */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-center gap-4">
                <div className={`size-12 rounded-full flex items-center justify-center text-white font-bold text-base ${selectedPayslip.color}`}>
                  {selectedPayslip.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-foreground truncate">
                    {lang === "ar" ? selectedPayslip.nameAr : selectedPayslip.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ar" ? "الرقم التعريفي:" : "ID:"} <span className="tabular-nums font-mono font-medium">{selectedPayslip.id}</span> · {lang === "ar" ? selectedPayslip.deptAr : selectedPayslip.dept}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {lang === "ar" ? "الحساب البنكي:" : "Bank:"} {selectedPayslip.bankName}
                  </p>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {lang === "ar" ? "سجل الدوام والعمليات (22 يوم عمل)" : "Work Days & Attendance"}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-border bg-surface text-center">
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? "أيام الحضور" : "Present"}</p>
                    <p className="text-lg font-bold text-success mt-1 tabular-nums">{selectedPayslip.p}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface text-center">
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? "إجازات معتمدة" : "Approved Leaves"}</p>
                    <p className="text-lg font-bold text-info mt-1 tabular-nums">{selectedPayslip.l}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface text-center">
                    <p className="text-xs text-muted-foreground">{lang === "ar" ? "غياب غير مبرر" : "Absence"}</p>
                    <p className="text-lg font-bold text-destructive mt-1 tabular-nums">{selectedPayslip.a}</p>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Earnings */}
                <div className="p-4 rounded-2xl border border-success/20 bg-success/5 space-y-3">
                  <h4 className="font-bold text-sm text-success flex items-center gap-1.5">
                    <TrendingUp className="size-4" />
                    {lang === "ar" ? "الاستحقاقات والمزايا" : "Earnings"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "الراتب الأساسي" : "Basic Salary"}</span>
                      <span className="font-semibold tabular-nums">{selectedPayslip.basic.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "البدلات الثابتة" : "Allowances"}</span>
                      <span className="font-semibold tabular-nums text-info">+{selectedPayslip.allowance.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "الحوافز والمكافآت" : "Performance Bonus"}</span>
                      <span className="font-semibold tabular-nums text-success">+{selectedPayslip.bonus.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="border-t border-success/20 pt-2 flex justify-between font-bold text-sm text-foreground">
                      <span>{lang === "ar" ? "إجمالي الاستحقاقات" : "Total Gross"}</span>
                      <span className="tabular-nums">{(selectedPayslip.basic + selectedPayslip.allowance + selectedPayslip.bonus).toLocaleString()} {currencySymbol}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-3">
                  <h4 className="font-bold text-sm text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="size-4" />
                    {lang === "ar" ? "الاستقطاعات والخصومات" : "Deductions"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "التأمينات الاجتماعية" : "Social Insurance"}</span>
                      <span className="font-semibold tabular-nums text-destructive">-{selectedPayslip.insurance.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "صندوق الشهداء" : "Martyrs Fund"}</span>
                      <span className="font-semibold tabular-nums text-destructive">-{selectedPayslip.emergency.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "الجزاءات والغياب" : "Penalties"}</span>
                      <span className="font-semibold tabular-nums text-destructive">-{selectedPayslip.penalty.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === "ar" ? "أقساط السلف" : "Loan / Advance"}</span>
                      <span className="font-semibold tabular-nums text-destructive">-{selectedPayslip.advances.toLocaleString()} {currencySymbol}</span>
                    </div>
                    <div className="border-t border-destructive/20 pt-2 flex justify-between font-bold text-sm text-foreground">
                      <span>{lang === "ar" ? "إجمالي المستقطع" : "Total Deductions"}</span>
                      <span className="tabular-nums text-destructive">
                        -{(selectedPayslip.insurance + selectedPayslip.emergency + selectedPayslip.penalty + selectedPayslip.advances).toLocaleString()} {currencySymbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Card */}
              <div className="p-5 rounded-2xl bg-brand text-brand-foreground shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80 font-medium">{lang === "ar" ? "صافي الراتب المستحق للتحويل" : "Net Payable Amount"}</p>
                  <p className="text-3xl font-extrabold mt-1 tabular-nums">
                    {selectedPayslip.net.toLocaleString()} {currencySymbol}
                  </p>
                </div>
                <div className="text-end">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs px-3 py-1">
                    {lang === "ar" ? "تحويل بنكي مباشر" : "Direct Deposit"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="gap-2 border-t border-border pt-4">
            <Button 
              variant="outline" 
              onClick={() => toast.success(lang === "ar" ? "جاري تحضير الطباعة..." : "Printing payslip...")}
              className="rounded-full flex-1"
            >
              <Printer className="me-2 size-4" /> {lang === "ar" ? "طباعة القسيمة" : "Print"}
            </Button>
            <Button 
              onClick={() => toast.success(lang === "ar" ? "تم تحميل ملف PDF للقسيمة" : "Downloaded Payslip PDF")}
              className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90 flex-1"
            >
              <Download className="me-2 size-4" /> {lang === "ar" ? "تحميل PDF" : "Download PDF"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}