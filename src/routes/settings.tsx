import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — StaffLink" },
      {
        name: "description",
        content: "Company setup, branches, job grades, leave types, payroll rules, integrations and audit logs.",
      },
      { property: "og:title", content: "Settings — StaffLink" },
      { property: "og:description", content: "Company setup, rules, integrations and audit logs." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Settings"
      title="System configuration"
      description="Tenant-wide rules applied across all branches and modules."
      primaryAction="Add configuration"
      groups={[
        { title: "Organization", items: ["Company", "Branches", "Departments", "Positions", "Job grades"] },
        { title: "Rules", items: ["Leave types", "Attendance rules", "Payroll rules", "Currencies", "Countries", "Languages", "Themes"] },
        { title: "Platform", items: ["Email", "SMS", "WhatsApp", "Integrations", "API", "Backup", "Audit logs"] },
      ]}
    />
  ),
});