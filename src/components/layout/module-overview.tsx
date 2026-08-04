import { CheckCircle2 } from "lucide-react";

import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";

export type ModuleGroup = { title: string; items: string[] };

export function ModuleOverview({
  section,
  title,
  description,
  groups,
  primaryAction = "New record",
}: {
  section: string;
  title: string;
  description: string;
  groups: ModuleGroup[];
  primaryAction?: string;
}) {
  return (
    <div className="space-y-5">
      <PageHeader
        section={section}
        title={title}
        description={description}
        actions={<Button variant="secondary">{primaryAction}</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <section key={group.title} className="surface-card p-5">
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}