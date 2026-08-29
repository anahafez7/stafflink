import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, UserMinus, Search, CheckCircle2, Circle, Clock, Edit2, FileSpreadsheet } from "lucide-react";
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

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding & Offboarding — StaffLink" },
    ],
  }),
  component: OnboardingPage,
});

const onboardingList = [
  { id: "EMP-2026-081", name: "David Miller", nameAr: "ديفيد ميلر", role: "Frontend Developer", roleAr: "مطور واجهات أمامية", dept: "Engineering", deptAr: "الهندسة البرمجية", type: "Onboarding", date: "15 أغسطس 2026", progress: 75, status: "In Progress" },
  { id: "EMP-2026-060", name: "Sarah Connor", nameAr: "سارة كونور", role: "Sales Manager", roleAr: "مدير مبيعات", dept: "Sales", deptAr: "المبيعات", type: "Offboarding", date: "20 أغسطس 2026", progress: 20, status: "Action Required" },
  { id: "EMP-2026-082", name: "Ahmed Khaled", nameAr: "أحمد خالد", role: "UX Designer", roleAr: "مصمم تجربة المستخدم", dept: "Design", deptAr: "التصميم", type: "Onboarding", date: "01 أغسطس 2026", progress: 100, status: "Completed" },
];

function OnboardingPage() {
  const { t, lang } = useI18n();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<"Onboarding" | "Offboarding">("Onboarding");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenAdd = (type: "Onboarding" | "Offboarding") => {
    setAddType(type);
    setIsAddOpen(true);
  };

  const statusTranslations: Record<string, string> = {
    "Completed": "مكتمل",
    "In Progress": "قيد التنفيذ",
    "Action Required": "مطلوب إجراء",
  };

  const typeTranslations: Record<string, string> = {
    "Onboarding": "تهيئة موظف جديد",
    "Offboarding": "إنهاء خدمة وتسليم",
  };

  const filteredList = onboardingList.filter(item => {
    const name = lang === "ar" ? item.nameAr : item.name;
    const role = lang === "ar" ? item.roleAr : item.role;
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || role.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });

  const handleExportOnboarding = () => {
    const headers = lang === "ar"
      ? ["الرقم الوظيفي", "الموظف", "المسمى الوظيفي", "القسم", "نوع الإجراء", "التاريخ", "نسبة الإنجاز", "الحالة"]
      : ["Employee ID", "Name", "Role", "Department", "Type", "Target Date", "Progress (%)", "Status"];

    const rows = filteredList.map((item) => [
      item.id,
      lang === "ar" ? item.nameAr : item.name,
      lang === "ar" ? item.roleAr : item.role,
      lang === "ar" ? item.deptAr : item.dept,
      lang === "ar" ? (typeTranslations[item.type] || item.type) : item.type,
      item.date,
      `${item.progress}%`,
      lang === "ar" ? (statusTranslations[item.status] || item.status) : item.status,
    ]);

    downloadCsv(`StaffLink_Onboarding_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير سجلات التهيئة وإخلاء الطرف إلى Excel بنجاح" : "Onboarding/Offboarding exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={lang === "ar" ? "مساحة العمل" : "Workspace"}
        title={lang === "ar" ? "التهيئة ومغادرة العمل" : "Onboarding & Offboarding"}
        description={
          lang === "ar" 
            ? "متابعة مسار انضمام الموظفين الجدد وإجراءات إخلاء الطرف وتسليم العهد للمغادرين." 
            : "Track the lifecycle progress of new hires and departing employees."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportOnboarding}
              className="rounded-full border-border bg-surface hover:bg-muted"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button variant="outline" onClick={() => handleOpenAdd("Offboarding")} className="rounded-full bg-surface border-border/50">
              <UserMinus className="me-2 size-4" /> 
              {lang === "ar" ? "بدء إنهاء الخدمة" : "Start Offboarding"}
            </Button>
            <Button onClick={() => handleOpenAdd("Onboarding")} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <UserPlus className="me-2 size-4" /> 
              {lang === "ar" ? "بدء تهيئة موظف" : "Start Onboarding"}
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
            placeholder={lang === "ar" ? "البحث عن الموظفين أو المعرّف..." : "Search employees..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-start">{lang === "ar" ? "الموظف" : "Employee"}</TableHead>
              <TableHead className="text-start">{t("department", "Department")}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "نوع الإجراء" : "Type"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "تاريخ السريان" : "Effective Date"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "نسبة الإنجاز" : "Progress"}</TableHead>
              <TableHead className="text-start">{t("status", "Status")}</TableHead>
              <TableHead className="text-end">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/5">
                <TableCell>
                  <div>
                    <p className="font-medium text-sm text-foreground">{lang === "ar" ? item.nameAr : item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? item.roleAr : item.role}</p>
                  </div>
                </TableCell>
                <TableCell>{lang === "ar" ? item.deptAr : item.dept}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    item.type === "Onboarding" ? "bg-info/10 text-info border-0" : "bg-warning/10 text-warning border-0"
                  }>
                    {lang === "ar" ? typeTranslations[item.type] : item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{item.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className={`h-full rounded-full ${item.progress === 100 ? 'bg-success' : 'bg-brand'}`} 
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                    <span className="text-xs font-medium tabular-nums">{item.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    item.status === "Completed" ? "border-success/40 text-success" :
                    item.status === "In Progress" ? "border-info/40 text-info" : "border-destructive/40 text-destructive"
                  }>
                    {item.status === "Completed" && <CheckCircle2 className="me-1 size-3" />}
                    {item.status === "In Progress" && <Clock className="me-1 size-3" />}
                    {item.status === "Action Required" && <Circle className="me-1 size-3 text-destructive fill-destructive/20" />}
                    {lang === "ar" ? statusTranslations[item.status] : item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)} className="size-8 text-muted-foreground hover:text-foreground">
                    <Edit2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="text-start">
            <SheetTitle>
              {lang === "ar" 
                ? (addType === "Onboarding" ? "بدء تهيئة موظف جديد" : "بدء إجراءات مغادرة العمل") 
                : `Start ${addType}`}
            </SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? "إسناد قائمة المهام والوثائق الإلزامية للموظف المعني." 
                : `Initiate a new ${addType.toLowerCase()} process for an employee.`}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الموظف" : "Employee"}</Label>
              <Input placeholder={lang === "ar" ? "ابحث عن اسم الموظف..." : "Search employee..."} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "نوع الإجراء" : "Type"}</Label>
                <Input value={lang === "ar" ? typeTranslations[addType] : addType} disabled className="rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "تاريخ السريان" : "Effective Date"}</Label>
                <Input type="date" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "نموذج قائمة المهام" : "Assign Template"}</Label>
              <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>{lang === "ar" ? "قائمة المهام القياسية" : `Standard ${addType} Checklist`}</option>
                <option>{lang === "ar" ? "قائمة مهام الإدارة التنفيذية" : `Executive ${addType} Checklist`}</option>
                <option>{lang === "ar" ? "قائمة مهام المتعاقدين" : `Contractor ${addType} Checklist`}</option>
              </select>
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "بدء الإجراء" : "Start Process"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "تحديث نسبة الإنجاز" : "Update Progress"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? `تحديث حالة ومراحل الإجراء للموظف ${editingItem?.nameAr || editingItem?.name}.` 
                : `Update the ${editingItem?.type.toLowerCase()} status for ${editingItem?.name}.`}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الموظف" : "Employee"}</Label>
              <Input defaultValue={lang === "ar" ? editingItem?.nameAr : editingItem?.name} disabled className="rounded-xl bg-muted opacity-70" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "نسبة الإنجاز (%)" : "Progress (%)"}</Label>
                <Input type="number" defaultValue={editingItem?.progress} min="0" max="100" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>{t("status", "Status")}</Label>
                <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="In Progress">{lang === "ar" ? "قيد التنفيذ" : "In Progress"}</option>
                  <option value="Action Required">{lang === "ar" ? "مطلوب إجراء" : "Action Required"}</option>
                  <option value="Completed">{lang === "ar" ? "مكتمل" : "Completed"}</option>
                </select>
              </div>
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "حفظ التعديلات" : "Save Updates"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
