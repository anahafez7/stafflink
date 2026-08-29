import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Laptop, Monitor, Smartphone, CheckCircle2, Wrench, Search, Plus, Edit2, FileSpreadsheet } from "lucide-react";
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

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset Management — StaffLink" },
    ],
  }),
  component: AssetsPage,
});

const assets = [
  { id: "AST-001", name: "MacBook Pro 16", type: "Laptop", typeAr: "حاسوب محمول", status: "Assigned", assignedTo: "Abanob Vector", assignedToAr: "أبانوب فيكتور", date: "10 يناير 2026", icon: Laptop },
  { id: "AST-002", name: "Dell UltraSharp 27", type: "Monitor", typeAr: "شاشة عرض", status: "Available", assignedTo: "-", assignedToAr: "-", date: "-", icon: Monitor },
  { id: "AST-003", name: "iPhone 15 Pro", type: "Phone", typeAr: "هاتف ذكي", status: "In Repair", assignedTo: "Ahmed Khaled", assignedToAr: "أحمد خالد", date: "05 فبراير 2026", icon: Smartphone },
];

function AssetsPage() {
  const { t, lang } = useI18n();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const statusTranslations: Record<string, string> = {
    "Assigned": "مسند لموظف",
    "Available": "متاح في المخزون",
    "In Repair": "قيد الصيانة",
  };

  const typeTranslations: Record<string, string> = {
    "Laptop": "حاسوب محمول",
    "Monitor": "شاشة عرض",
    "Phone": "هاتف ذكي",
  };

  const filteredAssets = assets.filter(asset => {
    const name = asset.name.toLowerCase();
    const assigned = (lang === "ar" ? asset.assignedToAr : asset.assignedTo).toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || assigned.includes(q) || asset.id.toLowerCase().includes(q);
  });

  const handleExportAssets = () => {
    const headers = lang === "ar"
      ? ["رقم الأصل", "اسم الأصل", "النوع", "الحالة", "المستلم", "تاريخ الإسناد"]
      : ["Asset ID", "Asset Name", "Type", "Status", "Assigned To", "Assigned Date"];

    const rows = filteredAssets.map((a) => [
      a.id,
      a.name,
      lang === "ar" ? a.typeAr : a.type,
      lang === "ar" ? (statusTranslations[a.status] || a.status) : a.status,
      lang === "ar" ? a.assignedToAr : a.assignedTo,
      a.date,
    ]);

    downloadCsv(`StaffLink_Assets_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير سجل الأصول والعهد إلى ملف Excel بنجاح" : "Assets inventory exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={lang === "ar" ? "مساحة العمل" : "Workspace"}
        title={lang === "ar" ? "إدارة العهد والأصول" : "Asset Management"}
        description={
          lang === "ar" 
            ? "تتبع وإدارة المعدات والأجهزة الإلكترونية والعهد المسندة للموظفين." 
            : "Track and manage company equipment and software licenses."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportAssets}
              className="border-border bg-background hover:bg-muted"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="me-2 size-4" /> 
              {lang === "ar" ? "إضافة أصل جديد" : "Add Asset"}
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
            placeholder={lang === "ar" ? "البحث عن الأصول أو الموظف المستلم..." : "Search assets..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-start">{lang === "ar" ? "رقم الأصل" : "Asset ID"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "اسم الأصل / الجهاز" : "Name"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "النوع" : "Type"}</TableHead>
              <TableHead className="text-start">{t("status", "Status")}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "المستلم" : "Assigned To"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "تاريخ الإسناد" : "Assigned Date"}</TableHead>
              <TableHead className="text-end">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-muted/5">
                <TableCell className="font-medium tabular-nums">{asset.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <asset.icon className="size-4 text-muted-foreground" />
                    <span>{asset.name}</span>
                  </div>
                </TableCell>
                <TableCell>{lang === "ar" ? asset.typeAr : asset.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    asset.status === "Assigned" ? "border-success/40 text-success" :
                    asset.status === "Available" ? "border-brand/40 text-brand" : "border-warning/40 text-warning"
                  }>
                    {asset.status === "Assigned" && <CheckCircle2 className="me-1 size-3" />}
                    {asset.status === "In Repair" && <Wrench className="me-1 size-3" />}
                    {lang === "ar" ? statusTranslations[asset.status] : asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{lang === "ar" ? asset.assignedToAr : asset.assignedTo}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{asset.date}</TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(asset)} className="size-8 text-muted-foreground hover:text-foreground">
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
            <SheetTitle>{lang === "ar" ? "إضافة أصل جديد" : "Add New Asset"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? "تسجيل قطعة معدات أو جهاز جديد في قاعدة بيانات العهد." 
                : "Register a new piece of equipment into the inventory."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "اسم / طراز الأصل" : "Asset Name / Model"}</Label>
              <Input placeholder={lang === "ar" ? "مثال: MacBook Pro 16" : "e.g. MacBook Pro 16"} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "النوع" : "Type"}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Laptop">{lang === "ar" ? "حاسوب محمول" : "Laptop"}</option>
                  <option value="Monitor">{lang === "ar" ? "شاشة عرض" : "Monitor"}</option>
                  <option value="Phone">{lang === "ar" ? "هاتف ذكي" : "Phone"}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("status", "Status")}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Available">{lang === "ar" ? "متاح في المخزون" : "Available"}</option>
                  <option value="Assigned">{lang === "ar" ? "مسند لموظف" : "Assigned"}</option>
                  <option value="In Repair">{lang === "ar" ? "قيد الصيانة" : "In Repair"}</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الموظف المستلم" : "Assignee"}</Label>
              <Input placeholder={lang === "ar" ? "اسم الموظف..." : "Employee name"} className="rounded-xl" />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "إضافة الأصل" : "Add Asset"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "تعديل بيانات الأصل" : "Edit Asset"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? `تحديث معلومات وحالة الأصل (${editingItem?.name}).` 
                : `Update information for ${editingItem?.name}.`}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "اسم / طراز الأصل" : "Asset Name / Model"}</Label>
              <Input defaultValue={editingItem?.name} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "النوع" : "Type"}</Label>
                <select defaultValue={editingItem?.type} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Laptop">{lang === "ar" ? "حاسوب محمول" : "Laptop"}</option>
                  <option value="Monitor">{lang === "ar" ? "شاشة عرض" : "Monitor"}</option>
                  <option value="Phone">{lang === "ar" ? "هاتف ذكي" : "Phone"}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("status", "Status")}</Label>
                <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Available">{lang === "ar" ? "متاح في المخزون" : "Available"}</option>
                  <option value="Assigned">{lang === "ar" ? "مسند لموظف" : "Assigned"}</option>
                  <option value="In Repair">{lang === "ar" ? "قيد الصيانة" : "In Repair"}</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الموظف المستلم" : "Assignee"}</Label>
              <Input defaultValue={editingItem?.assignedTo !== "-" ? (lang === "ar" ? editingItem?.assignedToAr : editingItem?.assignedTo) : ""} placeholder={lang === "ar" ? "اسم الموظف..." : "Employee name"} className="rounded-xl" />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
