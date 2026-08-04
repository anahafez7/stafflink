import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employees } from "@/data/hrms";

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "Employees — StaffLink HR" },
      {
        name: "description",
        content:
          "Manage employees, departments, contracts, documents and the full employee lifecycle in StaffLink HR.",
      },
      { property: "og:title", content: "Employees — StaffLink HR" },
      {
        property: "og:description",
        content: "Employee directory, departments, contracts and lifecycle management.",
      },
    ],
  }),
  component: HRPage,
});

const statusStyles: Record<string, string> = {
  Active: "border-success/40 text-success",
  "On Leave": "border-warning/40 text-warning",
  Probation: "border-primary/40 text-primary",
};

function HRPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="HR"
        title="Employee directory"
        description="1,244 records · 6 branches · 5 departments"
        actions={
          <>
            <Button variant="secondary">
              <Plus className="size-4" />
              <span>New employee</span>
            </Button>
            <Button
              variant="outline"
              className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <Download className="size-4" />
              <span>Export</span>
            </Button>
          </>
        }
      />

      <section className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, ID or role…" aria-label="Search employees" className="h-10 rounded-xl pl-9" />
          </div>
          <Button variant="outline" className="h-10 rounded-xl">
            <Filter className="size-4" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="icon" aria-label="Column settings" className="size-10 rounded-xl">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox aria-label="Select all employees" />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Checkbox aria-label={`Select ${e.name}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="bg-brand/10 text-xs text-brand">
                          {e.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{e.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {e.id} · {e.role}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{e.department}</TableCell>
                  <TableCell className="text-sm">{e.branch}</TableCell>
                  <TableCell className="text-sm">{e.type}</TableCell>
                  <TableCell className="text-sm tabular-nums">{e.joined}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[e.status]}>
                      {e.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-4 text-xs text-muted-foreground">
          <span>Showing 8 of 1,244 employees</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}