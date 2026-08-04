import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, CalendarCheck, FileText, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  { title: "Senior Backend Engineer", dept: "Technology", loc: "Remote", applicants: 128, status: "Open" },
  { title: "Payroll Analyst", dept: "Finance", loc: "Cairo HQ", applicants: 64, status: "Interviewing" },
  { title: "Warehouse Lead", dept: "Logistics", loc: "Riyadh DC", applicants: 41, status: "Open" },
  { title: "HR Generalist", dept: "Human Resources", loc: "Dubai", applicants: 87, status: "Offer" },
];

function RecruitmentPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Recruitment"
        title="Hiring board"
        description="24 open vacancies · average time to hire 27 days."
        actions={<Button variant="secondary">Post vacancy</Button>}
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
        <ul className="mt-3 divide-y divide-border">
          {vacancies.map((v) => (
            <li key={v.title} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{v.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {v.dept} · {v.loc} · {v.applicants} applicants
                </p>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">
                {v.status}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}