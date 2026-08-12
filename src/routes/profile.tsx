import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — StaffLink" },
      {
        name: "description",
        content: "Personal and employment information.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <PageHeader section="Workspace" title="My Profile" description="Manage your personal and employment information" />

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Personal & Employment Info</h2>
        <div className="mt-5 flex min-w-0 items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand/10 text-xl font-semibold text-brand">
            {user?.initials ?? "—"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-medium">{user?.name ?? "Not signed in"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user?.title} · {user?.email}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Employee ID</dt>
            <dd className="mt-1 font-medium">EMP-0142</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">National ID</dt>
            <dd className="mt-1 font-medium flex items-center justify-between">
              29001011234567
              <span className="text-xs text-warning">Expires in 45 days</span>
            </dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Department</dt>
            <dd className="mt-1 font-medium">Technology</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Position</dt>
            <dd className="mt-1 font-medium">{user?.title ?? "Software Engineer"}</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Contract Type</dt>
            <dd className="mt-1 font-medium">Full-time</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Contract End Date</dt>
            <dd className="mt-1 font-medium flex items-center justify-between">
              31-12-2027
              <span className="text-xs text-muted-foreground">Expires in 506 days</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Security</h2>
        <div className="mt-5 flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
          </div>
          <Button variant="outline" size="sm">
            <Lock className="mr-2 size-4" />
            Change password
          </Button>
        </div>
      </section>
    </div>
  );
}
