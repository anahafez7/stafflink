import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Download,
  FileText,
  FileSpreadsheet,
  LogIn,
  LogOut,
  Megaphone,
  Plus,
  Search,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { BulkBar } from "@/components/data/bulk-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSelection } from "@/hooks/use-selection";
import { AttendanceCalendar } from "@/components/self-service/attendance-calendar";
import { downloadCsv, printTableAsPdf } from "@/lib/export";
import { useAuth } from "@/lib/auth";
import {
  announcements,
  attendanceHistory,
  leaveBalances,
  leaveHistory,
  myPunchLog,
  payslips,
  type LeaveRequest,
} from "@/data/modules";

export const Route = createFileRoute("/self-service")({
  head: () => ({
    meta: [
      { title: "Self Service — StaffLink" },
      {
        name: "description",
        content: "Employee self service: leave and loan requests, payslips, announcements, tasks and profile updates.",
      },
      { property: "og:title", content: "Self Service — StaffLink" },
      { property: "og:description", content: "Requests, payslips, announcements and profile updates." },
    ],
  }),
  component: SelfServicePage,
});

const statusStyles: Record<string, string> = {
  Pending: "border-warning/40 text-warning",
  Approved: "border-success/40 text-success",
  Rejected: "border-destructive/40 text-destructive",
};

const quickActions = [
  { label: "Leave request", icon: CalendarDays },
  { label: "Loan / advance", icon: Wallet },
  { label: "Attendance fix", icon: Clock },
  { label: "Download forms", icon: FileText },
];

const clockTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

function useNow() {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    setNow(clockTime());
    const id = window.setInterval(() => setNow(clockTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function SelfServicePage() {
  const { user } = useAuth();
  const canApprove = user ? user.role === "manager" || user.role === "hr_manager" || user.role === "admin" : false;
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveHistory);
  const [query, setQuery] = useState("");
  const [balances, setBalances] = useState(leaveBalances);
  const [punchIn, setPunchIn] = useState<string | null>(null);
  const [punchOut, setPunchOut] = useState<string | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(leaveBalances[0]?.type ?? "Annual");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const now = useNow();

  const handlePunch = () => {
    if (!punchIn) {
      const t = clockTime();
      setPunchIn(t);
      toast.success(`Checked in at ${t}`);
      return;
    }
    if (!punchOut) {
      const t = clockTime();
      setPunchOut(t);
      toast.success(`Checked out at ${t}`);
      return;
    }
    toast.info("You already completed today's shift.");
  };

  const submitLeave = () => {
    if (!leaveFrom || !leaveTo) {
      toast.error("Pick a start and end date.");
      return;
    }
    if (leaveReason.trim().length < 5) {
      toast.error("Add a short reason (at least 5 characters).");
      return;
    }
    const start = new Date(leaveFrom);
    const end = new Date(leaveTo);
    if (end < start) {
      toast.error("End date must be after the start date.");
      return;
    }
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
    const balance = balances.find((b) => b.type === leaveType);
    if (balance && balance.used + days > balance.total) {
      toast.error(`Only ${balance.total - balance.used} ${leaveType.toLowerCase()} days left.`);
      return;
    }
    const remaining = balance ? balance.total - balance.used : 0;
    const id = `REQ-${String(3410 + requests.length)}`;
    setRequests((prev) => [
      {
        id,
        type: `${leaveType} leave`,
        leaveType,
        period: `${leaveFrom} → ${leaveTo}`,
        days,
        status: "Pending",
        reason: leaveReason.trim(),
        submitted: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        balanceBefore: remaining,
        balanceAfter: remaining - days,
        decision: "Awaiting manager approval",
      },
      ...prev,
    ]);
    setLeaveOpen(false);
    setLeaveFrom("");
    setLeaveTo("");
    setLeaveReason("");
    toast.success(`${leaveType} leave requested · ${days} day${days === 1 ? "" : "s"}`);
  };

  const applyDecision = (ids: string[], status: LeaveRequest["status"]) => {
    if (ids.length === 0) return;
    const stamp = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const deltas = new Map<string, number>();
    setRequests((prev) =>
      prev.map((r) => {
        if (!ids.includes(r.id) || r.status === status) return r;
        if (status === "Approved" && r.status !== "Approved") {
          deltas.set(r.leaveType, (deltas.get(r.leaveType) ?? 0) + r.days);
        }
        if (r.status === "Approved" && status !== "Approved") {
          deltas.set(r.leaveType, (deltas.get(r.leaveType) ?? 0) - r.days);
        }
        return {
          ...r,
          status,
          decision:
            status === "Pending"
              ? "Reopened · awaiting manager approval"
              : `${status} by ${user?.name ?? "Manager"} · ${stamp}`,
        };
      }),
    );
    setBalances((prev) =>
      prev.map((b) => {
        const delta = deltas.get(b.type) ?? 0;
        return delta ? { ...b, used: Math.max(0, Math.min(b.total, b.used + delta)) } : b;
      }),
    );
  };

  const attendanceRows = () =>
    myPunchLog.map((d) => [d.day, d.in, d.out, d.hours, d.state] as (string | number)[]);

  const exportCsv = () => {
    downloadCsv("stafflink-weekly-attendance.csv", [
      ["Day", "Check in", "Check out", "Hours", "Status"],
      ...attendanceRows(),
      [],
      ["Date", "Check in", "Check out", "Hours", "Status"],
      ...attendanceHistory.map((r) => [r.date, r.in, r.out, r.hours, r.state]),
    ]);
    toast.success("Attendance exported as CSV");
  };

  const exportPdf = () => {
    const ok = printTableAsPdf(
      "Weekly attendance & punch log",
      `${user?.name ?? "Employee"} · StaffLink`,
      ["Day", "Check in", "Check out", "Hours", "Status"],
      attendanceRows(),
    );
    if (!ok) toast.error("Allow pop-ups to export the PDF.");
  };

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return requests;
    return requests.filter((r) => {
      const haystack = [r.id, r.type, r.period, r.status, r.reason, r.decision].join(" ").toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [requests, query]);

  const ids = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const selection = useSelection(ids);

  const bulkSet = (status: LeaveRequest["status"]) => {
    const chosen = selection.selected;
    applyDecision(chosen, status);
    selection.clear();
    toast.success(`${chosen.length} request${chosen.length === 1 ? "" : "s"} ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section="Self Service"
        title="Employee self service"
        description="Everything an employee needs, in three clicks or fewer."
        actions={
          <Button variant="secondary" onClick={() => setLeaveOpen(true)}>
            <Plus className="size-4" />
            <span>New request</span>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <section id="attendance" className="surface-card scroll-mt-20 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Check in / out</h2>
              <p className="mt-1 text-xs text-muted-foreground">Cairo HQ · Web punch</p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">{now}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Checked in</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{punchIn ?? "—"}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Checked out</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{punchOut ?? "—"}</p>
            </div>
          </div>

          <Button
            className="mt-4 w-full"
            variant={punchIn && !punchOut ? "destructive" : "default"}
            disabled={Boolean(punchIn && punchOut)}
            onClick={handlePunch}
          >
            {punchIn && !punchOut ? <LogOut className="size-4" /> : <LogIn className="size-4" />}
            <span>{!punchIn ? "Check in" : !punchOut ? "Check out" : "Shift completed"}</span>
          </Button>

          <ul className="mt-4 divide-y divide-border">
            {myPunchLog.map((d) => (
              <li key={d.day} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-10 shrink-0 text-muted-foreground">{d.day}</span>
                <span className="tabular-nums">
                  {d.in} – {d.out}
                </span>
                <span className="ml-auto tabular-nums text-muted-foreground">{d.hours}</span>
                <Badge
                  variant="outline"
                  className={
                    d.state === "Late"
                      ? "border-warning/40 text-warning"
                      : d.state === "Overtime"
                        ? "border-brand/40 text-brand"
                        : "border-success/40 text-success"
                  }
                >
                  {d.state}
                </Badge>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="rounded-lg" onClick={exportCsv}>
              <FileSpreadsheet className="size-4" />
              <span>Export CSV</span>
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg" onClick={exportPdf}>
              <Download className="size-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        </section>

        <section id="leaves" className="surface-card scroll-mt-20 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Leaves</h2>
            <Button size="sm" variant="outline" className="rounded-lg" onClick={() => setLeaveOpen(true)}>
              <CalendarDays className="size-4" />
              <span>Request leave</span>
            </Button>
          </div>
          <ul className="mt-4 space-y-4">
            {balances.map((b) => (
              <li key={b.type}>
                <div className="flex items-center justify-between text-sm">
                  <span>{b.type}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {b.total - b.used} of {b.total} days left
                  </span>
                </div>
                <Progress value={(b.used / b.total) * 100} className="mt-1.5 h-1.5" />
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="text-xs text-muted-foreground">Upcoming approved leave</p>
            <p className="mt-1 text-sm font-medium">
              {requests.find((r) => r.status === "Approved")?.period ?? "No approved leave scheduled"}
            </p>
          </div>
        </section>
      </div>

      <AttendanceCalendar records={attendanceHistory} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => toast.success(`${a.label} form opened`)}
            className="surface-card flex items-center gap-3 p-4 text-left transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <a.icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{a.label}</span>
              <span className="block text-xs text-muted-foreground">Submit in seconds</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        <section className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <h2 className="text-sm font-semibold">Leave request history</h2>
            <div className="relative ml-auto min-w-0 flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                placeholder="Search requests…"
                aria-label="Search requests"
                className="h-9 rounded-xl pl-9"
              />
            </div>
          </div>

          <BulkBar count={selection.count} noun="request" onClear={selection.clear}>
            {canApprove ? (
              <>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkSet("Approved")}>
                  <Check className="size-4" />
                  <span>Approve</span>
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkSet("Rejected")}>
                  <X className="size-4" />
                  <span>Reject</span>
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkSet("Pending")}>
                  <span>Reopen</span>
                </Button>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Only managers can approve or reject requests.</span>
            )}
          </BulkBar>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      aria-label="Select all requests"
                      checked={selection.allSelected}
                      onCheckedChange={selection.toggleAll}
                    />
                  </TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Decision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                      No requests match this search.
                    </TableCell>
                  </TableRow>
                ) : null}
                {filtered.map((r) => (
                  <TableRow key={r.id} data-state={selection.isSelected(r.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${r.id}`}
                        checked={selection.isSelected(r.id)}
                        onCheckedChange={() => selection.toggle(r.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm font-medium tabular-nums">{r.id}</TableCell>
                    <TableCell className="text-sm">{r.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.period}
                      <span className="block text-xs">Submitted {r.submitted}</span>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">{r.days || "—"}</TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {r.status === "Rejected" ? (
                        <span className="text-muted-foreground">{r.balanceBefore} (unchanged)</span>
                      ) : (
                        <span>
                          {r.balanceBefore} → <span className="font-medium">{r.balanceAfter}</span>
                          <span className="block text-xs text-muted-foreground">
                            −{r.days} {r.leaveType.toLowerCase()} day{r.days === 1 ? "" : "s"}
                          </span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[16rem] text-sm text-muted-foreground">{r.reason}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canApprove && r.status === "Pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => {
                              applyDecision([r.id], "Approved");
                              toast.success(`${r.id} approved`);
                            }}
                          >
                            <Check className="size-4" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => {
                              applyDecision([r.id], "Rejected");
                              toast.success(`${r.id} rejected`);
                            }}
                          >
                            <X className="size-4" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">{r.decision}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Megaphone className="size-4 text-primary" />
            Announcements
          </h2>
          <ul className="mt-3 space-y-3">
            {announcements.map((a) => (
              <li key={a.title} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium">{a.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.when}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
        </section>
        <section id="profile" className="surface-card scroll-mt-20 p-5">
          <h2 className="text-sm font-semibold">My profile</h2>
          <div className="mt-3 flex min-w-0 items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-sm font-semibold text-brand">
              {user?.initials ?? "—"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? "Not signed in"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.title} · {user?.email}
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border p-3">
              <dt className="text-xs text-muted-foreground">Branch</dt>
              <dd className="mt-1 font-medium">Cairo HQ</dd>
            </div>
            <div className="rounded-xl border border-border p-3">
              <dt className="text-xs text-muted-foreground">Department</dt>
              <dd className="mt-1 font-medium">Technology</dd>
            </div>
          </dl>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Payslips</h2>
          <ul className="mt-3 divide-y divide-border">
            {payslips.map((p) => (
              <li key={p.month} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.month}</p>
                  <p className="text-xs text-muted-foreground">
                    Gross {p.gross} · Net {p.net} · issued {p.issued}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 rounded-lg">
                  <Download className="size-4" />
                  <span>PDF</span>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request leave</DialogTitle>
            <DialogDescription>Submit a leave request for manager approval.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="leave-type">Leave type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leave-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {balances.map((b) => (
                    <SelectItem key={b.type} value={b.type}>
                      {b.type} · {b.total - b.used} left
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="leave-from">From</Label>
                <Input id="leave-from" type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="leave-to">To</Label>
                <Input id="leave-to" type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-reason">Reason</Label>
              <Textarea
                id="leave-reason"
                rows={3}
                maxLength={280}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Why do you need this leave?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitLeave}>Submit request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
