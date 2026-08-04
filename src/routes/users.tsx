import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, UserPlus, Users as UsersIcon } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { accessLogs, roleMatrix, users } from "@/data/modules";

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
  component: UsersPage,
});

const accessStyles = {
  full: "bg-success/15 text-success",
  read: "bg-warning/15 text-warning",
  none: "bg-muted text-muted-foreground",
} as const;

const accessLabel = { full: "Full", read: "Read", none: "None" } as const;

function UsersPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Users & Permissions"
        title="Access control"
        description="Role-based access with a full audit trail across the platform."
        actions={
          <Button variant="secondary">
            <UserPlus className="size-4" />
            <span>Invite user</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active users" value="184" delta="+9 this month" icon={UsersIcon} tone="brand" />
        <StatCard label="Roles" value="7" delta="4 templates" icon={ShieldCheck} tone="info" />
        <StatCard label="2FA adoption" value="82%" delta="+6%" icon={KeyRound} tone="success" />
        <StatCard label="Failed sign-ins" value="14" delta="Last 24 h" trend="down" icon={ShieldCheck} tone="danger" />
      </div>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.email}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-brand/10 text-xs text-brand">
                          {u.name.split(" ").map((p) => p[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.branch}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={u.twoFactor ? "border-success/40 text-success" : "border-border text-muted-foreground"}>
                      {u.twoFactor ? "Enabled" : "Off"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastSeen}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={u.status === "Active" ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}>
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="surface-card overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold">Permission matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Role</TableHead>
                  {roleMatrix.modules.map((m) => (
                    <TableHead key={m}>{m}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleMatrix.roles.map((r) => (
                  <TableRow key={r.role}>
                    <TableCell className="text-sm font-medium">{r.role}</TableCell>
                    {r.access.map((a, i) => (
                      <TableCell key={roleMatrix.modules[i]}>
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${accessStyles[a]}`}>
                          {accessLabel[a]}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Recent access logs</h2>
          <ul className="mt-3 space-y-3">
            {accessLogs.map((l) => (
              <li key={l.action} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{l.user}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{l.action}</p>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {l.ip} · {l.when}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
