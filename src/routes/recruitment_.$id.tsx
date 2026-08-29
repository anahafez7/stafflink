import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/export";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/recruitment_/$id")({
  component: RecruitmentDetailsPage,
});

const initialApplicants = [
  { id: "101", name: "Ahmed Youssef", role: "Backend Engineer", experience: "5 years", location: "Cairo, Maadi", skills: ["Node.js", "PostgreSQL", "Redis"], languages: ["English", "Arabic"], appliedAt: "2 days ago", status: "In Review", score: "85%" },
  { id: "102", name: "Sara Hassan", role: "Backend Engineer", experience: "8 years", location: "Alexandria, Smouha", skills: ["Go", "Kubernetes", "AWS"], languages: ["English"], appliedAt: "3 days ago", status: "Interviewing", score: "92%" },
  { id: "103", name: "Omar Nabil", role: "Backend Engineer", experience: "2 years", location: "Giza, Dokki", skills: ["Python", "Django"], languages: ["Arabic", "French"], appliedAt: "1 week ago", status: "Rejected", score: "45%" },
  { id: "104", name: "Laila Mahmoud", role: "Backend Engineer", experience: "10 years", location: "Dubai, Marina", skills: ["Java", "Spring Boot", "Kafka"], languages: ["English", "Arabic"], appliedAt: "2 weeks ago", status: "Offered", score: "98%" },
];

function RecruitmentDetailsPage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const [applicants, setApplicants] = useState(initialApplicants);

  const updateStatus = (applicantId: string, newStatus: string) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
  };

  const handleExportApplicants = () => {
    const headers = lang === "ar"
      ? ["الرمز", "اسم المتقدم", "المسمى الوظيفي", "سنوات الخبرة", "الموقع", "المهارات", "اللغات", "تاريخ التقديم", "نسبة التطابق", "الحالة"]
      : ["Applicant ID", "Name", "Role", "Experience", "Location", "Skills", "Languages", "Applied At", "Match Score", "Status"];

    const rows = applicants.map((a) => [
      a.id,
      a.name,
      a.role,
      a.experience,
      a.location,
      a.skills.join("; "),
      a.languages.join("; "),
      a.appliedAt,
      a.score,
      a.status,
    ]);

    downloadCsv(`StaffLink_Applicants_Job_${id}_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير قائمة المتقدمين إلى Excel بنجاح" : "Applicants list exported to Excel successfully");
  };

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" className="mb-2 ltr:-ml-3 rtl:-mr-3 text-muted-foreground" asChild>
        <Link to="/recruitment">
          <ArrowLeft className="me-2 size-4 rtl:rotate-180" />
          {lang === "ar" ? "العودة للتوظيف" : "Back to Recruitment"}
        </Link>
      </Button>
      
      <PageHeader
        section={lang === "ar" ? "تفاصيل الوظيفة الشاغرة" : "Vacancy Details"}
        title={lang === "ar" ? `مهندس برمجيات خلفية (وظيفة #${id})` : `Senior Backend Engineer (Vacancy #${id})`}
        description={lang === "ar" ? "عرض جميع المتقدمين وتقييم المقابلات لهذه الوظيفة." : "Showing all applicants for this position."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportApplicants}
              className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-400" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button variant="secondary" className="bg-white text-slate-900 hover:bg-white/90">
              {lang === "ar" ? "تعديل الوظيفة" : "Edit vacancy"}
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
              {lang === "ar" ? "إغلاق الوظيفة" : "Close vacancy"}
            </Button>
          </div>
        }
      />

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold mb-4">{lang === "ar" ? "قائمة المتقدمين" : "Applicants List"}</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>{lang === "ar" ? "المتقدم" : "Applicant"}</TableHead>
                <TableHead>{lang === "ar" ? "الخبرة والموقع" : "Experience & Location"}</TableHead>
                <TableHead>{lang === "ar" ? "المهارات واللغات" : "Skills & Languages"}</TableHead>
                <TableHead>{lang === "ar" ? "تاريخ التقديم" : "Applied"}</TableHead>
                <TableHead>{lang === "ar" ? "نسبة التطابق" : "Match Score"}</TableHead>
                <TableHead className="text-end">{t("status", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {applicant.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{applicant.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{applicant.experience}</div>
                    <div className="text-xs text-muted-foreground">{applicant.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {applicant.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {applicant.languages.map(l => <Badge key={l} variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">{l}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{applicant.appliedAt}</TableCell>
                  <TableCell className="text-muted-foreground">{applicant.score}</TableCell>
                  <TableCell className="text-end">
                    <Select value={applicant.status} onValueChange={(val) => updateStatus(applicant.id, val)}>
                      <SelectTrigger 
                        className={`w-36 h-7 px-2.5 py-0.5 ms-auto border rounded-full text-xs font-semibold focus:ring-0 ${
                          applicant.status === "Offered" ? "border-success/40 text-success bg-transparent" :
                          applicant.status === "Rejected" ? "border-destructive/40 text-destructive bg-transparent" :
                          applicant.status === "Interviewing" ? "border-brand/40 text-brand bg-transparent" :
                          "border-muted-foreground/40 text-muted-foreground bg-transparent"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Review">
                          <div className="flex items-center font-medium"><Clock className="me-2 size-3.5" /> {lang === "ar" ? "قيد المراجعة" : "In Review"}</div>
                        </SelectItem>
                        <SelectItem value="Interviewing">
                          <div className="flex items-center font-medium">{lang === "ar" ? "مقابلات" : "Interviewing"}</div>
                        </SelectItem>
                        <SelectItem value="Rejected">
                          <div className="flex items-center font-medium"><XCircle className="me-2 size-3.5" /> {lang === "ar" ? "مرفوض" : "Rejected"}</div>
                        </SelectItem>
                        <SelectItem value="Offered">
                          <div className="flex items-center font-medium"><CheckCircle2 className="me-2 size-3.5" /> {lang === "ar" ? "تم تقديم عرض" : "Offered"}</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
