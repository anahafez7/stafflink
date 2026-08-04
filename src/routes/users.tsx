import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Permissions — StaffLink" },
      {
        name: "description",
        content: "Roles, permission matrix, approval workflows, 2FA, sessions and IP restrictions.",
      },
      { property: "og:title", content: "Users & Permissions — StaffLink" },
      { property: "og:description", content: "Roles, permission matrix, 2FA and access logs." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Users & Permissions"
      title="Access control"
      description="Role-based access with a full audit trail across the platform."
      primaryAction="Invite user"
      groups={[
        { title: "Identity", items: ["Users", "Roles", "Role templates", "Approval workflow"] },
        { title: "Security", items: ["Two factor authentication", "Password policies", "IP restrictions", "Session management"] },
        { title: "Audit", items: ["Permission matrix", "Access logs", "Device tracking", "Activity logs"] },
      ]}
    />
  ),
});