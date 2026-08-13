import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Receipt, CreditCard, Banknote, MapPin, Coffee, Car, Edit2, UploadCloud } from "lucide-react";
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

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expense Claims — StaffLink" },
    ],
  }),
  component: ExpensesPage,
});

const expenses = [
  { id: "EXP-2026-081", employee: "Abanob Vector", category: "Travel", icon: Car, amount: "EGP 1,250", date: "Aug 12, 2026", status: "Pending", receipt: "Attached" },
  { id: "EXP-2026-080", employee: "Ahmed Khaled", category: "Meals", icon: Coffee, amount: "EGP 450", date: "Aug 10, 2026", status: "Approved", receipt: "Attached" },
  { id: "EXP-2026-079", employee: "Sarah Connor", category: "Office Supplies", icon: Receipt, amount: "EGP 3,400", date: "Aug 05, 2026", status: "Rejected", receipt: "Missing" },
];

function ExpensesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section="Workspace"
        title="Expense Claims"
        description="Review and approve employee out-of-pocket expenses."
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-2 size-4" /> Submit Claim
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-xl bg-brand/10 text-brand">
              <Banknote className="size-5" />
            </div>
            <span className="font-medium">Total Pending</span>
          </div>
          <div className="text-3xl font-bold">EGP 1,250</div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-xl bg-success/10 text-success">
              <CreditCard className="size-5" />
            </div>
            <span className="font-medium">Reimbursed This Month</span>
          </div>
          <div className="text-3xl font-bold">EGP 14,300</div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
              <Receipt className="size-5" />
            </div>
            <span className="font-medium">Missing Receipts</span>
          </div>
          <div className="text-3xl font-bold">1</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search claims..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/5">
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.employee}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <expense.icon className="size-4 text-muted-foreground" />
                    <span>{expense.category}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold">{expense.amount}</TableCell>
                <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    expense.receipt === "Attached" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"
                  }>
                    {expense.receipt}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    expense.status === "Approved" ? "border-success/40 text-success" :
                    expense.status === "Pending" ? "border-warning/40 text-warning" : "border-destructive/40 text-destructive"
                  }>
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(expense)} className="size-8 text-muted-foreground hover:text-foreground">
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
            <SheetTitle>Submit Expense Claim</SheetTitle>
            <SheetDescription>
              Create a new out-of-pocket expense for reimbursement.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Travel</option>
                  <option>Meals</option>
                  <option>Office Supplies</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount (EGP)</Label>
                <Input type="number" placeholder="0.00" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="What was this expense for?" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Receipt</Label>
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="size-6" />
                  <span className="text-sm font-medium">Click to upload receipt</span>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Submit Claim</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Review Expense Claim</SheetTitle>
            <SheetDescription>
              Update status for {editingItem?.employee}'s claim ({editingItem?.id}).
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select defaultValue={editingItem?.category} disabled className="flex h-10 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm opacity-70">
                  <option>{editingItem?.category}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input defaultValue={editingItem?.amount} disabled className="rounded-xl bg-muted opacity-70" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Receipt</Label>
              {editingItem?.receipt === "Attached" ? (
                <div className="p-3 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="size-5 text-brand" />
                    <span className="text-sm font-medium">receipt_scan.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">View</Button>
                </div>
              ) : (
                <div className="p-3 border border-border border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                  No receipt attached
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Approval Status</Label>
              <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Save Status</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
