import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance — StaffLink" },
      {
        name: "description",
        content: "Goals, KPIs, 360 evaluations, review cycles, rewards and improvement plans.",
      },
      { property: "og:title", content: "Performance — StaffLink" },
      { property: "og:description", content: "Goals, KPIs, reviews and improvement plans." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Performance"
      title="Performance management"
      description="Cycle Q2 2026 is open · 78% of reviews submitted."
      primaryAction="Start review cycle"
      groups={[
        { title: "Planning", items: ["Goals", "KPIs", "Objectives", "Cascade to teams"] },
        { title: "Reviews", items: ["Monthly review", "Quarter review", "Yearly review", "Manager evaluation", "360 evaluation"] },
        { title: "Outcomes", items: ["Performance score", "Rewards", "Improvement plans", "Performance dashboard"] },
      ]}
    />
  ),
});