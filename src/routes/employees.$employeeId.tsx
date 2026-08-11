import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Briefcase, Building2, CalendarDays, CheckCircle2, Clock, CreditCard,
  FileText, Mail, MapPin, Package, Phone, Wallet,
} from "lucide-react";
import { Crosshair, Download, Lock, Plus, QrCode, Tag, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { attendanceHistory } from "@/data/modules";
import {
  employeeAdvances, employeeAttendanceSummary, employeeBalances, employeeCustody,
  employeeDocs, employeeLeaves, employeeSite, getEmployee,
} from "@/data/employee-detail";

export const Route = createFileRoute("/employees/$employeeId")({
  head: () => ({
    meta: [
      { title: "Employee profile — StaffLink HR" },
      { name: "description", content: "Full employee record: info, leaves, custody, attendance, advance payments, assigned worksite and documents." },
      { property: "og:title", content: "Employee profile — StaffLink HR" },
      { property: "og:description", content: "Employee info, leaves, custody, attendance, advances, location and documents." },
    ],
  }),
  component: EmployeeDetailPage,
});

const statusTone: Record<string, string> = {
  Active: "border-success/40 text-success",
  Approved: "border-success/40 text-success",
  Valid: "border-success/40 text-success",
  "In custody": "border-primary/40 text-primary",
  Pending: "border-warning/40 text-warning",
  Expiring: "border-warning/40 text-warning",
  "On Leave": "border-warning/40 text-warning",
  Rejected: "border-destructive/40 text-destructive",
  Expired: "border-destructive/40 text-destructive",
  Probation: "border-primary/40 text-primary",
};

function Pill({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={statusTone[value] ?? "text-muted-foreground"}>
      {value}
    </Badge>
  );
}

function Field({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value?: string | undefined }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

function EmployeeDetailPage() {
  const { employeeId } = Route.useParams();
  const navigate = useNavigate();
  const employee = getEmployee(employeeId);
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchAt, setPunchAt] = useState<string | null>(null);

  const data = useMemo(() => {
    if (!employee) return null;
    return {
      leaves: employeeLeaves(employee.id),
      balances: employeeBalances(employee.id),
      custody: employeeCustody(employee.id),
      advances: employeeAdvances(employee.id),
      docs: employeeDocs(employee),
      site: employeeSite(employee),
      summary: employeeAttendanceSummary(employee.id),
      punches: attendanceHistory.slice(-14).reverse(),
    };
  }, [employee]);

  if (!employee || !data) {
    return (
      <div className="space-y-5">
        <PageHeader section="HR" title="Employee not found" description="This record no longer exists in the directory." />
        <Button variant="secondary" onClick={() => navigate({ to: "/hr" })}>
          <ArrowLeft className="size-4" />
          <span>Back to directory</span>
        </Button>
      </div>
    );
  }

  const togglePunch = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setPunchedIn((p) => !p);
    setPunchAt(now);
    toast.success(punchedIn ? `Checked out at ${now}` : `Checked in at ${now} · ${data.site.name}`);
  };

  const initials = employee.name.split(" ").map((p) => p[0]).join("");
  const outstanding = data.advances.reduce((s, a) => s + a.remaining, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        section="HR · Employee"
        title={employee.name}
        description={`${employee.id} · ${employee.role} · ${employee.department} · ${employee.branch}`}
        actions={
          <Button asChild variant="outline" className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground">
            <Link to="/hr">
              <ArrowLeft className="size-4" />
              <span>Directory</span>
            </Link>
          </Button>
        }
      />

      <section className="surface-card flex flex-wrap items-center gap-4 p-4">
        <Avatar className="size-14">
          {employee.avatar ? <AvatarImage src={employee.avatar} alt={employee.name} /> : null}
          <AvatarFallback className="bg-brand/10 text-brand">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <Pill value={employee.status} />
            {employee.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-[11px] font-normal">{t}</Badge>
            ))}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{employee.email} · joined {employee.joined}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-border px-3 py-2 text-center">
            <p className="text-[11px] uppercase text-muted-foreground">Attendance</p>
            <p className="text-sm font-semibold">{data.summary.present}/{data.summary.workingDays}</p>
          </div>
          <div className="rounded-xl border border-border px-3 py-2 text-center">
            <p className="text-[11px] uppercase text-muted-foreground">Custody</p>
            <p className="text-sm font-semibold">{data.custody.filter((c) => c.status === "In custody").length} items</p>
          </div>
          <div className="rounded-xl border border-border px-3 py-2 text-center">
            <p className="text-[11px] uppercase text-muted-foreground">Advances due</p>
            <p className="text-sm font-semibold">EGP {outstanding.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <Tabs defaultValue="info" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="leaves">Leaves</TabsTrigger>
            <TabsTrigger value="custody">Custody</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="advances">Advance payments</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="space-y-4">
          <section className="surface-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Personal</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field icon={Mail} label="Email" value={employee.email} />
              <Field icon={Mail} label="Extra email" value={employee.extraEmail} />
              <Field icon={Phone} label="Phone" value={employee.phone} />
              <Field label="Gender" value={employee.gender} />
              <Field icon={MapPin} label="City / district" value={[employee.city, employee.district].filter(Boolean).join(" · ")} />
              <Field label={employee.idKind ?? "National ID"} value={employee.nationalId} />
              <Field label="ID issue" value={employee.idIssueDate} />
              <Field label="ID expiry" value={employee.idExpiryDate} />
              <Field label="Address on ID" value={employee.addressOnId} />
            </div>
          </section>
          <section className="surface-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Employment</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field icon={Briefcase} label="Position" value={employee.position ?? employee.role} />
              <Field icon={Building2} label="Department" value={employee.department} />
              <Field icon={MapPin} label="Branch" value={employee.branch} />
              <Field label="Manager" value={employee.manager} />
              <Field label="Contract type" value={employee.type} />
              <Field icon={CalendarDays} label="Contract period" value={[employee.contractStart, employee.contractEnd].filter(Boolean).join(" → ")} />
              <Field label="Medical insurance" value={employee.medicalInsurance} />
              <Field label="Social insurance" value={employee.socialInsuranceDate} />
              <Field label="Military expiry" value={employee.militaryExpireDate} />
            </div>
          </section>
          <section className="surface-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Payroll</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field icon={Wallet} label="Salary basis" value={employee.salaryBasis} />
              <Field label="Gross" value={employee.salaryGross} />
              <Field label="Net" value={employee.salaryNet} />
              <Field label="Allowance" value={employee.allowance} />
              <Field label="Target" value={[employee.targetValue, employee.targetDuration].filter(Boolean).join(" · ")} />
              <Field label="Insured" value={employee.isInsured ? "Yes" : "No"} />
              <Field label="5% quota" value={employee.disabilityQuota ? "Yes" : "No"} />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <section className="grid gap-3 sm:grid-cols-3">
            {data.balances.map((b) => (
              <div key={b.type} className="surface-card p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.type}</span>
                  <span className="text-muted-foreground">{b.total - b.used} of {b.total} left</span>
                </div>
                <Progress value={(b.used / b.total) * 100} className="mt-3 h-2" />
              </div>
            ))}
          </section>
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.leaves.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.id}</TableCell>
                    <TableCell>{l.type}</TableCell>
                    <TableCell>{l.period}</TableCell>
                    <TableCell>{l.days}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.balanceBefore} → {l.balanceAfter}</TableCell>
                    <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground">{l.reason}</TableCell>
                    <TableCell><Pill value={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="custody">
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.custody.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <Package className="size-4 text-muted-foreground" />
                      {c.item}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.serial}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.assigned}</TableCell>
                    <TableCell>{c.condition}</TableCell>
                    <TableCell><Pill value={c.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Present", value: data.summary.present },
              { label: "Late", value: data.summary.late },
              { label: "Absent", value: data.summary.absent },
              { label: "Leave", value: data.summary.leave },
              { label: "Working days", value: data.summary.workingDays },
            ].map((s) => (
              <div key={s.label} className="surface-card p-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-semibold">{s.value}</p>
              </div>
            ))}
          </section>
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check in</TableHead>
                  <TableHead>Check out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.punches.map((p) => (
                  <TableRow key={p.date}>
                    <TableCell className="font-medium">{p.date}</TableCell>
                    <TableCell>{p.in}</TableCell>
                    <TableCell>{p.out}</TableCell>
                    <TableCell>{p.hours}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.location ?? "—"}</TableCell>
                    <TableCell><Badge variant="outline" className="text-muted-foreground">{p.state}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="advances" className="space-y-4">
          <section className="surface-card p-4">
            <p className="text-sm text-muted-foreground">Outstanding balance</p>
            <p className="text-2xl font-semibold">EGP {outstanding.toLocaleString()}</p>
          </section>
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Installments</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.advances.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <CreditCard className="size-4 text-muted-foreground" />
                      {a.id}
                    </TableCell>
                    <TableCell>EGP {a.amount.toLocaleString()}</TableCell>
                    <TableCell>{a.requested}</TableCell>
                    <TableCell>{a.installments}</TableCell>
                    <TableCell>EGP {a.remaining.toLocaleString()}</TableCell>
                    <TableCell><Pill value={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <section className="surface-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Assigned worksite</p>
                <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="size-4 text-primary" />
                  {data.site.name}
                </h3>
                <p className="text-sm text-muted-foreground">{data.site.city} · radius {data.site.radius} · {data.site.coords}</p>
              </div>
              <Badge variant="outline" className={data.site.geofence ? "border-success/40 text-success" : "text-muted-foreground"}>
                {data.site.geofence ? "Geofence on" : "Geofence off"}
              </Badge>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
              <Clock className="size-5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{punchedIn ? "Currently checked in" : "Not checked in"}</p>
                <p className="text-xs text-muted-foreground">
                  {punchAt ? `${punchedIn ? "Since" : "Last punch"} ${punchAt}` : "No punch recorded today"}
                </p>
              </div>
              <Button onClick={togglePunch} variant={punchedIn ? "destructive" : "default"}>
                <CheckCircle2 className="size-4" />
                <span>{punchedIn ? "Check out" : "Check in"}</span>
              </Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="documents">
          <section className="surface-card overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.docs.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <FileText className="size-4 text-muted-foreground" />
                      {d.name}
                    </TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell>{d.version}</TableCell>
                    <TableCell>{d.size}</TableCell>
                    <TableCell>{d.expires}</TableCell>
                    <TableCell><Pill value={d.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
