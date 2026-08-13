import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, AlertOctagon, Scale, FileText, CheckCircle2, Edit2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/disciplinary")({
  head: () => ({
    meta: [
      { title: "Disciplinary Actions — StaffLink" },
    ],
  }),
  component: DisciplinaryPage,
});

const disciplinaryCases = [
  { id: "CASE-092", employee: "Abanob Vector", type: "Verbal Warning", reason: "Repeated Lateness", date: "Aug 10, 2026", status: "Active", severity: "Low", icon: AlertOctagon },
  { id: "CASE-091", employee: "Ahmed Khaled", type: "PIP", reason: "Performance Below Targets", date: "Jul 25, 2026", status: "In Progress", severity: "High", icon: Scale },
  { id: "CASE-089", employee: "Sarah Connor", type: "Written Warning", reason: "Policy Violation", date: "May 12, 2026", status: "Resolved", severity: "Medium", icon: FileText },
];

function DisciplinaryPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section="Workspace"
        title="Disciplinary Actions"
        description="Manage HR cases, warnings, and performance improvement plans."
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-2 size-4" /> Log New Case
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search cases by employee or ID..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Date Logged</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplinaryCases.map((caseItem) => (
              <TableRow key={caseItem.id} className="hover:bg-muted/5">
                <TableCell className="font-medium">{caseItem.id}</TableCell>
                <TableCell>{caseItem.employee}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <caseItem.icon className="size-4 text-muted-foreground" />
                    <span>{caseItem.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{caseItem.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    caseItem.severity === "High" ? "border-destructive/40 text-destructive" :
                    caseItem.severity === "Medium" ? "border-warning/40 text-warning" : "border-info/40 text-info"
                  }>
                    {caseItem.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{caseItem.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    caseItem.status === "Resolved" ? "bg-success/10 text-success border-0" : 
                    caseItem.status === "Active" ? "bg-destructive/10 text-destructive border-0" : "bg-warning/10 text-warning border-0"
                  }>
                    {caseItem.status === "Resolved" && <CheckCircle2 className="mr-1 size-3" />}
                    {caseItem.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(caseItem)} className="size-8 text-muted-foreground hover:text-foreground">
                    <Edit2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Log New Case</SheetTitle>
            <SheetDescription>
              Record a new disciplinary action, warning, or performance plan.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input placeholder="Search employee..." className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action Type</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Verbal Warning</option>
                  <option>Written Warning</option>
                  <option>PIP</option>
                  <option>Termination</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason / Description</Label>
              <textarea placeholder="Provide details about the incident..." className="flex min-h-[100px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Log Case</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Update Case</SheetTitle>
            <SheetDescription>
              Manage status and resolution for {editingItem?.id}.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input defaultValue={editingItem?.employee} disabled className="rounded-xl bg-muted opacity-70" />
            </div>
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Input defaultValue={editingItem?.type} disabled className="rounded-xl bg-muted opacity-70" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Active</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Resolution Notes</Label>
              <textarea placeholder="Add notes on how this was resolved..." className="flex min-h-[100px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Save Updates</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
