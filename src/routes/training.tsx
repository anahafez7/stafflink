import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, BookOpen, Video, ShieldCheck, GraduationCap, CheckCircle2, Edit2, FileSpreadsheet } from "lucide-react";
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

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training & LMS — StaffLink" },
    ],
  }),
  component: TrainingPage,
});

const courses = [
  { id: "TRN-101", title: "Information Security Basics", type: "Compliance", format: "Video", date: "Aug 15, 2026", duration: "1h 30m", mandatory: true, icon: ShieldCheck, status: "Published" },
  { id: "TRN-102", title: "Advanced React Patterns", type: "Technical", format: "Interactive", date: "Aug 10, 2026", duration: "4h 00m", mandatory: false, icon: BookOpen, status: "Published" },
  { id: "TRN-103", title: "Workplace Harassment Policy", type: "Compliance", format: "Document", date: "Aug 01, 2026", duration: "45m", mandatory: true, icon: GraduationCap, status: "Draft" },
];

import { useI18n } from "@/lib/i18n";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

function TrainingPage() {
  const { t, lang } = useI18n();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportTraining = () => {
    const headers = lang === "ar"
      ? ["رمز الدورة", "الدورة التدريبية", "المجال / النوع", "الصيغة", "المدة", "إلزامي", "الحالة"]
      : ["Course Code", "Course Title", "Type", "Format", "Duration", "Mandatory", "Status"];

    const rows = filteredCourses.map((c) => [
      c.id,
      c.title,
      c.type,
      c.format,
      c.duration,
      c.mandatory ? (lang === "ar" ? "نعم" : "Yes") : (lang === "ar" ? "لا" : "No"),
      c.status,
    ]);

    downloadCsv(`StaffLink_Training_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير دليل الدورات التدريبية إلى Excel بنجاح" : "Training catalog exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={t("workspace", "Workspace")}
        title={t("trainingTitle", "Training & LMS")}
        description={
          lang === "ar"
            ? "إدارة دليل الدورات التدريبية، دورات الامتثال الإلزامية، والشهادات المعتمدة."
            : "Manage the course catalog, mandatory compliance training, and certifications."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportTraining}
              className="rounded-full border-border bg-surface hover:bg-muted"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <Plus className="me-2 size-4" /> {lang === "ar" ? "إنشاء دورة جديدة" : "Create Course"}
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
            placeholder={lang === "ar" ? "البحث في دليل الدورات..." : "Search course catalog..."} 
            className="ltr:pl-9 rtl:pr-9 bg-surface rounded-full border-border/50" 
          />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="w-[120px]">{lang === "ar" ? "الرمز" : "Code"}</TableHead>
              <TableHead>{lang === "ar" ? "الدورة التدريبية" : "Course"}</TableHead>
              <TableHead>{t("category", "Type")}</TableHead>
              <TableHead>{lang === "ar" ? "الصيغة" : "Format"}</TableHead>
              <TableHead>{lang === "ar" ? "المدة" : "Duration"}</TableHead>
              <TableHead>{lang === "ar" ? "إلزامي" : "Mandatory"}</TableHead>
              <TableHead>{t("status", "Status")}</TableHead>
              <TableHead className="text-end">{t("actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/5">
                <TableCell className="font-medium text-muted-foreground">{course.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <course.icon className="size-4 text-brand" />
                    <span className="font-medium">{course.title}</span>
                  </div>
                </TableCell>
                <TableCell>{course.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {course.format === "Video" ? <Video className="size-3.5" /> : <BookOpen className="size-3.5" />}
                    <span>{course.format}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{course.duration}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={course.mandatory ? "border-destructive/40 text-destructive" : "border-muted-foreground/30 text-muted-foreground"}>
                    {course.mandatory ? "Required" : "Optional"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    course.status === "Published" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"
                  }>
                    {course.status === "Published" && <CheckCircle2 className="mr-1 size-3" />}
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(course)} className="size-8 text-muted-foreground hover:text-foreground">
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
          <SheetHeader>
            <SheetTitle>Create Course</SheetTitle>
            <SheetDescription>
              Add a new training module or compliance course to the LMS.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input placeholder="e.g. Data Privacy 101" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Compliance</option>
                  <option>Technical</option>
                  <option>Soft Skills</option>
                  <option>Leadership</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Video</option>
                  <option>Interactive</option>
                  <option>Document</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (Optional)</Label>
                <Input placeholder="e.g. 2h 30m" className="rounded-xl" />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input type="checkbox" className="size-4 rounded border-border" />
                  <span className="text-sm font-medium">Mandatory</span>
                </label>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Publish Course</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Course</SheetTitle>
            <SheetDescription>
              Update course details and publish status.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input defaultValue={editingItem?.title} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select defaultValue={editingItem?.type} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Compliance</option>
                  <option>Technical</option>
                  <option>Soft Skills</option>
                  <option>Leadership</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <select defaultValue={editingItem?.format} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Video</option>
                  <option>Interactive</option>
                  <option>Document</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
