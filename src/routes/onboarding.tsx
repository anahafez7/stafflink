import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, UserMinus, Search, CheckCircle2, Circle, Clock, Edit2 } from "lucide-react";
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

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding & Offboarding — StaffLink" },
    ],
  }),
  component: OnboardingPage,
});

const onboardingList = [
  { id: "EMP-2026-081", name: "David Miller", role: "Frontend Developer", dept: "Engineering", type: "Onboarding", date: "Aug 15, 2026", progress: 75, status: "In Progress" },
  { id: "EMP-2026-060", name: "Sarah Connor", role: "Sales Manager", dept: "Sales", type: "Offboarding", date: "Aug 20, 2026", progress: 20, status: "Action Required" },
  { id: "EMP-2026-082", name: "Ahmed Khaled", role: "UX Designer", dept: "Design", type: "Onboarding", date: "Aug 01, 2026", progress: 100, status: "Completed" },
];

function OnboardingPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<"Onboarding" | "Offboarding">("Onboarding");
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleOpenAdd = (type: "Onboarding" | "Offboarding") => {
    setAddType(type);
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section="Workspace"
        title="Onboarding & Offboarding"
        description="Track the lifecycle progress of new hires and departing employees."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleOpenAdd("Offboarding")} className="rounded-full bg-surface border-border/50">
              <UserMinus className="mr-2 size-4" /> Start Offboarding
            </Button>
            <Button onClick={() => handleOpenAdd("Onboarding")} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              <UserPlus className="mr-2 size-4" /> Start Onboarding
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {onboardingList.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/5">
                <TableCell>
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.role}</p>
                  </div>
                </TableCell>
                <TableCell>{item.dept}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    item.type === "Onboarding" ? "bg-info/10 text-info border-0" : "bg-warning/10 text-warning border-0"
                  }>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className={`h-full rounded-full ${item.progress === 100 ? 'bg-success' : 'bg-brand'}`} 
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                    <span className="text-xs font-medium">{item.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    item.status === "Completed" ? "border-success/40 text-success" :
                    item.status === "In Progress" ? "border-info/40 text-info" : "border-destructive/40 text-destructive"
                  }>
                    {item.status === "Completed" && <CheckCircle2 className="mr-1 size-3" />}
                    {item.status === "In Progress" && <Clock className="mr-1 size-3" />}
                    {item.status === "Action Required" && <Circle className="mr-1 size-3 text-destructive fill-destructive/20" />}
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)} className="size-8 text-muted-foreground hover:text-foreground">
                    <Edit2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Start {addType}</SheetTitle>
            <SheetDescription>
              Initiate a new {addType.toLowerCase()} process for an employee.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input placeholder="Search employee..." className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Input value={addType} disabled className="rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input type="date" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign Template</Label>
              <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Standard {addType} Checklist</option>
                <option>Executive {addType} Checklist</option>
                <option>Contractor {addType} Checklist</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Start Process</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Update Progress</SheetTitle>
            <SheetDescription>
              Update the {editingItem?.type.toLowerCase()} status for {editingItem?.name}.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Input defaultValue={editingItem?.name} disabled className="rounded-xl bg-muted opacity-70" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <Input type="number" defaultValue={editingItem?.progress} min="0" max="100" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>In Progress</option>
                  <option>Action Required</option>
                  <option>Completed</option>
                </select>
              </div>
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
