import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  branches,
  departments,
  designations,
  employeeTags,
  type Employee,
} from "@/data/hrms";

const emptyEmployee: Employee = {
  id: "",
  name: "",
  role: designations[0],
  department: departments[0],
  branch: branches[0],
  type: "Full-time",
  status: "Active",
  joined: new Date().toISOString().slice(0, 10),
  email: "",
  tags: [],
};

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Employee) => void;
}) {
  const [form, setForm] = useState<Employee>(employee ?? emptyEmployee);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(employee ?? emptyEmployee);
      setError("");
    }
  }, [open, employee]);

  const set = <K extends keyof Employee>(key: K, value: Employee[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) return setError("Full name is required.");
    if (name.length > 80) return setError("Full name must be under 80 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid work email.");
    onSave({ ...form, name, email });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit employee" : "New employee"}</DialogTitle>
          <DialogDescription>
            Department, designation and tags drive search, filters and bulk actions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="emp-name">Full name</Label>
            <Input id="emp-name" value={form.name} maxLength={80} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="emp-email">Work email</Label>
            <Input id="emp-email" type="email" value={form.email} maxLength={120} onChange={(e) => set("email", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => set("department", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Designation</Label>
            <Select value={form.role} onValueChange={(v) => set("role", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {designations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Branch</Label>
            <Select value={form.branch} onValueChange={(v) => set("branch", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Contract type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v as Employee["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Full-time", "Part-time", "Contract"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as Employee["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Active", "On Leave", "Probation"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emp-joined">Joining date</Label>
            <Input id="emp-joined" type="date" value={form.joined} onChange={(e) => set("joined", e.target.value)} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {employeeTags.map((tag) => {
                const active = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      set("tags", active ? form.tags.filter((t) => t !== tag) : [...form.tags, tag])
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{employee ? "Save changes" : "Create employee"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}