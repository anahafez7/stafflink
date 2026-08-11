import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  cities,
  departments,
  designations,
  districtsByCity,
  employeeTags,
  employees as directory,
  genders,
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
  avatar: "",
  extraEmail: "",
  password: "",
  phone: "",
  autoId: true,
  city: "",
  district: "",
  position: "",
  gender: "",
  manager: "",
  idKind: "National ID",
  nationalId: "",
  idIssueDate: "",
  idExpiryDate: "",
  addressOnId: "",
  contractStart: "",
  contractEnd: "",
  medicalInsurance: "",
  socialInsuranceDate: "",
  militaryExpireDate: "",
  customFields: [],
  salaryBasis: "Gross",
  salaryGross: "",
  salaryNet: "",
  allowance: "",
  targetValue: "20",
  targetDuration: "Monthly",
  disabilityQuota: false,
  isInsured: false,
  allowPastExpiry: false,
};

function Field({
  label,
  htmlFor,
  aside,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex min-h-5 items-center justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        {aside}
      </div>
      {children}
    </div>
  );
}

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
      setForm({ ...emptyEmployee, ...(employee ?? {}) });
      setError("");
    }
  }, [open, employee]);

  const set = <K extends keyof Employee>(key: K, value: Employee[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const managers = useMemo(
    () => directory.filter((e) => e.name !== form.name).map((e) => e.name),
    [form.name],
  );
  const districts = form.city ? (districtsByCity[form.city] ?? []) : [];

  const computedNet =
    form.salaryBasis === "Gross" && form.salaryGross
      ? String(Math.round(Number(form.salaryGross) * 0.85))
      : form.salaryNet;

  const setCustom = (index: number, patch: Partial<{ label: string; value: string }>) =>
    setForm((prev) => ({
      ...prev,
      customFields: (prev.customFields ?? []).map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));

  const submit = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) return setError("Full name is required.");
    if (name.length > 80) return setError("Full name must be under 80 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid work email.");
    if (!employee && (form.password ?? "").length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.extraEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.extraEmail))
      return setError("Enter a valid extra email.");
    if (
      form.idExpiryDate &&
      !form.allowPastExpiry &&
      form.idExpiryDate < new Date().toISOString().slice(0, 10)
    )
      return setError("ID expiry date is in the past. Enable the admin override to continue.");
    onSave({ ...form, name, email, salaryNet: computedNet ?? "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit employee" : "New employee"}</DialogTitle>
          <DialogDescription>
            Identity, contract, insurance and payroll details for the employee record.
          </DialogDescription>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 p-4 sm:flex-row sm:items-center">
          <Avatar className="size-16">
            <AvatarImage src={form.avatar || undefined} alt={form.name || "Employee avatar"} />
            <AvatarFallback className="bg-brand/10 text-brand">
              {(form.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Avatar</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline" size="sm" className="w-fit">
                <label className="cursor-pointer">
                  <Upload className="size-4" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set("avatar", URL.createObjectURL(file));
                    }}
                  />
                </label>
              </Button>
              <Input
                value={form.avatar ?? ""}
                placeholder="or paste image URL…"
                onChange={(e) => set("avatar", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Email (login)" htmlFor="emp-email">
            <Input id="emp-email" type="email" value={form.email} maxLength={120} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Extra Email (Outlook, Gmail)" htmlFor="emp-email2">
            <Input id="emp-email2" type="email" value={form.extraEmail ?? ""} onChange={(e) => set("extraEmail", e.target.value)} />
          </Field>
          <Field label="Password" htmlFor="emp-pass">
            <Input id="emp-pass" type="password" placeholder="min 6 chars" value={form.password ?? ""} onChange={(e) => set("password", e.target.value)} />
          </Field>
          <Field label="Full name" htmlFor="emp-name">
            <Input id="emp-name" value={form.name} maxLength={80} onChange={(e) => set("name", e.target.value)} />
          </Field>

          <Field label="Phone" htmlFor="emp-phone">
            <Input id="emp-phone" placeholder="+20 100 123 4567" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field
            label="Employee ID"
            htmlFor="emp-id"
            aside={
              <label className="flex items-center gap-2 text-xs font-medium">
                <Checkbox checked={!!form.autoId} onCheckedChange={(v) => set("autoId", v === true)} />
                Auto-generate ID
              </label>
            }
          >
            <Input
              id="emp-id"
              value={form.autoId ? "" : form.id}
              disabled={!!form.autoId}
              placeholder={form.autoId ? "Auto-generated on save (e.g. SL-1240)" : "SL-1240"}
              onChange={(e) => set("id", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => set("status", v as Employee["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Active", "On Leave", "Probation"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="City">
            <Select value={form.city ?? ""} onValueChange={(v) => setForm((p) => ({ ...p, city: v, district: "" }))}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="District">
            <Select value={form.district ?? ""} onValueChange={(v) => set("district", v)} disabled={!form.city}>
              <SelectTrigger><SelectValue placeholder={form.city ? "—" : "Select a city first"} /></SelectTrigger>
              <SelectContent>
                {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Department">
            <Select value={form.department} onValueChange={(v) => set("department", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Position">
            <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v, position: v }))}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {designations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Gender">
            <Select value={form.gender ?? ""} onValueChange={(v) => set("gender", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {genders.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Manager">
            <Select value={form.manager ?? ""} onValueChange={(v) => set("manager", v)}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {managers.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field
            label={form.idKind === "Passport" ? "Passport" : "National ID"}
            htmlFor="emp-nid"
            aside={
              <label className="flex items-center gap-2 text-xs font-medium">
                <Checkbox
                  checked={form.idKind === "Passport"}
                  onCheckedChange={(v) => set("idKind", v === true ? "Passport" : "National ID")}
                />
                Passport
              </label>
            }
          >
            <Input
              id="emp-nid"
              value={form.nationalId ?? ""}
              placeholder={form.idKind === "Passport" ? "Passport number" : "14-digit National ID"}
              onChange={(e) => set("nationalId", e.target.value)}
            />
          </Field>
          <Field label="ID Issue Date" htmlFor="emp-idissue">
            <Input id="emp-idissue" type="date" value={form.idIssueDate ?? ""} onChange={(e) => set("idIssueDate", e.target.value)} />
          </Field>
          <Field label="ID Expiry Date" htmlFor="emp-idexp">
            <Input id="emp-idexp" type="date" value={form.idExpiryDate ?? ""} onChange={(e) => set("idExpiryDate", e.target.value)} />
          </Field>

          <Field label="Address on ID" htmlFor="emp-addr">
            <Input id="emp-addr" placeholder="As written on national ID" value={form.addressOnId ?? ""} onChange={(e) => set("addressOnId", e.target.value)} />
          </Field>
          <Field label="Contract Type">
            <Select value={form.type} onValueChange={(v) => set("type", v as Employee["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Full-time", "Part-time", "Contract"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Contract Start Date" htmlFor="emp-cstart">
            <Input id="emp-cstart" type="date" value={form.contractStart ?? ""} onChange={(e) => setForm((p) => ({ ...p, contractStart: e.target.value, joined: e.target.value || p.joined }))} />
          </Field>
          <Field label="Contract End Date" htmlFor="emp-cend">
            <Input id="emp-cend" type="date" value={form.contractEnd ?? ""} onChange={(e) => set("contractEnd", e.target.value)} />
          </Field>

          <Field label="Medical Insurance Details" htmlFor="emp-med">
            <Input id="emp-med" value={form.medicalInsurance ?? ""} onChange={(e) => set("medicalInsurance", e.target.value)} />
          </Field>
          <Field label="Social Insurance Date" htmlFor="emp-social">
            <Input id="emp-social" type="date" value={form.socialInsuranceDate ?? ""} onChange={(e) => set("socialInsuranceDate", e.target.value)} />
          </Field>
          <Field label="Military Expire Date" htmlFor="emp-mil">
            <Input id="emp-mil" type="date" value={form.militaryExpireDate ?? ""} onChange={(e) => set("militaryExpireDate", e.target.value)} />
          </Field>
          <Field label="Branch">
            <Select value={form.branch} onValueChange={(v) => set("branch", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Custom fields */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Custom notes / fields
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setForm((p) => ({ ...p, customFields: [...(p.customFields ?? []), { label: "", value: "" }] }))
              }
            >
              <Plus className="size-4" />
              <span>Add Field</span>
            </Button>
          </div>
          {(form.customFields ?? []).length === 0 ? (
            <p className="text-sm italic text-muted-foreground">No custom fields added.</p>
          ) : (
            <div className="space-y-2">
              {(form.customFields ?? []).map((f, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row">
                  <Input placeholder="Label" value={f.label} onChange={(e) => setCustom(i, { label: e.target.value })} />
                  <Input placeholder="Value" value={f.value} onChange={(e) => setCustom(i, { value: e.target.value })} />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove field"
                    onClick={() =>
                      setForm((p) => ({ ...p, customFields: (p.customFields ?? []).filter((_, x) => x !== i) }))
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payroll */}
        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Salary Basis">
            <Select value={form.salaryBasis ?? "Gross"} onValueChange={(v) => set("salaryBasis", v as Employee["salaryBasis"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Gross", "Net"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Salary Gross (EGP)" htmlFor="emp-gross">
            <Input
              id="emp-gross"
              inputMode="decimal"
              value={form.salaryGross ?? ""}
              disabled={form.salaryBasis === "Net"}
              onChange={(e) => set("salaryGross", e.target.value)}
            />
          </Field>
          <Field label="Salary Net (EGP)" htmlFor="emp-net">
            <Input
              id="emp-net"
              inputMode="decimal"
              value={form.salaryBasis === "Gross" ? computedNet ?? "" : form.salaryNet ?? ""}
              disabled={form.salaryBasis === "Gross"}
              onChange={(e) => set("salaryNet", e.target.value)}
            />
          </Field>
          <Field label="Allowance (EGP)" htmlFor="emp-allow">
            <Input id="emp-allow" inputMode="decimal" value={form.allowance ?? ""} onChange={(e) => set("allowance", e.target.value)} />
          </Field>

          <Field label="Target Value" htmlFor="emp-target">
            <Input id="emp-target" inputMode="decimal" value={form.targetValue ?? ""} onChange={(e) => set("targetValue", e.target.value)} />
          </Field>
          <Field label="Target Duration">
            <Select value={form.targetDuration ?? "Monthly"} onValueChange={(v) => set("targetDuration", v as Employee["targetDuration"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Monthly", "Quarterly", "Yearly"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <Checkbox checked={!!form.disabilityQuota} onCheckedChange={(v) => set("disabilityQuota", v === true)} />
            5% Quota (Disability)
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <Checkbox checked={!!form.isInsured} onCheckedChange={(v) => set("isInsured", v === true)} />
            Is Insured
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={!!form.allowPastExpiry} onCheckedChange={(v) => set("allowPastExpiry", v === true)} />
          Override: allow expiry date in the past (admin/HR only)
        </label>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
          <div className="flex flex-wrap gap-1.5">
            {employeeTags.map((tag) => {
              const active = form.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => set("tags", active ? form.tags.filter((t) => t !== tag) : [...form.tags, tag])}
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

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{employee ? "Save changes" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
