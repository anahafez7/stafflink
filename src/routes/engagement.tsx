import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Megaphone, HeartHandshake, FileText, CheckCircle2, Edit2, FileSpreadsheet } from "lucide-react";
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

export const Route = createFileRoute("/engagement")({
  head: () => ({
    meta: [
      { title: "Employee Engagement — StaffLink" },
    ],
  }),
  component: EngagementPage,
});

const engagementItems = [
  { id: "SUR-021", title: "Q3 Employee Satisfaction Pulse", titleAr: "استطلاع نبض رضا الموظفين للربع الثالث", type: "Survey", typeAr: "استطلاع رأي", audience: "All Employees", audienceAr: "جميع الموظفين", date: "12 أغسطس 2026", status: "Active", responses: "342/500", icon: FileText },
  { id: "ANN-089", title: "New Remote Work Policy Update", titleAr: "تحديث سياسة العمل عن بُعد المرنة", type: "Announcement", typeAr: "تعميم إداري", audience: "Engineering", audienceAr: "الهندسة البرمجية", date: "10 أغسطس 2026", status: "Published", responses: "-", icon: Megaphone },
  { id: "EVT-015", title: "Annual Company Retreat 2026", titleAr: "الملتقى السنوي للشركة 2026", type: "Event", typeAr: "فعالية سنوية", audience: "All Employees", audienceAr: "جميع الموظفين", date: "25 يوليو 2026", status: "Completed", responses: "480/500", icon: HeartHandshake },
];

function EngagementPage() {
  const { t, lang } = useI18n();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const statusTranslations: Record<string, string> = {
    "Active": "نشط",
    "Published": "منشور",
    "Completed": "مكتمل",
    "Draft": "مسودة",
  };

  const filteredItems = engagementItems.filter(item => {
    const title = (lang === "ar" ? item.titleAr : item.title).toLowerCase();
    const type = (lang === "ar" ? item.typeAr : item.type).toLowerCase();
    const aud = (lang === "ar" ? item.audienceAr : item.audience).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || type.includes(q) || aud.includes(q) || item.id.toLowerCase().includes(q);
  });

  const handleExportEngagement = () => {
    const headers = lang === "ar"
      ? ["الرمز", "العنوان / الموضوع", "النوع", "الفئة المستهدفة", "التاريخ", "نسبة الاستجابة", "الحالة"]
      : ["Code", "Title", "Type", "Target Audience", "Date", "Responses", "Status"];

    const rows = filteredItems.map((item) => [
      item.id,
      lang === "ar" ? item.titleAr : item.title,
      lang === "ar" ? item.typeAr : item.type,
      lang === "ar" ? item.audienceAr : item.audience,
      item.date,
      item.responses,
      lang === "ar" ? (statusTranslations[item.status] || item.status) : item.status,
    ]);

    downloadCsv(`StaffLink_Engagement_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير استطلاعات التفاعل إلى Excel بنجاح" : "Engagement campaigns exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={lang === "ar" ? "مساحة العمل" : "Workspace"}
        title={lang === "ar" ? "تفاعل واندماج الموظفين" : "Employee Engagement"}
        description={
          lang === "ar" 
            ? "متابعة ثقافة وبيئة العمل، إطلاق استطلاعات نبض الموظفين، ونشر التعاميم المؤسسية." 
            : "Monitor company culture, run pulse surveys, and broadcast announcements."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportEngagement}
              className="rounded-full border-border bg-surface hover:bg-muted"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="me-2 size-4" /> 
              {lang === "ar" ? "إطلاق حملة / استطلاع" : "New Campaign"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center items-center text-center h-full">
          <div className="text-muted-foreground font-medium mb-1">{lang === "ar" ? "مؤشر ولاء الموظفين (eNPS)" : "Company eNPS"}</div>
          <div className="text-5xl font-bold text-success mt-2 tabular-nums" dir="ltr">+42</div>
          <div className="text-xs text-muted-foreground mt-3">
            {lang === "ar" ? "ممتاز (ضمن أعلى 15% في القطاع)" : "Excellent (Top 15% Industry)"}
          </div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center items-center text-center h-full">
          <div className="text-muted-foreground font-medium mb-1">{lang === "ar" ? "نسبة المشاركة في الاستطلاعات" : "Survey Participation"}</div>
          <div className="text-5xl font-bold text-brand mt-2 tabular-nums" dir="ltr">86%</div>
          <div className="text-xs text-muted-foreground mt-3">
            {lang === "ar" ? "مشاركة نشطة عبر 3 حملات" : "Active across 3 campaigns"}
          </div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center items-center text-center h-full">
          <div className="text-muted-foreground font-medium mb-1">{lang === "ar" ? "بطاقات الشكر والتقدير (أغسطس)" : "Kudos Given (August)"}</div>
          <div className="text-5xl font-bold text-info mt-2 tabular-nums">1,204</div>
          <div className="text-xs text-muted-foreground mt-3">
            {lang === "ar" ? "تقدير متبادل بين الزملاء" : "Peer-to-peer recognition"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "البحث في الحملات والاستطلاعات..." : "Search campaigns and surveys..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-start">{lang === "ar" ? "المعرّف" : "ID"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "عنوان الحملة / الاستطلاع" : "Campaign Title"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "النوع" : "Type"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "الجمهور المستهدف" : "Audience"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "تاريخ الإطلاق" : "Date Launched"}</TableHead>
              <TableHead className="text-start">{lang === "ar" ? "الاستجابات" : "Responses"}</TableHead>
              <TableHead className="text-start">{t("status", "Status")}</TableHead>
              <TableHead className="text-end">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/5">
                <TableCell className="font-medium text-muted-foreground tabular-nums">{item.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <item.icon className="size-4 text-brand" />
                    <span className="font-medium">{lang === "ar" ? item.titleAr : item.title}</span>
                  </div>
                </TableCell>
                <TableCell>{lang === "ar" ? item.typeAr : item.type}</TableCell>
                <TableCell className="text-muted-foreground">{lang === "ar" ? item.audienceAr : item.audience}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{item.date}</TableCell>
                <TableCell className="font-medium tabular-nums" dir="ltr">{item.responses}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    item.status === "Completed" ? "border-muted-foreground/30 text-muted-foreground" :
                    item.status === "Active" ? "border-success/40 text-success" : "border-brand/40 text-brand"
                  }>
                    {item.status === "Completed" && <CheckCircle2 className="me-1 size-3" />}
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
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "إطلاق حملة أو استطلاع جديد" : "Launch New Campaign"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? "إنشاء استطلاع رأي أو نشر إعلان تعميمي أو تنظيم فعالية لموظفي الشركة." 
                : "Create a new survey, announcement, or event for employees."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "عنوان الحملة / الاستطلاع" : "Campaign Title"}</Label>
              <Input placeholder={lang === "ar" ? "مثال: استطلاع نبض بيئة العمل للربع الرابع" : "e.g. Q4 Pulse Survey"} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "النوع" : "Type"}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Survey">{lang === "ar" ? "استطلاع رأي" : "Survey"}</option>
                  <option value="Announcement">{lang === "ar" ? "تعميم إداري" : "Announcement"}</option>
                  <option value="Event">{lang === "ar" ? "فعالية / نشاط" : "Event"}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "الجمهور المستهدف" : "Audience"}</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="All Employees">{lang === "ar" ? "جميع الموظفين" : "All Employees"}</option>
                  <option value="Engineering">{lang === "ar" ? "الهندسة البرمجية" : "Engineering"}</option>
                  <option value="Sales">{lang === "ar" ? "المبيعات" : "Sales"}</option>
                  <option value="Leadership">{lang === "ar" ? "الإدارة العليا" : "Leadership"}</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{lang === "ar" ? "نص الرسالة أو الوصف" : "Message / Description"}</Label>
              <textarea 
                placeholder={lang === "ar" ? "أدخل تفاصيل ومحتوى الإعلان أو أسئلة الاستطلاع..." : "Write your message here..."} 
                className="flex min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              {lang === "ar" ? "إطلاق الحملة" : "Launch Campaign"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-start">
            <SheetTitle>{lang === "ar" ? "تعديل بيانات الحملة" : "Edit Campaign"}</SheetTitle>
            <SheetDescription>
              {lang === "ar" 
                ? `تحديث معلومات وحالة (${editingItem?.titleAr || editingItem?.title}).` 
                : `Update information for ${editingItem?.title}.`}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6 text-start">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "عنوان الحملة" : "Campaign Title"}</Label>
              <Input defaultValue={lang === "ar" ? editingItem?.titleAr : editingItem?.title} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "النوع" : "Type"}</Label>
                <Input defaultValue={lang === "ar" ? editingItem?.typeAr : editingItem?.type} disabled className="rounded-xl bg-muted opacity-70" />
              </div>
              <div className="space-y-2">
                <Label>{t("status", "Status")}</Label>
                <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="Draft">{lang === "ar" ? "مسودة" : "Draft"}</option>
                  <option value="Active">{lang === "ar" ? "نشط" : "Active"}</option>
                  <option value="Published">{lang === "ar" ? "منشور" : "Published"}</option>
                  <option value="Completed">{lang === "ar" ? "مكتمل" : "Completed"}</option>
                  <option value="Cancelled">{lang === "ar" ? "ملغى" : "Cancelled"}</option>
                </select>
              </div>
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
