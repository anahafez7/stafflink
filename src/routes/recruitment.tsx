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

function RecruitmentPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <PageHeader
        section="Recruitment"
        title="Hiring board"
        description="24 open vacancies · average time to hire 27 days."
        actions={<Button variant="secondary" onClick={() => setOpen(true)}>Post vacancy</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open vacancies" value="24" icon={Briefcase} tone="brand" />
        <StatCard label="Active applicants" value="486" delta="+62 this week" icon={Users} tone="info" />
        <StatCard label="Interviews scheduled" value="31" icon={CalendarCheck} tone="warning" />
        <StatCard label="Offers pending" value="9" icon={FileText} tone="success" />
      </div>

      <section className="surface-card overflow-x-auto p-5">
        <h2 className="text-sm font-semibold">Pipeline</h2>
        <div className="mt-4 flex min-w-max gap-3">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="w-44 rounded-2xl border border-border bg-secondary/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stage.stage}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{stage.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Open vacancies</h2>
        <div className="mt-3 rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Post Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((v) => (
                <TableRow 
                  key={v.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate({ to: `/recruitment/${v.id}` })}
                >
                  <TableCell className="font-medium">{v.title}</TableCell>
                  <TableCell className="text-muted-foreground">{v.dept}</TableCell>
                  <TableCell className="text-muted-foreground">{v.loc}</TableCell>
                  <TableCell className="text-muted-foreground">{v.postDate}</TableCell>
                  <TableCell className="text-muted-foreground">{v.endDate}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{v.applicants}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      {v.status}
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