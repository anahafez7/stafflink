import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  section,
  title,
  description,
  actions,
}: {
  section: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="gradient-header rounded-2xl px-5 py-6 shadow-[var(--shadow-lift)] sm:px-7 sm:py-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-brand-foreground/70">
        <Link to="/" className="hover:text-brand-foreground">
          StaffLink
        </Link>
        <ChevronRight className="size-3" />
        <span>{section}</span>
      </nav>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-brand-foreground/75">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}