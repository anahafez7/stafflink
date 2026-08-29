import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Briefcase, Building2, CalendarDays, CheckCircle2, Clock, CreditCard,
  FileText, Mail, MapPin, Package, Phone, Wallet,
  Crosshair, Download, Lock, Plus, QrCode, Tag, Upload, X, ChevronLeft, ChevronRight, Info, FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { attendanceHistory } from "@/data/modules";
import {
  employeeAdvances, employeeAttendanceSummary, employeeBalances, employeeCustody,
  employeeDocs, employeeLeaves, employeePayroll, employeeSite, getEmployee,
} from "@/data/employee-detail";
import type { EmployeeDoc } from "@/data/employee-detail";
import { downloadCsv, printTableAsPdf } from "@/lib/export";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/employees/$employeeId")({
  head: () => ({
    meta: [
      { title: "Employee profile — StaffLink HR" },
      { name: "description", content: "Full employee record: info, leaves, custody, attendance, advance payments, assigned worksite and documents." },
      { property: "og:title", content: "Employee profile — StaffLink HR" },
      { property: "og:description", content: "Employee info, leaves, custody, attendance, advances, location and documents." },
    ],
  }),
  component: EmployeeDetailPage,
});

const statusTone: Record<string, string> = {
  Active: "border-success/40 text-success",
  Approved: "border-success/40 text-success",
  Valid: "border-success/40 text-success",
  "In custody": "border-primary/40 text-primary",
  Pending: "border-warning/40 text-warning",
  Expiring: "border-warning/40 text-warning",
  "On Leave": "border-warning/40 text-warning",
  Rejected: "border-destructive/40 text-destructive",
  Expired: "border-destructive/40 text-destructive",
  Probation: "border-primary/40 text-primary",
};

const statusAr: Record<string, string> = {
  Active: "نشط",
  Approved: "معتمد",
  Valid: "سارٍ",
  "In custody": "في العهدة",
  Pending: "قيد المراجعة",
  Expiring: "ينتهي قريباً",
  "On Leave": "في إجازة",
  Rejected: "مرفوض",
  Expired: "منتهي الصلاحية",
  Probation: "فترة التجربة",
};

const roleTranslations: Record<string, string> = {
  "HR Business Partner": "شريك أعمال الموارد البشرية",
  "Engineering Lead": "قائد الفريق الهندسي",
  "Full-stack Developer": "مطور برمجيات شامل",
  "Product Designer": "مصمم تجربة المنتج",
  "Sales Manager": "مدير المبيعات",
  "Marketing Specialist": "أخصائي تسويق",
  "Accountant": "محاسب مالي",
  "Executive Assistant": "مساعد تنفيذي",
  "Operations Lead": "مسؤول العمليات",
};

const deptTranslations: Record<string, string> = {
  "Human Resources": "الموارد البشرية",
  "Engineering": "الهندسة البرمجية",
  "Design": "التصميم",
  "Sales": "المبيعات",
  "Marketing": "التسويق",
  "Finance": "المالية والحسابات",
  "Operations": "العمليات التشغيلية",
  "Administration": "الإدارة العامة",
};

const branchTranslations: Record<string, string> = {
  "Cairo HQ": "المقر الرئيسي بالقاهرة",
  "Alexandria Depot": "فرع الإسكندرية",
  "Dubai Office": "مكتب دبي",
  "Riyadh Warehouse": "مستودع الرياض",
  "Remote": "عن بُعد",
};

const docCategoryAr: Record<string, string> = {
  "Contract": "عقد عمل",
  "Identity": "إثبات هوية",
  "Certificate": "شهادة مؤهل",
  "Licence": "ترخيص / رخصة",
  "Benefit": "مزايا وتأمين",
  "Finance": "ماليات ومفردات",
  "Policy": "سياسات وإقرارات",
};

const tagAr: Record<string, string> = {
  "Manager": "مدير",
  "High performer": "أداء متميز",
  "Lead": "قائد فريق",
  "Core team": "الفريق الأساسي",
  "contract": "عقد",
  "identity": "هوية",
  "benefit": "تأمين",
};

function Pill({ value }: { value: string }) {
  const { lang } = useI18n();
  const label = lang === "ar" && statusAr[value] ? statusAr[value] : value;
  return (
    <Badge variant="outline" className={statusTone[value] ?? "text-muted-foreground"}>
      {label}
    </Badge>
  );
}

function Field({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value?: string | undefined }) {
  return (
    <div className="rounded-xl border border-border p-3 text-start">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

function EmployeeDetailPage() {
  const { t, lang } = useI18n();
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const employee = getEmployee(employeeId);
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchAt, setPunchAt] = useState<string | null>(null);
  const [punchMethod, setPunchMethod] = useState<"GPS" | "QR" | "Manual">("GPS");
  const [gps, setGps] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [todayPunches, setTodayPunches] = useState<
    { id: string; kind: "Check in" | "Check out"; time: string; method: string; source: string }[]
  >([]);
  const [selectedDay, setSelectedDay] = useState("today");

  const [docs, setDocs] = useState<(EmployeeDoc & { tags: string[] })[]>(() =>
    employee ? employeeDocs(employee).map((d) => ({ ...d, tags: [d.category] })) : [],
  );
  const [docQuery, setDocQuery] = useState("");
  const [tagTarget, setTagTarget] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [upload, setUpload] = useState({ name: "", category: "Contract", tags: "", expires: "" });
  const [payPeriod, setPayPeriod] = useState("August 2026");

  const data = useMemo(() => {
    if (!employee) return null;
    return {
      leaves: employeeLeaves(employee.id),
      balances: employeeBalances(employee.id),
      custody: employeeCustody(employee.id),
      advances: employeeAdvances(employee.id),
      docs: employeeDocs(employee),
      site: employeeSite(employee),
      summary: employeeAttendanceSummary(employee.id),
      punches: attendanceHistory.slice(-14).reverse(),
    };
  }, [employee]);

  const payroll = useMemo(
    () => (employee ? employeePayroll(employee, payPeriod) : null),
    [employee, payPeriod],
  );

  if (!employee || !data || !payroll) {
    return (
      <div className="space-y-5">
        <PageHeader 
          section={t("hr", "HR")} 
          title={lang === "ar" ? "لم يتم العثور على الموظف" : "Employee not found"} 
          description={lang === "ar" ? "هذا السجل غير متوفر في دليل الموظفين." : "This record no longer exists in the directory."} 
        />
        <Button variant="secondary" onClick={() => navigate({ to: "/hr" })}>
          <ArrowLeft className="size-4 rtl:rotate-180" />
          <span>{lang === "ar" ? "العودة لدليل الموظفين" : "Back to directory"}</span>
        </Button>
      </div>
    );
  }

  const togglePunch = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (punchMethod === "GPS" && !gps) {
      toast.error(lang === "ar" ? "يرجى التقاط إحداثيات GPS أولاً." : "Capture your GPS position first.");
      return;
    }
    if (punchMethod === "QR" && !qrCode.trim()) {
      toast.error(lang === "ar" ? "يرجى مسح أو إدخال رمز QR الخاص بالمقر." : "Scan or enter the worksite QR code first.");
      return;
    }
    const source = punchMethod === "GPS" ? (gps ?? "") : punchMethod === "QR" ? `QR ${qrCode.trim()}` : "Manual entry";
    const kind = punchedIn ? ("Check out" as const) : ("Check in" as const);
    setTodayPunches((prev) => [
      { id: `${kind}-${now}-${prev.length}`, kind, time: now, method: punchMethod, source },
      ...prev,
    ]);
    setPunchedIn((p) => !p);
    setPunchAt(now);
    setSelectedDay("today");
    toast.success(
      lang === "ar" 
        ? `تم تسجيل ${kind === "Check in" ? "الحضور" : "الانصراف"} في ${now} · ${data.site.name}` 
        : `${kind} at ${now} · ${data.site.name} · ${punchMethod}`
    );
  };

  const captureGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGps(data.site.coords);
      toast.info(lang === "ar" ? "نظام GPS غير متاح — تم اعتماد إحداثيات المقر." : "Device GPS unavailable — using worksite coordinates.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        setGps(coords);
        toast.success(lang === "ar" ? `تم التقاط الموقع · ${coords}` : `Position captured · ${coords}`);
      },
      () => {
        setGps(data.site.coords);
        toast.info(lang === "ar" ? "تعذر الوصول للموقع — تم اعتماد إحداثيات المقر." : "Location denied — falling back to worksite coordinates.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const filteredDocs = docs.filter((d) => {
    const q = docQuery.trim().toLowerCase();
    if (!q) return true;
    return [d.name, d.category, d.status, ...d.tags].join(" ").toLowerCase().includes(q);
  });

  const secureDownload = (name: string) => {
    const token = Math.random().toString(36).slice(2, 10).toUpperCase();
    toast.success(lang === "ar" ? `تم إنشاء رابط تحميل آمن لـ ${name}` : `Secure link generated for ${name}`, {
      description: lang === "ar" ? `رمز التوقيع ${token} · صالح لمدة 5 دقائق · تم تسجيل العملية` : `Signed token ${token} · expires in 5 minutes · access logged`,
    });
  };

  const addUpload = () => {
    if (!upload.name.trim()) {
      toast.error(lang === "ar" ? "يرجى اختيار ملف أو إدخال اسم المستند." : "Choose a file or enter a document name.");
      return;
    }
    const existing = docs.find((d) => d.name.toLowerCase() === upload.name.trim().toLowerCase());
    const version = existing ? `v${Number(existing.version.replace("v", "")) + 1}` : "v1";
    const tags = upload.tags ? upload.tags.split(",").map((t) => t.trim()).filter(Boolean) : [upload.category];
    const row = {
      name: upload.name.trim(),
      category: upload.category as EmployeeDoc["category"],
      version,
      size: `${120 + Math.floor(Math.random() * 900)} KB`,
      expires: upload.expires || "—",
      status: "Valid" as const,
      tags: tags.length ? tags : [upload.category],
    };
    setDocs((prev) => [row, ...prev.filter((d) => d.name !== row.name)]);
    setUpload({ name: "", category: "Contract", tags: "", expires: "" });
    setUploadOpen(false);
    toast.success(lang === "ar" ? `تم رفع ${row.name} · ${version} · قيد المعالجة (OCR)` : `${row.name} uploaded · ${version} · queued for OCR`);
  };

  const initials = employee.name.split(" ").map((p) => p[0]).join("");
  const outstanding = data.advances.reduce((s, a) => s + a.remaining, 0);

  const localizedRole = lang === "ar" ? (roleTranslations[employee.role] || employee.role) : employee.role;
  const localizedDept = lang === "ar" ? (deptTranslations[employee.department] || employee.department) : employee.department;
  const localizedBranch = lang === "ar" ? (branchTranslations[employee.branch] || employee.branch) : employee.branch;

  const handleExportProfile = () => {
    const headers = lang === "ar"
      ? ["البيان", "القيمة"]
      : ["Field", "Value"];

    const rows = [
      [lang === "ar" ? "الرقم الوظيفي" : "Employee ID", employee.id],
      [lang === "ar" ? "الاسم" : "Full Name", employee.name],
      [lang === "ar" ? "البريد الإلكتروني" : "Email", employee.email],
      [lang === "ar" ? "المسمى الوظيفي" : "Designation", localizedRole],
      [lang === "ar" ? "القسم" : "Department", localizedDept],
      [lang === "ar" ? "الفرع" : "Branch", localizedBranch],
      [lang === "ar" ? "تاريخ الانضمام" : "Join Date", employee.joined],
      [lang === "ar" ? "الحالة الوظيفية" : "Status", lang === "ar" ? (statusAr[employee.status] || employee.status) : employee.status],
      [lang === "ar" ? "الموقع المعين" : "Assigned Worksite", data.site.name],
      [lang === "ar" ? "أيام الحضور الفعلية" : "Days Present", `${data.summary.present}/${data.summary.workingDays}`],
      [lang === "ar" ? "السلف القائمة" : "Outstanding Advances", `${outstanding.toLocaleString()} EGP`],
    ];

    downloadCsv(`StaffLink_Employee_${employee.id}_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير الملف الوظيفي إلى Excel بنجاح" : "Employee record exported to Excel successfully");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section={`${t("hr", "HR")} · ${lang === "ar" ? "الملف الوظيفي" : "Employee Profile"}`}
        title={employee.name}
        description={`${employee.id} · ${localizedRole} · ${localizedDept} · ${localizedBranch}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportProfile}
              className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-400" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button asChild variant="outline" className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground">
              <Link to="/hr">
                <ArrowLeft className="size-4 rtl:rotate-180 me-2" />
                <span>{lang === "ar" ? "دليل الموظفين" : t("directoryTitle", "Directory")}</span>
              </Link>
            </Button>
          </div>
        }
      />

      <section className="surface-card flex flex-wrap items-center justify-between gap-4 p-4 text-start">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar className="size-14">
            {employee.avatar ? <AvatarImage src={employee.avatar} alt={employee.name} /> : null}
            <AvatarFallback className="bg-brand/10 text-brand font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <Pill value={employee.status} />
              {employee.tags.map((tg) => {
                const tgLabel = lang === "ar" && tagAr[tg] ? tagAr[tg] : tg;
                return (
                  <Badge key={tg} variant="secondary" className="text-[11px] font-normal">{tgLabel}</Badge>
                );
              })}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {employee.email} · {lang === "ar" ? `انضم في ${employee.joined}` : `joined ${employee.joined}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-border px-3 py-2 text-center">
            <p className="text-[11px] uppercase text-muted-foreground">{lang === "ar" ? "الحضور" : "Attendance"}</p>
            <p className="text-sm font-semibold tabular-nums">{data.summary.present}/{data.summary.workingDays}</p>
          </div>
          <div className="rounded-xl border border-border px-3 py-2 text-center">
            <p className="text-[11px] uppercase text-muted-foreground">{lang === "ar" ? "العهد" : "Custody"}</p>
            <p className="text-sm font-semibold">
              {data.custody.filter((c) => c.status === "In custody").length} {lang === "ar" ? "أصول" : "items"}
            </p>
          </div>
          <div className="rounded-xl border border-border px-3 py-2 text-center">
            <p className="text-[11px] uppercase text-muted-foreground">{lang === "ar" ? "السلف المستحقة" : "Advances due"}</p>
            <p className="text-sm font-semibold tabular-nums">
              {outstanding.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
            </p>
          </div>
        </div>
      </section>

      <Tabs defaultValue="info" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="info">{lang === "ar" ? "البيانات الأساسية" : "Info"}</TabsTrigger>
            <TabsTrigger value="leaves">{t("leaves", "Leaves")}</TabsTrigger>
            <TabsTrigger value="custody">{lang === "ar" ? "العهد والأصول" : "Custody"}</TabsTrigger>
            <TabsTrigger value="attendance">{t("attendance", "Attendance")}</TabsTrigger>
            <TabsTrigger value="advances">{lang === "ar" ? "السلف المالية" : "Advance payments"}</TabsTrigger>
            <TabsTrigger value="payroll">{lang === "ar" ? "الرواتب والمستحقات" : "Payroll"}</TabsTrigger>
            <TabsTrigger value="location">{lang === "ar" ? "الموقع الجغرافي" : "Location"}</TabsTrigger>
            <TabsTrigger value="documents">{lang === "ar" ? "إدارة المستندات" : t("documents", "Documents")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="space-y-4">
          <section className="surface-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-start">{lang === "ar" ? "البيانات الشخصية" : "Personal"}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field icon={Mail} label={t("email", "Email")} value={employee.email} />
              <Field icon={Mail} label={lang === "ar" ? "بريد إضافي" : "Extra email"} value={employee.extraEmail} />
              <Field icon={Phone} label={t("phone", "Phone")} value={employee.phone} />
              <Field label={lang === "ar" ? "النوع" : "Gender"} value={employee.gender === "Male" ? (lang === "ar" ? "ذكر" : "Male") : (lang === "ar" ? "أنثى" : "Female")} />
              <Field icon={MapPin} label={lang === "ar" ? "المدينة / الحي" : "City / district"} value={[employee.city, employee.district].filter(Boolean).join(" · ")} />
              <Field label={employee.idKind ?? (lang === "ar" ? "الرقم القومي" : "National ID")} value={employee.nationalId} />
              <Field label={lang === "ar" ? "تاريخ الإصدار" : "ID issue"} value={employee.idIssueDate} />
              <Field label={lang === "ar" ? "تاريخ الانتهاء" : "ID expiry"} value={employee.idExpiryDate} />
              <Field label={lang === "ar" ? "العنوان بالبطاقة" : "Address on ID"} value={employee.addressOnId} />
            </div>
          </section>
          <section className="surface-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-start">{lang === "ar" ? "بيانات العمل والتعاقد" : "Employment"}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field icon={Briefcase} label={t("position", "Position")} value={localizedRole} />
              <Field icon={Building2} label={t("department", "Department")} value={localizedDept} />
              <Field icon={MapPin} label={t("branch", "Branch")} value={localizedBranch} />
              <Field label={lang === "ar" ? "المدير المباشر" : "Manager"} value={employee.manager} />
              <Field label={lang === "ar" ? "نوع العقد" : "Contract type"} value={employee.type} />
              <Field icon={CalendarDays} label={lang === "ar" ? "مدة العقد" : "Contract period"} value={[employee.contractStart, employee.contractEnd].filter(Boolean).join(" → ")} />
              <Field label={lang === "ar" ? "التأمين الطبي" : "Medical insurance"} value={employee.medicalInsurance} />
              <Field label={lang === "ar" ? "التأمين الاجتماعي" : "Social insurance"} value={employee.socialInsuranceDate} />
              <Field label={lang === "ar" ? "الموقف التجنيدي" : "Military expiry"} value={employee.militaryExpireDate} />
            </div>
          </section>
          <section className="surface-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-start">{lang === "ar" ? "الراتب والمستحقات" : "Payroll"}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field icon={Wallet} label={lang === "ar" ? "طبيعة الراتب" : "Salary basis"} value={employee.salaryBasis} />
              <Field label={t("grossPay", "Gross")} value={employee.salaryGross} />
              <Field label={t("netPay", "Net")} value={employee.salaryNet} />
              <Field label={t("allowances", "Allowance")} value={employee.allowance} />
              <Field label={lang === "ar" ? "الهدف البيعي" : "Target"} value={[employee.targetValue, employee.targetDuration].filter(Boolean).join(" · ")} />
              <Field label={lang === "ar" ? "مؤمن عليه" : "Insured"} value={employee.isInsured ? (lang === "ar" ? "نعم" : "Yes") : (lang === "ar" ? "لا" : "No")} />
              <Field label={lang === "ar" ? "نسبة 5%" : "5% quota"} value={employee.disabilityQuota ? (lang === "ar" ? "نعم" : "Yes") : (lang === "ar" ? "لا" : "No")} />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <section className="grid gap-3 sm:grid-cols-3">
            {data.balances.map((b) => {
              const typeAr: Record<string, string> = {
                "Annual leave": "إجازة سنوية",
                "Casual leave": "إجازة عارضة",
                "Sick leave": "إجازة مرضية",
                "Unpaid leave": "إجازة بدون راتب",
              };
              const label = lang === "ar" && typeAr[b.type] ? typeAr[b.type] : b.type;
              return (
                <div key={b.type} className="surface-card p-4 text-start">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {lang === "ar" ? `${b.total - b.used} من ${b.total} متبقية` : `${b.total - b.used} of ${b.total} left`}
                    </span>
                  </div>
                  <Progress value={(b.used / b.total) * 100} className="mt-3 h-2" />
                </div>
              );
            })}
          </section>
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>{lang === "ar" ? "رقم الطلب" : "Request"}</TableHead>
                  <TableHead>{lang === "ar" ? "نوع الإجازة" : "Type"}</TableHead>
                  <TableHead>{lang === "ar" ? "الفترة" : "Period"}</TableHead>
                  <TableHead>{lang === "ar" ? "الأيام" : "Days"}</TableHead>
                  <TableHead>{lang === "ar" ? "الرصيد" : "Balance"}</TableHead>
                  <TableHead>{lang === "ar" ? "السبب" : "Reason"}</TableHead>
                  <TableHead className="text-end">{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.leaves.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium font-mono text-sm">{l.id}</TableCell>
                    <TableCell>{l.type}</TableCell>
                    <TableCell>{l.period}</TableCell>
                    <TableCell className="tabular-nums">{l.days}</TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">{l.balanceBefore} → {l.balanceAfter}</TableCell>
                    <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground">{l.reason}</TableCell>
                    <TableCell className="text-end"><Pill value={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="custody">
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>{lang === "ar" ? "الأصل / العهدة" : "Item"}</TableHead>
                  <TableHead>{lang === "ar" ? "الرقم التسلسلي" : "Serial"}</TableHead>
                  <TableHead>{lang === "ar" ? "الفئة" : "Category"}</TableHead>
                  <TableHead>{lang === "ar" ? "تاريخ التسليم" : "Assigned"}</TableHead>
                  <TableHead>{lang === "ar" ? "الحالة الفنية" : "Condition"}</TableHead>
                  <TableHead className="text-end">{lang === "ar" ? "حالة العهدة" : "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.custody.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <Package className="size-4 text-muted-foreground" />
                      {c.item}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{c.serial}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.assigned}</TableCell>
                    <TableCell>{c.condition}</TableCell>
                    <TableCell className="text-end"><Pill value={c.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <section className="surface-card">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="size-8 rounded-full">
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                </Button>
                <span className="text-base font-semibold">{lang === "ar" ? "يوليو 2026" : "July 2026"}</span>
                <Button variant="outline" size="icon" className="size-8 rounded-full">
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5"><span className="text-success font-semibold">0</span> <span className="text-muted-foreground">{lang === "ar" ? "حضور" : "present"}</span></div>
                <div className="flex items-center gap-1.5"><span className="text-warning font-semibold">0</span> <span className="text-muted-foreground">{lang === "ar" ? "تأخير" : "late"}</span></div>
                <div className="flex items-center gap-1.5"><span className="text-destructive font-semibold">20</span> <span className="text-muted-foreground">{lang === "ar" ? "غياب" : "absent"}</span></div>
                <div className="flex items-center gap-1.5"><span className="text-primary font-semibold">0</span> <span className="text-muted-foreground">{lang === "ar" ? "إجازة" : "leave"}</span></div>
                <div className="flex items-center gap-1.5 border-s border-border ps-4"><span className="font-semibold">20</span> <span className="text-muted-foreground">{lang === "ar" ? "أيام عمل" : "working days"}</span></div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="w-12 text-center ltr:pl-5 rtl:pr-5">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-xs uppercase font-semibold text-muted-foreground">{lang === "ar" ? "التاريخ" : "Date"}</TableHead>
                    <TableHead className="text-xs uppercase font-semibold text-muted-foreground">{lang === "ar" ? "اليوم" : "Day"}</TableHead>
                    <TableHead className="text-xs uppercase font-semibold text-muted-foreground">{lang === "ar" ? "تسجيل الحضور" : "Check in"}</TableHead>
                    <TableHead className="text-xs uppercase font-semibold text-muted-foreground">{lang === "ar" ? "تسجيل الانصراف" : "Check out"}</TableHead>
                    <TableHead className="text-xs uppercase font-semibold text-muted-foreground">{lang === "ar" ? "الساعات" : "Hours"}</TableHead>
                    <TableHead className="text-xs uppercase font-semibold text-muted-foreground">{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-end text-xs uppercase font-semibold text-muted-foreground ltr:pr-5 rtl:pl-5">{lang === "ar" ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "01-07-2026", day: "Wed", dayAr: "الأربعاء", in: "—", out: "—", hours: "—", status: "ABSENT", statusAr: "غياب", tone: "destructive", info: "Unexcused absence", infoAr: "غياب غير مبرر" },
                    { date: "02-07-2026", day: "Thu", dayAr: "الخميس", event: "June 30 Revolution", eventAr: "ثورة 30 يونيو", in: "—", out: "—", hours: "—", status: "HOLIDAY", statusAr: "عطلة رسمية", tone: "purple", info: "Public holiday", infoAr: "عطلة رسمية مدفوعة" },
                    { date: "03-07-2026", day: "Fri", dayAr: "الجمعة", in: "—", out: "—", hours: "—", status: "OFF", statusAr: "عطلة أسبوعية", tone: "secondary", info: "Regular day off", infoAr: "يوم الراحة الأسبوعية" },
                    { date: "04-07-2026", day: "Sat", dayAr: "السبت", in: "—", out: "—", hours: "—", status: "OFF", statusAr: "عطلة أسبوعية", tone: "secondary", info: "Regular day off", infoAr: "يوم الراحة الأسبوعية" },
                    { date: "05-07-2026", day: "Sun", dayAr: "الأحد", in: "—", out: "—", hours: "—", status: "ABSENT", statusAr: "غياب", tone: "destructive", info: "Unexcused absence", infoAr: "غياب غير مبرر" },
                    { date: "06-07-2026", day: "Mon", dayAr: "الاثنين", in: "—", out: "—", hours: "—", status: "ABSENT", statusAr: "غياب", tone: "destructive", info: "Unexcused absence", infoAr: "غياب غير مبرر" },
                  ].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="w-12 text-center ltr:pl-5 rtl:pr-5">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium text-sm tabular-nums">{row.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{lang === "ar" ? row.dayAr : row.day}</span>
                          {row.event && <span className="text-[11px] text-[#8b5cf6] font-medium">· {lang === "ar" ? row.eventAr : row.event}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.in}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.out}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.hours}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={
                              row.tone === "destructive" ? "bg-destructive/10 text-destructive hover:bg-destructive/10 border-transparent text-[10px] px-2 py-0.5 shadow-none font-bold" : 
                              row.tone === "purple" ? "bg-[#8b5cf6]/10 text-[#8b5cf6] hover:bg-[#8b5cf6]/10 border-transparent text-[10px] px-2 py-0.5 shadow-none font-bold" : 
                              "bg-secondary text-muted-foreground hover:bg-secondary border-transparent text-[10px] px-2 py-0.5 shadow-none font-bold"
                            }
                          >
                            {lang === "ar" ? row.statusAr : row.status}
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="size-3.5 text-muted-foreground/60 cursor-help hover:text-foreground transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{lang === "ar" ? row.infoAr : row.info}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-end text-muted-foreground ltr:pr-5 rtl:pl-5">—</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="advances" className="space-y-4">
          <section className="surface-card p-4 text-start">
            <p className="text-sm text-muted-foreground">{lang === "ar" ? "الرصيد المتبقي للسلف" : "Outstanding balance"}</p>
            <p className="text-2xl font-semibold tabular-nums mt-1">{outstanding.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}</p>
          </section>
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>{lang === "ar" ? "رقم السلفة" : "Reference"}</TableHead>
                  <TableHead>{lang === "ar" ? "المبلغ الإجمالي" : "Amount"}</TableHead>
                  <TableHead>{lang === "ar" ? "تاريخ الطلب" : "Requested"}</TableHead>
                  <TableHead>{lang === "ar" ? "عدد الأقساط" : "Installments"}</TableHead>
                  <TableHead>{lang === "ar" ? "المتبقي" : "Remaining"}</TableHead>
                  <TableHead className="text-end">{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.advances.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <CreditCard className="size-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{a.id}</span>
                    </TableCell>
                    <TableCell className="tabular-nums font-medium">{a.amount.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}</TableCell>
                    <TableCell>{a.requested}</TableCell>
                    <TableCell>{a.installments} {lang === "ar" ? "أشهر" : "months"}</TableCell>
                    <TableCell className="tabular-nums">{a.remaining.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}</TableCell>
                    <TableCell className="text-end"><Pill value={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <section className="surface-card flex flex-wrap items-end gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pay period</p>
              <Input
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value.slice(0, 40))}
                className="mt-1 h-9 max-w-[14rem]"
                aria-label="Pay period"
              />
            </div>
            <div className="rounded-xl border border-border px-4 py-2 text-center">
              <p className="text-[11px] uppercase text-muted-foreground">Earnings</p>
              <p className="text-sm font-semibold">EGP {payroll.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border px-4 py-2 text-center">
              <p className="text-[11px] uppercase text-muted-foreground">Deductions</p>
              <p className="text-sm font-semibold text-destructive">
                −EGP {payroll.totalDeductions.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-brand/40 bg-brand/5 px-4 py-2 text-center">
              <p className="text-[11px] uppercase text-muted-foreground">Net pay</p>
              <p className="text-sm font-semibold">EGP {payroll.net.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const ok = printTableAsPdf(
                    `Pay slip · ${payroll.period}`,
                    `${employee.name} · ${employee.id} · ${employee.department}`,
                    ["Component", "Type", "Amount (EGP)"],
                    [
                      ...payroll.earnings.map((l) => [l.label, "Earning", l.amount.toLocaleString()]),
                      ...payroll.deductions.map((l) => [l.label, "Deduction", `−${l.amount.toLocaleString()}`]),
                      ["Net pay", "Total", payroll.net.toLocaleString()],
                    ],
                  );
                  if (!ok) toast.error("Allow pop-ups to generate the pay slip.");
                }}
              >
                <Download className="size-4" />
                <span>Generate pay slip</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  downloadCsv(`payslip-${employee.id}-${payroll.period.replace(/\s+/g, "-").toLowerCase()}.csv`, [
                    ["Employee", employee.name],
                    ["Period", payroll.period],
                    [],
                    ["Component", "Type", "Amount"],
                    ...payroll.earnings.map((l) => [l.label, "Earning", l.amount]),
                    ...payroll.deductions.map((l) => [l.label, "Deduction", -l.amount]),
                    ["Net pay", "Total", payroll.net],
                  ]);
                  toast.success("Pay slip exported as CSV");
                }}
              >
                CSV
              </Button>
            </div>
          </section>

          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...payroll.earnings, ...payroll.deductions].map((line) => (
                  <TableRow key={`${line.kind}-${line.label}`}>
                    <TableCell className="font-medium">{line.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{line.kind}</TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${line.kind === "deduction" ? "text-destructive" : ""}`}
                    >
                      {line.kind === "deduction" ? "−" : ""}EGP {line.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-semibold">Net pay</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{payroll.period}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    EGP {payroll.net.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <section className="surface-card p-5 text-start">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{lang === "ar" ? "مقر العمل المخصص" : "Assigned worksite"}</p>
                <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="size-4 text-primary" />
                  {data.site.name}
                </h3>
                <p className="text-sm text-muted-foreground">{data.site.city} · {lang === "ar" ? `النطاق ${data.site.radius}` : `radius ${data.site.radius}`} · {data.site.coords}</p>
              </div>
              <Badge variant="outline" className={data.site.geofence ? "border-success/40 text-success" : "text-muted-foreground"}>
                {data.site.geofence ? (lang === "ar" ? "النطاق الجغرافي مفعّل" : "Geofence on") : (lang === "ar" ? "النطاق الجغرافي معطل" : "Geofence off")}
              </Badge>
            </div>
            <div className="mt-5 space-y-4 rounded-xl border border-border p-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{lang === "ar" ? "طريقة تسجيل البصمة" : "Punch method"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["GPS", "QR", "Manual"] as const).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={punchMethod === m ? "default" : "outline"}
                      className="rounded-lg"
                      onClick={() => setPunchMethod(m)}
                    >
                      {m === "GPS" ? <Crosshair className="size-4 me-1.5" /> : m === "QR" ? <QrCode className="size-4 me-1.5" /> : <Clock className="size-4 me-1.5" />}
                      <span>{m === "GPS" ? "GPS" : m === "QR" ? "QR" : (lang === "ar" ? "يدوي" : "Manual")}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {punchMethod === "GPS" ? (
                <div className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary/60 p-3">
                  <Crosshair className="size-4 text-primary" />
                  <p className="min-w-0 flex-1 text-sm">
                    {gps ? (lang === "ar" ? `تم التقاط الإحداثيات ${gps}` : `Captured ${gps}`) : (lang === "ar" ? "لم يتم التقاط الموقع بعد" : "No position captured yet")}
                    <span className="block text-xs text-muted-foreground">{lang === "ar" ? `نطاق السماح ${data.site.radius}` : `Geofence radius ${data.site.radius}`}</span>
                  </p>
                  <Button size="sm" variant="secondary" onClick={captureGps}>{lang === "ar" ? "التقاط GPS" : "Capture GPS"}</Button>
                </div>
              ) : null}

              {punchMethod === "QR" ? (
                <div className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary/60 p-3">
                  <QrCode className="size-4 text-primary" />
                  <Input
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value.slice(0, 32))}
                    placeholder={lang === "ar" ? "رمز QR الخاص بالمقر" : "Worksite QR code"}
                    aria-label="Worksite QR code"
                    className="h-9 min-w-0 flex-1 rounded-lg"
                  />
                  <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary">{lang === "ar" ? "مسح الرمز" : "Scan"}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>{lang === "ar" ? "مسح رمز QR الخاص بالمقر" : "Scan worksite QR"}</DialogTitle>
                        <DialogDescription>{lang === "ar" ? `وجه الكاميرا نحو ملصق QR في ${data.site.name}.` : `Point the camera at the QR poster at ${data.site.name}.`}</DialogDescription>
                      </DialogHeader>
                      <div className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border">
                        <QrCode className="size-16 text-muted-foreground" />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            const code = `${data.site.name.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
                            setQrCode(code);
                            setQrOpen(false);
                            toast.success(lang === "ar" ? `تم التقاط رمز QR · ${code}` : `QR captured · ${code}`);
                          }}
                        >
                          {lang === "ar" ? "محاكاة المسح" : "Simulate scan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Clock className="size-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {punchedIn 
                      ? (lang === "ar" ? "تم تسجيل الحضور حالياً" : "Currently checked in") 
                      : (lang === "ar" ? "لم يتم تسجيل الحضور اليوم" : "Not checked in")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {punchAt ? `${punchedIn ? (lang === "ar" ? "منذ" : "Since") : (lang === "ar" ? "آخر تسجيل" : "Last punch")} ${punchAt}` : (lang === "ar" ? "لا توجد بصمات مسجلة اليوم" : "No punch recorded today")}
                  </p>
                </div>
                <Button onClick={togglePunch} variant={punchedIn ? "destructive" : "default"}>
                  <CheckCircle2 className="size-4 me-1.5" />
                  <span>{punchedIn ? (lang === "ar" ? "تسجيل انصراف" : "Check out") : (lang === "ar" ? "تسجيل حضور" : "Check in")}</span>
                </Button>
              </div>
            </div>
          </section>

          <section className="surface-card p-5 text-start">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{lang === "ar" ? "سجل الحركات والبصمات" : "Punch history"}</h3>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                aria-label="Select day"
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
              >
                <option value="today">{lang === "ar" ? "اليوم" : "Today"}</option>
                {data.punches.map((p) => (
                  <option key={p.date} value={p.date}>{p.date}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-2">
              {selectedDay === "today" ? (
                todayPunches.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    {lang === "ar" ? "لم يتم تسجيل أي بصمات اليوم حتى الآن." : "No punches recorded today yet."}
                  </p>
                ) : (
                  todayPunches.map((p) => (
                    <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3">
                      <Badge variant="outline" className={p.kind === "Check in" ? "border-success/40 text-success" : "border-primary/40 text-primary"}>
                        {lang === "ar" ? (p.kind === "Check in" ? "حضور" : "انصراف") : p.kind}
                      </Badge>
                      <span className="text-sm font-semibold tabular-nums">{p.time}</span>
                      <span className="text-xs text-muted-foreground">{p.method} · {p.source}</span>
                    </div>
                  ))
                )
              ) : (
                (() => {
                  const day = data.punches.find((p) => p.date === selectedDay);
                  if (!day) return null;
                  return (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Field icon={Clock} label={lang === "ar" ? "تسجيل الحضور" : "Check in"} value={day.in} />
                      <Field icon={Clock} label={lang === "ar" ? "تسجيل الانصراف" : "Check out"} value={day.out} />
                      <Field label={lang === "ar" ? "عدد الساعات" : "Hours"} value={String(day.hours)} />
                      <Field icon={MapPin} label={lang === "ar" ? "الموقع" : "Location"} value={day.location ?? data.site.name} />
                    </div>
                  );
                })()
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <section className="surface-card flex flex-wrap items-center gap-3 p-4">
            <Input
              value={docQuery}
              onChange={(e) => setDocQuery(e.target.value.slice(0, 80))}
              placeholder={lang === "ar" ? "البحث في المستندات، الفئات، أو الوسوم..." : "Search documents or tags…"}
              aria-label="Search employee documents"
              className="h-10 min-w-0 flex-1 rounded-xl"
            />
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="size-4 me-1.5" />
                  <span>{lang === "ar" ? "رفع مستند جديد" : "Upload document"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md text-start">
                <DialogHeader>
                  <DialogTitle>{lang === "ar" ? "رفع مستند جديد" : "Upload document"}</DialogTitle>
                  <DialogDescription>
                    {lang === "ar" 
                      ? "يتم تشفير الملفات والاحتفاظ بالإصدارات وإرسالها للتعرف الضوئي (OCR)." 
                      : "Files are encrypted at rest, versioned and queued for OCR."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="doc-file">{lang === "ar" ? "الملف" : "File"}</Label>
                    <Input
                      id="doc-file"
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setUpload((u) => ({ ...u, name: f.name }));
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="doc-name">{lang === "ar" ? "اسم المستند" : "Document name"}</Label>
                    <Input
                      id="doc-name"
                      value={upload.name}
                      maxLength={80}
                      onChange={(e) => setUpload((u) => ({ ...u, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="doc-category">{lang === "ar" ? "الفئة" : "Category"}</Label>
                      <select
                        id="doc-category"
                        value={upload.category}
                        onChange={(e) => setUpload((u) => ({ ...u, category: e.target.value }))}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      >
                        {["Contract", "Identity", "Certificate", "Licence", "Benefit", "Finance", "Policy"].map((c) => (
                          <option key={c} value={c}>
                            {lang === "ar" && docCategoryAr[c] ? docCategoryAr[c] : c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="doc-expiry">{lang === "ar" ? "تاريخ الانتهاء" : "Expires"}</Label>
                      <Input
                        id="doc-expiry"
                        type="date"
                        value={upload.expires}
                        onChange={(e) => setUpload((u) => ({ ...u, expires: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="doc-tags">{lang === "ar" ? "الوسوم (مفصولة بفواصل)" : "Tags (comma separated)"}</Label>
                    <Input
                      id="doc-tags"
                      value={upload.tags}
                      maxLength={100}
                      placeholder={lang === "ar" ? "عقد, موثق, تم_الفحص" : "onboarding, signed, hr-verified"}
                      onChange={(e) => setUpload((u) => ({ ...u, tags: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setUploadOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
                  <Button onClick={addUpload}>{lang === "ar" ? "رفع المستند" : "Upload"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>{lang === "ar" ? "المستند" : "Document"}</TableHead>
                  <TableHead>{lang === "ar" ? "الفئة" : "Category"}</TableHead>
                  <TableHead>{lang === "ar" ? "الوسوم" : "Tags"}</TableHead>
                  <TableHead>{lang === "ar" ? "الإصدار" : "Version"}</TableHead>
                  <TableHead>{lang === "ar" ? "الحجم" : "Size"}</TableHead>
                  <TableHead>{lang === "ar" ? "تاريخ الانتهاء" : "Expires"}</TableHead>
                  <TableHead>{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-end">{lang === "ar" ? "الإجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      {lang === "ar" ? "لا توجد مستندات مطابقة لمعايير البحث." : "No documents match this search."}
                    </TableCell>
                  </TableRow>
                ) : null}
                {filteredDocs.map((d) => {
                  const catLabel = lang === "ar" && docCategoryAr[d.category] ? docCategoryAr[d.category] : d.category;
                  return (
                    <TableRow key={d.name}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <FileText className="size-4 text-muted-foreground" />
                        {d.name}
                      </TableCell>
                      <TableCell>{catLabel}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          {d.tags.map((tg) => {
                            const tgLabel = lang === "ar" && (tagAr[tg] || docCategoryAr[tg]) ? (tagAr[tg] || docCategoryAr[tg]) : tg;
                            return (
                              <Badge key={tg} variant="secondary" className="gap-1 text-[11px] font-normal">
                                {tgLabel}
                                <button
                                  type="button"
                                  aria-label={`Remove tag ${tg} from ${d.name}`}
                                  onClick={() =>
                                    setDocs((prev) =>
                                      prev.map((x) => (x.name === d.name ? { ...x, tags: x.tags.filter((y) => y !== tg) } : x)),
                                    )
                                  }
                                >
                                  <X className="size-3 ms-1 hover:text-destructive" />
                                </button>
                              </Badge>
                            );
                          })}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-6"
                            aria-label={`Add tag to ${d.name}`}
                            onClick={() => {
                              setTagTarget(d.name);
                              setNewTag("");
                            }}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{d.version}</TableCell>
                      <TableCell className="tabular-nums text-sm">{d.size}</TableCell>
                      <TableCell className="tabular-nums text-sm">{d.expires}</TableCell>
                      <TableCell><Pill value={d.status} /></TableCell>
                      <TableCell className="text-end">
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => secureDownload(d.name)}>
                          <Lock className="size-3.5 me-1 text-muted-foreground" />
                          <Download className="size-3.5 me-1.5" />
                          <span className="sr-only sm:not-sr-only">{lang === "ar" ? "تحميل آمن" : "Secure download"}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>

          <Dialog open={tagTarget !== null} onOpenChange={(o) => !o && setTagTarget(null)}>
            <DialogContent className="sm:max-w-sm text-start">
              <DialogHeader>
                <DialogTitle>{lang === "ar" ? "إضافة وسم جديد" : "Add tag"}</DialogTitle>
                <DialogDescription>{lang === "ar" ? "تُستخدم الوسوم لتسهيل البحث وقواعد الاحتفاظ بالمستندات." : "Tags power search, retention rules and bulk actions."}</DialogDescription>
              </DialogHeader>
              <div className="space-y-1.5">
                <Label htmlFor="new-tag">{lang === "ar" ? "اسم الوسم" : "Tag"}</Label>
                <Input id="new-tag" value={newTag} maxLength={24} onChange={(e) => setNewTag(e.target.value)} />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  onClick={() => {
                    const tag = newTag.trim();
                    if (!tag || !tagTarget) return;
                    setDocs((prev) =>
                      prev.map((x) =>
                        x.name === tagTarget && !x.tags.includes(tag) ? { ...x, tags: [...x.tags, tag] } : x,
                      ),
                    );
                    setTagTarget(null);
                    toast.success(lang === "ar" ? `تمت إضافة الوسم «${tag}»` : `Tagged “${tag}”`);
                  }}
                >
                  <Tag className="size-4 me-1.5" />
                  <span>{lang === "ar" ? "إضافة الوسم" : "Add tag"}</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
