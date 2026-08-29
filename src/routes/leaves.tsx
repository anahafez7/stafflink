import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Download,
  FileSpreadsheet,
  LogIn,
  LogOut,
  Laptop,
  Megaphone,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Tablet,
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
import { Switch } from "@/components/ui/switch";
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
import { useBadges } from "@/lib/badges";
import { useNotifications } from "@/lib/notifications";
import { useDeepLinkTarget } from "@/lib/deep-link";
import { useI18n } from "@/lib/i18n";
import {
  announcements,
  attendanceHistory,
  leaveBalances,
  leaveHistory,
  myPunchLog,
  payslips,
  type LeaveRequest,
} from "@/data/modules";

export const Route = createFileRoute("/leaves")({
  head: () => ({
    meta: [
      { title: "Leaves — StaffLink" },
      {
        name: "description",
        content: "Employee leaves requests and history.",
      },
      { property: "og:title", content: "Leaves — StaffLink" },
      { property: "og:description", content: "Leave requests and history." },
    ],
  }),
  component: LeavesPage,
});

const statusStyles: Record<string, string> = {
  Pending: "border-warning/40 text-warning",
  Approved: "border-success/40 text-success",
  Rejected: "border-destructive/40 text-destructive",
};

const quickActions = [
  { label: "Leave request", icon: CalendarDays },
  { label: "Loan / advance", icon: Wallet },

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

const initialDevices = [
  { name: "iPhone 15 · StaffLink app", location: "Cairo, EG", lastActive: "Active now", icon: Smartphone, current: true },
  { name: "MacBook Pro · Chrome", location: "Cairo HQ", lastActive: "2 hours ago", icon: Laptop, current: false },
  { name: "iPad Air · Safari", location: "Giza, EG", lastActive: "3 days ago", icon: Tablet, current: false },
];

function LeavesPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [devices, setDevices] = useState(initialDevices);
  const canApprove = user ? user.role === "manager" || user.role === "hr_manager" || user.role === "admin" : false;
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveHistory);
  const { setPendingLeaves } = useBadges();
  const { notify } = useNotifications();
  const focusedRequest = useDeepLinkTarget("request");

  useEffect(() => {
    setPendingLeaves(requests.filter((r) => r.status === "Pending").length);
  }, [requests, setPendingLeaves]);
  const [query, setQuery] = useState("");
  const [balances, setBalances] = useState(leaveBalances);
  const [punchIn, setPunchIn] = useState<string | null>(null);
  const [punchOut, setPunchOut] = useState<string | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(leaveBalances[0]?.type ?? "Annual");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveStep, setLeaveStep] = useState(1);
  const now = useNow();

  const openLeaveForm = () => {
    setLeaveStep(1);
    setLeaveOpen(true);
  };

  const leaveDays =
    leaveFrom && leaveTo
      ? Math.max(
          0,
          Math.round((new Date(leaveTo).getTime() - new Date(leaveFrom).getTime()) / 86_400_000) + 1,
        )
      : 0;

  const stepValid = (step: number) => {
    if (step === 1) return Boolean(leaveType);
    if (step === 2) return Boolean(leaveFrom && leaveTo && leaveDays > 0);
    return leaveReason.trim().length >= 5;
  };

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

  const calculateDays = () => {
    if (!leaveFrom || !leaveTo) return 0;
    const start = new Date(leaveFrom);
    const end = new Date(leaveTo);
    if (end < start) return 0;
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  };

  const submitLeave = () => {
    const days = calculateDays();
    if (days <= 0) {
      toast.error(lang === "ar" ? "يرجى تحديد تواريخ إجازة صحيحة" : "Pick a valid date range for your leave.");
      return;
    }
    const currentBal = balances.find((b) => b.type === leaveType);
    const available = currentBal ? currentBal.total - currentBal.used : 0;
    if (days > available) {
      toast.error(
        lang === "ar"
          ? `رصيدك غير كافٍ. المتاح ${available} يوم بينما طلبت ${days} يوم.`
          : `Insufficient balance: ${available} days available, ${days} requested.`,
      );
      return;
    }

    const nextId = `LR-${2026}-${String(requests.length + 1).padStart(3, "0")}`;
    const periodStr = `${leaveFrom} → ${leaveTo}`;
    setRequests((prev) => [
      {
        id: nextId,
        type: `${leaveType} leave`,
        leaveType,
        period: periodStr,
        submitted: new Date().toISOString().slice(0, 10),
        status: "Pending",
        days,
        balanceBefore: available,
        balanceAfter: available - days,
        reason: leaveReason || (lang === "ar" ? "طلب إجازة دورية" : "Standard leave request"),
        decision: lang === "ar" ? "في انتظار اعتماد المدير" : "Awaiting manager approval",
      },
      ...prev,
    ]);
    setLeaveOpen(false);
    setLeaveFrom("");
    setLeaveTo("");
    setLeaveReason("");
    setLeaveStep(1);
    toast.success(
      lang === "ar"
        ? `تم تقديم طلب إجازة ${leaveType} · ${days} يوم`
        : `${leaveType} leave requested · ${days} day${days === 1 ? "" : "s"}`,
    );
  };

  const applyDecision = (ids: string[], status: LeaveRequest["status"]) => {
    if (ids.length === 0) return;
    const stamp = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const deltas = new Map<string, number>();
    const decided = requests.filter((r) => ids.includes(r.id) && r.status !== status);
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
              ? lang === "ar" ? "أعيد فتح الطلب · بانتظار الاعتماد" : "Reopened · awaiting manager approval"
              : `${status === "Approved" ? (lang === "ar" ? "تم الاعتماد" : "Approved") : (lang === "ar" ? "تم الرفض" : "Rejected")} ${lang === "ar" ? "بواسطة" : "by"} ${user?.name ?? "Manager"} · ${stamp}`,
        };
      }),
    );
    // Push each decision into the notification inbox so approvals are visible there.
    decided.forEach((r) => {
      if (status === "Pending") return;
      notify(
        "leaves",
        `${r.type} ${status.toLowerCase()}`,
        `${r.id} · ${r.period} (${r.days} day${r.days === 1 ? "" : "s"}) — ${status} by ${user?.name ?? "Manager"} · ${stamp}`,
        r.id,
      );
    });
    setBalances((prev) =>
      prev.map((b) => {
        const delta = deltas.get(b.type) ?? 0;
        return delta ? { ...b, used: Math.max(0, Math.min(b.total, b.used + delta)) } : b;
      }),
    );
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

  const leaveTypeTranslations: Record<string, string> = {
    "Annual": "إجازة سنوية",
    "Casual": "إجازة عارضة",
    "Sick": "إجازة مرضية",
    "Unpaid": "إجازة بدون راتب",
  };

  const handleExportLeaves = () => {
    const headers = lang === "ar"
      ? ["نوع الإجازة", "الفترة", "عدد الأيام", "تاريخ التقديم", "الحالة", "السبب", "القرار"]
      : ["Leave Type", "Period", "Days", "Submitted Date", "Status", "Reason", "Decision"];
    const rows = filtered.map((r) => [
      lang === "ar" ? (leaveTypeTranslations[r.leaveType] || r.leaveType) : r.leaveType,
      r.period,
      r.days,
      r.submitted,
      r.status,
      r.reason,
      r.decision,
    ]);
    downloadCsv(`StaffLink_Leaves_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير سجلات الإجازات إلى ملف Excel بنجاح" : "Leave records exported to Excel successfully");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section={t("leaves", "Leaves")}
        title={t("leavesTitle", "Leave management")}
        description={
          lang === "ar"
            ? "استعراض أرصدة الإجازات المتاحة وتقديم طلبات الإجازة الرسمية."
            : "View your leave balances and request time off."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleExportLeaves} className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground">
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-400" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <Button variant="secondary" onClick={() => openLeaveForm()}>
              <Plus className="size-4 me-1.5" />
              <span>{lang === "ar" ? "طلب إجازة جديد" : "New request"}</span>
            </Button>
          </div>
        }
      />

      <section id="leaves" className="surface-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">{t("leaveBalance", "Leave balances")}</h2>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {balances.map((b) => (
            <li key={b.type} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{lang === "ar" ? (leaveTypeTranslations[b.type] || b.type) : b.type}</span>
                <span className="tabular-nums text-muted-foreground">
                  {lang === "ar" ? `${b.total - b.used} من أصل ${b.total} يوم متبقي` : `${b.total - b.used} of ${b.total} days left`}
                </span>
              </div>
              <Progress value={(b.used / b.total) * 100} className="mt-3 h-1.5" />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4">
        <section className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <h2 className="text-sm font-semibold">{lang === "ar" ? "سجل طلبات الإجازات" : "Leave request history"}</h2>
            <div className="flex items-center gap-2 ms-auto">
              <Button size="sm" variant="outline" onClick={handleExportLeaves} className="h-9 rounded-xl text-xs">
                <FileSpreadsheet className="size-3.5 me-1 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "ar" ? "تصدير" : "Export"}</span>
              </Button>
              <div className="relative min-w-0 flex-1 sm:w-64">
                <Search className="pointer-events-none absolute ltr:left-3 rtl:right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                  placeholder={lang === "ar" ? "البحث في الطلبات..." : "Search requests…"}
                  aria-label="Search requests"
                  className="h-9 rounded-xl ltr:pl-9 rtl:pr-9 text-xs"
                />
              </div>
            </div>
          </div>

          <BulkBar count={selection.count} noun="request" onClear={selection.clear}>
            {canApprove ? (
              <>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkSet("Approved")}>
                  <Check className="size-4" />
                  <span>{t("approved", "Approve")}</span>
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkSet("Rejected")}>
                  <X className="size-4" />
                  <span>{t("rejected", "Reject")}</span>
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => bulkSet("Pending")}>
                  <span>{lang === "ar" ? "إعادة فتح" : "Reopen"}</span>
                </Button>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                {lang === "ar" ? "فقط المديرون يمكنهم اعتماد أو رفض الطلبات." : "Only managers can approve or reject requests."}
              </span>
            )}
          </BulkBar>

          <div className="hidden overflow-x-auto md:block">
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
                  <TableHead>{lang === "ar" ? "الرقم المرجعي" : "Reference"}</TableHead>
                  <TableHead>{t("category", "Type")}</TableHead>
                  <TableHead>{lang === "ar" ? "الفترة" : "Period"}</TableHead>
                  <TableHead>{t("requestDays", "Days")}</TableHead>
                  <TableHead>{lang === "ar" ? "الرصيد" : "Balance"}</TableHead>
                  <TableHead>{t("reason", "Reason")}</TableHead>
                  <TableHead>{t("status", "Status")}</TableHead>
                  <TableHead className="text-end">{lang === "ar" ? "قرار الاعتماد" : "Decision"}</TableHead>
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
                  <TableRow
                    key={r.id}
                    data-deep-link={r.id}
                    data-state={selection.isSelected(r.id) ? "selected" : undefined}
                    className={focusedRequest === r.id ? "bg-brand/5 outline outline-2 -outline-offset-2 outline-brand/50" : undefined}
                  >
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
                    <TableCell className="text-end">
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

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle>Request leave</DialogTitle>
            <DialogDescription>
              Step {leaveStep} of 3 ·{" "}
              {leaveStep === 1
                ? "Choose leave type"
                : leaveStep === 2
                  ? "Pick your dates"
                  : leaveType === "Sick"
                    ? "Add reason & proof"
                    : "Add a reason"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-1.5" aria-hidden>
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  s <= leaveStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="space-y-4">
            {leaveStep === 1 ? (
              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave type</Label>
                <div className="grid gap-2">
                  {balances.map((b) => (
                    <button
                      key={b.type}
                      type="button"
                      onClick={() => setLeaveType(b.type)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                        leaveType === b.type ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                      }`}
                    >
                      <span className="text-sm font-medium">{b.type}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {b.total - b.used} days left
                      </span>
                    </button>
                  ))}
                </div>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="leave-type" className="sr-only">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {balances.map((b) => (
                      <SelectItem key={b.type} value={b.type}>
                        {b.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {leaveStep === 2 ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="leave-from">From</Label>
                  <Input
                    id="leave-from"
                    type="date"
                    className="h-12 rounded-xl"
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="leave-to">To</Label>
                  <Input
                    id="leave-to"
                    type="date"
                    className="h-12 rounded-xl"
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                  />
                </div>
                <p className="rounded-xl border border-border p-3 text-sm text-muted-foreground">
                  {leaveDays > 0
                    ? `${leaveDays} day${leaveDays === 1 ? "" : "s"} of ${leaveType.toLowerCase()} leave`
                    : "Pick a start and end date."}
                </p>
              </div>
            ) : null}

            {leaveStep === 3 ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="leave-reason">Reason</Label>
                  <Textarea
                    id="leave-reason"
                    rows={4}
                    maxLength={280}
                    className="rounded-xl"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Why do you need this leave?"
                  />
                </div>
                {leaveType === "Sick" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="leave-proof">Medical Certificate / Proof (Required)</Label>
                    <Input id="leave-proof" type="file" className="rounded-xl file:mr-2 file:-ml-2 file:h-full file:border-0 file:bg-transparent file:px-4 file:text-sm file:font-medium hover:file:bg-transparent cursor-pointer py-2 h-12" />
                  </div>
                )}
                <div className="rounded-xl border border-border p-3 text-sm">
                  <p className="font-medium">{leaveType} leave</p>
                  <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                    {leaveFrom} → {leaveTo} · {leaveDays} day{leaveDays === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl"
              onClick={() => (leaveStep === 1 ? setLeaveOpen(false) : setLeaveStep((s) => s - 1))}
            >
              {leaveStep === 1 ? "Cancel" : "Back"}
            </Button>
            {leaveStep < 3 ? (
              <Button
                className="h-12 flex-1 rounded-xl"
                disabled={!stepValid(leaveStep)}
                onClick={() => setLeaveStep((s) => s + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button className="h-12 flex-1 rounded-xl" onClick={submitLeave}>
                Submit request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
