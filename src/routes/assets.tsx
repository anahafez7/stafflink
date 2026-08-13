import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Laptop, Monitor, Smartphone, CheckCircle2, Wrench, Search, Plus, Edit2 } from "lucide-react";
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

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset Management — StaffLink" },
    ],
  }),
  component: AssetsPage,
});

const assets = [
  { id: "AST-001", name: "MacBook Pro 16", type: "Laptop", status: "Assigned", assignedTo: "Abanob Vector", date: "Jan 10, 2026", icon: Laptop },
  { id: "AST-002", name: "Dell UltraSharp 27", type: "Monitor", status: "Available", assignedTo: "-", date: "-", icon: Monitor },
  { id: "AST-003", name: "iPhone 15 Pro", type: "Phone", status: "In Repair", assignedTo: "Ahmed Khaled", date: "Feb 05, 2026", icon: Smartphone },
];

function AssetsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section="Workspace"
        title="Asset Management"
        description="Track and manage company equipment and software licenses."
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-2 size-4" /> Add Asset
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search assets..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-muted/5">
                <TableCell className="font-medium">{asset.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <asset.icon className="size-4 text-muted-foreground" />
                    <span>{asset.name}</span>
                  </div>
                </TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    asset.status === "Assigned" ? "border-success/40 text-success" :
                    asset.status === "Available" ? "border-brand/40 text-brand" : "border-warning/40 text-warning"
                  }>
                    {asset.status === "Assigned" && <CheckCircle2 className="mr-1 size-3" />}
                    {asset.status === "In Repair" && <Wrench className="mr-1 size-3" />}
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{asset.assignedTo}</TableCell>
                <TableCell className="text-muted-foreground">{asset.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(asset)} className="size-8 text-muted-foreground hover:text-foreground">
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
            <SheetTitle>Add New Asset</SheetTitle>
            <SheetDescription>
              Register a new piece of equipment into the inventory.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Asset Name / Model</Label>
              <Input placeholder="e.g. MacBook Pro 16" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Laptop</option>
                  <option>Monitor</option>
                  <option>Phone</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Available</option>
                  <option>Assigned</option>
                  <option>In Repair</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input placeholder="Employee name" className="rounded-xl" />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Add Asset</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Asset</SheetTitle>
            <SheetDescription>
              Update information for {editingItem?.name}.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Asset Name / Model</Label>
              <Input defaultValue={editingItem?.name} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select defaultValue={editingItem?.type} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Laptop</option>
                  <option>Monitor</option>
                  <option>Phone</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Available</option>
                  <option>Assigned</option>
                  <option>In Repair</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input defaultValue={editingItem?.assignedTo !== "-" ? editingItem?.assignedTo : ""} placeholder="Employee name" className="rounded-xl" />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setEditingItem(null)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
