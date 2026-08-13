import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Megaphone, HeartHandshake, FileText, CheckCircle2, Edit2 } from "lucide-react";
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

export const Route = createFileRoute("/engagement")({
  head: () => ({
    meta: [
      { title: "Employee Engagement — StaffLink" },
    ],
  }),
  component: EngagementPage,
});

const engagementItems = [
  { id: "SUR-021", title: "Q3 Employee Satisfaction Pulse", type: "Survey", audience: "All Employees", date: "Aug 12, 2026", status: "Active", responses: "342/500", icon: FileText },
  { id: "ANN-089", title: "New Remote Work Policy Update", type: "Announcement", audience: "Engineering", date: "Aug 10, 2026", status: "Published", responses: "-", icon: Megaphone },
  { id: "EVT-015", title: "Annual Company Retreat 2026", type: "Event", audience: "All Employees", date: "Jul 25, 2026", status: "Completed", responses: "480/500", icon: HeartHandshake },
];

function EngagementPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section="Workspace"
        title="Employee Engagement"
        description="Monitor company culture, run pulse surveys, and broadcast announcements."
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-2 size-4" /> New Campaign
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center items-center text-center h-full">
          <div className="text-muted-foreground font-medium mb-1">Company eNPS</div>
          <div className="text-5xl font-bold text-success mt-2">+42</div>
          <div className="text-xs text-muted-foreground mt-3">Excellent (Top 15% Industry)</div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center items-center text-center h-full">
          <div className="text-muted-foreground font-medium mb-1">Survey Participation</div>
          <div className="text-5xl font-bold text-brand mt-2">86%</div>
          <div className="text-xs text-muted-foreground mt-3">Active across 3 campaigns</div>
        </div>
        <div className="surface-card rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-center items-center text-center h-full">
          <div className="text-muted-foreground font-medium mb-1">Kudos Given (August)</div>
          <div className="text-5xl font-bold text-info mt-2">1,204</div>
          <div className="text-xs text-muted-foreground mt-3">Peer-to-peer recognition</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search campaigns and surveys..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Campaign Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Date Launched</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {engagementItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/5">
                <TableCell className="font-medium text-muted-foreground">{item.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <item.icon className="size-4 text-brand" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-muted-foreground">{item.audience}</TableCell>
                <TableCell className="text-muted-foreground">{item.date}</TableCell>
                <TableCell className="font-medium">{item.responses}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    item.status === "Completed" ? "border-muted-foreground/30 text-muted-foreground" :
                    item.status === "Active" ? "border-success/40 text-success" : "border-brand/40 text-brand"
                  }>
                    {item.status === "Completed" && <CheckCircle2 className="mr-1 size-3" />}
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
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Launch New Campaign</SheetTitle>
            <SheetDescription>
              Create a new survey, announcement, or event for employees.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Campaign Title</Label>
              <Input placeholder="e.g. Q4 Pulse Survey" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Survey</option>
                  <option>Announcement</option>
                  <option>Event</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>All Employees</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Leadership</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message / Description</Label>
              <textarea placeholder="Write your message here..." className="flex min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Launch Campaign</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Campaign</SheetTitle>
            <SheetDescription>
              Update information for {editingItem?.title}.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Campaign Title</Label>
              <Input defaultValue={editingItem?.title} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select defaultValue={editingItem?.type} disabled className="flex h-10 w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm opacity-70">
                  <option>{editingItem?.type}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Draft</option>
                  <option>Active</option>
                  <option>Published</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
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
