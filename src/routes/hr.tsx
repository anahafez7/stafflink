import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Pencil, Plus, Search, Tag, Trash2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { BulkBar } from "@/components/data/bulk-bar";
import { EmployeeDialog } from "@/components/hr/employee-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelection } from "@/hooks/use-selection";
import { cn } from "@/lib/utils";
import {
  branches,
  departments,
  employeeTags,
  employees as seedEmployees,
  type Employee,
} from "@/data/hrms";

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
  const [rows, setRows] = useState<Employee[]>(seedEmployees);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [branch, setBranch] = useState("all");
  const [status, setStatus] = useState("all");
  const [tags, setTags] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((e) => {
      if (department !== "all" && e.department !== department) return false;
      if (branch !== "all" && e.branch !== branch) return false;
      if (status !== "all" && e.status !== status) return false;
      if (tags.length && !tags.every((t) => e.tags.includes(t))) return false;
      if (!terms.length) return true;
      const haystack = [e.name, e.id, e.role, e.department, e.branch, e.type, e.status, e.email, ...e.tags]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [rows, query, department, branch, status, tags]);

  const ids = useMemo(() => filtered.map((e) => e.id), [filtered]);
  const selection = useSelection(ids);
  const hasFilters = query || department !== "all" || branch !== "all" || status !== "all" || tags.length > 0;

  const resetFilters = () => {
    setQuery("");
    setDepartment("all");
    setBranch("all");
    setStatus("all");
    setTags([]);
  };

  const saveEmployee = (employee: Employee) => {
    setRows((prev) => {
      if (prev.some((e) => e.id === employee.id)) {
        return prev.map((e) => (e.id === employee.id ? employee : e));
      }
      const nextId = `SL-${1000 + prev.length + Math.floor(Math.random() * 900)}`;
      return [{ ...employee, id: employee.id || nextId }, ...prev];
    });
    toast.success(editing ? `${employee.name} updated` : `${employee.name} added to the directory`);
  };

  const bulkStatus = (next: Employee["status"]) => {
    const count = selection.count;
    setRows((prev) => prev.map((e) => (selection.isSelected(e.id) ? { ...e, status: next } : e)));
    selection.clear();
    toast.success(`${count} employee${count === 1 ? "" : "s"} set to ${next}`);
  };

  const bulkTag = (tag: string) => {
    const count = selection.count;
    setRows((prev) =>
      prev.map((e) =>
        selection.isSelected(e.id) && !e.tags.includes(tag) ? { ...e, tags: [...e.tags, tag] } : e,
      ),
    );
    selection.clear();
    toast.success(`Tagged ${count} employee${count === 1 ? "" : "s"} as “${tag}”`);
  };

  const bulkDelete = () => {
    const count = selection.count;
    setRows((prev) => prev.filter((e) => !selection.isSelected(e.id)));
    selection.clear();
    toast.success(`${count} employee${count === 1 ? "" : "s"} removed`);
  };

  const exportSelection = () => {
    const target = selection.count ? filtered.filter((e) => selection.isSelected(e.id)) : filtered;
    toast.success(`Exported ${target.length} record${target.length === 1 ? "" : "s"} to CSV`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section="HR"
        title="Employee directory"
        description={`${filtered.length} of ${rows.length} records · ${branches.length} branches · ${departments.length} departments`}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="size-4" />
              <span>New employee</span>
            </Button>
            <Button
              variant="outline"
              className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
              onClick={exportSelection}
            >
              <Download className="size-4" />
              <span>Export</span>
            </Button>
          </>
        }
      />

      <section className="surface-card overflow-hidden">
        <div className="space-y-3 border-b border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 100))}
              placeholder="Search name, ID, email, designation, branch or tag…"
              aria-label="Search employees"
              className="h-10 rounded-xl pl-9"
            />
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="h-10 w-[160px] rounded-xl" aria-label="Filter by department">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl" aria-label="Filter by branch">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-[130px] rounded-xl" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["Active", "On Leave", "Probation"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters ? (
            <Button variant="ghost" className="h-10 rounded-xl" onClick={resetFilters}>
              <X className="size-4" />
              <span>Reset</span>
            </Button>
          ) : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {employeeTags.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTags((prev) => (active ? prev.filter((t) => t !== tag) : [...prev, tag]))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <BulkBar count={selection.count} noun="employee" onClear={selection.clear}>
          <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkStatus("Active")}>
            <UserCheck className="size-4" />
            <span>Set active</span>
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkStatus("On Leave")}>
            <span>Set on leave</span>
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkTag("High performer")}>
            <Tag className="size-4" />
            <span>Tag high performer</span>
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg" onClick={exportSelection}>
            <Download className="size-4" />
            <span>Export</span>
          </Button>
          <Button size="sm" variant="destructive" className="rounded-lg" onClick={bulkDelete}>
            <Trash2 className="size-4" />
            <span>Delete</span>
          </Button>
        </BulkBar>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all employees"
                    checked={selection.allSelected}
                    onCheckedChange={selection.toggleAll}
                  />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No employees match this search.
                  </TableCell>
                </TableRow>
              ) : null}
              {filtered.map((e) => (
                <TableRow key={e.id} data-state={selection.isSelected(e.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${e.name}`}
                      checked={selection.isSelected(e.id)}
                      onCheckedChange={() => selection.toggle(e.id)}
                    />
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
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {e.tags.length === 0 ? <span className="text-xs text-muted-foreground">—</span> : null}
                      {e.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[11px] font-normal">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[e.status]}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${e.name}`}
                        onClick={() => {
                          setEditing(e);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${e.name}`}
                        onClick={() => {
                          setRows((prev) => prev.filter((row) => row.id !== e.id));
                          toast.success(`${e.name} removed`);
                        }}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-4 text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {rows.length} employees
          </span>
        </div>
      </section>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editing}
        onSave={saveEmployee}
      />
    </div>
  );
}