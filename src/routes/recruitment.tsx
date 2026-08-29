import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, CalendarCheck, FileText, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewJobDialog } from "@/components/recruitment/new-job-dialog";
import { pipeline } from "@/data/hrms";

export const Route = createFileRoute("/recruitment")({
  head: () => ({
    meta: [
      { title: "Recruitment — StaffLink" },
      {
        name: "description",
        content: "Vacancies, applicant pipeline, interviews, evaluations and offer letters in one hiring board.",
      },
      { property: "og:title", content: "Recruitment — StaffLink" },
      { property: "og:description", content: "Vacancies, pipeline, interviews and offers." },
    ],
  }),
  component: RecruitmentPage,
});

const vacancies = [
  { id: "1", title: "Senior Backend Engineer", dept: "Technology", loc: "Remote", postDate: "Aug 10, 2026", endDate: "Sep 10, 2026", applicants: 128, status: "Open" },
  { id: "2", title: "Payroll Analyst", dept: "Finance", loc: "Cairo HQ", postDate: "Aug 05, 2026", endDate: "Sep 05, 2026", applicants: 64, status: "Interviewing" },
  { id: "3", title: "Warehouse Lead", dept: "Logistics", loc: "Riyadh DC", postDate: "Aug 08, 2026", endDate: "Sep 08, 2026", applicants: 41, status: "Open" },
  { id: "4", title: "HR Generalist", dept: "Human Resources", loc: "Dubai", postDate: "Aug 01, 2026", endDate: "Aug 31, 2026", applicants: 87, status: "Offer" },
];

import { useI18n } from "@/lib/i18n";
import { downloadCsv } from "@/lib/export";
import { FileSpreadsheet } from "lucide-react";

function RecruitmentPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const pipelineTranslations: Record<string, string> = {
    "Applied": "تم التقديم",
    "Screening": "فرز أولي",
    "Interview": "مقابلة",
    "Offer": "عرض عمل",
    "Hired": "تم التعيين",
  };

  const handleExportVacancies = () => {
    const headers = lang === "ar"
      ? ["رمز الوظيفة", "المسمى الوظيفي", "القسم", "موقع العمل", "تاريخ النشر", "تاريخ الإغلاق", "عدد المتقدمين", "الحالة"]
      : ["Job ID", "Role Title", "Department", "Location", "Post Date", "End Date", "Applicants", "Status"];

    const rows = vacancies.map((v) => [
      v.id,
      v.title,
      v.dept,
      v.loc,
      v.postDate,
      v.endDate,
      v.applicants,
      v.status,
    ]);

    downloadCsv(`StaffLink_Vacancies_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير قائمة الوظائف الشاغرة إلى Excel بنجاح" : "Vacancies exported to Excel successfully");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section={t("recruitment", "Recruitment")}
        title={t("recruitmentTitle", "Hiring board")}
        description={
          lang === "ar"
            ? "24 وظيفة شاغرة معلنة · متوسط زمن التعيين 27 يوماً."
            : "24 open vacancies · average time to hire 27 days."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportVacancies}
              className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-400" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              {lang === "ar" ? "نشر وظيفة جديدة" : "Post vacancy"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("openPositions", "Open vacancies")} value="24" icon={Briefcase} tone="brand" />
        <StatCard label={lang === "ar" ? "المتقدمون النشطون" : "Active applicants"} value="486" delta={lang === "ar" ? "+62 هذا الأسبوع" : "+62 this week"} icon={Users} tone="info" />
        <StatCard label={lang === "ar" ? "المقابلات المجدولة" : "Interviews scheduled"} value="31" icon={CalendarCheck} tone="warning" />
        <StatCard label={lang === "ar" ? "عروض العمل المعلقة" : "Offers pending"} value="9" icon={FileText} tone="success" />
      </div>

      <section className="surface-card overflow-x-auto p-5">
        <h2 className="text-sm font-semibold">{lang === "ar" ? "مراحل التوظيف (Pipeline)" : "Pipeline"}</h2>
        <div className="mt-4 flex min-w-max gap-3">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="w-44 rounded-2xl border border-border bg-secondary/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {lang === "ar" ? (pipelineTranslations[stage.stage] || stage.stage) : stage.stage}
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{stage.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold">{lang === "ar" ? "الوظائف المتاحة حالياً" : "Current vacancies"}</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>{lang === "ar" ? "المسمى الوظيفي" : "Role"}</TableHead>
                <TableHead>{t("department", "Department")}</TableHead>
                <TableHead>{t("branch", "Location")}</TableHead>
                <TableHead>{lang === "ar" ? "تاريخ النشر" : "Post date"}</TableHead>
                <TableHead>{lang === "ar" ? "تاريخ الإغلاق" : "End date"}</TableHead>
                <TableHead>{t("candidates", "Applicants")}</TableHead>
                <TableHead>{t("status", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate({ to: `/recruitment/${v.id}` })}
                >
                  <TableCell className="text-sm font-medium">{v.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.dept}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.loc}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.postDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.endDate}</TableCell>
                  <TableCell className="text-sm tabular-nums">{v.applicants}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={v.status === "Open" ? "border-success/40 text-success" : "border-primary/40 text-primary"}>
                      {lang === "ar" ? (v.status === "Open" ? "مفتوحة" : v.status === "Interviewing" ? "مقابلات" : "عرض عمل") : v.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <NewJobDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}