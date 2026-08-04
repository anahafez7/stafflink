import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/self-service")({
  head: () => ({
    meta: [
      { title: "Self Service — StaffLink" },
      {
        name: "description",
        content: "Employee self service: leave and loan requests, payslips, announcements, tasks and profile updates.",
      },
      { property: "og:title", content: "Self Service — StaffLink" },
      { property: "og:description", content: "Requests, payslips, announcements and profile updates." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Self Service"
      title="Employee self service"
      description="Everything an employee needs, in three clicks or fewer."
      primaryAction="New request"
      groups={[
        { title: "Requests", items: ["Leave request", "Loan request", "Advance request", "Attendance correction"] },
        { title: "My data", items: ["Attendance", "Payroll", "Payslips", "Documents", "Profile update"] },
        { title: "Company", items: ["Announcements", "Company news", "Tasks", "Download forms", "Notifications"] },
      ]}
    />
  ),
});