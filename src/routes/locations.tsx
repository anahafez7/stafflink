import { createFileRoute } from "@tanstack/react-router";

import { ModuleOverview } from "@/components/layout/module-overview";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — StaffLink" },
      {
        name: "description",
        content: "Countries, cities, branches, worksites, GPS coordinates and geofence areas for attendance.",
      },
      { property: "og:title", content: "Locations — StaffLink" },
      { property: "og:description", content: "Branches, worksites, GPS coordinates and geofences." },
    ],
  }),
  component: () => (
    <ModuleOverview
      section="Locations"
      title="Locations & geofencing"
      description="6 branches · 14 worksites · 11 active geofence areas."
      primaryAction="Add worksite"
      groups={[
        { title: "Geography", items: ["Countries", "States", "Cities", "Districts"] },
        { title: "Sites", items: ["Branches", "Worksites", "Site managers", "Working calendars"] },
        { title: "Mapping", items: ["GPS coordinates", "Maps", "Geofence areas", "Radius rules"] },
      ]}
    />
  ),
});