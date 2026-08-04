import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — StaffLink" },
      {
        name: "description",
        content: "Employee files, contracts, certificates, visas and automated expiry tracking with approvals.",
      },
      { property: "og:title", content: "Documents — StaffLink" },
      { property: "og:description", content: "Employee files, contracts and expiry tracking." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Documents"
      title="Document vault"
      description="14,802 files · 23 documents expiring within 30 days."
      primaryAction="Upload document"
      groups={[
        { title: "Libraries", items: ["Employee files", "Company files", "Policies", "Contracts", "Certificates"] },
        { title: "Identity", items: ["Passport", "Visa", "Licenses", "National ID"] },
        { title: "Automation", items: ["Expiry tracking", "Renewal reminders", "OCR ready", "Version control", "Document approval"] },
      ]}
    />
  ),
});