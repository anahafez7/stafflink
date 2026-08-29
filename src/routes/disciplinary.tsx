import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, AlertOctagon, Scale, FileText, CheckCircle2, Edit2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/export";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/disciplinary")({
  head: () => ({
    meta: [
      { title: "Disciplinary Actions — StaffLink" },
    ],
  }),
  component: DisciplinaryPage,
});

const disciplinaryCases = [
  { id: "CASE-092", employee: "Abanob Vector", employeeAr: "أبانوب فيكتور", type: "Verbal Warning", typeAr: "تنبيه شفهي", reason: "Repeated Lateness", reasonAr: "تكرار التأخر الصباحي", date: "10 أغسطس 2026", status: "Active", severity: "Low", icon: AlertOctagon },
  { id: "CASE-091", employee: "Ahmed Khaled", employeeAr: "أحمد خالد", type: "PIP", typeAr: "خطة تحسين أداء (PIP)", reason: "Performance Below Targets", reasonAr: "عدم تحقيق المستهدفات المطلوبة", date: "25 يوليو 2026", status: "In Progress", severity: "High", icon: Scale },
  { id: "CASE-089", employee: "Sarah Connor", employeeAr: "سارة كونور", type: "Written Warning", typeAr: "إنذار كتابي", reason: "Policy Violation", reasonAr: "مخالفة سياسات الشركة الداخلية", date: "12 مايو 2026", status: "Resolved", severity: "Medium", icon: FileText },
];

function DisciplinaryPage() {
  const { t, lang } = useI18n();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const statusTranslations: Record<string, string> = {
    "Active": "نشط / سارٍ",
    "In Progress": "قيد المتابعة",
    "Resolved": "تمت التسوية",
  };

  const severityTranslations: Record<string, string> = {
    "Low": "منخفض",
    "Medium": "متوسط",
    "High": "مرتفع",
    "Critical": "حرج",
  };

  const filteredCases = disciplinaryCases.filter(item => {
    const name = (lang === "ar" ? item.employeeAr : item.employee).toLowerCase();
    const type = (lang === "ar" ? item.typeAr : item.type).toLowerCase();
    const reason = (lang === "ar" ? item.reasonAr : item.reason).toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || type.includes(q) || reason.includes(q) || item.id.toLowerCase().includes(q);
  });

  const handleExportDisciplinary = () => {
    const headers = lang === "ar"
      ? ["رقم الحالة", "الموظف", "نوع الإجراء", "السبب / المخالفة", "تاريخ الإجراء", "درجة الخطورة", "الحالة"]
      : ["Case ID", "Employee", "Action Type", "Reason", "Date", "Severity", "Status"];

    const rows = filteredCases.map((item) => [
      item.id,
      lang === "ar" ? item.employeeAr : item.employee,
      lang === "ar" ? item.typeAr : item.type,
      lang === "ar" ? item.reasonAr : item.reason,
      item.date,
      lang === "ar" ? (severityTranslations[item.severity] || item.severity) : item.severity,
      lang === "ar" ? (statusTranslations[item.status] || item.status) : item.status,
    ]);

    downloadCsv(`StaffLink_Disciplinary_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير سجل الإجراءات التأديبية إلى Excel بنجاح" : "Disciplinary cases exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={lang === "ar" ? "مساحة العمل" : "Workspace"}
        title={lang === "ar" ? "الجزاءات والإجراءات التأديبية" : "Disciplinary Actions"}
        description={
          lang === "ar" 
            ? "إدارة الحالات والتحقيقات الداخلية والتنبيهات وخطط تحسين الأداء (PIP)." 
            : "Manage HR cases, warnings, and performance improvement plans."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportDisciplinary}
              className="border-border bg-background hover:bg-muted"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="me-2 size-4" /> 
              {lang === "ar" ? "تسجيل حالة جديدة" : "Log New Case"}
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "البحث عن الحالات أو الموظفين..." : "Search cases by employee or ID..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-start">{lang === "ar" ? "رقم الحالة" : "Case ID"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "الموظف" : "Employee"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "نوع الإجراء" : "Action Type"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "السبب / المخالفة" : "Reason"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "مستوى الأهمية" : "Severity"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "تاريخ التسجيل" : "Date Logged"}</TableHead>
              <TableHead className="text-start">{t("status", "Status")}</TableHead>
              <TableHead className="text-end">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id} className="hover:bg-muted/5">
                <TableCell className="font-medium tabular-nums">{caseItem.id}</TableCell>
                <TableCell>{lang === "ar" ? caseItem.employeeAr : caseItem.employee}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <caseItem.icon className="size-4 text-muted-foreground" />
                    <span>{lang === "ar" ? caseItem.typeAr : caseItem.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{lang === "ar" ? caseItem.reasonAr : caseItem.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    caseItem.severity === "High" ? "border-destructive/40 text-destructive" :
                    caseItem.severity === "Medium" ? "border-warning/40 text-warning" : "border-info/40 text-info"
                  }>
                    {lang === "ar" ? severityTranslations[caseItem.severity] : caseItem.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{caseItem.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    caseItem.status === "Resolved" ? "bg-success/10 text-success border-0" : 
                    caseItem.status === "Active" ? "bg-destructive/10 text-destructive border-0" : "bg-warning/10 text-warning border-0"
                  }>
                    {caseItem.status === "Resolved" && <CheckCircle2 className="me-1 size-3" />}
                    {lang === "ar" ? statusTranslations[caseItem.status] : caseItem.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(caseItem)} className="size-8 text-muted-foreground hover:text-foreground">
                    <Edit2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "تسجيل حالة جديدة" : "Log New Case"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? "توثيق إجراء تأديبي، إنذار كتابي، أو خطة تحسين أداء جديدة." 
                : "Record a new disciplinary action, warning, or performance plan."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الموظف" : "Employee"}</Label>
              <Input placeholder={lang === "ar" ? "ابحث عن الموظف..." : "Search employee..."} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "نوع الإجراء" : "Action Type"}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Verbal Warning">{lang === "ar" ? "تنبيه شفهي" : "Verbal Warning"}</option>
                  <option value="Written Warning">{lang === "ar" ? "إنذار كتابي" : "Written Warning"}</option>
                  <option value="PIP">{lang === "ar" ? "خطة تحسين أداء (PIP)" : "PIP"}</option>
                  <option value="Termination">{lang === "ar" ? "إنهاء خدمات" : "Termination"}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "مستوى الأهمية" : "Severity"}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Low">{lang === "ar" ? "منخفض" : "Low"}</option>
                  <option value="Medium">{lang === "ar" ? "متوسط" : "Medium"}</option>
                  <option value="High">{lang === "ar" ? "مرتفع" : "High"}</option>
                  <option value="Critical">{lang === "ar" ? "حرج" : "Critical"}</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "السبب والتفاصيل" : "Reason / Description"}</Label>
              <textarea 
                placeholder={lang === "ar" ? "أدخل تفاصيل الواقعة والقرارات المتخذة..." : "Provide details about the incident..."} 
                className="flex min-h-[100px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "تسجيل الحالة" : "Log Case"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "تحديث الحالة التأديبية" : "Update Case"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? `إدارة حالة الإجراء (${editingItem?.id}) للموظف ${editingItem?.employeeAr || editingItem?.employee}.` 
                : `Manage status and resolution for ${editingItem?.id}.`}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الموظف" : "Employee"}</Label>
              <Input defaultValue={lang === "ar" ? editingItem?.employeeAr : editingItem?.employee} disabled className="rounded-xl bg-muted opacity-70" />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "نوع الإجراء" : "Action Type"}</Label>
              <Input defaultValue={lang === "ar" ? editingItem?.typeAr : editingItem?.type} disabled className="rounded-xl bg-muted opacity-70" />
            </div>
            <div className="space-y-2">
              <Label>{t("status", "Status")}</Label>
              <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Active">{lang === "ar" ? "نشط / سارٍ" : "Active"}</option>
                <option value="In Progress">{lang === "ar" ? "قيد المتابعة" : "In Progress"}</option>
                <option value="Resolved">{lang === "ar" ? "تمت التسوية" : "Resolved"}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "ملاحظات وتوصيات الحل" : "Resolution Notes"}</Label>
              <textarea 
                placeholder={lang === "ar" ? "أدخل تفاصيل التزام الموظف والتسوية النهائية..." : "Add notes on how this was resolved..."} 
                className="flex min-h-[100px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "حفظ التحديثات" : "Save Updates"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
