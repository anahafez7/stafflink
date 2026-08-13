import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, BookOpen, Video, ShieldCheck, GraduationCap, CheckCircle2, Edit2 } from "lucide-react";
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

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training & LMS — StaffLink" },
    ],
  }),
  component: TrainingPage,
});

const courses = [
  { id: "TRN-101", title: "Information Security Basics", type: "Compliance", format: "Video", date: "Aug 15, 2026", duration: "1h 30m", mandatory: true, icon: ShieldCheck, status: "Published" },
  { id: "TRN-102", title: "Advanced React Patterns", type: "Technical", format: "Interactive", date: "Aug 10, 2026", duration: "4h 00m", mandatory: false, icon: BookOpen, status: "Published" },
  { id: "TRN-103", title: "Workplace Harassment Policy", type: "Compliance", format: "Document", date: "Aug 01, 2026", duration: "45m", mandatory: true, icon: GraduationCap, status: "Draft" },
];

function TrainingPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section="Workspace"
        title="Training & LMS"
        description="Manage the course catalog, mandatory compliance training, and certifications."
        actions={
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-2 size-4" /> Create Course
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search course catalog..." className="pl-9 bg-surface rounded-full border-border/50" />
        </div>
      </div>

      <div className="surface-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead>Course ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Mandatory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/5">
                <TableCell className="font-medium text-muted-foreground">{course.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <course.icon className="size-4 text-brand" />
                    <span className="font-medium">{course.title}</span>
                  </div>
                </TableCell>
                <TableCell>{course.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {course.format === "Video" ? <Video className="size-3.5" /> : <BookOpen className="size-3.5" />}
                    <span>{course.format}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{course.duration}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={course.mandatory ? "border-destructive/40 text-destructive" : "border-muted-foreground/30 text-muted-foreground"}>
                    {course.mandatory ? "Required" : "Optional"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    course.status === "Published" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"
                  }>
                    {course.status === "Published" && <CheckCircle2 className="mr-1 size-3" />}
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(course)} className="size-8 text-muted-foreground hover:text-foreground">
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
            <SheetTitle>Create Course</SheetTitle>
            <SheetDescription>
              Add a new training module or compliance course to the LMS.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input placeholder="e.g. Data Privacy 101" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Compliance</option>
                  <option>Technical</option>
                  <option>Soft Skills</option>
                  <option>Leadership</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Video</option>
                  <option>Interactive</option>
                  <option>Document</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (Optional)</Label>
                <Input placeholder="e.g. 2h 30m" className="rounded-xl" />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input type="checkbox" className="size-4 rounded border-border" />
                  <span className="text-sm font-medium">Mandatory</span>
                </label>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Publish Course</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Course</SheetTitle>
            <SheetDescription>
              Update course details and publish status.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input defaultValue={editingItem?.title} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select defaultValue={editingItem?.type} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Compliance</option>
                  <option>Technical</option>
                  <option>Soft Skills</option>
                  <option>Leadership</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <select defaultValue={editingItem?.format} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Video</option>
                  <option>Interactive</option>
                  <option>Document</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select defaultValue={editingItem?.status} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
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
