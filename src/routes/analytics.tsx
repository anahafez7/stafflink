import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — StaffLink" },
      {
        name: "description",
        content: "Executive workforce analytics: headcount, turnover, attrition, absenteeism, hiring time and cost.",
      },
      { property: "og:title", content: "Analytics — StaffLink" },
      { property: "og:description", content: "Headcount, turnover, attrition and hiring analytics." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Analytics"
      title="Workforce analytics"
      description="Executive insight across every StaffLink module."
      primaryAction="Export report"
      groups={[
        { title: "Dashboards", items: ["Executive dashboard", "HR analytics", "Attendance analytics", "Payroll analytics"] },
        { title: "People metrics", items: ["Turnover", "Absenteeism", "Headcount", "Attrition", "Average salary", "Hiring time"] },
        { title: "Delivery", items: ["Charts", "Heat maps", "Export Excel", "Export PDF", "Scheduled reports"] },
      ]}
    />
  ),
});