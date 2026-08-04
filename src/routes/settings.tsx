import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { settingsGroups, settingsToggles } from "@/data/modules";

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
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Settings"
        title="System configuration"
        description="Tenant-wide rules applied across all branches and modules."
        actions={
          <Button variant="secondary">
            <Plus className="size-4" />
            <span>Add configuration</span>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settingsGroups.map((group) => (
          <section key={group.title} className="surface-card p-5">
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 divide-y divide-border">
              {group.items.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 py-2.5 text-left transition-colors hover:text-primary"
                  >
                    <span className="min-w-0 truncate text-sm">{item.label}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      {item.value}
                      <ChevronRight className="size-3.5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Policies</h2>
        <ul className="mt-3 divide-y divide-border">
          {settingsToggles.map((t) => (
            <li key={t.label} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.label}</p>
                <p className="truncate text-xs text-muted-foreground">{t.hint}</p>
              </div>
              <Switch defaultChecked={t.on} aria-label={t.label} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
