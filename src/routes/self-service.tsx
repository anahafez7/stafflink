import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock, Download, FileText, Megaphone, Plus, Search, Wallet, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { BulkBar } from "@/components/data/bulk-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelection } from "@/hooks/use-selection";
import { announcements, leaveBalances, myRequests, payslips } from "@/data/modules";

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

function SelfServicePage() {
  const [requests, setRequests] = useState(myRequests);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return requests;
    return requests.filter((r) => {
      const haystack = [r.id, r.type, r.period, r.status].join(" ").toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [requests, query]);

  const ids = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const selection = useSelection(ids);

  const bulkSet = (status: string) => {
    const count = selection.count;
    setRequests((prev) => prev.map((r) => (selection.isSelected(r.id) ? { ...r, status } : r)));
    selection.clear();
    toast.success(`${count} request${count === 1 ? "" : "s"} ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section="Self Service"
        title="Employee self service"
        description="Everything an employee needs, in three clicks or fewer."
        actions={
          <Button variant="secondary" onClick={() => toast.info("Pick a request type below to submit in seconds.")}>
            <Plus className="size-4" />
            <span>New request</span>
          </Button>
        }
      />

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

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <h2 className="text-sm font-semibold">My requests</h2>
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
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
                    <TableCell className="text-sm text-muted-foreground">{r.period}</TableCell>
                    <TableCell className="text-sm tabular-nums">{r.days || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Leave balances</h2>
          <ul className="mt-4 space-y-4">
            {leaveBalances.map((b) => (
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
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
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
      </div>
    </div>
  );
}
