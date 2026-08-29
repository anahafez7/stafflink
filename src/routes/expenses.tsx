import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Receipt, CreditCard, Banknote, Coffee, Car, Edit2, UploadCloud, FileSpreadsheet } from "lucide-react";
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

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expense Claims — StaffLink" },
    ],
  }),
  component: ExpensesPage,
});

const expenses = [
  { id: "EXP-2026-081", employee: "Abanob Vector", employeeAr: "أبانوب فيكتور", category: "Travel", categoryAr: "سفر وانتقالات", icon: Car, amount: 1250, date: "12 أغسطس 2026", status: "Pending", receipt: "Attached" },
  { id: "EXP-2026-080", employee: "Ahmed Khaled", employeeAr: "أحمد خالد", category: "Meals", categoryAr: "وجبات وضيافة", icon: Coffee, amount: 450, date: "10 أغسطس 2026", status: "Approved", receipt: "Attached" },
  { id: "EXP-2026-079", employee: "Sarah Connor", employeeAr: "سارة كونور", category: "Office Supplies", categoryAr: "أدوات ومستلزمات مكتبية", icon: Receipt, amount: 3400, date: "05 أغسطس 2026", status: "Rejected", receipt: "Missing" },
];

function ExpensesPage() {
  const { t, lang } = useI18n();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const statusTranslations: Record<string, string> = {
    "Approved": "معتمد",
    "Pending": "قيد المراجعة",
    "Rejected": "مرفوض",
  };

  const receiptTranslations: Record<string, string> = {
    "Attached": "مرفق",
    "Missing": "غير مرفق",
  };

  const filteredExpenses = expenses.filter(exp => {
    const name = lang === "ar" ? exp.employeeAr : exp.employee;
    const cat = lang === "ar" ? exp.categoryAr : exp.category;
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || cat.toLowerCase().includes(q) || exp.id.toLowerCase().includes(q);
  });

  const handleExportExpenses = () => {
    const headers = lang === "ar"
      ? ["رقم المطالبة", "الموظف", "الفئة", "المبلغ (ج.م)", "التاريخ", "حالة الإيصال", "حالة الاعتماد"]
      : ["Claim ID", "Employee", "Category", "Amount", "Date", "Receipt Status", "Approval Status"];

    const rows = filteredExpenses.map((e) => [
      e.id,
      lang === "ar" ? e.employeeAr : e.employee,
      lang === "ar" ? e.categoryAr : e.category,
      e.amount,
      e.date,
      e.receipt,
      lang === "ar" ? (statusTranslations[e.status] || e.status) : e.status,
    ]);

    downloadCsv(`StaffLink_Expenses_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير مطالبات المصروفات إلى ملف Excel بنجاح" : "Expense claims exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={t("selfService", "Self Service")}
        title={lang === "ar" ? "مطالبات المصروفات والعهد" : "Expense Claims"}
        description={
          lang === "ar"
            ? "تقديم ومراجعة مطالبات استرداد المصروفات، البدلات والفواتير التشغيلية."
            : "Submit and review employee reimbursement claims and expense reports."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportExpenses}
              className="border-border bg-background hover:bg-muted"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="me-2 size-4" /> 
              {lang === "ar" ? "تقديم مطالبة مصروفات" : "Submit Claim"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-xl bg-brand/10 text-brand">
              <Banknote className="size-5" />
            </div>
            <span className="font-medium">{lang === "ar" ? "إجمالي المعلق" : "Total Pending"}</span>
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {lang === "ar" ? "1,250 ج.م" : "EGP 1,250"}
          </div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <CreditCard className="size-5" />
            </div>
            <span className="font-medium">{lang === "ar" ? "المسترد هذا الشهر" : "Reimbursed This Month"}</span>
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {lang === "ar" ? "14,300 ج.م" : "EGP 14,300"}
          </div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
              <Receipt className="size-5" />
            </div>
            <span className="font-medium">{lang === "ar" ? "فواتير غير مرفقة" : "Missing Receipts"}</span>
          </div>
          <div className="text-3xl font-bold tabular-nums">1</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "البحث في المطالبات أو اسم الموظف..." : "Search claims..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-start">{lang === "ar" ? "رقم المطالبة" : "Claim ID"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "الموظف" : "Employee"}</TableHead>
              <TableHead className="text-start">{t("category", "Category")}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "المبلغ" : "Amount"}</TableHead>
              <TableHead className="text-start">{t("date", "Date")}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "الإيصال" : "Receipt"}</TableHead>
              <TableHead className="text-start">{t("status", "Status")}</TableHead>
              <TableHead className="text-end">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/5">
                <TableCell className="font-medium tabular-nums">{expense.id}</TableCell>
                <TableCell>{lang === "ar" ? expense.employeeAr : expense.employee}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <expense.icon className="size-4 text-muted-foreground" />
                    <span>{lang === "ar" ? expense.categoryAr : expense.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold tabular-nums">
                  {lang === "ar" ? `${expense.amount.toLocaleString()} ج.م` : `EGP ${expense.amount.toLocaleString()}`}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{expense.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    expense.receipt === "Attached" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"
                  }>
                    {lang === "ar" ? receiptTranslations[expense.receipt] : expense.receipt}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    expense.status === "Approved" ? "border-success/40 text-success" :
                    expense.status === "Pending" ? "border-warning/40 text-warning" : "border-destructive/40 text-destructive"
                  }>
                    {lang === "ar" ? statusTranslations[expense.status] : expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(expense)} className="size-8 text-muted-foreground hover:text-foreground">
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
            <SheetTitle>{lang === "ar" ? "تقديم مطالبة مصروفات جديدة" : "Submit Expense Claim"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? "إنشاء طلب استرداد مالي لمصروفات العمل المعتمدة." 
                : "Create a new out-of-pocket expense for reimbursement."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("category", "Category")}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>{lang === "ar" ? "سفر وانتقالات" : "Travel"}</option>
                  <option>{lang === "ar" ? "وجبات وضيافة" : "Meals"}</option>
                  <option>{lang === "ar" ? "أدوات ومستلزمات مكتبية" : "Office Supplies"}</option>
                  <option>{lang === "ar" ? "مصروفات أخرى" : "Other"}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "المبلغ (ج.م)" : "Amount (EGP)"}</Label>
                <Input type="number" placeholder="0.00" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الوصف والتفاصيل" : "Description"}</Label>
              <Input placeholder={lang === "ar" ? "ما سبب هذا المصروف؟" : "What was this expense for?"} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "صورة الفاتورة أو الإيصال" : "Receipt"}</Label>
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="size-6" />
                  <span className="text-sm font-medium">
                    {lang === "ar" ? "انقر لرفع صورة الفاتورة" : "Click to upload receipt"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "إرسال المطالبة" : "Submit Claim"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "مراجعة مطالبة المصروفات" : "Review Expense Claim"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? `تحديث حالة المطالبة (${editingItem?.id}) للموظف ${editingItem?.employeeAr || editingItem?.employee}.` 
                : `Update status for ${editingItem?.employee}'s claim (${editingItem?.id}).`}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("category", "Category")}</Label>
                <Input defaultValue={lang === "ar" ? editingItem?.categoryAr : editingItem?.category} disabled className="rounded-xl bg-muted opacity-70" />
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "المبلغ" : "Amount"}</Label>
                <Input defaultValue={lang === "ar" ? `${editingItem?.amount?.toLocaleString()} ج.م` : `EGP ${editingItem?.amount?.toLocaleString()}`} disabled className="rounded-xl bg-muted opacity-70" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الإيصال" : "Receipt"}</Label>
              {editingItem?.receipt === "Attached" ? (
                <div className="p-3 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="size-5 text-brand" />
                    <span className="text-sm font-medium">receipt_scan.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    {lang === "ar" ? "عرض" : "View"}
                  </Button>
                </div>
              ) : (
                <div className="p-3 border border-border border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                  {lang === "ar" ? "لا يوجد إيصال مرفق" : "No receipt attached"}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "حالة الاعتماد" : "Approval Status"}</Label>
              <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Pending">{lang === "ar" ? "قيد المراجعة" : "Pending"}</option>
                <option value="Approved">{lang === "ar" ? "معتمد" : "Approved"}</option>
                <option value="Rejected">{lang === "ar" ? "مرفوض" : "Rejected"}</option>
              </select>
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "حفظ الحالة" : "Save Status"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
